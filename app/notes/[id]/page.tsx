'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Note {
  id: number
  title: string
  description: string
  drawing?: string | null
}

export default function NotePage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const [note, setNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/notes/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch note')
        }
        const data = await response.json()
        setNote(data)
      } catch (error) {
        console.error('Error:', error)
        toast({
          title: "Error",
          description: "Failed to fetch the note. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchNote()
    }
  }, [params.id, toast])

  const handleDelete = async () => {
    if (!note?.id) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Note deleted",
          description: "Your note has been successfully deleted.",
          variant: "default",
        })
        router.push('/')
        router.refresh()
      } else {
        throw new Error('Failed to delete note')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to delete the note. Please try again.",
        variant: "destructive",
      })
    }
    setIsDeleting(false)
  }

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!note) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Note not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-gray-700">{note.description}</p>
        {note.drawing && (
          <div className="relative w-full h-64">
            <Image
              src={note.drawing}
              alt={`Drawing for ${note.title}`}
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/notes/${note.id}/edit`}>
          <Button variant="outline">
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </Link>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </CardFooter>
    </Card>
  )
}