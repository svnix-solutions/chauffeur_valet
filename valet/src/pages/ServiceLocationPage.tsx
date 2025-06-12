import { useEffect, useState } from 'react'
import { useFrappeAuth } from 'frappe-react-sdk'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function ServiceLocationPage() {
  const { currentUser } = useFrappeAuth()
  const [serviceableCity, setServiceableCity] = useState((typeof currentUser === 'object' && currentUser?.serviceable_city) || '')
  const [serviceableZone, setServiceableZone] = useState((typeof currentUser === 'object' && currentUser?.serviceable_zone) || '')
  const [serviceableCities, setServiceableCities] = useState<string[]>([])
  const [serviceableZones, setServiceableZones] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // TODO: Replace with backend call
    setServiceableCities(['Mumbai', 'Delhi', 'Bangalore'])
  }, [])

  useEffect(() => {
    // TODO: Replace with backend call
    if (serviceableCity === 'Mumbai') setServiceableZones(['South Mumbai', 'Andheri', 'Borivali'])
    else if (serviceableCity === 'Delhi') setServiceableZones(['South Delhi', 'Dwarka', 'Rohini'])
    else if (serviceableCity === 'Bangalore') setServiceableZones(['Whitefield', 'Koramangala', 'Indiranagar'])
    else setServiceableZones([])
    setServiceableZone('')
  }, [serviceableCity])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // TODO: Save serviceable_city and serviceable_zone to backend
    setTimeout(() => setSaving(false), 1000)
  }

  return (
    <div className="mx-auto max-w-md py-6 px-2 min-h-screen flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Service Location</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSave}>
            <div>
              <Label htmlFor="serviceable_city">Serviceable City</Label>
              <select
                id="serviceable_city"
                className="w-full mt-1 rounded border px-3 py-2"
                value={serviceableCity}
                onChange={e => setServiceableCity(e.target.value)}
                required
              >
                <option value="" disabled>Select serviceable city</option>
                {serviceableCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="serviceable_zone">Serviceable Zone</Label>
              <select
                id="serviceable_zone"
                className="w-full mt-1 rounded border px-3 py-2"
                value={serviceableZone}
                onChange={e => setServiceableZone(e.target.value)}
                required
                disabled={!serviceableCity}
              >
                <option value="" disabled>Select serviceable zone</option>
                {serviceableZones.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
            <Button type="submit" className="w-full mt-2" disabled={saving}>
              {saving ? 'Saving...' : 'Save Location'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 