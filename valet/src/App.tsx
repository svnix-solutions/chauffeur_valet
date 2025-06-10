import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { FrappeProvider } from 'frappe-react-sdk'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProtectedRoute from '@/components/ProtectedRoute'

// Pages
import LoginPage from './pages/auth/LoginPage'
import ProfilePage from './pages/profile/ProfilePage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import MainLayout from './components/layout/MainLayout'

function App() {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
          console.log('SW registered:', registration)
        }).catch(error => {
          console.log('SW registration failed:', error)
        })
      })
    }
  }, [])

  // Create a client
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <FrappeProvider>
        <Router basename="/valet">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<HomePage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster />
        </Router>
      </FrappeProvider>
    </QueryClientProvider>
  )
}

export default App
