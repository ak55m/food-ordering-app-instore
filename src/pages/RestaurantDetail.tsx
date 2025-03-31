
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppContext, Category } from '@/context/AppContext';
import MenuItem from '@/components/MenuItem';
import Cart from '@/components/Cart';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BottomNavigation from '@/components/BottomNavigation';

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { restaurants, setSelectedRestaurant, getRestaurantCategories, getCategoryMenuItems } = useAppContext();
  const [activeCategory, setActiveCategory] = useState<string>("");
  
  const restaurant = restaurants.find(r => r.id === id);
  const categories = restaurant ? getRestaurantCategories(restaurant.id) : [];
  
  useEffect(() => {
    // Set the selected restaurant for the cart context
    if (restaurant) {
      setSelectedRestaurant(restaurant);
      
      // Set the first category as active if available
      if (categories.length > 0 && !activeCategory) {
        setActiveCategory(categories[0].id);
      }
    }
    
    return () => {
      // Clear selected restaurant when leaving the page
      setSelectedRestaurant(null);
    };
  }, [restaurant, categories, activeCategory, setSelectedRestaurant]);
  
  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Restaurant not found</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Restaurant Header */}
      <div className="relative h-48 md:h-64 bg-gray-800 overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white mb-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{restaurant.name}</h1>
          <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
            {restaurant.distance && <span>{restaurant.distance}</span>}
            {restaurant.distance && restaurant.categories && restaurant.categories.length > 0 && <span>•</span>}
            {restaurant.categories && restaurant.categories.length > 0 && 
              <span>{restaurant.categories.join(', ')}</span>
            }
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="w-full flex overflow-x-auto">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="flex-1"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map(category => {
                const menuItems = getCategoryMenuItems(category.id);
                return (
                  <TabsContent key={category.id} value={category.id}>
                    <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {menuItems.map(item => (
                        <MenuItem key={item.id} item={item} />
                      ))}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
          
          {/* Cart Section */}
          <div>
            <Cart />
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default RestaurantDetail;
