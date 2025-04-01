import { 
  Restaurant, MenuItem, CartItem, Order, User, Category,
  OrderStatus, UserRole, RestaurantOpeningHours, SocialMedia 
} from '@/types';

export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, userData: Partial<User>) => Promise<User | null>;
  auth: {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string, userData: Partial<User>) => Promise<User | null>;
    initUser: () => Promise<void>;
  };
  
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
