
import { supabase } from '@/lib/supabase';
import { PaymentMethod } from '@/types';
import { toast } from 'sonner';

export async function getPaymentMethods(userId: string) {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      return [];
    }
    
    return data.map(pm => ({
      id: pm.id,
      userId: pm.user_id,
      type: pm.type as 'credit_card' | 'debit_card' | 'paypal',
      lastFour: pm.last_four,
      expiryDate: pm.expiry_date || undefined,
      cardholderName: pm.cardholder_name || undefined,
      isDefault: pm.is_default,
      brand: pm.brand as 'visa' | 'mastercard' | 'amex' | 'discover' | undefined
    }));
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
}

export async function addPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id'>) {
  try {
    // If this is set as default, update all other payment methods to non-default
    if (paymentMethod.isDefault) {
      const { error: updateError } = await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', paymentMethod.userId);
        
      if (updateError) {
        console.error('Error updating existing payment methods:', updateError);
      }
    }
    
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: paymentMethod.userId,
        type: paymentMethod.type,
        last_four: paymentMethod.lastFour,
        expiry_date: paymentMethod.expiryDate || null,
        cardholder_name: paymentMethod.cardholderName || null,
        is_default: paymentMethod.isDefault,
        brand: paymentMethod.brand || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) {
      toast.error('Failed to add payment method');
      return null;
    }
    
    toast.success('Payment method added successfully');
    
    return {
      id: data.id,
      userId: data.user_id,
      type: data.type as 'credit_card' | 'debit_card' | 'paypal',
      lastFour: data.last_four,
      expiryDate: data.expiry_date || undefined,
      cardholderName: data.cardholder_name || undefined,
      isDefault: data.is_default,
      brand: data.brand as 'visa' | 'mastercard' | 'amex' | 'discover' | undefined
    };
  } catch (error) {
    console.error('Error adding payment method:', error);
    toast.error('Failed to add payment method');
    return null;
  }
}

export async function updatePaymentMethod(paymentMethod: PaymentMethod) {
  try {
    // If this payment method is being set as default, update others
    if (paymentMethod.isDefault) {
      const { error: updateError } = await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', paymentMethod.userId)
        .neq('id', paymentMethod.id);
        
      if (updateError) {
        console.error('Error updating existing payment methods:', updateError);
      }
    }
    
    const { error } = await supabase
      .from('payment_methods')
      .update({
        type: paymentMethod.type,
        last_four: paymentMethod.lastFour,
        expiry_date: paymentMethod.expiryDate || null,
        cardholder_name: paymentMethod.cardholderName || null,
        is_default: paymentMethod.isDefault,
        brand: paymentMethod.brand || null
      })
      .eq('id', paymentMethod.id);
      
    if (error) {
      toast.error('Failed to update payment method');
      return null;
    }
    
    toast.success('Payment method updated successfully');
    return paymentMethod;
  } catch (error) {
    console.error('Error updating payment method:', error);
    toast.error('Failed to update payment method');
    return null;
  }
}

export async function deletePaymentMethod(id: string) {
  try {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id);
      
    if (error) {
      toast.error('Failed to remove payment method');
      return false;
    }
    
    toast.success('Payment method removed successfully');
    return true;
  } catch (error) {
    console.error('Error removing payment method:', error);
    toast.error('Failed to remove payment method');
    return false;
  }
}
