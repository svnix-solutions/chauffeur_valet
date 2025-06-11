import { useEffect, useState } from 'react'
import { useFrappeAuth } from 'frappe-react-sdk'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function ServiceLocationPage() {
  const { currentUser } = useFrappeAuth()
  const [city, setCity] = useState(currentUser?.city || '')
  const [zone, setZone] = useState(currentUser?.zone || '')
  const [cities, setCities] = useState<string[]>([])
  const [zones, setZones] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // TODO: Replace with backend call
    setCities(['Mumbai', 'Delhi', 'Bangalore'])
  }, [])

  useEffect(() => {
    // TODO: Replace with backend call
    if (city === 'Mumbai') setZones(['South Mumbai', 'Andheri', 'Borivali'])
    else if (city === 'Delhi') setZones(['South Delhi', 'Dwarka', 'Rohini'])
    else if (city === 'Bangalore') setZones(['Whitefield', 'Koramangala', 'Indiranagar'])
    else setZones([])
    setZone('')
  }, [city])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // TODO: Save city and zone to backend
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
              <Label htmlFor="city">City</Label>
              <select
                id="city"
                className="w-full mt-1 rounded border px-3 py-2"
                value={city}
                onChange={e => setCity(e.target.value)}
                required
              >
                <option value="" disabled>Select city</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="zone">Zone</Label>
              <select
                id="zone"
                className="w-full mt-1 rounded border px-3 py-2"
                value={zone}
                onChange={e => setZone(e.target.value)}
                required
                disabled={!city}
              >
                <option value="" disabled>Select zone</option>
                {zones.map(z => <option key={z} value={z}>{z}</option>)}
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