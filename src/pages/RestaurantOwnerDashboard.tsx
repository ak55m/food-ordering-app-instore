
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext, Order } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, CheckCircle, BarChart3 } from 'lucide-react';
import RestaurantSidebar from '@/components/RestaurantSidebar';

const RestaurantOwnerDashboard: React.FC = () => {
  const { orders, updateOrderStatus } = useAppContext();
  const navigate = useNavigate();
  const [restaurantId, setRestaurantId] = useState('1'); // Default to first restaurant
  
  // Filter orders by restaurant and status
  const restaurantOrders = orders.filter(order => order.restaurantId === restaurantId);
  const pendingOrders = restaurantOrders.filter(order => order.status === 'pending');
  const preparingOrders = restaurantOrders.filter(order => order.status === 'preparing');
  const readyOrders = restaurantOrders.filter(order => order.status === 'ready');
  const completedOrders = restaurantOrders.filter(order => order.status === 'completed');
  
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
  };
  
  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex justify-between items-center">
          <span>Order #{order.id.split('-')[1].slice(-4)}</span>
          <Badge variant={order.status === 'pending' ? 'default' : 'outline'}>
            {new Intl.DateTimeFormat('en-US', {
              hour: 'numeric',
              minute: 'numeric'
            }).format(order.timestamp)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 mb-3">
          {order.items.map(item => (
            <li key={item.menuItem.id} className="text-sm flex justify-between">
              <span>{item.quantity} × {item.menuItem.name}</span>
              <span>${(item.quantity * item.menuItem.price).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between pt-2 border-t text-sm font-medium">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
        
        {order.status === 'pending' && (
          <Button 
            className="w-full mt-3 bg-brand-cyan hover:bg-cyan-600"
            onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
          >
            <ChefHat className="h-4 w-4 mr-2" /> Start Preparing
          </Button>
        )}
        
        {order.status === 'preparing' && (
          <Button 
            className="w-full mt-3"
            variant="outline"
            onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
          >
            <CheckCircle className="h-4 w-4 mr-2" /> Mark as Ready
          </Button>
        )}
        
        {order.status === 'ready' && (
          <Button 
            className="w-full mt-3"
            variant="outline"
            onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
          >
            Complete Order
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <RestaurantSidebar activePage="dashboard" />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Orders Dashboard</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/restaurant/analytics')}>
                <BarChart3 className="h-4 w-4 mr-2" /> View Analytics
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Pending Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pendingOrders.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Preparing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{preparingOrders.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Ready for Pickup</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{readyOrders.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Today's Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {completedOrders.filter(order => {
                    const today = new Date();
                    return order.timestamp.getDate() === today.getDate() &&
                           order.timestamp.getMonth() === today.getMonth() &&
                           order.timestamp.getFullYear() === today.getFullYear();
                  }).length}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="pending" className="relative">
                Pending
                {pendingOrders.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-brand-cyan">{pendingOrders.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="preparing" className="relative">
                Preparing
                {preparingOrders.length > 0 && (
                  <Badge className="absolute -top-2 -right-2">{preparingOrders.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="ready" className="relative">
                Ready
                {readyOrders.length > 0 && (
                  <Badge className="absolute -top-2 -right-2">{readyOrders.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed" className="relative">
                Completed
                {completedOrders.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-gray-500">{completedOrders.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {pendingOrders.length > 0 ? (
                pendingOrders.map(order => <OrderCard key={order.id} order={order} />)
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Clock className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No pending orders</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="preparing">
              {preparingOrders.length > 0 ? (
                preparingOrders.map(order => <OrderCard key={order.id} order={order} />)
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <ChefHat className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No orders currently being prepared</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="ready">
              {readyOrders.length > 0 ? (
                readyOrders.map(order => <OrderCard key={order.id} order={order} />)
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No orders ready for pickup</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {completedOrders.length > 0 ? (
                completedOrders.map(order => <OrderCard key={order.id} order={order} />)
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No completed orders</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default RestaurantOwnerDashboard;
