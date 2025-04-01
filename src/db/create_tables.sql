
-- Function to create all necessary tables for the restaurant app
CREATE OR REPLACE FUNCTION create_tables()
RETURNS void AS $$
BEGIN
    -- Create restaurants table if it doesn't exist
    CREATE TABLE IF NOT EXISTS restaurants (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        description TEXT,
        address TEXT,
        latitude NUMERIC,
        longitude NUMERIC,
        phone TEXT,
        email TEXT,
        image TEXT,
        logo TEXT,
        cover_image TEXT,
        is_open BOOLEAN DEFAULT true,
        is_new BOOLEAN DEFAULT true,
        is_active BOOLEAN DEFAULT true,
        accepts_online_orders BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        categories TEXT[] DEFAULT ARRAY[]::TEXT[]
    );

    -- Create restaurant_opening_hours table if it doesn't exist
    CREATE TABLE IF NOT EXISTS restaurant_opening_hours (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
        day TEXT NOT NULL,
        is_open BOOLEAN DEFAULT true,
        open_time TEXT,
        close_time TEXT
    );

    -- Create restaurant_social_media table if it doesn't exist
    CREATE TABLE IF NOT EXISTS restaurant_social_media (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
        platform TEXT NOT NULL,
        url TEXT NOT NULL
    );

    -- Create categories table if it doesn't exist
    CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE
    );

    -- Create menu_items table if it doesn't exist
    CREATE TABLE IF NOT EXISTS menu_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        description TEXT,
        price NUMERIC NOT NULL,
        image TEXT,
        category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE
    );

    -- Create orders table if it doesn't exist
    CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
        status TEXT NOT NULL DEFAULT 'pending',
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        total NUMERIC NOT NULL DEFAULT 0,
        payment_method TEXT,
        payment_status TEXT DEFAULT 'pending',
        payment_method_id UUID
    );

    -- Create order_items table if it doesn't exist
    CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        price NUMERIC NOT NULL
    );

    -- Create payment_methods table if it doesn't exist
    CREATE TABLE IF NOT EXISTS payment_methods (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        type TEXT NOT NULL,
        last_four TEXT NOT NULL,
        expiry_date TEXT,
        cardholder_name TEXT,
        is_default BOOLEAN DEFAULT false,
        brand TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- Function to check if setup is complete and run setup if needed
CREATE OR REPLACE FUNCTION setup_database() 
RETURNS json AS $$
DECLARE
  tables_exist boolean;
BEGIN
  -- Check if restaurants table exists
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = 'restaurants'
  ) INTO tables_exist;
  
  -- If tables don't exist, create them
  IF NOT tables_exist THEN
    PERFORM create_tables();
    RETURN json_build_object('success', true, 'message', 'Tables created successfully');
  END IF;
  
  RETURN json_build_object('success', true, 'message', 'Tables already exist');
END;
$$ LANGUAGE plpgsql;

-- For direct table creation with no functions
CREATE OR REPLACE FUNCTION create_tables_direct()
RETURNS json AS $$
BEGIN
  PERFORM create_tables();
  RETURN json_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql;
