import { Quote } from 'lucide-react'
import { useTranslations } from 'use-intl'
import Image from '@/components/layout/image'

export const SchoolPrincipalEditorial = () => {
  const label = 'school-principal-editorial'
  const t = useTranslations(`home.${label}`)

  return (
    <section
      aria-label={label}
      className="grid min-h-96 bg-[url('/campus.png')] bg-cover bg-position-[50%_80%] bg-no-repeat">
      <div className='mx-auto flex h-full max-w-[1440px] items-center justify-between gap-x-12'>
        <div className='school-principal-clip-path-left relative max-w-[calc(100%-40%)] bg-linear-to-b from-white/80 to-[#D8D8D8]/80 p-8 backdrop-blur-[80px]'>
          <Quote
            className='absolute top-8 left-8 size-[70px]! opacity-30'
            fill='currentColor'
          />
          <p className='text-justify'>{t('long_text')}</p>
          <div className='mt-4 flex items-center justify-between'>
            <p className='max-w-[calc(100%-40%)]'>{t('short_text')}</p>
            <div className='flex flex-col items-center justify-center'>
              {/* TODO: make name of director configurable through dashboard panel */}
              <span className='font-semibold uppercase'>Dr. Aziz Sair</span>
              <span className='italic'>{t('author_role')}</span>
            </div>
          </div>
        </div>
        <div className='school-principal-clip-path-right h-full bg-linear-to-t from-[#053371] to-[#4874B0]'>
          <Image
            alt='School Principal'
            className='h-full'
            height={500}
            src='/school-principal.png'
            width={700}
          />
        </div>
      </div>
    </section>
  )
}
