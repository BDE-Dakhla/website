'use client'

import {
  GraduationCap,
  Handshake,
  Home,
  LayoutDashboard,
  type LucideIcon,
  Menu,
  Newspaper,
  Phone,
  School,
  University,
  Users,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { trackEvent } from '@/components/common/analytics-tracker'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Link, usePathname } from '@/i18n/routing'
import { hasPermission } from '@/lib/permission'
import { cn } from '@/lib/utils'
import { RainbowButton } from '../ui/rainbow-button'
import { Logo } from './logo'

interface MenuItem {
  title: string
  url: string
  description?: string
  icon?: LucideIcon
  items?: MenuItem[]
  featured?: boolean
  image?: string
}

interface NavBarProps {
  menu?: MenuItem[]
  mobileExtraLinks?: Array<{
    name: string
    url: string
  }>
}

export const NavBar = (props: NavBarProps): React.ReactElement => {
  const t = useTranslations()
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (href: string) => {
    const path = pathname ?? '/'
    if (href === '/') return path === '/'
    return path === href || path.startsWith(`${href}/`)
  }

  const {
    menu = [
      { title: 'Accueil', url: '/', description: 'Page', icon: Home },
      {
        title: 'Équipe',
        url: '/team',
        description: 'Flux équipe',
        icon: Users,
      },
      {
        title: 'Actualités',
        url: '/news',
        description: "L'actualité wolla",
        icon: Newspaper,
        items: [
          {
            title: 'Notre Campus',
            url: '/news/campus',
            description:
              "Consultez tout ce qui s'est passé les années précédentes à notre campus.",
            icon: School,
            featured: true,
            image: '/campus.png',
          },
          {
            title: 'Notre Campus2',
            url: '/news',
            description:
              "Consultez tout ce qui s'est passé les années précédentes à notre campus.",
            icon: School,
          },
          {
            title: 'Notre Campus3',
            url: '/news',
            description:
              "Consultez tout ce qui s'est passé les années précédentes à notre campus.",
            icon: School,
          },
        ],
      },
      {
        title: 'Clubs',
        url: '/clubs',
        description: 'Les clubs wolla',
        icon: University,
      },
      {
        title: 'Nos partenaires',
        url: '/partners',
        description: 'dzdzdzdzd',
        icon: Handshake,
      },
    ],
  } = props

  return (
    <header className='container mx-auto p-8'>
      <nav className='hidden items-center justify-between lg:flex'>
        <div className='flex items-center gap-6'>
          <Link className='flex items-center gap-2' href='/'>
            <Logo />
          </Link>
          <div className='flex items-center'>
            <NavigationMenu>
              <NavigationMenuList className='gap-x-2'>
                {menu.map((item) => renderMenuItem(item, isActive))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div className='flex gap-2'>
          <Button asChild size='sm' variant='outline'>
            <Link
              className='!px-3 flex items-center gap-x-2 py-4'
              href='/contact'
              onClick={() => trackEvent('contact-button-header')}>
              <Phone className='!size-4' />
              Nous contacter
            </Link>
          </Button>
          <Button
            asChild
            className='!px-4 bg-gradient-to-t from-green-700/60 to-green-400/60 text-white shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.3)] hover:bg-gradient'
            size='sm'>
            <Link
              className='flex items-center gap-x-2'
              href='/syllabus'
              onClick={() => trackEvent('syllabus-button-header')}>
              <GraduationCap />
              {t('common.syllabus')}
            </Link>
          </Button>
          {hasPermission(
            session?.user.permissions,
            'HAS_ACCESS_TO_DASHBOARD',
          ) && (
            <RainbowButton asChild size='icon' variant='outline'>
              <Link href='/dashboard'>
                <LayoutDashboard />
              </Link>
            </RainbowButton>
          )}
        </div>
      </nav>

      <div className='flex items-center justify-between lg:hidden'>
        <Link className='flex items-center gap-2' href='/'>
          <Logo />
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button size='icon' variant='outline'>
              <Menu className='size-4' />
            </Button>
          </SheetTrigger>
          <SheetContent className='overflow-y-auto'>
            <SheetHeader>
              <SheetTitle>
                <Link className='flex items-center gap-2' href='/'>
                  <Logo />
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className='my-6 flex flex-col gap-6'>
              <Accordion
                className='flex w-full flex-col gap-4'
                collapsible
                type='single'>
                {menu.map((item) => renderMobileMenuItem(item, isActive))}
              </Accordion>
              <div className='grid grid-cols-2 justify-start border-t py-4'>
                {props.mobileExtraLinks?.map((link) => (
                  <Link
                    className='inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 font-medium text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-accent-foreground'
                    href={link.url}
                    key={link.name}>
                    {link.name}
                  </Link>
                ))}
              </div>
              <Button asChild size='sm'>
                <Link
                  className='flex items-center gap-x-2'
                  href='/syllabus'
                  onClick={() => trackEvent('syllabus-button-header-mobile')}>
                  <GraduationCap />
                  {t('common.syllabus')}
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

const isGroupActive = (item: MenuItem, isActive: (href: string) => boolean) =>
  item.items?.some((sub) => isActive(sub.url)) || false

const getNavEventName = (title: string) =>
  `nav-${title.toLowerCase().replace(/\s+/g, '-')}`

const MenuItemContent = ({ item }: { item: MenuItem }) => (
  <>
    {item.icon && <item.icon />}
    <div>
      <div className='font-semibold text-sm'>{item.title}</div>
      {item.description && (
        <p className='text-muted-foreground text-sm leading-snug'>
          {item.description}
        </p>
      )}
    </div>
  </>
)

const renderMenuItem = (
  item: MenuItem,
  isActive: (href: string) => boolean,
) => {
  if (item.items) {
    const groupActive = isGroupActive(item, isActive)
    const featuredItems = item.items.filter((i) => i.featured)
    const regularItems = item.items.filter((i) => !i.featured)
    const hasFeatures = featuredItems.length > 0

    return (
      <NavigationMenuItem className='text-muted-foreground' key={item.title}>
        <NavigationMenuTrigger
          className={cn(
            'text-muted-foreground',
            groupActive && 'bg-muted text-accent-foreground',
          )}>
          {item.icon && <item.icon className='mr-3' />}
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul
            className={cn(
              'p-3',
              hasFeatures
                ? 'grid w-[600px] grid-cols-[250px_1fr] gap-3'
                : 'w-80',
            )}>
            {hasFeatures && (
              <li className='row-span-full'>
                {featuredItems.map((featuredItem) => {
                  const active = isActive(featuredItem.url)
                  return (
                    <NavigationMenuLink asChild key={featuredItem.title}>
                      <Link
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex h-full w-full select-none flex-col justify-end gap-2 rounded-md p-6 no-underline outline-none transition-colors',
                          featuredItem.image
                            ? 'bg-center bg-cover text-white hover:opacity-90'
                            : 'bg-muted/50 hover:bg-muted',
                          active &&
                            !featuredItem.image &&
                            'bg-muted text-accent-foreground',
                        )}
                        href={featuredItem.url}
                        onClick={() =>
                          trackEvent(getNavEventName(featuredItem.title))
                        }
                        style={
                          featuredItem.image
                            ? {
                                backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)), url(${featuredItem.image})`,
                              }
                            : undefined
                        }>
                        {featuredItem.icon && (
                          <featuredItem.icon className='size-6' />
                        )}
                        <div className='mt-4 mb-2 font-semibold text-lg'>
                          {featuredItem.title}
                        </div>
                        {featuredItem.description && (
                          <p
                            className={cn(
                              'text-sm leading-snug',
                              featuredItem.image
                                ? 'text-white/90'
                                : 'text-muted-foreground',
                            )}>
                            {featuredItem.description}
                          </p>
                        )}
                      </Link>
                    </NavigationMenuLink>
                  )
                })}
              </li>
            )}
            <li className='flex flex-col gap-1'>
              {(hasFeatures ? regularItems : item.items).map((subItem) => {
                const active = isActive(subItem.url)
                return (
                  <NavigationMenuLink asChild key={subItem.title}>
                    <Link
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground',
                        active && 'bg-muted text-accent-foreground',
                      )}
                      href={subItem.url}
                      onClick={() =>
                        trackEvent(getNavEventName(subItem.title))
                      }>
                      <MenuItemContent item={subItem} />
                    </Link>
                  </NavigationMenuLink>
                )
              })}
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  const active = isActive(item.url)

  return (
    <Link
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex w-max items-center justify-center rounded-md px-4 py-2 font-medium text-sm transition-colors hover:bg-muted hover:text-accent-foreground',
        active ? 'bg-muted text-accent-foreground' : 'text-muted-foreground',
      )}
      href={item.url}
      key={item.title}
      onClick={() => trackEvent(getNavEventName(item.title))}>
      {item.icon && <item.icon className='mr-3' />}
      <span>{item.title}</span>
    </Link>
  )
}

const renderMobileMenuItem = (
  item: MenuItem,
  isActive: (href: string) => boolean,
) => {
  if (item.items) {
    const groupActive = isGroupActive(item, isActive)

    return (
      <AccordionItem className='border-b-0' key={item.title} value={item.title}>
        <AccordionTrigger
          className={cn(
            'py-0 font-semibold hover:no-underline',
            groupActive && 'text-accent-foreground',
          )}>
          {item.icon && <item.icon />}
          {item.title}
        </AccordionTrigger>
        <AccordionContent className='mt-2'>
          {item.items.map((subItem) => {
            const active = isActive(subItem.url)
            return (
              <Link
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground',
                  active && 'bg-muted text-accent-foreground',
                )}
                href={subItem.url}
                key={subItem.title}>
                <MenuItemContent item={subItem} />
              </Link>
            )
          })}
        </AccordionContent>
      </AccordionItem>
    )
  }

  const active = isActive(item.url)

  return (
    <Link
      aria-current={active ? 'page' : undefined}
      className={cn('font-semibold', active && 'text-accent-foreground')}
      href={item.url}
      key={item.title}>
      {item.icon && <item.icon />}
      {item.title}
    </Link>
  )
}
