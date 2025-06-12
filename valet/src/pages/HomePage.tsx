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
  customer_name: string
  fare: number
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

  // Fetch pending rides for driver's city and zone
  const { data: ridesData, isLoading: isLoadingRides } = useFrappeGetDocList<Ride>(
    'Ride',
    {
      filters: [
        ['city', '=', currentUser?.city],
        ['zone', '=', currentUser?.zone],
        ['status', '=', 'Pending']
      ],
      fields: [
        'name', 'status', 'pickup_location', 'dropoff_location',
        'scheduled_time', 'customer_name', 'fare', 'city', 'zone'
      ]
    }
  )

  // Fetch today's earnings
  const { data: earningsData, isLoading: isLoadingEarnings } = useFrappeGetDocList(
    'Ride',
    {
      filters: [
        ['valet', '=', currentUser],
        ['status', '=', 'Completed'],
        ['completion_date', '>=', new Date().toISOString().split('T')[0]]
      ],
      fields: ['fare']
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

  // Mark ride as viewed (placeholder for backend call)
  const markAsViewed = async (rideId: string) => {
    // TODO: Call backend to update status to 'Viewed'
    setViewedRides((prev) => ({ ...prev, [rideId]: true }))
    toast({ title: 'Ride marked as viewed' })
  }

  // Accept/Ignore handlers (placeholder for backend call)
  const handleAcceptRide = async (rideId: string) => {
    // TODO: Call backend to update status to 'Accepted'
    toast({ title: 'Ride accepted' })
    setExpandedRide(null)
  }
  const handleIgnoreRide = async (rideId: string) => {
    // TODO: Call backend to update status to 'Ignored'
    toast({ title: 'Ride ignored' })
    setExpandedRide(null)
  }

  // Status action handlers (placeholders for backend calls)
  const handleOnTheWay = async (rideId: string) => {
    // TODO: Call backend to update status to 'On the Way'
    toast({ title: 'Marked as On the Way' })
  }
  const handleReached = async (rideId: string) => {
    // TODO: Call backend to update status to 'Reached'
    toast({ title: 'Marked as Reached' })
  }
  const handleStartTrip = async (rideId: string) => {
    // TODO: Validate OTP with backend, then update status to 'In Progress'
    toast({ title: 'Trip started' })
    setShowOtp((prev) => ({ ...prev, [rideId]: false }))
    setOtpInput((prev) => ({ ...prev, [rideId]: '' }))
  }
  const handleCompleteRide = async (rideId: string) => {
    // TODO: Call backend to update status to 'Completed'
    toast({ title: 'Ride completed' })
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