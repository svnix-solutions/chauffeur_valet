// @ts-ignore
// eslint-disable-next-line
declare global {
  interface Window {
    frappe: any;
  }
}

import { useState, useEffect } from 'react'
import { toast } from '@/components/ui/use-toast'
import { ValetDashboard } from '@/components/ValetDashboard'
import { useFrappeGetCall } from 'frappe-react-sdk'

export default function HomePage() {
  const [serviceableCity, setServiceableCity] = useState<string>('')
  const [serviceableZone, setServiceableZone] = useState<string>('')
  const [isConfigured, setIsConfigured] = useState(false)

  const { data, error, isLoading } = useFrappeGetCall('chauffeur_valet.valet.get_service_area')

  useEffect(() => {
    if (data?.message?.success) {
      const { city, zone } = data.message.data
      setServiceableCity(city)
      setServiceableZone(zone)
      setIsConfigured(true)
    }
  }, [data])

  if (error) {
    toast({ title: 'Error', description: error.message || 'Failed to fetch service areas', variant: 'destructive' })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!isConfigured) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Area Not Configured</h2>
          <p className="text-gray-600 mb-6">
            Your service areas (city and zone) have not been configured yet. Please contact your administrator to set up your service areas.
          </p>
          <div className="text-sm text-gray-500">
            <p>This is required to:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Receive ride requests in your service areas</li>
              <li>View and accept rides</li>
              <li>Track your earnings</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ValetDashboard serviceableCity={serviceableCity} serviceableZone={serviceableZone} />
    </div>
  )
}