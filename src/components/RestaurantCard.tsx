
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Restaurant } from '@/context/AppContext';
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
      className="overflow-hidden cursor-pointer card-hover" 
      onClick={handleClick}
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{restaurant.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{restaurant.rating}</span>
          </div>
          {restaurant.distance && <span className="text-sm text-gray-500">{restaurant.distance}</span>}
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {restaurant.categories && restaurant.categories.map((category, index) => (
            <span 
              key={index}
              className="text-xs bg-gray-100 px-2 py-1 rounded-full"
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
