import { useState, useEffect } from 'react'
import { useFrappeAuth, useFrappeGetDocList } from 'frappe-react-sdk'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Car, DollarSign, Clock, MapPin } from 'lucide-react'

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

  // Fetch active rides
  const { data: ridesData, isLoading: isLoadingRides } = useFrappeGetDocList<Ride>(
    'Ride',
    {
      filters: {
        valet: currentUser,
        status: ['in', ['Assigned', 'In Progress']]
      },
      fields: ['name', 'status', 'pickup_location', 'dropoff_location', 'scheduled_time', 'customer_name', 'fare']
    }
  )

  // Fetch today's earnings
  const { data: earningsData, isLoading: isLoadingEarnings } = useFrappeGetDocList(
    'Ride',
    {
      filters: {
        valet: currentUser,
        status: 'Completed',
        completion_date: ['>=', new Date().toISOString().split('T')[0]]
      },
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

  const handleStartRide = async (rideId: string) => {
    try {
      // TODO: Implement start ride functionality
      toast({
        title: "Ride started",
        description: "You have started the ride successfully."
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start the ride. Please try again."
      })
    }
  }

  const handleCompleteRide = async (rideId: string) => {
    try {
      // TODO: Implement complete ride functionality
      toast({
        title: "Ride completed",
        description: "You have completed the ride successfully."
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete the ride. Please try again."
      })
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
    <div className="container py-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="mt-8">
        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active">Active Rides</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4">
            {activeRides.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
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
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Fare: ${ride.fare}</p>
                          {ride.status === 'Assigned' ? (
                            <Button onClick={() => handleStartRide(ride.name)}>
                              Start Ride
                            </Button>
                          ) : (
                            <Button onClick={() => handleCompleteRide(ride.name)}>
                              Complete Ride
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="scheduled" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No scheduled rides</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 