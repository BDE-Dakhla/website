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
      <div className='mx-auto flex h-full max-w-[1440px] items-center justify-center'>
        <div className='school-principal-clip-path-left relative w-full min-w-[1025px] translate-x-20 bg-linear-to-b from-white/80 to-[#D8D8D8]/80 p-10 pr-50 backdrop-blur-[80px]'>
          <Quote
            className='absolute top-8 left-8 size-[70px]! rotate-180 opacity-20'
            fill='currentColor'
          />
          <p className='pl-20 text-justify italic tracking-wide'>
            {t('long_text')}
          </p>
          <div className='mt-4 flex items-center justify-between'>
            <p className='max-w-[calc(100%-40%)] italic tracking-wider'>
              {t('short_text')}
            </p>
            <div className='flex flex-col items-center justify-center'>
              {/* TODO: make name of director configurable through dashboard panel */}
              <span className='font-bold uppercase'>Dr. Aziz Sair</span>
              <span>{t('author_role')}</span>
            </div>
          </div>
        </div>
        <div className='school-principal-clip-path-right flex h-full min-w-[600px] items-end justify-center bg-linear-to-br from-[#4874B0] to-[#053371]'>
          <Image
            alt='School Principal'
            className='drop-shadow-2xl'
            height={400}
            src='/school-principal.png'
            width={300}
          />
        </div>
      </div>
    </section>
  )
}
