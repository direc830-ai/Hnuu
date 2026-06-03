import { useState, useEffect } from 'react';
import { 
  School, Bell, User, History, Settings, 
  LogOut, Building2, Clock, Star, Armchair
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase, getUserProfile, getUserBookings } from '../lib/supabase';

export default function Dashboard() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifsOn, setNotifsOn] = useState(true);
  const [userName, setUserName] = useState('User Name');
  const [latestBooking, setLatestBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;

    try {
      const stored = localStorage.getItem('notifsOn');
      if (stored !== null) setNotifsOn(JSON.parse(stored));
    } catch (error) {
      console.error('Unable to load notification preference', error);
    }
    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser?.name) setUserName(savedUser.name);
    } catch (error) {
      console.error('Unable to load saved user', error);
    }
    // Apply dark mode preference
    try {
      const dm = localStorage.getItem('darkMode');
      if (dm === 'true') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch (e) {}

    const loadBookingState = async () => {
      if (!supabase) return;
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user || !isActive) return;

      try {
        const profile = await getUserProfile(user.id);
        if (isActive) {
          setUserName(profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')?.[0] || 'User');
        }
      } catch (error) {
        console.error('Unable to load profile', error);
      }

      try {
        const bookings = await getUserBookings(user.id, 1);
        if (isActive) {
          setLatestBooking(bookings[0] || null);
        }
      } catch (error) {
        console.error('Unable to load latest booking', error);
      }
    };

    loadBookingState();

    return () => {
      isActive = false;
    };
  }, []);

  const toggleNotifs = () => {
    const next = !notifsOn;
    setNotifsOn(next);
    try {
      localStorage.setItem('notifsOn', JSON.stringify(next));
    } catch (error) {
      console.error('Unable to persist notification preference', error);
    }
  };

  const bookingSeat = latestBooking?.seat_id || 'Seat 12-B04';
  const bookingFloor = latestBooking?.floor || 'Rasa floor - Right side';
  const bookingTime = latestBooking?.start_time && latestBooking?.end_time
    ? `${new Date(latestBooking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(latestBooking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : '12:00 - 13:00';

  return (
    <div className="min-h-screen bg-[url('/background2.png')] bg-cover bg-center bg-no-repeat relative font-sans flex flex-col">
      {/* Overlay to match the blue hue from the design */}
      <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-[2px] z-0 uni-overlay" />

      {/* Top Navbar */}
      <header className="relative z-20 flex items-center justify-between px-8 py-6 w-full max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3">
          <School className="w-10 h-10 text-white drop-shadow-md" />
          <span className="text-3xl font-bold tracking-wide text-white drop-shadow-md">UniSpace</span>
        </div>

        <div className="flex items-center gap-6 relative">
          <button
            onClick={toggleNotifs}
            className={`p-2 rounded-full transition-colors ${notifsOn ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-300'}`}
            title={notifsOn ? 'Notifications on' : 'Notifications off'}
          >
            <Bell className="w-6 h-6 drop-shadow-md" />
          </button>
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
            <span className="text-white font-medium text-lg drop-shadow-md">{userName}</span>
            <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center text-white bg-white/10 backdrop-blur-sm">
              <User className="w-6 h-6" />
            </div>
          </div>

          {showDropdown && (
            <div className="absolute top-[3.5rem] right-0 w-[240px] bg-[#F8FAFC] rounded-2xl shadow-2xl py-4 z-50 overflow-hidden transform origin-top-right transition-all">
              <button onClick={() => { setShowDropdown(false); navigate('/profile'); }} className="w-full text-left px-6 py-3 flex items-center gap-4 text-[#4B6185] hover:bg-slate-100 transition-colors font-semibold">
                <User className="w-5 h-5 opacity-70" /> Profile
              </button>
              <button onClick={() => { setShowDropdown(false); navigate('/history'); }} className="w-full text-left px-6 py-3 flex items-center gap-4 text-[#4B6185] hover:bg-slate-100 transition-colors font-semibold">
                <History className="w-5 h-5 opacity-70" /> My History
              </button>
              <button onClick={() => { setShowDropdown(false); navigate('/settings'); }} className="w-full text-left px-6 py-3 flex items-center gap-4 text-[#4B6185] hover:bg-slate-100 transition-colors font-semibold">
                <Settings className="w-5 h-5 opacity-70" /> Settings
              </button>
              <button onClick={() => { setShowDropdown(false); navigate('/interactive-maps'); }} className="w-full text-left px-6 py-3 flex items-center gap-4 text-[#4B6185] hover:bg-slate-100 transition-colors font-semibold">
                <Building2 className="w-5 h-5 opacity-70" /> Interactive Maps
              </button>
              <div className="h-px bg-slate-200 my-2 mx-4"></div>
              <button onClick={() => { supabase.auth.signOut().finally(() => { try { localStorage.removeItem('user'); } catch (error) { console.error('Unable to clear saved user', error); } setShowDropdown(false); navigate('/'); }); }} className="w-full text-left px-6 py-3 flex items-center gap-4 text-red-500 hover:bg-red-50 transition-colors font-bold tracking-wider text-sm">
                <LogOut className="w-5 h-5" /> LOGOUT
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-8 w-full max-w-[1400px] mx-auto pt-4 pb-8">
        
        {/* Welcome Text */}
        <div className="mb-10">
          <h1 className="text-5xl lg:text-6xl font-bold text-white drop-shadow-lg leading-tight">
            Welcome Back<br />{userName}
          </h1>
        </div>

        {/* Booking Card */}
        {latestBooking ? (
          <div className="bg-[#EAEFF5]/95 backdrop-blur-md rounded-[2rem] p-6 lg:w-[580px] shadow-2xl flex flex-col sm:flex-row gap-6 items-stretch border border-white/40 uni-card">
            <div className="flex-1 flex flex-col pr-4">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-[10px] font-bold tracking-widest text-[#2ED3A8] uppercase">Confirmed</span>
              </div>
              <h2 className="text-[2.5rem] font-bold text-[#3B4D68] leading-none mb-3">{latestBooking.seat_id}</h2>
              <p className="text-[#6C84A3] font-medium text-sm mb-8">{latestBooking.floor}...</p>
              
              <div className="flex gap-10 mt-auto">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-[#86A0C8] uppercase block mb-1">Time</span>
                  <span className="text-[13px] font-bold text-[#4B6185]">{bookingTime}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-[#86A0C8] uppercase block mb-1">Status</span>
                  <span className="text-[13px] font-bold text-[#4B6185]">{latestBooking.status || 'confirmed'}</span>
                </div>
              </div>
            </div>
            
            <div className="w-[240px] shrink-0 relative rounded-2xl overflow-hidden shadow-inner hidden sm:block">
              <img 
                src="https://images.unsplash.com/photo-1544365558-35aa4afcf11f?auto=format&fit=crop&q=80&w=600" 
                alt="Room view" 
                className="w-full h-full object-cover blur-[2px] opacity-90 scale-105"
              />
              <div className="absolute inset-x-0 bottom-4 flex justify-center">
                <button 
                  onClick={() => navigate('/interactive-maps')}
                  className="bg-[#6FA8FF] text-white font-bold py-2.5 px-6 rounded-full shadow-lg text-sm tracking-wide transition-all border border-white/20 whitespace-nowrap hover:bg-blue-500 active:scale-95">
                  View Direction
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#EAEFF5]/95 backdrop-blur-md rounded-[2rem] p-6 lg:w-[580px] shadow-2xl flex flex-col justify-center items-center border border-white/40 h-[200px]">
            <p className="text-[#3B4D68] font-medium text-lg">You don't have any bookings right now.</p>
            <button onClick={() => navigate('/interactive-maps')} className="mt-4 bg-[#6FA8FF] text-white font-bold py-2.5 px-6 rounded-full shadow-lg text-sm transition-all border border-white/20">
              Book a Seat
            </button>
          </div>
        )}

      </main>

      {/* Bottom Cards & Footer Area */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 mt-auto flex flex-col pb-4">
        
        {/* Four Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20 lg:mb-28">
          
          <div className="bg-white rounded-[1.25rem] p-4 flex items-center gap-4 shadow-xl border border-white/40 h-[88px]">
            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-blue-500" strokeWidth={2} />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[10px] font-bold tracking-wide text-slate-500 mb-0.5">Library Capacity</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-[#1e293b]">64 %</span>
                <span className="text-[9px] font-bold text-[#10b981] tracking-wide uppercase">Moderate</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[1.25rem] p-4 flex items-center gap-4 shadow-xl border border-white/40 h-[88px]">
            <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <Armchair className="w-6 h-6 text-emerald-500" strokeWidth={2} />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[10px] font-bold tracking-wide text-slate-500 mb-0.5">Quiet Zones Available</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-[#1e293b]">10</span>
                <span className="text-[9px] font-bold text-slate-400 tracking-wide uppercase">Locations</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[1.25rem] p-4 flex items-center gap-4 shadow-xl border border-white/40 h-[88px]">
            <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-amber-500" strokeWidth={2} />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[10px] font-bold tracking-wide text-slate-500 mb-0.5">Peak Time Warning</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-[#1e293b]">14:00</span>
                <span className="text-[9px] font-bold text-[#f59e0b] tracking-wide uppercase">Expected Surge</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[1.25rem] p-4 flex items-center gap-4 shadow-xl border border-white/40 h-[88px]">
            <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 text-purple-500" strokeWidth={2} />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[10px] font-bold tracking-wide text-slate-500 mb-0.5">Usability Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-[#1e293b]">78 %</span>
                <span className="text-[9px] font-bold text-[#8b5cf6] tracking-wide uppercase">Good conditions</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="grid grid-cols-2 md:grid-cols-4 gap-6 text-[#A8C7FA]/90 font-medium text-[12px] tracking-wide relative">
          <div className="flex flex-col gap-1.5">
            <a href="#!" className="hover:text-white transition-colors">FEEDBACK</a>
            <a href="#!" className="hover:text-white transition-colors">REPORT AN ISSUE</a>
          </div>
          <div className="flex flex-col gap-1.5">
            <a href="#!" className="hover:text-white transition-colors">HELP CENTER</a>
            <a href="#!" className="hover:text-white transition-colors">FAQs</a>
          </div>
          <div className="flex flex-col gap-1.5">
            <a href="#!" className="hover:text-white transition-colors">LEGAL</a>
            <a href="#!" className="hover:text-white transition-colors">TERMS | PRIVACY POLICY</a>
          </div>
          <div className="flex flex-col gap-1.5 md:items-end">
            <span className="hover:text-white transition-colors cursor-pointer">CONNECT</span>
          </div>
        </footer>
        <div className="text-center text-[10px] font-medium text-[#A8C7FA]/60 mt-4 mix-blend-screen">
          @2026 UniSpace. All rights reserved.
        </div>
      </div>

    </div>
  );
}
