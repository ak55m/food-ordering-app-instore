
import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateCartItemQuantity, removeFromCart, placeOrder, selectedRestaurant, isAuthenticated } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const total = cart.reduce((sum, item) => 
    sum + item.menuItem.price * item.quantity, 0
  );
  
  const deliveryFee = total > 20 ? 0 : 2.99;
  const serviceFee = total * 0.05;
  const grandTotal = total + deliveryFee + serviceFee;
  
  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to place an order");
      navigate('/login');
      return;
    }
    
    if (!selectedRestaurant) return;
    
    setIsProcessing(true);
    try {
      // Always use credit card payment now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await placeOrder(selectedRestaurant.id, 'credit_card');
      toast.success('Order placed successfully! Payment processed.');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (cart.length === 0) {
    return (
      <Card className="shadow-soft border-0">
        <CardHeader className="border-b">
          <CardTitle className="text-lg flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-brand-cyan" />
            Your Order
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-gray-100 text-gray-400">
              <ShoppingCart className="h-8 w-8" />
            </div>
            <p className="text-gray-500 font-medium">Your cart is empty</p>
            <Button
              className="mt-2 bg-brand-cyan hover:bg-brand-cyan-dark text-white"
              onClick={() => navigate('/')}
            >
              Browse Restaurants
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft border-0">
      <CardHeader className="border-b">
        <CardTitle className="text-lg flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2 text-brand-cyan" />
          Your Order
          {selectedRestaurant && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              from {selectedRestaurant.name}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <AnimatePresence>
          <ul className="divide-y">
            {cart.map(item => (
              <motion.li 
                key={item.menuItem.id} 
                className="p-4 flex justify-between"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{item.menuItem.name}</span>
                  <span className="text-sm text-gray-500">
                    ${item.menuItem.price.toFixed(2)} each
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-7 w-7 rounded-full"
                    onClick={() => updateCartItemQuantity(item.menuItem.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <span className="text-sm w-5 text-center font-medium">{item.quantity}</span>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-7 w-7 rounded-full"
                    onClick={() => updateCartItemQuantity(item.menuItem.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-gray-500 hover:text-destructive rounded-full"
                    onClick={() => removeFromCart(item.menuItem.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.li>
            ))}
          </ul>
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex-col p-4 border-t bg-gray-50/50">
        <div className="w-full space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Delivery Fee</span>
            <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Service Fee</span>
            <span>${serviceFee.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between font-medium">
            <span>Total</span>
            <span className="text-brand-cyan">${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {isAuthenticated ? (
          <>
            <div className="w-full mb-4">
              <p className="font-medium mb-2">Payment Method</p>
              <div className="flex items-center space-x-2 border rounded-md p-3 bg-white">
                <CreditCard className="h-4 w-4 mr-2 text-brand-cyan" />
                <span className="text-gray-700">Pay with Card</span>
              </div>
            </div>

            <Button 
              className="w-full bg-brand-cyan hover:bg-brand-cyan-dark text-white font-medium" 
              onClick={handlePlaceOrder}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Place Order • $${grandTotal.toFixed(2)}`}
            </Button>
          </>
        ) : (
          <Button 
            className="w-full bg-brand-cyan hover:bg-brand-cyan-dark text-white font-medium flex items-center justify-center" 
            onClick={() => navigate('/login')}
          >
            <LogIn className="h-4 w-4 mr-2" />
            Login to Place Order
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Cart;
