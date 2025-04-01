
import { useState } from 'react';
import { MenuItem, CartItem } from '@/types';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (menuItem: MenuItem): void => {
    if (cart.length > 0) {
      const firstItem = cart[0];
      const firstItemDetails = menuItem;
      
      if (firstItem.menuItem.restaurantId !== menuItem.restaurantId) {
        if (window.confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
          setCart([{ menuItem, quantity: 1 }]);
        }
        return;
      }
    }
    
    const existingItemIndex = cart.findIndex(item => item.menuItem.id === menuItem.id);
    
    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { menuItem, quantity: 1 }]);
    }
  };

  const updateCartItemQuantity = (menuItemId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    
    const updatedCart = cart.map(item => 
      item.menuItem.id === menuItemId ? { ...item, quantity } : item
    );
    
    setCart(updatedCart);
  };

  const removeFromCart = (menuItemId: string): void => {
    const updatedCart = cart.filter(item => item.menuItem.id !== menuItemId);
    setCart(updatedCart);
  };

  const clearCart = (): void => {
    setCart([]);
  };

  return {
    cart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart
  };
}
