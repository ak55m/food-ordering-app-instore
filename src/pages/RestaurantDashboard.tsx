
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { useAppContext, Order } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, CheckCircle } from 'lucide-react';

const RestaurantDashboard: React.FC = () => {
  const { orders } = useAppContext();
  const navigate = useNavigate();
  const [restaurantId, setRestaurantId] = useState('1'); // Default to first restaurant
  
  // Filter orders by restaurant and status
  const restaurantOrders = orders.filter(order => order.restaurantId === restaurantId);
  const pendingOrders = restaurantOrders.filter(order => order.status === 'pending');
  const preparingOrders = restaurantOrders.filter(order => order.status === 'preparing');
  const readyOrders = restaurantOrders.filter(order => order.status === 'ready');
  const completedOrders = restaurantOrders.filter(order => order.status === 'completed');
  
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    // In a real app, this would update the status in the backend
    console.log(`Updating order ${orderId} to status ${newStatus}`);
    // For now, we're using the mock data and the simulated progression
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
            className="w-full mt-3 bg-brand-orange hover:bg-orange-600"
            onClick={() => updateOrderStatus(order.id, 'preparing')}
          >
            <ChefHat className="h-4 w-4 mr-2" /> Start Preparing
          </Button>
        )}
        
        {order.status === 'preparing' && (
          <Button 
            className="w-full mt-3"
            variant="outline"
            onClick={() => updateOrderStatus(order.id, 'ready')}
          >
            <CheckCircle className="h-4 w-4 mr-2" /> Mark as Ready
          </Button>
        )}
        
        {order.status === 'ready' && (
          <Button 
            className="w-full mt-3"
            variant="outline"
            onClick={() => updateOrderStatus(order.id, 'completed')}
          >
            Complete Order
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarProvider>
        <Sidebar defaultCollapsed={false} className="border-r border-gray-200">
          <SidebarHeader className="px-4 py-6 border-b border-gray-200">
            <h2 className="text-lg font-bold">Restaurant Dashboard</h2>
          </SidebarHeader>
          <SidebarContent className="px-3 py-4">
            <h3 className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Management</h3>
            <button 
              className="w-full text-left px-3 py-2 mb-1 rounded-md hover:bg-gray-100 text-gray-700 font-medium"
            >
              Orders
            </button>
            <button 
              className="w-full text-left px-3 py-2 mb-1 rounded-md hover:bg-gray-100 text-gray-700"
              onClick={() => navigate('/menu-management')}
            >
              Menu Management
            </button>
            <button 
              className="w-full text-left px-3 py-2 mb-1 rounded-md hover:bg-gray-100 text-gray-700"
            >
              Settings
            </button>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/')}
            >
              Switch to Customer View
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
            
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="pending" className="relative">
                  Pending
                  {pendingOrders.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-brand-orange">{pendingOrders.length}</Badge>
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
      </SidebarProvider>
    </div>
  );
};

export default RestaurantDashboard;
