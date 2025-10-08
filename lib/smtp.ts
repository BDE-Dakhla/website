import crypto from 'node:crypto'
import net from 'node:net'
import tls from 'node:tls'
import { SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_SECURE, SMTP_USER } from './env'

type Email = {
  from: { name?: string; email: string }
  to: string
  subject: string
  text?: string
  html?: string
  headers?: Record<string, string>
}

function toBase64(str: string) {
  return Buffer.from(str, 'utf8').toString('base64')
}

function encodeSubject(subject: string) {
  return `=?UTF-8?B?${toBase64(subject)}?=`
}

function formatAddress({ name, email }: { name?: string; email: string }) {
  return name ? `"${name.replace(/"/g, '\\"')}" <${email}>` : `<${email}>`
}

function crlf(str: string) {
  return str.replace(/\r?\n/g, '\r\n')
}

function buildMessage(e: Email, messageId: string) {
  const boundary = `b${crypto.randomBytes(12).toString('hex')}`
  const headers: string[] = []
  headers.push(`From: ${formatAddress(e.from)}`)
  headers.push(`To: <${e.to}>`)
  headers.push(`Subject: ${encodeSubject(e.subject)}`)
  headers.push(`Message-ID: <${messageId}>`)
  headers.push(`Date: ${new Date().toUTCString()}`)
  headers.push(`MIME-Version: 1.0`)
  if (e.headers) {
    for (const [k, v] of Object.entries(e.headers)) headers.push(`${k}: ${v}`)
  }

  let body = ''
  if (e.html && e.text) {
    headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`)
    body += `--${boundary}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${crlf(e.text)}\r\n`
    body += `--${boundary}\r\nContent-Type: text/html; charset=utf-8\r\n\r\n${crlf(e.html)}\r\n`
    body += `--${boundary}--\r\n`
  } else if (e.html) {
    headers.push(`Content-Type: text/html; charset=utf-8`)
    body += `${crlf(e.html)}\r\n`
  } else if (e.text) {
    headers.push(`Content-Type: text/plain; charset=utf-8`)
    body += `${crlf(e.text)}\r\n`
  } else {
    headers.push(`Content-Type: text/plain; charset=utf-8`)
    body += '\r\n'
  }

  return `${headers.join('\r\n')}\r\n\r\n${body}`
}

function createMessageId(fromEmail: string) {
  const domain = fromEmail.split('@')[1] || 'localhost'
  const id = crypto.randomBytes(12).toString('hex')
  return `${id}.${Date.now()}@${domain}`
}

// Minimal SMTP client (EHLO, optional STARTTLS, AUTH PLAIN)
export async function sendSmtpMail(e: Email) {
  const host = SMTP_HOST()
  const port = SMTP_PORT()
  const secure = SMTP_SECURE()
  const user = SMTP_USER()
  const pass = SMTP_PASS()

  const messageId = createMessageId(e.from.email)
  const raw = buildMessage(e, messageId)

  const socket = await new Promise<net.Socket>((resolve, reject) => {
    const s = net.createConnection({ host, port, timeout: 10000 }, () => resolve(s))
    s.on('error', reject)
    s.on('timeout', () => reject(new Error(`SMTP connection timeout to ${host}:${port}`)))
    // Overall timeout for connection
    setTimeout(() => reject(new Error(`SMTP connection timeout to ${host}:${port}`)), 10000)
  })

  let tlsSocket: tls.TLSSocket | null = null
  let writer: net.Socket | tls.TLSSocket = socket
  let buffer = ''

  function send(cmd: string) {
    writer.write(`${cmd}\r\n`)
  }
  function readLine(): Promise<string> {
    return new Promise((resolve, reject) => {
      // Check if there's already a complete line in the buffer
      const idx = buffer.indexOf('\r\n')
      if (idx !== -1) {
        const line = buffer.slice(0, idx)
        buffer = buffer.slice(idx + 2)
        resolve(line)
        return
      }
      
      const timeout = setTimeout(() => {
        cleanup()
        reject(new Error('SMTP read timeout'))
      }, 10000)
      
      const onData = (chunk: Buffer) => {
        buffer += chunk.toString('utf8')
        const idx = buffer.indexOf('\r\n')
        if (idx !== -1) {
          const line = buffer.slice(0, idx)
          buffer = buffer.slice(idx + 2)
          cleanup()
          resolve(line)
        }
      }
      const onError = (err: Error) => {
        cleanup()
        reject(err)
      }
      function cleanup() {
        clearTimeout(timeout)
        writer.off('data', onData)
        writer.off('error', onError)
      }
      writer.on('data', onData)
      writer.on('error', onError)
    })
  }

  // read greeting
  await readLine()

  send(`EHLO localhost`)
  let line = await readLine()
  let starttlsAvailable = false
  // consume EHLO multi-line if any
  while (line.startsWith('250-')) {
    if (line.toUpperCase().includes('STARTTLS')) {
      starttlsAvailable = true
    }
    line = await readLine()
  }

  if (!secure && starttlsAvailable) {
    // try STARTTLS if server supports it (best effort)
    try {
      send('STARTTLS')
      const res = await readLine()
      if (res.startsWith('220')) {
        tlsSocket = tls.connect({ socket, servername: host, timeout: 5000 })
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('TLS handshake timeout')), 5000)
          tlsSocket?.once('secureConnect', () => {
            clearTimeout(timeout)
            resolve()
          })
          tlsSocket?.once('error', (err) => {
            clearTimeout(timeout)
            reject(err)
          })
        })
        writer = tlsSocket
        // re-EHLO
        send('EHLO localhost')
        line = await readLine()
        while (line.startsWith('250-')) {
          line = await readLine()
        }
      }
    } catch (err) {
      console.warn('STARTTLS failed, continuing without TLS:', err)
      // Continue without TLS
    }
  }

  if (user && pass) {
    const authStr = Buffer.from(`\0${user}\0${pass}`).toString('base64')
    send(`AUTH PLAIN ${authStr}`)
    const authRes = await readLine()
    if (!authRes.startsWith('235'))
      throw new Error(`SMTP auth failed: ${authRes}`)
  }

  send(`MAIL FROM:<${e.from.email}>`)
  let res = await readLine()
  if (!res.startsWith('250')) throw new Error(`MAIL FROM failed: ${res}`)

  send(`RCPT TO:<${e.to}>`)
  res = await readLine()
  if (!res.startsWith('250') && !res.startsWith('251'))
    throw new Error(`RCPT TO failed: ${res}`)

  send('DATA')
  res = await readLine()
  if (!res.startsWith('354')) throw new Error(`DATA not accepted: ${res}`)

  // Message is already properly formatted with \r\n, just send it
  writer.write(raw)
  writer.write('\r\n.\r\n')
  res = await readLine()
  if (!res.startsWith('250')) throw new Error(`Message not accepted: ${res}`)

  send('QUIT')
  try {
    await readLine()
  } catch {}

  writer.destroy()

  return { messageId }
}
