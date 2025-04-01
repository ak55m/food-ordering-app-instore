
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppContext } from "@/context/AppContext";

const RestaurantLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { user, setUser, isAuthenticated, login } = useAppContext();

  // Test user credentials
  const testRestaurantOwner = {
    email: "owner@example.com",
    password: "password123"
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'restaurant_owner') {
        navigate('/restaurant');
      } else if (user?.role === 'customer') {
        navigate('/home');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use the login function from context
      await login(email, password);
      if (rememberMe) {
        localStorage.setItem('rememberUser', 'true');
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestRestaurantLogin = () => {
    setEmail(testRestaurantOwner.email);
    setPassword(testRestaurantOwner.password);
  };

  // Check for remembered user on component mount
  React.useEffect(() => {
    const rememberedUser = localStorage.getItem('user');
    if (rememberedUser && localStorage.getItem('rememberUser') === 'true') {
      try {
        const parsedUser = JSON.parse(rememberedUser);
        setUser(parsedUser);
        
        if (parsedUser.role === 'restaurant_owner') {
          navigate('/restaurant');
        } else if (parsedUser.role === 'customer') {
          navigate('/home');
        }
      } catch (error) {
        console.error("Error parsing remembered user:", error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-md border border-gray-200">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Restaurant Owner Login</CardTitle>
            <CardDescription className="text-gray-600">
              Login to manage your restaurant
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="restaurant@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
                    Forgot password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="text-gray-600 border-gray-400"
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none text-gray-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#33b1e6] hover:bg-[#33b1e6]/90 text-white" 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <p className="text-gray-600">
                Don't have a restaurant account? <Link to="/restaurant/signup" className="text-gray-800 hover:underline">Register</Link>
              </p>
              <p className="text-gray-600 mt-2">
                Looking to order food? <Link to="/customer/login" className="text-gray-800 hover:underline">Customer login</Link>
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 border-t border-gray-100 pt-4">
            <p className="text-sm text-center text-gray-500">Test account for demo:</p>
            <Button
              variant="outline" 
              className="w-full text-xs border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              onClick={handleTestRestaurantLogin}
            >
              Use Test Restaurant Account
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RestaurantLoginPage;
