
import { useState, useEffect } from 'react';
import { Restaurant, Category } from '@/types';
import { mockRestaurants, mockCategories } from '@/data/mockData';
import { getRestaurants as fetchRestaurantsFromDB } from '@/services';

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchNearbyRestaurants = async (latitude: number, longitude: number): Promise<void> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Always show restaurants, even if using default location
      setNearbyRestaurants(mockRestaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      // Ensure we still have restaurants even on error
      setNearbyRestaurants(mockRestaurants);
    } finally {
      setIsLoading(false);
    }
  };

  const selectRestaurant = (id: string): void => {
    const restaurant = restaurants.find(r => r.id === id) || null;
    setSelectedRestaurant(restaurant);
  };

  const getRestaurantById = (id: string): Restaurant | null => {
    return restaurants.find(r => r.id === id) || null;
  };

  const updateRestaurant = (restaurant: Restaurant): void => {
    const updatedRestaurants = restaurants.map(r => 
      r.id === restaurant.id ? restaurant : r
    );
    setRestaurants(updatedRestaurants);
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
