import type { Sponsor } from '@/types/schema'
import { ExternalLink } from 'lucide-react'
import Image from '@/components/layout/image'
import { cn } from '@/lib/utils'

interface PartnerCardProps {
  sponsor: Sponsor
  className?: string
}

export function PartnerCard({ sponsor, className }: PartnerCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-between rounded-2xl p-4 shadow-sm',
        'h-[181px] w-[266px]',
        className,
      )}
      style={{
        background:
          'radial-gradient(circle at 50% 0%, #171717 0%, #0e0e0e 100%)',
      }}>
      <div className='relative flex flex-1 items-center justify-center'>
        <Image
          alt={sponsor.name}
          blurred
          className='object-contain'
          height={62}
          src={sponsor.logo_url}
          width={124}
        />
      </div>

      {sponsor.description && (
        <p className='text-center font-normal font-poppins text-white/51 text-xs leading-[1.5]'>
          {sponsor.description}
        </p>
      )}

      {sponsor.website_url && (
        <a
          className='mt-2 flex items-center gap-2 text-white transition-colors hover:text-white/80'
          href={sponsor.website_url}
          rel='noopener noreferrer'
          target='_blank'>
          <span className='font-normal font-poppins text-xs'>
            Visiter le site
          </span>
          <ExternalLink className='h-4 w-4' />
        </a>
      )}
    </div>
  )
}
