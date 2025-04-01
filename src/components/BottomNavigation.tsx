
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User, ShoppingCart, LogIn } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { motion } from 'framer-motion';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, cart, isAuthenticated } = useAppContext();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/login') {
      // Check if the current path is any login-related path
      return location.pathname === '/login' || 
             location.pathname === '/customer/login' || 
             location.pathname === '/restaurant/login';
    }
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
        <NavButton 
          icon={<Home className="h-6 w-6" />} 
          label="Explore"
          active={isActive('/home') || isActive('/')}
          onClick={() => handleNavigation('/home')}
        />
        
        {isAuthenticated ? (
          <>
            <NavButton 
              icon={<ShoppingBag className="h-6 w-6" />}
              label="Orders"
              active={isActive('/orders')}
              onClick={() => handleNavigation('/orders')}
            />
            <NavButton 
              icon={<ShoppingCart className="h-6 w-6" />}
              label="Cart"
              active={isActive('/cart')}
              onClick={() => handleNavigation('/cart')}
              badge={cartItemCount > 0 ? cartItemCount : undefined}
            />
            <NavButton 
              icon={<User className="h-6 w-6" />}
              label="Profile"
              active={isActive('/profile')}
              onClick={() => handleNavigation('/profile')}
            />
          </>
        ) : (
          <>
            <NavButton 
              icon={<ShoppingCart className="h-6 w-6" />}
              label="Cart"
              active={isActive('/cart')}
              onClick={() => handleNavigation('/cart')}
              badge={cartItemCount > 0 ? cartItemCount : undefined}
            />
            <NavButton 
              icon={<LogIn className="h-6 w-6" />}
              label="Login"
              active={isActive('/login')}
              onClick={() => handleNavigation('/customer/login')}
            />
          </>
        )}
      </div>
    </div>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, active, onClick, badge }) => {
  return (
    <button 
      onClick={onClick} 
      className="flex flex-col items-center relative w-16"
    >
      <div className="relative">
        {active ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -inset-1 rounded-full bg-brand-cyan/10"
          />
        ) : null}
        <div className={`${active ? 'text-brand-cyan' : 'text-gray-500'} font-arial relative`}>
          {icon}
          {badge !== undefined && (
            <span className="absolute -top-1 -right-1 bg-brand-cyan text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {badge}
            </span>
          )}
        </div>
      </div>
      <span className={`text-xs mt-1 ${active ? 'text-brand-cyan font-medium' : 'text-gray-500'} font-arial`}>{label}</span>
    </button>
  );
};

export default BottomNavigation;
