import { SiteHeader } from '@/components/site-header'
import { SyllabusSidebar } from '@/components/syllabus-sidebar'
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
      <SyllabusSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='@container/main h-full p-4 xl:group-data-[theme-content-layout=centered]/layout:container xl:group-data-[theme-content-layout=centered]/layout:mx-auto'>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
