import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { geocodeCoordinates } from '@/lib/geocoding';
import { Restaurant, MenuItem, CartItem, Order, User } from '@/types';
import { mockRestaurants, mockMenuItems } from '@/data/mockData';

// Define the shape of our context
interface AppContextType {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  
  // Location
  locationEnabled: boolean;
  userLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  requestLocation: () => Promise<void>;
  
  // Restaurants
  nearbyRestaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  selectRestaurant: (id: string) => void;
  
  // Menu Items
  menuItems: MenuItem[];
  
  // Cart
  cart: CartItem[];
  addToCart: (menuItem: MenuItem) => void;
  updateCartItemQuantity: (menuItemId: string, quantity: number) => void;
  removeFromCart: (menuItemId: string) => void;
  clearCart: () => void;
  
  // Orders
  orders: Order[];
  placeOrder: (restaurantId: string, paymentMethod: 'credit_card' | 'cash') => Promise<void>;
  
  // Loading States
  isLoading: {
    auth: boolean;
    location: boolean;
    restaurants: boolean;
    menuItems: boolean;
    orders: boolean;
  };
}

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Authentication state
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Location state
  const [locationEnabled, setLocationEnabled] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
    address: '',
  });
  
  // Restaurant state
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  
  // Menu items state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState({
    auth: false,
    location: false,
    restaurants: false,
    menuItems: false,
    orders: false,
  });
  
  // Authentication methods
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading({ ...isLoading, auth: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic
      if (email === 'user@example.com' && password === 'password') {
        const user: User = {
          id: '1',
          email: 'user@example.com',
          name: 'John Doe',
          role: 'customer',
        };
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Logged in successfully!');
      } else if (email === 'restaurant@example.com' && password === 'password') {
        const user: User = {
          id: '2',
          email: 'restaurant@example.com',
          name: 'Restaurant Owner',
          role: 'restaurant_owner',
          restaurantId: 'rest1',
        };
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Logged in successfully!');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login');
    } finally {
      setIsLoading({ ...isLoading, auth: false });
    }
  };
  
  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    setCart([]);
    toast.success('Logged out successfully');
  };
  
  // Location methods
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
      
      // Get address from coordinates
      const address = await geocodeCoordinates(latitude, longitude);
      
      // Update user location
      const newUserLocation = {
        latitude,
        longitude,
        address: address || 'Unknown location'
      };
      
      setUserLocation(newUserLocation);
      setLocationEnabled(true);
      
      // Fetch restaurants near this location
      await fetchNearbyRestaurants(latitude, longitude);
      
    } catch (error) {
      console.error('Error getting location:', error);
      toast.error('Could not access your location');
      throw error;
    } finally {
      setIsLoading({ ...isLoading, location: false });
    }
  };
  
  // Restaurant methods
  const fetchNearbyRestaurants = async (latitude: number, longitude: number): Promise<void> => {
    setIsLoading({ ...isLoading, restaurants: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, return mock data
      setNearbyRestaurants(mockRestaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast.error('Failed to fetch nearby restaurants');
    } finally {
      setIsLoading({ ...isLoading, restaurants: false });
    }
  };
  
  const selectRestaurant = (id: string): void => {
    const restaurant = nearbyRestaurants.find(r => r.id === id) || null;
    setSelectedRestaurant(restaurant);
    
    if (restaurant) {
      // Fetch menu items for this restaurant
      fetchMenuItems(id);
    }
  };
  
  // Menu items methods
  const fetchMenuItems = async (restaurantId: string): Promise<void> => {
    setIsLoading({ ...isLoading, menuItems: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter mock menu items by restaurant ID
      const items = mockMenuItems.filter(item => item.restaurantId === restaurantId);
      setMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to fetch menu items');
    } finally {
      setIsLoading({ ...isLoading, menuItems: false });
    }
  };
  
  // Cart methods
  const addToCart = (menuItem: MenuItem): void => {
    // Check if we're adding an item from a different restaurant
    if (cart.length > 0) {
      const firstItem = cart[0];
      const firstItemDetails = menuItems.find(item => item.id === firstItem.menuItem.id);
      
      if (firstItemDetails && firstItemDetails.restaurantId !== menuItem.restaurantId) {
        // Ask user if they want to clear cart
        if (window.confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
          setCart([{ menuItem, quantity: 1 }]);
          toast.success(`Added ${menuItem.name} to cart`);
        }
        return;
      }
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.menuItem.id === menuItem.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([...cart, { menuItem, quantity: 1 }]);
    }
    
    toast.success(`Added ${menuItem.name} to cart`);
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
    toast.success('Item removed from cart');
  };
  
  const clearCart = (): void => {
    setCart([]);
  };
  
  // Order methods
  const placeOrder = async (restaurantId: string, paymentMethod: 'credit_card' | 'cash'): Promise<void> => {
    if (!user) {
      toast.error('You must be logged in to place an order');
      return;
    }
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setIsLoading({ ...isLoading, orders: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new order
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        userId: user.id,
        restaurantId,
        items: [...cart],
        status: 'pending',
        createdAt: new Date().toISOString(),
        total: cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0),
        paymentMethod,
        paymentStatus: paymentMethod === 'credit_card' ? 'paid' : 'pending',
      };
      
      // Add order to state
      setOrders([newOrder, ...orders]);
      
      // Clear cart
      clearCart();
      
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    } finally {
      setIsLoading({ ...isLoading, orders: false });
    }
  };
  
  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  // Context value
  const contextValue: AppContextType = {
    // Authentication
    user,
    isAuthenticated,
    login,
    logout,
    
    // Location
    locationEnabled,
    userLocation,
    requestLocation,
    
    // Restaurants
    nearbyRestaurants,
    selectedRestaurant,
    selectRestaurant,
    
    // Menu Items
    menuItems,
    
    // Cart
    cart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    
    // Orders
    orders,
    placeOrder,
    
    // Loading States
    isLoading,
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
