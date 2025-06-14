import React from 'react'
import { Ride } from '../types'

interface RideCardProps {
  ride: Ride
  viewedRides: Record<string, boolean>
  showOtp: Record<string, boolean>
  otpInput: Record<string, string>
  onMarkAsViewed: (rideId: string) => void
  onAcceptRide: (rideId: string) => void
  onIgnoreRide: (rideId: string) => void
  onOnTheWay: (rideId: string) => void
  onReached: (rideId: string) => void
  onStartTrip: (rideId: string) => void
  onCompleteRide: (rideId: string) => void
  onShowOtp: (rideId: string) => void
  onOtpInputChange: (rideId: string, value: string) => void
  onCancelOtp: (rideId: string) => void
  getStatusColor: (status: string) => string
  formatTime: (timeStr: string) => string
}

export function RideCard({
  ride,
  viewedRides,
  showOtp,
  otpInput,
  onMarkAsViewed,
  onAcceptRide,
  onIgnoreRide,
  onOnTheWay,
  onReached,
  onStartTrip,
  onCompleteRide,
  onShowOtp,
  onOtpInputChange,
  onCancelOtp,
  getStatusColor,
  formatTime,
}: RideCardProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(ride.status)}`}>
              {ride.status}
            </span>
            {!viewedRides[ride.name] && ride.status === 'New' && (
              <button
                onClick={() => onMarkAsViewed(ride.name)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark as Viewed
              </button>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {ride.pickup_location} → {ride.dropoff_location}
          </p>
          <p className="text-sm text-gray-600">
            Scheduled: {formatTime(ride.scheduled_time)}
          </p>
          <p className="text-sm text-gray-600">
            Customer: {ride.customer}
          </p>
          <p className="text-sm text-gray-600">
            Amount: ${ride.total_amount}
          </p>
          {ride.serviceable_city && (
            <p className="text-sm text-gray-600">
              City: {ride.serviceable_city}
            </p>
          )}
          {ride.serviceable_zone && (
            <p className="text-sm text-gray-600">
              Zone: {ride.serviceable_zone}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {ride.status === 'New' && (
            <>
              <button
                onClick={() => onAcceptRide(ride.name)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={() => onIgnoreRide(ride.name)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Ignore
              </button>
            </>
          )}
          {ride.status === 'Accepted' && (
            <button
              onClick={() => onOnTheWay(ride.name)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Mark as On the Way
            </button>
          )}
          {ride.status === 'On the Way' && (
            <button
              onClick={() => onReached(ride.name)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Mark as Reached
            </button>
          )}
          {ride.status === 'Reached' && (
            <button
              onClick={() => onShowOtp(ride.name)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Start Trip
            </button>
          )}
          {ride.status === 'In Progress' && (
            <button
              onClick={() => onCompleteRide(ride.name)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Complete Ride
            </button>
          )}
        </div>
      </div>
      {showOtp[ride.name] && (
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            value={otpInput[ride.name] || ''}
            onChange={(e) => onOtpInputChange(ride.name, e.target.value)}
            placeholder="Enter OTP"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => onStartTrip(ride.name)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Verify & Start
          </button>
          <button
            onClick={() => onCancelOtp(ride.name)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
} 