import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wceoieugwqujmdscqmxf.supabase.co';
const supabaseAnonKey = 'sb_publishable_fImf6nwPTJlud59aCf3dpg_KUeTUL_5';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFetch() {
  // Use a real-looking email to sign up, wait I can just use a dummy one that passes validation
  const email = 'test_auth_user_' + Date.now() + '@gmail.com';
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email,
    password: 'password123!'
  });

  if (authErr) {
    console.error('Sign up error:', authErr.message);
  } else {
    console.log('Signed up successfully as', email);
  }

  // Now we are authenticated. Let's try fetching the active bookings for Rasa Map
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('seat_id, status, end_time, user_id')
    .eq('floor', 'Rasa Map')
    .gt('end_time', new Date().toISOString())
    .eq('status', 'confirmed');

  if (error) {
    console.error('Error fetching bookings:', error.message);
  } else {
    console.log('Active bookings fetched as authenticated user:', bookings);
  }
}

testFetch();
