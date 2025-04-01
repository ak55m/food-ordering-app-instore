
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppContext } from "@/context/AppContext";
import BottomNavigation from "@/components/BottomNavigation";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false)
});

type LoginFormValues = z.infer<typeof loginSchema>;

const CustomerLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, login } = useAppContext();

  // Test user credentials
  const testCustomer = {
    email: "customer@example.com",
    password: "password123"
  };

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'customer') {
        navigate('/home');
      } else if (user?.role === 'restaurant_owner') {
        navigate('/restaurant');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);

    try {
      // Save remember me preference to localStorage
      if (values.rememberMe) {
        localStorage.setItem('rememberUser', 'true');
      } else {
        localStorage.removeItem('rememberUser');
      }
      
      await login(values.email, values.password);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestCustomerLogin = () => {
    form.setValue("email", testCustomer.email);
    form.setValue("password", testCustomer.password);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow flex items-center justify-center p-4 pb-20">
        <Card className="w-full max-w-md shadow-md border border-gray-200">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Customer Login</CardTitle>
            <CardDescription className="text-gray-600">
              Login to order food from your favorite restaurants
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="name@example.com" 
                          className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-gray-700">Password</FormLabel>
                    <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-gray-800">
                      Forgot password?
                    </Link>
                  </div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="password"
                            className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="text-gray-600 border-gray-400"
                        />
                      </FormControl>
                      <Label
                        htmlFor="rememberMe"
                        className="text-sm font-medium leading-none text-gray-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </Label>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-[#33b1e6] hover:bg-[#33b1e6]/90 text-white" 
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center text-sm">
              <p className="text-gray-600">
                Don't have an account? <Link to="/customer/signup" className="text-gray-800 hover:underline">Sign up</Link>
              </p>
              <p className="text-gray-600 mt-2">
                Are you a restaurant owner? <Link to="/restaurant/login" className="text-gray-800 hover:underline">Login here</Link>
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 border-t border-gray-100 pt-4">
            <p className="text-sm text-center text-gray-500">Test account for demo:</p>
            <Button
              variant="outline" 
              className="w-full text-xs border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              onClick={handleTestCustomerLogin}
            >
              Use Test Customer Account
            </Button>
          </CardFooter>
        </Card>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default CustomerLoginPage;
