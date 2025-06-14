import React from 'react'

interface StatsCardsProps {
  todayEarnings: number
  activeRidesCount: number
  newRequestsCount: number
}

export function StatsCards({ todayEarnings, activeRidesCount, newRequestsCount }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900">Today's Earnings</h3>
        <p className="text-3xl font-bold text-green-600 mt-2">${todayEarnings.toFixed(2)}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900">Active Rides</h3>
        <p className="text-3xl font-bold text-blue-600 mt-2">{activeRidesCount}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900">New Requests</h3>
        <p className="text-3xl font-bold text-yellow-600 mt-2">{newRequestsCount}</p>
      </div>
    </div>
  )
} 