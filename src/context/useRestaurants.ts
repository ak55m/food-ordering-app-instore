
import { useState, useEffect } from 'react';
import { Restaurant, Category } from '@/types';
import { mockRestaurants, mockCategories } from '@/data/mockData';
import { getRestaurants as fetchRestaurantsFromDB, getRestaurantById } from '@/services';
import { calculateDistance, formatDistance } from '@/lib/geocoding';
import { toast } from 'sonner';

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [usingMockData, setUsingMockData] = useState<boolean>(false);

  // Load restaurants on mount
  useEffect(() => {
    const loadRestaurants = async () => {
      setIsLoading(true);
      const fetchedRestaurants = await fetchRestaurantsFromDB();
      
      if (fetchedRestaurants && fetchedRestaurants.length > 0) {
        setRestaurants(fetchedRestaurants);
        setNearbyRestaurants(fetchedRestaurants);
        setUsingMockData(false);
      } else {
        console.info('Using fallback restaurants');
        setRestaurants(mockRestaurants);
        setNearbyRestaurants(mockRestaurants);
        setUsingMockData(true);
        toast.warning('Using demo restaurant data. Connect to your database for real data.');
      }
      setIsLoading(false);
    };
    
    loadRestaurants();
  }, []);

  const fetchNearbyRestaurants = async (latitude: number, longitude: number): Promise<void> => {
    setIsLoading(true);
    
    try {
      let restaurantsToUse = restaurants;
      
      // Add distance to each restaurant
      const restaurantsWithDistance = restaurantsToUse.map(restaurant => {
        const distance = calculateDistance(
          latitude,
          longitude,
          restaurant.coordinates.latitude,
          restaurant.coordinates.longitude
        );
        
        return {
          ...restaurant,
          distance: formatDistance(distance)
        };
      });
      
      // Sort by distance
      restaurantsWithDistance.sort((a, b) => {
        const distA = parseFloat(a.distance?.replace('km', '').replace('m', '') || '0');
        const distB = parseFloat(b.distance?.replace('km', '').replace('m', '') || '0');
        return distA - distB;
      });
      
      setNearbyRestaurants(restaurantsWithDistance);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      // Ensure we still have restaurants even on error
      if (restaurants.length === 0) {
        setNearbyRestaurants(mockRestaurants);
        setUsingMockData(true);
        toast.error('Failed to load restaurants. Using demo data instead.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectRestaurant = async (id: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Try to get detailed restaurant data from database
      const restaurant = await getRestaurantById(id);
      
      if (restaurant) {
        setSelectedRestaurant(restaurant);
      } else {
        // Fall back to local state if database fetch fails
        const localRestaurant = restaurants.find(r => r.id === id) || null;
        setSelectedRestaurant(localRestaurant);
        
        if (!localRestaurant) {
          toast.error("Restaurant not found");
        }
      }
    } catch (error) {
      console.error("Error selecting restaurant:", error);
      // Fall back to local state
      const localRestaurant = restaurants.find(r => r.id === id) || null;
      setSelectedRestaurant(localRestaurant);
    } finally {
      setIsLoading(false);
    }
  };

  const getRestaurantById = (id: string): Restaurant | null => {
    return restaurants.find(r => r.id === id) || null;
  };

  const updateRestaurant = (restaurant: Restaurant): void => {
    const updatedRestaurants = restaurants.map(r => 
      r.id === restaurant.id ? restaurant : r
    );
    setRestaurants(updatedRestaurants);
    
    // If the selected restaurant was updated, update it as well
    if (selectedRestaurant && selectedRestaurant.id === restaurant.id) {
      setSelectedRestaurant(restaurant);
    }
  };

  const getRestaurantCategories = (restaurantId: string): Category[] => {
    return categories.filter(category => category.restaurantId === restaurantId);
  };

  const addCategory = (category: Omit<Category, 'id'>): void => {
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (updatedCategory: Category): void => {
    const newCategories = categories.map(cat => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    );
    setCategories(newCategories);
  };

  const deleteCategory = (categoryId: string): void => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
  };

  return {
    restaurants,
    setRestaurants,
    nearbyRestaurants,
    setNearbyRestaurants,
    selectedRestaurant,
    setSelectedRestaurant,
    categories,
    setCategories,
    isLoading,
    usingMockData,
    fetchNearbyRestaurants,
    selectRestaurant,
    getRestaurantById,
    updateRestaurant,
    getRestaurantCategories,
    addCategory,
    updateCategory,
    deleteCategory
  };
}
