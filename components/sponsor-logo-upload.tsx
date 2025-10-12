'use client'

import { AlertCircle, CheckCircle, FileImage, Upload, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  type FileValidationError,
  formatFileSize,
  generateSponsorLogoKey,
  SPONSOR_LOGO_CONSTRAINTS,
  validateSponsorLogo,
} from '@/lib/file-validation'
import { cn } from '@/lib/utils'

interface SponsorLogoUploadProps {
  value?: string // Current logo filename (without extension and path)
  onChange: (logoKey: string) => void
  disabled?: boolean
  className?: string
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

export function SponsorLogoUpload({
  value,
  onChange,
  disabled = false,
  className,
}: SponsorLogoUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationErrors, setValidationErrors] = useState<
    FileValidationError[]
  >([])
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileValidation = useCallback((file: File) => {
    const errors = validateSponsorLogo(file)
    setValidationErrors(errors)
    return errors.length === 0
  }, [])

  const uploadFile = useCallback(
    async (file: File) => {
      try {
        setUploadState('uploading')
        setProgress(0)

        // Generate a unique key for the file
        const key = generateSponsorLogoKey(file.name)

        // Get upload URL
        const uploadUrlResponse = await fetch('/api/upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key,
            contentType: file.type,
            uploadType: 'sponsor-logo',
            fileSize: file.size,
          }),
        })

        if (!uploadUrlResponse.ok) {
          const error = await uploadUrlResponse.json()
          throw new Error(error.error || 'Failed to get upload URL')
        }

        const { url } = await uploadUrlResponse.json()

        // Upload file to MinIO using the pre-signed URL
        const uploadResponse = await fetch(url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file')
        }

        // Extract filename without extension and path for storage
        const logoKey = key.replace('sponsors/', '').replace('.svg', '')

        setUploadState('success')
        setProgress(100)
        onChange(logoKey)
        toast.success('Logo uploaded successfully!')
      } catch (error) {
        setUploadState('error')
        toast.error(
          error instanceof Error ? error.message : 'Failed to upload logo',
        )
      }
    },
    [onChange],
  )

  const handleFileSelect = useCallback(
    async (files: FileList) => {
      const file = files[0]
      if (!file) return

      setSelectedFile(file)

      if (handleFileValidation(file)) {
        await uploadFile(file)
      } else {
        setUploadState('error')
      }
    },
    [handleFileValidation, uploadFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)

      if (disabled) return

      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFileSelect(files)
      }
    },
    [disabled, handleFileSelect],
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileSelect(e.target.files)
      }
    },
    [handleFileSelect],
  )

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }, [disabled])

  const handleRemove = useCallback(() => {
    setSelectedFile(null)
    setUploadState('idle')
    setValidationErrors([])
    setProgress(0)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onChange])

  const getStateIcon = () => {
    switch (uploadState) {
      case 'uploading':
        return (
          <div className='h-6 w-6 animate-spin rounded-full border-blue-600 border-b-2' />
        )
      case 'success':
        return <CheckCircle className='h-6 w-6 text-green-600' />
      case 'error':
        return <AlertCircle className='h-6 w-6 text-red-600' />
      default:
        return <Upload className='h-6 w-6 text-gray-400' />
    }
  }

  const getStateText = () => {
    switch (uploadState) {
      case 'uploading':
        return `Uploading... ${progress}%`
      case 'success':
        return 'Upload successful!'
      case 'error':
        return 'Upload failed'
      default:
        return 'Click to upload or drag and drop'
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <Card
        className={cn(
          'cursor-pointer border-2 border-dashed transition-all duration-200',
          {
            'border-blue-400 bg-blue-50 dark:bg-blue-950/20': dragActive,
            'border-green-400 bg-green-50 dark:bg-green-950/20':
              uploadState === 'success',
            'border-red-400 bg-red-50 dark:bg-red-950/20':
              uploadState === 'error' || validationErrors.length > 0,
            'border-gray-300 hover:border-gray-400':
              uploadState === 'idle' && !disabled,
            'cursor-not-allowed border-gray-200 opacity-50': disabled,
          },
        )}
        onClick={handleClick}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}>
        <CardContent className='space-y-4 p-6 text-center'>
          <div className='flex flex-col items-center space-y-2'>
            {getStateIcon()}
            <p className='font-medium text-sm'>{getStateText()}</p>
          </div>

          {/* File info */}
          {selectedFile && (
            <div className='flex items-center justify-center space-x-2'>
              <FileImage className='h-4 w-4 text-gray-500' />
              <span className='text-gray-600 text-sm dark:text-gray-300'>
                {selectedFile.name}
              </span>
              <Badge variant='outline'>
                {formatFileSize(selectedFile.size)}
              </Badge>
            </div>
          )}

          {/* Current value display */}
          {value && uploadState === 'idle' && (
            <div className='flex items-center justify-center space-x-2'>
              <FileImage className='h-4 w-4 text-green-600' />
              <span className='font-medium text-green-600 text-sm'>
                {value}.svg
              </span>
              <Button
                className='h-6 w-6 p-0'
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
                size='sm'
                type='button'
                variant='outline'>
                <X className='h-3 w-3' />
              </Button>
            </div>
          )}

          {/* Upload progress */}
          {uploadState === 'uploading' && (
            <div className='h-2 w-full rounded-full bg-gray-200'>
              <div
                className='h-2 rounded-full bg-blue-600 transition-all duration-300'
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Constraints info */}
          <div className='space-y-1 text-gray-500 text-xs'>
            <p>SVG files only</p>
            <p>
              Maximum size:{' '}
              {Math.round(SPONSOR_LOGO_CONSTRAINTS.maxSize / 1024 / 1024)}MB
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <div className='space-y-1'>
          {validationErrors.map((error) => (
            <p
              className='flex items-center space-x-1 text-red-600 text-sm'
              key={`${error.type}-${error.message}`}>
              <AlertCircle className='h-4 w-4' />
              <span>{error.message}</span>
            </p>
          ))}
        </div>
      )}

      {/* Hidden file input */}
      <input
        accept={SPONSOR_LOGO_CONSTRAINTS.allowedTypes.join(',')}
        className='hidden'
        disabled={disabled}
        onChange={handleFileInputChange}
        ref={fileInputRef}
        type='file'
      />
    </div>
  )
}
