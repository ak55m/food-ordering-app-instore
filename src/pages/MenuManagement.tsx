
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { useAppContext, Category } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';

const MenuManagement: React.FC = () => {
  const { categories, menuItems, getRestaurantCategories, getCategoryMenuItems } = useAppContext();
  const navigate = useNavigate();
  const [restaurantId, setRestaurantId] = useState('1'); // Default to first restaurant
  
  const restaurantCategories = getRestaurantCategories(restaurantId);

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
              className="w-full text-left px-3 py-2 mb-1 rounded-md hover:bg-gray-100 text-gray-700"
              onClick={() => navigate('/restaurant-dashboard')}
            >
              Orders
            </button>
            <button 
              className="w-full text-left px-3 py-2 mb-1 rounded-md hover:bg-gray-100 text-gray-700 font-medium"
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Menu Management</h1>
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" /> Add Category
              </Button>
            </div>
            
            <Tabs defaultValue={restaurantCategories[0]?.id} className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList className="flex-1">
                  {restaurantCategories.map(category => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="flex-1"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {restaurantCategories.map(category => {
                const categoryItems = getCategoryMenuItems(category.id);
                return (
                  <TabsContent key={category.id} value={category.id}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">{category.name}</h2>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" /> Edit Category
                        </Button>
                        <Button size="sm" className="btn-primary">
                          <Plus className="h-4 w-4 mr-1" /> Add Item
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid gap-4">
                      {categoryItems.map(item => (
                        <Card key={item.id}>
                          <CardContent className="p-4 flex">
                            <div className="w-24 h-24 rounded-md overflow-hidden mr-4 flex-shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium">{item.name}</h3>
                                <span className="font-semibold">${item.price.toFixed(2)}</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                              <div className="flex gap-2 mt-3">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-3 w-3 mr-1" /> Edit
                                </Button>
                                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default MenuManagement;
