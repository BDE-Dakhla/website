import type { MDXComponents } from 'mdx/types'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import Image from '@/components/layout/image'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { LayoutGrid } from '@/components/ui/layout-grid'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
}

export const Title: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
}) => {
  return (
    <h2
      className={cn(
        'text-balance font-semibold text-2xl tracking-tight',
        className,
      )}>
      {children}
    </h2>
  )
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Image: ({ className, ...props }) => (
      <Image
        alt='Illustration'
        className={cn('my-6 rounded-xl shadow-2xl', className)}
        withLens
        {...props}
      />
    ),
    Video: ({ className, ...props }: React.ComponentProps<'video'>) => (
      <video
        className={cn('rounded-md border', className)}
        controls
        loop
        {...props}
      />
    ),
    Title,
    Accordion,
    AccordionItem,
    AccordionTrigger,
    LayoutGrid,
    AccordionContent,
    ...components,
  }
}

export const useMDXComponents = getMDXComponents
