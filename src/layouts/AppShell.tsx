import { Home, Leaf, CalendarDays, Menu, Plus } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

import { Button, Sheet, SheetContent, SheetTrigger } from '@/components/ui'
import { cn } from '@/lib/utils'

const navItems = [
  {
    to: '/',
    label: '대시보드',
    icon: Home,
  },
  {
    to: '/plants',
    label: '식물',
    icon: Leaf,
  },
  {
    to: '/calendar',
    label: '캘린더',
    icon: CalendarDays,
  },
]

function NavItem({ to, label, icon: Icon }: (typeof navItems)[number]) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
          isActive
            ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
            : 'text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-muted)]',
        )
      }
    >
      <Icon className='h-4 w-4' />
      {label}
    </NavLink>
  )
}

function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline' size='icon'>
          <Menu className='h-4 w-4' />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='pt-12'>
        <div className='flex flex-col gap-2'>
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function AppShell() {
  return (
    <div className='min-h-screen pb-20 lg:pb-0'>
      <header className='sticky top-0 z-30 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg),white_32%)]/90 backdrop-blur-md'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6'>
          <div className='flex items-center gap-3'>
            <div className='lg:hidden'>
              <MobileMenu />
            </div>
            <div>
              <p className='text-xs font-medium tracking-[0.12em] text-[var(--color-fg-muted)]'>SUNLIGHT</p>
              <h1 className='text-lg'>식물 케어 매니저</h1>
            </div>
          </div>

          <Button asChild>
            <NavLink to='/plants/new'>
              <Plus className='h-4 w-4' /> 새 식물
            </NavLink>
          </Button>
        </div>
      </header>

      <div className='mx-auto grid max-w-7xl gap-6 px-4 py-6 md:px-6 lg:grid-cols-[220px,1fr]'>
        <aside className='hidden lg:block'>
          <div className='sticky top-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-card)]'>
            <nav className='flex flex-col gap-1'>
              {navItems.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </nav>
          </div>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>

      <nav className='fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface)] p-2 lg:hidden'>
        <div className='mx-auto grid max-w-md grid-cols-3 gap-2'>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-center gap-1 rounded-lg py-2 text-xs font-medium',
                  isActive
                    ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                    : 'text-[var(--color-fg-muted)]',
                )
              }
            >
              <item.icon className='h-4 w-4' />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
