
import React from 'react';
import Cart from '@/components/Cart';
import BottomNavigation from '@/components/BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

const CartPage: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-white pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10 safe-top">
        <div className={`mx-auto ${isMobile ? 'px-4 max-w-[430px]' : 'container px-4'} py-4`}>
          <h1 className="text-xl font-bold text-brand-light">Your Cart</h1>
        </div>
      </header>
      
      <main className={`mx-auto ${isMobile ? 'px-4 max-w-[430px]' : 'container px-4'} py-6`}>
        <Cart />
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default CartPage;
