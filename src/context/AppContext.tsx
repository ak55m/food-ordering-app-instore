import { createContext, useState, useContext, ReactNode, useEffect } from "react";

// Types definitions
export type UserRole = "customer" | "restaurant_owner" | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
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

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  address: string;
  latitude?: number;
  longitude?: number;
  rating: number;
  deliveryTime: string;
  distance?: string;
  categories: string[];
  ownerId?: string;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export type OrderStatus = "pending" | "preparing" | "ready" | "completed";

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  userId: string;
  items: CartItem[];
  status: OrderStatus;
  timestamp: Date;
  total: number;
}

interface AppContextType {
  // Cart related
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  
  // User related
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
  
  // Location related
  locationEnabled: boolean;
  userLocation: Location;
  requestLocation: () => void;
  
  // Restaurant related
  restaurants: Restaurant[];
  nearbyRestaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  getRestaurantById: (id: string) => Restaurant | undefined;
  updateRestaurant: (restaurant: Restaurant) => void;
  
  // Menu related
  categories: Category[];
  menuItems: MenuItem[];
  getRestaurantCategories: (restaurantId: string) => Category[];
  getCategoryMenuItems: (categoryId: string) => MenuItem[];
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  
  // Order related
  orders: Order[];
  placeOrder: (restaurantId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // State for cart
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // State for user
  const [user, setUser] = useState<User | null>(null);
  
  // State for location
  const [locationEnabled, setLocationEnabled] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<Location>({ lat: 0, lng: 0, address: "" });
  
  // State for restaurants
  const [restaurants, setRestaurants] = useState<Restaurant[]>([
    {
      id: "1",
      name: "Burger Palace",
      description: "Best burgers in town",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      address: "123 Main St",
      latitude: 40.7128,
      longitude: -74.0060,
      rating: 4.5,
      deliveryTime: "15-25 min",
      distance: "1.2 miles",
      categories: ["Burgers", "Fast Food"]
    },
    {
      id: "2",
      name: "Pizza Heaven",
      description: "Authentic Italian pizzas",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      address: "456 Oak Ave",
      latitude: 40.7300,
      longitude: -73.9950,
      rating: 4.7,
      deliveryTime: "20-30 min",
      distance: "2.5 miles",
      categories: ["Pizza", "Italian"]
    }
  ]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
  
  // State for menu
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Burgers", restaurantId: "1" },
    { id: "2", name: "Sides", restaurantId: "1" },
    { id: "3", name: "Pizzas", restaurantId: "2" },
    { id: "4", name: "Pastas", restaurantId: "2" }
  ]);
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: "1", name: "Classic Burger", description: "Beef patty with lettuce and tomato", price: 8.99, categoryId: "1" },
    { id: "2", name: "Cheese Burger", description: "Classic with cheddar cheese", price: 9.99, categoryId: "1" },
    { id: "3", name: "French Fries", description: "Crispy golden fries", price: 3.99, categoryId: "2" },
    { id: "4", name: "Margherita", description: "Tomato sauce, mozzarella, and basil", price: 12.99, categoryId: "3" },
    { id: "5", name: "Pepperoni", description: "Tomato sauce, mozzarella, and pepperoni", price: 14.99, categoryId: "3" },
    { id: "6", name: "Spaghetti Bolognese", description: "Pasta with meat sauce", price: 11.99, categoryId: "4" }
  ]);
  
  // State for orders
  const [orders, setOrders] = useState<Order[]>([]);

  // Cart functions
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      // Check if the item already exists in cart
      const existingItemIndex = prev.findIndex(
        (cartItem) => cartItem.menuItem.id === item.menuItem.id
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedCart = [...prev];
        updatedCart[existingItemIndex].quantity += item.quantity;
        return updatedCart;
      } else {
        // Add new item if it doesn't exist
        return [...prev, item];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.menuItem.id !== id));
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    setCart((prev) => 
      prev.map(item => 
        item.menuItem.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // User functions
  const logout = () => {
    setUser(null);
  };

  // Location functions
  const requestLocation = () => {
    // Simulating getting user's location
    setLocationEnabled(true);
    setUserLocation({
      lat: 40.7128,
      lng: -74.006,
      address: "New York, NY"
    });
    
    // Update nearby restaurants - in a real app, this would filter by distance
    const nearby = restaurants.filter(restaurant => {
      if (!restaurant.latitude || !restaurant.longitude) return false;
      
      // Simple distance calculation (not accurate for real-world use)
      const distance = Math.sqrt(
        Math.pow((restaurant.latitude - userLocation.lat), 2) + 
        Math.pow((restaurant.longitude - userLocation.lng), 2)
      );
      
      // Consider restaurants within a certain radius
      return distance < 0.1; // Arbitrary threshold
    });
    
    setNearbyRestaurants(restaurants); // For demo, we show all restaurants
  };

  // Restaurant functions
  const getRestaurantById = (id: string) => {
    return restaurants.find(restaurant => restaurant.id === id);
  };

  const updateRestaurant = (updatedRestaurant: Restaurant) => {
    setRestaurants(prev => 
      prev.map(restaurant => 
        restaurant.id === updatedRestaurant.id ? updatedRestaurant : restaurant
      )
    );
  };

  // Menu functions
  const getRestaurantCategories = (restaurantId: string) => {
    return categories.filter(category => category.restaurantId === restaurantId);
  };

  const getCategoryMenuItems = (categoryId: string) => {
    return menuItems.filter(item => item.categoryId === categoryId);
  };

  const addMenuItem = (item: MenuItem) => {
    setMenuItems(prev => [...prev, { ...item, id: Date.now().toString() }]);
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(prev => 
      prev.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const addCategory = (category: Category) => {
    setCategories(prev => [...prev, { ...category, id: Date.now().toString() }]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
  };

  // Order functions
  const placeOrder = (restaurantId: string) => {
    if (cart.length === 0 || !user) return;
    
    const restaurant = getRestaurantById(restaurantId);
    if (!restaurant) return;
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      restaurantId,
      restaurantName: restaurant.name,
      userId: user.id,
      items: [...cart],
      status: "pending",
      timestamp: new Date(),
      total: cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)
    };
    
    setOrders(prev => [...prev, newOrder]);
    clearCart();
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItemQuantity,
        user,
        setUser,
        logout,
        isAuthenticated: !!user,
        locationEnabled,
        userLocation,
        requestLocation,
        restaurants,
        nearbyRestaurants,
        selectedRestaurant,
        setSelectedRestaurant,
        getRestaurantById,
        updateRestaurant,
        categories,
        menuItems,
        getRestaurantCategories,
        getCategoryMenuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        addCategory,
        updateCategory,
        deleteCategory,
        orders,
        placeOrder,
        updateOrderStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
