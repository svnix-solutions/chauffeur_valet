export interface Ride {
  name: string;
  status: 'Pending' | 'Viewed' | 'Accepted' | 'On the Way' | 'Reached' | 'In Progress' | 'Completed' | 'Ignored';
  pickup_location: string;
  dropoff_location: string;
  scheduled_time: string;
  customer_name: string;
  notes?: string;
  total_amount?: number;
  serviceable_city?: string;
  serviceable_zone?: string;
  otp?: string;
} 