
import { Restaurant, User, Category, MenuItem, Order, CartItem } from '@/context/AppContext';
import { toast } from 'sonner';

// Local storage keys
const STORAGE_KEYS = {
  USERS: 'foodapp_users',
  RESTAURANTS: 'foodapp_restaurants',
  CATEGORIES: 'foodapp_categories',
  MENU_ITEMS: 'foodapp_menu_items',
  ORDERS: 'foodapp_orders'
};

// Helper functions to work with localStorage
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    
    // Parse the JSON and handle Date objects
    const data = JSON.parse(item, (key, value) => {
      // Convert ISO date strings back to Date objects
      if (key === 'timestamp' && typeof value === 'string') {
        return new Date(value);
      }
      return value;
    });
    
    return data;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  try {
    // Store dates as ISO strings to preserve them in JSON
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
};

// Users
export const getUser = async (email: string, password: string) => {
  try {
    const users = getStorageItem<User[]>(STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.email === email);
    
    // In a real app, you would hash passwords
    if (user && password === 'password123') {
      return user;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const createUser = async (user: User) => {
  try {
    const users = getStorageItem<User[]>(STORAGE_KEYS.USERS, []);
    users.push(user);
    setStorageItem(STORAGE_KEYS.USERS, users);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

// Restaurants
export const getRestaurants = async () => {
  try {
    return getStorageItem<Restaurant[]>(STORAGE_KEYS.RESTAURANTS, []);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    toast.error('Failed to load restaurants');
    return [];
  }
};

export const getRestaurantById = async (id: string) => {
  try {
    const restaurants = getStorageItem<Restaurant[]>(STORAGE_KEYS.RESTAURANTS, []);
    return restaurants.find(r => r.id === id) || null;
  } catch (error) {
    console.error(`Error fetching restaurant with ID ${id}:`, error);
    return null;
  }
};

export const updateRestaurant = async (restaurant: Restaurant) => {
  try {
    const restaurants = getStorageItem<Restaurant[]>(STORAGE_KEYS.RESTAURANTS, []);
    const updatedRestaurants = restaurants.map(r => 
      r.id === restaurant.id ? { ...r, ...restaurant } : r
    );
    setStorageItem(STORAGE_KEYS.RESTAURANTS, updatedRestaurants);
    toast.success('Restaurant settings saved successfully!');
    return restaurant;
  } catch (error) {
    console.error('Error updating restaurant:', error);
    toast.error('Failed to save restaurant settings');
    return null;
  }
};

// Categories
export const getCategories = async (restaurantId: string) => {
  try {
    const categories = getStorageItem<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    return categories.filter(c => c.restaurantId === restaurantId);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const createCategory = async (category: Category) => {
  try {
    const categories = getStorageItem<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    categories.push(category);
    setStorageItem(STORAGE_KEYS.CATEGORIES, categories);
    toast.success('Category added successfully');
    return category;
  } catch (error) {
    console.error('Error creating category:', error);
    toast.error('Failed to add category');
    return null;
  }
};

export const updateCategory = async (category: Category) => {
  try {
    const categories = getStorageItem<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    const updatedCategories = categories.map(c => 
      c.id === category.id ? { ...c, ...category } : c
    );
    setStorageItem(STORAGE_KEYS.CATEGORIES, updatedCategories);
    toast.success('Category updated successfully');
    return category;
  } catch (error) {
    console.error('Error updating category:', error);
    toast.error('Failed to update category');
    return null;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const categories = getStorageItem<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    const updatedCategories = categories.filter(c => c.id !== id);
    setStorageItem(STORAGE_KEYS.CATEGORIES, updatedCategories);
    toast.success('Category deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    toast.error('Failed to delete category');
    return false;
  }
};

// Menu Items
export const getMenuItems = async (categoryId: string) => {
  try {
    const menuItems = getStorageItem<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, []);
    return menuItems.filter(item => item.categoryId === categoryId);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

export const createMenuItem = async (menuItem: MenuItem) => {
  try {
    const menuItems = getStorageItem<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, []);
    menuItems.push(menuItem);
    setStorageItem(STORAGE_KEYS.MENU_ITEMS, menuItems);
    toast.success('Menu item added successfully');
    return menuItem;
  } catch (error) {
    console.error('Error creating menu item:', error);
    toast.error('Failed to add menu item');
    return null;
  }
};

export const updateMenuItem = async (menuItem: MenuItem) => {
  try {
    const menuItems = getStorageItem<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, []);
    const updatedMenuItems = menuItems.map(item => 
      item.id === menuItem.id ? { ...item, ...menuItem } : item
    );
    setStorageItem(STORAGE_KEYS.MENU_ITEMS, updatedMenuItems);
    toast.success('Menu item updated successfully');
    return menuItem;
  } catch (error) {
    console.error('Error updating menu item:', error);
    toast.error('Failed to update menu item');
    return null;
  }
};

export const deleteMenuItem = async (id: string) => {
  try {
    const menuItems = getStorageItem<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, []);
    const updatedMenuItems = menuItems.filter(item => item.id !== id);
    setStorageItem(STORAGE_KEYS.MENU_ITEMS, updatedMenuItems);
    toast.success('Menu item deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    toast.error('Failed to delete menu item');
    return false;
  }
};

// Orders
export const getOrders = async (userId: string, role: string) => {
  try {
    const orders = getStorageItem<Order[]>(STORAGE_KEYS.ORDERS, []);
    
    // Ensure timestamps are Date objects
    const ordersWithDates = orders.map(order => ({
      ...order,
      timestamp: order.timestamp instanceof Date ? order.timestamp : new Date(order.timestamp)
    }));
    
    // Filter orders based on role
    if (role === 'customer') {
      return ordersWithDates.filter(order => order.userId === userId);
    } else if (role === 'restaurant_owner') {
      // For restaurant owner, return all orders since we're using a mock database
      // In a real app, we would filter by the restaurantId associated with the owner
      console.log('Restaurant owner orders:', ordersWithDates);
      return ordersWithDates;
    }
    
    return ordersWithDates;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const placeOrder = async (order: Order) => {
  try {
    // Ensure the timestamp is a Date object
    if (!(order.timestamp instanceof Date)) {
      order.timestamp = new Date(order.timestamp);
    }
    
    const orders = getStorageItem<Order[]>(STORAGE_KEYS.ORDERS, []);
    orders.push(order);
    setStorageItem(STORAGE_KEYS.ORDERS, orders);
    return order;
  } catch (error) {
    console.error('Error placing order:', error);
    toast.error('Failed to place order');
    return null;
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const orders = getStorageItem<Order[]>(STORAGE_KEYS.ORDERS, []);
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    setStorageItem(STORAGE_KEYS.ORDERS, updatedOrders);
    toast.success(`Order status updated to ${status}`);
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    toast.error('Failed to update order status');
    return false;
  }
};
