
// Type definitions for the Food Delivery App

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'restaurant_owner';
  restaurantId?: string;
  password?: string; // Added password field (will be omitted when sending to client)
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
  isNew?: boolean;
  // Additional properties needed by RestaurantSettings
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  logo: string;
  coverImage: string;
  openingHours: RestaurantOpeningHours;
  socialMedia: SocialMedia;
  isActive: boolean;
  acceptsOnlineOrders: boolean;
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
  paymentMethod: 'credit_card' | 'cash' | 'saved_card';
  paymentStatus: 'paid' | 'pending' | 'failed';
  paymentMethodId?: string; // Reference to saved payment method if used
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

export type PaymentMethod = {
  id: string;
  userId: string;
  type: 'credit_card' | 'debit_card' | 'paypal';
  lastFour: string;
  expiryDate?: string;
  cardholderName?: string;
  isDefault: boolean;
  brand?: 'visa' | 'mastercard' | 'amex' | 'discover';
};
