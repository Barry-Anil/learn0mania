import { db } from '@/db/drizzle'
import { notes } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import NoteForm from '@/app/components/NoteForm'

interface EditNotePageProps {
  params: { id: string }
}

export default async function EditNotePage({ params }: EditNotePageProps) {
  if (!params.id) {
    notFound()
  }

  const noteId = parseInt(params.id)
  if (isNaN(noteId)) {
    notFound()
  }

  const note = await db.select().from(notes).where(eq(notes.id, noteId)).limit(1)

  if (note.length === 0) {
    notFound()
  }

  const { id, title, description, drawing } = note[0]

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Edit Note</h1>
      <NoteForm
        initialTitle={title ?? undefined}
        initialDescription={description ?? undefined}
        initialDrawing={drawing ?? undefined}
        isEditing={true}
        noteId={id}
      />
    </div>
  )
}