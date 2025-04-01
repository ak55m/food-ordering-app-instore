
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Check if tables exist by attempting to query them
export async function checkDatabaseSetup() {
  try {
    // Try to check if restaurants table exists by querying with a limit
    const { error: restaurantsError } = await supabase
      .from('restaurants')
      .select('id')
      .limit(1);
    
    if (restaurantsError && restaurantsError.message.includes('does not exist')) {
      console.error('Restaurants table not ready:', restaurantsError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking database setup:', error);
    return false;
  }
}

// Create database schema
export async function createDatabaseTables() {
  try {
    // First check if restaurants table already exists
    const tablesExist = await checkDatabaseSetup();
    if (tablesExist) {
      toast.info("Tables already exist");
      return true;
    }

    // We need to execute SQL directly to create the tables
    // Create restaurants table
    const { error: createRestaurantsError } = await supabase.rpc('create_tables', {});
    
    if (createRestaurantsError) {
      console.error("Error creating tables:", createRestaurantsError);
      toast.error("Failed to create database tables. Please create them in the Supabase dashboard or check permissions.");
      return false;
    }

    // If we got this far, tables were created
    toast.success("Database tables created successfully!");
    return true;
  } catch (error) {
    console.error('Error creating database tables:', error);
    toast.error("Failed to create database tables.");
    return false;
  }
}

export async function setupRealData() {
  try {
    // First try to create the tables
    const tablesCreated = await createDatabaseTables();
    
    if (!tablesCreated) {
      toast.error('Could not create database tables. Please check your Supabase setup and permissions.');
      return { success: false, error: "Could not create database tables" };
    }

    // Check if the restaurant already exists
    const { data: existingRestaurant, error: checkError } = await supabase
      .from('restaurants')
      .select('id')
      .eq('name', 'Rainbow Teashop')
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing restaurant:', checkError);
      return { success: false, error: checkError.message };
    }

    // If restaurant already exists, don't add it again
    if (existingRestaurant) {
      console.log('Rainbow Teashop already exists in the database');
      return { success: true, restaurantId: existingRestaurant.id, message: 'Restaurant already exists' };
    }

    // 1. Create the restaurant
    const { data: restaurantData, error: restaurantError } = await supabase
      .from('restaurants')
      .insert([
        {
          name: 'Rainbow Teashop',
          description: 'Delicious milk teas and specialty drinks',
          address: '750 Synergy Park drive Richardson Texas, 75080',
          latitude: 32.9899,  // Coordinates for Richardson, TX
          longitude: -96.7501,
          phone: '972-555-1234',
          email: 'contact@rainbowteashop.com',
          logo: 'https://jurgzlaiespprlrwkpxk.supabase.co/storage/v1/object/public/restaurant_images/rainbow_teashop_logo.png',
          cover_image: 'https://jurgzlaiespprlrwkpxk.supabase.co/storage/v1/object/public/restaurant_images/rainbow_teashop_cover.jpg',
          is_active: true,
          accepts_online_orders: true,
          image: 'https://jurgzlaiespprlrwkpxk.supabase.co/storage/v1/object/public/restaurant_images/rainbow_teashop.jpg'
        }
      ])
      .select()
      .single();

    if (restaurantError) {
      console.error('Error creating restaurant:', restaurantError);
      return { success: false, error: restaurantError.message };
    }

    const restaurantId = restaurantData.id;

    // 2. Add restaurant opening hours
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const openingHoursPromises = daysOfWeek.map(day => {
      const isWeekend = day === 'saturday' || day === 'sunday';
      
      return supabase.from('restaurant_opening_hours').insert({
        restaurant_id: restaurantId,
        day: day,
        is_open: true,
        open_time: isWeekend ? '11:00' : '10:00',
        close_time: isWeekend ? '22:00' : '21:00'
      });
    });

    await Promise.all(openingHoursPromises);

    // 3. Add social media links
    await supabase.from('restaurant_social_media').insert([
      {
        restaurant_id: restaurantId,
        platform: 'facebook',
        url: 'https://facebook.com/rainbowteashop'
      },
      {
        restaurant_id: restaurantId,
        platform: 'instagram',
        url: 'https://instagram.com/rainbowteashop'
      }
    ]);

    // 4. Add milk tea category
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .insert({
        name: 'Milk Tea',
        restaurant_id: restaurantId
      })
      .select()
      .single();

    if (categoryError) {
      console.error('Error creating category:', categoryError);
      return { success: false, error: categoryError.message };
    }

    const categoryId = categoryData.id;

    // 5. Add menu items
    const menuItems = [
      { name: 'Dreamy Matcha', description: 'Refreshing matcha with milk and boba', price: 6.75, image: 'https://jurgzlaiespprlrwkpxk.supabase.co/storage/v1/object/public/menu_items/matcha.jpg' },
      { name: 'Tiger Sugar Milk Tea', description: 'Brown sugar milk tea with boba', price: 5.25, image: 'https://jurgzlaiespprlrwkpxk.supabase.co/storage/v1/object/public/menu_items/tiger_sugar.jpg' },
      { name: 'Barbie\'s Drink', description: 'Pink strawberry milk tea with pearls', price: 5.25, image: 'https://jurgzlaiespprlrwkpxk.supabase.co/storage/v1/object/public/menu_items/barbie.jpg' },
      { name: 'Taro Milk Tea', description: 'Creamy taro milk tea with boba', price: 5.25, image: 'https://jurgzlaiespprlrwkpxk.supabase.co/storage/v1/object/public/menu_items/taro.jpg' },
      { name: 'Mango Tea', description: 'Sweet mango fruit tea with jellies', price: 5.75, image: 'https://jurgzlaiespprlrwkpxk.supabase.co/storage/v1/object/public/menu_items/mango.jpg' },
    ];

    const menuItemsPromises = menuItems.map(item => {
      return supabase.from('menu_items').insert({
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        category_id: categoryId,
        restaurant_id: restaurantId
      });
    });

    await Promise.all(menuItemsPromises);

    // 6. Create the restaurant owner user account using the credentials
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: 'restaurant@rainbowteashop.com',
      password: 'password123',
      options: {
        data: {
          name: 'Vy Nguyen',
          role: 'restaurant_owner',
          restaurant_id: restaurantId
        }
      }
    });

    if (signUpError) {
      console.error('Error creating user account:', signUpError);
      toast.error(`Failed to create user account: ${signUpError.message}`);
      return { success: true, restaurantId, warning: 'Restaurant created, but user creation failed' };
    }
    
    // If successful, log a success message
    console.log('Restaurant owner account created successfully');
    toast.success('Rainbow Teashop and owner account created successfully!');
    toast.info('You can now log in with restaurant@rainbowteashop.com / password123');

    return { success: true, restaurantId };
  } catch (error: any) {
    console.error('Error setting up Rainbow Teashop:', error);
    return { success: false, error: error.message };
  }
}
