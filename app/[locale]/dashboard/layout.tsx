import { DashboardSideBar } from '@/components/dashboard-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)'
        } as React.CSSProperties
      }>
      <DashboardSideBar variant='floating' />
      <SidebarInset>
        <SiteHeader />
        <main className='@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl px-4 py-6'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
