import { ArrowRight } from 'lucide-react'
import { Footer } from '@/components/layout/footer'
import { NavBar } from '@/components/layout/navbar'

type TeamCardProps = {
  name: string
  poste: string
}

const TeamCard = ({ name, poste }: TeamCardProps) => {
  return (
    <li
      aria-label='president'
      className='relative h-[330px] w-[250px] rounded-3xl shadow-[0_16px_45.5px_0_rgba(0,0,0,0.50),0_-88px_163.5px_0_rgba(0,0,0,0.89)_inset]'
      style={{
        background: `url(/team/president.png) no-repeat center`,
        backgroundSize: 'cover',
      }}>
      <div className='custom-borders absolute right-0 bottom-4 left-0 mx-2.5 grid h-[70px] grid-cols-[1fr_45px] overflow-hidden rounded-2xl bg-gradient-to-tl from-[#000000]/70 to-[#1B1B1B]/70 pl-4 shadow-[0_15px_52.3px_0_rgba(0,0,0,0.51)] backdrop-blur-xs'>
        <div className='flex flex-col justify-center'>
          <p className='text-sm text-white uppercase opacity-75'>{poste}</p>
          <p className='font-bold text-lg text-white uppercase tracking-wider'>
            {name}
          </p>
        </div>
        <div className='grid place-items-center rounded-tr-2xl rounded-br-2xl bg-white/10'>
          <ArrowRight color='white' />
        </div>
      </div>
    </li>
  )
}

export default function Page() {
  return (
    <ul aria-label='team-members'>
      <NavBar />
      <ul className='container mx-auto mt-10'>
        <TeamCard name='Président' poste='ABDELATIF SEHTOUT' />
      </ul>
      <Footer />
    </ul>
  )
}
