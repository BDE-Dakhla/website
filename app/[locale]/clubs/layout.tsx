import { Footer } from '@/components/layout/footer'
import { NavBar } from '@/components/layout/navbar'

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  )
}
