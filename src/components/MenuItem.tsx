
import React from 'react';
import { Plus } from 'lucide-react';
import { MenuItem as MenuItemType } from '@/context/AppContext';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { addToCart } = useAppContext();
  
  const handleAddToCart = () => {
    addToCart(item);
  };

  return (
    <Card className="h-full">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4 flex flex-col h-[calc(100%-12rem)]">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-base">{item.name}</h3>
          <span className="font-semibold">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-500 mb-3 flex-grow">{item.description}</p>
        <Button 
          className="w-full mt-auto btn-primary"
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
