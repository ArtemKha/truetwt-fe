import { LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { Avatar, AvatarFallback } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { DesktopNavigation } from './DesktopNavigation'
import { MobileNavigationSheet } from './MobileNavigationSheet'

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-primary">TrueTweet</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <DesktopNavigation />

          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, @{user?.username}
            </span>

            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {user?.username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {user?.username?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <MobileNavigationSheet />
        </div>
      </div>
    </header>
  )
}
