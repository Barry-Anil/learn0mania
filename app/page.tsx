import Link from 'next/link'
import NoteCard from './components/NoteCard'
import { db } from '@/db/drizzle'
import { notes } from '@/db/schema'
import { PlusCircle } from 'lucide-react'

export default async function Home() {
  const allNotes = await db.select().from(notes)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
        <Link
          href="/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Create New Note
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allNotes.map((note) => (
          <NoteCard
            key={note.id}
            id={note.id}
            title={note.title || ''}
            description={note.description || ''}
            drawing={note.drawing || ''}
          />
        ))}
      </div>
    </div>
  )
}

