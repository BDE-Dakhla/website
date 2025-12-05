'use client'

import { Footer } from '@/components/layout/footer'
import { NavBar } from '@/components/layout/navbar'
import {
  Partners,
  SchoolEcoWebConsumer,
  SchoolPrincipalEditorial,
  SchoolSection,
  SchoolStatistics,
} from '@/components/pages/home'

export default function Page() {
  return (
    <main>
      <NavBar />

      <SchoolPrincipalEditorial />
      <SchoolEcoWebConsumer />
      <SchoolStatistics />
      <SchoolSection />
      <Partners />

      <Footer />
    </main>
  )
}
