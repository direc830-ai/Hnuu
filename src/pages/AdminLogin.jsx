import { useState } from 'react';
import { 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  Building2,
  ArrowLeft
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, mapSupabaseUser, getUserProfile } from '../lib/supabase';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error('Auth error full details:', JSON.stringify(error, null, 2));
        alert(`Login failed: ${error.message}\nCode: ${error.code || 'N/A'}\nStatus: ${error.status || 'N/A'}`);
        return;
      }

      const user = data.session?.user;
      const mappedUser = mapSupabaseUser(user);
      const profile = user ? await getUserProfile(user.id) : null;
      const isAdmin = profile?.role === 'admin' || mappedUser?.role === 'admin';

      if (!isAdmin) {
        await supabase.auth.signOut();
        alert('This account is not allowed to access the admin portal. Set role=admin in Supabase profiles first.');
        return;
      }

      if (mappedUser) {
        localStorage.setItem('user', JSON.stringify(mappedUser));
      }

      navigate('/admin/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen relative font-sans overflow-hidden bg-slate-900">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: `url('/background.png')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1a365d]/50 to-[#1e3a8a]/90 mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-between p-6">
        
        {/* Header */}
        <header className="flex items-center justify-between text-white p-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8" />
            <span className="text-2xl font-bold tracking-wider">
              UniSpace <span className="text-blue-400 text-sm ml-2">Admin</span>
            </span>
          </div>
          <Link to="/login" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center py-10">
          
          <div className="w-full max-w-lg bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-8 sm:p-12 text-white">
            <div className="flex justify-center mb-6">
              <ShieldCheck className="w-16 h-16 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-center mb-10 tracking-widest uppercase">
              Admin Portal
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Admin email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-white/60 py-2 pr-8 text-white placeholder-white/70 focus:outline-none focus:border-white transition-colors text-sm"
                />
                <Mail className="absolute right-0 bottom-2 w-5 h-5 text-white/80" />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Admin password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-white/60 py-2 pr-8 text-white placeholder-white/70 focus:outline-none focus:border-white transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-2 text-white/80 hover:text-white transition-colors"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-white/60 bg-transparent text-[#67a8ff] focus:ring-[#67a8ff] focus:ring-offset-0 cursor-pointer accent-[#67a8ff]"
                />
                <label htmlFor="rememberMe" className="text-xs text-white/90 cursor-pointer">
                  Trust this secure device
                </label>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#82b5ff] hover:bg-[#67a8ff] text-white font-bold py-4 px-4 rounded-lg shadow-lg transition-colors tracking-widest"
                >
                  {isSubmitting ? 'Authenticating...' : 'Authenticate Admin'}
                </button>
              </div>

            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-white/50 tracking-widest">
                Secure connection established
              </p>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="text-white/70 text-xs text-center py-6">
          &copy; 2024 UniSpace Administration. All rights reserved
        </footer>

      </div>
    </div>
  );
};

export default AdminLogin;
