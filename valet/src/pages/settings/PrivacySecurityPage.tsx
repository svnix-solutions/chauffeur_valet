import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacySecurityPage() {
  const [publicProfile, setPublicProfile] = useState(false)
  const [changing, setChanging] = useState(false)

  const handleChangePassword = () => {
    setChanging(true)
    // TODO: Implement change password logic/modal
    setTimeout(() => setChanging(false), 1000)
  }

  return (
    <div className="mx-auto max-w-md py-6 px-2 min-h-screen flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Privacy & Security</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 mt-2">
            <div className="flex items-center justify-between">
              <span>Show profile publicly</span>
              <Switch checked={publicProfile} onCheckedChange={setPublicProfile} />
            </div>
            <Button className="w-full" onClick={handleChangePassword} disabled={changing}>
              {changing ? 'Processing...' : 'Change Password'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 