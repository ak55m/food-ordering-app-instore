
import React, { useState } from 'react';
import { MapPin, Loader2, ChevronDown } from 'lucide-react';
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
      variant="ghost"
      className="flex items-center gap-1 hover:bg-transparent rounded-full relative text-cyan-500"
      size="sm"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 text-cyan-500 animate-spin" />
      ) : (
        <MapPin className="h-5 w-5 text-cyan-500" />
      )}
      <span className="text-sm truncate max-w-[150px] md:max-w-[200px] font-medium">
        {locationEnabled 
          ? (userLocation.address || "Your location")
          : "Valkolantie 9"}
      </span>
      <ChevronDown className="h-4 w-4" />
    </Button>
  );
};

export default LocationButton;
