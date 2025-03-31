
import React, { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const LocationButton: React.FC = () => {
  const { locationEnabled, requestLocation, userLocation } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationRequest = async () => {
    setIsLoading(true);
    try {
      await requestLocation();
      toast.success("Location found successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not access your location");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleLocationRequest}
      variant="outline"
      className="flex items-center gap-1 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
      size="sm"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 text-brand-orange animate-spin" />
      ) : (
        <MapPin className="h-4 w-4 text-brand-orange" />
      )}
      <span className="text-sm truncate max-w-[150px] md:max-w-[200px] font-medium">
        {locationEnabled 
          ? (userLocation.address || "Your location")
          : "Find your location"}
      </span>
    </Button>
  );
};

export default LocationButton;
