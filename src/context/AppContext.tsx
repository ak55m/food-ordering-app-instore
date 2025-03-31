import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import * as databaseService from "@/services/databaseService";

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

export interface OpeningHours {
  open: string;
  close: string;
  isOpen: boolean;
}

export interface RestaurantOpeningHours {
  monday: OpeningHours;
  tuesday: OpeningHours;
  wednesday: OpeningHours;
  thursday: OpeningHours;
  friday: OpeningHours;
  saturday: OpeningHours;
  sunday: OpeningHours;
}

export interface SocialMedia {
  facebook: string;
  instagram: string;
  twitter: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  rating: number;
  deliveryTime: string;
  distance?: string;
  categories: string[];
  ownerId?: string;
  openingHours?: RestaurantOpeningHours;
  socialMedia?: SocialMedia;
  logo?: string;
  coverImage?: string;
  isActive?: boolean;
  acceptsOnlineOrders?: boolean;
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
  paymentMethod: 'credit_card' | 'cash';
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
  placeOrder: (restaurantId: string, paymentMethod: 'credit_card' | 'cash') => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  // Loading states
  isLoading: {
    restaurants: boolean;
    categories: boolean;
    menuItems: boolean;
    orders: boolean;
  };
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
      categories: ["Burgers", "Fast Food"],
      phone: "(555) 123-4567",
      email: "contact@burgerpalace.com",
      openingHours: {
        monday: { open: "09:00", close: "22:00", isOpen: true },
        tuesday: { open: "09:00", close: "22:00", isOpen: true },
        wednesday: { open: "09:00", close: "22:00", isOpen: true },
        thursday: { open: "09:00", close: "22:00", isOpen: true },
        friday: { open: "09:00", close: "23:00", isOpen: true },
        saturday: { open: "10:00", close: "23:00", isOpen: true },
        sunday: { open: "10:00", close: "22:00", isOpen: true },
      },
      socialMedia: {
        facebook: "https://facebook.com/burgerpalace",
        instagram: "https://instagram.com/burgerpalace",
        twitter: "https://twitter.com/burgerpalace",
      },
      logo: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      coverImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      isActive: true,
      acceptsOnlineOrders: true
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

  const updateRestaurant = async (updatedRestaurant: Restaurant) => {
    try {
      const result = await databaseService.updateRestaurant(updatedRestaurant);
      if (result) {
        setRestaurants(prev => 
          prev.map(restaurant => 
            restaurant.id === updatedRestaurant.id ? { ...restaurant, ...updatedRestaurant } : restaurant
          )
        );
      }
    } catch (error) {
      console.error('Error updating restaurant:', error);
    }
  };

  // Menu functions
  const getRestaurantCategories = (restaurantId: string) => {
    return categories.filter(category => category.restaurantId === restaurantId);
  };

  const getCategoryMenuItems = (categoryId: string) => {
    return menuItems.filter(item => item.categoryId === categoryId);
  };

  const addMenuItem = async (item: MenuItem) => {
    try {
      const newItem = { ...item, id: Date.now().toString() };
      const result = await databaseService.createMenuItem(newItem);
      if (result) {
        setMenuItems(prev => [...prev, result]);
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  const updateMenuItem = async (updatedItem: MenuItem) => {
    try {
      const result = await databaseService.updateMenuItem(updatedItem);
      if (result) {
        setMenuItems(prev => 
          prev.map(item => 
            item.id === updatedItem.id ? updatedItem : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      const result = await databaseService.deleteMenuItem(id);
      if (result) {
        setMenuItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const addCategory = async (category: Category) => {
    try {
      const newCategory = { ...category, id: Date.now().toString() };
      const result = await databaseService.createCategory(newCategory);
      if (result) {
        setCategories(prev => [...prev, result]);
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const updateCategory = async (updatedCategory: Category) => {
    try {
      const result = await databaseService.updateCategory(updatedCategory);
      if (result) {
        setCategories(prev => 
          prev.map(category => 
            category.id === updatedCategory.id ? updatedCategory : category
          )
        );
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const result = await databaseService.deleteCategory(id);
      if (result) {
        setCategories(prev => prev.filter(category => category.id !== id));
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Order functions
  const placeOrder = async (restaurantId: string, paymentMethod: 'credit_card' | 'cash' = 'credit_card') => {
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
      total: cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0),
      paymentMethod
    };
    
    try {
      const result = await databaseService.placeOrder(newOrder);
      if (result) {
        setOrders(prev => [...prev, newOrder]);
        clearCart();
        toast.success(`Order placed successfully! ${paymentMethod === 'cash' ? 'Please pay at pickup.' : 'Payment processed.'}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(`Failed to place order: ${error.message}`);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const result = await databaseService.updateOrderStatus(orderId, status);
      if (result) {
        setOrders(prev => 
          prev.map(order => 
            order.id === orderId ? { ...order, status } : order
          )
        );
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Fetch restaurants from database when component mounts
  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(prev => ({ ...prev, restaurants: true }));
      try {
        const fetchedRestaurants = await databaseService.getRestaurants();
        if (fetchedRestaurants.length > 0) {
          setRestaurants(fetchedRestaurants);
          setNearbyRestaurants(fetchedRestaurants); // For demo, show all
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        // Keep the default demo restaurants if fetching fails
      } finally {
        setIsLoading(prev => ({ ...prev, restaurants: false }));
      }
    };

    fetchRestaurants();
  }, []);

  // Fetch categories and menu items when selected restaurant changes
  useEffect(() => {
    if (selectedRestaurant) {
      const fetchCategoriesAndMenuItems = async () => {
        setIsLoading(prev => ({ ...prev, categories: true }));
        try {
          const fetchedCategories = await databaseService.getCategories(selectedRestaurant.id);
          if (fetchedCategories.length > 0) {
            setCategories(fetchedCategories);
            
            // Fetch menu items for each category
            const allMenuItems = [];
            setIsLoading(prev => ({ ...prev, menuItems: true }));
            
            for (const category of fetchedCategories) {
              const items = await databaseService.getMenuItems(category.id);
              allMenuItems.push(...items);
            }
            
            setMenuItems(allMenuItems);
          }
        } catch (error) {
          console.error("Error fetching categories and menu items:", error);
        } finally {
          setIsLoading(prev => ({ ...prev, categories: false, menuItems: false }));
        }
      };

      fetchCategoriesAndMenuItems();
    }
  }, [selectedRestaurant]);

  // Fetch orders when user changes
  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        setIsLoading(prev => ({ ...prev, orders: true }));
        try {
          const fetchedOrders = await databaseService.getOrders(user.id, user.role);
          setOrders(fetchedOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setIsLoading(prev => ({ ...prev, orders: false }));
        }
      };

      fetchOrders();
    }
  }, [user]);

  // Loading states
  const [isLoading, setIsLoading] = useState({
    restaurants: false,
    categories: false,
    menuItems: false,
    orders: false,
  });

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
        updateOrderStatus,
        isLoading
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
