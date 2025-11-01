import PublicLayout from '@/components/layout/public-layout'
import TeamHero from './hero'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PublicLayout>
      <TeamHero />
      {children}
      {/* <JoinOurTeam /> */}
    </PublicLayout>
  )
}
