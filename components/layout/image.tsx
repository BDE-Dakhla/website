'use client'

import NextImage from 'next/image'
import { forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Lens } from '../ui/lens'

type NextImageProps = React.ComponentProps<typeof NextImage>

interface ImageProps extends NextImageProps {
  withLens?: boolean
  blurred?: boolean
}

const BaseImage = forwardRef<HTMLImageElement, NextImageProps>(
  function BaseImage({ className, ...props }, ref) {
    return (
      <NextImage
        className={cn('select-none', className)}
        draggable={false}
        ref={ref}
        {...props}
      />
    )
  },
)

function LensWrapper({ children }: { children: React.ReactNode }) {
  const [hovering, setHovering] = useState(false)
  return (
    <Lens hovering={hovering} setHovering={setHovering}>
      {children}
    </Lens>
  )
}

export default function Image({
  withLens = false,
  blurred = false,
  ...props
}: ImageProps) {
  const img = <BaseImage {...props} />

  if (blurred) {
    return (
      <div className='relative'>
        <BaseImage
          {...props}
          className={cn(
            'absolute inset-0 select-none blur-md',
            props.className,
          )}
        />
        <div className='relative'>
          {withLens ? <LensWrapper>{img}</LensWrapper> : img}
        </div>
      </div>
    )
  }

  return withLens ? <LensWrapper>{img}</LensWrapper> : img
}
