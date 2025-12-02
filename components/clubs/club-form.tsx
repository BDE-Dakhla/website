'use client'

import type { Club } from '@/types/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ClubImageUpload } from '@/components/clubs/club-image-upload'
import { Button as StaticButton } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/stateful-button'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

const clubFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(100, 'Category must be less than 100 characters'),
  hasInternationalGroup: z.boolean(),
  memberCount: z.number().int().min(0),
  imageUrl: z.string().optional(),
})

type ClubFormSchemaType = {
  name: string
  description: string
  category: string
  hasInternationalGroup: boolean
  memberCount: number
  imageUrl?: string
}

export type ClubFormData = ClubFormSchemaType

interface ClubFormProps {
  club?: Club
  onSubmit: (data: ClubFormData) => Promise<void>
  onCancel: () => void
}

export function ClubForm({ club, onSubmit, onCancel }: ClubFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ClubFormSchemaType>({
    resolver: zodResolver(clubFormSchema),
    defaultValues: {
      name: club?.name || '',
      description: club?.description || '',
      category: club?.category || '',
      hasInternationalGroup: club?.hasInternationalGroup || false,
      memberCount: club?.memberCount || 0,
      imageUrl: club?.imageUrl || '',
    },
  })

  const handleSubmit = async (data: ClubFormSchemaType) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form className='space-y-6' onSubmit={form.handleSubmit(handleSubmit)}>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Club Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter club name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., sports, culture, academic'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a category that best describes the club
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='memberCount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member Count</FormLabel>
                  <FormControl>
                    <Input
                      min='0'
                      placeholder='0'
                      type='number'
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Current number of active members
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='hasInternationalGroup'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      International Group
                    </FormLabel>
                    <FormDescription>
                      Does this club have an international chapter or
                      collaboration?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className='space-y-6'>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className='min-h-[120px]'
                      placeholder='Describe the club, its activities, and goals...'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of the club
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='imageUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Club Image</FormLabel>
                  <FormControl>
                    <ClubImageUpload
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload an image representing the club (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className='flex justify-end space-x-4 border-t pt-6'>
          <StaticButton onClick={onCancel} type='button' variant='outline'>
            Cancel
          </StaticButton>
          <Button disabled={isSubmitting} type='submit'>
            {club ? 'Update Club' : 'Create Club'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
