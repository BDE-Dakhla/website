import { NextResponse } from 'next/server'
import { getMockInboxEmails, markEmailAsRead, toggleEmailImportant } from '@/lib/inbox-mock'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const emails = getMockInboxEmails()
    return NextResponse.json({ emails })
  } catch (error) {
    console.error('Error fetching inbox emails:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inbox emails' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { emailId, action } = body

    if (!emailId || !action) {
      return NextResponse.json(
        { error: 'Missing emailId or action' },
        { status: 400 }
      )
    }

    let result = false
    switch (action) {
      case 'markRead':
        result = markEmailAsRead(emailId)
        break
      case 'toggleImportant':
        result = toggleEmailImportant(emailId)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    if (result !== false) {
      return NextResponse.json({ success: true, result })
    } else {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error updating email:', error)
    return NextResponse.json(
      { error: 'Failed to update email' },
      { status: 500 }
    )
  }
}