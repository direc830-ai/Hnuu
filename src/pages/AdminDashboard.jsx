import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Map as MapIcon, TrendingUp, ShieldCheck, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
import ThirdFloorMap from '../components/ThirdFloorMap';
import { supabase } from '../lib/supabase';

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { label: 'Total Students', value: '--', trend: 'Loading', isUp: true, icon: Users, color: 'blue' },
    { label: 'Active Reservations', value: '--', trend: 'Loading', isUp: true, icon: MapIcon, color: 'emerald' },
    { label: 'Today Bookings', value: '--', trend: 'Loading', isUp: true, icon: TrendingUp, color: 'amber' },
    { label: 'Low Balance Alerts', value: '--', trend: 'Loading', isUp: false, icon: ShieldCheck, color: 'purple' },
  ]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const statStyles = useMemo(() => ({
    blue:    { card: 'bg-blue-50',    icon: 'text-blue-600' },
    emerald: { card: 'bg-emerald-50', icon: 'text-emerald-600' },
    amber:   { card: 'bg-amber-50',   icon: 'text-amber-600' },
    purple:  { card: 'bg-purple-50',  icon: 'text-purple-600' },
  }), []);

  useEffect(() => {
    let isActive = true;
    const loadStats = async () => {
      if (!supabase) return;
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const [studentsResult, activeResult, todayResult, lowBalanceResult, recentBookingsResult, allBookingsResult, allUsersResult] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('role', 'admin'),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed').gt('end_time', new Date().toISOString()),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', startOfDay.toISOString()),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).lt('balance_credits', 5),
        supabase.from('bookings').select('seat_id, floor, status, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('bookings').select('id, user_id, seat_id, floor, start_time, end_time, status, created_at').order('created_at', { ascending: false }),
        supabase.from('profiles').select('id, full_name, email, role, balance_credits, created_at').order('created_at', { ascending: false }),
      ]);

      if (!isActive) return;

      setStats([
        { label: 'Total Students', value: String(studentsResult.count ?? 0), trend: 'From database', isUp: true, icon: Users, color: 'blue' },
        { label: 'Active Reservations', value: String(activeResult.count ?? 0), trend: 'Live now', isUp: true, icon: MapIcon, color: 'emerald' },
        { label: 'Today Bookings', value: String(todayResult.count ?? 0), trend: 'Since midnight', isUp: true, icon: TrendingUp, color: 'amber' },
        { label: 'Low Balance Alerts', value: String(lowBalanceResult.count ?? 0), trend: 'Under 5 credits', isUp: false, icon: ShieldCheck, color: 'purple' },
      ]);

      setRecentActivity((recentBookingsResult.data || []).map((booking) => ({
        title: `Seat ${booking.seat_id} booked`,
        description: `${booking.floor} · ${booking.status}`,
        time: new Date(booking.created_at).toLocaleString(),
      })));

      setAllBookings(allBookingsResult.data || []);
      setAllUsers(allUsersResult.data || []);
    };

    loadStats().catch((err) => console.error('Dashboard load error', err));
    return () => { isActive = false; };
  }, []);

  const downloadReport = () => {
    const now = new Date().toLocaleString();

    // Build CSV content
    const lines = [];

    lines.push('UniSpace Admin Report');
    lines.push(`Generated: ${now}`);
    lines.push('');

    // Summary
    lines.push('=== SUMMARY ===');
    stats.forEach(s => lines.push(`${s.label},${s.value}`));
    lines.push('');

    // Users
    lines.push('=== USERS ===');
    lines.push('ID,Name,Email,Role,Balance Credits,Joined');
    allUsers.forEach(u => {
      lines.push(`${u.id},"${u.full_name || ''}","${u.email || ''}",${u.role},${u.balance_credits},${new Date(u.created_at).toLocaleDateString()}`);
    });
    lines.push('');

    // Bookings
    lines.push('=== BOOKINGS ===');
    lines.push('ID,User ID,Seat,Floor,Start Time,End Time,Status,Created');
    allBookings.forEach(b => {
      lines.push(`${b.id},${b.user_id},"${b.seat_id}","${b.floor}",${new Date(b.start_time).toLocaleString()},${new Date(b.end_time).toLocaleString()},${b.status},${new Date(b.created_at).toLocaleString()}`);
    });

    const csvContent = lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `unispace-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium">Welcome back, here&apos;s what&apos;s happening today.</p>
        </div>
        <button
          onClick={downloadReport}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Download Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${statStyles[stat.color].card}`}>
                <stat.icon className={`w-6 h-6 ${statStyles[stat.color].icon}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Real-time Occupancy</h3>
            <Link to="/admin/maps" className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-2 text-sm">
              <MapIcon className="w-4 h-4" /> All Maps
            </Link>
          </div>
          <div className="flex-1 rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative">
            <ThirdFloorMap />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-6 flex-1">
            {recentActivity.length > 0 ? recentActivity.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.description}</p>
                  <p className="text-[10px] font-bold text-slate-300 uppercase mt-1">{item.time}</p>
                </div>
              </div>
            )) : <p className="text-sm text-slate-500">No bookings yet.</p>}
          </div>
          <Link to="/admin/users" className="mt-8 w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl transition-all text-center block">
            View All Activity
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
