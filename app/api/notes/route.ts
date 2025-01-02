import { NextResponse } from 'next/server'
import { db } from '@/db/drizzle'
import { notes } from '@/db/schema'

export async function POST(request: Request) {
  try {
    const { title, description, drawing } = await request.json()
    console.log('Received data:', { title, description, drawing }) // Add this line to debug
    const newNote = await db.insert(notes).values({ title, description, drawing }).returning()
    return NextResponse.json(newNote[0], { status: 201 })
  } catch (error) {
    console.error('Failed to create note:', error)
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const allNotes = await db.select().from(notes)
    return NextResponse.json(allNotes)
  } catch (error) {
    console.error('Failed to fetch notes:', error)
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

