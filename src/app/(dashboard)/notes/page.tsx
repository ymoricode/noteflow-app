'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { NoteForm } from '@/components/notes/NoteForm'
import { NoteCard } from '@/components/notes/NoteCard'
import { Search, Archive } from 'lucide-react'
import type { Note } from '@/types'

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const supabase = createClient()

  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Note[]
    },
  })

  const filteredNotes = notes?.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesArchive = showArchived ? note.is_archived : !note.is_archived

    return matchesSearch && matchesArchive
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat catatan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Catatan</h1>
          <p className="text-gray-600 mt-2">Kelola catatan dan ide Anda</p>
        </div>
        <NoteForm />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari catatan, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={showArchived ? 'default' : 'outline'}
          onClick={() => setShowArchived(!showArchived)}
          className="gap-2"
        >
          <Archive className="h-4 w-4" />
          {showArchived ? 'Lihat Aktif' : 'Lihat Arsip'}
        </Button>
      </div>

      {/* Notes Grid */}
      {filteredNotes && filteredNotes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-lg border text-center">
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery
              ? 'Tidak ada catatan yang cocok'
              : showArchived
              ? 'Belum ada catatan yang diarsipkan'
              : 'Belum ada catatan'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? 'Coba kata kunci lain'
              : showArchived
              ? 'Arsipkan catatan untuk menyimpannya di sini'
              : 'Buat catatan pertama Anda sekarang!'}
          </p>
          {!searchQuery && !showArchived && <NoteForm />}
        </div>
      )}

      {/* Stats */}
      {notes && notes.length > 0 && (
        <div className="flex gap-4 text-sm text-gray-600">
          <span>
            Total: <strong>{notes.length}</strong> catatan
          </span>
          <span>
            Aktif: <strong>{notes.filter((n) => !n.is_archived).length}</strong>
          </span>
          <span>
            Arsip: <strong>{notes.filter((n) => n.is_archived).length}</strong>
          </span>
        </div>
      )}
    </div>
  )
}
