
-- Create an 'exec' function that can execute arbitrary SQL
-- You'll need to run this in your Supabase SQL editor first
CREATE OR REPLACE FUNCTION exec(query text) RETURNS void AS $$
BEGIN
  EXECUTE query;
END;
$$ LANGUAGE plpgsql;
