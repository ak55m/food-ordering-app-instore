import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';
import RestaurantSidebar from '@/components/RestaurantSidebar';

const RestaurantAnalytics: React.FC = () => {
  const { orders } = useAppContext();
  const [restaurantId, setRestaurantId] = useState('1'); // Default to first restaurant
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  
  // Filter restaurant orders
  const restaurantOrders = orders.filter(order => order.restaurantId === restaurantId);
  
  // Analytics data calculations
  const totalRevenue = restaurantOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = restaurantOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Get unique customers (in a real app this would be based on customerIds)
  const uniqueCustomers = new Set(restaurantOrders.map(order => order.id.split('-')[1])).size;
  
  // Generate sales data
  const generateSalesData = () => {
    const now = new Date();
    const data = [];
    
    if (timeRange === 'day') {
      // Hourly data for today
      for (let i = 0; i < 24; i++) {
        const hour = i < 10 ? `0${i}:00` : `${i}:00`;
        const filteredOrders = restaurantOrders.filter(order => {
          const orderHour = order.timestamp.getHours();
          const orderDate = order.timestamp.getDate();
          const today = now.getDate();
          return orderHour === i && orderDate === today;
        });
        
        const revenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
        data.push({ name: hour, revenue });
      }
    } else if (timeRange === 'week') {
      // Daily data for the week
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        
        const filteredOrders = restaurantOrders.filter(order => {
          const orderDate = order.timestamp.getDate();
          const orderMonth = order.timestamp.getMonth();
          const orderYear = order.timestamp.getFullYear();
          
          return (
            orderDate === d.getDate() &&
            orderMonth === d.getMonth() &&
            orderYear === d.getFullYear()
          );
        });
        
        const revenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
        data.push({ 
          name: dayNames[d.getDay()], 
          revenue,
          orders: filteredOrders.length
        });
      }
    } else {
      // Daily data for the month
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const filteredOrders = restaurantOrders.filter(order => {
          const orderDate = order.timestamp.getDate();
          const orderMonth = order.timestamp.getMonth();
          const orderYear = order.timestamp.getFullYear();
          
          return (
            orderDate === i &&
            orderMonth === now.getMonth() &&
            orderYear === now.getFullYear()
          );
        });
        
        const revenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
        data.push({ name: `${i}`, revenue });
      }
    }
    
    return data;
  };
  
  // Generate popular items data
  const generatePopularItemsData = () => {
    const itemCounts: {[key: string]: {count: number, revenue: number, name: string}} = {};
    
    restaurantOrders.forEach(order => {
      order.items.forEach(item => {
        const itemId = item.menuItem.id;
        if (!itemCounts[itemId]) {
          itemCounts[itemId] = {
            count: 0,
            revenue: 0,
            name: item.menuItem.name
          };
        }
        itemCounts[itemId].count += item.quantity;
        itemCounts[itemId].revenue += item.quantity * item.menuItem.price;
      });
    });
    
    return Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(item => ({
        name: item.name,
        value: item.count,
        revenue: item.revenue
      }));
  };
  
  const salesData = generateSalesData();
  const popularItems = generatePopularItemsData();
  
  // Colors for charts
  const COLORS = ['#00c2e8', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden md:block md:w-64">
        <RestaurantSidebar activePage="analytics" />
      </div>
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Analytics & Insights</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">+10% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">+2% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uniqueCustomers}</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Revenue Overview</CardTitle>
                  <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as 'day' | 'week' | 'month')}>
                    <TabsList>
                      <TabsTrigger 
                        value="day"
                        className={timeRange === 'day' ? 'bg-brand-cyan text-white' : ''}
                      >
                        Day
                      </TabsTrigger>
                      <TabsTrigger 
                        value="week"
                        className={timeRange === 'week' ? 'bg-brand-cyan text-white' : ''}
                      >
                        Week
                      </TabsTrigger>
                      <TabsTrigger 
                        value="month"
                        className={timeRange === 'month' ? 'bg-brand-cyan text-white' : ''}
                      >
                        Month
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#00c2e8" 
                        activeDot={{ r: 8 }} 
                      />
                      {timeRange === 'week' && (
                        <Line 
                          type="monotone" 
                          dataKey="orders" 
                          stroke="#82ca9d" 
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Popular Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={popularItems}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {popularItems.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Top Sellers</h4>
                  <ul className="space-y-2">
                    {popularItems.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <span 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                          />
                          {item.name}
                        </span>
                        <span>${item.revenue.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Orders by Hour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#00c2e8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RestaurantAnalytics;
