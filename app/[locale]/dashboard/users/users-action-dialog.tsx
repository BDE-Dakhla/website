'use client'

import type { User } from '@/components/schema'
import type { PermissionMap } from '@/types/schema'
import type { DialogContext } from './confirm-dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { roles } from '@/components/data'
import { PermissionManager } from '@/components/permission-manager'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { showSubmittedData } from '@/lib/utils'
import { PasswordInput } from './password-input'
import { SelectDropdown } from './select-dropdown'

const formSchema = z
  .object({
    username: z.string().min(1, 'Username is required.'),
    phoneNumber: z.string().min(1, 'Phone number is required.'),
    email: z.email({
      error: (iss) => (iss.input === '' ? 'Email is required.' : undefined),
    }),
    password: z.string().transform((pwd) => pwd.trim()),
    role: z.string().min(1, 'Role is required.'),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    isEdit: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isEdit && !data.password) return true
      return data.password.length > 0
    },
    {
      message: 'Password is required.',
      path: ['password'],
    },
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return password.length >= 8
    },
    {
      message: 'Password must be at least 8 characters long.',
      path: ['password'],
    },
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return /[a-z]/.test(password)
    },
    {
      message: 'Password must contain at least one lowercase letter.',
      path: ['password'],
    },
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return /\d/.test(password)
    },
    {
      message: 'Password must contain at least one number.',
      path: ['password'],
    },
  )
  .refine(
    ({ isEdit, password, confirmPassword }) => {
      if (isEdit && !password) return true
      return password === confirmPassword
    },
    {
      message: "Passwords don't match.",
      path: ['confirmPassword'],
    },
  )
type UserForm = z.infer<typeof formSchema>

export interface UserActionDialogProps extends DialogContext {
  currentRow?: User
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UserActionDialogProps) {
  const isEdit = !!currentRow
  const [permissions, setPermissions] = useState<PermissionMap>(
    currentRow?.permissions || {},
  )

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          password: '',
          confirmPassword: '',
          isEdit,
        }
      : {
          username: '',
          email: '',
          role: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
          isEdit,
        },
  })

  const onSubmit = (values: UserForm) => {
    const userData = {
      ...values,
      permissions,
    }
    form.reset()
    setPermissions({})
    showSubmittedData(userData)
    onOpenChange(false)
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <Dialog
      onOpenChange={(state) => {
        form.reset()
        setPermissions(currentRow?.permissions || {})
        onOpenChange(state)
      }}
      open={open}>
      <DialogContent className='max-h-[90vh] sm:max-w-4xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? "Mettez à jour les données de l'" : 'Créer un nouveau'}{' '}
            utilisateur
          </DialogTitle>
          <DialogDescription>
            Configurez les informations de base et les permissions de
            l'utilisateur.
          </DialogDescription>
        </DialogHeader>

        <Tabs className='w-full' defaultValue='basic'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='basic'>Informations de base</TabsTrigger>
            <TabsTrigger value='permissions'>Permissions</TabsTrigger>
          </TabsList>

          <TabsContent className='mt-4' value='basic'>
            <div className='h-[400px] overflow-y-auto pr-3'>
              <Form {...form}>
                <form
                  className='space-y-4 px-0.5'
                  id='user-form'
                  onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                        <FormLabel className='col-span-2 text-end'>
                          Nom complet
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete='off'
                            className='col-span-4'
                            placeholder='John Doe'
                            {...field}
                          />
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
                        <FormLabel className='col-span-2 text-end'>
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            className='col-span-4'
                            placeholder='john.doe@gmail.com'
                            type='email'
                            {...field}
                          />
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
                        <FormLabel className='col-span-2 text-end'>
                          Téléphone
                        </FormLabel>
                        <FormControl>
                          <Input
                            className='col-span-4'
                            placeholder='+212 6 12 34 56 78'
                            {...field}
                          />
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
                        <FormLabel className='col-span-2 text-end'>
                          Rôle
                        </FormLabel>
                        <SelectDropdown
                          className='col-span-4'
                          defaultValue={field.value}
                          items={roles.map(({ label, value }) => ({
                            label,
                            value,
                          }))}
                          onValueChange={field.onChange}
                          placeholder='Sélectionner un rôle'
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
                        <FormLabel className='col-span-2 text-end'>
                          Mot de passe
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            className='col-span-4'
                            placeholder={
                              isEdit
                                ? 'Laissez vide pour conserver'
                                : 'e.g., S3cur3P@ssw0rd'
                            }
                            {...field}
                          />
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
                        <FormLabel className='col-span-2 text-end'>
                          Confirmer mot de passe
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            className='col-span-4'
                            disabled={!isPasswordTouched}
                            placeholder='Confirmez le mot de passe'
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
          </TabsContent>

          <TabsContent className='mt-4' value='permissions'>
            <div className='h-[400px]'>
              <PermissionManager
                className='h-full'
                currentPermissions={permissions}
                onPermissionsChange={setPermissions}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className='pt-4'>
          <Button
            onClick={() => {
              form.reset()
              setPermissions(currentRow?.permissions || {})
              onOpenChange(false)
            }}
            variant='outline'>
            Annuler
          </Button>
          <Button form='user-form' type='submit'>
            {isEdit ? 'Mettre à jour' : 'Créer'} l'utilisateur
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
