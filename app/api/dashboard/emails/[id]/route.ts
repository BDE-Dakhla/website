import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const emailDir = join(process.cwd(), 'dev-emails')
    const filename = decodeURIComponent(params.id)
    
    // Security check: ensure filename is safe
    if (filename.includes('..') || filename.includes('/') || !filename.endsWith('.html')) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      )
    }

    const filepath = join(emailDir, filename)
    
    try {
      const content = readFileSync(filepath, 'utf8')
      const stats = statSync(filepath)
      
      return NextResponse.json({
        id: filename,
        content,
        size: stats.size,
        modifiedAt: stats.mtime.toISOString(),
      })
    } catch (err) {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error reading email:', error)
    return NextResponse.json(
      { error: 'Failed to read email' },
      { status: 500 }
    )
  }
}