import { useState, useEffect } from 'react';
import { School, ChevronDown, Clock, Map, CalendarCheck, HelpCircle, ArrowRight, AlertCircle, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Service = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    supabase.auth.signOut().finally(() => {
      localStorage.removeItem('user');
      setUser(null);
      setShowDropdown(false);
      navigate('/');
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans pb-20">
      
      {/* Hero Section */}
      <div className="relative h-[450px] w-full flex flex-col z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/background.png')` }}
        >
          {/* Overlay to match the blueish tint of the image */}
          <div className="absolute inset-0 bg-[#3b5b8d]/80 mix-blend-multiply"></div>
          {/* Gradient to fade into the background below */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F4F7F9] to-transparent"></div>
        </div>

        {/* Navbar */}
        <nav className="relative z-50 w-full flex items-center justify-between px-10 py-6 text-white font-medium">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105" onClick={() => navigate('/')}>
            <School className="w-8 h-8 opacity-90" />
            <span className="text-2xl font-bold tracking-wide">UniSpace</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-[15px]">
            <Link to="/" className="flex items-center gap-1 hover:text-white/80 transition-colors">
              Home <ChevronDown size={14} />
            </Link>
            <Link to="/about" className="flex items-center gap-1 hover:text-white/80 transition-colors">
              About <ChevronDown size={14} />
            </Link>
            <Link to="/service" className="flex items-center gap-1 border-b-2 border-white pb-1 font-bold">
              Service <ChevronDown size={14} />
            </Link>
            <Link to="/contact" className="flex items-center gap-1 hover:text-white/80 transition-colors">
              Contact <ChevronDown size={14} />
            </Link>
          </div>

          {/* Auth Button / Profile */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 text-white px-5 py-2 rounded-full font-bold text-sm shadow-md transition-all flex items-center gap-2">
                  Dashboard
                </button>
              </Link>
              <div className="relative">
                <div 
                  className="w-10 h-10 rounded-full bg-white text-[#1a365d] flex items-center justify-center font-bold text-lg cursor-pointer shadow-lg hover:scale-105 transition-transform"
                  onClick={() => setShowDropdown(!showDropdown)}
                  title={user.name}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl py-2 text-slate-800 border border-slate-100 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-sm font-bold truncate capitalize">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <Link to="/dashboard" className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2 transition-colors block">
                      Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-red-600 flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" state={{ isSignUp: false }}>
                <button className="bg-[#5D7B9D] text-white px-8 py-2.5 rounded-full font-bold text-xs uppercase shadow-md hover:bg-[#4A6482] transition-all">
                  LOG IN
                </button>
              </Link>
              <Link to="/login" state={{ isSignUp: true }}>
                <button className="bg-white text-[#334E68] px-8 py-2.5 rounded-full font-bold text-xs uppercase shadow-md hover:bg-white hover:text-[#1a365d] transition-all">
                  SIGN-UP
                </button>
              </Link>
            </div>
          )}
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4 -mt-10">
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-6 uppercase tracking-widest drop-shadow-md">
            Library Services
          </h1>
          <p className="text-lg md:text-xl text-white/95 font-medium drop-shadow-sm max-w-3xl leading-relaxed">
            Our platform is designed to help students easily find, reserve, and manage study spaces inside the library.
            <br />
            We provide real-time information, fast access to available spots, and tools to improve your study experience.
          </p>
        </div>
      </div>

      {/* Grid Content Section */}
      <div className="max-w-6xl mx-auto px-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Top Row: Smart Search & Real-time Occupancy */}
          
          {/* Smart Search Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl shadow-slate-200/40 p-8 flex flex-col justify-between border border-slate-50">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Smart Search</h2>
              <p className="text-slate-700 text-[15px] leading-relaxed max-w-xl">
                Quickly find the perfect study space using our intelligent search system.
                <br />
                Search by floor, noise level, availability, or type of space (individual or group).
              </p>
            </div>
            <div className="mt-8">
              <button className="bg-[#6b8cbe] hover:bg-[#5b7aab] text-white px-6 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 transition-colors shadow-sm w-max">
                Start your search <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Real-time Occupancy Card */}
          <div className="bg-[#4d6b9e] text-white rounded-2xl shadow-xl shadow-blue-900/20 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <Clock className="w-7 h-7" />
                 <h2 className="text-xl font-bold tracking-tight">Real-time Occupancy</h2>
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-6">
                View live heatmaps of every floor. Find the quietest corners before you even leave your room.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white">Live Status</span>
              </div>
              <h3 className="text-3xl font-light mb-1">94% Capacity</h3>
              <p className="text-[10px] text-white/70">Peak hours expected until 2:00 PM</p>
            </div>
          </div>

          {/* Middle Row: Interactive Map, Seat Reservation, Real-Time Availability */}
          
          {/* Interactive Map */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 p-8 flex flex-col justify-between border border-slate-50">
             <div>
               <div className="flex items-center gap-3 mb-4">
                 <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Map className="w-5 h-5" />
                 </div>
                 <h2 className="text-lg font-bold text-slate-900">Interactive Map</h2>
               </div>
               <p className="text-slate-600 text-[13px] leading-relaxed">
                 View live heatmaps of every floor. Find the quietest corners before you even leave your room.
               </p>
             </div>
             <div className="mt-6 flex justify-between items-end">
               <button 
                 onClick={() => navigate('/interactive-maps')}
                 className="bg-[#eaf1f8] hover:bg-[#dbe6f3] text-[#334E68] px-4 py-2 rounded-full font-bold text-[13px] flex items-center gap-2 transition-colors w-max"
               >
                 View Maps <ArrowRight size={14} />
               </button>
               {/* Just mimicking the floating N badge from the screenshot */}
               <div className="w-10 h-10 rounded-full bg-[#1b73e8] flex items-center justify-center text-white font-bold shadow-md shadow-[#1b73e8]/30">N</div>
             </div>
          </div>

          {/* Seat Reservation */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 p-8 flex flex-col justify-between items-start border border-slate-50 relative overflow-hidden">
             <div>
               <div className="flex items-center gap-3 mb-4">
                 <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <CalendarCheck className="w-5 h-5" />
                 </div>
                 <h2 className="text-lg font-bold text-slate-900">Seat Reservation</h2>
               </div>
               <p className="text-slate-600 text-[13px] leading-relaxed">
                 Reserve your seat in just a few clicks. <br/> Choose your preferred spot and confirm your booking quickly after logging in.
               </p>
             </div>
          </div>

          {/* Real-Time Availability */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 p-8 flex flex-col justify-between border border-slate-50">
             <div>
               <div className="flex items-center gap-3 mb-4">
                 <div className="bg-blue-50 p-2 rounded-full text-blue-600 border border-blue-100">
                    <Clock className="w-4 h-4" />
                 </div>
                 <h2 className="text-lg font-bold text-slate-900 leading-tight">Real-Time<br/>Availability</h2>
               </div>
               <p className="text-slate-600 text-[13px] leading-relaxed">
                 Stay updated with live seat availability. Avoid wasting time by checking which spaces are free before going to the library.
               </p>
             </div>
          </div>

          {/* Bottom Row: Service Reporting & Need Assistance */}

          {/* Service Reporting */}
          <div className="bg-[#6b8cbe] text-white rounded-2xl shadow-xl shadow-[#6b8cbe]/30 p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                 <AlertCircle className="w-6 h-6" />
                 <h2 className="text-xl font-bold tracking-tight">Service Reporting</h2>
              </div>
              <p className="text-white/90 text-[14px] leading-relaxed mb-4">
                Quickly report noise disturbances, connectivity issues, or facility maintenance directly to the atrium staff.
              </p>
          </div>

          {/* Need assistance */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl shadow-slate-200/40 p-8 flex flex-col justify-center border border-slate-50">
              <div className="flex flex-col sm:flex-row items-start gap-4 h-full">
                 <HelpCircle className="w-10 h-10 text-slate-900 shrink-0" />
                 <div className="flex flex-col h-full justify-between w-full">
                   <div>
                     <h2 className="text-xl font-bold text-slate-900 mb-2">Need assistance?</h2>
                     <p className="text-slate-700 text-[15px] leading-relaxed max-w-xl mb-6">
                       Our concierge team is available 24/7 to help you find resources or troubleshoot technical issues in the library.
                     </p>
                   </div>
                   <div className="flex flex-wrap gap-4 mt-auto">
                     <button className="bg-[#6b8cbe] hover:bg-[#5b7aab] text-white px-8 py-2.5 rounded-full font-bold text-sm transition-colors shadow-sm">
                       Contact us
                     </button>
                     <button className="bg-[#eaf1f8] hover:bg-[#dbe6f3] text-[#334E68] px-8 py-2.5 rounded-full font-bold text-sm transition-colors shadow-sm">
                       Help Center
                     </button>
                   </div>
                 </div>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Service;
