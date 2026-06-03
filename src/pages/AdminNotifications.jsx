import { useEffect, useMemo, useState } from 'react';
import { ShieldAlert, Info, CheckCircle2, Trash2, Check, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const iconByType = useMemo(() => ({
    security: ShieldAlert,
    alert: AlertTriangle,
    system: CheckCircle2,
    info: Info,
  }), []);

  const colorByType = useMemo(() => ({
    security: 'rose',
    alert: 'amber',
    system: 'emerald',
    info: 'blue',
  }), []);

  useEffect(() => {
    const load = async () => {
      if (!supabase) return;
      setLoading(true);
      try {
        const [recentBookingsResult, lowBalanceResult] = await Promise.all([
          supabase.from('bookings').select('seat_id, floor, status, created_at').order('created_at', { ascending: false }).limit(10),
          supabase.from('profiles').select('full_name, email, balance_credits').lt('balance_credits', 5).order('balance_credits', { ascending: true }).limit(5),
        ]);

        const live = [];

        (lowBalanceResult.data || []).forEach((profile, i) => {
          live.push({
            id: `low-balance-${i}`,
            type: 'alert',
            title: 'Low Balance Alert',
            message: `${profile.full_name || profile.email} has ${profile.balance_credits ?? 0} booking credits remaining.`,
            time: 'Live',
            read: false,
          });
        });

        (recentBookingsResult.data || []).forEach((booking, i) => {
          live.push({
            id: `booking-${i}`,
            type: 'info',
            title: 'New Booking Recorded',
            message: `Seat ${booking.seat_id} in ${booking.floor} was booked and marked ${booking.status || 'confirmed'}.`,
            time: new Date(booking.created_at).toLocaleString(),
            read: i > 1,
          });
        });

        setNotifications(live);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const deleteOne = (id) => setNotifications(prev => prev.filter(n => n.id !== id));
  const clearAll = () => setNotifications([]);

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'security') return n.type === 'security';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-slate-500 font-medium">System alerts, security warnings, and updates.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={markAllRead}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Mark all as read
          </button>
          <button
            onClick={clearAll}
            className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
          {['all', 'unread', 'security'].map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`text-sm font-bold px-4 py-1.5 rounded-full transition-colors ${activeFilter === f ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-700'}`}>
              {f === 'all' ? 'All Alerts' : f === 'unread' ? `Unread (${unreadCount})` : 'Security'}
            </button>
          ))}
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-6 text-slate-400">Loading notifications...</div>
          ) : filteredNotifications.length > 0 ? filteredNotifications.map((notif) => {
            const Icon = iconByType[notif.type] || Info;
            const color = colorByType[notif.type] || 'blue';
            return (
              <div key={notif.id} className={`p-6 flex gap-4 transition-colors hover:bg-slate-50 ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                <div className={`w-12 h-12 shrink-0 rounded-2xl bg-${color}-100 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        {notif.title}
                        {!notif.read && <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>}
                      </h3>
                      <p className="text-slate-600 mt-1 leading-relaxed text-sm">{notif.message}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-400 whitespace-nowrap">{notif.time}</span>
                  </div>
                  <div className="mt-3 flex gap-3">
                    {!notif.read && (
                      <button onClick={() => markRead(notif.id)} className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        Mark as read
                      </button>
                    )}
                    <button onClick={() => deleteOne(notif.id)} className="text-sm font-bold text-slate-400 hover:text-rose-600 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="p-6 text-slate-500 font-medium">No notifications found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
