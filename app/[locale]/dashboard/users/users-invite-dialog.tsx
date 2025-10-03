'use client'

import type { DialogContext } from './confirm-dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { MailPlus, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { roles } from '@/components/data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { showSubmittedData } from '@/lib/utils'
import { SelectDropdown } from './select-dropdown'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter an email to invite.' : undefined)
  }),
  role: z.string().min(1, 'Role is required.'),
  desc: z.string().optional()
})

type UserInviteForm = z.infer<typeof formSchema>

export function UsersInviteDialog({ open, onOpenChange }: DialogContext) {
  const form = useForm<UserInviteForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', role: '', desc: '' }
  })

  const onSubmit = (values: UserInviteForm) => {
    form.reset()
    showSubmittedData(values)
    onOpenChange(false)
  }

  return (
    <Dialog
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
      open={open}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle className='flex items-center gap-2'>
            <MailPlus /> Inviter un utilisateur
          </DialogTitle>
          <DialogDescription>
            Inviter un nouveau utilisateur pour rejoindre la plateforme en enovoyant formellement une invitation par
            email. Spécifier le role de l'utilisateur pour lui donner les accès appropriés.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-4' id='user-invite-form' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='eg: john.doe@gmail.com' type='email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    items={roles.map(({ label, value }) => ({
                      label,
                      value
                    }))}
                    onValueChange={field.onChange}
                    placeholder='Sélectionner un rôle'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='desc'
              render={({ field }) => (
                <FormItem className=''>
                  <FormLabel>Description (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea
                      className='resize-none'
                      placeholder='Ajouter une note complémentaire à votre invitation...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='gap-y-2'>
          <DialogClose asChild>
            <Button variant='outline'>Annuler</Button>
          </DialogClose>
          <Button form='user-invite-form' type='submit'>
            Inviter <Send />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
