
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, Settings, CreditCard, Heart, HelpCircle } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { useAppContext } from '@/context/AppContext';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAppContext();

  const handleLogout = () => {
    logout();
    navigate('/home'); // Changed from '/login' to '/home'
  };

  const profileOptions = [
    { 
      title: 'Personal Information', 
      icon: <User className="h-5 w-5" />,
      onClick: () => console.log('Personal information')
    },
    { 
      title: 'Saved Addresses', 
      icon: <Settings className="h-5 w-5" />,
      onClick: () => console.log('Saved addresses')
    },
    { 
      title: 'Payment Methods', 
      icon: <CreditCard className="h-5 w-5" />,
      onClick: () => console.log('Payment methods')
    },
    { 
      title: 'Favorites', 
      icon: <Heart className="h-5 w-5" />,
      onClick: () => console.log('Favorites')
    },
    { 
      title: 'Help & Support', 
      icon: <HelpCircle className="h-5 w-5" />,
      onClick: () => console.log('Help and support')
    },
  ];

  return (
    <div className="pb-20 min-h-screen bg-white">
      <div className="p-4 bg-[#ebf7fd] text-gray-800">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-900">Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-[#ebf7fd]">
                <AvatarImage src="" alt="Profile" />
                <AvatarFallback className="bg-[#ebf7fd] text-cyan-600 text-lg">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{user?.name || 'User'}</p>
                <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4">
        <Card className="mb-6 border-0 shadow-md">
          <CardContent className="p-0">
            {profileOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.onClick}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#ebf7fd]/30 border-b last:border-b-0 border-gray-100"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-cyan-500">{option.icon}</div>
                  <span>{option.title}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            ))}
          </CardContent>
        </Card>

        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 mt-4"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
