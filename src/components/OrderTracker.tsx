
import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { OrderStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/lib/supabase';

const OrderTracker: React.FC = () => {
  const { orders } = useAppContext();
  const isMobile = useIsMobile();
  const [activeOrder, setActiveOrder] = useState<any>(null);
  
  useEffect(() => {
    // Get the most recent active order (not completed)
    if (orders && orders.length > 0) {
      const currentActiveOrder = orders
        .filter(order => order.status !== 'completed' && order.status !== 'cancelled')
        .sort((a, b) => {
          // Ensure timestamps are Date objects before comparing
          const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
          const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
          return timeB - timeA;
        })[0];
        
      setActiveOrder(currentActiveOrder);
      
      // Set up real-time listener if we have an active order
      if (currentActiveOrder) {
        const orderId = currentActiveOrder.id;
        
        // Subscribe to changes on this order
        const subscription = supabase
          .channel(`order-${orderId}`)
          .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'orders',
            filter: `id=eq.${orderId}` 
          }, (payload) => {
            // Update the order status when changed in the database
            if (payload.new && payload.new.status) {
              setActiveOrder(prev => ({
                ...prev,
                status: payload.new.status
              }));
            }
          })
          .subscribe();
          
        // Cleanup subscription
        return () => {
          subscription.unsubscribe();
        };
      }
    }
  }, [orders]);
  
  if (!activeOrder) {
    return null;
  }
  
  const getProgress = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 25;
      case 'preparing': return 50;
      case 'ready': return 100;
      case 'completed': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };
  
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-400';
      case 'preparing': return 'bg-orange-400';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-gray-400';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-primary';
    }
  };
  
  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'Order received';
      case 'preparing': return 'Preparing your food';
      case 'ready': return 'Ready for pickup!';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return '';
    }
  };

  return (
    <Card className={`border-2 border-brand-orange ${isMobile ? 'mx-auto max-w-[360px]' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Clock className="h-5 w-5 mr-2 text-brand-orange" />
          Order Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-1 text-sm">
            <span>Order #{activeOrder.id.split('-')[1].slice(-4)}</span>
            <span className={`order-status-${activeOrder.status}`}>
              {getStatusText(activeOrder.status)}
            </span>
          </div>
          <Progress 
            value={getProgress(activeOrder.status)} 
            className="h-2" 
            indicatorClassName={getStatusColor(activeOrder.status)}
          />
        </div>
        
        <div className="text-sm">
          <p className="font-medium">{activeOrder.restaurantName}</p>
          <p className="text-gray-500">
            {activeOrder.items.reduce((total, item) => total + item.quantity, 0)} items · 
            ${activeOrder.total.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTracker;
