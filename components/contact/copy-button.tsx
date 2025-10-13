'use client'

import { Check, Copy } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CopyButtonProps = ButtonProps & {
  text: string
}

export function CopyButton({
  className,
  variant = 'ghost',
  size = 'icon',
  text,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState<boolean>(false)
  const t = useTranslations('contact.copy')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Button
      aria-label={copied ? t('copied') : t('copyToClipboard')}
      className={cn('disabled:opacity-100', className)}
      disabled={copied || props.disabled}
      onClick={handleCopy}
      size={size}
      variant={variant}
      {...props}>
      <div
        className={cn(
          'transition-all',
          copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
        )}>
        <Check aria-hidden='true' className='size-3.5 stroke-emerald-500' />
      </div>
      <div
        className={cn(
          'absolute transition-all',
          copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100',
        )}>
        <Copy aria-hidden='true' className='size-3.5' />
      </div>
    </Button>
  )
}
