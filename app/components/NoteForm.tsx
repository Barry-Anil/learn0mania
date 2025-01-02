// components/NoteForm.tsx
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import DrawingCanvas from './DrawingCanvas'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from '@/hooks/use-toast'

interface NoteFormProps {
  initialTitle?: string
  initialDescription?: string
  initialDrawing?: string
  isEditing?: boolean
  noteId?: number
}

export default function NoteForm({
  initialTitle = '',
  initialDescription = '',
  initialDrawing = '',
  isEditing = false,
  noteId,
}: NoteFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [drawing, setDrawing] = useState(initialDrawing)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const url = isEditing ? `/api/notes/${noteId}` : '/api/notes'
    const method = isEditing ? 'PUT' : 'POST'
    const formData = { title, description, drawing: drawing || null}
    console.log('Sending data:', formData) // Add this line to debug

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, drawing }),
      })

      if (response.ok) {
        toast({
          title: isEditing ? "Note updated!" : "Note created!",
          description: isEditing 
            ? "Your note has been successfully updated."
            : "Your new note has been created.",
          variant: "default",
        })
        router.push(isEditing ? `/notes/${noteId}` : '/')
        router.refresh()
      } else {
        throw new Error('Failed to save note')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the note. Please try again.",
        variant: "destructive",
      })
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader className="pb-4">
          <CardTitle>{isEditing ? 'Edit Note' : 'Create New Note'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="text-sm font-medium text-gray-700 mb-1 block">
                  Title
                </label>
                <Input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter note title..."
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1 block">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  disabled={isSubmitting}
                  placeholder="Enter note description..."
                  className="w-full min-h-[120px]"
                />
              </div>
            </div>
            
            <div>

              <DrawingCanvas onSave={setDrawing} initialDrawing={drawing} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between sm:justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update Note' : 'Create Note'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}