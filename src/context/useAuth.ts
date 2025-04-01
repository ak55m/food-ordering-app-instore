
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { signIn, signOut, getCurrentUser } from '@/services';
import { toast } from 'sonner';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Use the real Supabase authentication
      const loggedInUser = await signIn(email, password);
      
      if (loggedInUser) {
        setUser(loggedInUser);
        setIsAuthenticated(true);
        
        if (loggedInUser.role === 'restaurant_owner' && loggedInUser.restaurantId) {
          // Load restaurant data if the user is a restaurant owner
          // This would be done in a real implementation
        }
        
        toast.success('Login successful!');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async (): Promise<void> => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('rememberUser');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const initUser = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Check if there's an active session
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error initializing user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    setUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    initUser
  };
}
