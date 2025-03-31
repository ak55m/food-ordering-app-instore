
// Type definitions for the Food Delivery App

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'restaurant_owner';
  restaurantId?: string;
};

export type UserRole = 'customer' | 'restaurant_owner';

export type Restaurant = {
  id: string;
  name: string;
  description: string;
  image: string;
  categories?: string[];
  rating: number;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance?: string;
  isOpen?: boolean;
};

export type Category = {
  id: string;
  name: string;
  restaurantId: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  restaurantId?: string;
};

export type CartItem = {
  menuItem: MenuItem;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName?: string;
  items: CartItem[];
  status: OrderStatus;
  timestamp: Date;
  total: number;
  paymentMethod: 'credit_card' | 'cash';
  paymentStatus: 'paid' | 'pending' | 'failed';
};

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export type RestaurantOpeningHours = {
  [key: string]: {
    isOpen: boolean;
    open: string;
    close: string;
  }
};

export type SocialMedia = {
  facebook?: string;
  instagram?: string;
  twitter?: string;
};
