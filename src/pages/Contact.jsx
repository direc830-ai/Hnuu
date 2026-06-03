import React, { useState, useEffect } from 'react';
import { School, ChevronDown, MapPin, Phone, Mail, Send, Building2, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Contact = () => {
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

  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans pb-20">
      
      {/* Hero Section */}
      <div className="relative h-[450px] w-full flex flex-col z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/background.png')` }}
        >
          {/* Overlay to match the blueish tint of the image  */}
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
            <Link to="/service" className="flex items-center gap-1 hover:text-white/80 transition-colors">
              Service <ChevronDown size={14} />
            </Link>
            <Link to="/contact" className="flex items-center gap-1 border-b-2 border-white pb-1 font-bold">
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
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-6 tracking-wide drop-shadow-md">
            Connect with us
          </h1>
          <p className="text-lg md:text-xl text-white/95 font-medium drop-shadow-sm max-w-3xl leading-relaxed">
            Whether you need administrative support, technical guidance, or want to collaborate with our team, we're here to help you navigate our modern workspace.
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-5xl mx-auto px-6 relative z-20 mt-4">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Column: Form Card */}
          <div className="flex-grow bg-white/95 rounded-[2rem] shadow-xl shadow-slate-200/40 p-8 sm:p-10 border border-slate-50">
             <h2 className="text-[22px] font-bold text-slate-900 tracking-widest uppercase mb-8 ml-2">Send Message</h2>
             <form className="flex flex-col gap-8">
                <div className="flex flex-col sm:flex-row gap-6">
                   <input 
                     type="text" 
                     placeholder="NAME" 
                     className="w-full bg-[#6a8bba] text-white placeholder-white/90 px-6 py-3.5 rounded-full text-sm tracking-wider font-semibold outline-none focus:ring-2 focus:ring-[#4d6b9e] transition-all shadow-inner" 
                   />
                   <input 
                     type="email" 
                     placeholder="EMAIL" 
                     className="w-full bg-[#6a8bba] text-white placeholder-white/90 px-6 py-3.5 rounded-full text-sm tracking-wider font-semibold outline-none focus:ring-2 focus:ring-[#4d6b9e] transition-all shadow-inner" 
                   />
                </div>
                
                <div className="relative w-full bg-[#6a8bba] rounded-[2rem] pt-6 pb-2 px-4 shadow-inner">
                   <h3 className="text-white placeholder-white/90 text-sm tracking-wider font-semibold uppercase ml-2 mb-2">
                     Your Message
                   </h3>
                   <textarea 
                     rows={10} 
                     className="w-full bg-transparent text-white text-sm tracking-wider font-semibold outline-none transition-all leading-[32px] resize-none px-2"
                     style={{
                       backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(255,255,255,0.5) 31px, rgba(255,255,255,0.5) 32px)',
                       backgroundAttachment: 'local'
                     }}
                   ></textarea>
                </div>

                <div className="mt-2 text-left">
                   <button 
                     type="submit" 
                     className="bg-[#4d6b9e] hover:bg-[#3b5b8d] text-white px-8 py-3 rounded-full font-bold tracking-wider text-sm flex items-center gap-3 transition-colors shadow-lg"
                   >
                      Send Message 
                      <Send size={16} className="-mt-0.5" />
                   </button>
                </div>
             </form>
          </div>

          {/* Right Column: Info Cards & Map */}
          <div className="w-full md:w-[350px] shrink-0 flex flex-col gap-6">
             
             {/* Admin Card */}
             <div className="bg-[#4d6b9e] text-white rounded-2xl shadow-xl shadow-blue-900/20 p-8 flex flex-col gap-6">
               <div className="flex items-center gap-3">
                  <div className="bg-[#e4efff] p-2 rounded-lg text-[#4d6b9e]">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold tracking-widest uppercase">Administration</h2>
               </div>
               
               <div className="flex flex-col gap-5 text-sm mt-2">
                 <div className="flex items-start gap-4">
                   <MapPin className="w-5 h-5 shrink-0" />
                   <div className="w-full pt-0.5">
                     <span className="font-semibold tracking-wide leading-relaxed block">Route nationale n° 75,<br/>Amizour – 06300 Bejaia,<br/>Algérie.</span>
                   </div>
                 </div>
                 <div className="flex items-center gap-4">
                   <Phone className="w-5 h-5 shrink-0" />
                   <span className="font-semibold tracking-wide">+213-34-824-916</span>
                 </div>
                 <div className="flex items-start gap-4">
                   <Mail className="w-5 h-5 shrink-0" />
                   <div className="w-full pt-0.5">
                     <span className="font-semibold tracking-wide">contact@estin.dz</span>
                   </div>
                 </div>
               </div>
             </div>

             {/* Our Emails Card */}
             <div className="bg-[#4d6b9e] text-white rounded-2xl shadow-xl shadow-blue-900/20 p-8 flex flex-col gap-5">
               <div className="flex items-center gap-3 ml-1 mb-2">
                  <Mail className="w-6 h-6" />
                  <h2 className="text-lg font-bold tracking-widest">Our Emails</h2>
               </div>
               
               <div className="flex flex-col gap-4 text-sm px-2">
                 <div className="w-full border-b-2 border-dotted border-white/60"></div>
                 <div className="w-[90%] border-b-2 border-dotted border-white/60"></div>
                 <div className="w-[85%] border-b-2 border-dotted border-white/60"></div>
                 <div className="w-full border-b-2 border-dotted border-white/60"></div>
                 <div className="w-[90%] border-b-2 border-dotted border-white/60"></div>
               </div>
             </div>

             {/* Map Placeholder */}
             <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 p-1.5 relative overflow-hidden h-[220px]">
                {/* Fallback to background image to represent the map */}
                <img 
                  src="/top.png" 
                  alt="Map Location" 
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => { e.currentTarget.src = '/background.png' }}
                />
                {/* Simulated Google Maps styling overlay */}
                <div className="absolute inset-0 bg-slate-50/40 mix-blend-overlay"></div>
                
                {/* Map Pin */}
                <div className="absolute top-[40%] left-[30%] -translate-x-1/2 -translate-y-1/2">
                  <MapPin size={32} className="text-[#3b82f6] fill-blue-500/20 filter drop-shadow-md" />
                </div>
                
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-slate-100">
                   <span className="text-[11px] font-extrabold tracking-widest text-slate-800 uppercase">N75, Amizour</span>
                </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
