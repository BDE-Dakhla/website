'use client'

import {
  GraduationCap,
  Handshake,
  Home,
  type LucideIcon,
  Menu,
  Newspaper,
  Phone,
  University,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
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
import { Link } from '@/i18n/routing'

interface MenuItem {
  title: string
  url: string
  description?: string
  icon?: LucideIcon
  items?: MenuItem[]
}

interface NavBarProps {
  menu?: MenuItem[]
  mobileExtraLinks?: {
    name: string
    url: string
  }[]
}

export const NavBar = (props: NavBarProps): React.ReactElement => {
  const t = useTranslations()

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
      },
      {
        title: 'Clubs',
        url: '/clubs',
        description: 'Les clubs wolla',
        icon: University,
        items: [
          {
            title: 'jaaaj',
            url: '/',
            description: 'oui',
            icon: Users,
          },
          {
            title: 'jaaaj2',
            url: '/xd',
            description: 'ouis',
            icon: Users,
          },
        ],
      },
      {
        title: 'Nos partenaires',
        url: '/parnters',
        description: 'dzdzdzdzd',
        icon: Handshake,
      },
    ],
  } = props

  return (
    <header className='container mx-auto p-8'>
      <nav className='hidden justify-between lg:flex'>
        <div className='flex items-center gap-6'>
          <Link className='flex items-center gap-2' href='/'>
            <Image alt='Logo' height={32} src='/icons/logo.svg' width={150} />
          </Link>
          <div className='flex items-center'>
            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                {menu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div className='flex gap-2'>
          <Button size='sm' variant='outline'>
            <Phone />
            <Link href='/contact'>Nous contacter</Link>
          </Button>
          <Button size='sm'>
            <Link className='flex items-center gap-x-2' href='/syllabus'>
              <GraduationCap /> {t('common.syllabus')}
            </Link>
          </Button>
        </div>
      </nav>

      <div className='flex items-center justify-between lg:hidden'>
        <Link className='flex items-center gap-2' href='/'>
          <Image alt='Logo' height={32} src='/icons/logo.svg' width={32} />
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
                  <Image
                    alt='Logo'
                    height={32}
                    src='/icons/logo.svg'
                    width={32}
                  />
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className='my-6 flex flex-col gap-6'>
              <Accordion
                className='flex w-full flex-col gap-4'
                collapsible
                type='single'>
                {menu.map((item) => renderMobileMenuItem(item))}
              </Accordion>
              <div className='border-t py-4'>
                <div className='grid grid-cols-2 justify-start'>
                  {/* {mobileExtraLinks.map((link) => (
                    <Link
                      className='inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground'
                      href={link.url}
                      key={link.name}>
                      {link.name}
                    </Link>
                  ))} */}
                </div>
              </div>
              <div className='flex flex-col gap-3'>
                {/* <Button asChild size='sm' variant='outline'>
            <Link href={auth.login.url}>{auth.login.text}</Link>
          </Button> */}
                <Button asChild size='sm'>
                  <GraduationCap />
                  <Link href='/syllabus'>{t('common.syllabus')}</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem className='text-muted-foreground' key={item.title}>
        <NavigationMenuTrigger>
          {item.icon && <item.icon className='mr-2' />}
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className='w-80 p-3'>
            <NavigationMenuLink>
              {item.items.map((subItem) => (
                <li key={subItem.title}>
                  <a
                    className='flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground'
                    href={subItem.url}>
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
                  </a>
                </li>
              ))}
            </NavigationMenuLink>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  return (
    <Link
      className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 font-medium text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-accent-foreground'
      href={item.url}
      key={item.title}>
      {item.icon && <item.icon className='mr-2' />}
      {item.title}
    </Link>
  )
}

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem className='border-b-0' key={item.title} value={item.title}>
        <AccordionTrigger className='py-0 font-semibold hover:no-underline'>
          *{item.icon && <item.icon />}
          {item.title}
        </AccordionTrigger>
        <AccordionContent className='mt-2'>
          {item.items.map((subItem) => (
            <Link
              className='flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground'
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

  return (
    <Link className='font-semibold' href={item.url} key={item.title}>
      {item.icon && <item.icon />}
      {item.title}
    </Link>
  )
}
