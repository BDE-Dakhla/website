'use client'

import { AlertCircle, CheckCircle, FileImage, Upload, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  CLUB_IMAGE_CONSTRAINTS,
  type FileValidationError,
  formatFileSize,
  generateClubImageKey,
  validateClubImage,
} from '@/lib/file-validation'
import { cn } from '@/lib/utils'

interface ClubImageUploadProps {
  value?: string // Current image filename (without extension and path)
  onChange: (imageKey: string) => void
  disabled?: boolean
  className?: string
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

export function ClubImageUpload({
  value,
  onChange,
  disabled = false,
  className,
}: ClubImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationErrors, setValidationErrors] = useState<
    FileValidationError[]
  >([])
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileValidation = useCallback((file: File) => {
    const errors = validateClubImage(file)
    setValidationErrors(errors)
    return errors.length === 0
  }, [])

  const uploadFile = useCallback(
    async (file: File) => {
      try {
        setUploadState('uploading')
        setProgress(0)

        // Generate unique key for the file
        const fileKey = generateClubImageKey(file.name)

        // Create FormData for upload
        const formData = new FormData()
        formData.append('file', file)
        formData.append('key', fileKey)

        // Upload to our API endpoint
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Upload failed')
        }

        const _result = await response.json()
        onChange(fileKey)
        setUploadState('success')
        toast.success('Image uploaded successfully!')

        // Reset after success
        setTimeout(() => {
          setUploadState('idle')
          setSelectedFile(null)
          setValidationErrors([])
        }, 2000)
      } catch (error) {
        console.error('Upload error:', error)
        setUploadState('error')
        toast.error(
          error instanceof Error ? error.message : 'Failed to upload image',
        )
      }
    },
    [onChange],
  )

  const handleFileSelect = useCallback(
    (file: File) => {
      setSelectedFile(file)

      if (!handleFileValidation(file)) {
        return
      }

      uploadFile(file)
    },
    [handleFileValidation, uploadFile],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (disabled) return

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFileSelect(files[0])
      }
    },
    [disabled, handleFileSelect],
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) {
        setDragActive(true)
      }
    },
    [disabled],
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        handleFileSelect(files[0])
      }
    },
    [handleFileSelect],
  )

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [disabled])

  const handleRemove = useCallback(() => {
    onChange('')
    setSelectedFile(null)
    setValidationErrors([])
    setUploadState('idle')
  }, [onChange])

  const getStatusIcon = () => {
    switch (uploadState) {
      case 'uploading':
        return <Upload className='h-8 w-8 animate-pulse text-blue-500' />
      case 'success':
        return <CheckCircle className='h-8 w-8 text-green-500' />
      case 'error':
        return <AlertCircle className='h-8 w-8 text-red-500' />
      default:
        return <FileImage className='h-8 w-8 text-muted-foreground' />
    }
  }

  const getStatusText = () => {
    if (uploadState === 'uploading') return 'Uploading...'
    if (uploadState === 'success') return 'Upload successful!'
    if (uploadState === 'error') return 'Upload failed'
    if (value) return 'Image uploaded'
    return 'Click to upload or drag and drop'
  }

  return (
    <div className={cn('space-y-4', className)}>
      <Card>
        <CardContent className='p-6'>
          <div
            className={cn(
              'relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors',
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50',
              disabled && 'cursor-not-allowed opacity-50',
              validationErrors.length > 0 && 'border-red-500 bg-red-50',
            )}
            onClick={handleClick}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}>
            <input
              accept={CLUB_IMAGE_CONSTRAINTS.allowedTypes.join(',')}
              className='hidden'
              disabled={disabled}
              onChange={handleFileInputChange}
              ref={fileInputRef}
              type='file'
            />

            <div className='flex flex-col items-center space-y-4'>
              {getStatusIcon()}
              <div>
                <p className='font-medium text-sm'>{getStatusText()}</p>
                <p className='mt-1 text-muted-foreground text-xs'>
                  PNG, JPG, or WebP up to{' '}
                  {Math.round(CLUB_IMAGE_CONSTRAINTS.maxSize / 1024 / 1024)}MB
                </p>
              </div>
            </div>

            {uploadState === 'uploading' && (
              <div className='mt-4'>
                <div className='h-2 w-full rounded-full bg-gray-200'>
                  <div
                    className='h-2 rounded-full bg-blue-500 transition-all duration-300'
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {validationErrors.length > 0 && (
            <div className='mt-4 space-y-2'>
              {validationErrors.map((error, index) => (
                <div
                  className='flex items-center space-x-2 text-red-600 text-sm'
                  key={index}>
                  <AlertCircle className='h-4 w-4' />
                  <span>{error.message}</span>
                </div>
              ))}
            </div>
          )}

          {value && (
            <div className='mt-4 flex items-center justify-between rounded-lg bg-muted p-3'>
              <div className='flex items-center space-x-3'>
                <FileImage className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='font-medium text-sm'>Club Image</p>
                  <p className='text-muted-foreground text-xs'>
                    {selectedFile
                      ? formatFileSize(selectedFile.size)
                      : 'Uploaded'}
                  </p>
                </div>
              </div>
              <Button
                disabled={disabled}
                onClick={handleRemove}
                size='sm'
                variant='ghost'>
                <X className='h-4 w-4' />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {value && (
        <div className='flex items-center space-x-2'>
          <Badge variant='secondary'>Image Key: {value}</Badge>
        </div>
      )}
    </div>
  )
}
