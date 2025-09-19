import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto flex">
        <Sidebar />
        <main className="flex-1 min-h-screen border-x border-border">
          <Outlet />
        </main>
        {/* Right sidebar could go here */}
        <div className="w-80 p-4 hidden lg:block">
          {/* Trending, suggestions, etc. */}
        </div>
      </div>
    </div>
  )
}
