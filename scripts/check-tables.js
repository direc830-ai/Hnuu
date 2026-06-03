import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wceoieugwqujmdscqmxf.supabase.co';
const supabaseAnonKey = 'sb_publishable_fImf6nwPTJlud59aCf3dpg_KUeTUL_5';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Try to list all tables we have access to
async function check() {
  // Try seat_stat
  const r1 = await supabase.from('seat_stat').select('*').limit(1);
  console.log('seat_stat:', JSON.stringify(r1.error || r1.data));

  // Try seat_stats
  const r2 = await supabase.from('seat_stats').select('*').limit(1);
  console.log('seat_stats:', JSON.stringify(r2.error || r2.data));

  // Try bookings
  const r3 = await supabase.from('bookings').select('*').limit(1);
  console.log('bookings:', JSON.stringify(r3.error || r3.data));
}

check();
