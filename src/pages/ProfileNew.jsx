import { useState, useEffect } from 'react';
import { 
  School, ArrowLeft, User, Mail, 
  Clock, Camera, Bell, History, Settings, Building2, LogOut 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase, getUserProfile, getUserBookings } from '../lib/supabase';

export default function Profile() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifsOn, setNotifsOn] = useState(true);
  const [userName, setUserName] = useState('User Name');
  const [userEmail, setUserEmail] = useState('username@estin.dz');
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    let isActive = true;

    try {
      const stored = localStorage.getItem('notifsOn');
      if (stored !== null) setNotifsOn(JSON.parse(stored));
    } catch (error) {
      console.error('Unable to load notification preference', error);
    }
    // Apply dark mode preference
    try {
      const dm = localStorage.getItem('darkMode');
      if (dm === 'true') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch (e) {}

    const loadProfile = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user || !isActive) return;

      try {
        const profile = await getUserProfile(user.id);
        if (isActive) {
          setUserName(profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')?.[0] || 'User');
          setUserEmail(profile?.email || user.email || 'username@estin.dz');
        }
      } catch (error) {
        console.error('Unable to load profile data', error);
      }

      try {
        const bookings = await getUserBookings(user.id, 2);
        if (isActive) {
          setRecentBookings(bookings);
        }
      } catch (error) {
        console.error('Unable to load recent bookings', error);
      }
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, []);

  const toggleNotifs = () => {
    const next = !notifsOn;
    setNotifsOn(next);
    try { localStorage.setItem('notifsOn', JSON.stringify(next)); } catch (error) {
      console.error('Unable to persist notification preference', error);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/background%202.png')] bg-cover bg-center bg-no-repeat relative font-sans flex flex-col">
      <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-[2px] z-0 uni-overlay" />

      {/* Top Navbar */}
      <header className="relative z-20 flex items-center justify-between px-8 py-6 w-full max-w-[1400px] mx-auto">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/') }>
            <School className="w-10 h-10 text-white drop-shadow-md" />
            <span className="text-3xl font-bold tracking-wide text-white drop-shadow-md">UniSpace</span>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors bg-white/10 px-4 py-2 rounded-full border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
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

      <main className="relative z-10 flex-1 flex flex-col items-center justify-start px-8 w-full max-w-[1000px] mx-auto pt-8 pb-12">
        <div className="w-full bg-[#F8FAFC]/95 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/40 uni-card">
          
          {/* Header Banner */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
            <div className="absolute -bottom-16 left-12 w-32 h-32 rounded-full border-4 border-[#F8FAFC] bg-white flex items-center justify-center overflow-hidden shadow-lg group cursor-pointer">
              <User className="w-16 h-16 text-slate-300 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Change Pic</span>
              </div>
            </div>
            <div className="absolute bottom-4 right-6 text-white text-right">
              <p className="text-sm font-bold tracking-wider opacity-90">Member since 2024</p>
            </div>
          </div>

          <div className="pt-20 px-12 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-10">
              <div>
                <h1 className="text-4xl font-bold text-[#1E293B] mb-2">{userName}</h1>
                <p className="text-lg text-[#64748B] font-medium flex items-center gap-2">
                  <Mail className="w-5 h-5" /> {userEmail}
                </p>
              </div>
             
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
             
              
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#1E293B] mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-500" /> Recent Activity Highlights
              </h2>
              <div className="bg-white rounded-2xl border border-slate-100 p-2 shadow-sm">
                {(recentBookings.length > 0 ? recentBookings : [
                  { seat_id: '12-B04', floor: 'Quiet Zone', created_at: new Date().toISOString(), status: 'confirmed' },
                  { seat_id: 'A1', floor: 'Group Room', created_at: new Date().toISOString(), status: 'confirmed' },
                ]).map((booking) => (
                  <div key={`${booking.seat_id}-${booking.created_at}`} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <School className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-[#334155]">Booked Seat {booking.seat_id} in {booking.floor}</p>
                        <p className="text-sm text-slate-500">{new Date(booking.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">{booking.status}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
