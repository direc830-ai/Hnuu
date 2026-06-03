import { useState, useEffect } from 'react';
import { 
  School, Search, ChevronLeft, ChevronRight, CheckCircle2, 
  AlertTriangle, User, History as HistoryIcon, Settings, Building2, LogOut, Bell, ArrowLeft, Trash2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase, getUserProfile, getUserBookings } from '../lib/supabase';

/**
 * @typedef {Object} ReservationItem
 * @property {string} id
 * @property {string} floor
 * @property {string} date
 * @property {string} status
 * @property {string} startTime
 * @property {string} endTime
 * @property {string} createdAt
 */

export default function History() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifsOn, setNotifsOn] = useState(true);
  const [userName, setUserName] = useState('User Name');
  /** @type {Array<ReservationItem>} */
  const initialReservations = [];
  const [reservations, setReservations] = useState(initialReservations);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  /** @param {Date} leftDate @param {Date} rightDate */
  const sameDay = (leftDate, rightDate) =>
    leftDate.getFullYear() === rightDate.getFullYear() &&
    leftDate.getMonth() === rightDate.getMonth() &&
    leftDate.getDate() === rightDate.getDate();

  /** @param {Date} date @param {Date} referenceDate */
  const withinLast7Days = (date, referenceDate) => {
    const differenceMs = referenceDate.getTime() - date.getTime();
    return differenceMs >= 0 && differenceMs <= 7 * 24 * 60 * 60 * 1000;
  };

  /** @param {string} startTime @param {string} endTime */
  const formatDateTime = (startTime, endTime) => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    return `${startDate.toLocaleDateString()}\n${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  /** @param {string | null | undefined} status */
  const normalizeStatus = (status) => {
    const value = (status || 'confirmed').toLowerCase();
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  useEffect(() => {
    let isActive = true;

    try {
      const stored = localStorage.getItem('notifsOn');
      if (stored !== null) setNotifsOn(JSON.parse(stored));
    } catch (error) {
      console.error('Unable to load notification preference', error);
    }

    const loadHistory = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user || !isActive) {
        if (isActive) setLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile(user.id);
        if (isActive) {
          setUserName(profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')?.[0] || 'User');
        }
      } catch (error) {
        console.error('Unable to load profile name', error);
      }

      try {
        const bookings = await getUserBookings(user.id, 50);
        if (isActive) {
          setReservations(bookings.map((booking) => ({
            bookingId: booking.id,
            id: booking.seat_id,
            floor: booking.floor,
            startTime: booking.start_time,
            endTime: booking.end_time,
            createdAt: booking.created_at,
            date: formatDateTime(booking.start_time, booking.end_time),
            status: normalizeStatus(booking.status),
          })));
        }
      } catch (error) {
        console.error('Unable to load booking history', error);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadHistory();

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

  const handleLogout = () => {
    if (!supabase) {
      setShowDropdown(false);
      navigate('/');
      return;
    }

    supabase.auth.signOut().finally(() => {
      try { localStorage.removeItem('user'); } catch (error) { console.error('Unable to clear saved user', error); }
      setShowDropdown(false);
      navigate('/');
    });
  };

  const handleDelete = async (bookingId) => {
    if (isDeleting || !supabase) return;
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
      if (error) throw error;
      setReservations(prev => prev.filter(r => r.bookingId !== bookingId));
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Unable to delete reservation.');
    } finally {
      setIsDeleting(false);
    }
  };

  const reservationsToShow = reservations.filter((reservation) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || [reservation.id, reservation.floor, reservation.status].join(' ').toLowerCase().includes(query);

    if (!matchesSearch) return false;

    const startDate = new Date(reservation.startTime);
    const today = new Date();

    if (timeFilter === 'today') {
      return sameDay(startDate, today);
    }

    if (timeFilter === 'week') {
      return withinLast7Days(startDate, today);
    }

    return true;
  });

  /** @param {string} status */
  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-[#dcfce7] text-[#166534]'; // Emerald 100/800
      case 'Cancelled': return 'bg-[#fca5a5] text-[#991b1b]'; // Red 300/800
      case 'Expired': return 'bg-[#e5e7eb] text-[#374151]'; // Gray 200/700
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalHours = Math.round(
    reservationsToShow.reduce((acc, res) => {
      const start = new Date(res.startTime);
      const end = new Date(res.endTime);
      const diffMs = end.getTime() - start.getTime();
      return acc + Math.max(0, diffMs / (1000 * 60 * 60));
    }, 0)
  );

  return (
    <div className="min-h-screen bg-[url('/background%202.png')] bg-cover bg-center bg-no-repeat relative font-sans flex flex-col">
      <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-[2px] z-0" />

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
                <HistoryIcon className="w-5 h-5 opacity-70" /> My History
              </button>
              <button onClick={() => { setShowDropdown(false); navigate('/settings'); }} className="w-full text-left px-6 py-3 flex items-center gap-4 text-[#4B6185] hover:bg-slate-100 transition-colors font-semibold">
                <Settings className="w-5 h-5 opacity-70" /> Settings
              </button>
              <button onClick={() => { setShowDropdown(false); navigate('/interactive-maps'); }} className="w-full text-left px-6 py-3 flex items-center gap-4 text-[#4B6185] hover:bg-slate-100 transition-colors font-semibold">
                <Building2 className="w-5 h-5 opacity-70" /> Interactive Maps
              </button>
              <div className="h-px bg-slate-200 my-2 mx-4"></div>
              <button onClick={handleLogout} className="w-full text-left px-6 py-3 flex items-center gap-4 text-red-500 hover:bg-red-50 transition-colors font-bold tracking-wider text-sm">
                <LogOut className="w-5 h-5" /> LOGOUT
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Container - ensuring it sits above the background overlay */}
      <div className="relative z-10 flex flex-col h-full flex-1 px-6 md:px-8 pb-6 md:pb-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">My History</h1>
          <p className="text-white/90 text-lg">Review and manage your past<br/>workspace reservations.</p>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 w-full max-w-[1200px] mx-auto">
          {/* Filters */}
          

          {/* Search */}
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-4 items-center pointer-events-none hidden">
              <Search className="h-4 w-4 text-slate-500" />
            </div>
            <input 
              type="text" 
              placeholder="Search by Seat-ID, Floor ...."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full bg-white/40 backdrop-blur-md border border-white/20 rounded-full py-2.5 px-6 text-sm font-bold text-slate-800 placeholder:text-slate-800/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
            />
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1200px] mx-auto flex-1">
          
          {/* Left Column - Table */}
          <div className="flex-1 bg-white/50 backdrop-blur-md rounded-2xl border border-white/30 overflow-hidden flex flex-col shadow-lg">
            
            {/* Table Header */}
            <div className="grid grid-cols-4 bg-white/40 px-6 py-4 border-b border-white/30">
              <div className="text-sm font-bold text-slate-800">Seat-ID</div>
              <div className="text-sm font-bold text-slate-800">Floor</div>
              <div className="text-sm font-bold text-slate-800">Date & Time</div>
              <div className="text-sm font-bold text-slate-800">Status</div>
            </div>

            {/* Table Body */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-6 text-slate-700 font-semibold">Loading booking history...</div>
              ) : reservationsToShow.length === 0 ? (
                <div className="p-6 text-slate-700 font-semibold">No reservations match the current filter.</div>
              ) : reservationsToShow.map((res, index) => (
                <div 
                  key={`${res.id}-${res.createdAt}`} 
                  className={`grid grid-cols-4 px-6 py-4 items-center ${index !== reservationsToShow.length - 1 ? 'border-b border-white/20' : ''} hover:bg-white/10 transition-colors`}
                >
                  <div className="text-base font-bold text-slate-800">{res.id}</div>
                  <div className="text-sm font-medium text-slate-800 whitespace-pre-line leading-tight">{res.floor}</div>
                  <div className="text-sm font-medium text-slate-800 whitespace-pre-line leading-tight">{res.date}</div>
                  <div className="flex items-center justify-between pr-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusColor(res.status)}`}>
                      {res.status}
                    </span>
                    {(() => {
                      const hoursSinceStart = (new Date().getTime() - new Date(res.startTime).getTime()) / (1000 * 60 * 60);
                      // Temporary bypass to allow deleting the two false reservations
                      const isFalseReservation = res.id === 'Seat 1L-A1' || res.id === 'Seat 1R-C3';
                      const canDelete = isFalseReservation || hoursSinceStart >= 10;
                      return (
                        <button 
                          onClick={() => handleDelete(res.bookingId)}
                          disabled={isDeleting || !canDelete}
                          className="p-1.5 px-3 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-2 shadow-sm"
                          title={!canDelete ? `Can be deleted in ${Math.ceil(10 - hoursSinceStart)} hours` : "Delete Reservation"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>

            {/* Table Footer / Pagination */}
            <div className="px-6 py-4 border-t border-white/30 flex items-center justify-between bg-black/5 mt-auto">
              <span className="text-xs font-semibold text-slate-100">Showing {reservationsToShow.length} reservations</span>
              
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded bg-white/30 hover:bg-white/50 text-white flex items-center justify-center transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded bg-white/30 hover:bg-white/50 text-white flex items-center justify-center font-bold text-sm transition-colors">1</button>
                <button className="w-8 h-8 rounded bg-white/30 hover:bg-white/50 text-white flex items-center justify-center font-bold text-sm transition-colors">2</button>
                <button className="w-8 h-8 rounded bg-white/30 hover:bg-white/50 text-white flex items-center justify-center font-bold text-sm transition-colors">3</button>
                <button className="w-8 h-8 rounded bg-white/30 hover:bg-white/50 text-white flex items-center justify-center transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Cards */}
          <div className="w-full lg:w-[320px] flex flex-col gap-6">
            
            {/* Total Hours Card */}
            <div className="bg-[#eaf4ed] rounded-[1.5rem] p-8 shadow-lg">
              <h3 className="text-lg font-medium text-slate-800 mb-2">Total Hours</h3>
                <div className="text-[3.5rem] font-medium text-black leading-none mb-4 tracking-tight">{totalHours}</div>
              <p className="text-sm font-medium text-slate-700 leading-snug">
                You&apos;ve spent more time in the North Wing this month than anywhere else. Good focus session!
              </p>
            </div>

            {/* Quick Insight Card */}
           

          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs font-medium text-white/50">
          @2026 UniSpace. All rights reserved
        </footer>

      </div>
    </div>
  );
}
