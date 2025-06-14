import React from 'react'
import { EarningsStats } from './valet-dashboard/EarningsStats'
import { RideStats } from './valet-dashboard/RideStats'
import { RideList } from './valet-dashboard/RideList'
import type { ValetDashboardProps } from './types'

export function ValetDashboard({ serviceableCity, serviceableZone }: ValetDashboardProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
        <p className="mt-2 text-gray-600">Here's what's happening with your rides today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <EarningsStats />
        <RideStats serviceableCity={serviceableCity} serviceableZone={serviceableZone} />
      </div>

      <RideList serviceableCity={serviceableCity} serviceableZone={serviceableZone} />
    </div>
  )
} 