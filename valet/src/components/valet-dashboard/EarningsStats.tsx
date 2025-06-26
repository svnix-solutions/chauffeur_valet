import React from 'react'
import { useFrappeGetDocList } from 'frappe-react-sdk'
import type { Ride } from '../types'

export function EarningsStats() {
  const { data: completedRides = [] } = useFrappeGetDocList<Ride>('Ride', {
    filters: [
      ['status', '=', 'Completed'],
      ['scheduled_time', '>=', new Date().toISOString().split('T')[0]]
    ],
    fields: ['total_amount', 'received_amount']
  })

  const todayEarnings = completedRides.reduce((sum, ride) => sum + (ride.received_amount || ride.total_amount || 0), 0)
  const totalBilled = completedRides.reduce((sum, ride) => sum + (ride.total_amount || 0), 0)
  const totalReceived = completedRides.reduce((sum, ride) => sum + (ride.received_amount || 0), 0)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900">Today's Earnings</h3>
      <p className="text-3xl font-bold text-green-600 mt-2">${todayEarnings.toFixed(2)}</p>
      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <p>Total Billed: ${totalBilled.toFixed(2)}</p>
        <p>Total Received: ${totalReceived.toFixed(2)}</p>
        {totalBilled > totalReceived && (
          <p className="text-orange-600">Pending: ${(totalBilled - totalReceived).toFixed(2)}</p>
        )}
      </div>
    </div>
  )
} 