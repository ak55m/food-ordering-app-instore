
import React, { useState } from 'react';
import { Plus, Star, Info } from 'lucide-react';
import { MenuItem as MenuItemType } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { addToCart } = useAppContext();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleAddToCart = () => {
    addToCart(item);
  };
  
  // Generate random popularity indicators
  const isPopular = Math.random() > 0.7;
  const isChefChoice = !isPopular && Math.random() > 0.8;

  return (
    <Card 
      className="h-full overflow-hidden card-hover border-0 shadow-soft"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        {isPopular && (
          <div className="absolute top-2 left-2 bg-brand-orange text-white text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1">
            <Star className="h-3 w-3 fill-brand-yellow" />
            Popular
          </div>
        )}
        {isChefChoice && (
          <div className="absolute top-2 left-2 bg-brand-cyan text-white text-xs font-semibold px-2 py-1 rounded-md">
            Chef's Choice
          </div>
        )}
      </div>
      <CardContent className="p-4 flex flex-col h-[calc(100%-12rem)] bg-white">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-base">{item.name}</h3>
          <div className="flex items-center">
            <span className="font-semibold text-brand-cyan">${item.price.toFixed(2)}</span>
            {item.description && (
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-1">
                      <Info className="h-4 w-4 text-gray-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white p-2 shadow-lg border border-gray-100 text-xs max-w-[200px]">
                    {item.description}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-3 flex-grow line-clamp-2">{item.description}</p>
        <Button 
          className="w-full mt-auto bg-brand-cyan hover:bg-brand-cyan-dark text-white transition-all"
          size="sm"
          onClick={handleAddToCart}
        >
          <Plus className="h-4 w-4 mr-1" /> Add to Order
        </Button>
      </CardContent>
    </Card>
  );
};

export default MenuItem;
