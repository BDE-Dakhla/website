import type * as AvatarPrimitive from '@radix-ui/react-avatar'
import {
  AvatarFallback,
  AvatarImage,
  Avatar as AvatarWrapper,
} from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface Props extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  name: string
  image: string | undefined
}

export const Avatar = ({ name, image, className, ...props }: Props) => {
  const url =
    image ??
    name
      .split(' ')
      .map((n: string) => n[0])
      .join('')

  return (
    <AvatarWrapper className={cn('h-8 w-8 rounded-lg', className)} {...props}>
      <AvatarImage alt={name} src={url} />
      <AvatarFallback className='rounded-lg'>{url}</AvatarFallback>
    </AvatarWrapper>
  )
}
