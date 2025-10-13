'use client'

import NextImage from 'next/image'
import { forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Lens } from '../ui/lens'

type NextImageProps = React.ComponentProps<typeof NextImage>

interface ImageProps extends NextImageProps {
  withLens?: boolean
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

export default function Image({ withLens = false, ...props }: ImageProps) {
  const img = <BaseImage {...props} />
  return withLens ? <LensWrapper>{img}</LensWrapper> : img
}
