const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qeioagapnqxuujkuzqdw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlaW9hZ2FwbnF4dXVqa3V6cWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzODU0MDcsImV4cCI6MjA5NDk2MTQwN30.6NB1NOmXW9MSPYb94y9YjEqXHxKFn3boSK2TSbvjDZA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('Testing Supabase Connection...');
  try {
    const { data, error } = await supabase.from('locations').select('*').limit(3);
    if (error) {
      console.error('Database connection failed:', error.message);
    } else {
      console.log('Database connection successful!');
      console.log('Locations count:', data.length);
      console.log('Sample locations:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

run();
