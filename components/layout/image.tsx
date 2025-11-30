'use client'

import { type HTMLMotionProps, motion as motionize } from 'motion/react'
import NextImage from 'next/image'
import { forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Lens } from '../ui/lens'

type NextImageProps = React.ComponentProps<typeof NextImage>

type BaseImageProps = NextImageProps & {
  withLens?: boolean
  blurred?: boolean
}

type ImageProps<Motion extends boolean = false> = Motion extends true
  ? HTMLMotionProps<'img'> & {
      motion: true
      withLens?: boolean
      blurred?: boolean
    }
  : BaseImageProps & { motion?: Motion }

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

export default function Image<Motion extends boolean = false>({
  withLens = false,
  blurred = false,
  motion = false as Motion,
  ...props
}: ImageProps<Motion>) {
  // When motion is true, create and render the motion component
  if (motion) {
    const MotionImage = motionize.create(BaseImage)
    // @ts-expect-error
    return <MotionImage {...props} />
  }

  const img = <BaseImage {...(props as NextImageProps)} />

  if (blurred) {
    return (
      <div className='relative'>
        <BaseImage
          {...(props as NextImageProps)}
          className={cn(
            'absolute inset-0 select-none blur-md',
            (props as NextImageProps).className,
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
