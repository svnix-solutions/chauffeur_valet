import React from 'react';
import { Card } from '../ui/card';
import { Text } from '../ui/text';
import { View } from '../ui/view';
import type { Ride } from './types';

interface RideCardProps {
  ride: Ride;
  onClick: (ride: Ride) => void;
}

export const RideCard: React.FC<RideCardProps> = ({ ride, onClick }) => {
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Pending': 'text-yellow-500',
      'Viewed': 'text-blue-500',
      'Accepted': 'text-green-500',
      'On the Way': 'text-purple-500',
      'Reached': 'text-indigo-500',
      'In Progress': 'text-orange-500',
      'Completed': 'text-green-600',
      'Ignored': 'text-red-500'
    };
    return colors[status] || 'text-gray-500';
  };

  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString();
  };

  return (
    <Card 
      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onClick(ride)}
    >
      <View className="space-y-2">
        <View className="flex justify-between items-center">
          <Text className="font-semibold">Status: <Text className={getStatusColor(ride.status)}>{ride.status}</Text></Text>
          <Text className="text-sm text-gray-500">{formatTime(ride.scheduled_time)}</Text>
        </View>
        <Text>Pickup: {ride.pickup_location}</Text>
        <Text>Dropoff: {ride.dropoff_location}</Text>
        {ride.notes && <Text className="text-sm text-gray-600">Notes: {ride.notes}</Text>}
      </View>
    </Card>
  );
}; 