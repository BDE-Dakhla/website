import { type NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const db = getDb()
    
    const subscribers = await db
      .selectFrom('subscribers')
      .selectAll()
      .orderBy('created_at', 'desc')
      .execute()

    return NextResponse.json({ subscribers })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Subscriber ID is required' },
        { status: 400 }
      )
    }

    const db = getDb()
    
    // Vérifier que l'abonné existe
    const subscriber = await db
      .selectFrom('subscribers')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      )
    }

    // Supprimer l'abonné
    await db
      .deleteFrom('subscribers')
      .where('id', '=', id)
      .execute()

    return NextResponse.json({ 
      success: true, 
      message: 'Subscriber deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting subscriber:', error)
    return NextResponse.json(
      { error: 'Failed to delete subscriber' },
      { status: 500 }
    )
  }
}
