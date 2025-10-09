import Illustration from './illustration'

export default function TeamHero() {
  return (
    <section
      aria-label='hero'
      className='@container/main mx-auto flex max-w-[1440px] items-center justify-between space-y-10 px-6'>
      <div className='space-y-8'>
        <h1 className='max-w-3xl bg-gradient-to-l from-black to-[#656565] bg-clip-text font-bold text-4xl text-transparent md:text-6xl'>
          Découvrez l'équipe derrière Apollo 9.0
        </h1>
        <p className='max-w-xl'>
          Ces maîtres de l'art font tout leur possible pour sortir un site de
          qualité pour les étudiants de l'ENCG de Dakhla. Leurs compétences sont
          au service de la mission de l'ENCG.
        </p>
      </div>
      <Illustration />
    </section>
  )
}
