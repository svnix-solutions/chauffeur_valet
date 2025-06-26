import React, { useState, useEffect } from 'react';
import { useFrappePostCall } from 'frappe-react-sdk';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Text } from '../ui/text';
import { View } from '../ui/view';
import type { Ride } from './types';

interface RideDetailsProps {
  ride: Ride;
  onClose: () => void;
  onStatusChange: () => void;
}

export const RideDetails: React.FC<RideDetailsProps> = ({ ride, onClose, onStatusChange }) => {
  const [showOtp, setShowOtp] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [showReceivedAmount, setShowReceivedAmount] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState('');

  const { call: markAsViewed } = useFrappePostCall('chauffeur_valet.valet.mark_ride_as_viewed');
  const { call: acceptRide } = useFrappePostCall('chauffeur_valet.valet.accept_ride');
  const { call: ignoreRide } = useFrappePostCall('chauffeur_valet.valet.ignore_ride');
  const { call: updateRideStatus } = useFrappePostCall('chauffeur_valet.valet.update_ride_status');
  const { call: startTrip } = useFrappePostCall('chauffeur_valet.valet.start_trip');

  // Mark ride as viewed when details are opened
  useEffect(() => {
    const markViewed = async () => {
      try {
        await markAsViewed({ ride_id: ride.name });
      } catch (error) {
        console.error('Error marking ride as viewed:', error);
      }
    };
    markViewed();
  }, [ride.name, markAsViewed]);

  const handleAcceptRide = async () => {
    try {
      const result = await acceptRide({ ride_id: ride.name });
      if (result.success) {
        onStatusChange();
        onClose();
      }
    } catch (error) {
      console.error('Error accepting ride:', error);
    }
  };

  const handleIgnoreRide = async () => {
    try {
      const result = await ignoreRide({ ride_id: ride.name });
      if (result.success) {
        onStatusChange();
        onClose();
      }
    } catch (error) {
      console.error('Error ignoring ride:', error);
    }
  };

  const handleOnTheWay = async () => {
    try {
      const result = await updateRideStatus({ ride_id: ride.name, new_status: 'On the Way' });
      if (result.success) {
        onStatusChange();
        onClose();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleReached = async () => {
    try {
      const result = await updateRideStatus({ ride_id: ride.name, new_status: 'Reached' });
      if (result.success) {
        setShowOtp(true);
        onStatusChange();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleStartTrip = async () => {
    try {
      const result = await startTrip({ ride_id: ride.name, otp: otpInput });
      if (result.success) {
        setShowOtp(false);
        setOtpInput('');
        onStatusChange();
        onClose();
      }
    } catch (error) {
      console.error('Error starting trip:', error);
    }
  };

  const handleCompleteRide = async () => {
    try {
      const result = await updateRideStatus({ 
        ride_id: ride.name, 
        new_status: 'Completed',
        received_amount: receivedAmount || null
      });
      if (result.success) {
        setShowReceivedAmount(false);
        setReceivedAmount('');
        onStatusChange();
        onClose();
      }
    } catch (error) {
      console.error('Error completing ride:', error);
    }
  };

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

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtpInput(e.target.value);
  };

  const handleReceivedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReceivedAmount(e.target.value);
  };

  return (
    <Card className="p-4">
      <View className="space-y-4">
        <View className="flex justify-between items-center">
          <Text className="text-xl font-bold">Ride Details</Text>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </View>

        <View className="space-y-2">
          <Text className="font-semibold">Status: <Text className={getStatusColor(ride.status)}>{ride.status}</Text></Text>
          <Text>Pickup: {ride.pickup_location}</Text>
          <Text>Dropoff: {ride.dropoff_location}</Text>
          <Text>Time: {formatTime(ride.scheduled_time)}</Text>
          <Text>Customer: {ride.customer_name}</Text>
          {ride.notes && <Text>Notes: {ride.notes}</Text>}
          {ride.total_amount && <Text>Amount: ${ride.total_amount}</Text>}
          {ride.received_amount && <Text>Received: ${ride.received_amount}</Text>}
          {ride.serviceable_city && <Text>City: {ride.serviceable_city}</Text>}
          {ride.serviceable_zone && <Text>Zone: {ride.serviceable_zone}</Text>}
        </View>

        <View className="flex flex-wrap gap-2">
          {ride.status === 'Pending' && (
            <>
              <Button onClick={handleAcceptRide}>Accept</Button>
              <Button variant="destructive" onClick={handleIgnoreRide}>Ignore</Button>
            </>
          )}
          {ride.status === 'Accepted' && (
            <Button onClick={handleOnTheWay}>On the Way</Button>
          )}
          {ride.status === 'On the Way' && (
            <Button onClick={handleReached}>Reached</Button>
          )}
          {ride.status === 'Reached' && !showOtp && (
            <Button onClick={() => setShowOtp(true)}>Enter OTP</Button>
          )}
          {(ride.status === 'Reached' && showOtp) && (
            <View className="space-y-2">
              <Text>Enter OTP to start trip:</Text>
              <Input
                type="text"
                value={otpInput}
                onChange={handleOtpChange}
                placeholder="Enter OTP"
              />
              <Button onClick={handleStartTrip}>Start Trip</Button>
            </View>
          )}
          {ride.status === 'In Progress' && !showReceivedAmount && (
            <Button onClick={() => setShowReceivedAmount(true)}>Complete Ride</Button>
          )}
          {(ride.status === 'In Progress' && showReceivedAmount) && (
            <View className="space-y-2">
              <Text>Enter received amount:</Text>
              <Input
                type="number"
                value={receivedAmount}
                onChange={handleReceivedAmountChange}
                placeholder="Enter amount received"
                step="0.01"
                min="0"
              />
              <View className="flex gap-2">
                <Button onClick={handleCompleteRide}>Complete Ride</Button>
                <Button variant="outline" onClick={() => {
                  setShowReceivedAmount(false);
                  setReceivedAmount('');
                }}>Cancel</Button>
              </View>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}; 