
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { AppContextType } from './types';
import { useAuth } from './useAuth';
import { useLocation } from './useLocation';
import { useRestaurants } from './useRestaurants';
import { useMenu } from './useMenu';
import { useCart } from './useCart';
import { useOrders } from './useOrders';
import { Restaurant, MenuItem, CartItem, Order, User, Category, 
         OrderStatus, UserRole, RestaurantOpeningHours, SocialMedia } from '@/types';
import { toast } from 'sonner';

// Remove the non-existent import of setupRainbowTeashop
// import { setupRainbowTeashop } from '@/utils/setupRealData';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  const restaurantData = useRestaurants();
  const menuData = useMenu();
  const cartData = useCart();
  const orderData = useOrders();
  
  // Initialize user authentication
  useEffect(() => {
    auth.initUser();
  }, []);
  
  // Initialize location
  useEffect(() => {
    location.initLocation();
  }, []);
  
  // Handle location changes
  useEffect(() => {
    if (location.locationEnabled && location.userLocation) {
      restaurantData.fetchNearbyRestaurants(
        location.userLocation.latitude, 
        location.userLocation.longitude
      );
    }
  }, [location.locationEnabled, location.userLocation]);
  
  // Load menu items when restaurant is selected
  useEffect(() => {
    if (restaurantData.selectedRestaurant) {
      menuData.fetchMenuItems(restaurantData.selectedRestaurant.id);
    }
  }, [restaurantData.selectedRestaurant]);
  
  // Load user's orders when authenticated
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      orderData.fetchOrders(auth.user.id, auth.user.role);
    }
  }, [auth.isAuthenticated, auth.user]);

  // Display warning if using mock data
  useEffect(() => {
    if (restaurantData.usingMockData) {
      // This is handled in the useRestaurants hook now
    }
  }, [restaurantData.usingMockData]);
  
  const placeOrder = async (restaurantId: string, paymentMethod: 'credit_card' | 'cash'): Promise<void> => {
    const restaurant = restaurantData.getRestaurantById(restaurantId);
    await orderData.placeOrder(
      auth.user,
      cartData.cart,
      restaurantId,
      restaurant?.name,
      paymentMethod
    );
    cartData.clearCart();
  };
  
  // Combine all the state and methods into a single context value
  const contextValue: AppContextType = {
    // Auth
    user: auth.user,
    setUser: auth.setUser,
    isAuthenticated: auth.isAuthenticated,
    login: auth.login,
    logout: auth.logout,
    register: auth.register,
    auth, // Expose the entire auth object
    
    // Location
    locationEnabled: location.locationEnabled,
    userLocation: location.userLocation,
    requestLocation: location.requestLocation,
    
    // Restaurants
    nearbyRestaurants: restaurantData.nearbyRestaurants,
    selectedRestaurant: restaurantData.selectedRestaurant,
    selectRestaurant: restaurantData.selectRestaurant,
    
    // Menu items
    menuItems: menuData.menuItems,
    
    // Cart
    cart: cartData.cart,
    addToCart: cartData.addToCart,
    updateCartItemQuantity: cartData.updateCartItemQuantity,
    removeFromCart: cartData.removeFromCart,
    clearCart: cartData.clearCart,
    
    // Orders
    orders: orderData.orders,
    placeOrder,
    
    // Restaurant management
    restaurants: restaurantData.restaurants,
    categories: restaurantData.categories,
    getRestaurantById: restaurantData.getRestaurantById,
    getRestaurantCategories: restaurantData.getRestaurantCategories,
    getCategoryMenuItems: menuData.getCategoryMenuItems,
    updateOrderStatus: orderData.updateOrderStatus,
    addMenuItem: (menuItem) => {
      if (restaurantData.selectedRestaurant) {
        menuData.addMenuItem(menuItem, restaurantData.selectedRestaurant.id);
      }
    },
    updateMenuItem: menuData.updateMenuItem,
    deleteMenuItem: menuData.deleteMenuItem,
    addCategory: restaurantData.addCategory,
    updateCategory: restaurantData.updateCategory,
    deleteCategory: restaurantData.deleteCategory,
    updateRestaurant: restaurantData.updateRestaurant,
    setSelectedRestaurant: restaurantData.setSelectedRestaurant,
    
    // Loading states
    isLoading: {
      auth: auth.isLoading,
      location: location.isLoading,
      restaurants: restaurantData.isLoading,
      menuItems: menuData.isLoading,
      orders: orderData.isLoading,
    },
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Re-export types for convenience
export type { 
  Restaurant, MenuItem, CartItem, Order, User, Category,
  OrderStatus, UserRole, RestaurantOpeningHours, SocialMedia
};
