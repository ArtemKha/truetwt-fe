import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { cn, getNavigationItems } from '@/shared/lib'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/shared/ui/navigationMenu'

// Desktop Navigation Menu Component
export function DesktopNavigation() {
  const location = useLocation()
  const { user } = useAuth()

  const navigation = getNavigationItems(user?.id)

  return (
    <div className="hidden md:flex">
      <NavigationMenu>
        <NavigationMenuList>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <NavigationMenuItem key={item.name}>
                <NavigationMenuLink asChild>
                  <Link
                    to={item.href}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'flex items-center space-x-2',
                      isActive && 'bg-accent text-accent-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
