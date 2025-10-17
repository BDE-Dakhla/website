import { Header } from '@/components/common/header'
import { Search } from '@/components/common/search'
import { DashboardSideBar } from '@/components/dashboard/dashboard-sidebar'
import { ProfileDropdown } from '@/components/profile/profile-dropdown'
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
        <DashboardSideBar />
        <SidebarInset>
          <Header fixed>
            <Search />
            <div className='ms-auto flex items-center space-x-4'>
              <ProfileDropdown />
            </div>
          </Header>
          <main className='@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl px-4 py-6'>
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </SearchProvider>
  )
}
