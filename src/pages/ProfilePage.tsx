
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, CreditCard, LogOut } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/BottomNavigation';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">My Profile</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-brand-cyan rounded-full p-3">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-medium">Guest User</h2>
                <p className="text-sm text-gray-500">Sign in to save your orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700 mb-2">Account Settings</h3>
          
          <Button 
            variant="outline" 
            className="w-full justify-start h-auto py-3 font-normal"
            onClick={() => console.log("Personal info")}
          >
            <User className="h-5 w-5 mr-3" />
            Personal Information
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start h-auto py-3 font-normal"
            onClick={() => console.log("Payment methods")}
          >
            <CreditCard className="h-5 w-5 mr-3" />
            Payment Methods
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start h-auto py-3 font-normal"
            onClick={() => console.log("App settings")}
          >
            <Settings className="h-5 w-5 mr-3" />
            App Settings
          </Button>
          
          <div className="pt-4">
            <Button 
              variant="outline" 
              className="w-full border-red-300 text-red-500"
              onClick={() => console.log("Sign out")}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
