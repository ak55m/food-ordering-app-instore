
import { supabase } from '@/lib/supabase';
import { Order, CartItem, OrderStatus } from '@/types';
import { toast } from 'sonner';

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
