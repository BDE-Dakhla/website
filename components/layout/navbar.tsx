'use client'

import {
  GraduationCap,
  Handshake,
  Home,
  type LucideIcon,
  Menu,
  Newspaper,
  Phone,
  School,
  University,
  Users,
} from 'lucide-react'
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
import { Logo } from './logo'

interface MenuItem {
  title: string
  url: string
  description?: string
  icon?: LucideIcon
  items?: MenuItem[]
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
  const isActive = (href: string) => {
    const path = pathname ?? '/'
    if (href === '/') return path === '/'
    return path === href || path.startsWith(href + '/')
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
            url: '/campus',
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
            <NavigationMenu viewport={false}>
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
          <Button asChild size='sm'>
            <Link
              className='flex items-center gap-x-2'
              href='/syllabus'
              onClick={() => trackEvent('syllabus-button-header')}>
              <GraduationCap />
              {t('common.syllabus')}
            </Link>
          </Button>
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
              <div className='border-t py-4'>
                <div className='grid grid-cols-2 justify-start'>
                  {props.mobileExtraLinks?.map((link) => (
                    <Link
                      className='inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 font-medium text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-accent-foreground'
                      href={link.url}
                      key={link.name}>
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className='flex flex-col gap-3'>
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
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

const renderMenuItem = (
  item: MenuItem,
  isActive: (href: string) => boolean,
) => {
  if (item.items) {
    const groupActive =
      isActive(item.url) || item.items.some((sub) => isActive(sub.url))

    return (
      <NavigationMenuItem className='text-muted-foreground' key={item.title}>
        <NavigationMenuTrigger
          className={
            groupActive
              ? 'bg-muted text-accent-foreground'
              : 'text-muted-foreground'
          }>
          {item.icon && <item.icon className='mr-3' />}
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className='w-80 p-3'>
            {item.items.map((subItem) => (
              <li key={subItem.title}>
                <NavigationMenuLink asChild>
                  <Link
                    aria-current={isActive(subItem.url) ? 'page' : undefined}
                    className={`flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground ${isActive(subItem.url) ? 'bg-muted text-accent-foreground' : ''}`}
                    href={subItem.url}
                    onClick={() =>
                      trackEvent(
                        `nav-${subItem.title.toLowerCase().replace(/\s+/g, '-')}`,
                      )
                    }>
                    {subItem.icon && <subItem.icon />}
                    <span className='w-full'>
                      <span className='w-full font-semibold text-sm'>
                        {subItem.title}
                      </span>
                      {subItem.description && (
                        <p className='text-muted-foreground text-sm leading-snug'>
                          {subItem.description}
                        </p>
                      )}
                    </span>
                  </Link>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  const active = isActive(item.url)

  return (
    <Link
      aria-current={active ? 'page' : undefined}
      className={`flex w-max items-center justify-center rounded-md bg-background px-4 py-2 font-medium text-sm transition-colors hover:bg-muted hover:text-accent-foreground ${active ? 'bg-muted text-accent-foreground' : 'text-muted-foreground'}`}
      href={item.url}
      key={item.title}
      onClick={() =>
        trackEvent(`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`)
      }>
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
    const groupActive =
      isActive(item.url) || item.items.some((sub) => isActive(sub.url))

    return (
      <AccordionItem className='border-b-0' key={item.title} value={item.title}>
        <AccordionTrigger
          className={`py-0 font-semibold hover:no-underline ${groupActive ? 'text-accent-foreground' : ''}`}>
          {item.icon && <item.icon />}
          {item.title}
        </AccordionTrigger>
        <AccordionContent className='mt-2'>
          {item.items.map((subItem) => (
            <Link
              aria-current={isActive(subItem.url) ? 'page' : undefined}
              className={`flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground ${isActive(subItem.url) ? 'bg-muted text-accent-foreground' : ''}`}
              href={subItem.url}
              key={subItem.title}>
              {subItem.icon && <subItem.icon />}
              <div>
                <div className='font-semibold text-sm'>{subItem.title}</div>
                {subItem.description && (
                  <p className='text-muted-foreground text-sm leading-snug'>
                    {subItem.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </AccordionContent>
      </AccordionItem>
    )
  }

  const active = isActive(item.url)

  return (
    <Link
      aria-current={active ? 'page' : undefined}
      className={`font-semibold ${active ? 'text-accent-foreground' : ''}`}
      href={item.url}
      key={item.title}>
      {item.icon && <item.icon />}
      {item.title}
    </Link>
  )
}
