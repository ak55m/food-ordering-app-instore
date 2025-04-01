
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { signIn, signOut, getCurrentUser, signUp } from '@/services';
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
      } 
      // The error toast is now handled in the signIn function
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>): Promise<User | null> => {
    try {
      setIsLoading(true);
      
      const newUser = await signUp(email, password, userData);
      
      if (newUser) {
        // Don't set the user or authenticate here - they need to confirm email first
        return newUser;
      }
      
      return null;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      return null;
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
      // Removed the success toast
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
    register,
    initUser
  };
}
