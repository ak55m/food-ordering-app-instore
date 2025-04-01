import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { setupRainbowTeashop, checkDatabaseSetup } from "@/utils/setupRealData";
import { Loader2, AlertCircle } from "lucide-react";

const RestaurantSignupPage = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isDbReady, setIsDbReady] = useState<boolean | null>(null);
  const [isSettingUpDemo, setIsSettingUpDemo] = useState(false);
  const [dbSetupMessage, setDbSetupMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, register } = useAppContext();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'restaurant_owner') {
        navigate('/restaurant');
      } else if (user?.role === 'customer') {
        navigate('/home');
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const checkDb = async () => {
      const isReady = await checkDatabaseSetup();
      setIsDbReady(isReady);
      if (!isReady) {
        setDbSetupMessage("Database tables not found. Click 'Create Rainbow Teashop demo' to set up database tables.");
      }
    };
    
    checkDb();
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    
    if (!isDbReady) {
      toast.warning("Database tables need to be created first. Please set up the demo restaurant to initialize the database.");
      return;
    }

    setPasswordError("");
    setIsLoading(true);

    try {
      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .insert([
          { 
            name: restaurantName,
            description: `Welcome to ${restaurantName}`,
            address: 'Please update your address',
            is_active: true,
            accepts_online_orders: true
          }
        ])
        .select()
        .single();
        
      if (restaurantError) {
        throw new Error(`Restaurant creation failed: ${restaurantError.message}`);
      }
      
      const userData = {
        name: ownerName,
        role: 'restaurant_owner' as const,
        restaurantId: restaurantData.id
      };
      
      const newUser = await register(email, password, userData);
      
      if (newUser) {
        toast.success('Restaurant account created successfully! Please log in.');
        navigate('/restaurant/login');
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error('Failed to create restaurant account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const setupDemoRestaurant = async () => {
    setIsSettingUpDemo(true);
    setDbSetupMessage("Setting up database tables and demo data. This may take a moment...");
    
    try {
      const result = await setupRainbowTeashop();
      
      if (result.success) {
        setIsDbReady(true);
        setDbSetupMessage(null);
        toast.success('Rainbow Teashop demo data was set up successfully!');
        toast.info('You can now log in with restaurant@rainbowteashop.com / password123');
      } else {
        toast.error(`Failed to set up demo restaurant: ${result.error}`);
        setDbSetupMessage(`Database setup failed: ${result.error}`);
      }
    } catch (error: any) {
      toast.error(`Error setting up demo restaurant: ${error.message}`);
      setDbSetupMessage(`Database setup error: ${error.message}`);
    } finally {
      setIsSettingUpDemo(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-md border border-gray-200">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Register Your Restaurant</CardTitle>
            <CardDescription className="text-gray-600">
              Create an account to start serving customers
            </CardDescription>
            
            {dbSetupMessage && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md flex items-start mt-2 text-sm">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-left">{dbSetupMessage}</p>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="restaurantName" className="text-gray-700">Restaurant Name</Label>
                <Input 
                  id="restaurantName" 
                  type="text" 
                  placeholder="Delicious Bites" 
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ownerName" className="text-gray-700">Owner Name</Label>
                <Input 
                  id="ownerName" 
                  type="text" 
                  placeholder="John Doe" 
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Business Email</Label>
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
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                  required
                />
                {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                  className="text-gray-600 border-gray-400"
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none text-gray-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#33b1e6] hover:bg-[#33b1e6]/90 text-white" 
                disabled={isLoading || !agreeTerms || !isDbReady}
              >
                {isLoading ? "Creating Account..." : "Register Restaurant"}
              </Button>
              
              {!isDbReady && (
                <p className="text-xs text-center text-amber-600">
                  Please set up the database first using the button below
                </p>
              )}
            </form>

            <div className="mt-4 text-center text-sm">
              <p className="text-gray-600">
                Already have a restaurant account? <Link to="/restaurant/login" className="text-gray-800 hover:underline">Login</Link>
              </p>
              <p className="text-gray-600 mt-2">
                Looking to order food? <Link to="/customer/login" className="text-gray-800 hover:underline">Customer login</Link>
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col">
            <div className="w-full border-t border-gray-200 my-2"></div>
            <div className="text-center w-full">
              <p className="text-sm text-gray-600 mb-2">
                {isDbReady 
                  ? "Want to reset with demo data?" 
                  : "Set up database with demo data:"}
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isSettingUpDemo}
                onClick={setupDemoRestaurant}
              >
                {isSettingUpDemo ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting up database...
                  </>
                ) : (
                  "Create Rainbow Teashop demo"
                )}
              </Button>
              {isSettingUpDemo && (
                <p className="text-xs text-gray-500 mt-1">This might take a few moments...</p>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RestaurantSignupPage;
