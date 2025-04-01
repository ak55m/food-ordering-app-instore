
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner";
import { checkDatabaseSetup, createDatabaseTables } from "@/utils/setupRealData";
import { AlertCircle, Loader2 } from "lucide-react";

const RestaurantLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isCreatingTables, setIsCreatingTables] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, login } = useAppContext();

  // Rainbow Teashop test credentials
  const testRestaurantOwner = {
    email: "restaurant@rainbowteashop.com",
    password: "password123"
  };

  // Check database status on component mount
  useEffect(() => {
    const checkDb = async () => {
      const isReady = await checkDatabaseSetup();
      if (!isReady) {
        setDbError("Database tables not found. Please click 'Create Database Tables' below or go to the signup page.");
      } else {
        setDbError(null);
      }
    };
    
    checkDb();
  }, []);

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
      
      // Check if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberUser', 'true');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Show a more detailed error message
      if (error.message?.includes('Invalid login credentials')) {
        toast.error("Invalid email or password. Please check your credentials.");
      } else if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        toast.error("Database not set up. Please create the database tables first.");
        setDbError("Database tables not found. Please click 'Create Database Tables' below.");
      } else {
        toast.error(`Failed to login: ${error.message || "Unknown error"}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestRestaurantLogin = () => {
    setEmail(testRestaurantOwner.email);
    setPassword(testRestaurantOwner.password);
  };

  const handleCreateTables = async () => {
    setIsCreatingTables(true);
    try {
      const success = await createDatabaseTables();
      if (success) {
        toast.success("Database tables created successfully!");
        setDbError(null);
      } else {
        toast.error("Failed to create database tables.");
      }
    } catch (error: any) {
      toast.error(`Error creating tables: ${error.message}`);
    } finally {
      setIsCreatingTables(false);
    }
  };

  // Check for remembered user on component mount
  React.useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberUser');
    if (rememberedUser === 'true') {
      // The actual user state is handled by AppContext's initialization
      // No need to manually set the user here
      console.log("User remembered from previous session");
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
            
            {dbError && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md flex items-start mt-2 text-sm">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-left">{dbError}</p>
              </div>
            )}
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
                Don't have a restaurant account? <Link to="/restaurant/signup" className="text-gray-800 hover:underline font-medium">Register</Link>
              </p>
              <p className="text-gray-600 mt-2">
                Looking to order food? <Link to="/customer/login" className="text-gray-800 hover:underline">Customer login</Link>
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-center w-full gap-2 bg-gray-50 p-2 rounded-md">
              <div className="text-left text-sm">
                <p className="font-medium text-gray-700">Rainbow Teashop demo:</p>
                <p className="text-gray-600 text-xs">Email: {testRestaurantOwner.email}</p>
                <p className="text-gray-600 text-xs">Password: {testRestaurantOwner.password}</p>
              </div>
              <Button
                variant="outline" 
                size="sm"
                className="ml-auto text-xs border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                onClick={handleTestRestaurantLogin}
              >
                Use Demo
              </Button>
            </div>
            
            {dbError && (
              <>
                <Button
                  variant="outline"
                  className="w-full text-amber-700 border-amber-300 hover:bg-amber-50"
                  onClick={handleCreateTables}
                  disabled={isCreatingTables}
                >
                  {isCreatingTables ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating tables...
                    </>
                  ) : (
                    "Create Database Tables"
                  )}
                </Button>
                <p className="text-xs text-center text-amber-600">
                  <Link to="/restaurant/signup" className="font-medium underline">
                    Go to signup page
                  </Link> 
                  {" "}to register a new restaurant
                </p>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RestaurantLoginPage;
