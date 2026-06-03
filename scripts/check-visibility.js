import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wceoieugwqujmdscqmxf.supabase.co';
const supabaseAnonKey = 'sb_publishable_fImf6nwPTJlud59aCf3dpg_KUeTUL_5';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkVisibility() {
  const { data, error } = await supabase
    .from('bookings')
    .select('id, user_id, seat_id, floor, start_time, end_time, status');
    
  if (error) {
    console.error('Error fetching bookings:', error);
  } else {
    console.log('Total bookings visible to anonymous/unauthenticated users:', data.length);
    console.log(data);
  }
}

checkVisibility();
