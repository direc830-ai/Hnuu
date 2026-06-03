import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wceoieugwqujmdscqmxf.supabase.co';
const supabaseAnonKey = 'sb_publishable_fImf6nwPTJlud59aCf3dpg_KUeTUL_5';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const seats = [
  // Rasa Map
  { seat_id: 'Seat R-10', floor: 'Rasa Map',          wifi: 'Strong',    outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
  { seat_id: 'Seat R-12', floor: 'Rasa Map',          wifi: 'Strong',    outlet: 'Available', noise: 'Noisy', warmth: 'Warm' },
  { seat_id: 'Seat R-15', floor: 'Rasa Map',          wifi: 'Weak',      outlet: 'None',      noise: 'Quiet', warmth: 'Cold' },
  { seat_id: 'Seat R-18', floor: 'Rasa Map',          wifi: 'Strong',    outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
  { seat_id: 'Seat R-20', floor: 'Rasa Map',          wifi: 'Weak',      outlet: 'Available', noise: 'Noisy', warmth: 'Cold' },
  { seat_id: 'Seat R-23', floor: 'Rasa Map',          wifi: 'Strong',    outlet: 'None',      noise: 'Quiet', warmth: 'Warm' },
  // 1st Floor Left
  { seat_id: 'Seat 1L-A1', floor: '1st Floor (Left)', wifi: 'Strong',   outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
  { seat_id: 'Seat 1L-A2', floor: '1st Floor (Left)', wifi: 'Strong',   outlet: 'Available', noise: 'Quiet', warmth: 'Cold' },
  { seat_id: 'Seat 1L-B1', floor: '1st Floor (Left)', wifi: 'Weak',     outlet: 'None',      noise: 'Noisy', warmth: 'Warm' },
  { seat_id: 'Seat 1L-B2', floor: '1st Floor (Left)', wifi: 'Strong',   outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
  { seat_id: 'Seat 1L-C1', floor: '1st Floor (Left)', wifi: 'Weak',     outlet: 'None',      noise: 'Quiet', warmth: 'Cold' },
  // 1st Floor Right
  { seat_id: 'Seat 1R-C1', floor: '1st Floor (Right)', wifi: 'Strong',  outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
  { seat_id: 'Seat 1R-C3', floor: '1st Floor (Right)', wifi: 'Strong',  outlet: 'None',      noise: 'Quiet', warmth: 'Cold' },
  { seat_id: 'Seat 1R-C5', floor: '1st Floor (Right)', wifi: 'Strong',  outlet: 'Available', noise: 'Noisy', warmth: 'Warm' },
  { seat_id: 'Seat 1R-D4', floor: '1st Floor (Right)', wifi: 'Weak',    outlet: 'None',      noise: 'Quiet', warmth: 'Cold' },
  { seat_id: 'Seat 1R-D6', floor: '1st Floor (Right)', wifi: 'Weak',    outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
  // Second Floor
  { seat_id: 'Seat 2-L05', floor: 'Second Floor',     wifi: 'Strong',   outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
  { seat_id: 'Seat 2-L09', floor: 'Second Floor',     wifi: 'Strong',   outlet: 'None',      noise: 'Quiet', warmth: 'Cold' },
  { seat_id: 'Seat 2-L10', floor: 'Second Floor',     wifi: 'Strong',   outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
  { seat_id: 'Seat 2-L12', floor: 'Second Floor',     wifi: 'Strong',   outlet: 'Available', noise: 'Noisy', warmth: 'Warm' },
  { seat_id: 'Seat 2-L14', floor: 'Second Floor',     wifi: 'Weak',     outlet: 'None',      noise: 'Quiet', warmth: 'Cold' },
  // Third Floor
  { seat_id: 'Seat 3-S10', floor: 'Third Floor',      wifi: 'Strong',   outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
  { seat_id: 'Seat 3-S15', floor: 'Third Floor',      wifi: 'Strong',   outlet: 'Available', noise: 'Noisy', warmth: 'Warm' },
  { seat_id: 'Seat 3-S22', floor: 'Third Floor',      wifi: 'Weak',     outlet: 'None',      noise: 'Quiet', warmth: 'Cold' },
  { seat_id: 'Seat 3-S25', floor: 'Third Floor',      wifi: 'Strong',   outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
  { seat_id: 'Seat 3-S30', floor: 'Third Floor',      wifi: 'Weak',     outlet: 'None',      noise: 'Quiet', warmth: 'Cold' },
  { seat_id: 'Seat 3-S35', floor: 'Third Floor',      wifi: 'Strong',   outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
];

async function seed() {
  const { error } = await supabase
    .from('seat_stat')
    .upsert(seats, { onConflict: 'seat_id,floor' });

  if (error) {
    console.error('Seed error:', error);
  } else {
    console.log(`✅ Successfully seeded stats for ${seats.length} seats!`);
  }
}

seed();
