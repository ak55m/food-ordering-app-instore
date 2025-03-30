
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";

// Types
export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  distance: string;
  categories: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  restaurantId: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  total: number;
  timestamp: Date;
}

export interface UserLocation {
  latitude: number | null;
  longitude: number | null;
  address: string;
}

interface AppContextType {
  restaurants: Restaurant[];
  nearbyRestaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  categories: Category[];
  menuItems: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  userLocation: UserLocation;
  locationEnabled: boolean;
  
  // Actions
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  addToCart: (menuItem: MenuItem) => void;
  removeFromCart: (menuItemId: string) => void;
  updateCartItemQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: () => void;
  getRestaurantCategories: (restaurantId: string) => Category[];
  getCategoryMenuItems: (categoryId: string) => MenuItem[];
  requestLocation: () => Promise<void>;
}

// Mock data
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Burger Palace',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
    rating: 4.5,
    distance: '0.3 miles',
    categories: ['Burgers', 'American', 'Fast Food'],
  },
  {
    id: '2',
    name: 'Sushi Heaven',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=600&fit=crop',
    rating: 4.8,
    distance: '0.8 miles',
    categories: ['Japanese', 'Sushi', 'Asian'],
  },
  {
    id: '3',
    name: 'Pizza Planet',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop',
    rating: 4.2,
    distance: '1.2 miles',
    categories: ['Pizza', 'Italian'],
  },
  {
    id: '4',
    name: 'Taco Town',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop',
    rating: 4.3,
    distance: '1.5 miles',
    categories: ['Mexican', 'Tacos'],
  },
  {
    id: '5',
    name: 'Noodle House',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop',
    rating: 4.6,
    distance: '2.0 miles',
    categories: ['Chinese', 'Noodles', 'Asian'],
  },
];

const mockCategories: Category[] = [
  { id: 'c1', name: 'Burgers', restaurantId: '1' },
  { id: 'c2', name: 'Sides', restaurantId: '1' },
  { id: 'c3', name: 'Drinks', restaurantId: '1' },
  { id: 'c4', name: 'Sushi Rolls', restaurantId: '2' },
  { id: 'c5', name: 'Sashimi', restaurantId: '2' },
  { id: 'c6', name: 'Appetizers', restaurantId: '2' },
  { id: 'c7', name: 'Pizzas', restaurantId: '3' },
  { id: 'c8', name: 'Pastas', restaurantId: '3' },
  { id: 'c9', name: 'Tacos', restaurantId: '4' },
  { id: 'c10', name: 'Burritos', restaurantId: '4' },
  { id: 'c11', name: 'Soups', restaurantId: '5' },
  { id: 'c12', name: 'Noodle Bowls', restaurantId: '5' },
];

const mockMenuItems: MenuItem[] = [
  // Burger Palace
  { id: 'm1', name: 'Classic Burger', description: 'Beef patty with lettuce, tomato, and special sauce', price: 8.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop', categoryId: 'c1' },
  { id: 'm2', name: 'Cheese Burger', description: 'Classic burger with American cheese', price: 9.99, image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=500&h=300&fit=crop', categoryId: 'c1' },
  { id: 'm3', name: 'Bacon Burger', description: 'Classic burger with crispy bacon strips', price: 10.99, image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&h=300&fit=crop', categoryId: 'c1' },
  { id: 'm4', name: 'French Fries', description: 'Crispy golden fries', price: 3.99, image: 'https://images.unsplash.com/photo-1576777647209-e8733d7b851d?w=500&h=300&fit=crop', categoryId: 'c2' },
  { id: 'm5', name: 'Onion Rings', description: 'Crispy battered onion rings', price: 4.99, image: 'https://images.unsplash.com/photo-1639024471283-03bce1be0dfe?w=500&h=300&fit=crop', categoryId: 'c2' },
  { id: 'm6', name: 'Soft Drink', description: 'Choice of cola, lemon-lime, or root beer', price: 2.49, image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=500&h=300&fit=crop', categoryId: 'c3' },
  { id: 'm7', name: 'Milkshake', description: 'Creamy vanilla, chocolate, or strawberry', price: 4.99, image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&h=300&fit=crop', categoryId: 'c3' },
  
  // Sushi Heaven
  { id: 'm8', name: 'California Roll', description: 'Crab, avocado, and cucumber', price: 6.99, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&h=300&fit=crop', categoryId: 'c4' },
  { id: 'm9', name: 'Spicy Tuna Roll', description: 'Tuna and spicy mayo', price: 7.99, image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&h=300&fit=crop', categoryId: 'c4' },
  { id: 'm10', name: 'Salmon Sashimi', description: 'Fresh sliced salmon', price: 9.99, image: 'https://images.unsplash.com/photo-1584583570840-0d5b9bd0c9df?w=500&h=300&fit=crop', categoryId: 'c5' },
  { id: 'm11', name: 'Tuna Sashimi', description: 'Fresh sliced tuna', price: 10.99, image: 'https://images.unsplash.com/photo-1579398937948-576d4f3c9f6f?w=500&h=300&fit=crop', categoryId: 'c5' },
  { id: 'm12', name: 'Edamame', description: 'Steamed soybeans with salt', price: 4.99, image: 'https://images.unsplash.com/photo-1561626423-3509148ae474?w=500&h=300&fit=crop', categoryId: 'c6' },
  
  // Pizza Planet
  { id: 'm13', name: 'Margherita Pizza', description: 'Fresh tomato sauce, mozzarella, and basil', price: 12.99, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=300&fit=crop', categoryId: 'c7' },
  { id: 'm14', name: 'Pepperoni Pizza', description: 'Tomato sauce, mozzarella, and pepperoni', price: 14.99, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=300&fit=crop', categoryId: 'c7' },
  { id: 'm15', name: 'Spaghetti Bolognese', description: 'Pasta with meat sauce', price: 11.99, image: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=500&h=300&fit=crop', categoryId: 'c8' },
  
  // Taco Town
  { id: 'm16', name: 'Beef Taco', description: 'Seasoned ground beef with lettuce, cheese, and tomato', price: 3.99, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&h=300&fit=crop', categoryId: 'c9' },
  { id: 'm17', name: 'Chicken Taco', description: 'Grilled chicken with lettuce, cheese, and tomato', price: 3.99, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=300&fit=crop', categoryId: 'c9' },
  { id: 'm18', name: 'Bean Burrito', description: 'Refried beans, cheese, lettuce, and tomato', price: 6.99, image: 'https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?w=500&h=300&fit=crop', categoryId: 'c10' },
  
  // Noodle House
  { id: 'm19', name: 'Wonton Soup', description: 'Clear broth with pork dumplings', price: 5.99, image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&h=300&fit=crop', categoryId: 'c11' },
  { id: 'm20', name: 'Lo Mein', description: 'Stir-fried noodles with vegetables', price: 10.99, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=300&fit=crop', categoryId: 'c12' },
];

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [categories] = useState<Category[]>(mockCategories);
  const [menuItems] = useState<MenuItem[]>(mockMenuItems);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation>({
    latitude: null,
    longitude: null,
    address: '',
  });
  const [locationEnabled, setLocationEnabled] = useState<boolean>(false);

  useEffect(() => {
    // When user location changes, update nearby restaurants
    if (locationEnabled && userLocation.latitude && userLocation.longitude) {
      // In a real app, we'd fetch restaurants based on coordinates
      // For now, just use mock data
      setNearbyRestaurants(mockRestaurants);
    } else {
      setNearbyRestaurants([]);
    }
  }, [userLocation, locationEnabled]);

  const requestLocation = async (): Promise<void> => {
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: 'Current Location', // In a real app, we'd use reverse geocoding
          });
          setLocationEnabled(true);
          toast.success("Location accessed successfully");
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not access your location");
          setLocationEnabled(false);
        }
      );
    } catch (error) {
      console.error("Error requesting location:", error);
      toast.error("Could not access your location");
      setLocationEnabled(false);
    }
  };

  const getRestaurantCategories = (restaurantId: string): Category[] => {
    return categories.filter(category => category.restaurantId === restaurantId);
  };

  const getCategoryMenuItems = (categoryId: string): MenuItem[] => {
    return menuItems.filter(item => item.categoryId === categoryId);
  };

  const addToCart = (menuItem: MenuItem): void => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.menuItem.id === menuItem.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.menuItem.id === menuItem.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { menuItem, quantity: 1 }];
      }
    });
    toast.success(`Added ${menuItem.name} to cart`);
  };

  const removeFromCart = (menuItemId: string): void => {
    setCart(prevCart => prevCart.filter(item => item.menuItem.id !== menuItemId));
  };

  const updateCartItemQuantity = (menuItemId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.menuItem.id === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = (): void => {
    setCart([]);
  };

  const placeOrder = (): void => {
    if (!selectedRestaurant || cart.length === 0) return;
    
    const total = cart.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity, 
      0
    );
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      restaurantId: selectedRestaurant.id,
      restaurantName: selectedRestaurant.name,
      items: [...cart],
      status: 'pending',
      total,
      timestamp: new Date(),
    };
    
    setOrders(prevOrders => [...prevOrders, newOrder]);
    clearCart();
    toast.success("Order placed successfully!");
    
    // In a real app, this would send the order to the backend
    // For demo purposes, simulate status changes
    simulateOrderProcess(newOrder.id);
  };

  const simulateOrderProcess = (orderId: string): void => {
    // Simulate order processing
    setTimeout(() => {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: 'preparing' } : order
        )
      );
      
      // Simulate order ready
      setTimeout(() => {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? { ...order, status: 'ready' } : order
          )
        );
        
        // Simulate order completed
        setTimeout(() => {
          setOrders(prevOrders => 
            prevOrders.map(order => 
              order.id === orderId ? { ...order, status: 'completed' } : order
            )
          );
        }, 60000); // 1 minute after ready
      }, 30000); // 30 seconds after preparing
    }, 10000); // 10 seconds after placing order
  };

  const value = {
    restaurants,
    nearbyRestaurants,
    selectedRestaurant,
    setSelectedRestaurant,
    categories,
    menuItems,
    cart,
    orders,
    userLocation,
    locationEnabled,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    placeOrder,
    getRestaurantCategories,
    getCategoryMenuItems,
    requestLocation,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook for using the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
