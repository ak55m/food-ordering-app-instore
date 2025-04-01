
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useAppContext, OrderStatus } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import BottomNavigation from '@/components/BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

const OrdersPage: React.FC = () => {
  const { orders } = useAppContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'Order received';
      case 'preparing': return 'Preparing your food';
      case 'ready': return 'Ready for pickup!';
      case 'completed': return 'Completed';
      default: return '';
    }
  };
  
  const getProgress = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 25;
      case 'preparing': return 50;
      case 'ready': return 100;
      case 'completed': return 100;
      default: return 0;
    }
  };
  
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-400';
      case 'preparing': return 'bg-brand-light';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-gray-400';
      default: return 'bg-primary';
    }
  };

  // Ensure all orders have proper Date objects for timestamps
  const processedOrders = orders.map(order => ({
    ...order,
    timestamp: order.timestamp instanceof Date ? order.timestamp : new Date(order.timestamp)
  }));

  const sortedOrders = processedOrders && processedOrders.length ? [...processedOrders].sort((a, b) => {
    // Safely handle timestamp comparison
    const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
    const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
    return timeB - timeA;
  }) : [];

  return (
    <div className="min-h-screen bg-white pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10 safe-top">
        <div className={`${isMobile ? 'px-4 max-w-[430px]' : 'container px-4'} mx-auto py-4 flex items-center`}>
          <h1 className="text-xl font-semibold">Your Orders</h1>
        </div>
      </header>
      
      <main className={`mx-auto ${isMobile ? 'px-4 max-w-[430px]' : 'container px-4'} py-6`}>
        {sortedOrders.length > 0 ? (
          <div className="space-y-4">
            {sortedOrders.map(order => (
              <Card key={order.id} className={`${order.status === 'ready' ? 'border-green-500 border-2' : ''} ${isMobile ? 'mx-auto' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="font-medium">{order.restaurantName}</h3>
                      <p className="text-sm text-gray-500">
                        Order #{order.id.split('-')[1].slice(-4)} · 
                        {new Intl.DateTimeFormat('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          hour: 'numeric', 
                          minute: 'numeric' 
                        }).format(order.timestamp)}
                      </p>
                    </div>
                    <span className={`order-status-${order.status}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  
                  {order.status !== 'completed' && (
                    <div className="mb-4">
                      <Progress 
                        value={getProgress(order.status)} 
                        className="h-2" 
                        indicatorClassName={getStatusColor(order.status)}
                      />
                    </div>
                  )}
                  
                  <div className="border-t pt-3 mt-3">
                    <h4 className="font-medium text-sm mb-2">Order Items</h4>
                    <ul className="space-y-2">
                      {order.items.map(item => (
                        <li key={item.menuItem.id} className="text-sm flex justify-between">
                          <span>{item.quantity} × {item.menuItem.name}</span>
                          <span>${(item.quantity * item.menuItem.price).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between mt-3 pt-3 border-t font-medium">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-6">
              Your order history will appear here once you place an order
            </p>
            <Button onClick={() => navigate('/')} className="bg-brand-light text-brand-gray-800 hover:bg-brand-light/80">
              Browse Restaurants
            </Button>
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default OrdersPage;
