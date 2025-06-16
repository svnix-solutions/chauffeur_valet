import React, { useState } from 'react'
import { useFrappeGetDocList } from 'frappe-react-sdk'
import { RideCard } from './RideCard'
import { RideDetails } from './RideDetails'
import type { Ride } from './types'

export const RideList: React.FC = () => {
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null)

  const { data: rides, mutate } = useFrappeGetDocList<Ride>(
    'Ride',
    {
      fields: ['name', 'status', 'pickup_location', 'dropoff_location', 'scheduled_time', 'customer', 'total_amount', 'serviceable_city', 'serviceable_zone', 'otp'],
      filters: [['status', '!=', 'Completed']],
      orderBy: {
        field: 'scheduled_time',
        order: 'asc'
      }
    }
  )

  const handleRideClick = (ride: Ride) => {
    setSelectedRide(ride)
  }

  const handleCloseDetails = () => {
    setSelectedRide(null)
  }

  const handleStatusChange = () => {
    mutate()
  }

  if (!rides) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      {rides.map((ride) => (
        <RideCard
          key={ride.name}
          ride={ride}
          onClick={handleRideClick}
        />
      ))}
      {selectedRide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <RideDetails
              ride={selectedRide}
              onClose={handleCloseDetails}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      )}
    </div>
  )
} 