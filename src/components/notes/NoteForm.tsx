'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, X } from 'lucide-react'
import { Note } from '@/types'

interface NoteFormProps {
  note?: Note
  onSuccess?: () => void
}

export function NoteForm({ note, onSuccess }: NoteFormProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const supabase = createClient()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content || '')
      setTags(note.tags || [])
    }
  }, [note])

  const saveNote = useMutation({
    mutationFn: async (data: {
      title: string
      content: string
      tags: string[]
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (note) {
        // Update existing note
        const { data: result, error } = await supabase
          .from('notes')
          .update(data)
          .eq('id', note.id)
          .select()

        if (error) throw error
        return result
      } else {
        // Create new note
        const { data: result, error } = await supabase
          .from('notes')
          .insert({
            ...data,
            user_id: user.id,
          })
          .select()

        if (error) throw error
        return result
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      // Reset form
      setTitle('')
      setContent('')
      setTags([])
      setTagInput('')
      setOpen(false)
      onSuccess?.()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveNote.mutate({
      title,
      content,
      tags,
    })
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {note ? (
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Buat Catatan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{note ? 'Edit Catatan' : 'Buat Catatan Baru'}</DialogTitle>
          <DialogDescription>
            {note ? 'Ubah catatan Anda di sini.' : 'Catat ide dan pemikiran Anda di sini.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              placeholder="Judul catatan..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Isi Catatan</Label>
            <Textarea
              id="content"
              placeholder="Tulis catatan Anda di sini..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tag</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Tambah tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Tambah
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={saveNote.isPending}
              className="flex-1"
            >
              {saveNote.isPending ? 'Menyimpan...' : note ? 'Update' : 'Simpan'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
          </div>

          {saveNote.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              Error: {(saveNote.error as Error).message}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
