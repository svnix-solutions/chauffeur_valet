import React, { useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { useFrappeGetDocList, useFrappeGetCall } from 'frappe-react-sdk'
import { RideCard } from './RideCard'
import type { Ride } from '../types'

interface RideListProps {
  serviceableCity: string
  serviceableZone: string
}

export function RideList({ serviceableCity, serviceableZone }: RideListProps) {
  const [viewedRides, setViewedRides] = useState<Record<string, boolean>>({})
  const [showOtp, setShowOtp] = useState<Record<string, boolean>>({})
  const [otpInput, setOtpInput] = useState<Record<string, string>>({})

  const { data: rides = [], mutate: mutateRides } = useFrappeGetDocList<Ride>('Ride', {
    filters: [
      ['status', 'in', ['Pending', 'Viewed', 'Accepted', 'On the Way', 'Reached', 'In Progress']],
      // ['scheduled_time', '>=', new Date().toISOString().split('T')[0]],
      ['serviceable_city', '=', serviceableCity],
      ['serviceable_zone', '=', serviceableZone]
    ],
    fields: [
      'name', 'status', 'pickup_location', 'dropoff_location',
      'scheduled_time', 'customer', 'total_amount', 'serviceable_city', 'serviceable_zone'
    ]
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800'
      case 'Viewed':
        return 'bg-gray-100 text-gray-800'
      case 'Accepted':
        return 'bg-green-100 text-green-800'
      case 'On the Way':
        return 'bg-yellow-100 text-yellow-800'
      case 'Reached':
        return 'bg-purple-100 text-purple-800'
      case 'In Progress':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const markAsViewed = async (rideId: string) => {
    try {
      const {data: res} = await useFrappeGetCall('chauffeur_valet.valet.mark_ride_as_viewed',{ ride_id: rideId })
      if (res.message?.success) {
        setViewedRides((prev) => ({ ...prev, [rideId]: true }))
        toast({ title: 'Ride marked as viewed' })
        mutateRides()
      } else {
        toast({ title: 'Error', description: res.message?.message || 'Failed to mark as viewed', variant: 'destructive' })
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to mark as viewed', variant: 'destructive' })
    }
  }

  const handleAcceptRide = async (rideId: string) => {
    try {
      const {data: res} = await useFrappeGetCall('chauffeur_valet.valet.accept_ride', { ride_id: rideId })
      if (res.message?.success) {
        toast({ title: 'Ride accepted' })
        mutateRides()
      } else {
        toast({ title: 'Error', description: res.message?.message || 'Failed to accept ride', variant: 'destructive' })
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to accept ride', variant: 'destructive' })
    }
  }

  const handleIgnoreRide = async (rideId: string) => {
    try {
      const {data: res} = await useFrappeGetCall('chauffeur_valet.valet.ignore_ride', { ride_id: rideId })
      if (res.message?.success) {
        toast({ title: 'Ride ignored' })
        mutateRides()
      } else {
        toast({ title: 'Error', description: res.message?.message || 'Failed to ignore ride', variant: 'destructive' })
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to ignore ride', variant: 'destructive' })
    }
  }

  const handleOnTheWay = async (rideId: string) => {
    try {
      const {data: res} = await useFrappeGetCall('chauffeur_valet.valet.update_ride_status', { ride_id: rideId, new_status: 'On the Way' })
      if (res.message?.success) {
        toast({ title: 'Marked as On the Way' })
        mutateRides()
      } else {
        toast({ title: 'Error', description: res.message?.message || 'Failed to update status', variant: 'destructive' })
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to update status', variant: 'destructive' })
    }
  }

  const handleReached = async (rideId: string) => {
    try {
      const {data: res} = await useFrappeGetCall('chauffeur_valet.valet.update_ride_status', { ride_id: rideId, new_status: 'Reached' })
      if (res.message?.success) {
        toast({ title: 'Marked as Reached' })
        mutateRides()
      } else {
        toast({ title: 'Error', description: res.message?.message || 'Failed to update status', variant: 'destructive' })
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to update status', variant: 'destructive' })
    }
  }

  const handleStartTrip = async (rideId: string) => {
    try {
      const otp = otpInput[rideId] || ''
      const {data: res} = await useFrappeGetCall('chauffeur_valet.valet.start_trip', { ride_id: rideId, otp })
      if (res.message?.success) {
        toast({ title: 'Trip started' })
        setShowOtp((prev) => ({ ...prev, [rideId]: false }))
        setOtpInput((prev) => ({ ...prev, [rideId]: '' }))
        mutateRides()
      } else {
        toast({ title: 'Error', description: res.message?.message || 'Failed to start trip', variant: 'destructive' })
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to start trip', variant: 'destructive' })
    }
  }

  const handleCompleteRide = async (rideId: string) => {
    try {
      const {data: res} = await useFrappeGetCall('chauffeur_valet.valet.update_ride_status', { ride_id: rideId, new_status: 'Completed' })
      if (res.message?.success) {
        toast({ title: 'Ride completed' })
        mutateRides()
      } else {
        toast({ title: 'Error', description: res.message?.message || 'Failed to complete ride', variant: 'destructive' })
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to complete ride', variant: 'destructive' })
    }
  }

  const handleShowOtp = (rideId: string) => {
    setShowOtp((prev) => ({ ...prev, [rideId]: true }))
  }

  const handleOtpInputChange = (rideId: string, value: string) => {
    setOtpInput((prev) => ({ ...prev, [rideId]: value }))
  }

  const handleCancelOtp = (rideId: string) => {
    setShowOtp((prev) => ({ ...prev, [rideId]: false }))
    setOtpInput((prev) => ({ ...prev, [rideId]: '' }))
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Ride Requests</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {rides.map((ride) => (
          <RideCard
            key={ride.name}
            ride={ride}
            viewedRides={viewedRides}
            showOtp={showOtp}
            otpInput={otpInput}
            onMarkAsViewed={markAsViewed}
            onAcceptRide={handleAcceptRide}
            onIgnoreRide={handleIgnoreRide}
            onOnTheWay={handleOnTheWay}
            onReached={handleReached}
            onStartTrip={handleStartTrip}
            onCompleteRide={handleCompleteRide}
            onShowOtp={handleShowOtp}
            onOtpInputChange={handleOtpInputChange}
            onCancelOtp={handleCancelOtp}
            getStatusColor={getStatusColor}
            formatTime={formatTime}
          />
        ))}
      </div>
    </div>
  )
} 