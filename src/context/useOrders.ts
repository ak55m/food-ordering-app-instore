
import { useState, useEffect } from 'react';
import { Order, OrderStatus, User } from '@/types';
import { getOrders, placeOrder as placeOrderService, updateOrderStatus as updateOrderStatusService } from '@/services';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const placeOrder = async (
    user: User | null,
    cart: any[],
    restaurantId: string,
    restaurantName: string | undefined,
    paymentMethod: 'credit_card' | 'cash'
  ): Promise<void> => {
    if (!user) {
      return;
    }
    
    if (cart.length === 0) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newOrder: Omit<Order, 'id'> = {
        userId: user.id,
        restaurantId,
        restaurantName,
        items: [...cart],
        status: 'pending',
        timestamp: new Date(),
        total: cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0),
        paymentMethod,
        paymentStatus: paymentMethod === 'credit_card' ? 'paid' : 'pending',
      };
      
      // Place order in the database
      const createdOrder = await placeOrderService(newOrder);
      
      if (createdOrder) {
        // Add the new order to the local state
        setOrders(prevOrders => [createdOrder, ...prevOrders]);
      }
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async (userId: string, role: string): Promise<void> => {
    setIsLoading(true);
    try {
      const userOrders = await getOrders(userId, role);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus): Promise<void> => {
    try {
      const success = await updateOrderStatusService(orderId, newStatus);
      
      if (success) {
        const updatedOrders = orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        
        setOrders(updatedOrders);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return {
    orders,
    setOrders,
    isLoading,
    placeOrder,
    updateOrderStatus,
    fetchOrders
  };
}
