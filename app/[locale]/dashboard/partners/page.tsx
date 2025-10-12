'use client'

import type { Sponsor } from '@/types/schema'
import {
  Edit,
  Eye,
  EyeOff,
  MoreHorizontal,
  Plus,
  Star,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'
import Image from '@/components/layout/image'
import {
  DeleteSponsorDialog,
  SponsorFormDialog,
} from '@/components/sponsor-dialogs'
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

const fetcher = (url: string) => fetch(url).then((r) => r.json())

// Helper function to get logo URL from MinIO
function getLogoUrl(logoUrl: string): string {
  const endpoint = process.env.NEXT_PUBLIC_S3_ENDPOINT || 'http://127.0.0.1:9000'
  const bucket = process.env.NEXT_PUBLIC_S3_BUCKET || 'assets'
  
  // New format: just the filename without path or extension
  // Construct full MinIO URL
  return `${endpoint}/${bucket}/sponsors/${logoUrl}.svg`
}

type SponsorFormData = {
  name: string
  slug: string
  description?: string | null
  website_url?: string | null
  logo_url: string
  priority: number
  is_featured: boolean
}

export default function SponsorsPage() {
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | undefined>()
  const [deletingSponsor, setDeletingSponsor] = useState<Sponsor | undefined>()
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: sponsors = [], mutate } = useSWR<Sponsor[]>(
    '/api/sponsors?include_unapproved=true',
    fetcher,
  )

  const handleCreateSponsor = async (data: SponsorFormData) => {
    try {
      const response = await fetch('/api/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create sponsor')
      }

      toast.success('Sponsor created successfully!')
      mutate()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create sponsor',
      )
      throw error
    }
  }

  const handleUpdateSponsor = async (data: SponsorFormData) => {
    if (!editingSponsor) return

    try {
      const response = await fetch(`/api/sponsors/${editingSponsor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update sponsor')
      }

      toast.success('Sponsor updated successfully!')
      mutate()
      setEditingSponsor(undefined)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update sponsor',
      )
      throw error
    }
  }

  const handleDeleteSponsor = async () => {
    if (!deletingSponsor) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/sponsors/${deletingSponsor.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete sponsor')
      }

      toast.success('Sponsor deleted successfully!')
      mutate()
      setDeletingSponsor(undefined)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete sponsor',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleApproval = async (sponsor: Sponsor) => {
    try {
      const response = await fetch(`/api/sponsors/${sponsor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: !sponsor.approved }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update sponsor')
      }

      toast.success(
        `Sponsor ${!sponsor.approved ? 'approved' : 'unapproved'} successfully!`,
      )
      mutate()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update sponsor',
      )
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-bold text-3xl tracking-tight'>Sponsors</h1>
          <p className='text-muted-foreground'>
            Manage sponsors and partners displayed on the website.
          </p>
        </div>
        <Button onClick={() => setFormDialogOpen(true)}>
          <Plus className='mr-2 h-4 w-4' />
          Add Sponsor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Sponsors ({sponsors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {sponsors.length === 0 ? (
            <div className='py-8 text-center'>
              <p className='text-muted-foreground'>No sponsors found.</p>
              <Button className='mt-4' onClick={() => setFormDialogOpen(true)}>
                <Plus className='mr-2 h-4 w-4' />
                Add Your First Sponsor
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className='w-[70px]'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsors.map((sponsor) => (
                  <TableRow key={sponsor.id}>
                    <TableCell>
                      <div className='flex h-10 w-10 items-center justify-center rounded border'>
                        <Image
                          alt={sponsor.name}
                          className='h-8 w-8 object-contain'
                          height={32}
                          src={getLogoUrl(sponsor.logo_url)}
                          width={32}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className='font-medium'>{sponsor.name}</div>
                        <div className='text-muted-foreground text-sm'>
                          /{sponsor.slug}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={sponsor.approved ? 'default' : 'secondary'}>
                        {sponsor.approved ? (
                          <>
                            <Eye className='mr-1 h-3 w-3' />
                            Approved
                          </>
                        ) : (
                          <>
                            <EyeOff className='mr-1 h-3 w-3' />
                            Pending
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>{sponsor.priority}</TableCell>
                    <TableCell>
                      {sponsor.is_featured && (
                        <Badge variant='outline'>
                          <Star className='mr-1 h-3 w-3' />
                          Featured
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {sponsor.website_url ? (
                        <a
                          className='text-blue-600 hover:underline'
                          href={sponsor.website_url}
                          rel='noopener noreferrer'
                          target='_blank'>
                          Visit
                        </a>
                      ) : (
                        <span className='text-muted-foreground'>—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(sponsor.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className='h-8 w-8 p-0' variant='ghost'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingSponsor(sponsor)
                              setFormDialogOpen(true)
                            }}>
                            <Edit className='mr-2 h-4 w-4' />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleApproval(sponsor)}>
                            {sponsor.approved ? (
                              <>
                                <EyeOff className='mr-2 h-4 w-4' />
                                Unapprove
                              </>
                            ) : (
                              <>
                                <Eye className='mr-2 h-4 w-4' />
                                Approve
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className='text-red-600'
                            onClick={() => {
                              setDeletingSponsor(sponsor)
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
          )}
        </CardContent>
      </Card>

      <SponsorFormDialog
        onOpenChange={(open) => {
          setFormDialogOpen(open)
          if (!open) {
            setEditingSponsor(undefined)
          }
        }}
        onSubmit={editingSponsor ? handleUpdateSponsor : handleCreateSponsor}
        open={formDialogOpen}
        sponsor={editingSponsor}
      />

      <DeleteSponsorDialog
        loading={isDeleting}
        onConfirm={handleDeleteSponsor}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open)
          if (!open) {
            setDeletingSponsor(undefined)
          }
        }}
        open={deleteDialogOpen}
        sponsor={deletingSponsor}
      />
    </div>
  )
}
