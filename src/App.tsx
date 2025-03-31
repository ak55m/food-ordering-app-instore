
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

// Pages - Customer View
import Index from "./pages/Index";
import RestaurantDetail from "./pages/RestaurantDetail";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

// Pages - Restaurant Owner View
import RestaurantOwnerDashboard from "./pages/RestaurantOwnerDashboard";
import RestaurantMenuManagement from "./pages/RestaurantMenuManagement";
import RestaurantAnalytics from "./pages/RestaurantAnalytics";
import RestaurantSettings from "./pages/RestaurantSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Restaurant Owner Routes */}
            <Route path="/restaurant" element={<RestaurantOwnerDashboard />} />
            <Route path="/restaurant/menu" element={<RestaurantMenuManagement />} />
            <Route path="/restaurant/analytics" element={<RestaurantAnalytics />} />
            <Route path="/restaurant/settings" element={<RestaurantSettings />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
