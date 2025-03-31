
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bike } from 'lucide-react';
import { Restaurant } from '@/types';

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
    <div 
      className="overflow-hidden cursor-pointer rounded-lg shadow-sm border border-gray-200 bg-white w-full" 
      onClick={handleClick}
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="font-bold text-lg line-clamp-1 font-omnes">{restaurant.name}</h3>
        <p className="text-gray-500 text-sm line-clamp-1 mb-4 font-omnes">
          {restaurant.categories?.slice(0, 1).join(', ')}
        </p>
        
        <div className="flex items-center text-brand-cyan border-t border-gray-100 pt-3">
          <Bike className="h-5 w-5 mr-1" />
          <span className="font-medium">{deliveryFee}</span>
          <span className="mx-1">•</span>
          <span className="text-gray-500">{deliveryTime}</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
