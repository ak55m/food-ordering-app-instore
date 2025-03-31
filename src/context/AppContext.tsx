
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { geocodeCoordinates } from '@/lib/geocoding';
import { 
  Restaurant, MenuItem, CartItem, Order, User, Category, 
  OrderStatus, UserRole, RestaurantOpeningHours, SocialMedia 
} from '@/types';
import { mockRestaurants, mockMenuItems, mockCategories } from '@/data/mockData';

// Re-export types for use by other components
export type { 
  Restaurant, MenuItem, CartItem, Order, User, Category,
  OrderStatus, UserRole, RestaurantOpeningHours, SocialMedia 
};

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
  
  // Restaurant Management
  restaurants: Restaurant[];
  categories: Category[];
  getRestaurantById: (id: string) => Restaurant | null;
  getRestaurantCategories: (restaurantId: string) => Category[];
  getCategoryMenuItems: (categoryId: string) => MenuItem[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  addMenuItem: (menuItem: Omit<MenuItem, 'restaurantId'>) => void;
  updateMenuItem: (menuItem: MenuItem) => void;
  deleteMenuItem: (menuItemId: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  updateRestaurant: (restaurant: Restaurant) => void;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  
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
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  
  // Category state
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  
  // Menu items state
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  
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
    const restaurant = restaurants.find(r => r.id === id) || null;
    setSelectedRestaurant(restaurant);
    
    if (restaurant) {
      // Fetch menu items for this restaurant
      fetchMenuItems(id);
    }
  };
  
  const getRestaurantById = (id: string): Restaurant | null => {
    return restaurants.find(r => r.id === id) || null;
  };
  
  // Update restaurant
  const updateRestaurant = (restaurant: Restaurant): void => {
    const updatedRestaurants = restaurants.map(r => 
      r.id === restaurant.id ? restaurant : r
    );
    setRestaurants(updatedRestaurants);
    toast.success('Restaurant updated successfully');
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
  
  // Category methods
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
  
  // Menu Item methods
  const getCategoryMenuItems = (categoryId: string): MenuItem[] => {
    return menuItems.filter(item => item.categoryId === categoryId);
  };
  
  const addMenuItem = (menuItem: Omit<MenuItem, 'restaurantId'>): void => {
    // Find category to get restaurantId
    const category = categories.find(cat => cat.id === menuItem.categoryId);
    
    if (!category) {
      toast.error('Category not found');
      return;
    }
    
    const newItem: MenuItem = {
      ...menuItem,
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
      
      // Get restaurant name
      const restaurant = restaurants.find(r => r.id === restaurantId);
      
      // Create new order
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
  
  // Order management for restaurant owners
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus): void => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    
    setOrders(updatedOrders);
    toast.success(`Order status updated to ${newStatus}`);
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
    
    // Restaurant Management
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
