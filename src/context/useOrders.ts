
import { useState } from 'react';
import { Order, OrderStatus, User } from '@/types';

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newOrder: Order = {
        id: `order-${Date.now()}`,
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
      
      setOrders([newOrder, ...orders]);
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus): void => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    
    setOrders(updatedOrders);
  };

  return {
    orders,
    setOrders,
    isLoading,
    placeOrder,
    updateOrderStatus
  };
}
