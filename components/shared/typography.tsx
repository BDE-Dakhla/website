import { Link } from '@/i18n/routing'
import { cn } from '@/lib/utils'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

const headingClasses: Record<HeadingTag, string> = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
  h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
  h6: 'scroll-m-20 text-base font-semibold tracking-tight'
}

export type TitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: HeadingTag
}

export function Title({ as = 'h2', className, ...props }: TitleProps) {
  const Component = as as unknown as React.ElementType
  return <Component className={cn(headingClasses[as], className)} {...props} />
}

// Paragraph
export type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement> & {
  as?: 'p' | 'div' | 'span'
  size?: 'sm' | 'md' | 'lg'
  muted?: boolean
}

const paragraphSize: Record<NonNullable<ParagraphProps['size']>, string> = {
  sm: 'text-sm leading-6',
  md: 'text-base leading-7',
  lg: 'text-lg leading-8'
}

export function Paragraph({ as = 'p', size = 'md', muted = false, className, ...props }: ParagraphProps) {
  const Component = as as unknown as React.ElementType
  return (
    <Component
      className={cn(
        paragraphSize[size],
        muted ? 'text-muted-foreground' : 'text-foreground',
        '[&:not(:first-child)]:mt-4',
        className
      )}
      {...props}
    />
  )
}

// Link (semantic <a>, uses next-intl Link for internal routes)
export type AProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  locale?: string
  prefetch?: boolean
  newTab?: boolean
}

export function A({ href, className, locale, prefetch, newTab, ...props }: AProps) {
  const isExternal = newTab || /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')

  const classes = cn(
    'font-medium underline underline-offset-4 hover:underline hover:text-primary',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    className
  )

  if (isExternal) {
    return (
      <a
        className={classes}
        href={href}
        rel={newTab ? 'noopener noreferrer' : undefined}
        target={newTab ? '_blank' : undefined}
        {...props}
      />
    )
  }

  return <Link className={classes} href={href} locale={locale} prefetch={prefetch} {...props} />
}
