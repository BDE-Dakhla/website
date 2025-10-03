import { Header } from '@/components/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { SyllabusSidebar } from '@/components/syllabus-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { SearchProvider } from '@/hooks/use-search'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }>
        <SyllabusSidebar variant='inset' />
        <SidebarInset>
          <Header fixed>
            <Search />
            <div className='ms-auto flex items-center space-x-4'>
              <ProfileDropdown />
            </div>
          </Header>
          <div className='@container/main h-full p-4 xl:group-data-[theme-content-layout=centered]/layout:container xl:group-data-[theme-content-layout=centered]/layout:mx-auto'>
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SearchProvider>
  )
}
