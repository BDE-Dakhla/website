import { auth } from '@/auth'
import { Header } from '@/components/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { SyllabusSidebar } from '@/components/syllabus-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { SyllabusNavigationProvider } from '@/contexts/syllabus-navigation'
import { SearchProvider } from '@/hooks/use-search'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className='syllabus-theme'>
      <SyllabusNavigationProvider>
        <SearchProvider>
          <SidebarProvider
            style={
              {
                '--sidebar-width': 'calc(var(--spacing) * 72)',
                '--header-height': 'calc(var(--spacing) * 12)',
              } as React.CSSProperties
            }>
            <SyllabusSidebar />
            <SidebarInset>
              <Header fixed>
                <Search />
                <div className='ms-auto flex items-center space-x-4'>
                  <ProfileDropdown profile={session?.user} />
                </div>
              </Header>
              <div className='@container/main h-full p-4 xl:group-data-[theme-content-layout=centered]/layout:container xl:group-data-[theme-content-layout=centered]/layout:mx-auto'>
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </SearchProvider>
      </SyllabusNavigationProvider>
    </div>
  )
}
