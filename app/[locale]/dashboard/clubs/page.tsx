'use client'

import type { Club } from '@/types/schema'
import { Edit, Globe, MoreHorizontal, Plus, Trash2, Users } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'
import {
  ClubFormDialog,
  DeleteClubDialog,
} from '@/components/clubs/club-dialogs'
import Image from '@/components/layout/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetcher, getClubImageUrl } from '@/lib/utils'

type ClubFormData = {
  name: string
  description: string
  category: string
  hasInternationalGroup: boolean
  memberCount: number
  imageUrl?: string
}

export default function ClubsPage() {
  const [editingClub, setEditingClub] = useState<Club | undefined>()
  const [deletingClub, setDeletingClub] = useState<Club | undefined>()
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [_isDeleting, setIsDeleting] = useState(false)

  const { data: clubs = [], mutate } = useSWR<Club[]>('/api/clubs', fetcher)

  const handleCreateClub = async (data: ClubFormData) => {
    try {
      const response = await fetch('/api/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create club')
      }

      toast.success('Club created successfully!')
      mutate()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create club',
      )
      throw error
    }
  }

  const handleUpdateClub = async (data: ClubFormData) => {
    if (!editingClub) return

    try {
      const response = await fetch(`/api/clubs/${editingClub.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update club')
      }

      toast.success('Club updated successfully!')
      mutate()
      setEditingClub(undefined)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update club',
      )
      throw error
    }
  }

  const handleDeleteClub = async () => {
    if (!deletingClub) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/clubs/${deletingClub.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete club')
      }

      toast.success('Club deleted successfully!')
      mutate()
      setDeletingClub(undefined)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete club',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-bold text-3xl tracking-tight'>
            Clubs Management
          </h1>
          <p className='text-muted-foreground'>
            Manage student clubs and their information
          </p>
        </div>
        <Button onClick={() => setFormDialogOpen(true)}>
          <Plus className='mr-2 h-4 w-4' />
          Add Club
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Clubs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>International</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className='w-[70px]'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clubs.map((club) => (
                <TableRow key={club.id}>
                  <TableCell>
                    {club.imageUrl ? (
                      <Image
                        alt={`${club.name} logo`}
                        className='h-10 w-10 rounded-lg object-cover'
                        height={40}
                        src={getClubImageUrl(club.imageUrl)}
                        width={40}
                      />
                    ) : (
                      <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-muted'>
                        <Users className='h-5 w-5 text-muted-foreground' />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className='font-medium'>{club.name}</TableCell>
                  <TableCell>
                    <Badge variant='secondary'>{club.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      <Users className='h-4 w-4 text-muted-foreground' />
                      {club.memberCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    {club.hasInternationalGroup ? (
                      <Globe className='h-4 w-4 text-green-600' />
                    ) : (
                      <span className='text-muted-foreground'>No</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(club.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className='h-8 w-8 p-0' variant='ghost'>
                          <span className='sr-only'>Open menu</span>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingClub(club)
                            setFormDialogOpen(true)
                          }}>
                          <Edit className='mr-2 h-4 w-4' />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setDeletingClub(club)
                            setDeleteDialogOpen(true)
                          }}>
                          <Trash2 className='mr-2 h-4 w-4' />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ClubFormDialog
        club={editingClub}
        onOpenChange={(open) => {
          setFormDialogOpen(open)
          if (!open) setEditingClub(undefined)
        }}
        onSubmit={editingClub ? handleUpdateClub : handleCreateClub}
        open={formDialogOpen}
      />

      <DeleteClubDialog
        club={deletingClub}
        onConfirm={handleDeleteClub}
        onOpenChange={setDeleteDialogOpen}
        open={deleteDialogOpen}
      />
    </div>
  )
}
