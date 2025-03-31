
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import LocationButton from '@/components/LocationButton';
import RestaurantCard from '@/components/RestaurantCard';
import OrderTracker from '@/components/OrderTracker';
import BottomNavigation from '@/components/BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { MapPin } from 'lucide-react';

const Index: React.FC = () => {
  const { nearbyRestaurants, locationEnabled, userLocation, orders, isLoading } = useAppContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Check if there's an active order
  const hasActiveOrder = orders && orders.length > 0 && 
    orders.some(order => order.status !== 'completed');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10 safe-top">
        <div className={`mx-auto ${isMobile ? 'px-4 max-w-[430px]' : 'container px-4'} py-4 flex justify-between items-center`}>
          <h1 className="text-xl font-bold text-brand-cyan">MunchMap</h1>
          <div>
            <LocationButton />
          </div>
        </div>
      </header>
      
      <main className={`mx-auto ${isMobile ? 'px-4 max-w-[430px]' : 'container px-4'} py-6`}>
        {hasActiveOrder && (
          <div className="mb-6">
            <OrderTracker />
          </div>
        )}
        
        {locationEnabled ? (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Restaurants near {userLocation.address}
            </h2>
            
            {isLoading.restaurants ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Finding restaurants near you...</p>
              </div>
            ) : nearbyRestaurants && nearbyRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyRestaurants.map(restaurant => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No restaurants found nearby</p>
              </div>
            )}
          </>
        ) : (
          <div className="py-10 text-center">
            <div className="max-w-xs mx-auto flex flex-col items-center gap-4">
              <div className="bg-gray-100 p-5 rounded-full">
                <MapPin className="h-10 w-10 text-brand-orange" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Find Restaurants Near You</h2>
              <p className="text-gray-500">
                Click the location button above to discover restaurants in your area
              </p>
            </div>
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
