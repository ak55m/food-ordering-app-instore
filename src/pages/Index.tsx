
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import LocationButton from '@/components/LocationButton';
import RestaurantCard from '@/components/RestaurantCard';
import BottomNavigation from '@/components/BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { MapPin, Search } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';

const Index: React.FC = () => {
  const { nearbyRestaurants, locationEnabled, userLocation, isLoading } = useAppContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-white pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10 safe-top">
        <div className={`mx-auto ${isMobile ? 'px-4 max-w-[430px]' : 'container max-w-[1600px] px-8'} py-4 flex justify-between items-center`}>
          <h1 className="text-xl font-bold text-brand-cyan font-omnes">MunchMap</h1>
          <div>
            <LocationButton />
          </div>
        </div>
        <div className={`mx-auto ${isMobile ? 'px-4 max-w-[430px]' : 'container max-w-[1600px] px-8'} pb-4 flex items-center`}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search for food or restaurants..." 
              className="pl-10 bg-gray-100 border-0 font-omnes"
            />
          </div>
        </div>
      </header>
      
      <main className="mx-auto max-w-[1600px] px-4 md:px-8 relative overflow-clip">
        {locationEnabled ? (
          <>
            <section className="py-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 font-omnes">New on MunchMap</h2>
                <a href="#" className="text-brand-cyan font-medium text-sm font-omnes">See all</a>
              </div>
              
              {isLoading.restaurants ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 font-omnes">Finding restaurants near you...</p>
                </div>
              ) : nearbyRestaurants && nearbyRestaurants.length > 0 ? (
                <div className="w-full overflow-visible pl-4 -ml-4 pr-0">
                  <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
                    {nearbyRestaurants.map(restaurant => (
                      <div key={restaurant.id} className="flex-shrink-0 w-[160px] snap-start">
                        <RestaurantCard restaurant={restaurant} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 font-omnes">No restaurants found nearby</p>
                </div>
              )}
            </section>
            
            <section className="py-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 font-omnes">Dinner near you</h2>
                <a href="#" className="text-brand-cyan font-medium text-sm font-omnes">See all</a>
              </div>
              
              {nearbyRestaurants && nearbyRestaurants.length > 0 ? (
                <div className="w-full overflow-visible pl-4 -ml-4 pr-0">
                  <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
                    {nearbyRestaurants.slice(0).reverse().map(restaurant => (
                      <div key={restaurant.id} className="flex-shrink-0 w-[160px] snap-start">
                        <RestaurantCard restaurant={restaurant} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          </>
        ) : (
          <div className="py-10 text-center bg-white rounded-lg">
            <div className="max-w-xs mx-auto flex flex-col items-center gap-4">
              <div className="bg-gray-100 p-5 rounded-full">
                <MapPin className="h-10 w-10 text-brand-orange" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 font-omnes">Find Restaurants Near You</h2>
              <p className="text-gray-500 font-omnes">
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
