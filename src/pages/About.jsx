import React, { useState, useEffect } from 'react';
import { School, ChevronDown, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function About() {
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
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    navigate('/');
  };
  const teamMembersTop = [
    {
      id: 1,
      name: "Mounia Kadi",
      role: "Team Leader",
      task: "Back-End & UI/UX Design",
    },
    {
      id: 2,
      name: "Mouhamed Sahnoun Ferroukhi",
      role: "Lead Developer",
      task: "Front-End Architecture",
    }
  ];

  const teamMembersBottom = [
    {
      id: 3,
      name: "Adem Azerine",
      role: "Software Engineer",
      task: "Front-End Development",
    },
    {
      id: 4,
      name: "Malak Azil",
      role: "System Architect",
      task: "Back-End Development",
    },
    {
      id: 5,
      name: "Nourhane Malak Bendana",
      role: "Design Lead",
      task: "Back-End & UI/UX Design",
    }
  ];

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
          <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105" onClick={() => navigate('/')}>
            <School className="w-8 h-8 opacity-90" />
            <span className="text-2xl font-bold tracking-wide">UniSpace</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-[15px]">
            <Link to="/" className="flex items-center gap-1 hover:text-white/80 transition-colors">
              Home <ChevronDown size={14} />
            </Link>
            <Link to="/about" className="flex items-center gap-1 border-b-2 border-white pb-1 font-bold">
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
                <button className="bg-white/90 text-[#334E68] px-8 py-2.5 rounded-full font-bold text-xs uppercase shadow-md hover:bg-white hover:text-[#1a365d] transition-all">
                  SIGN-UP
                </button>
              </Link>
            </div>
          )}
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4 -mt-10">
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-wider drop-shadow-md max-w-4xl">
            UNI SPACE: <br /> CONNECTING <br /> CAMPUS COMMUNITY <br /> TO IDEAS SPACES.
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium drop-shadow-sm max-w-2xl">
            Empowering students and faculty to optimize their campus experience
          </p>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="max-w-5xl mx-auto px-6 relative z-20 py-12 space-y-16">

        {/* About The Platform */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          <div className="md:col-span-8 bg-white rounded-[2rem] p-10 md:p-14 shadow-sm border border-slate-100">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 font-serif">About The Platform</h2>
            <p className="text-slate-800 leading-relaxed text-[14px] font-medium">
              Our platform was designed to simplify the way students use the university library.<br />
              Instead of spending time searching for an available seat, students can quickly check availability,
              explore the library map, and reserve a space in just a few clicks.<br /><br />
              By combining real-time updates, an interactive map, and a simple reservation system,
              the platform helps students save time, reduce stress, and focus on what truly matters: their studies.
            </p>
          </div>
          <div className="md:col-span-4 bg-[#5D7B9D] rounded-[2rem] flex flex-col items-center justify-center text-white p-10 shadow-sm border border-[#5D7B9D]">
            <h3 className="text-6xl md:text-7xl font-serif mb-2 font-normal pb-2">80%</h3>
            <p className="text-white/90 font-medium text-sm tracking-wide">User satisfaction</p>
          </div>
        </div>

        {/* About The Library */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-transparent">
          <div className="md:col-span-4">
            <img
              src="/library.png"
              alt="University Library"
              className="w-full h-[220px] object-cover rounded-2xl shadow-md border-4 border-[#F4F7F9]"
              onError={(e) => { e.currentTarget.src = '/background.png' }}
            />
          </div>
          <div className="md:col-span-8 pl-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 font-serif">About The Library</h2>
            <p className="text-slate-800 leading-relaxed text-[13px] font-medium max-w-2xl">
              The university Library is 24/7 a vital space for students seeking a productive and comfortable study environment.
              However, finding an available spot can often be time-consuming and frustrating.<br />
              Our platform was created to solve this problem by allowing students to easily find, reserve, and manage study spaces in real time,
              making the library experience more efficient and enjoyable.
            </p>
          </div>
        </div>

        {/* About The Team */}
        <div className="mt-20 pb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-10 font-serif text-center">About The Team</h2>

          <div className="flex flex-col gap-10 items-center">
            {/* Top Row - 2 members */}
            <div className="flex flex-col sm:flex-row gap-10 justify-center w-full max-w-4xl">
              {teamMembersTop.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_rgba(59,130,246,0.1)] hover:-translate-y-3 transition-all duration-500 w-full sm:w-[380px] min-h-[220px] flex flex-col border border-slate-100 group overflow-hidden relative"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#5D7B9D] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <h3 className="font-serif font-bold text-[28px] text-slate-800 tracking-tight mb-2 group-hover:text-[#5D7B9D] transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-[#5D7B9D] text-[13px] font-black uppercase tracking-[0.2em] mb-6 border-b border-slate-100 pb-3 w-fit">
                    {member.role}
                  </p>
                  <div className="text-slate-500 text-[15px] leading-relaxed mt-auto font-medium italic">
                    {member.task}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Row - 3 members */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-10 justify-center w-full max-w-6xl">
              {teamMembersBottom.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_rgba(59,130,246,0.1)] hover:-translate-y-3 transition-all duration-500 w-full sm:w-[350px] min-h-[220px] flex flex-col border border-slate-100 group overflow-hidden relative"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#5D7B9D] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <h3 className="font-serif font-bold text-[26px] text-slate-800 tracking-tight mb-2 group-hover:text-[#5D7B9D] transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-[#5D7B9D] text-[13px] font-black uppercase tracking-[0.2em] mb-6 border-b border-slate-100 pb-3 w-fit">
                    {member.role}
                  </p>
                  <div className="text-slate-500 text-[15px] leading-relaxed mt-auto font-medium italic">
                    {member.task}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}