
import { supabase } from '@/lib/supabase';
import { User } from '@/types';
import { toast } from 'sonner';

export async function signUp(email: string, password: string, userData: Partial<User>) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      }
    });

    if (error) {
      toast.error(error.message);
      return null;
    }

    if (data?.user) {
      // Create user profile in the users table
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        email: email,
        name: userData.name || '',
        role: userData.role || 'customer',
        restaurant_id: userData.restaurantId || null,
        created_at: new Date().toISOString(),
      });

      if (profileError) {
        toast.error('Error creating user profile');
        return null;
      }

      toast.success('Account created successfully!');
      return data.user;
    }
    
    return null;
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
      toast.error(error.message);
      return null;
    }

    if (data?.user) {
      // Get user profile data
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        toast.error('Error fetching user profile');
        return null;
      }

      const user = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        restaurantId: profile.restaurant_id,
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
    toast.success('Signed out successfully');
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

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      return null;
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      restaurantId: profile.restaurant_id,
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
