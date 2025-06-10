import { useState, useEffect } from 'react'
import { useFrappeAuth, useFrappeGetDoc } from 'frappe-react-sdk'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface ValetProfile {
  name: string
  full_name: string
  email: string
  phone: string
  address: string
  vehicle_number: string
  vehicle_type: string
  license_number: string
}

export default function ProfilePage() {
  const { currentUser } = useFrappeAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<ValetProfile>({
    name: '',
    full_name: '',
    email: '',
    phone: '',
    address: '',
    vehicle_number: '',
    vehicle_type: '',
    license_number: ''
  })

  const { data, isLoading: isLoadingProfile } = useFrappeGetDoc<ValetProfile>(
    'Valet',
    currentUser || ''
  )

  useEffect(() => {
    if (data) {
      setProfile(data)
    }
  }, [data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implement profile update
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update profile. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage your valet profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle_number">Vehicle Number</Label>
                <Input
                  id="vehicle_number"
                  value={profile.vehicle_number}
                  onChange={(e) => setProfile({ ...profile, vehicle_number: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle_type">Vehicle Type</Label>
                <Input
                  id="vehicle_type"
                  value={profile.vehicle_type}
                  onChange={(e) => setProfile({ ...profile, vehicle_type: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license_number">License Number</Label>
                <Input
                  id="license_number"
                  value={profile.license_number}
                  onChange={(e) => setProfile({ ...profile, license_number: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 