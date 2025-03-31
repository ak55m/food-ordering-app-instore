
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star } from 'lucide-react';
import { Restaurant } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/restaurant/${restaurant.id}`);
  };

  // Simulate delivery time (25-40 min)
  const deliveryTime = `${Math.floor(Math.random() * 15) + 25}-${Math.floor(Math.random() * 15) + 40} min`;
  // Simulate delivery fee (free or €2-€5)
  const deliveryFee = Math.random() > 0.3 ? `€${(Math.random() * 3 + 2).toFixed(1)}` : '€0.00';

  return (
    <Card 
      className="overflow-hidden cursor-pointer card-hover h-full border-0 shadow-sm" 
      onClick={handleClick}
    >
      <div className="aspect-[5/3] relative overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-3">
        <h3 className="font-bold text-base line-clamp-1">{restaurant.name}</h3>
        <p className="text-gray-500 text-sm line-clamp-1 mt-0.5">
          {restaurant.categories?.slice(0, 1).join(', ')}
        </p>
        
        <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{restaurant.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{deliveryTime}</span>
          </div>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-medium">{deliveryFee}</span>
          {restaurant.distance && <span className="text-xs text-gray-500">{restaurant.distance}</span>}
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
