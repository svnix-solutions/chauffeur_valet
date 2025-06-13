// @ts-ignore
// eslint-disable-next-line
declare global {
  interface Window {
    frappe: any;
  }
}

import { useState, useEffect } from 'react'
import { useFrappeAuth, useFrappeGetDocList } from 'frappe-react-sdk'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Car, DollarSign, Clock, MapPin, Eye } from 'lucide-react'

interface Ride {
  name: string
  status: string
  pickup_location: string
  dropoff_location: string
  scheduled_time: string
  customer: string
  total_amount: number
  serviceable_city?: string
  serviceable_zone?: string
}

export default function HomePage() {
  const { currentUser } = useFrappeAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [activeRides, setActiveRides] = useState<Ride[]>([])
  const [todayEarnings, setTodayEarnings] = useState(0)
  const [expandedRide, setExpandedRide] = useState<string | null>(null)
  const [viewedRides, setViewedRides] = useState<{ [rideId: string]: boolean }>({})
  const [otpInput, setOtpInput] = useState<{ [rideId: string]: string }>({})
  const [showOtp, setShowOtp] = useState<{ [rideId: string]: boolean }>({})

  // Fetch pending rides for driver's serviceable city and zone
  const { data: ridesData, isLoading: isLoadingRides } = useFrappeGetDocList<Ride>(
    'Ride',
    {
      filters: [
        ['serviceable_city', '=', (typeof currentUser === 'object' && (currentUser as any)?.serviceable_city) || ''],
        ['serviceable_zone', '=', (typeof currentUser === 'object' && (currentUser as any)?.serviceable_zone) || ''],
        ['status', '=', 'Pending']
      ],
      fields: [
        'name', 'status', 'pickup_location', 'dropoff_location',
        'scheduled_time', 'customer', 'total_amount', 'serviceable_city', 'serviceable_zone'
      ]
    }
  )

  // Fetch today's earnings
  const { data: earningsData, isLoading: isLoadingEarnings } = useFrappeGetDocList(
    'Ride',
    {
      filters: [
        ['valet', '=', (typeof currentUser === 'string' ? currentUser : (currentUser as any)?.name)],
        ['status', '=', 'Completed'],
        ['completion_date', '>=', new Date().toISOString().split('T')[0]]
      ],
      fields: ['total_amount']
    }
  )

  useEffect(() => {
    if (ridesData) {
      setActiveRides(ridesData)
    }
  }, [ridesData])

  useEffect(() => {
    if (earningsData) {
      const total = earningsData.reduce((sum, ride) => sum + (ride.fare || 0), 0)
      setTodayEarnings(total)
    }
  }, [earningsData])

  // Mark ride as viewed (backend call)
  const markAsViewed = async (rideId: string) => {
    try {
      const res = await window.frappe.call({ method: 'chauffeur_valet.valet.mark_ride_as_viewed', args: { ride_id: rideId } })
      if (res.message?.success) {
        setViewedRides((prev) => ({ ...prev, [rideId]: true }))
        toast({ title: 'Ride marked as viewed' })
      } else {
        toast({ title: 'Error', description: res.message?.message || 'Failed to mark as viewed', variant: 'destructive' })
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to mark as viewed', variant: 'destructive' })
    }
  }

  // Accept/Ignore handlers (backend call)
  const handleAcceptRide = async (rideId: string) => {
    try {
      const res = await window.frappe.call({ method: 'chauffeur_valet.valet.accept_ride', args: { ride_id: rideId } })
      if (res.message?.success) {
        toast({ title: 'Ride accepted' })
        setExpandedRide(null)
      } else {
        toast({ title: 'Error', description: res.message?.message || 'Failed to accept ride', variant: 'destructive' })
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to accept ride', variant: 'destructive' })
    }
  }
  const handleIgnoreRide = async (rideId: string) => {
    try {
      const res = await window.frappe.call({ method: 'chauffeur_valet.valet.ignore_ride', args: { ride_id: rideId } })
      if (res.message?.success) {
        toast({ title: 'Ride ignored' })
        setExpandedRide(null)
      } else {
        toast({ title: 'Error', description: res.message?.message || 'Failed to ignore ride', variant: 'destructive' })
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to ignore ride', variant: 'destructive' })
    }
  }

  // Status action handlers (backend calls)
  const handleOnTheWay = async (rideId: string) => {
    try {
      const res = await window.frappe.call({ method: 'chauffeur_valet.valet.update_ride_status', args: { ride_id: rideId, new_status: 'On the Way' } })
      if (res.message?.success) {
        toast({ title: 'Marked as On the Way' })
      } else {
        toast({ title: 'Error', description: res.message?.message || 'Failed to update status', variant: 'destructive' })
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to update status', variant: 'destructive' })
    }
  }
  const handleReached = async (rideId: string) => {
    try {
      const res = await window.frappe.call({ method: 'chauffeur_valet.valet.update_ride_status', args: { ride_id: rideId, new_status: 'Reached' } })
      if (res.message?.success) {
        toast({ title: 'Marked as Reached' })
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
      const res = await window.frappe.call({ method: 'chauffeur_valet.valet.start_trip', args: { ride_id: rideId, otp } })
      if (res.message?.success) {
        toast({ title: 'Trip started' })
        setShowOtp((prev) => ({ ...prev, [rideId]: false }))
        setOtpInput((prev) => ({ ...prev, [rideId]: '' }))
      } else {
        toast({ title: 'Error', description: res.message?.message || 'Failed to start trip', variant: 'destructive' })
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to start trip', variant: 'destructive' })
    }
  }
  const handleCompleteRide = async (rideId: string) => {
    try {
      const res = await window.frappe.call({ method: 'chauffeur_valet.valet.update_ride_status', args: { ride_id: rideId, new_status: 'Completed' } })
      if (res.message?.success) {
        toast({ title: 'Ride completed' })
      } else {
        toast({ title: 'Error', description: res.message?.message || 'Failed to complete ride', variant: 'destructive' })
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to complete ride', variant: 'destructive' })
    }
  }

  if (isLoadingRides || isLoadingEarnings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md py-6 px-2 min-h-screen flex flex-col">
      <div className="flex flex-col gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todayEarnings.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rides</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRides.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4">
        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active">Active Rides</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4">
            {activeRides.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-center text-muted-foreground">No active rides at the moment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {activeRides.map((ride) => (
                  <Card key={ride.name}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Ride #{ride.name}</span>
                        <span className="text-sm font-normal text-muted-foreground">
                          {ride.status}
                        </span>
                      </CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {new Date(ride.scheduled_time).toLocaleTimeString()}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-1" />
                          <div>
                            <p className="font-medium">Pickup</p>
                            <p className="text-sm text-muted-foreground">{ride.pickup_location}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-1" />
                          <div>
                            <p className="font-medium">Dropoff</p>
                            <p className="text-sm text-muted-foreground">{ride.dropoff_location}</p>
                          </div>
                        </div>
                        {/* Accept/Ignore for Pending */}
                        {ride.status === 'Pending' && expandedRide !== ride.name && !viewedRides[ride.name] && (
                          <Button variant="outline" className="w-full" onClick={() => { setExpandedRide(ride.name); markAsViewed(ride.name) }}>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </Button>
                        )}
                        {(expandedRide === ride.name || viewedRides[ride.name]) && ride.status === 'Pending' && (
                          <div className="flex gap-2">
                            <Button className="flex-1" onClick={() => handleAcceptRide(ride.name)}>
                              Accept
                            </Button>
                            <Button className="flex-1" variant="outline" onClick={() => handleIgnoreRide(ride.name)}>
                              Ignore
                            </Button>
                          </div>
                        )}
                        {/* On the Way */}
                        {ride.status === 'Accepted' && (
                          <Button className="w-full" onClick={() => handleOnTheWay(ride.name)}>
                            On the Way
                          </Button>
                        )}
                        {/* Reached */}
                        {ride.status === 'On the Way' && (
                          <Button className="w-full" onClick={() => handleReached(ride.name)}>
                            Reached
                          </Button>
                        )}
                        {/* Start Trip (OTP) */}
                        {ride.status === 'Reached' && (
                          <div className="flex flex-col gap-2">
                            {!showOtp[ride.name] ? (
                              <Button className="w-full" onClick={() => setShowOtp((prev) => ({ ...prev, [ride.name]: true }))}>
                                Start Trip (OTP)
                              </Button>
                            ) : (
                              <form className="flex gap-2" onSubmit={e => { e.preventDefault(); handleStartTrip(ride.name) }}>
                                <input
                                  type="text"
                                  placeholder="Enter OTP"
                                  className="flex-1 rounded border px-2 py-1"
                                  value={otpInput[ride.name] || ''}
                                  onChange={e => setOtpInput((prev) => ({ ...prev, [ride.name]: e.target.value }))}
                                  required
                                />
                                <Button type="submit">Submit</Button>
                              </form>
                            )}
                          </div>
                        )}
                        {/* Complete Ride */}
                        {ride.status === 'In Progress' && (
                          <Button className="w-full" onClick={() => handleCompleteRide(ride.name)}>
                            Complete Ride
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="scheduled" className="mt-4">
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-center text-muted-foreground">No scheduled rides</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 