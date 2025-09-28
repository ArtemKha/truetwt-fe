import type { LucideIcon } from 'lucide-react'
import { Home, User, Users } from 'lucide-react'

export interface NavigationItem {
  name: string
  href: string
  icon: LucideIcon
}

export const getNavigationItems = (userId?: string): NavigationItem[] => [
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
    href: `/profile/${userId}`,
    icon: User,
  },
]
