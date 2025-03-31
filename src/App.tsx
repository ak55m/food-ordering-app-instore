
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext";

// Pages - Authentication
import LoginPage from "./pages/LoginPage";

// Pages - Customer View
import Index from "./pages/Index";
import RestaurantDetail from "./pages/RestaurantDetail";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

// Pages - Restaurant Owner View
import RestaurantDashboard from "./pages/RestaurantDashboard";
import RestaurantMenuManagement from "./pages/RestaurantMenuManagement";
import RestaurantAnalytics from "./pages/RestaurantAnalytics";
import RestaurantSettings from "./pages/RestaurantSettings";

const queryClient = new QueryClient();

// Protected route for customers
const CustomerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAppContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Protected route for restaurant owners
const RestaurantRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAppContext();
  
  if (!isAuthenticated || user?.role !== "restaurant_owner") {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Customer Routes */}
      <Route path="/" element={
        <CustomerRoute>
          <Index />
        </CustomerRoute>
      } />
      <Route path="/restaurant/:id" element={
        <CustomerRoute>
          <RestaurantDetail />
        </CustomerRoute>
      } />
      <Route path="/orders" element={
        <CustomerRoute>
          <OrdersPage />
        </CustomerRoute>
      } />
      <Route path="/profile" element={
        <CustomerRoute>
          <ProfilePage />
        </CustomerRoute>
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
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
