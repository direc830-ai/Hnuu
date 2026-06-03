import { useState } from 'react';
import { 
  Mail, 
  Eye, 
  EyeOff, 
  User,
  Building2
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase, mapSupabaseUser } from '../lib/supabase';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(location.state?.isSignUp !== false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: '',
    lastName: '',
    email: '', 
    password: '',
    confirmPassword: '',
    rememberMe: false
  });

  const persistUser = (sessionUser) => {
    const user = mapSupabaseUser(sessionUser);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (isSignUp && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              full_name: `${formData.firstName} ${formData.lastName}`.trim(),
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) {
          alert(error.message);
          return;
        }

        if (data.session?.user) {
          persistUser(data.session.user);
          navigate('/dashboard');
          return;
        }

        alert('Account created. Check your email to confirm your account, then log in.');
        setIsSignUp(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data.session?.user) {
        persistUser(data.session.user);
      }

      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      alert(error.message);
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
        <header className="flex items-center gap-2 text-white p-4">
          <Building2 className="w-8 h-8" />
          <span className="text-2xl font-bold tracking-wider">UniSpace</span>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center py-10">
          
          <div className="w-full max-w-lg bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-8 sm:p-12 text-white">
            <h2 className="text-3xl font-bold text-center mb-10 tracking-widest uppercase">
              {isSignUp ? 'Sign Up' : 'Log In'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {isSignUp && (
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-white/60 py-2 pr-8 text-white placeholder-white/70 focus:outline-none focus:border-white transition-colors text-sm"
                    />
                    <User className="absolute right-0 bottom-2 w-5 h-5 text-white/80" />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      name="lastName"
                      required
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-white/60 py-2 pr-8 text-white placeholder-white/70 focus:outline-none focus:border-white transition-colors text-sm"
                    />
                    <User className="absolute right-0 bottom-2 w-5 h-5 text-white/80" />
                  </div>
                </div>
              )}

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-white/60 py-2 pr-8 text-white placeholder-white/70 focus:outline-none focus:border-white transition-colors text-sm"
                />
                <Mail className="absolute right-0 bottom-2 w-5 h-5 text-white/80" />
              </div>

              <div className="relative">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Password"
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
                
                {!isSignUp && (
                  <div className="flex justify-end mt-1">
                    <Link to="/forgot-password" className="text-[11px] text-white/80 hover:text-white transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                )}
              </div>

              {isSignUp && (
                <div className="relative">
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      required
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-white/60 py-2 pr-8 text-white placeholder-white/70 focus:outline-none focus:border-white transition-colors text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-0 bottom-2 text-white/80 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

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
                  Remember me
                </label>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-48 bg-[#82b5ff] hover:bg-[#67a8ff] text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors tracking-wide"
                >
                  {isSubmitting ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Log In'}
                </button>
              </div>

            </form>

            <div className="mt-6 text-center space-y-4">
              <div className="text-sm">
                <span className="text-white/90">
                  {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                </span>
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[#67a8ff] hover:text-[#82b5ff] font-bold transition-colors"
                >
                  {isSignUp ? 'Log in' : 'Sign up'}
                </button>
              </div>

              <div className="text-white/80 text-sm">- Or -</div>

              <div className="flex justify-center">
                <Link 
                  to="/admin-login"
                  className="text-xs font-bold text-white/60 hover:text-white transition-colors tracking-[0.2em] border border-white/20 px-6 py-2 rounded-full hover:bg-white/10"
                >
                  Are you an Admin?
                </Link>
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={handleGoogleLogin}
                  type="button"
                  className="bg-white/90 hover:bg-white text-[#67a8ff] font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm w-full sm:w-auto shadow-md"
                >
                  Login with Google @estin.dz
                </button>
              </div>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="text-white/70 text-xs flex flex-wrap justify-center sm:justify-between items-center px-4 py-6 gap-y-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
            <div className="flex flex-col gap-2 tracking-wider">
              <a href="#!" className="hover:text-white transition-colors">Feedback</a>
              <a href="#!" className="hover:text-white transition-colors">Report an issue</a>
            </div>
            <div className="flex flex-col gap-2 tracking-wider">
              <a href="#!" className="hover:text-white transition-colors">Help center</a>
              <Link to="/admin-login" className="hover:text-emerald-400 transition-colors text-emerald-500/80">Admin access</Link>
            </div>
          </div>

          <div className="text-center text-white/50 space-y-1">
            <div className="tracking-wider hover:text-white transition-colors cursor-pointer">Legal</div>
            <div className="tracking-wider">
              <a href="#!" className="hover:text-white transition-colors">Terms</a>
              <span className="mx-2">|</span>
              <a href="#!" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
            <div className="pt-2 text-[10px]">&copy; 2024 UniSpace. All rights reserved</div>
          </div>

          <div className="tracking-wider hover:text-white transition-colors cursor-pointer">Connect</div>
        </footer>

      </div>
    </div>
  );
};

export default Login;
