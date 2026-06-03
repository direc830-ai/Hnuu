import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wceoieugwqujmdscqmxf.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_fImf6nwPTJlud59aCf3dpg_KUeTUL_5';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testBooking() {
  // Sign in as a test user
  const email = 'test_booking_' + Date.now() + '@example.com';
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email,
    password: 'password123!'
  });

  if (authErr) {
    console.error('Auth Error:', authErr.message);
    return;
  }

  // Check existing
  const { data: existing } = await supabase
    .from('bookings')
    .select('id')
    .eq('seat_id', 'Seat R-12')
    .eq('status', 'confirmed')
    .gt('end_time', new Date().toISOString());
    
  if (existing && existing.length > 0) {
    console.error('Seat already reserved');
    return;
  }

  // Try to create a booking simulating what createSeatBooking does
  const user = authData.user;
  
  // ensure profile
  await supabase.from('profiles').upsert({ id: user.id, email: user.email, full_name: 'Test' });

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      seat_id: 'Seat R-12',
      floor: 'Rasa Map',
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      status: 'confirmed',
    })
    .select();

  if (error) {
    console.error('Insert Booking Error:', error);
  } else {
    console.log('Booking successful:', data);
  }
}

testBooking();
