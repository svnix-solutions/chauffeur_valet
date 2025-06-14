export interface Ride {
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

export interface ValetDashboardProps {
  serviceableCity: string
  serviceableZone: string
} 