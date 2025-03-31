
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
      className="flex items-center gap-2 rounded-full border-gray-300 bg-white shadow-sm hover:bg-gray-50 relative"
      size="sm"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 text-brand-orange animate-spin" />
      ) : (
        <MapPin className="h-4 w-4 text-brand-orange" />
      )}
      <span className="text-sm text-gray-700 truncate max-w-[150px] md:max-w-[200px]">
        {locationEnabled 
          ? "Your location"
          : "Find restaurants near you"}
      </span>
    </Button>
  );
};

export default LocationButton;
