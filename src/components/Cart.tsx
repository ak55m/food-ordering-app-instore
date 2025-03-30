
import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Cart: React.FC = () => {
  const { cart, updateCartItemQuantity, removeFromCart, placeOrder, selectedRestaurant } = useAppContext();
  
  const total = cart.reduce((sum, item) => 
    sum + item.menuItem.price * item.quantity, 0
  );
  
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
        <Button className="w-full bg-brand-orange hover:bg-orange-600" onClick={placeOrder}>
          Place Order
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Cart;
