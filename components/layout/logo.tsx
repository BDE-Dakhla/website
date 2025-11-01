import type { ImgHTMLAttributes } from 'react'
import Image from './image'

type LogoProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'alt' | 'src' | 'height' | 'width'
>

export function Logo(props: LogoProps) {
  return (
    <Image
      alt='Logo'
      height={32}
      src='/icons/logo.png'
      width={100}
      {...props}
    />
  )
}
