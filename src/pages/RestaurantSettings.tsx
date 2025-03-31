import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "sonner";
import { Save, Clock, MapPin, Image, Upload, Building, MapPinned } from 'lucide-react';
import RestaurantSidebar from '@/components/RestaurantSidebar';

const RestaurantSettings: React.FC = () => {
  const { getRestaurantById, updateRestaurant } = useAppContext();
  const [restaurantId, setRestaurantId] = useState('1'); // Default to first restaurant
  const restaurant = getRestaurantById(restaurantId);
  
  const [restaurantForm, setRestaurantForm] = useState({
    name: restaurant?.name || '',
    description: 'A delicious restaurant with a variety of menu options.',
    address: '123 Main St, Anytown, USA',
    latitude: 40.7128,
    longitude: -74.0060,
    phone: '(555) 123-4567',
    email: 'contact@restaurant.com',
    logo: restaurant?.image || '',
    coverImage: restaurant?.image || '',
    openingHours: {
      monday: { open: '09:00', close: '22:00', isOpen: true },
      tuesday: { open: '09:00', close: '22:00', isOpen: true },
      wednesday: { open: '09:00', close: '22:00', isOpen: true },
      thursday: { open: '09:00', close: '22:00', isOpen: true },
      friday: { open: '09:00', close: '23:00', isOpen: true },
      saturday: { open: '10:00', close: '23:00', isOpen: true },
      sunday: { open: '10:00', close: '22:00', isOpen: true },
    },
    socialMedia: {
      facebook: 'https://facebook.com/restaurant',
      instagram: 'https://instagram.com/restaurant',
      twitter: 'https://twitter.com/restaurant',
    },
    isActive: true,
    acceptsOnlineOrders: true,
  });
  
  const geocodeAddress = async () => {
    if (!restaurantForm.address) {
      toast.error("Please enter an address first");
      return;
    }

    try {
      toast.info("Getting coordinates for your address...");
      
      setTimeout(() => {
        const randomLat = 40.7128 + (Math.random() * 0.01);
        const randomLng = -74.0060 + (Math.random() * 0.01);
        
        setRestaurantForm({
          ...restaurantForm,
          latitude: parseFloat(randomLat.toFixed(6)),
          longitude: parseFloat(randomLng.toFixed(6))
        });
        
        toast.success("Location coordinates updated!");
      }, 1500);
    } catch (error) {
      toast.error("Failed to get coordinates. Please check the address.");
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRestaurantForm({
      ...restaurantForm,
      [name]: value
    });
  };

  const handleNumericInputChange = (name: string, value: number) => {
    setRestaurantForm({
      ...restaurantForm,
      [name]: value
    });
  };
  
  const handleHoursChange = (day: string, field: 'open' | 'close', value: string) => {
    setRestaurantForm({
      ...restaurantForm,
      openingHours: {
        ...restaurantForm.openingHours,
        [day]: {
          ...restaurantForm.openingHours[day as keyof typeof restaurantForm.openingHours],
          [field]: value
        }
      }
    });
  };
  
  const handleDayToggle = (day: string, isOpen: boolean) => {
    setRestaurantForm({
      ...restaurantForm,
      openingHours: {
        ...restaurantForm.openingHours,
        [day]: {
          ...restaurantForm.openingHours[day as keyof typeof restaurantForm.openingHours],
          isOpen
        }
      }
    });
  };
  
  const handleSocialMediaChange = (platform: string, value: string) => {
    setRestaurantForm({
      ...restaurantForm,
      socialMedia: {
        ...restaurantForm.socialMedia,
        [platform]: value
      }
    });
  };
  
  const handleToggleChange = (field: 'isActive' | 'acceptsOnlineOrders', value: boolean) => {
    setRestaurantForm({
      ...restaurantForm,
      [field]: value
    });
  };
  
  const handleSave = () => {
    if (!restaurantForm.name.trim()) {
      toast.error("Restaurant name is required");
      return;
    }
    
    updateRestaurant({
      ...restaurant,
      name: restaurantForm.name,
    });
    
    toast.success("Restaurant settings saved successfully!");
  };
  
  return (
    <div className="min-h-screen bg-[#f5fbfe] flex">
      <div className="hidden md:block md:w-64">
        <RestaurantSidebar activePage="settings" />
      </div>
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#1fa9e4]">Restaurant Settings</h1>
            <Button 
              className="bg-[#1fa9e4] hover:bg-[#1a97cf] text-white"
              onClick={handleSave}
            >
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </div>
          
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid grid-cols-3 mb-4 bg-[#d6effa]">
              <TabsTrigger value="general" className="data-[state=active]:bg-[#1fa9e4] data-[state=active]:text-white">General Info</TabsTrigger>
              <TabsTrigger value="hours" className="data-[state=active]:bg-[#1fa9e4] data-[state=active]:text-white">Hours & Location</TabsTrigger>
              <TabsTrigger value="appearance" className="data-[state=active]:bg-[#1fa9e4] data-[state=active]:text-white">Appearance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card className="border-[#c2e7f8]">
                <CardHeader className="bg-[#e0f3fb] border-b border-[#c2e7f8]">
                  <CardTitle>Restaurant Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Restaurant Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={restaurantForm.name} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        name="description" 
                        rows={3} 
                        value={restaurantForm.description} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={restaurantForm.phone} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={restaurantForm.email} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Social Media</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input 
                          id="facebook" 
                          value={restaurantForm.socialMedia.facebook} 
                          onChange={(e) => handleSocialMediaChange('facebook', e.target.value)} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input 
                          id="instagram" 
                          value={restaurantForm.socialMedia.instagram} 
                          onChange={(e) => handleSocialMediaChange('instagram', e.target.value)} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input 
                          id="twitter" 
                          value={restaurantForm.socialMedia.twitter} 
                          onChange={(e) => handleSocialMediaChange('twitter', e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Status Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Restaurant Active</p>
                          <p className="text-sm text-gray-500">When disabled, your restaurant will not appear in searches</p>
                        </div>
                        <Switch 
                          checked={restaurantForm.isActive} 
                          onCheckedChange={(checked) => handleToggleChange('isActive', checked)} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Accept Online Orders</p>
                          <p className="text-sm text-gray-500">Allow customers to place orders online</p>
                        </div>
                        <Switch 
                          checked={restaurantForm.acceptsOnlineOrders} 
                          onCheckedChange={(checked) => handleToggleChange('acceptsOnlineOrders', checked)} 
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="hours">
              <Card className="border-[#c2e7f8]">
                <CardHeader className="bg-[#e0f3fb] border-b border-[#c2e7f8]">
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Opening Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {Object.entries(restaurantForm.openingHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center justify-between">
                        <div className="w-24 capitalize">{day}</div>
                        <div className="flex-1 flex items-center">
                          <Switch 
                            checked={hours.isOpen} 
                            onCheckedChange={(checked) => handleDayToggle(day, checked)}
                            className="mr-4"
                          />
                          {hours.isOpen ? (
                            <div className="flex items-center space-x-2">
                              <Input 
                                type="time" 
                                value={hours.open} 
                                onChange={(e) => handleHoursChange(day, 'open', e.target.value)} 
                                className="w-24"
                              />
                              <span>to</span>
                              <Input 
                                type="time" 
                                value={hours.close} 
                                onChange={(e) => handleHoursChange(day, 'close', e.target.value)} 
                                className="w-24"
                              />
                            </div>
                          ) : (
                            <span className="text-gray-500">Closed</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6 border-[#c2e7f8]">
                <CardHeader className="bg-[#e0f3fb] border-b border-[#c2e7f8]">
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Restaurant Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="address" 
                          name="address" 
                          value={restaurantForm.address} 
                          onChange={handleInputChange} 
                          className="flex-1"
                        />
                        <Button 
                          onClick={geocodeAddress}
                          type="button"
                          className="bg-[#1fa9e4] hover:bg-[#1a97cf]"
                        >
                          <MapPinned className="h-4 w-4 mr-2" />
                          Get Coordinates
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input 
                          id="latitude" 
                          name="latitude" 
                          type="number"
                          step="0.000001"
                          value={restaurantForm.latitude.toString()} 
                          onChange={(e) => handleNumericInputChange('latitude', parseFloat(e.target.value) || 0)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input 
                          id="longitude" 
                          name="longitude" 
                          type="number"
                          step="0.000001"
                          value={restaurantForm.longitude.toString()} 
                          onChange={(e) => handleNumericInputChange('longitude', parseFloat(e.target.value) || 0)} 
                        />
                      </div>
                    </div>
                    
                    <div className="h-64 bg-[#e0f3fb] rounded-md flex flex-col items-center justify-center p-4 border border-[#c2e7f8]">
                      <MapPin className="h-12 w-12 text-[#1fa9e4] mb-2" />
                      <p className="text-center text-gray-600">
                        Restaurant location: {restaurantForm.latitude.toFixed(6)}, {restaurantForm.longitude.toFixed(6)}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Interactive map would appear here in a production environment.<br />
                        In a real app, this would display a map with the restaurant's location marker.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance">
              <Card className="border-[#c2e7f8]">
                <CardHeader className="bg-[#e0f3fb] border-b border-[#c2e7f8]">
                  <CardTitle>Restaurant Appearance</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="flex items-center text-lg font-medium mb-2">
                        <Building className="h-5 w-5 mr-2" />
                        Restaurant Logo
                      </h3>
                      <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                          {restaurantForm.logo && (
                            <img 
                              src={restaurantForm.logo} 
                              alt="Restaurant logo" 
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="space-y-2">
                          <Input 
                            id="logo" 
                            name="logo" 
                            value={restaurantForm.logo} 
                            onChange={handleInputChange} 
                            placeholder="Image URL"
                          />
                          <Button variant="outline" className="w-full">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Logo
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="flex items-center text-lg font-medium mb-2">
                        <Image className="h-5 w-5 mr-2" />
                        Cover Image
                      </h3>
                      <div className="space-y-4">
                        <div className="aspect-video w-full bg-gray-100 rounded-md overflow-hidden">
                          {restaurantForm.coverImage && (
                            <img 
                              src={restaurantForm.coverImage} 
                              alt="Restaurant cover" 
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="space-y-2">
                          <Input 
                            id="coverImage" 
                            name="coverImage" 
                            value={restaurantForm.coverImage} 
                            onChange={handleInputChange} 
                            placeholder="Image URL"
                          />
                          <Button variant="outline">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Cover Image
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default RestaurantSettings;
