import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wceoieugwqujmdscqmxf.supabase.co';
const supabaseAnonKey = 'sb_publishable_fImf6nwPTJlud59aCf3dpg_KUeTUL_5';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase
    .from('bookings')
    .select('id, user_id, seat_id, start_time, end_time, status, floor')
    .eq('status', 'confirmed')
    .gt('end_time', new Date().toISOString());

  console.log('Active Confirmed Bookings:', data);
  if (error) console.error('Error:', error);
}

check();
