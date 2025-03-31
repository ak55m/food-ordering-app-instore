
import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Wallet } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Cart: React.FC = () => {
  const { cart, updateCartItemQuantity, removeFromCart, placeOrder, selectedRestaurant } = useAppContext();
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'cash'>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const total = cart.reduce((sum, item) => 
    sum + item.menuItem.price * item.quantity, 0
  );
  
  const handlePlaceOrder = async () => {
    if (!selectedRestaurant) return;
    
    setIsProcessing(true);
    try {
      // If credit card, we would integrate with a payment processor here
      // For now, we'll just simulate a delay and complete the order
      if (paymentMethod === 'credit_card') {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Place the order with the selected payment method
      await placeOrder(selectedRestaurant.id, paymentMethod);
      toast.success(`Order placed successfully! ${paymentMethod === 'credit_card' ? 'Payment processed.' : 'Please pay at pickup.'}`);
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

        <div className="w-full mb-4">
          <p className="font-medium mb-2">Payment Method</p>
          <RadioGroup 
            value={paymentMethod} 
            onValueChange={(value) => setPaymentMethod(value as 'credit_card' | 'cash')} 
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer">
              <RadioGroupItem value="credit_card" id="credit_card" />
              <Label htmlFor="credit_card" className="flex items-center cursor-pointer w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Pay with Card
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="flex items-center cursor-pointer w-full">
                <Wallet className="h-4 w-4 mr-2" />
                Cash at Pickup
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Button 
          className="w-full bg-brand-orange hover:bg-orange-600" 
          onClick={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : `Place Order • $${total.toFixed(2)}`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Cart;
