import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import LocationButton from '@/components/LocationButton';
import RestaurantCard from '@/components/RestaurantCard';
import BottomNavigation from '@/components/BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { MapPin, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const { nearbyRestaurants, locationEnabled, userLocation, isLoading, restaurants } = useAppContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  
  const adBanners = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop",
      label: "RESTAURANT",
      title: "The Burgery Jyväskylä",
      description: "Grilled To Perfection - Powered By Better Food"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=300&fit=crop",
      label: "SPECIAL OFFER",
      title: "50% Off First Order",
      description: "Limited time offer - Order now!"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=300&fit=crop",
      label: "NEW",
      title: "Try Our Secret Menu",
      description: "Exclusive items you won't find anywhere else"
    }
  ];
  
  const nextAd = () => {
    setCurrentAdIndex((prev) => (prev + 1) % adBanners.length);
  };
  
  const prevAd = () => {
    setCurrentAdIndex((prev) => (prev - 1 + adBanners.length) % adBanners.length);
  };
  
  useEffect(() => {
    if (nearbyRestaurants.length === 0 && restaurants.length > 0) {
      console.log("Using fallback restaurants");
    }
  }, [nearbyRestaurants, restaurants]);
  
  const displayRestaurants = nearbyRestaurants.length > 0 ? nearbyRestaurants : restaurants;
  
  return (
    <div className="min-h-screen bg-white pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10 safe-top">
        <div className={`mx-auto ${isMobile ? 'px-4 max-w-[430px]' : 'container max-w-[1600px] px-8'} py-4 flex justify-between items-center`}>
          <h1 className="text-xl font-bold text-brand-cyan font-omnes">OrderU</h1>
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
      
      <main className="mx-auto max-w-[1600px] px-4 md:px-8 relative overflow-hidden">
        <>
          <section className={`${isMobile ? 'py-4' : 'py-6'}`}>
            {isMobile && (
              <div className="mb-3 relative rounded-lg overflow-hidden">
                <img 
                  src={adBanners[currentAdIndex].image} 
                  alt={adBanners[currentAdIndex].title} 
                  className="w-full h-[140px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white">
                  <div className="text-xs uppercase tracking-wider mb-1">{adBanners[currentAdIndex].label}</div>
                  <h3 className="text-xl font-bold mb-1">{adBanners[currentAdIndex].title}</h3>
                  <p className="text-sm">{adBanners[currentAdIndex].description}</p>
                </div>
                
                <Button 
                  onClick={prevAd}
                  className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/50 hover:bg-white/80 p-1 h-8 w-8"
                  size="icon"
                  variant="ghost"
                  aria-label="Previous advertisement"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <Button 
                  onClick={nextAd}
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/50 hover:bg-white/80 p-1 h-8 w-8"
                  size="icon"
                  variant="ghost"
                  aria-label="Next advertisement"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {adBanners.map((_, index) => (
                    <div 
                      key={index} 
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentAdIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {!isMobile && (
              <div className="mb-6 relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src={adBanners[currentAdIndex].image} 
                      alt={adBanners[currentAdIndex].title} 
                      className="w-full h-[200px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                      <div className="text-xs uppercase tracking-wider mb-1">{adBanners[currentAdIndex].label}</div>
                      <h3 className="text-2xl font-bold mb-1">{adBanners[currentAdIndex].title}</h3>
                      <p className="text-sm">{adBanners[currentAdIndex].description}</p>
                    </div>
                  </div>
                  
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src={adBanners[(currentAdIndex + 1) % adBanners.length].image} 
                      alt={adBanners[(currentAdIndex + 1) % adBanners.length].title} 
                      className="w-full h-[200px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                      <div className="text-xs uppercase tracking-wider mb-1">{adBanners[(currentAdIndex + 1) % adBanners.length].label}</div>
                      <h3 className="text-2xl font-bold mb-1">{adBanners[(currentAdIndex + 1) % adBanners.length].title}</h3>
                      <p className="text-sm">{adBanners[(currentAdIndex + 1) % adBanners.length].description}</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={prevAd}
                  className="absolute top-1/2 -left-5 -translate-y-1/2 rounded-full bg-white border border-gray-300 shadow-sm h-10 w-10"
                  size="icon"
                  variant="outline"
                  aria-label="Previous advertisement"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <Button 
                  onClick={nextAd}
                  className="absolute top-1/2 -right-5 -translate-y-1/2 rounded-full bg-white border border-gray-300 shadow-sm h-10 w-10"
                  size="icon"
                  variant="outline"
                  aria-label="Next advertisement"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-900 font-omnes">New on MunchMap</h2>
              <div className="flex items-center gap-2">
                <a href="#" className="text-brand-cyan font-medium text-sm font-omnes md:mr-2">See all</a>
                <div className="hidden md:flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full border-gray-300"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full border-gray-300"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {isLoading.restaurants ? (
              <div className="text-center py-10">
                <p className="text-gray-500 font-omnes">Finding restaurants near you...</p>
              </div>
            ) : displayRestaurants.length > 0 ? (
              <>
                <div className="md:hidden mx-[-16px]">
                  <div className="overflow-x-auto pl-4 pr-4 pb-1 flex gap-0.5 scrollbar-hide">
                    {displayRestaurants.map((restaurant, index) => (
                      <div key={restaurant.id} className="flex-shrink-0 w-[230px]">
                        <RestaurantCard restaurant={restaurant} />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="hidden md:grid grid-cols-4 gap-3">
                  {displayRestaurants.slice(0, 4).map(restaurant => (
                    <div key={restaurant.id}>
                      <RestaurantCard restaurant={restaurant} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 font-omnes">No restaurants found nearby</p>
              </div>
            )}
          </section>
          
          <section className={`${isMobile ? 'pt-0 pb-1' : 'py-2'}`}>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-900 font-omnes">Dinner near you</h2>
              <div className="flex items-center gap-2">
                <a href="#" className="text-brand-cyan font-medium text-sm font-omnes md:mr-2">See all</a>
                <div className="hidden md:flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full border-gray-300"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full border-gray-300"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {displayRestaurants.length > 0 ? (
              <>
                <div className="md:hidden mx-[-16px]">
                  <div className="overflow-x-auto pl-4 pr-4 pb-3 flex gap-0.5 scrollbar-hide">
                    {displayRestaurants.slice(0).reverse().map((restaurant, index) => (
                      <div key={restaurant.id} className="flex-shrink-0 w-[230px]">
                        <RestaurantCard restaurant={restaurant} />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="hidden md:grid grid-cols-4 gap-3">
                  {displayRestaurants.slice(0).reverse().slice(0, 4).map(restaurant => (
                    <div key={restaurant.id}>
                      <RestaurantCard restaurant={restaurant} />
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </section>
        </>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
