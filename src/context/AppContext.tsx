import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { geocodeCoordinates } from '@/lib/geocoding';
import { 
  Restaurant, MenuItem, CartItem, Order, User, Category, 
  OrderStatus, UserRole, RestaurantOpeningHours, SocialMedia 
} from '@/types';
import { mockRestaurants, mockMenuItems, mockCategories } from '@/data/mockData';
import { 
  signIn, signOut, getCurrentUser, 
  getRestaurants as fetchRestaurantsFromDB
} from '@/services';
import { toast } from 'sonner';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  
  locationEnabled: boolean;
  userLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  requestLocation: () => Promise<void>;
  
  nearbyRestaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  selectRestaurant: (id: string) => void;
  
  menuItems: MenuItem[];
  
  cart: CartItem[];
  addToCart: (menuItem: MenuItem) => void;
  updateCartItemQuantity: (menuItemId: string, quantity: number) => void;
  removeFromCart: (menuItemId: string) => void;
  clearCart: () => void;
  
  orders: Order[];
  placeOrder: (restaurantId: string, paymentMethod: 'credit_card' | 'cash') => Promise<void>;
  
  restaurants: Restaurant[];
  categories: Category[];
  getRestaurantById: (id: string) => Restaurant | null;
  getRestaurantCategories: (restaurantId: string) => Category[];
  getCategoryMenuItems: (categoryId: string) => MenuItem[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  addMenuItem: (menuItem: Omit<MenuItem, 'id' | 'restaurantId'>) => void;
  updateMenuItem: (menuItem: MenuItem) => void;
  deleteMenuItem: (menuItemId: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  updateRestaurant: (restaurant: Restaurant) => void;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  
  isLoading: {
    auth: boolean;
    location: boolean;
    restaurants: boolean;
    menuItems: boolean;
    orders: boolean;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const USER_LOCATION_KEY = 'munchmap_user_location';

// Default location coordinates (New York City)
const DEFAULT_LATITUDE = 40.712776;
const DEFAULT_LONGITUDE = -74.005974;

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  const [locationEnabled, setLocationEnabled] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState({
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    address: 'New York City',
  });
  
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [isLoading, setIsLoading] = useState({
    auth: false,
    location: false,
    restaurants: false,
    menuItems: false,
    orders: false,
  });
  
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(prev => ({ ...prev, auth: true }));
      
      // Use the real Supabase authentication
      const loggedInUser = await signIn(email, password);
      
      if (loggedInUser) {
        setUser(loggedInUser);
        setIsAuthenticated(true);
        
        if (loggedInUser.role === 'restaurant_owner' && loggedInUser.restaurantId) {
          // Load restaurant data if the user is a restaurant owner
          // This would be done in a real implementation
        }
        
        toast.success('Login successful!');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(prev => ({ ...prev, auth: false }));
    }
  };
  
  const logout = async (): void => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('rememberUser');
      setCart([]);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };
  
  const requestLocation = async (): Promise<void> => {
    setIsLoading({ ...isLoading, location: true });
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });
      
      const { latitude, longitude } = position.coords;
      
      const address = await geocodeCoordinates(latitude, longitude);
      
      const newUserLocation = {
        latitude,
        longitude,
        address: address || 'Unknown location'
      };
      
      setUserLocation(newUserLocation);
      setLocationEnabled(true);
      
      localStorage.setItem(USER_LOCATION_KEY, JSON.stringify(newUserLocation));
      
      await fetchNearbyRestaurants(latitude, longitude);
      
    } catch (error) {
      console.error('Error getting location:', error);
      
      // If geolocation fails, still fetch restaurants using default location
      setLocationEnabled(true); // We still want to show restaurants
      await fetchNearbyRestaurants(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
      
      throw error;
    } finally {
      setIsLoading({ ...isLoading, location: false });
    }
  };
  
  const fetchNearbyRestaurants = async (latitude: number, longitude: number): Promise<void> => {
    setIsLoading({ ...isLoading, restaurants: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Always show restaurants, even if using default location
      setNearbyRestaurants(mockRestaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      // Ensure we still have restaurants even on error
      setNearbyRestaurants(mockRestaurants);
    } finally {
      setIsLoading({ ...isLoading, restaurants: false });
    }
  };
  
  const selectRestaurant = (id: string): void => {
    const restaurant = restaurants.find(r => r.id === id) || null;
    setSelectedRestaurant(restaurant);
    
    if (restaurant) {
      fetchMenuItems(id);
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
  };
  
  const fetchMenuItems = async (restaurantId: string): Promise<void> => {
    setIsLoading({ ...isLoading, menuItems: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const items = mockMenuItems.filter(item => item.restaurantId === restaurantId);
      setMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setIsLoading({ ...isLoading, menuItems: false });
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
  
  const getCategoryMenuItems = (categoryId: string): MenuItem[] => {
    return menuItems.filter(item => item.categoryId === categoryId);
  };
  
  const addMenuItem = (menuItem: Omit<MenuItem, 'id' | 'restaurantId'>): void => {
    const category = categories.find(cat => cat.id === menuItem.categoryId);
    
    if (!category) {
      return;
    }
    
    const newItem: MenuItem = {
      ...menuItem,
      id: `item-${Date.now()}`,
      restaurantId: category.restaurantId,
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
  
  const addToCart = (menuItem: MenuItem): void => {
    if (cart.length > 0) {
      const firstItem = cart[0];
      const firstItemDetails = menuItems.find(item => item.id === firstItem.menuItem.id);
      
      if (firstItemDetails && firstItemDetails.restaurantId !== menuItem.restaurantId) {
        if (window.confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
          setCart([{ menuItem, quantity: 1 }]);
        }
        return;
      }
    }
    
    const existingItemIndex = cart.findIndex(item => item.menuItem.id === menuItem.id);
    
    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { menuItem, quantity: 1 }]);
    }
  };
  
  const updateCartItemQuantity = (menuItemId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    
    const updatedCart = cart.map(item => 
      item.menuItem.id === menuItemId ? { ...item, quantity } : item
    );
    
    setCart(updatedCart);
  };
  
  const removeFromCart = (menuItemId: string): void => {
    const updatedCart = cart.filter(item => item.menuItem.id !== menuItemId);
    setCart(updatedCart);
  };
  
  const clearCart = (): void => {
    setCart([]);
  };
  
  const placeOrder = async (restaurantId: string, paymentMethod: 'credit_card' | 'cash'): Promise<void> => {
    if (!user) {
      return;
    }
    
    if (cart.length === 0) {
      return;
    }
    
    setIsLoading({ ...isLoading, orders: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const restaurant = restaurants.find(r => r.id === restaurantId);
      
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        userId: user.id,
        restaurantId,
        restaurantName: restaurant?.name,
        items: [...cart],
        status: 'pending',
        timestamp: new Date(),
        total: cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0),
        paymentMethod,
        paymentStatus: paymentMethod === 'credit_card' ? 'paid' : 'pending',
      };
      
      setOrders([newOrder, ...orders]);
      
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setIsLoading({ ...isLoading, orders: false });
    }
  };
  
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus): void => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    
    setOrders(updatedOrders);
  };
  
  useEffect(() => {
    async function initUser() {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          
          // Load orders for the current user
          if (currentUser.id) {
            // This would be implemented in a real app
          }
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      }
    }

    initUser();

    const storedLocation = localStorage.getItem(USER_LOCATION_KEY);
    if (storedLocation) {
      try {
        const parsedLocation = JSON.parse(storedLocation);
        setUserLocation(parsedLocation);
        setLocationEnabled(true);
        
        fetchNearbyRestaurants(parsedLocation.latitude, parsedLocation.longitude);
      } catch (error) {
        console.error('Error parsing stored location:', error);
        localStorage.removeItem(USER_LOCATION_KEY);
        
        // If stored location is invalid, use default location to show restaurants
        fetchNearbyRestaurants(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
        setLocationEnabled(true); // Show restaurants anyway
      }
    } else {
      // If no stored location, load restaurants using default location on initial load
      fetchNearbyRestaurants(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
      setLocationEnabled(true); // Show restaurants anyway
    }
  }, []);
  
  const contextValue: AppContextType = {
    user,
    setUser,
    isAuthenticated,
    login,
    logout,
    
    locationEnabled,
    userLocation,
    requestLocation,
    
    nearbyRestaurants,
    selectedRestaurant,
    selectRestaurant,
    
    menuItems,
    
    cart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    
    orders,
    placeOrder,
    
    restaurants,
    categories,
    getRestaurantById,
    getRestaurantCategories,
    getCategoryMenuItems,
    updateOrderStatus,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addCategory,
    updateCategory,
    deleteCategory,
    updateRestaurant,
    setSelectedRestaurant,
    
    isLoading,
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

export type { 
  Restaurant, MenuItem, CartItem, Order, User, Category,
  OrderStatus, UserRole, RestaurantOpeningHours, SocialMedia
};
