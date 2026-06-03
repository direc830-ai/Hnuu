import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wceoieugwqujmdscqmxf.supabase.co';
const supabaseAnonKey = 'sb_publishable_fImf6nwPTJlud59aCf3dpg_KUeTUL_5';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAllBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('id, user_id, seat_id, start_time, end_time, status, floor');

  if (error) {
    console.error('Error:', error);
    return;
  }

  // Find overlaps or duplicates
  const groups = {};
  data.forEach(b => {
    (groups[b.seat_id] = groups[b.seat_id] || []).push(b);
  });

  for (const seatId in groups) {
    if (groups[seatId].length > 1) {
      console.log(`\nSeat ${seatId} has ${groups[seatId].length} bookings:`);
      groups[seatId].forEach(b => {
        console.log(`- ${b.id} | User: ${b.user_id} | From: ${b.start_time} To: ${b.end_time}`);
      });
    }
  }
}

checkAllBookings();
