import React, { useState, useEffect } from 'react';
import { 
  School, ArrowLeft, Bell, Lock, Eye, Palette, CheckCircle2, 
  Moon, Sun, User, History, Settings as SettingsIcon, Building2, LogOut 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notifications');
  const [bookingReminders, setBookingReminders] = useState(true);
  const [availabilityAlerts, setAvailabilityAlerts] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(true);
  const [saved, setSaved] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState('User Name');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    try {
      const br = localStorage.getItem('bookingReminders');
      const aa = localStorage.getItem('availabilityAlerts');
      const su = localStorage.getItem('systemUpdates');
      const globalNotifs = localStorage.getItem('notifsOn');
      if (br !== null) setBookingReminders(JSON.parse(br));
      else if (globalNotifs !== null) setBookingReminders(JSON.parse(globalNotifs));
      if (aa !== null) setAvailabilityAlerts(JSON.parse(aa));
      if (su !== null) setSystemUpdates(JSON.parse(su));
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser?.name) setUserName(savedUser.name);
      const dm = localStorage.getItem('darkMode');
      const isDark = dm === 'true';
      setDarkMode(isDark);
      if (isDark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch (e) {}
  }, []);

  const toggleBookingReminders = () => {
    const next = !bookingReminders;
    setBookingReminders(next);
    try {
      localStorage.setItem('bookingReminders', JSON.stringify(next));
      localStorage.setItem('notifsOn', JSON.stringify(next));
    } catch (e) {}
  };

  const toggleAvailabilityAlerts = () => {
    const next = !availabilityAlerts;
    setAvailabilityAlerts(next);
    try { localStorage.setItem('availabilityAlerts', JSON.stringify(next)); } catch (e) {}
  };

  const toggleSystemUpdates = () => {
    const next = !systemUpdates;
    setSystemUpdates(next);
    try { localStorage.setItem('systemUpdates', JSON.stringify(next)); } catch (e) {}
  };

  const handleSave = () => {
    try {
      localStorage.setItem('bookingReminders', JSON.stringify(bookingReminders));
      localStorage.setItem('availabilityAlerts', JSON.stringify(availabilityAlerts));
      localStorage.setItem('systemUpdates', JSON.stringify(systemUpdates));
      localStorage.setItem('notifsOn', JSON.stringify(bookingReminders));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {}
  };

  const toggleDarkMode = (enable) => {
    setDarkMode(enable);
    try { localStorage.setItem('darkMode', String(enable)); } catch (e) {}
    if (enable) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
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
            onClick={toggleBookingReminders}
            className={`p-2 rounded-full transition-colors ${bookingReminders ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-300'}`}
            title={bookingReminders ? 'Notifications on' : 'Notifications off'}
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
                <SettingsIcon className="w-5 h-5 opacity-70" /> Settings
              </button>
              <button onClick={() => { setShowDropdown(false); navigate('/interactive-maps'); }} className="w-full text-left px-6 py-3 flex items-center gap-4 text-[#4B6185] hover:bg-slate-100 transition-colors font-semibold">
                <Building2 className="w-5 h-5 opacity-70" /> Interactive Maps
              </button>
              <div className="h-px bg-slate-200 my-2 mx-4"></div>
              <button onClick={() => { try { localStorage.removeItem('user'); } catch(e){} setShowDropdown(false); navigate('/'); }} className="w-full text-left px-6 py-3 flex items-center gap-4 text-red-500 hover:bg-red-50 transition-colors font-bold tracking-wider text-sm">
                <LogOut className="w-5 h-5" /> LOGOUT
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col px-8 w-full max-w-[1200px] mx-auto pt-8 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">Settings</h1>
          <p className="text-blue-100 mt-2 font-medium">Manage your account preferences and notifications</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl shrink-0 uni-sidebar">
            <nav className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'notifications' ? 'bg-white text-blue-600 shadow-md' : 'text-white hover:bg-white/10'}`}
              >
                <Bell className="w-5 h-5" /> Notifications
              </button>
             
              <button 
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'privacy' ? 'bg-white text-blue-600 shadow-md' : 'text-white hover:bg-white/10'}`}
              >
                <Eye className="w-5 h-5" /> Privacy
              </button>
              <button 
                onClick={() => setActiveTab('appearance')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'appearance' ? 'bg-white text-blue-600 shadow-md' : 'text-white hover:bg-white/10'}`}
              >
                <Palette className="w-5 h-5" /> Appearance
              </button>
            </nav>
          </div>

          {/* Settings Content Area */}
          <div className="flex-1 bg-[#F8FAFC]/95 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-white/40 w-full uni-card">
            
            {activeTab === 'notifications' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-[#1E293B] mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div>
                      <h3 className="font-bold text-[#334155] text-lg">Booking Reminders</h3>
                      <p className="text-slate-500 text-sm mt-1">Receive alerts 15 minutes before your booked time.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={bookingReminders} onChange={toggleBookingReminders} />
                      <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div>
                      <h3 className="font-bold text-[#334155] text-lg">Availability Alerts</h3>
                      <p className="text-slate-500 text-sm mt-1">Get notified when a seat in your favorite zone opens up.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={availabilityAlerts} onChange={toggleAvailabilityAlerts} />
                      <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div>
                      <h3 className="font-bold text-[#334155] text-lg">System Updates</h3>
                      <p className="text-slate-500 text-sm mt-1">Emails about library hours, events, and app changes.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={systemUpdates} onChange={toggleSystemUpdates} />
                      <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-end">
                  <button onClick={handleSave} className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-3 rounded-full font-bold shadow-md transition-colors flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Save Changes
                  </button>
                  {saved && <span className="ml-4 text-sm text-emerald-600 font-semibold">Saved</span>}
                </div>
              </div>
            )}

           

            {activeTab === 'privacy' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-[#1E293B] mb-6">Privacy Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div>
                      <h3 className="font-bold text-[#334155] text-lg">Share Booking Comments</h3>
                      <p className="text-slate-500 text-sm mt-1">Allow other users to see your comments or feedback on bookings.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div>
                      <h3 className="font-bold text-[#334155] text-lg">Public Profile</h3>
                      <p className="text-slate-500 text-sm mt-1">Make your profile details visible to other students in UniSpace.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-[#1E293B] mb-2">Appearance</h2>
                <p className="text-slate-500 text-sm mb-8">Choose how UniSpace looks for you.</p>

                <div className="space-y-6">
                  {/* Theme selector */}
                  <div className="uni-row bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="font-bold text-[#334155] text-lg mb-6">Theme</h3>
                    <div className="grid grid-cols-2 gap-4 max-w-sm">
                      {/* Light Mode Card */}
                      <button
                        onClick={() => toggleDarkMode(false)}
                        className={`flex flex-col items-center justify-center p-6 rounded-2xl gap-3 border-2 transition-all ${
                          !darkMode
                            ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                            : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                          !darkMode ? 'bg-amber-100' : 'bg-slate-100'
                        }`}>
                          <Sun className={`w-8 h-8 ${ !darkMode ? 'text-amber-500' : 'text-slate-400'}`} />
                        </div>
                        <span className={`font-bold text-sm ${ !darkMode ? 'text-blue-700' : 'text-slate-500'}`}>Light</span>
                        {!darkMode && <span className="text-[10px] font-bold text-blue-500 bg-blue-100 px-2 py-0.5 rounded-full">Active</span>}
                      </button>

                      {/* Dark Mode Card */}
                      <button
                        onClick={() => toggleDarkMode(true)}
                        className={`flex flex-col items-center justify-center p-6 rounded-2xl gap-3 border-2 transition-all ${
                          darkMode
                            ? 'border-blue-500 bg-slate-900 shadow-lg scale-105'
                            : 'border-slate-200 bg-slate-50 hover:border-blue-300'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                          darkMode ? 'bg-blue-900' : 'bg-slate-100'
                        }`}>
                          <Moon className={`w-8 h-8 ${ darkMode ? 'text-blue-300' : 'text-slate-400'}`} />
                        </div>
                        <span className={`font-bold text-sm ${ darkMode ? 'text-blue-300' : 'text-slate-500'}`}>Dark</span>
                        {darkMode && <span className="text-[10px] font-bold text-blue-300 bg-blue-900 px-2 py-0.5 rounded-full">Active</span>}
                      </button>
                    </div>
                  </div>

                  {/* Quick toggle */}
                  <div className="uni-row flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                        darkMode ? 'bg-slate-800' : 'bg-amber-50'
                      }`}>
                        {darkMode
                          ? <Moon className="w-6 h-6 text-blue-300" />
                          : <Sun className="w-6 h-6 text-amber-500" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#334155] text-base">Dark Mode</h3>
                        <p className="text-slate-500 text-sm">Switch between light and dark theme</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={darkMode}
                        onChange={(e) => toggleDarkMode(e.target.checked)}
                      />
                      <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
