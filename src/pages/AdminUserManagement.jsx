import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Edit2, Trash2, Ban, X, Save, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const EMPTY_FORM = { full_name: '', email: '', role: 'user', balance_credits: 10, password: '' };

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Modal state
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'delete' | 'block'
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadUsers = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, balance_credits, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUsers((data || []).map((p) => ({
        id: p.id,
        name: p.full_name || p.email?.split('@')?.[0] || 'User',
        email: p.email,
        role: p.role || 'user',
        status: (p.balance_credits ?? 0) > 0 ? 'Active' : 'Inactive',
        balanceCredits: p.balance_credits ?? 0,
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users.filter((u) => {
      const matchSearch = !q || [u.name, u.email, u.role, u.status].join(' ').toLowerCase().includes(q);
      const matchRole = roleFilter === 'All Roles' || u.role.toLowerCase() === roleFilter.toLowerCase();
      const matchStatus = statusFilter === 'All Status' || u.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, roleFilter, searchQuery, statusFilter]);

  // ── ADD USER ──────────────────────────────────────────────
  const openAdd = () => { setForm(EMPTY_FORM); setModal('add'); };

  const handleAdd = async () => {
    if (!form.email || !form.password) return showToast('Email and password are required.', 'error');
    setFormLoading(true);
    try {
      // Create auth user via Supabase admin signUp (works from client with anon key when email confirmation is off)
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.full_name } },
      });
      if (error) throw error;

      const userId = data.user?.id;
      if (userId) {
        // Upsert profile with role & balance
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: userId,
          full_name: form.full_name,
          email: form.email,
          role: form.role,
          balance_credits: Number(form.balance_credits),
        });
        if (profileError) throw profileError;
      }

      showToast('User created successfully!');
      setModal(null);
      await loadUsers();
    } catch (err) {
      showToast(err.message || 'Failed to create user.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // ── EDIT USER ─────────────────────────────────────────────
  const openEdit = (user) => {
    setSelectedUser(user);
    setForm({ full_name: user.name, email: user.email, role: user.role, balance_credits: user.balanceCredits, password: '' });
    setModal('edit');
  };

  const handleEdit = async () => {
    if (!selectedUser) return;
    setFormLoading(true);
    try {
      const { error } = await supabase.from('profiles').update({
        full_name: form.full_name,
        role: form.role,
        balance_credits: Number(form.balance_credits),
        updated_at: new Date().toISOString(),
      }).eq('id', selectedUser.id);
      if (error) throw error;

      showToast('User updated successfully!');
      setModal(null);
      await loadUsers();
    } catch (err) {
      showToast(err.message || 'Failed to update user.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // ── DELETE USER ───────────────────────────────────────────
  const openDelete = (user) => { setSelectedUser(user); setModal('delete'); };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setFormLoading(true);
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', selectedUser.id);
      if (error) throw error;
      showToast('User deleted.');
      setModal(null);
      await loadUsers();
    } catch (err) {
      showToast(err.message || 'Failed to delete user.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // ── BLOCK USER (set balance to 0 = Inactive) ──────────────
  const openBlock = (user) => { setSelectedUser(user); setModal('block'); };

  const handleBlock = async () => {
    if (!selectedUser) return;
    setFormLoading(true);
    try {
      const newBalance = selectedUser.status === 'Active' ? 0 : 10;
      const { error } = await supabase.from('profiles').update({
        balance_credits: newBalance,
        updated_at: new Date().toISOString(),
      }).eq('id', selectedUser.id);
      if (error) throw error;
      showToast(newBalance === 0 ? 'User blocked.' : 'User unblocked.');
      setModal(null);
      await loadUsers();
    } catch (err) {
      showToast(err.message || 'Failed to block user.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-xl font-bold text-white flex items-center gap-3 transition-all ${toast.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`}>
          <CheckCircle className="w-5 h-5" /> {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium">Manage students, staff, and administrators.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add User
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col space-y-6">
        {/* Filters */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-medium text-slate-700 focus:outline-none">
              <option>All Roles</option>
              <option>user</option>
              <option>admin</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-medium text-slate-700 focus:outline-none">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6 font-bold">Name</th>
                <th className="py-4 px-6 font-bold">Email</th>
                <th className="py-4 px-6 font-bold">Role</th>
                <th className="py-4 px-6 font-bold">Credits</th>
                <th className="py-4 px-6 font-bold">Status</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td className="py-8 px-6 text-slate-400" colSpan={6}>Loading users...</td></tr>
              ) : filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-900">{user.name}</td>
                  <td className="py-4 px-6 text-slate-500 text-sm">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-700 font-bold">{user.balanceCredits}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 flex justify-end gap-2">
                    <button onClick={() => openEdit(user)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => openBlock(user)} className={`p-2 rounded-lg transition-colors ${user.status === 'Active' ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`} title={user.status === 'Active' ? 'Block User' : 'Unblock User'}>
                      <Ban className="w-4 h-4" />
                    </button>
                    <button onClick={() => openDelete(user)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td className="py-6 px-6 text-slate-500" colSpan={6}>No users match the current filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-6">
          <p className="text-sm text-slate-500 font-medium">Showing {filteredUsers.length} of {users.length} users</p>
        </div>
      </div>

      {/* ── MODALS ── */}
      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Add New User' : 'Edit User'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Full Name">
              <input value={form.full_name} onChange={(e) => setForm(f => ({ ...f, full_name: e.target.value }))}
                className="input" placeholder="Full name" />
            </Field>
            {modal === 'add' && (
              <>
                <Field label="Email *">
                  <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    className="input" placeholder="user@example.com" />
                </Field>
                <Field label="Password *">
                  <input type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                    className="input" placeholder="Minimum 6 characters" />
                </Field>
              </>
            )}
            <Field label="Role">
              <select value={form.role} onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))} className="input">
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </Field>
            <Field label="Balance Credits">
              <input type="number" min="0" value={form.balance_credits} onChange={(e) => setForm(f => ({ ...f, balance_credits: e.target.value }))}
                className="input" />
            </Field>
          </div>
          <div className="flex gap-3 mt-6 justify-end">
            <button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all">Cancel</button>
            <button onClick={modal === 'add' ? handleAdd : handleEdit} disabled={formLoading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all flex items-center gap-2">
              <Save className="w-4 h-4" /> {formLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete User" onClose={() => setModal(null)}>
          <p className="text-slate-600 mb-6">Are you sure you want to delete <strong>{selectedUser?.name}</strong>? This cannot be undone.</p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all">Cancel</button>
            <button onClick={handleDelete} disabled={formLoading}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all">
              {formLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}

      {modal === 'block' && (
        <Modal title={selectedUser?.status === 'Active' ? 'Block User' : 'Unblock User'} onClose={() => setModal(null)}>
          <p className="text-slate-600 mb-6">
            {selectedUser?.status === 'Active'
              ? `Block ${selectedUser?.name}? Their balance will be set to 0.`
              : `Unblock ${selectedUser?.name}? Their balance will be restored to 10.`}
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all">Cancel</button>
            <button onClick={handleBlock} disabled={formLoading}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all">
              {formLoading ? 'Processing...' : selectedUser?.status === 'Active' ? 'Block' : 'Unblock'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
      <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-xl transition-colors">
        <X className="w-5 h-5 text-slate-500" />
      </button>
      <h2 className="text-xl font-black text-slate-900 mb-6">{title}</h2>
      {children}
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-bold text-slate-700 mb-1.5">{label}</label>
    {children}
  </div>
);

// Inject input style globally via a simple trick
const style = document.createElement('style');
style.textContent = '.input { width:100%; background:#f8fafc; border:1px solid #e2e8f0; border-radius:0.75rem; padding:0.625rem 1rem; font-size:0.875rem; outline:none; } .input:focus { box-shadow:0 0 0 2px rgba(59,130,246,0.2); }';
document.head.appendChild(style);

export default AdminUserManagement;
