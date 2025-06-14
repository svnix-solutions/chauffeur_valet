import React from 'react'
import { useFrappeGetDocList } from 'frappe-react-sdk'
import type { Ride } from '../types'

interface RideStatsProps {
  serviceableCity: string
  serviceableZone: string
}

export function RideStats({ serviceableCity, serviceableZone }: RideStatsProps) {
  const { data: rides = [] } = useFrappeGetDocList<Ride>('Ride', {
    filters: [
      ['status', 'in', ['Pending', 'Viewed', 'Accepted', 'On the Way', 'Reached', 'In Progress']],
      ['scheduled_time', '>=', new Date().toISOString().split('T')[0]],
      ['serviceable_city', '=', serviceableCity],
      ['serviceable_zone', '=', serviceableZone]
    ],
    fields: ['status']
  })

  const activeRidesCount = rides.filter((ride) => 
    ['Accepted', 'On the Way', 'Reached', 'In Progress'].includes(ride.status)
  ).length

  const newRequestsCount = rides.filter((ride) => ride.status === 'Pending').length

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900">Active Rides</h3>
        <p className="text-3xl font-bold text-blue-600 mt-2">{activeRidesCount}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900">New Requests</h3>
        <p className="text-3xl font-bold text-yellow-600 mt-2">{newRequestsCount}</p>
      </div>
    </>
  )
} 