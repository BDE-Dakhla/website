import { Footer } from './footer'
import { NavBar } from './navbar'

export default function PublicLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  )
}
