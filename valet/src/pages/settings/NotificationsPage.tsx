import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotificationsPage() {
  const [push, setPush] = useState(true)
  const [email, setEmail] = useState(true)
  const [sms, setSms] = useState(false)

  return (
    <div className="mx-auto max-w-md py-6 px-2 min-h-screen flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 mt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="push">Push Notifications</Label>
              <Switch id="push" checked={push} onCheckedChange={setPush} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email">Email Notifications</Label>
              <Switch id="email" checked={email} onCheckedChange={setEmail} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms">SMS Notifications</Label>
              <Switch id="sms" checked={sms} onCheckedChange={setSms} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 