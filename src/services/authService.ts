
import { supabase } from '@/lib/supabase';
import { User } from '@/types';
import { toast } from 'sonner';

export async function signUp(email: string, password: string, userData: Partial<User>) {
  try {
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          email: email,
          name: userData.name || '',
          role: userData.role || 'customer',
          restaurant_id: userData.restaurantId || null,
        }
      }
    });

    if (authError) {
      console.error('Auth error during signup:', authError);
      toast.error(authError.message);
      return null;
    }

    if (!authData?.user) {
      toast.error('Failed to create account');
      return null;
    }
    
    // In a real application, we would create a profile in a users table
    // This would happen in a database trigger or a serverless function
    // For this demo, we'll simulate success
    
    toast.success('Account created! Check your email to confirm your account.');
    
    return {
      id: authData.user.id,
      email: email,
      name: userData.name || '',
      role: userData.role || 'customer',
      restaurantId: userData.restaurantId || null,
    };
  } catch (error) {
    console.error('Error signing up:', error);
    toast.error('Failed to create account');
    return null;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login error:', error);
      
      if (error.message.includes('Email not confirmed')) {
        toast.error('Please confirm your email before logging in. Check your inbox.');
      } else {
        toast.error(error.message || 'Invalid email or password');
      }
      
      return null;
    }

    if (data?.user) {
      // Get user metadata from the auth user object
      const userData = data.user.user_metadata;
      
      const user = {
        id: data.user.id,
        email: data.user.email || '',
        name: userData.name || '',
        role: userData.role || 'customer',
        restaurantId: userData.restaurant_id || null,
      };

      // If remember me is set, store the session info
      const rememberUser = localStorage.getItem('rememberUser');
      if (rememberUser === 'true') {
        localStorage.setItem('sessionActive', 'true');
      }

      return user;
    }

    return null;
  } catch (error) {
    console.error('Error signing in:', error);
    toast.error('Failed to sign in');
    return null;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return false;
    }
    localStorage.removeItem('sessionActive');
    // Removed the success toast
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    toast.error('Failed to sign out');
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return null;
    }

    // Get user metadata from the auth user object
    const userData = data.user.user_metadata;
    
    return {
      id: data.user.id,
      email: data.user.email || '',
      name: userData.name || '',
      role: userData.role || 'customer',
      restaurantId: userData.restaurant_id || null,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      toast.error(error.message);
      return false;
    }
    
    toast.success('Password reset link sent to your email');
    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    toast.error('Failed to send reset password link');
    return false;
  }
}
