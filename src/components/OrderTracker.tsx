
import React from 'react';
import { Clock } from 'lucide-react';
import { useAppContext, Order } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const OrderTracker: React.FC = () => {
  const { orders } = useAppContext();
  
  // Get the most recent active order (not completed)
  const activeOrder = orders
    .filter(order => order.status !== 'completed')
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    
  if (!activeOrder) {
    return null;
  }
  
  const getProgress = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 25;
      case 'preparing': return 50;
      case 'ready': return 100;
      case 'completed': return 100;
      default: return 0;
    }
  };
  
  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Order received';
      case 'preparing': return 'Preparing your food';
      case 'ready': return 'Ready for pickup!';
      case 'completed': return 'Completed';
      default: return '';
    }
  };

  return (
    <Card className="border-2 border-brand-orange">
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
          <Progress value={getProgress(activeOrder.status)} className="h-2" />
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
