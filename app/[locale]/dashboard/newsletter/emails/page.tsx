'use client'

import { Calendar, FileText, Mail, MailOpen, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface CapturedEmail {
  id: string
  filename: string
  to: string
  subject: string
  from: string
  capturedAt: string
  size: number
  preview: string
}

export default function EmailsPage() {
  const [emails, setEmails] = useState<CapturedEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEmail, setSelectedEmail] = useState<CapturedEmail | null>(null)
  const [emailContent, setEmailContent] = useState<string>('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchEmails = async () => {
    try {
      const response = await fetch('/api/dashboard/emails')
      const data = await response.json()
      setEmails(data.emails || [])
    } catch (error) {
      console.error('Failed to fetch emails:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEmailContent = async (emailId: string) => {
    try {
      const response = await fetch(
        `/api/dashboard/emails/${encodeURIComponent(emailId)}`,
      )
      const data = await response.json()
      setEmailContent(data.content || '')
    } catch (error) {
      console.error('Failed to fetch email content:', error)
      setEmailContent('Erreur lors du chargement du contenu')
    }
  }

  const handleViewEmail = async (email: CapturedEmail) => {
    setSelectedEmail(email)
    setIsDialogOpen(true)
    setEmailContent('Chargement...')
    await fetchEmailContent(email.id)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR')
  }

  const formatSize = (bytes: number) => {
    return (bytes / 1024).toFixed(1) + ' KB'
  }

  useEffect(() => {
    fetchEmails()
  }, [])

  if (loading) {
    return (
      <div className='container mx-auto p-6'>
        <div className='animate-pulse'>
          <div className='mb-6 h-8 w-1/3 rounded bg-gray-200'></div>
          <div className='space-y-4'>
            {[1, 2, 3].map((i) => (
              <div className='h-24 rounded bg-gray-200' key={i}></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='font-bold text-3xl'>📧 Emails Capturés</h1>
          <p className='mt-2 text-gray-600'>
            Visualisez tous les emails générés par le système de newsletter
          </p>
        </div>
        <Button onClick={fetchEmails} variant='outline'>
          🔄 Actualiser
        </Button>
      </div>

      {emails.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Mail className='mb-4 h-16 w-16 text-gray-400' />
            <h3 className='mb-2 font-semibold text-lg'>Aucun email capturé</h3>
            <p className='text-center text-gray-600'>
              Les emails générés par les inscriptions à la newsletter
              apparaîtront ici
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-4'>
          {emails.map((email) => (
            <Card className='transition-shadow hover:shadow-md' key={email.id}>
              <CardContent className='p-6'>
                <div className='flex items-start justify-between'>
                  <div className='flex flex-1 items-start space-x-4'>
                    <MailOpen className='mt-1 h-6 w-6 text-blue-500' />
                    <div className='min-w-0 flex-1'>
                      <div className='mb-2 flex items-center space-x-2'>
                        <h3 className='truncate font-semibold text-lg'>
                          {email.subject}
                        </h3>
                        <Badge className='shrink-0' variant='secondary'>
                          {formatSize(email.size)}
                        </Badge>
                      </div>

                      <div className='mb-3 grid grid-cols-1 gap-2 text-gray-600 text-sm md:grid-cols-2'>
                        <div className='flex items-center space-x-1'>
                          <User className='h-4 w-4' />
                          <span>À: {email.to}</span>
                        </div>
                        <div className='flex items-center space-x-1'>
                          <Calendar className='h-4 w-4' />
                          <span>{formatDate(email.capturedAt)}</span>
                        </div>
                        <div className='flex items-center space-x-1 md:col-span-2'>
                          <Mail className='h-4 w-4' />
                          <span>De: {email.from}</span>
                        </div>
                      </div>

                      <p className='text-gray-700 text-sm leading-relaxed'>
                        {email.preview}...
                      </p>
                    </div>
                  </div>

                  <div className='ml-4 flex space-x-2'>
                    <Button
                      onClick={() => handleViewEmail(email)}
                      size='sm'
                      variant='default'>
                      <FileText className='mr-1 h-4 w-4' />
                      Voir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
        <DialogContent className='max-h-[80vh] max-w-4xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center space-x-2'>
              <MailOpen className='h-5 w-5' />
              <span>{selectedEmail?.subject}</span>
            </DialogTitle>
          </DialogHeader>

          {selectedEmail && (
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <strong>À:</strong> {selectedEmail.to}
                </div>
                <div>
                  <strong>De:</strong> {selectedEmail.from}
                </div>
                <div>
                  <strong>Date:</strong> {formatDate(selectedEmail.capturedAt)}
                </div>
                <div>
                  <strong>Taille:</strong> {formatSize(selectedEmail.size)}
                </div>
              </div>

              <ScrollArea className='h-[60vh] rounded-lg border'>
                <div
                  className='p-4'
                  dangerouslySetInnerHTML={{ __html: emailContent }}
                />
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
