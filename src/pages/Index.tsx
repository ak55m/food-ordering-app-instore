
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import LocationButton from '@/components/LocationButton';
import RestaurantCard from '@/components/RestaurantCard';
import OrderTracker from '@/components/OrderTracker';
import BottomNavigation from '@/components/BottomNavigation';

const Index: React.FC = () => {
  const { nearbyRestaurants, locationEnabled, userLocation, orders } = useAppContext();
  const navigate = useNavigate();
  
  // Check if there's an active order
  const hasActiveOrder = orders && orders.length > 0 && 
    orders.some(order => order.status !== 'completed');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-brand-cyan">MunchMap</h1>
          <div>
            <LocationButton />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
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
            
            {nearbyRestaurants && nearbyRestaurants.length > 0 ? (
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
            <h2 className="text-2xl font-semibold mb-2">Find Restaurants Near You</h2>
            <p className="text-gray-500 mb-6">
              Click the location button above to discover restaurants in your area
            </p>
            <img 
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop" 
              alt="Food" 
              className="max-w-md mx-auto rounded-lg shadow-md" 
            />
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
