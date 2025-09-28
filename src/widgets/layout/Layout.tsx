import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto flex px-0 sm:px-6 lg:px-8">
        {/* Main content area */}
        <main className="flex-1 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
