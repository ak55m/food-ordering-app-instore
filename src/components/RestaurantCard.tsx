
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
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

  return (
    <Card 
      className="overflow-hidden cursor-pointer card-hover h-full" 
      onClick={handleClick}
    >
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold text-sm line-clamp-1">{restaurant.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs">{restaurant.rating}</span>
          </div>
          {restaurant.distance && <span className="text-xs text-gray-500">{restaurant.distance}</span>}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {restaurant.categories && restaurant.categories.slice(0, 2).map((category, index) => (
            <span 
              key={index}
              className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full truncate"
            >
              {category}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
