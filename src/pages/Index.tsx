
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
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';

const Index: React.FC = () => {
  const { nearbyRestaurants, locationEnabled, userLocation, isLoading } = useAppContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with Wolt-style branding */}
      <header className="bg-white shadow-sm sticky top-0 z-10 safe-top">
        <div className={`mx-auto ${isMobile ? 'px-4 max-w-[430px]' : 'container max-w-[1600px] px-8'} py-4 flex justify-between items-center`}>
          <h1 className="text-2xl font-bold text-gray-800 font-wolt italic">Wolt</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search in Wolt..." 
                className="pl-10 bg-gray-100 border-0 font-omnes rounded-full w-[200px] md:w-[300px]"
              />
            </div>
            <LocationButton />
          </div>
        </div>
        
        {/* Category tabs */}
        <div className="border-b border-gray-200">
          <div className={`mx-auto ${isMobile ? 'px-4 max-w-[430px]' : 'container max-w-[1600px] px-8'} flex overflow-x-auto no-scrollbar`}>
            <button className="px-4 py-3 text-gray-800 font-medium border-b-2 border-gray-800">
              Restaurants
            </button>
            <button className="px-4 py-3 text-gray-500 font-medium">
              Groceries
            </button>
            <button className="px-4 py-3 text-gray-500 font-medium">
              Wolt+
            </button>
          </div>
        </div>
      </header>
      
      <main className="mx-auto max-w-[1600px] px-0 md:px-8 relative overflow-hidden">
        {/* Main content */}
        {locationEnabled ? (
          <>
            {/* Top carousel for promotions */}
            <div className="mb-8 mt-4">
              <Carousel className="w-full" opts={{ align: 'start', loop: true }}>
                <CarouselContent className="-ml-2 md:-ml-4">
                  {/* Promotion cards */}
                  <CarouselItem className="pl-2 md:pl-4 basis-4/5 md:basis-1/3">
                    <div className="bg-blue-400 text-white h-48 md:h-64 rounded-xl overflow-hidden relative">
                      <img src="/public/lovable-uploads/e4af0015-49e9-42a6-966e-e5a1926684d7.png" className="w-full h-full object-cover" alt="Promotion" />
                    </div>
                  </CarouselItem>
                  <CarouselItem className="pl-2 md:pl-4 basis-4/5 md:basis-1/3">
                    <div className="bg-cyan-500 text-white h-48 md:h-64 rounded-xl overflow-hidden relative">
                      <div className="absolute inset-0 p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="text-3xl font-bold mb-2">30% OFF</h3>
                          <p className="text-xl">Save up to 35%</p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                  <CarouselItem className="pl-2 md:pl-4 basis-4/5 md:basis-1/3">
                    <div className="bg-teal-500 text-white h-48 md:h-64 rounded-xl overflow-hidden">
                      <div className="p-6">
                        <h3 className="text-3xl font-bold mb-2">Free delivery</h3>
                      </div>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <div className="flex justify-center mt-4 gap-2">
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full" />
                </div>
              </Carousel>
            </div>
            
            {/* Why don't we just... section */}
            <section className="py-2 px-4 md:px-0 mb-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-bold text-gray-800">Why don't we just...</h2>
                <a href="#" className="text-cyan-500 font-medium">See all</a>
              </div>
              
              {isLoading.restaurants ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 font-omnes">Finding restaurants near you...</p>
                </div>
              ) : nearbyRestaurants && nearbyRestaurants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {nearbyRestaurants.slice(0, 4).map(restaurant => (
                    <div key={restaurant.id} className="w-full" onClick={() => navigate(`/restaurant/${restaurant.id}`)}>
                      <RestaurantCard restaurant={restaurant} woltStyle={true} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 font-omnes">No restaurants found nearby</p>
                </div>
              )}
            </section>
            
            {/* Dinner near you section */}
            <section className="py-2 px-4 md:px-0">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-bold text-gray-800">Dinner near you</h2>
                <a href="#" className="text-cyan-500 font-medium">See all</a>
              </div>
              
              {nearbyRestaurants && nearbyRestaurants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {nearbyRestaurants.slice(0).reverse().slice(0, 4).map(restaurant => (
                    <div key={restaurant.id} className="w-full" onClick={() => navigate(`/restaurant/${restaurant.id}`)}>
                      <RestaurantCard restaurant={restaurant} woltStyle={true} />
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          </>
        ) : (
          <div className="py-10 text-center px-4">
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
