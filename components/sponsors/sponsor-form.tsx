'use client'

import type { Sponsor } from '@/types/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { SponsorLogoUpload } from '@/components/sponsors/sponsor-logo-upload'
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

const sponsorFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(255, 'Slug must be less than 255 characters'),
  description: z.string().optional(),
  website_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  logo_url: z.string().min(1, 'Logo URL is required'),
  priority: z.number().int().min(0),
  is_featured: z.boolean(),
})

type SponsorFormSchemaType = {
  name: string
  slug: string
  logo_url: string
  priority: number
  is_featured: boolean
  description?: string
  website_url?: string
}

export type SponsorFormData = Omit<
  SponsorFormSchemaType,
  'description' | 'website_url'
> & {
  description?: string | null
  website_url?: string | null
}

interface SponsorFormProps {
  sponsor?: Sponsor
  onSubmit: (data: SponsorFormData) => Promise<void>
  onCancel: () => void
}

export function SponsorForm({ sponsor, onSubmit, onCancel }: SponsorFormProps) {
  const t = useTranslations()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SponsorFormSchemaType>({
    resolver: zodResolver(sponsorFormSchema),
    defaultValues: {
      name: sponsor?.name || '',
      slug: sponsor?.slug || '',
      description: sponsor?.description || '',
      website_url: sponsor?.website_url || '',
      logo_url: sponsor?.logo_url || '',
      priority: sponsor?.priority || 100,
      is_featured: sponsor?.is_featured || false,
    },
  })

  const handleSubmit = async (data: SponsorFormSchemaType) => {
    setIsSubmitting(true)
    try {
      // Convert empty strings to null for optional fields
      const processedData = {
        ...data,
        description: data.description || null,
        website_url: data.website_url || null,
      }
      await onSubmit(processedData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const genSlugForNewSponsors = (name: string) => {
    if (!sponsor) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      form.setValue('slug', slug)
    }
  }

  return (
    <Form {...form}>
      <form className='space-y-6' onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter sponsor name'
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    genSlugForNewSponsors(e.target.value)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='slug'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder='sponsor-slug' {...field} />
              </FormControl>
              <FormDescription>
                URL-friendly identifier. Will be auto-generated from name for
                new sponsors.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  className='resize-none'
                  placeholder='Brief description of the sponsor (optional)'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='website_url'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input
                  placeholder='https://example.com'
                  type='url'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='logo_url'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                <SponsorLogoUpload
                  disabled={isSubmitting}
                  onChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormDescription>
                Upload an SVG logo file. Maximum size: 5MB. The logo will be
                displayed on the website and stored securely.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='priority'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <Input min='0' type='number' {...field} />
              </FormControl>
              <FormDescription>
                Lower numbers appear first. Default is 100.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='is_featured'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>Featured Sponsor</FormLabel>
                <FormDescription>
                  Featured sponsors appear prominently and are shown first.
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

        <div className='flex justify-end space-x-2'>
          <StaticButton onClick={onCancel} type='button' variant='outline'>
            {t('common.actions.cancel')}
          </StaticButton>
          <Button disabled={isSubmitting} loading={isSubmitting} type='submit'>
            {sponsor ? "Modifier un sponsor": "Ajouter un sponsor"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
