import React, { useState, useEffect } from 'react';
import { School, Search, Building2, Wind, Clock, Star, ChevronDown, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ThirdFloorMap from '../components/ThirdFloorMap';

const UniSpacePortal = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeMap, setActiveMap] = useState('rasa');
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans overflow-x-hidden">
      
      {/* Hero Section */}
      <div className="relative h-[550px] w-full flex flex-col z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/background.png')` }}
        >
          {/* Subtle Dark/Blue Gradient Overlay - Let real colors show through */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a2b42]/50 via-transparent to-transparent"></div>
          {/* Bottom Fade - shorter fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F4F7F9] to-transparent"></div>
        </div>

        {/* Navbar */}
        <nav className="relative z-50 w-full flex items-center justify-between px-10 py-6 text-white font-medium">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
            <School className="w-8 h-8 opacity-90" />
            <span className="text-2xl font-bold tracking-wide">UniSpace</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-[15px]">
            <Link to="/" className="flex items-center gap-1 border-b-2 border-white pb-1 font-bold">
              Home <ChevronDown size={14} />
            </Link>
            <Link to="/about" className="flex items-center gap-1 hover:text-white/80 transition-colors">
              About <ChevronDown size={14} />
            </Link>
            <Link to="/service" className="flex items-center gap-1 hover:text-white/80 transition-colors">
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight tracking-wider drop-shadow-md">
            Find Your Ideal <br /> Campus spot <br /> Instantly
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 font-medium drop-shadow-sm max-w-2xl">
            Instantly Discover Available Classrooms & Library Spaces
          </p>

          {/* Search Bar */}
          <div className="relative w-full max-w-[500px] mx-auto">
            <input 
              type="text" 
              placeholder="Search for quiet spots , study groups ...." 
              className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-full py-3 pl-6 pr-14 text-white placeholder-white/80 outline-none focus:bg-white/30 transition-all font-medium text-sm shadow-xl"
            />
            <button 
              onClick={() => navigate('/interactive-maps')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/20 rounded-full transition-colors flex items-center justify-center"
            >
               <span className="text-white/70 font-thin text-xl mr-2 mb-0.5">|</span>
               <Search className="w-4 h-4 text-white/90" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="max-w-6xl mx-auto px-6 relative z-20 -mt-10 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 p-6 flex items-center gap-5 relative border border-slate-50 hover:-translate-y-1 transition-transform">
            <div className="absolute top-4 right-4 text-[9px] font-bold text-green-500 bg-green-50 px-1.5 py-0.5 rounded tracking-widest uppercase">Live</div>
            <div className="w-12 h-12 rounded-lg bg-blue-100/50 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-[#5D8AAF]" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">Available Seats</p>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">152</h3>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 p-6 flex items-center gap-5 border border-slate-50 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-lg bg-green-100/50 flex items-center justify-center shrink-0">
              <Wind className="w-6 h-6 text-green-500" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">Quietest floor</p>
              <h3 className="text-base font-black text-slate-800 tracking-tight">4th floor</h3>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 p-6 flex items-center gap-5 border border-slate-50 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-lg bg-amber-100/50 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-amber-500" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">Peak Hours Today</p>
              <h3 className="text-base font-black text-slate-800 tracking-tight">2pm - 5pm</h3>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 p-6 flex items-center gap-5 border border-slate-50 hover:-translate-y-1 transition-transform relative">
            <div className="w-12 h-12 rounded-lg bg-purple-100/50 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 text-purple-500" fill="currentColor" strokeWidth={0} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">Usability Score</p>
              <h3 className="text-lg font-black text-slate-800 mb-0.5 tracking-tight">78 %</h3>
              <p className="text-[9px] text-[#A060FF] font-bold tracking-wide">Good conditions</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Bottom Section */}
      <div className="max-w-6xl mx-auto px-6 mt-6 mb-20 flex flex-col lg:flex-row gap-8">
        
        {/* Floor Map Selector Sidebar */}
        <div className="bg-white rounded-[2rem] p-8 w-full lg:w-[350px] shrink-0 text-center flex flex-col shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-slate-900 mb-5 px-2 tracking-tight">Floor Map</h2>
            <p className="text-[13px] text-slate-600 font-medium leading-relaxed mb-8 px-2 max-w-[250px] mx-auto">
              Select a floor to view its visual map and check the seat availability and book your spot
            </p>
            
            <div className="space-y-4 px-2">
              <button 
                onClick={() => setActiveMap('rasa')}
                className={`w-full py-4 rounded-full transition-colors font-bold text-[15px] shadow-sm ${activeMap === 'rasa' ? 'bg-[#D9EAF9] text-[#2c5275]' : 'bg-[#EBF4FC] text-[#4A79A5] hover:bg-[#D9EAF9]'}`}
              >
                Rasa Map
              </button>
              <button 
                onClick={() => setActiveMap('1st_left')}
                className={`w-full py-4 rounded-full transition-colors font-bold text-[15px] shadow-sm ${activeMap === '1st_left' ? 'bg-[#D9EAF9] text-[#2c5275]' : 'bg-[#EBF4FC] text-[#4A79A5] hover:bg-[#D9EAF9]'}`}
              >
                1st Floor (Left)
              </button>
              <button 
                onClick={() => setActiveMap('1st_right')}
                className={`w-full py-4 rounded-full transition-colors font-bold text-[15px] shadow-sm ${activeMap === '1st_right' ? 'bg-[#D9EAF9] text-[#2c5275]' : 'bg-[#EBF4FC] text-[#4A79A5] hover:bg-[#D9EAF9]'}`}
              >
                1st Floor (Right)
              </button>
              <button 
                onClick={() => setActiveMap('2nd')}
                className={`w-full py-4 rounded-full transition-colors font-bold text-[15px] shadow-sm ${activeMap === '2nd' ? 'bg-[#D9EAF9] text-[#2c5275]' : 'bg-[#EBF4FC] text-[#4A79A5] hover:bg-[#D9EAF9]'}`}
              >
                2nd Floor Map
              </button>
              <button 
                onClick={() => setActiveMap('3rd')}
                className={`w-full py-4 rounded-full transition-colors font-bold text-[15px] shadow-sm ${activeMap === '3rd' ? 'bg-[#D9EAF9] text-[#2c5275]' : 'bg-[#EBF4FC] text-[#4A79A5] hover:bg-[#D9EAF9]'}`}
              >
                3rd Floor Map
              </button>
            </div>
          </div>
        </div>

        {/* Map Image Viewer */}
        <div className="flex-1 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-6 relative overflow-hidden min-h-[500px] flex items-center justify-center">
           {activeMap === 'rasa' && <img src="/maps/0_floor.png" className="max-w-full max-h-full object-contain animate-in fade-in duration-500" alt="Rasa Map" />}
           {activeMap === '1st_left' && <img src="/maps/first_left_spots.jpeg" className="max-w-full max-h-full object-contain animate-in fade-in duration-500" alt="1st Floor Left" />}
           {activeMap === '1st_right' && <img src="/maps/first_right.png" className="max-w-full max-h-full object-contain animate-in fade-in duration-500" alt="1st Floor Right" />}
           {activeMap === '2nd' && <img src="/maps/second_floor.png" className="max-w-full max-h-full object-contain animate-in fade-in duration-500" alt="2nd Floor" />}
           {activeMap === '3rd' && <img src="/maps/third_floor.png" className="max-w-full max-h-full object-contain animate-in fade-in duration-500" alt="3rd Floor" />}
        </div>
      </div>

    </div>
  );
};

export default UniSpacePortal;
