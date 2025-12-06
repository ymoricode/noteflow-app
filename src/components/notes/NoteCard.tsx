'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Note } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, Archive, ArchiveRestore } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { NoteForm } from './NoteForm'

interface NoteCardProps {
  note: Note
}

export function NoteCard({ note }: NoteCardProps) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notes').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const toggleArchive = useMutation({
    mutationFn: async ({ id, isArchived }: { id: string; isArchived: boolean }) => {
      const { error } = await supabase
        .from('notes')
        .update({ is_archived: !isArchived })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const handleDelete = () => {
    if (confirm(`Hapus catatan "${note.title}"?`)) {
      deleteNote.mutate(note.id)
    }
  }

  const handleToggleArchive = () => {
    toggleArchive.mutate({ id: note.id, isArchived: note.is_archived })
  }

  return (
    <Card className={`${note.is_archived ? 'opacity-60' : ''} hover:shadow-lg transition-shadow`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{note.title}</CardTitle>
          <div className="flex gap-1">
            <NoteForm note={note} />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleArchive}
              disabled={toggleArchive.isPending}
              className="h-8 w-8"
            >
              {note.is_archived ? (
                <ArchiveRestore className="h-4 w-4 text-blue-600" />
              ) : (
                <Archive className="h-4 w-4 text-gray-600" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={deleteNote.isPending}
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500">{formatDate(note.created_at)}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-6">
          {note.content || 'Tidak ada isi catatan'}
        </p>
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
