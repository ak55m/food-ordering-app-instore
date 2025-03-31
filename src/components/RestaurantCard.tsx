
import React from 'react';
import { Clock, Star } from 'lucide-react';
import { Restaurant } from '@/types';
import { Card } from '@/components/ui/card';

interface RestaurantCardProps {
  restaurant: Restaurant;
  woltStyle?: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, woltStyle = false }) => {
  // Simulate delivery time (25-40 min)
  const minTime = Math.floor(Math.random() * 15) + 25;
  const maxTime = minTime + 10;
  const deliveryTime = `${minTime}-${maxTime}`;
  // Simulate delivery fee (free or €2-€5)
  const deliveryFee = Math.random() > 0.3 ? `€${(Math.random() * 3 + 2).toFixed(1)}` : '€0.00';

  if (woltStyle) {
    return (
      <div className="flex flex-col h-full">
        <div className="aspect-video relative rounded-lg overflow-hidden mb-2">
          <img 
            src={restaurant.image} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          {/* Badge for special offers */}
          {Math.random() > 0.5 && (
            <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 text-xs rounded-md">
              {Math.random() > 0.5 ? '20% off' : '€0 delivery'}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-bold text-base truncate">{restaurant.name}</h3>
          <p className="text-gray-500 text-sm truncate">
            {restaurant.categories?.slice(0, 1).join(', ')}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {deliveryTime} min
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{restaurant.rating}</span>
            </div>
          </div>
          
          <div className="mt-2 flex items-center">
            <span className="text-sm font-medium">{deliveryFee}</span>
            {deliveryFee === '€0.00' && (
              <span className="text-xs ml-1 text-gray-500">· FREE delivery</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card 
      className="overflow-hidden cursor-pointer card-hover border border-gray-200 shadow-sm w-full" 
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 md:p-4 lg:p-5">
        <h3 className="font-bold text-base md:text-lg lg:text-xl line-clamp-1 font-wolt">{restaurant.name}</h3>
        <p className="text-gray-500 text-xs md:text-sm line-clamp-1 mt-1">
          {restaurant.categories?.slice(0, 1).join(', ')}
        </p>
        
        <div className="flex items-center gap-2 mt-2 text-xs md:text-sm text-gray-600">
          <div className="flex items-center gap-0.5">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{restaurant.rating}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Clock className="h-4 w-4" />
            <span>{deliveryTime} min</span>
          </div>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm md:text-base font-medium">{deliveryFee}</span>
          {restaurant.distance && <span className="text-xs md:text-sm text-gray-500">{restaurant.distance}</span>}
        </div>
      </div>
    </Card>
  );
};

export default RestaurantCard;
