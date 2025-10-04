import { Telescope } from 'lucide-react'

export function ComingSoon() {
  return (
    <div className='m-auto flex h-[calc(100svh-7rem)] w-full flex-col items-center justify-center gap-2'>
      <Telescope className='!size-24' strokeWidth={3} />
      <h1 className='font-bold text-4xl leading-tight'>Bientôt sur vos écrans !</h1>
      <p className='text-center text-muted-foreground'>
        Cette page n&apos;a pas été créée pour le moment. <br />
        Mais restez à l&apos;écoute !
      </p>
    </div>
  )
}
