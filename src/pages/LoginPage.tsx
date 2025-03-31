
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useAppContext } from "@/context/AppContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useAppContext();

  // Test user credentials
  const testCustomer = {
    email: "customer@example.com",
    password: "password123",
    role: "customer"
  };

  const testRestaurantOwner = {
    email: "owner@example.com",
    password: "password123",
    role: "restaurant_owner"
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      // Check if credentials match test customer
      if (email === testCustomer.email && password === testCustomer.password) {
        setUser({
          id: "cust-123",
          name: "Test Customer",
          email: testCustomer.email,
          role: testCustomer.role
        });
        
        toast({
          title: "Login successful",
          description: "Welcome back, Test Customer!",
        });
        
        navigate("/");
      } 
      // Check if credentials match test restaurant owner
      else if (email === testRestaurantOwner.email && password === testRestaurantOwner.password) {
        setUser({
          id: "owner-123",
          name: "Test Restaurant Owner",
          email: testRestaurantOwner.email,
          role: testRestaurantOwner.role
        });
        
        toast({
          title: "Login successful",
          description: "Welcome back, Test Restaurant Owner!",
        });
        
        navigate("/restaurant");
      } 
      else {
        // Login failed
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Please check your credentials and try again.",
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleTestCustomerLogin = () => {
    setEmail(testCustomer.email);
    setPassword(testCustomer.password);
  };

  const handleTestRestaurantLogin = () => {
    setEmail(testRestaurantOwner.email);
    setPassword(testRestaurantOwner.password);
  };

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
