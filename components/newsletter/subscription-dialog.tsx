'use client'

import { CheckCircle, UserCheck, XCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

export type SubscriptionStatus = 'success' | 'already_subscribed' | 'error'

interface SubscriptionDialogProps {
  open: boolean
  status: SubscriptionStatus
  onClose: () => void
}

export function SubscriptionDialog({
  open,
  status,
  onClose,
}: SubscriptionDialogProps) {
  const t = useTranslations('footer.newsletter')

  const getDialogContent = () => {
    console.log(status)
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className='h-12 w-12 text-green-500' />,
          title: t('success.title'),
          description: t('success.description'),
          buttonText: t('success.close'),
          buttonVariant: 'default' as const,
        }
      case 'already_subscribed':
        return {
          icon: <UserCheck className='h-12 w-12 text-blue-500' />,
          title: t('alreadySubscribed.title'),
          description: t('alreadySubscribed.description'),
          buttonText: t('alreadySubscribed.close'),
          buttonVariant: 'secondary' as const,
        }
      case 'error':
        return {
          icon: <XCircle className='h-12 w-12 text-red-500' />,
          title: t('error.title'),
          description: t('error.description'),
          buttonText: t('error.close'),
          buttonVariant: 'destructive' as const,
        }
      default:
        return {
          icon: <CheckCircle className='h-12 w-12 text-green-500' />,
          title: t('success.title'),
          description: t('success.description'),
          buttonText: t('success.close'),
          buttonVariant: 'default' as const,
        }
    }
  }

  const content = getDialogContent()

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-center'>
          <div className='mx-auto mb-4'>{content.icon}</div>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription className='text-center'>
            {content.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='sm:justify-center'>
          <Button onClick={onClose} variant={content.buttonVariant}>
            {content.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
