
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ChevronRight, LayoutDashboard, Menu, BarChart3, Settings, Store } from 'lucide-react';

interface RestaurantSidebarProps {
  activePage: 'dashboard' | 'menu' | 'analytics' | 'settings';
}

const RestaurantSidebar: React.FC<RestaurantSidebarProps> = ({ activePage }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      path: '/restaurant',
      active: activePage === 'dashboard'
    },
    {
      name: 'Menu Management',
      icon: <Menu className="h-4 w-4 mr-2" />,
      path: '/restaurant/menu',
      active: activePage === 'menu'
    },
    {
      name: 'Analytics',
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
      path: '/restaurant/analytics',
      active: activePage === 'analytics'
    },
    {
      name: 'Settings',
      icon: <Settings className="h-4 w-4 mr-2" />,
      path: '/restaurant/settings',
      active: activePage === 'settings'
    }
  ];

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-gray-200">
        <SidebarHeader className="px-4 py-6 border-b border-gray-200">
          <div className="flex items-center">
            <h2 className="text-lg font-bold text-brand-cyan">Restaurant Portal</h2>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="px-3 py-4">
          <h3 className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Management</h3>
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <button 
                key={index}
                className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex justify-between items-center ${
                  item.active ? 'bg-brand-light-blue text-brand-cyan font-medium' : 'text-gray-700'
                }`}
                onClick={() => navigate(item.path)}
              >
                <span className="flex items-center">
                  {item.icon}
                  {item.name}
                </span>
                {item.active && <ChevronRight className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </SidebarContent>
        
        <SidebarFooter className="p-4 border-t border-gray-200">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center"
            onClick={() => navigate('/')}
          >
            <Store className="h-4 w-4 mr-2" />
            Switch to Customer View
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
};

export default RestaurantSidebar;
