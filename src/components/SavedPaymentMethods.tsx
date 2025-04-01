
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PaymentMethod } from '@/types';
import { getPaymentMethods, deletePaymentMethod, updatePaymentMethod } from '@/services/databaseService';
import { CreditCard, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SavedPaymentMethodsProps {
  userId: string;
  onAddNew?: () => void;
  onSelect?: (paymentMethod: PaymentMethod) => void;
  selectable?: boolean;
}

const SavedPaymentMethods: React.FC<SavedPaymentMethodsProps> = ({
  userId,
  onAddNew,
  onSelect,
  selectable = false,
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      setIsLoading(true);
      try {
        const methods = await getPaymentMethods(userId);
        setPaymentMethods(methods);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [userId]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this payment method?')) {
      const success = await deletePaymentMethod(id);
      if (success) {
        setPaymentMethods(methods => methods.filter(method => method.id !== id));
      }
    }
  };

  const handleSetDefault = async (method: PaymentMethod) => {
    if (method.isDefault) return; // Already default
    
    const updatedMethod = { ...method, isDefault: true };
    const result = await updatePaymentMethod(updatedMethod);
    if (result) {
      // Update local state
      setPaymentMethods(methods =>
        methods.map(m => ({
          ...m,
          isDefault: m.id === method.id
        }))
      );
    }
  };

  const getBrandIcon = (brand?: string) => {
    // In a real app, you'd use proper card brand logos
    return <CreditCard className="h-6 w-6 text-blue-500" />;
  };

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading payment methods...</div>;
  }

  if (paymentMethods.length === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 mb-4">You don't have any saved payment methods</p>
          {onAddNew && (
            <Button onClick={onAddNew} variant="outline">
              Add Payment Method
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {paymentMethods.map(method => (
        <Card 
          key={method.id} 
          className={`${method.isDefault ? 'border-brand-cyan' : ''} ${selectable ? 'cursor-pointer' : ''}`}
          onClick={() => selectable && onSelect && onSelect(method)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getBrandIcon(method.brand)}
                <div>
                  <div className="font-medium">
                    {method.type === 'credit_card' ? 'Credit Card' : 'Debit Card'} 
                    {method.brand && ` • ${method.brand}`}
                  </div>
                  <div className="text-sm text-gray-500">
                    •••• •••• •••• {method.lastFour}
                    {method.expiryDate && ` • Expires ${method.expiryDate}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {method.isDefault && <Badge variant="outline">Default</Badge>}
                {!selectable && (
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(method.id)}>
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
          {!method.isDefault && !selectable && (
            <CardFooter className="px-4 pb-4 pt-0 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => handleSetDefault(method)}>
                Set as default
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
      
      {onAddNew && (
        <div className="mt-4">
          <Button onClick={onAddNew} variant="outline" className="w-full">
            Add New Payment Method
          </Button>
        </div>
      )}
    </div>
  );
};

export default SavedPaymentMethods;
