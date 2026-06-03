import React, { useState } from 'react';
import { Save, Shield, Settings2, Globe, Palette } from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">General Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Application Name</label>
                <input type="text" defaultValue="UniSpace Campus Management" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Support Email Contact</label>
                <input type="email" defaultValue="support@university.edu" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Maintenance Mode</h4>
                  <p className="text-xs text-slate-500 mt-1">Temporarily disable student access to the portal.</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Security Settings</h3>
            <div className="space-y-4">
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Two-Factor Authentication (2FA)</h4>
                  <p className="text-xs text-slate-500 mt-1">Require 2FA for all admin logins.</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Session Timeout</h4>
                  <p className="text-xs text-slate-500 mt-1">Automatically log out inactive users after 30 minutes.</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <button className="text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-lg transition-colors">
                  Reset All Passwords
                </button>
              </div>
            </div>
          </div>
        );
      case 'localization':
        return (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Localization</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Default Language</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option>English (US)</option>
                  <option>French (FR)</option>
                  <option>Arabic (SA)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Timezone</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option>UTC (Coordinated Universal Time)</option>
                  <option>EST (Eastern Standard Time)</option>
                  <option>CET (Central European Time)</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'appearance':
        return (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Appearance</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Theme Preference</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">Light Mode</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                    </div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Dark Mode</span>
                  </label>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-bold text-slate-700 mb-3">Primary Color Accent</label>
                <div className="flex gap-3">
                  <button className="w-8 h-8 rounded-full bg-blue-600 ring-2 ring-offset-2 ring-blue-600 shadow-sm"></button>
                  <button className="w-8 h-8 rounded-full bg-emerald-500 shadow-sm opacity-50 hover:opacity-100 transition-opacity"></button>
                  <button className="w-8 h-8 rounded-full bg-indigo-500 shadow-sm opacity-50 hover:opacity-100 transition-opacity"></button>
                  <button className="w-8 h-8 rounded-full bg-rose-500 shadow-sm opacity-50 hover:opacity-100 transition-opacity"></button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 font-medium">Configure global application preferences and security.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
          <Save className="w-5 h-5" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Settings Navigation */}
        <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'general' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
          >
            <Settings2 className="w-5 h-5" /> General
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'security' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
          >
            <Shield className="w-5 h-5" /> Security
          </button>
          <button 
            onClick={() => setActiveTab('localization')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'localization' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
          >
            <Globe className="w-5 h-5" /> Localization
          </button>
          <button 
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'appearance' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
          >
            <Palette className="w-5 h-5" /> Appearance
          </button>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-2">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
