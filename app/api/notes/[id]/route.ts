import { NextResponse } from 'next/server'
import { db } from '@/db/drizzle'
import { notes } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json({ error: 'Note ID is required' }, { status: 400 })
  }

  try {
    const noteId = parseInt(params.id)
    if (isNaN(noteId)) {
      return NextResponse.json({ error: 'Invalid note ID' }, { status: 400 })
    }

    const note = await db.select().from(notes).where(eq(notes.id, noteId)).limit(1)
    if (note.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }
    return NextResponse.json(note[0])
  } catch (error) {
    console.error('Failed to fetch note:', error)
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 })
  }
}

export async function PUT(
  request: Request, 
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json({ error: 'Note ID is required' }, { status: 400 })
  }

  try {
    const noteId = parseInt(params.id)
    if (isNaN(noteId)) {
      return NextResponse.json({ error: 'Invalid note ID' }, { status: 400 })
    }

    const { title, description, drawing } = await request.json()
    const updatedNote = await db.update(notes)
      .set({ title, description, drawing, updatedAt: new Date() })
      .where(eq(notes.id, noteId))
      .returning()
    
    if (updatedNote.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }
    return NextResponse.json(updatedNote[0])
  } catch (error) {
    console.error('Failed to update note:', error)
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request, 
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json({ error: 'Note ID is required' }, { status: 400 })
  }

  try {
    const noteId = parseInt(params.id)
    if (isNaN(noteId)) {
      return NextResponse.json({ error: 'Invalid note ID' }, { status: 400 })
    }

    const deletedNote = await db.delete(notes)
      .where(eq(notes.id, noteId))
      .returning()
    
    if (deletedNote.length === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Note deleted successfully' })
  } catch (error) {
    console.error('Failed to delete note:', error)
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
  }
}