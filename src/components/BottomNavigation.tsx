
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User, LogOut } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAppContext();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (!user || user.role !== 'customer') {
    return null; // Don't show bottom navigation for non-customers or unauthenticated users
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white z-10 safe-bottom">
      <div className="flex justify-around items-center p-3">
        <button 
          onClick={() => handleNavigation('/')} 
          className={`flex flex-col items-center ${isActive('/') ? 'text-cyan-500' : 'text-gray-500'}`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Explore</span>
        </button>
        <button 
          onClick={() => handleNavigation('/orders')} 
          className={`flex flex-col items-center ${isActive('/orders') ? 'text-cyan-500' : 'text-gray-500'}`}
        >
          <ShoppingBag className="h-6 w-6" />
          <span className="text-xs mt-1">Orders</span>
        </button>
        <button 
          onClick={() => handleNavigation('/profile')} 
          className={`flex flex-col items-center ${isActive('/profile') ? 'text-cyan-500' : 'text-gray-500'}`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
