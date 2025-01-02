import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface NoteCardProps {
  id: number
  title: string
  description: string
  drawing?: string
}

export default function NoteCard({ id, title, description, drawing }: NoteCardProps) {
  return (
    <Link href={`/notes/${id}`} className="block">
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </CardContent>
        <CardFooter>
          {drawing && (
            <div className="relative w-full h-32">
              <Image
                src={drawing}
                alt={`Drawing for ${title}`}
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}

