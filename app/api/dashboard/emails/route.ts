import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

interface CapturedEmail {
  id: string
  filename: string
  to: string
  subject: string
  from: string
  capturedAt: string
  size: number
  preview: string
}

export async function GET() {
  try {
    const emailDir = join(process.cwd(), 'dev-emails')
    
    // Check if directory exists
    try {
      statSync(emailDir)
    } catch {
      return NextResponse.json({ emails: [] })
    }

    const files = readdirSync(emailDir)
      .filter(f => f.endsWith('.html'))
      .sort((a, b) => {
        const statA = statSync(join(emailDir, a))
        const statB = statSync(join(emailDir, b))
        return statB.mtime.getTime() - statA.mtime.getTime()
      })

    const emails: CapturedEmail[] = []

    for (const file of files.slice(0, 50)) { // Limit to 50 most recent
      try {
        const filepath = join(emailDir, file)
        const content = readFileSync(filepath, 'utf8')
        const stats = statSync(filepath)
        
        // Parse email details from filename and content
        const toMatch = file.match(/-(\w+)-at-([\w.-]+)\.html$/)
        const to = toMatch ? `${toMatch[1]}@${toMatch[2]}` : 'unknown'
        
        // Extract subject from HTML
        const subjectMatch = content.match(/<title>Dev Email: ([^<]+)<\/title>/)
        const subject = subjectMatch ? subjectMatch[1] : 'No Subject'
        
        // Extract from address
        const fromMatch = content.match(/<strong>From:<\/strong>\s*([^<]+)</)
        const from = fromMatch ? fromMatch[1].trim() : 'Unknown'
        
        // Extract preview text (first 150 chars of content)
        const contentMatch = content.match(/<div class="content">(.*?)<\/div>/s)
        let preview = 'No content'
        if (contentMatch) {
          preview = contentMatch[1]
            .replace(/<[^>]*>/g, '') // Strip HTML tags
            .trim()
            .substring(0, 150)
            .replace(/\s+/g, ' ')
        }

        emails.push({
          id: file,
          filename: file,
          to,
          subject,
          from,
          capturedAt: stats.mtime.toISOString(),
          size: stats.size,
          preview,
        })
      } catch (err) {
        console.error(`Error parsing email file ${file}:`, err)
      }
    }

    return NextResponse.json({ emails })
  } catch (error) {
    console.error('Error listing captured emails:', error)
    return NextResponse.json(
      { error: 'Failed to list emails' },
      { status: 500 }
    )
  }
}