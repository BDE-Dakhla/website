import { Footer } from '@/components/layout/footer'
import { NavBar } from '@/components/layout/navbar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  )
}
