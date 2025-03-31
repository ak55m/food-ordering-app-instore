
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User, ShoppingCart, LogIn } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, cart, isAuthenticated } = useAppContext();

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

  // Don't show for restaurant owners
  if (user?.role === 'restaurant_owner') {
    return null;
  }

  const cartItemCount = cart.length;

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
        
        {isAuthenticated ? (
          <>
            <button 
              onClick={() => handleNavigation('/orders')} 
              className={`flex flex-col items-center ${isActive('/orders') ? 'text-cyan-500' : 'text-gray-500'}`}
            >
              <ShoppingBag className="h-6 w-6" />
              <span className="text-xs mt-1">Orders</span>
            </button>
            <button 
              onClick={() => handleNavigation('/cart')} 
              className={`flex flex-col items-center ${isActive('/cart') ? 'text-cyan-500' : 'text-gray-500'} relative`}
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
              <span className="text-xs mt-1">Cart</span>
            </button>
            <button 
              onClick={() => handleNavigation('/profile')} 
              className={`flex flex-col items-center ${isActive('/profile') ? 'text-cyan-500' : 'text-gray-500'}`}
            >
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">Profile</span>
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => handleNavigation('/restaurant/:id')} 
              className={`flex flex-col items-center ${location.pathname.includes('/restaurant/') ? 'text-cyan-500' : 'text-gray-500'}`}
            >
              <ShoppingBag className="h-6 w-6" />
              <span className="text-xs mt-1">Restaurants</span>
            </button>
            <button 
              onClick={() => handleNavigation('/login')} 
              className={`flex flex-col items-center ${isActive('/login') ? 'text-cyan-500' : 'text-gray-500'}`}
            >
              <LogIn className="h-6 w-6" />
              <span className="text-xs mt-1">Login</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BottomNavigation;
