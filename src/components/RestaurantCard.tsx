
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Restaurant } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

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
  // Simulate delivery fee (free or €2-€5)
  const deliveryFee = Math.random() > 0.3 ? `€${(Math.random() * 3 + 2).toFixed(1)}` : '€0.00';

  return (
    <div 
      className={`overflow-hidden cursor-pointer rounded-lg shadow-sm border border-gray-200 bg-white ${isMobile ? 'h-[180px]' : 'h-full'}`}
      onClick={handleClick}
    >
      <div className="relative overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className={`w-full ${isMobile ? 'aspect-[15/8]' : 'aspect-[16/9]'} object-cover`}
        />
        {!isMobile && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
            14 days of €0 delivery fees
          </div>
        )}
      </div>
      <div className={`${isMobile ? 'px-2 py-2' : 'p-3'}`}>
        <h3 className={`font-bold ${isMobile ? 'text-xs' : 'text-base'} line-clamp-1 font-omnes`}>{restaurant.name}</h3>
        <p className={`text-gray-500 text-xs line-clamp-1 ${isMobile ? 'mb-0.5' : 'mb-1'} font-omnes`}>
          {restaurant.categories?.slice(0, 3).join(' • ')}
        </p>
        
        <div className="flex items-center text-sm">
          <span className={`font-medium text-brand-cyan ${isMobile ? 'text-xs' : ''}`}>{deliveryFee}</span>
          <span className="mx-1 text-gray-500">•</span>
          <span className={`text-gray-500 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>{deliveryTime}</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
