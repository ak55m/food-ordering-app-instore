
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAppContext } from "@/context/AppContext";
import { UserRole } from "@/types";
import { supabase } from "@/lib/supabase";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { user, setUser, isAuthenticated } = useAppContext();

  // Test user credentials
  const testCustomer = {
    email: "customer@example.com",
    password: "password123",
    role: "customer" as UserRole
  };

  const testRestaurantOwner = {
    email: "owner@example.com",
    password: "password123",
    role: "restaurant_owner" as UserRole
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'restaurant_owner') {
        navigate('/restaurant');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For demo purposes, we'll check against our predefined test users
      // In a real app, this would check against Supabase auth
      if (email === testCustomer.email && password === testCustomer.password) {
        // In a real app with Supabase, this would be:
        // const { data, error } = await supabase.auth.signInWithPassword({
        //   email,
        //   password
        // });
        
        const customerUser = {
          id: "cust-123",
          name: "Test Customer",
          email: testCustomer.email,
          role: testCustomer.role
        };
        
        setUser(customerUser);
        
        if (rememberMe) {
          // Save user info to localStorage for "remember me" functionality
          localStorage.setItem('user', JSON.stringify(customerUser));
        }
        
        toast.success("Login successful", {
          description: "Welcome back, Test Customer!"
        });
        
        navigate("/");
      } 
      // Check if credentials match test restaurant owner
      else if (email === testRestaurantOwner.email && password === testRestaurantOwner.password) {
        const ownerUser = {
          id: "owner-123",
          name: "Test Restaurant Owner",
          email: testRestaurantOwner.email,
          role: testRestaurantOwner.role,
          restaurantId: "rest1"
        };
        
        setUser(ownerUser);
        
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(ownerUser));
        }
        
        toast.success("Login successful", {
          description: "Welcome back, Test Restaurant Owner!"
        });
        
        navigate("/restaurant");
      } 
      else {
        // Login failed
        toast.error("Login failed", {
          description: "Please check your credentials and try again."
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed", {
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestCustomerLogin = () => {
    setEmail(testCustomer.email);
    setPassword(testCustomer.password);
  };

  const handleTestRestaurantLogin = () => {
    setEmail(testRestaurantOwner.email);
    setPassword(testRestaurantOwner.password);
  };

  // Check for remembered user on component mount
  React.useEffect(() => {
    const rememberedUser = localStorage.getItem('user');
    if (rememberedUser) {
      try {
        const parsedUser = JSON.parse(rememberedUser);
        setUser(parsedUser);
        
        // Navigate based on user role
        if (parsedUser.role === 'restaurant_owner') {
          navigate('/restaurant');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error("Error parsing remembered user:", error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ebf7fd p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-cyan-500">Welcome Back</CardTitle>
          <CardDescription>
            Login to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-cyan-500 hover:text-cyan-600">
                  Forgot password?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-cyan-500 hover:bg-cyan-600" 
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <p>Don't have an account? <a href="#" className="text-cyan-500 hover:text-cyan-600">Sign up</a></p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-center text-muted-foreground">Test accounts for demo:</p>
          <div className="flex space-x-2 w-full">
            <Button
              variant="outline" 
              className="flex-1 text-xs"
              onClick={handleTestCustomerLogin}
            >
              Customer Login
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 text-xs"
              onClick={handleTestRestaurantLogin}
            >
              Restaurant Login
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
