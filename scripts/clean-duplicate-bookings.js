import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wceoieugwqujmdscqmxf.supabase.co';
const supabaseAnonKey = 'sb_publishable_fImf6nwPTJlud59aCf3dpg_KUeTUL_5';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function cleanDuplicates() {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, seat_id, start_time, end_time, status')
    .eq('status', 'confirmed')
    .gt('end_time', new Date().toISOString());

  if (error) {
    console.error('Error fetching bookings:', error);
    return;
  }

  const groups = bookings.reduce((acc, b) => {
    (acc[b.seat_id] = acc[b.seat_id] || []).push(b);
    return acc;
  }, {});

  for (const seatId in groups) {
    if (groups[seatId].length > 1) {
      console.log(`Found ${groups[seatId].length} bookings for seat ${seatId}`);
      const list = groups[seatId].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
      const toDelete = list.slice(1);
      for (const del of toDelete) {
        const { error: delErr } = await supabase.from('bookings').delete().eq('id', del.id);
        if (delErr) console.error(`Failed to delete booking ${del.id}:`, delErr);
        else console.log(`Deleted duplicate booking ${del.id} for seat ${seatId}`);
      }
    }
  }
  console.log('Cleanup finished');
}

cleanDuplicates();
