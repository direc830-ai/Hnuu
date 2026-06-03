import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY/VITE_SUPABASE_PUBLISHABLE_KEY environment variables.');
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const DEFAULT_BOOKING_BALANCE = 10;

export const mapSupabaseUser = (user) => {
  if (!user) return null;

  const metadata = user.user_metadata || {};
  const role = metadata.role || user.app_metadata?.role || 'user';

  return {
    id: user.id,
    name: metadata.full_name || metadata.name || metadata.first_name || user.email?.split('@')?.[0] || 'User',
    email: user.email || '',
    role,
  };
};

export const ensureUserProfile = async (user) => {
  if (!user) return null;
  if (!supabase) throw new Error('Supabase is not configured.');

  const mappedUser = mapSupabaseUser(user);
  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    email: mappedUser.email,
    full_name: mappedUser.name,
  });

  if (error) {
    throw error;
  }

  return mappedUser;
};

export const getUserProfile = async (userId) => {
  if (!userId) return null;
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, balance_credits')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

export const getUserBookings = async (userId, limit = 20) => {
  if (!userId) return [];
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('bookings')
    .select('id, user_id, seat_id, floor, start_time, end_time, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data || [];
};

export const getActiveBookingsByFloor = async (floor) => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('bookings')
    .select('seat_id, status')
    .eq('floor', floor)
    .gt('end_time', new Date().toISOString())
    .eq('status', 'confirmed');
  
  if (error) {
    console.error(error);
    return [];
  }
  return data || [];
};

export const createSeatBooking = async ({ seatId, floor, startTime, endTime, status = 'confirmed' }) => {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  const user = authData.user;
  if (!user) {
    throw new Error('You must be signed in to create a booking.');
  }

  const activeBookings = await getUserBookings(user.id, 1);
  if (activeBookings.length > 0 && activeBookings[0].status === 'confirmed' && new Date(activeBookings[0].end_time) > new Date()) {
    throw new Error('You already have an active reservation. You can only reserve one table at a time.');
  }

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      seat_id: seatId,
      floor,
      start_time: startTime,
      end_time: endTime,
      status,
    })
    .select('id, user_id, seat_id, floor, start_time, end_time, status, created_at')
    .single();

  if (bookingError) {
    throw bookingError;
  }


  return booking;
};

// Default stats seeded for all seats so filters work out of the box
const DEFAULT_SEAT_STATS = {
  // Rasa Map
  'Seat R-10||Rasa Map':   { wifi: 'Strong', outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
  'Seat R-12||Rasa Map':   { wifi: 'Strong', outlet: 'Available', noise: 'Noisy', warmth: 'Warm' },
  'Seat R-15||Rasa Map':   { wifi: 'Weak',   outlet: 'None',      noise: 'Quiet', warmth: 'Cold' },
  'Seat R-18||Rasa Map':   { wifi: 'Strong', outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
  'Seat R-20||Rasa Map':   { wifi: 'Weak',   outlet: 'Available', noise: 'Noisy', warmth: 'Cold' },
  'Seat R-23||Rasa Map':   { wifi: 'Strong', outlet: 'None',      noise: 'Quiet', warmth: 'Warm' },
  // 1st Floor Left
  'Seat 1L-A1||1st Floor (Left)': { wifi: 'Strong', outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
  'Seat 1L-A2||1st Floor (Left)': { wifi: 'Strong', outlet: 'Available', noise: 'Quiet', warmth: 'Cold' },
  'Seat 1L-B1||1st Floor (Left)': { wifi: 'Weak',   outlet: 'None',      noise: 'Noisy', warmth: 'Warm' },
  'Seat 1L-B2||1st Floor (Left)': { wifi: 'Strong', outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
  'Seat 1L-C1||1st Floor (Left)': { wifi: 'Weak',   outlet: 'None',      noise: 'Quiet', warmth: 'Cold' },
  // 1st Floor Right
  'Seat 1R-C1||1st Floor (Right)': { wifi: 'Strong', outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
  'Seat 1R-C3||1st Floor (Right)': { wifi: 'Strong', outlet: 'None',      noise: 'Quiet', warmth: 'Cold' },
  'Seat 1R-C5||1st Floor (Right)': { wifi: 'Strong', outlet: 'Available', noise: 'Noisy', warmth: 'Warm' },
  'Seat 1R-D4||1st Floor (Right)': { wifi: 'Weak',   outlet: 'None',      noise: 'Quiet', warmth: 'Cold' },
  'Seat 1R-D6||1st Floor (Right)': { wifi: 'Weak',   outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
  // Second Floor
  'Seat 2-L05||Second Floor': { wifi: 'Strong', outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
  'Seat 2-L09||Second Floor': { wifi: 'Strong', outlet: 'None',      noise: 'Quiet', warmth: 'Cold' },
  'Seat 2-L10||Second Floor': { wifi: 'Strong', outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
  'Seat 2-L12||Second Floor': { wifi: 'Strong', outlet: 'Available', noise: 'Noisy', warmth: 'Warm' },
  'Seat 2-L14||Second Floor': { wifi: 'Weak',   outlet: 'None',      noise: 'Quiet', warmth: 'Cold' },
  // Third Floor
  'Seat 3-S10||Third Floor': { wifi: 'Strong', outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
  'Seat 3-S15||Third Floor': { wifi: 'Strong', outlet: 'Available', noise: 'Noisy', warmth: 'Warm' },
  'Seat 3-S22||Third Floor': { wifi: 'Weak',   outlet: 'None',      noise: 'Quiet', warmth: 'Cold' },
  'Seat 3-S25||Third Floor': { wifi: 'Strong', outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
  'Seat 3-S30||Third Floor': { wifi: 'Weak',   outlet: 'None',      noise: 'Quiet', warmth: 'Cold' },
  'Seat 3-S35||Third Floor': { wifi: 'Strong', outlet: 'Available', noise: 'Quiet', warmth: 'Warm' },
};

// localStorage key for user-overridden stats
const LS_STATS_KEY = 'unispace_seat_stats';

const loadLocalStats = () => {
  try { return JSON.parse(localStorage.getItem(LS_STATS_KEY)) || {}; } catch { return {}; }
};

const saveLocalStats = (all) => {
  try { localStorage.setItem(LS_STATS_KEY, JSON.stringify(all)); } catch { /* ignore */ }
};

/**
 * Fetch stats for all seats on a given floor.
 * Uses defaults merged with any user overrides stored in localStorage.
 * Also tries to persist to the database in the background if available.
 * @param {string} floor
 */
export const getSeatStats = async (floor) => {
  const local = loadLocalStats();
  const map = {};
  // Merge defaults + local overrides for this floor
  Object.entries(DEFAULT_SEAT_STATS).forEach(([key, def]) => {
    const [seatId, f] = key.split('||');
    if (f !== floor) return;
    map[seatId] = { ...def, ...(local[key] || {}) };
  });
  // Also try fetching from DB and merging (best-effort)
  if (supabase) {
    try {
      const { data } = await supabase
        .from('seat_stat')
        .select('seat_id, wifi, outlet, noise, warmth')
        .eq('floor', floor);
      if (data && data.length > 0) {
        data.forEach(row => {
          map[row.seat_id] = { wifi: row.wifi, outlet: row.outlet, noise: row.noise, warmth: row.warmth };
        });
      }
    } catch { /* table may not exist - fall back to local */ }
  }
  return map;
};

/**
 * Save a stat for a seat. Persists to localStorage immediately,
 * and also tries the database in the background.
 * @param {{seatId:string, floor:string, stat:'wifi'|'outlet'|'noise'|'warmth', value:string}} params
 */
export const upsertSeatStat = async ({ seatId, floor, stat, value }) => {
  // Always save to localStorage first (instant, no DB needed)
  const key = `${seatId}||${floor}`;
  const all = loadLocalStats();
  all[key] = { ...(all[key] || {}), [stat]: value };
  saveLocalStats(all);

  // Try saving to DB in the background (best-effort)
  if (supabase) {
    try {
      await supabase
        .from('seat_stat')
        .upsert({ seat_id: seatId, floor, [stat]: value }, { onConflict: 'seat_id,floor' });
    } catch { /* table may not exist - localStorage already saved it */ }
  }
};
