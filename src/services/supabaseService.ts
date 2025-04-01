
import { supabase } from '@/lib/supabase';
import { 
  Restaurant, User, Category, MenuItem, Order, CartItem, 
  OrderStatus, PaymentMethod 
} from '@/types';
import { toast } from 'sonner';

// Authentication
export async function signUp(email: string, password: string, userData: Partial<User>) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      }
    });

    if (error) {
      toast.error(error.message);
      return null;
    }

    if (data?.user) {
      // Create user profile in the users table
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        email: email,
        name: userData.name || '',
        role: userData.role || 'customer',
        restaurant_id: userData.restaurantId || null,
        created_at: new Date().toISOString(),
      });

      if (profileError) {
        toast.error('Error creating user profile');
        return null;
      }

      toast.success('Account created successfully!');
      return data.user;
    }
    
    return null;
  } catch (error) {
    console.error('Error signing up:', error);
    toast.error('Failed to create account');
    return null;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast.error(error.message);
      return null;
    }

    if (data?.user) {
      // Get user profile data
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        toast.error('Error fetching user profile');
        return null;
      }

      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        restaurantId: profile.restaurant_id,
      };
    }

    return null;
  } catch (error) {
    console.error('Error signing in:', error);
    toast.error('Failed to sign in');
    return null;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return false;
    }
    toast.success('Signed out successfully');
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    toast.error('Failed to sign out');
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return null;
    }

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      return null;
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      restaurantId: profile.restaurant_id,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Restaurants
export async function getRestaurants() {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_active', true);
      
    if (error) {
      toast.error('Failed to load restaurants');
      return [];
    }
    
    // Transform database format to application format
    return data.map(transformRestaurantFromDB);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    toast.error('Failed to load restaurants');
    return [];
  }
}

export async function getRestaurantById(id: string) {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        restaurant_opening_hours(*),
        restaurant_social_media(*)
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      return null;
    }
    
    return transformRestaurantWithRelations(data);
  } catch (error) {
    console.error(`Error fetching restaurant with ID ${id}:`, error);
    return null;
  }
}

export async function updateRestaurant(restaurant: Restaurant) {
  try {
    // First update the main restaurant info
    const { error } = await supabase
      .from('restaurants')
      .update({
        name: restaurant.name,
        description: restaurant.description,
        address: restaurant.address,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        phone: restaurant.phone,
        email: restaurant.email,
        logo: restaurant.logo,
        cover_image: restaurant.coverImage,
        is_active: restaurant.isActive,
        accepts_online_orders: restaurant.acceptsOnlineOrders
      })
      .eq('id', restaurant.id);
      
    if (error) {
      toast.error('Failed to save restaurant settings');
      return null;
    }
    
    // Update opening hours
    for (const [day, hours] of Object.entries(restaurant.openingHours)) {
      const { error: hoursError } = await supabase
        .from('restaurant_opening_hours')
        .upsert({
          restaurant_id: restaurant.id,
          day: day,
          is_open: hours.isOpen,
          open_time: hours.open,
          close_time: hours.close
        });
        
      if (hoursError) {
        toast.error('Error updating restaurant hours');
        return null;
      }
    }
    
    // Update social media
    for (const [platform, url] of Object.entries(restaurant.socialMedia)) {
      if (url) {
        const { error: socialError } = await supabase
          .from('restaurant_social_media')
          .upsert({
            restaurant_id: restaurant.id,
            platform: platform,
            url: url
          });
          
        if (socialError) {
          toast.error('Error updating social media info');
          return null;
        }
      }
    }
    
    toast.success('Restaurant settings saved successfully!');
    return restaurant;
  } catch (error) {
    console.error('Error updating restaurant:', error);
    toast.error('Failed to save restaurant settings');
    return null;
  }
}

// Categories
export async function getCategories(restaurantId: string) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('restaurant_id', restaurantId);
      
    if (error) {
      return [];
    }
    
    return data.map(cat => ({
      id: cat.id,
      name: cat.name,
      restaurantId: cat.restaurant_id
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function createCategory(category: Omit<Category, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: category.name,
        restaurant_id: category.restaurantId
      })
      .select()
      .single();
      
    if (error) {
      toast.error('Failed to add category');
      return null;
    }
    
    toast.success('Category added successfully');
    return {
      id: data.id,
      name: data.name,
      restaurantId: data.restaurant_id
    };
  } catch (error) {
    console.error('Error creating category:', error);
    toast.error('Failed to add category');
    return null;
  }
}

export async function updateCategory(category: Category) {
  try {
    const { error } = await supabase
      .from('categories')
      .update({
        name: category.name
      })
      .eq('id', category.id);
      
    if (error) {
      toast.error('Failed to update category');
      return null;
    }
    
    toast.success('Category updated successfully');
    return category;
  } catch (error) {
    console.error('Error updating category:', error);
    toast.error('Failed to update category');
    return null;
  }
}

export async function deleteCategory(id: string) {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
      
    if (error) {
      toast.error('Failed to delete category');
      return false;
    }
    
    toast.success('Category deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    toast.error('Failed to delete category');
    return false;
  }
}

// Menu Items
export async function getMenuItems(categoryId: string) {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category_id', categoryId);
      
    if (error) {
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      categoryId: item.category_id,
      restaurantId: item.restaurant_id
    }));
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
}

export async function createMenuItem(menuItem: Omit<MenuItem, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        image: menuItem.image,
        category_id: menuItem.categoryId,
        restaurant_id: menuItem.restaurantId
      })
      .select()
      .single();
      
    if (error) {
      toast.error('Failed to add menu item');
      return null;
    }
    
    toast.success('Menu item added successfully');
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      image: data.image,
      categoryId: data.category_id,
      restaurantId: data.restaurant_id
    };
  } catch (error) {
    console.error('Error creating menu item:', error);
    toast.error('Failed to add menu item');
    return null;
  }
}

export async function updateMenuItem(menuItem: MenuItem) {
  try {
    const { error } = await supabase
      .from('menu_items')
      .update({
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        image: menuItem.image,
        category_id: menuItem.categoryId
      })
      .eq('id', menuItem.id);
      
    if (error) {
      toast.error('Failed to update menu item');
      return null;
    }
    
    toast.success('Menu item updated successfully');
    return menuItem;
  } catch (error) {
    console.error('Error updating menu item:', error);
    toast.error('Failed to update menu item');
    return null;
  }
}

export async function deleteMenuItem(id: string) {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
      
    if (error) {
      toast.error('Failed to delete menu item');
      return false;
    }
    
    toast.success('Menu item deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    toast.error('Failed to delete menu item');
    return false;
  }
}

// Orders
export async function getOrders(userId: string, role: string) {
  try {
    let query = supabase.from('orders').select(`
      *,
      order_items(
        *,
        menu_items(*)
      )
    `);
    
    // Filter orders based on role
    if (role === 'customer') {
      query = query.eq('user_id', userId);
    } else if (role === 'restaurant_owner') {
      query = query.eq('restaurant_id', userId);
    }
    
    const { data, error } = await query.order('timestamp', { ascending: false });
    
    if (error) {
      return [];
    }
    
    return data.map(transformOrderFromDB);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function placeOrder(order: Omit<Order, 'id'>) {
  try {
    // Create the order first
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: order.userId,
        restaurant_id: order.restaurantId,
        status: order.status,
        timestamp: new Date().toISOString(),
        total: order.total,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
        payment_method_id: order.paymentMethodId || null
      })
      .select()
      .single();
      
    if (orderError) {
      toast.error('Failed to place order');
      return null;
    }
    
    // Add order items
    for (const item of order.items) {
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: orderData.id,
          menu_item_id: item.menuItem.id,
          quantity: item.quantity,
          price: item.menuItem.price
        });
        
      if (itemError) {
        console.error('Error adding order item:', itemError);
        // Continue anyway to try to add as many items as possible
      }
    }
    
    toast.success('Order placed successfully');
    
    return {
      ...order,
      id: orderData.id
    };
  } catch (error) {
    console.error('Error placing order:', error);
    toast.error('Failed to place order');
    return null;
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const { error } = await supabase
      .from('orders')
      .update({
        status: status
      })
      .eq('id', orderId);
      
    if (error) {
      toast.error('Failed to update order status');
      return false;
    }
    
    toast.success(`Order status updated to ${status}`);
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    toast.error('Failed to update order status');
    return false;
  }
}

// Payment Methods
export async function getPaymentMethods(userId: string) {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      return [];
    }
    
    return data.map(pm => ({
      id: pm.id,
      userId: pm.user_id,
      type: pm.type as 'credit_card' | 'debit_card' | 'paypal',
      lastFour: pm.last_four,
      expiryDate: pm.expiry_date || undefined,
      cardholderName: pm.cardholder_name || undefined,
      isDefault: pm.is_default,
      brand: pm.brand as 'visa' | 'mastercard' | 'amex' | 'discover' | undefined
    }));
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
}

export async function addPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id'>) {
  try {
    // If this is set as default, update all other payment methods to non-default
    if (paymentMethod.isDefault) {
      const { error: updateError } = await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', paymentMethod.userId);
        
      if (updateError) {
        console.error('Error updating existing payment methods:', updateError);
      }
    }
    
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: paymentMethod.userId,
        type: paymentMethod.type,
        last_four: paymentMethod.lastFour,
        expiry_date: paymentMethod.expiryDate || null,
        cardholder_name: paymentMethod.cardholderName || null,
        is_default: paymentMethod.isDefault,
        brand: paymentMethod.brand || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) {
      toast.error('Failed to add payment method');
      return null;
    }
    
    toast.success('Payment method added successfully');
    
    return {
      id: data.id,
      userId: data.user_id,
      type: data.type as 'credit_card' | 'debit_card' | 'paypal',
      lastFour: data.last_four,
      expiryDate: data.expiry_date || undefined,
      cardholderName: data.cardholder_name || undefined,
      isDefault: data.is_default,
      brand: data.brand as 'visa' | 'mastercard' | 'amex' | 'discover' | undefined
    };
  } catch (error) {
    console.error('Error adding payment method:', error);
    toast.error('Failed to add payment method');
    return null;
  }
}

export async function updatePaymentMethod(paymentMethod: PaymentMethod) {
  try {
    // If this payment method is being set as default, update others
    if (paymentMethod.isDefault) {
      const { error: updateError } = await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', paymentMethod.userId)
        .neq('id', paymentMethod.id);
        
      if (updateError) {
        console.error('Error updating existing payment methods:', updateError);
      }
    }
    
    const { error } = await supabase
      .from('payment_methods')
      .update({
        type: paymentMethod.type,
        last_four: paymentMethod.lastFour,
        expiry_date: paymentMethod.expiryDate || null,
        cardholder_name: paymentMethod.cardholderName || null,
        is_default: paymentMethod.isDefault,
        brand: paymentMethod.brand || null
      })
      .eq('id', paymentMethod.id);
      
    if (error) {
      toast.error('Failed to update payment method');
      return null;
    }
    
    toast.success('Payment method updated successfully');
    return paymentMethod;
  } catch (error) {
    console.error('Error updating payment method:', error);
    toast.error('Failed to update payment method');
    return null;
  }
}

export async function deletePaymentMethod(id: string) {
  try {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id);
      
    if (error) {
      toast.error('Failed to remove payment method');
      return false;
    }
    
    toast.success('Payment method removed successfully');
    return true;
  } catch (error) {
    console.error('Error removing payment method:', error);
    toast.error('Failed to remove payment method');
    return false;
  }
}

// Helper functions to transform data between database and application formats
function transformRestaurantFromDB(dbRestaurant: any): Restaurant {
  return {
    id: dbRestaurant.id,
    name: dbRestaurant.name,
    description: dbRestaurant.description,
    image: dbRestaurant.image,
    categories: dbRestaurant.categories || [],
    rating: dbRestaurant.rating || 0,
    address: dbRestaurant.address,
    coordinates: {
      latitude: dbRestaurant.latitude,
      longitude: dbRestaurant.longitude
    },
    latitude: dbRestaurant.latitude,
    longitude: dbRestaurant.longitude,
    distance: dbRestaurant.distance,
    isOpen: dbRestaurant.is_open,
    isNew: dbRestaurant.is_new,
    phone: dbRestaurant.phone,
    email: dbRestaurant.email,
    logo: dbRestaurant.logo,
    coverImage: dbRestaurant.cover_image,
    openingHours: {
      monday: { isOpen: true, open: '09:00', close: '22:00' },
      tuesday: { isOpen: true, open: '09:00', close: '22:00' },
      wednesday: { isOpen: true, open: '09:00', close: '22:00' },
      thursday: { isOpen: true, open: '09:00', close: '22:00' },
      friday: { isOpen: true, open: '09:00', close: '23:00' },
      saturday: { isOpen: true, open: '10:00', close: '23:00' },
      sunday: { isOpen: true, open: '10:00', close: '22:00' }
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: ''
    },
    isActive: dbRestaurant.is_active,
    acceptsOnlineOrders: dbRestaurant.accepts_online_orders
  };
}

function transformRestaurantWithRelations(dbRestaurant: any): Restaurant {
  const restaurant = transformRestaurantFromDB(dbRestaurant);
  
  // Process opening hours
  if (dbRestaurant.restaurant_opening_hours) {
    const openingHours: any = {};
    
    for (const hour of dbRestaurant.restaurant_opening_hours) {
      openingHours[hour.day] = {
        isOpen: hour.is_open,
        open: hour.open_time,
        close: hour.close_time
      };
    }
    
    // Ensure all days are present
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    for (const day of days) {
      if (!openingHours[day]) {
        openingHours[day] = { isOpen: false, open: '09:00', close: '17:00' };
      }
    }
    
    restaurant.openingHours = openingHours;
  }
  
  // Process social media
  if (dbRestaurant.restaurant_social_media) {
    const socialMedia: any = {};
    
    for (const social of dbRestaurant.restaurant_social_media) {
      socialMedia[social.platform] = social.url;
    }
    
    restaurant.socialMedia = {
      facebook: socialMedia.facebook || '',
      instagram: socialMedia.instagram || '',
      twitter: socialMedia.twitter || '',
      ...socialMedia
    };
  }
  
  return restaurant;
}

function transformOrderFromDB(dbOrder: any): Order {
  // Process order items
  const items: CartItem[] = [];
  
  if (dbOrder.order_items) {
    for (const item of dbOrder.order_items) {
      if (item.menu_items) {
        items.push({
          menuItem: {
            id: item.menu_items.id,
            name: item.menu_items.name,
            description: item.menu_items.description,
            price: item.menu_items.price,
            image: item.menu_items.image,
            categoryId: item.menu_items.category_id,
            restaurantId: item.menu_items.restaurant_id
          },
          quantity: item.quantity
        });
      }
    }
  }
  
  return {
    id: dbOrder.id,
    userId: dbOrder.user_id,
    restaurantId: dbOrder.restaurant_id,
    restaurantName: dbOrder.restaurant_name,
    items: items,
    status: dbOrder.status as OrderStatus,
    timestamp: new Date(dbOrder.timestamp),
    total: dbOrder.total,
    paymentMethod: dbOrder.payment_method as 'credit_card' | 'cash' | 'saved_card',
    paymentStatus: dbOrder.payment_status as 'paid' | 'pending' | 'failed',
    paymentMethodId: dbOrder.payment_method_id
  };
}
