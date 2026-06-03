import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wceoieugwqujmdscqmxf.supabase.co';
const supabaseAnonKey = 'sb_publishable_fImf6nwPTJlud59aCf3dpg_KUeTUL_5';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  // Try to sign in as a test user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'test_rls_check@example.com',
    password: 'password123',
  });
  
  if (authError) {
    console.error('Auth Error:', authError.message);
    // If user exists, sign in instead
    await supabase.auth.signInWithPassword({
      email: 'test_rls_check@example.com',
      password: 'password123',
    });
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('id, user_id, seat_id')
    .eq('status', 'confirmed');

  console.log('Bookings seen by new user:', data?.length || 0, data);
  if (error) console.error('Error:', error);
}

check();
