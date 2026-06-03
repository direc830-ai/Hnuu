/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { 
  School, Search, CheckSquare, Square, User, History, Settings, Building2, LogOut, Bell, ArrowLeft
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { supabase, getUserProfile, getActiveBookingsByFloor, createSeatBooking, getSeatStats, upsertSeatStat } from '../lib/supabase';

const barData = [
  { name: 'Silent Zone', Free: 4, Soon: 7, Occupied: 0 },
  { name: 'Focus Zone', Free: 0, Soon: 5, Occupied: 1 },
  { name: 'Open Zone', Free: 3, Soon: 0, Occupied: 3 },
];

const lineData = [
  { name: '08:00', value: 20 },
  { name: '10:00', value: 45 },
  { name: '12:00', value: 85 },
  { name: '14:00', value: 90 },
  { name: '16:00', value: 70 },
  { name: '18:00', value: 30 },
];

export default function Maps() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifsOn, setNotifsOn] = useState(true);
  const [userName, setUserName] = useState('User Name');
  const [bookingState, setBookingState] = useState({ loading: false, message: '' });
  const [seatStats, setSeatStats] = useState({});
  const [activeStat, setActiveStat] = useState(null);
  const [selectedSeatId, setSelectedSeatId] = useState(null);

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

    const loadUser = async () => {
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
        console.error('Unable to load map profile', error);
      }
    };

    loadUser();
    // Apply dark mode preference
    try {
      const dm = localStorage.getItem('darkMode');
      if (dm === 'true') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch (e) {}

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

  // filters: key = stat key, value = option string or null
  const [filters, setFilters] = useState({ wifi: null, outlet: null, noise: null, warmth: null });
  const toggleFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: prev[key] === value ? null : value }));


  const [selectedMap, setSelectedMap] = useState('rasa');
  const [searchQuery, setSearchQuery] = useState('');

  const [bookedSeats, setBookedSeats] = useState([]);

  const STAT_OPTIONS = {
    wifi:   { label: 'WiFi',    icon: '📶', opts: ['Strong', 'Weak'] },
    outlet: { label: 'Outlet',  icon: '🔌', opts: ['Available', 'None'] },
    noise:  { label: 'Noise',   icon: '🔊', opts: ['Quiet', 'Noisy'] },
    warmth: { label: 'Warmth',  icon: '🌡️', opts: ['Warm', 'Cold'] },
  };

  const maps = {
    rasa: {
      name: 'Rasa Map', url: '/maps/0_floor.png', description: "RASA Club's Local & Ground Floor",
      tables: [
        { id: 'Seat R-10', name: 'Seat R-10', desc: 'Near the entrance, great for quick sessions.', x: '18%', y: '30%' },
        { id: 'Seat R-12', name: 'Seat R-12', desc: 'Central spot, perfect for group discussions.', x: '30%', y: '40%' },
        { id: 'Seat R-15', name: 'Seat R-15', desc: 'Quiet spot near the east wall.', x: '60%', y: '30%' },
        { id: 'Seat R-18', name: 'Seat R-18', desc: 'Corner desk with good lighting.', x: '75%', y: '55%' },
        { id: 'Seat R-20', name: 'Seat R-20', desc: 'Spacious desk for a team.', x: '45%', y: '65%' },
        { id: 'Seat R-23', name: 'Seat R-23', desc: 'By the window, natural light.', x: '25%', y: '72%' },
      ],
    },
    first_left: {
      name: '1st Floor (Left)', url: '/maps/first_left_spots.jpeg', description: '1st Floor Left – Club Spots & Labs',
      tables: [
        { id: 'Seat 1L-A1', name: 'Seat 1L-A1', desc: 'Near the labs, easy power access.', x: '20%', y: '25%' },
        { id: 'Seat 1L-A2', name: 'Seat 1L-A2', desc: 'Side desk by the lab door.', x: '40%', y: '25%' },
        { id: 'Seat 1L-B1', name: 'Seat 1L-B1', desc: 'Open area, good for collaboration.', x: '60%', y: '45%' },
        { id: 'Seat 1L-B2', name: 'Seat 1L-B2', desc: 'Near the window.', x: '75%', y: '60%' },
        { id: 'Seat 1L-C1', name: 'Seat 1L-C1', desc: 'Back row, quieter zone.', x: '30%', y: '70%' },
      ],
    },
    first_right: {
      name: '1st Floor (Right)', url: '/maps/first_right.png', description: '1st Floor Right – Classrooms',
      tables: [
        { id: 'Seat 1R-C1', name: 'Seat 1R-C1', desc: 'Front row classroom desk.', x: '25%', y: '30%' },
        { id: 'Seat 1R-C3', name: 'Seat 1R-C3', desc: 'Quiet spot, great view.', x: '50%', y: '45%' },
        { id: 'Seat 1R-C5', name: 'Seat 1R-C5', desc: 'Centre desk, well-lit.', x: '70%', y: '35%' },
        { id: 'Seat 1R-D4', name: 'Seat 1R-D4', desc: 'Back row desk.', x: '20%', y: '75%' },
        { id: 'Seat 1R-D6', name: 'Seat 1R-D6', desc: 'Corner, quieter.', x: '65%', y: '72%' },
      ],
    },
    second: {
      name: 'Second Floor', url: '/maps/second_floor.png', description: '2nd Floor – Admin & Library',
      tables: [
        { id: 'Seat 2-L05', name: 'Seat 2-L05', desc: 'Library entrance, easy access.', x: '18%', y: '35%' },
        { id: 'Seat 2-L09', name: 'Seat 2-L09', desc: 'Library section, silent study.', x: '35%', y: '50%' },
        { id: 'Seat 2-L10', name: 'Seat 2-L10', desc: 'Library corner, very quiet.', x: '60%', y: '28%' },
        { id: 'Seat 2-L12', name: 'Seat 2-L12', desc: 'Near admin, good wifi.', x: '75%', y: '60%' },
        { id: 'Seat 2-L14', name: 'Seat 2-L14', desc: 'Bright spot by window.', x: '45%', y: '72%' },
      ],
    },
    third: {
      name: 'Third Floor', url: '/maps/third_floor.png', description: '3rd Floor – Study Halls',
      tables: [
        { id: 'Seat 3-S10', name: 'Seat 3-S10', desc: 'Open study hall, lots of space.', x: '20%', y: '28%' },
        { id: 'Seat 3-S15', name: 'Seat 3-S15', desc: 'Near the projector screen.', x: '45%', y: '32%' },
        { id: 'Seat 3-S22', name: 'Seat 3-S22', desc: 'Spacious desk in study hall.', x: '55%', y: '55%' },
        { id: 'Seat 3-S25', name: 'Seat 3-S25', desc: 'Near the stairs, quick exit.', x: '78%', y: '35%' },
        { id: 'Seat 3-S30', name: 'Seat 3-S30', desc: 'Back wall, very quiet.', x: '30%', y: '72%' },
        { id: 'Seat 3-S35', name: 'Seat 3-S35', desc: 'Corner desk, solo study.', x: '70%', y: '70%' },
      ],
    },
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [bookings, stats] = await Promise.all([
          getActiveBookingsByFloor(maps[selectedMap].name),
          getSeatStats(maps[selectedMap].name),
        ]);
        setBookedSeats(bookings.map(b => b.seat_id));
        // Clean up any duplicate active bookings for the same seat (keep first)
        const cleanDuplicates = async () => {
          const dupMap = {};
          bookings.forEach(b => {
            (dupMap[b.seat_id] = dupMap[b.seat_id] || []).push(b);
          });
          for (const seatId in dupMap) {
            if (dupMap[seatId].length > 1) {
              const toDelete = dupMap[seatId].slice(1);
              for (const del of toDelete) {
                await supabase.from('bookings').delete().eq('id', del.id);
              }
            }
          }
        };
        cleanDuplicates();
        setSeatStats(stats);
      } catch (err) { console.error(err); }
    };
    load();
    setSelectedSeatId(maps[selectedMap].tables[0].id);
    setActiveStat(null);

    // Subscribe to realtime booking insertions so it updates instantly for other users
    const channel = supabase?.channel(`public:bookings-${selectedMap}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
          filter: `floor=eq.${maps[selectedMap].name}`
        },
        (payload) => {
          if (payload.new && payload.new.status === 'confirmed') {
            setBookedSeats((prev) => [...prev, payload.new.seat_id]);
          }
        }
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [selectedMap]);

  const selectedSeat = maps[selectedMap].tables.find(t => t.id === selectedSeatId) || maps[selectedMap].tables[0];
  const isSeatBooked = bookedSeats.includes(selectedSeat.id);

  // derive visible tables based on active filters and search query
  const filteredTables = maps[selectedMap]?.tables.filter(t => {
    const stats = seatStats[t.id] || {};
    const matchesStats = Object.entries(filters).every(([k, v]) => !v || stats[k] === v);
    const matchesSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStats && matchesSearch;
  }) ?? [];
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

      <div className="relative z-10 flex flex-1 w-full max-w-[1400px] mx-auto gap-8 lg:px-8 px-4 pb-8 overflow-hidden h-0">
        
        {/* Left Sidebar - Stat Filters */}
        <aside className="w-[180px] flex flex-col text-white shrink-0 hidden lg:flex mt-4">
          <div className="mb-8">
            <h3 className="text-[13px] tracking-widest uppercase font-bold text-white/90 mb-2 drop-shadow-sm leading-relaxed">Find Your<br/>Seat</h3>
          </div>
          <h3 className="text-[13px] tracking-widest uppercase font-bold text-white/90 mb-4 drop-shadow-sm">Filter by Stats</h3>
          <div className="space-y-5">
            {Object.entries(STAT_OPTIONS).map(([key, cfg]) => (
              <div key={key}>
                <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest mb-2">{cfg.icon} {cfg.label}</p>
                <div className="flex flex-col gap-1.5">
                  {cfg.opts.map(opt => (
                    <button
                      key={opt}
                      onClick={() => toggleFilter(key, opt)}
                      className={`text-left text-[12px] font-semibold px-3 py-1.5 rounded-full transition-all ${
                        filters[key] === opt
                          ? 'bg-white text-blue-700 shadow-md'
                          : 'bg-white/15 text-white hover:bg-white/25'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Glass Panel */}
        <div className="flex-1 bg-white/20 backdrop-blur-xl rounded-[2rem] border border-white/30 flex overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)] uni-glass">
          
          {/* Center Content (Map + Charts) */}
          <main className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto w-full">
            
            {/* Map Card */}
            <div className="bg-white rounded-[1.5rem] p-4 lg:p-6 shadow-md flex flex-col min-h-[500px]">
              
              {/* Search Toolbar */}
              <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full lg:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="search for locals or spaces ..." 
                    className="w-full border border-slate-200 rounded-full py-2.5 pl-11 pr-4 text-xs lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-600 placeholder:text-slate-400"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button 
                    onClick={() => setSelectedMap('rasa')}
                    className={`px-3 lg:px-4 py-1.5 rounded-full text-[10px] font-semibold transition-all ${selectedMap === 'rasa' ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100'}`}
                  >
                    Rasa
                  </button>
                  <button 
                    onClick={() => setSelectedMap('first_left')}
                    className={`px-3 lg:px-4 py-1.5 rounded-full text-[10px] font-semibold transition-all ${selectedMap === 'first_left' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    1st Floor (L)
                  </button>
                  <button 
                    onClick={() => setSelectedMap('first_right')}
                    className={`px-3 lg:px-4 py-1.5 rounded-full text-[10px] font-semibold transition-all ${selectedMap === 'first_right' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    1st Floor (R)
                  </button>
                  <button 
                    onClick={() => setSelectedMap('second')}
                    className={`px-3 lg:px-4 py-1.5 rounded-full text-[10px] font-semibold transition-all ${selectedMap === 'second' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    2nd Floor
                  </button>
                  <button 
                    onClick={() => setSelectedMap('third')}
                    className={`px-3 lg:px-4 py-1.5 rounded-full text-[10px] font-semibold transition-all ${selectedMap === 'third' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    3rd Floor
                  </button>
                </div>
              </div>

              {/* Map Canvas */}
              <div className="flex-1 bg-[#F8FAFC] rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border border-slate-100 min-h-[350px]">
                  <img 
                    src={maps[selectedMap].url} 
                    alt={maps[selectedMap].name}
                    className="max-w-full max-h-full object-contain p-4 drop-shadow-xl animate-in fade-in zoom-in duration-500"
                  />
                  
                  {filteredTables.map((table) => {
                    const isBooked = bookedSeats.includes(table.id);
                    const isSelected = selectedSeatId === table.id;
                    return (
                      <div
                        key={table.id}
                        onClick={() => setSelectedSeatId(table.id)}
                        className={`absolute w-4 h-4 md:w-5 md:h-5 rounded-full cursor-pointer transition-transform transform hover:scale-125 flex items-center justify-center shadow-md ${isBooked ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} ${isSelected ? 'ring-4 ring-blue-400' : ''}`}
                        style={{ top: table.y, left: table.x }}
                        title={`${table.name} - ${isBooked ? 'Reserved' : 'Available'}`}
                      >
                         <span className="text-[8px] md:text-[10px] font-bold text-white shadow-sm">{table.id.split('-')[1] || table.id}</span>
                      </div>
                    );
                  })}

                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur shadow-sm rounded-full px-4 py-2 text-[11px] font-bold text-slate-700 flex items-center gap-3 z-20 border border-slate-200">
                    <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> Available</span>
                    <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Reserved</span>
                  </div>

                  <div className="absolute bottom-0 right-0 bg-blue-600 shadow-xl rounded-tl-2xl px-6 py-3 text-[13px] font-bold text-white z-20">
                    {maps[selectedMap].description}
                  </div>
              </div>

            </div>

            {/* Charts Section */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4 drop-shadow-sm ml-1">Historical Usage Patterns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
                 
                 {/* Bar Chart */}
                 <div className="bg-white rounded-2xl p-4 shadow-md flex flex-col h-[180px]">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                          <span className="text-[10px] bg-slate-100 p-1 rounded">📊</span> Session Analysis
                       </span>
                       <div className="flex gap-2 text-[9px] font-bold text-slate-600 uppercase tracking-wide">
                         <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-[2px]" /> Free</span>
                         <span className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-400 rounded-[2px]" /> Soon</span>
                         <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-[2px]" /> Occupied</span>
                       </div>
                    </div>
                    <div className="flex-1 -ml-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={10}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 700 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} />
                          <Bar dataKey="Free" fill="#22c55e" radius={[2, 2, 0, 0]} />
                          <Bar dataKey="Soon" fill="#fb923c" radius={[2, 2, 0, 0]} />
                          <Bar dataKey="Occupied" fill="#ef4444" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                 </div>

                 {/* Line Chart */}
                 <div className="bg-white rounded-2xl p-4 shadow-md flex flex-col h-[180px]">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                          <span className="text-[10px] bg-slate-100 p-1 rounded">🕒</span> Hourly Occupancy Trend
                       </span>
                    </div>
                    <div className="flex-1 -ml-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 700 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} />
                          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                 </div>

              </div>
              
              <div className="text-center text-[10px] font-semibold text-slate-300 pt-2 opacity-80 mix-blend-overlay">
                 @2026 UniSpace, All rights reserved
              </div>
            </div>

          </main>

          {/* Right Panel */}
          <aside className="w-[280px] bg-[#B0C4DE] border-l border-white/20 flex flex-col shrink-0 uni-right-panel">
             <div className="p-5 pb-0 mt-2 flex flex-col gap-3">
                <div className="w-full h-28 rounded-xl overflow-hidden shadow-sm">
                  <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600" alt="Seat View" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-xl font-bold text-[#354868]">{selectedSeat.name}</h2>
                <p className="text-[12px] font-semibold text-[#48638C] leading-relaxed">{selectedSeat.desc}</p>

                {/* Stat rows */}
                <div className="flex flex-col gap-3 mt-1">
                  {Object.entries(STAT_OPTIONS).map(([key, cfg]) => {
                    const current = seatStats[selectedSeat.id]?.[key] || 'unknown';
                    const isExpanded = activeStat === key;
                    return (
                      <div key={key} className="bg-white/50 rounded-xl p-2.5">
                        <button
                          onClick={() => setActiveStat(isExpanded ? null : key)}
                          className="w-full flex items-center justify-between gap-2"
                        >
                          <span className="flex items-center gap-2 text-[#354868] font-bold text-[13px]">
                            <span className="text-base">{cfg.icon}</span> {cfg.label}
                          </span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            current === 'unknown' ? 'bg-slate-200 text-slate-500'
                            : cfg.opts[0] === current ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                          }`}>{current === 'unknown' ? '?' : current}</span>
                        </button>
                        {isExpanded && (
                          <div className="flex gap-2 mt-2">
                            {cfg.opts.map(opt => (
                              <button
                                key={opt}
                                onClick={async () => {
                                  const next = { ...seatStats, [selectedSeat.id]: { ...(seatStats[selectedSeat.id] || {}), [key]: opt } };
                                  setSeatStats(next);
                                  setActiveStat(null);
                                  await upsertSeatStat({ seatId: selectedSeat.id, floor: maps[selectedMap].name, stat: key, value: opt });
                                }}
                                className={`flex-1 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                                  current === opt
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                                }`}
                              >{opt}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
             </div>

             <div className="mt-auto p-5 text-center">
                <button
                  onClick={async () => {
                    setBookingState({ loading: true, message: '' });
                    try {
                      const existing = await supabase
                      .from('bookings')
                      .select('id')
                      .eq('seat_id', selectedSeat.id)
                      .eq('status', 'confirmed')
                      .gt('end_time', new Date().toISOString());
                    if (existing.data && existing.data.length > 0) {
                      throw new Error('Seat already reserved by another user.');
                    }
                    const booking = await createSeatBooking({
                        seatId: selectedSeat.id,
                        floor: maps[selectedMap].name,
                        startTime: new Date().toISOString(),
                        endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
                      });
                      setBookingState({ loading: false, message: `✅ Booked ${booking.seat_id} successfully!` });
                      setBookedSeats((prev) => [...prev, selectedSeat.id]);
                    } catch (error) {
                      setBookingState({ loading: false, message: error.message || 'Unable to create booking.' });
                    }
                  }}
                  disabled={bookingState.loading || isSeatBooked}
                  className={`w-full py-3.5 font-bold flex items-center justify-center rounded-[12px] text-[13px] tracking-wide transition-all shadow-sm ${isSeatBooked ? 'bg-red-100 text-red-600 cursor-not-allowed' : 'bg-[#D5F5EC] hover:bg-[#AEEBDB] disabled:opacity-60 text-[#2F7E6B]'}`}
                >
                   {bookingState.loading ? 'Booking...' : isSeatBooked ? 'Reserved by others' : `Reserve ${selectedSeat.name}`}
                </button>
                <button 
                  onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSeTNgvu_0stHw2TEdul-0D60YP8u86t7RvwRaEPNqKq549k2g/viewform?usp=publish-editor', '_blank', 'noopener,noreferrer')}
                  className="w-full mt-3 py-3.5 bg-white/70 hover:bg-white text-[#2F7E6B] font-bold flex items-center justify-center rounded-[12px] text-[13px] tracking-wide transition-all shadow-sm"
                >
                   Report An Issue
                </button>
                {bookingState.message ? <p className="text-[11px] font-semibold text-[#354868] mt-3">{bookingState.message}</p> : null}
             </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

function FilterItem({ label, checked, onClick }) {
  return (
    <div className="flex items-center gap-3 cursor-pointer group" onClick={onClick}>
       <div className="text-white drop-shadow-sm">
          {checked ? <CheckSquare className="w-5 h-5 text-white stroke-[2]" /> : <Square className="w-5 h-5 text-white stroke-[2]" />}
       </div>
       <span className="text-[13px] font-bold tracking-wide text-white group-hover:text-amber-100 drop-shadow-sm transition-all select-none">
          {label}
       </span>
    </div>
  );
}