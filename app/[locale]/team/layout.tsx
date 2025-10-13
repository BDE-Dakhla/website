import PublicLayout from '@/components/layout/public-layout'
import TeamHero from './hero'
import JoinOurTeam from './join-our-team'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PublicLayout>
      <TeamHero />
      {children}
      <JoinOurTeam />
    </PublicLayout>
  )
}
