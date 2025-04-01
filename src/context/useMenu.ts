
import { useState } from 'react';
import { MenuItem } from '@/types';
import { mockMenuItems } from '@/data/mockData';

export function useMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchMenuItems = async (restaurantId: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const items = mockMenuItems.filter(item => item.restaurantId === restaurantId);
      setMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryMenuItems = (categoryId: string): MenuItem[] => {
    return menuItems.filter(item => item.categoryId === categoryId);
  };

  const addMenuItem = (menuItem: Omit<MenuItem, 'id' | 'restaurantId'>, restaurantId: string): void => {
    const newItem: MenuItem = {
      ...menuItem,
      id: `item-${Date.now()}`,
      restaurantId,
    };
    
    setMenuItems([...menuItems, newItem]);
  };

  const updateMenuItem = (updatedItem: MenuItem): void => {
    const newItems = menuItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    setMenuItems(newItems);
  };

  const deleteMenuItem = (menuItemId: string): void => {
    setMenuItems(menuItems.filter(item => item.id !== menuItemId));
  };

  return {
    menuItems,
    setMenuItems,
    isLoading,
    fetchMenuItems,
    getCategoryMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
  };
}
