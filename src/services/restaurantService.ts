
import { supabase } from '@/lib/supabase';
import { Restaurant } from '@/types';
import { toast } from 'sonner';

// Helper functions for data transformation
function transformRestaurantFromDB(dbRestaurant: any): Restaurant {
  return {
    id: dbRestaurant.id,
    name: dbRestaurant.name,
    description: dbRestaurant.description,
    image: dbRestaurant.image,
    categories: dbRestaurant.categories || [],
    rating: dbRestaurant.rating || 0,
    address: dbRestaurant.address,
    coordinates: {
      latitude: dbRestaurant.latitude,
      longitude: dbRestaurant.longitude
    },
    latitude: dbRestaurant.latitude,
    longitude: dbRestaurant.longitude,
    distance: dbRestaurant.distance,
    isOpen: dbRestaurant.is_open,
    isNew: dbRestaurant.is_new,
    phone: dbRestaurant.phone,
    email: dbRestaurant.email,
    logo: dbRestaurant.logo,
    coverImage: dbRestaurant.cover_image,
    openingHours: {
      monday: { isOpen: true, open: '09:00', close: '22:00' },
      tuesday: { isOpen: true, open: '09:00', close: '22:00' },
      wednesday: { isOpen: true, open: '09:00', close: '22:00' },
      thursday: { isOpen: true, open: '09:00', close: '22:00' },
      friday: { isOpen: true, open: '09:00', close: '23:00' },
      saturday: { isOpen: true, open: '10:00', close: '23:00' },
      sunday: { isOpen: true, open: '10:00', close: '22:00' }
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: ''
    },
    isActive: dbRestaurant.is_active,
    acceptsOnlineOrders: dbRestaurant.accepts_online_orders
  };
}

function transformRestaurantWithRelations(dbRestaurant: any): Restaurant {
  const restaurant = transformRestaurantFromDB(dbRestaurant);
  
  // Process opening hours
  if (dbRestaurant.restaurant_opening_hours) {
    const openingHours: any = {};
    
    for (const hour of dbRestaurant.restaurant_opening_hours) {
      openingHours[hour.day] = {
        isOpen: hour.is_open,
        open: hour.open_time,
        close: hour.close_time
      };
    }
    
    // Ensure all days are present
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    for (const day of days) {
      if (!openingHours[day]) {
        openingHours[day] = { isOpen: false, open: '09:00', close: '17:00' };
      }
    }
    
    restaurant.openingHours = openingHours;
  }
  
  // Process social media
  if (dbRestaurant.restaurant_social_media) {
    const socialMedia: any = {};
    
    for (const social of dbRestaurant.restaurant_social_media) {
      socialMedia[social.platform] = social.url;
    }
    
    restaurant.socialMedia = {
      facebook: socialMedia.facebook || '',
      instagram: socialMedia.instagram || '',
      twitter: socialMedia.twitter || '',
      ...socialMedia
    };
  }
  
  return restaurant;
}

export async function getRestaurants() {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_active', true);
      
    if (error) {
      toast.error('Failed to load restaurants');
      return [];
    }
    
    // Transform database format to application format
    return data.map(transformRestaurantFromDB);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    toast.error('Failed to load restaurants');
    return [];
  }
}

export async function getRestaurantById(id: string) {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        restaurant_opening_hours(*),
        restaurant_social_media(*)
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      return null;
    }
    
    return transformRestaurantWithRelations(data);
  } catch (error) {
    console.error(`Error fetching restaurant with ID ${id}:`, error);
    return null;
  }
}

export async function updateRestaurant(restaurant: Restaurant) {
  try {
    // First update the main restaurant info
    const { error } = await supabase
      .from('restaurants')
      .update({
        name: restaurant.name,
        description: restaurant.description,
        address: restaurant.address,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        phone: restaurant.phone,
        email: restaurant.email,
        logo: restaurant.logo,
        cover_image: restaurant.coverImage,
        is_active: restaurant.isActive,
        accepts_online_orders: restaurant.acceptsOnlineOrders
      })
      .eq('id', restaurant.id);
      
    if (error) {
      toast.error('Failed to save restaurant settings');
      return null;
    }
    
    // Update opening hours
    for (const [day, hours] of Object.entries(restaurant.openingHours)) {
      const { error: hoursError } = await supabase
        .from('restaurant_opening_hours')
        .upsert({
          restaurant_id: restaurant.id,
          day: day,
          is_open: hours.isOpen,
          open_time: hours.open,
          close_time: hours.close
        });
        
      if (hoursError) {
        toast.error('Error updating restaurant hours');
        return null;
      }
    }
    
    // Update social media
    for (const [platform, url] of Object.entries(restaurant.socialMedia)) {
      if (url) {
        const { error: socialError } = await supabase
          .from('restaurant_social_media')
          .upsert({
            restaurant_id: restaurant.id,
            platform: platform,
            url: url
          });
          
        if (socialError) {
          toast.error('Error updating social media info');
          return null;
        }
      }
    }
    
    toast.success('Restaurant settings saved successfully!');
    return restaurant;
  } catch (error) {
    console.error('Error updating restaurant:', error);
    toast.error('Failed to save restaurant settings');
    return null;
  }
}
