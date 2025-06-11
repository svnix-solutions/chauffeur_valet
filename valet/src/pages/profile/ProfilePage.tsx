import { useFrappeAuth } from 'frappe-react-sdk'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { LogOut, Bell, HelpCircle, Settings, Shield, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const { currentUser, logout } = useFrappeAuth()
  const navigate = useNavigate()
  const user = {
    name: currentUser?.full_name || currentUser?.name || 'Administrator',
    email: currentUser?.email || 'admin@example.com',
  }
  const initials = user.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="mx-auto max-w-md py-6 px-2 min-h-screen flex flex-col gap-6">
      {/* User Card */}
      <Card>
        <CardContent className="flex items-center gap-4 py-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-3xl font-bold text-primary">
            {initials}
          </div>
          <div>
            <div className="text-2xl font-bold leading-tight">{user.name}</div>
            <div className="text-muted-foreground text-base">{user.email}</div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Card */}
      <Card>
        <CardHeader className="text-2xl font-bold pb-2">Settings</CardHeader>
        <CardContent className="flex flex-col gap-4 py-2">
          <div className="flex items-center gap-3 cursor-pointer hover:bg-muted rounded px-2 py-2" onClick={() => navigate('/service-location')}>
            <MapPin className="w-5 h-5" />
            <span className="text-base">Service Location</span>
          </div>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-muted rounded px-2 py-2" onClick={() => navigate('/settings/account')}>
            <Settings className="w-5 h-5" />
            <span className="text-base">Account Settings</span>
          </div>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-muted rounded px-2 py-2" onClick={() => navigate('/settings/notifications')}>
            <Bell className="w-5 h-5" />
            <span className="text-base">Notifications</span>
          </div>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-muted rounded px-2 py-2" onClick={() => navigate('/settings/privacy')}>
            <Shield className="w-5 h-5" />
            <span className="text-base">Privacy & Security</span>
          </div>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-muted rounded px-2 py-2" onClick={() => navigate('/settings/help')}>
            <HelpCircle className="w-5 h-5" />
            <span className="text-base">Help & Support</span>
          </div>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 justify-start px-2 py-2 mt-2"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 