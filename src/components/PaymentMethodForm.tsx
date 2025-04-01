
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { PaymentMethod } from '@/types';
import { addPaymentMethod } from '@/services/databaseService';

const formSchema = z.object({
  cardholderName: z.string().min(3, { message: 'Cardholder name must be at least 3 characters' }),
  cardNumber: z.string()
    .min(15, { message: 'Card number must be at least 15 digits' })
    .max(16, { message: 'Card number must be at most 16 digits' })
    .regex(/^\d+$/, { message: 'Card number must contain only digits' }),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, { message: 'Expiry date must be in MM/YY format' }),
  cvv: z.string()
    .min(3, { message: 'CVV must be at least 3 digits' })
    .max(4, { message: 'CVV must be at most 4 digits' })
    .regex(/^\d+$/, { message: 'CVV must contain only digits' }),
  type: z.enum(['credit_card', 'debit_card']),
  isDefault: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface PaymentMethodFormProps {
  userId: string;
  onSuccess?: (paymentMethod: PaymentMethod) => void;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ userId, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      type: 'credit_card',
      isDefault: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // In a real app, you would send this to a payment processor API
      // For our demo, we'll just save the last 4 digits and discard the rest
      const last4 = values.cardNumber.slice(-4);
      
      // Determine card brand based on first digit
      let brand: 'visa' | 'mastercard' | 'amex' | 'discover' = 'visa';
      const firstDigit = values.cardNumber.charAt(0);
      if (firstDigit === '4') brand = 'visa';
      else if (firstDigit === '5') brand = 'mastercard';
      else if (firstDigit === '3') brand = 'amex';
      else if (firstDigit === '6') brand = 'discover';
      
      const newPaymentMethod = {
        userId,
        type: values.type,
        lastFour: last4,
        expiryDate: values.expiryDate,
        cardholderName: values.cardholderName,
        isDefault: values.isDefault,
        brand,
      };
      
      const result = await addPaymentMethod(newPaymentMethod);
      
      if (result) {
        toast.success('Payment method added successfully');
        form.reset();
        if (onSuccess) onSuccess(result);
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error('Failed to add payment method');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="cardholderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cardholder Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="•••• •••• •••• ••••" 
                  {...field} 
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/\D/g, '');
                    field.onChange(value);
                  }}
                  maxLength={16}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="MM/YY" 
                    {...field}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length > 2) {
                        value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
                      }
                      field.onChange(value);
                    }}
                    maxLength={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>CVV</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="•••" 
                    type="password"
                    {...field}
                    onChange={(e) => {
                      // Only allow numbers
                      const value = e.target.value.replace(/\D/g, '');
                      field.onChange(value);
                    }}
                    maxLength={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select card type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Set as default payment method
                </FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Payment Method'}
        </Button>
      </form>
    </Form>
  );
};

export default PaymentMethodForm;
