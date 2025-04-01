
import { useState } from 'react';
import { geocodeCoordinates } from '@/lib/geocoding';

// Default location coordinates (New York City)
const DEFAULT_LATITUDE = 40.712776;
const DEFAULT_LONGITUDE = -74.005974;
const USER_LOCATION_KEY = 'munchmap_user_location';

export function useLocation() {
  const [locationEnabled, setLocationEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState({
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    address: 'New York City',
  });

  const requestLocation = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });
      
      const { latitude, longitude } = position.coords;
      
      const address = await geocodeCoordinates(latitude, longitude);
      
      const newUserLocation = {
        latitude,
        longitude,
        address: address || 'Unknown location'
      };
      
      setUserLocation(newUserLocation);
      setLocationEnabled(true);
      
      localStorage.setItem(USER_LOCATION_KEY, JSON.stringify(newUserLocation));
      
      return;
      
    } catch (error) {
      console.error('Error getting location:', error);
      
      // If geolocation fails, still fetch restaurants using default location
      setLocationEnabled(true); // We still want to show restaurants
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const initLocation = (): void => {
    const storedLocation = localStorage.getItem(USER_LOCATION_KEY);
    if (storedLocation) {
      try {
        const parsedLocation = JSON.parse(storedLocation);
        setUserLocation(parsedLocation);
        setLocationEnabled(true);
      } catch (error) {
        console.error('Error parsing stored location:', error);
        localStorage.removeItem(USER_LOCATION_KEY);
        setLocationEnabled(true); // Show restaurants anyway
      }
    } else {
      setLocationEnabled(true); // Show restaurants anyway
    }
  };

  return {
    locationEnabled,
    userLocation,
    requestLocation,
    initLocation,
    isLoading
  };
}
