// Development email capture - saves emails to files instead of sending
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

type Email = {
  from: { name?: string; email: string }
  to: string
  subject: string
  text?: string
  html?: string
  headers?: Record<string, string>
}

export async function captureEmailForDev(email: Email) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `email-${timestamp}-${email.to.replace('@', '-at-').replace(/[^\w.-]/g, '')}.html`
  
  // Create dev-emails directory if it doesn't exist
  const emailDir = join(process.cwd(), 'dev-emails')
  try {
    mkdirSync(emailDir, { recursive: true })
  } catch {}

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Dev Email: ${email.subject}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .content { border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>📧 Development Email Capture</h2>
        <p><strong>From:</strong> ${email.from.name || ''} &lt;${email.from.email}&gt;</p>
        <p><strong>To:</strong> ${email.to}</p>
        <p><strong>Subject:</strong> ${email.subject}</p>
        <p><strong>Captured:</strong> ${new Date().toLocaleString()}</p>
    </div>
    <div class="content">
        ${email.html || `<pre>${email.text || '(no content)'}</pre>`}
    </div>
</body>
</html>`

  writeFileSync(join(emailDir, filename), emailHtml)
  console.log(`📧 Email captured: ${filename}`)
  console.log(`   View at: file://${join(emailDir, filename)}`)
  
  return { messageId: `dev-${timestamp}` }
}