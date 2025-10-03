'use client'

import type { User } from '@/components/schema'
import type { DialogContext } from './confirm-dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { roles } from '@/components/data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { showSubmittedData } from '@/lib/utils'
import { PasswordInput } from './password-input'
import { SelectDropdown } from './select-dropdown'

const formSchema = z
  .object({
    username: z.string().min(1, 'Username is required.'),
    phoneNumber: z.string().min(1, 'Phone number is required.'),
    email: z.email({
      error: (iss) => (iss.input === '' ? 'Email is required.' : undefined)
    }),
    password: z.string().transform((pwd) => pwd.trim()),
    role: z.string().min(1, 'Role is required.'),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    isEdit: z.boolean()
  })
  .refine(
    (data) => {
      if (data.isEdit && !data.password) return true
      return data.password.length > 0
    },
    {
      message: 'Password is required.',
      path: ['password']
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return password.length >= 8
    },
    {
      message: 'Password must be at least 8 characters long.',
      path: ['password']
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return /[a-z]/.test(password)
    },
    {
      message: 'Password must contain at least one lowercase letter.',
      path: ['password']
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return /\d/.test(password)
    },
    {
      message: 'Password must contain at least one number.',
      path: ['password']
    }
  )
  .refine(
    ({ isEdit, password, confirmPassword }) => {
      if (isEdit && !password) return true
      return password === confirmPassword
    },
    {
      message: "Passwords don't match.",
      path: ['confirmPassword']
    }
  )
type UserForm = z.infer<typeof formSchema>

export interface UserActionDialogProps extends DialogContext {
  currentRow: User
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: UserActionDialogProps) {
  const isEdit = !!currentRow
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          password: '',
          confirmPassword: '',
          isEdit
        }
      : {
          username: '',
          email: '',
          role: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
          isEdit
        }
  })

  const onSubmit = (values: UserForm) => {
    form.reset()
    showSubmittedData(values)
    onOpenChange(false)
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <Dialog
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
      open={open}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? "Mettez à jour les données de l'" : 'Créer un nouveau'} utilisateur</DialogTitle>
          <DialogDescription>Cliquez sur le bouton Sauvegarder lorsque vous avez fini.</DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form className='space-y-4 px-0.5' id='user-form' onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-end'>Nom complet</FormLabel>
                    <FormControl>
                      <Input autoComplete='off' className='col-span-4' placeholder='John' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-end'>Email</FormLabel>
                    <FormControl>
                      <Input className='col-span-4' placeholder='john.doe@gmail.com' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-end'>Phone Number</FormLabel>
                    <FormControl>
                      <Input className='col-span-4' placeholder='+123456789' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-end'>Role</FormLabel>
                    <SelectDropdown
                      className='col-span-4'
                      defaultValue={field.value}
                      items={roles.map(({ label, value }) => ({
                        label,
                        value
                      }))}
                      onValueChange={field.onChange}
                      placeholder='Select a role'
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-end'>Password</FormLabel>
                    <FormControl>
                      <PasswordInput className='col-span-4' placeholder='e.g., S3cur3P@ssw0rd' {...field} />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-end'>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        className='col-span-4'
                        disabled={!isPasswordTouched}
                        placeholder='e.g., S3cur3P@ssw0rd'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button form='user-form' type='submit'>
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
