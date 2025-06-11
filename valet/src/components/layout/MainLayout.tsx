import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useFrappeAuth } from 'frappe-react-sdk'
import { Home, User, LogOut, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children?: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useFrappeAuth()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navItems = [
    {
      label: 'Home',
      icon: Home,
      path: '/'
    },
    {
      label: 'Transactions',
      icon: List,
      path: '/transactions'
    },
    {
      label: 'Profile',
      icon: User,
      path: '/profile'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {children || <Outlet />}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="flex justify-around items-center h-16 px-4">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "flex flex-col items-center gap-1 h-full",
                location.pathname === item.path && "text-primary"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </nav>
    </div>
  )
} 