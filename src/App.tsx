
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext";

// Pages - Authentication
import CustomerLoginPage from "./pages/CustomerLoginPage";
import CustomerSignupPage from "./pages/CustomerSignupPage";
import RestaurantLoginPage from "./pages/RestaurantLoginPage";
import RestaurantSignupPage from "./pages/RestaurantSignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LandingPage from "./pages/LandingPage";

// Pages - Customer View
import Index from "./pages/Index";
import RestaurantDetail from "./pages/RestaurantDetail";
import OrdersPage from "./pages/OrdersPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

// Pages - Restaurant Owner View
import RestaurantDashboard from "./pages/RestaurantDashboard";
import RestaurantMenuManagement from "./pages/RestaurantMenuManagement";
import RestaurantAnalytics from "./pages/RestaurantAnalytics";
import RestaurantSettings from "./pages/RestaurantSettings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected route for customers - only for actions requiring authentication
const CustomerAuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAppContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/customer/login" />;
  }
  
  return <>{children}</>;
};

// Protected route for restaurant owners
const RestaurantRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAppContext();
  
  if (!isAuthenticated || user?.role !== "restaurant_owner") {
    return <Navigate to="/restaurant/login" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAppContext();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Customer Auth Routes */}
      <Route path="/customer/login" element={
        isAuthenticated ? 
          (user?.role === 'restaurant_owner' ? <Navigate to="/restaurant" /> : <Navigate to="/home" />) 
          : <CustomerLoginPage />
      } />
      <Route path="/customer/signup" element={
        isAuthenticated ? 
          (user?.role === 'restaurant_owner' ? <Navigate to="/restaurant" /> : <Navigate to="/home" />) 
          : <CustomerSignupPage />
      } />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      {/* Restaurant Auth Routes */}
      <Route path="/restaurant/login" element={
        isAuthenticated ? 
          (user?.role === 'restaurant_owner' ? <Navigate to="/restaurant" /> : <Navigate to="/home" />) 
          : <RestaurantLoginPage />
      } />
      <Route path="/restaurant/signup" element={
        isAuthenticated ? 
          (user?.role === 'restaurant_owner' ? <Navigate to="/restaurant" /> : <Navigate to="/home" />) 
          : <RestaurantSignupPage />
      } />
      
      {/* Legacy login route - redirect to customer login */}
      <Route path="/login" element={<Navigate to="/customer/login" />} />
      
      {/* Customer Routes - No authentication required for browsing */}
      <Route path="/home" element={<Index />} />
      <Route path="/restaurant/:id" element={<RestaurantDetail />} />
      
      {/* Cart is accessible to everyone */}
      <Route path="/cart" element={<CartPage />} />
      
      {/* Customer Routes - Authentication required for personal data and orders */}
      <Route path="/orders" element={
        <CustomerAuthRoute>
          <OrdersPage />
        </CustomerAuthRoute>
      } />
      <Route path="/profile" element={
        <CustomerAuthRoute>
          <ProfilePage />
        </CustomerAuthRoute>
      } />
      
      {/* Restaurant Owner Routes */}
      <Route path="/restaurant" element={
        <RestaurantRoute>
          <RestaurantDashboard />
        </RestaurantRoute>
      } />
      <Route path="/restaurant/menu" element={
        <RestaurantRoute>
          <RestaurantMenuManagement />
        </RestaurantRoute>
      } />
      <Route path="/restaurant/analytics" element={
        <RestaurantRoute>
          <RestaurantAnalytics />
        </RestaurantRoute>
      } />
      <Route path="/restaurant/settings" element={
        <RestaurantRoute>
          <RestaurantSettings />
        </RestaurantRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
