import { useState } from 'react';
import { Save, Shield, Settings2, Globe, Palette, CheckCircle } from 'lucide-react';

const STORAGE_KEY = 'unispace_admin_settings';

const defaultSettings = {
  appName: 'UniSpace Campus Management',
  supportEmail: 'support@university.edu',
  maintenanceMode: false,
  twoFA: true,
  sessionTimeout: true,
  language: 'English (US)',
  timezone: 'UTC (Coordinated Universal Time)',
  theme: 'light',
  accentColor: 'blue',
};

const loadSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  } catch { return defaultSettings; }
};

const Toggle = ({ checked, onChange }) => (
  <div className="relative inline-flex items-center cursor-pointer" onClick={() => onChange(!checked)}>
    <div className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-200'} relative`}>
      <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
    </div>
  </div>
);

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(loadSettings);
  const [saved, setSaved] = useState(false);

  const set = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20";

  const tabs = [
    { key: 'general', label: 'General', icon: Settings2 },
    { key: 'security', label: 'Security', icon: Shield },
    { key: 'localization', label: 'Localization', icon: Globe },
    { key: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general': return (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">General Configuration</h3>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Application Name</label>
            <input type="text" value={settings.appName} onChange={e => set('appName', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Support Email</label>
            <input type="email" value={settings.supportEmail} onChange={e => set('supportEmail', e.target.value)} className={inputCls} />
          </div>
          <div className="pt-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Maintenance Mode</h4>
              <p className="text-xs text-slate-500 mt-1">Temporarily disable student access.</p>
            </div>
            <Toggle checked={settings.maintenanceMode} onChange={v => set('maintenanceMode', v)} />
          </div>
        </div>
      );
      case 'security': return (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Security Settings</h3>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Two-Factor Authentication</h4>
              <p className="text-xs text-slate-500 mt-1">Require 2FA for all admin logins.</p>
            </div>
            <Toggle checked={settings.twoFA} onChange={v => set('twoFA', v)} />
          </div>
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Session Timeout</h4>
              <p className="text-xs text-slate-500 mt-1">Auto logout after 30 min inactivity.</p>
            </div>
            <Toggle checked={settings.sessionTimeout} onChange={v => set('sessionTimeout', v)} />
          </div>
        </div>
      );
      case 'localization': return (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Localization</h3>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Default Language</label>
            <select value={settings.language} onChange={e => set('language', e.target.value)} className={inputCls}>
              <option>English (US)</option>
              <option>French (FR)</option>
              <option>Arabic (SA)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Timezone</label>
            <select value={settings.timezone} onChange={e => set('timezone', e.target.value)} className={inputCls}>
              <option>UTC (Coordinated Universal Time)</option>
              <option>EST (Eastern Standard Time)</option>
              <option>CET (Central European Time)</option>
              <option>Africa/Algiers</option>
            </select>
          </div>
        </div>
      );
      case 'appearance': return (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Appearance</h3>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Theme</label>
            <div className="flex gap-4">
              {['light', 'dark'].map(t => (
                <label key={t} onClick={() => set('theme', t)} className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${settings.theme === t ? 'border-blue-500' : 'border-slate-300'}`}>
                    {settings.theme === t && <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>}
                  </div>
                  <span className="text-sm font-bold text-slate-700 capitalize">{t} Mode</span>
                </label>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-sm font-bold text-slate-700 mb-3">Accent Color</label>
            <div className="flex gap-3">
              {[{ key: 'blue', cls: 'bg-blue-600' }, { key: 'emerald', cls: 'bg-emerald-500' }, { key: 'indigo', cls: 'bg-indigo-500' }, { key: 'rose', cls: 'bg-rose-500' }].map(({ key, cls }) => (
                <button key={key} onClick={() => set('accentColor', key)}
                  className={`w-8 h-8 rounded-full ${cls} transition-all ${settings.accentColor === key ? 'ring-2 ring-offset-2 ring-blue-600 scale-110' : 'opacity-50 hover:opacity-100'}`} />
              ))}
            </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {saved && (
        <div className="fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-xl font-bold text-white bg-emerald-500 flex items-center gap-3">
          <CheckCircle className="w-5 h-5" /> Settings saved!
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 font-medium">Configure global application preferences and security.</p>
        </div>
        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
          <Save className="w-5 h-5" /> Save Changes
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === key ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
              <Icon className="w-5 h-5" /> {label}
            </button>
          ))}
        </div>
        <div className="md:col-span-2">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminSettings;
