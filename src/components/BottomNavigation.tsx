
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 px-4 shadow-lg z-20">
      <Link 
        to="/" 
        className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-brand-cyan' : 'text-gray-500'}`}
      >
        <Home className="h-6 w-6" />
        <span className="text-xs mt-1">Explore</span>
      </Link>
      
      <Link 
        to="/orders" 
        className={`flex flex-col items-center p-2 ${isActive('/orders') ? 'text-brand-cyan' : 'text-gray-500'}`}
      >
        <ShoppingBag className="h-6 w-6" />
        <span className="text-xs mt-1">Orders</span>
      </Link>
      
      <Link 
        to="/profile" 
        className={`flex flex-col items-center p-2 ${isActive('/profile') ? 'text-brand-cyan' : 'text-gray-500'}`}
      >
        <User className="h-6 w-6" />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </div>
  );
};

export default BottomNavigation;
