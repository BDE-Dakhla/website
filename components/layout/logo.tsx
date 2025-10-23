import Image from './image'

type NextImageProps = Omit<
  React.ComponentProps<typeof Image>,
  'alt' | 'src' | 'height' | 'width'
>

export function Logo(props: NextImageProps) {
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
