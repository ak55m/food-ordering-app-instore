
import React from 'react';
import { MapPin } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

const LocationButton: React.FC = () => {
  const { locationEnabled, requestLocation, userLocation } = useAppContext();

  return (
    <Button 
      onClick={requestLocation}
      variant="outline"
      className="flex items-center gap-2 rounded-full border-gray-300 bg-white shadow-sm hover:bg-gray-50"
      size="sm"
    >
      <MapPin className="h-4 w-4 text-brand-orange" />
      <span className="text-sm text-gray-700 truncate max-w-[150px] md:max-w-[200px]">
        {locationEnabled && userLocation.address
          ? userLocation.address
          : "Find restaurants near you"}
      </span>
    </Button>
  );
};

export default LocationButton;
