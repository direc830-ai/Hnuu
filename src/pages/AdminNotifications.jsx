import { useEffect, useMemo, useState } from 'react';
import { ShieldAlert, Info, CheckCircle2, Trash2, Check, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

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
    let isActive = true;

    const loadNotifications = async () => {
      if (!supabase) return;

      const [recentBookingsResult, lowBalanceResult] = await Promise.all([
        supabase
          .from('bookings')
          .select('seat_id, floor, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('profiles')
          .select('full_name, email, balance_credits')
          .lt('balance_credits', 5)
          .order('balance_credits', { ascending: true })
          .limit(5),
      ]);

      if (!isActive) return;

      const liveNotifications = [];

      (lowBalanceResult.data || []).forEach((profile, index) => {
        liveNotifications.push({
          id: `low-balance-${index}`,
          type: 'alert',
          title: 'Low Balance Alert',
          message: `${profile.full_name || profile.email} has ${profile.balance_credits ?? 0} booking credits remaining.`,
          time: 'Live',
          read: false,
        });
      });

      (recentBookingsResult.data || []).forEach((booking, index) => {
        liveNotifications.push({
          id: `booking-${index}`,
          type: 'info',
          title: 'New Booking Recorded',
          message: `Seat ${booking.seat_id} in ${booking.floor} was booked and marked ${booking.status || 'confirmed'}.`,
          time: new Date(booking.created_at).toLocaleString(),
          read: index > 1,
        });
      });

      setNotifications(liveNotifications);
    };

    loadNotifications().catch((error) => {
      console.error('Unable to load admin notifications', error);
    });

    return () => {
      isActive = false;
    };
  }, []);

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === 'unread') return !notification.read;
    if (activeFilter === 'security') return notification.type === 'security';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-slate-500 font-medium">System alerts, security warnings, and updates.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all flex items-center gap-2">
            <Check className="w-4 h-4" /> Mark all as read
          </button>
          <button className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl transition-all flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
          <button onClick={() => setActiveFilter('all')} className={`text-sm font-bold px-4 py-1.5 rounded-full transition-colors ${activeFilter === 'all' ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-700'}`}>All Alerts</button>
          <button onClick={() => setActiveFilter('unread')} className={`text-sm font-bold px-4 py-1.5 rounded-full transition-colors ${activeFilter === 'unread' ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-700'}`}>Unread ({notifications.filter((notification) => !notification.read).length})</button>
          <button onClick={() => setActiveFilter('security')} className={`text-sm font-bold px-4 py-1.5 rounded-full transition-colors ${activeFilter === 'security' ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-700'}`}>Security</button>
        </div>
        
        <div className="divide-y divide-slate-100">
          {filteredNotifications.length > 0 ? filteredNotifications.map((notif) => {
            const Icon = iconByType[notif.type] || Info;
            const color = colorByType[notif.type] || 'blue';

            return (
            <div key={notif.id} className={`p-6 flex gap-4 transition-colors hover:bg-slate-50 ${!notif.read ? 'bg-blue-50/30' : ''}`}>
              <div className={`w-12 h-12 shrink-0 rounded-2xl bg-${color}-100 flex items-center justify-center`}>
                <Icon className={`w-6 h-6 text-${color}-600`} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-base font-bold text-slate-900 ${!notif.read ? 'flex items-center gap-2' : ''}`}>
                      {notif.title}
                      {!notif.read && <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>}
                    </h3>
                    <p className="text-slate-600 mt-1 leading-relaxed text-sm">{notif.message}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-400 whitespace-nowrap">{notif.time}</span>
                </div>
                <div className="mt-3 flex gap-3">
                  {!notif.read && (
                    <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">Mark as read</button>
                  )}
                  <button className="text-sm font-bold text-slate-400 hover:text-rose-600 transition-colors">Delete</button>
                </div>
              </div>
            </div>
            );
          }) : <div className="p-6 text-slate-500 font-medium">No live notifications found.</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
