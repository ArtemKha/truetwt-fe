import { LogOut, Menu } from 'lucide-react'
import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { cn, getNavigationItems } from '@/shared/lib'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet'

export function MobileNavigationSheet() {
  const [open, setOpen] = React.useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const navigation = getNavigationItems(user?.id)

  const handleLinkClick = () => {
    setOpen(false)
  }

  const handleLogout = () => {
    logout()
    setOpen(false)
  }

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative z-50"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-80 p-0">
          <div className="flex flex-col h-full">
            {/* Header with user info */}
            <SheetHeader className="p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-sm">
                    {user?.username?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <SheetTitle className="text-base truncate">
                    @{user?.username}
                  </SheetTitle>
                  <p className="text-sm text-muted-foreground">Welcome back!</p>
                </div>
              </div>
            </SheetHeader>

            {/* Navigation menu */}
            <div className="flex-1 p-4">
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Button
                      key={item.name}
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full justify-start h-12 px-4',
                        isActive && 'bg-secondary text-secondary-foreground'
                      )}
                      asChild
                    >
                      <Link to={item.href} onClick={handleLinkClick}>
                        <item.icon className="mr-3 h-5 w-5" />
                        <span className="text-base">{item.name}</span>
                      </Link>
                    </Button>
                  )
                })}
              </nav>
            </div>

            {/* Logout button */}
            <div className="p-4 border-t border-border">
              <Button
                variant="ghost"
                size="lg"
                onClick={handleLogout}
                className="w-full justify-start h-12 px-4 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span className="text-base">Sign Out</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
