import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { Button } from '@/shared/ui/button'
import { Home, Users, User } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export function Sidebar() {
  const location = useLocation()
  const { user } = useAuth()

  const navigation = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
    },
    {
      name: 'Profile',
      href: `/profile/${user?.id}`,
      icon: User,
    },
  ]

  return (
    <aside className="w-64 p-4 border-r border-border">
      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Button
              key={item.name}
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start',
                isActive && 'bg-secondary'
              )}
              asChild
            >
              <Link to={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          )
        })}
      </nav>
    </aside>
  )
}
