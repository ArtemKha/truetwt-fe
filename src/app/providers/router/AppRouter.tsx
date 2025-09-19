import { Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { LoginPage } from '@/pages/auth/login'
import { RegisterPage } from '@/pages/auth/register'
import { ProfilePage } from '@/pages/profile'
import { UsersPage } from '@/pages/users'
import { PostPage } from '@/pages/post'
import { ProtectedRoute } from './ProtectedRoute'
import { Layout } from '@/widgets/layout'

export function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/post/:postId" element={<PostPage />} />
      </Route>
    </Routes>
  )
}
