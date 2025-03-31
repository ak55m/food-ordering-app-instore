
import { supabase } from '@/lib/supabase';
import { Restaurant, User, Category, MenuItem, Order, CartItem } from '@/context/AppContext';
import { toast } from 'sonner';

// Users
export const getUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (error) throw error;
    
    // In a real app, you would use proper authentication
    // This is just a simplified example
    if (data && password === 'password123') {
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const createUser = async (user: User) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

// Restaurants
export const getRestaurants = async () => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    toast.error('Failed to load restaurants');
    return [];
  }
};

export const getRestaurantById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching restaurant with ID ${id}:`, error);
    return null;
  }
};

export const updateRestaurant = async (restaurant: Restaurant) => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .update(restaurant)
      .eq('id', restaurant.id)
      .select();
    
    if (error) throw error;
    toast.success('Restaurant settings saved successfully!');
    return data[0];
  } catch (error) {
    console.error('Error updating restaurant:', error);
    toast.error('Failed to save restaurant settings');
    return null;
  }
};

// Categories
export const getCategories = async (restaurantId: string) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('restaurantId', restaurantId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const createCategory = async (category: Category) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select();
    
    if (error) throw error;
    toast.success('Category added successfully');
    return data[0];
  } catch (error) {
    console.error('Error creating category:', error);
    toast.error('Failed to add category');
    return null;
  }
};

export const updateCategory = async (category: Category) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', category.id)
      .select();
    
    if (error) throw error;
    toast.success('Category updated successfully');
    return data[0];
  } catch (error) {
    console.error('Error updating category:', error);
    toast.error('Failed to update category');
    return null;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
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
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('categoryId', categoryId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

export const createMenuItem = async (menuItem: MenuItem) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(menuItem)
      .select();
    
    if (error) throw error;
    toast.success('Menu item added successfully');
    return data[0];
  } catch (error) {
    console.error('Error creating menu item:', error);
    toast.error('Failed to add menu item');
    return null;
  }
};

export const updateMenuItem = async (menuItem: MenuItem) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .update(menuItem)
      .eq('id', menuItem.id)
      .select();
    
    if (error) throw error;
    toast.success('Menu item updated successfully');
    return data[0];
  } catch (error) {
    console.error('Error updating menu item:', error);
    toast.error('Failed to update menu item');
    return null;
  }
};

export const deleteMenuItem = async (id: string) => {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
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
    const query = supabase.from('orders').select('*');
    
    // If customer, filter by userId, if owner, get all orders for their restaurant
    if (role === 'customer') {
      query.eq('userId', userId);
    } else if (role === 'restaurant_owner') {
      // In a real app, we'd have the owner's restaurantId
      // This is just for demo purposes
      query.eq('restaurantId', 'owner-123');
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data.map(order => ({
      ...order,
      timestamp: new Date(order.timestamp),
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const placeOrder = async (order: Order) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        ...order,
        timestamp: order.timestamp.toISOString(),
      })
      .select();
    
    if (error) throw error;
    toast.success('Order placed successfully');
    return data[0];
  } catch (error) {
    console.error('Error placing order:', error);
    toast.error('Failed to place order');
    return null;
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    
    if (error) throw error;
    toast.success(`Order status updated to ${status}`);
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    toast.error('Failed to update order status');
    return false;
  }
};
