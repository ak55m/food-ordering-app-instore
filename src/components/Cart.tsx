
import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateCartItemQuantity, removeFromCart, placeOrder, selectedRestaurant, isAuthenticated } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const total = cart.reduce((sum, item) => 
    sum + item.menuItem.price * item.quantity, 0
  );
  
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Your Order
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">Your cart is empty</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Your Order
          {selectedRestaurant && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              from {selectedRestaurant.name}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {cart.map(item => (
            <li key={item.menuItem.id} className="p-4 flex justify-between">
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
                  className="h-7 w-7"
                  onClick={() => updateCartItemQuantity(item.menuItem.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                
                <span className="text-sm w-5 text-center">{item.quantity}</span>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => updateCartItemQuantity(item.menuItem.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-gray-500 hover:text-destructive"
                  onClick={() => removeFromCart(item.menuItem.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex-col p-4 border-t">
        <div className="w-full flex justify-between mb-4">
          <span className="font-medium">Total</span>
          <span className="font-semibold">${total.toFixed(2)}</span>
        </div>

        {isAuthenticated ? (
          <>
            <div className="w-full mb-4">
              <p className="font-medium mb-2">Payment Method</p>
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-700">Pay with Card</span>
              </div>
            </div>

            <Button 
              className="w-full bg-green-300 hover:bg-green-400 text-gray-800 font-medium" 
              onClick={handlePlaceOrder}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Place Order • $${total.toFixed(2)}`}
            </Button>
          </>
        ) : (
          <Button 
            className="w-full bg-green-300 hover:bg-green-400 text-gray-800 font-medium flex items-center justify-center" 
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
