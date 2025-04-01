
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Restaurant } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Star, Clock } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleClick = () => {
    navigate(`/restaurant/${restaurant.id}`);
  };

  // Fixed delivery time (10-15 min)
  const deliveryTime = "10-15 min";
  // Simulate delivery fee (free or $2-$5)
  const deliveryFee = Math.random() > 0.3 
    ? `$${(Math.random() * 3 + 2).toFixed(1)}`
    : 'Free';
    
  // Generate a random rating between 4.3 and 5.0
  const rating = (Math.random() * 0.7 + 4.3).toFixed(1);

  return (
    <div 
      className={`overflow-hidden cursor-pointer rounded-xl card-hover ${isMobile ? 'h-[200px]' : 'h-full'}`}
      onClick={handleClick}
    >
      <div className="relative overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className={`w-full ${isMobile ? 'aspect-[16/10]' : 'aspect-[16/9]'} object-cover transition-transform duration-700 hover:scale-110`}
        />
        {restaurant.isNew && (
          <span className="absolute top-2 left-2 bg-brand-orange text-white text-xs font-semibold px-2 py-1 rounded-md">
            NEW
          </span>
        )}
      </div>
      <div className={`${isMobile ? 'px-3 py-2' : 'p-4'} bg-white shadow-sm border border-gray-100`}>
        <h3 className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'} line-clamp-1 font-arial`}>{restaurant.name}</h3>
        {/* Only show categories on desktop */}
        {!isMobile && (
          <p className={`text-gray-500 text-xs line-clamp-1 mb-2 font-arial`}>
            {restaurant.categories?.slice(0, 3).join(' • ')}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-brand-yellow text-brand-yellow" />
            <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{rating}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-gray-400" />
            <span className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>{deliveryTime}</span>
          </div>
          
          <span className={`${deliveryFee === 'Free' ? 'text-brand-green' : 'text-gray-700'} font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
            {deliveryFee}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
