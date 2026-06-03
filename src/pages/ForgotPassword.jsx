import { useState } from 'react';
import { Mail, Building2, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Simulate API call
      setTimeout(() => {
        navigate('/login', { state: { isSignUp: false } });
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen relative font-sans overflow-hidden bg-slate-900">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: `url('/background.png')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1a365d]/50 to-[#1e3a8a]/90 mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-between p-6">
        
        <header className="flex items-center gap-2 text-white p-4 cursor-pointer w-max" onClick={() => navigate('/')}>
          <Building2 className="w-8 h-8" />
          <span className="text-2xl font-bold tracking-wider">UniSpace</span>
        </header>

        <main className="flex-grow flex items-center justify-center py-10">
          
          <div className="w-full max-w-lg bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-8 sm:p-12 text-white">
            <Link to="/login" state={{ isSignUp: false }} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors text-sm font-semibold uppercase tracking-wider">
              <ArrowLeft size={16} /> Back to Login
            </Link>

            <h2 className="text-3xl font-bold text-center mb-4 tracking-widest uppercase">
              Forgot Password
            </h2>
            
            <p className="text-center text-white/80 mb-8 text-sm">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>

            {isSubmitted ? (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
                <p className="font-semibold text-green-100">Reset link sent!</p>
                <p className="text-sm text-green-100/80 mt-1">Please check your email. Redirecting...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-white/60 py-2 pr-8 text-white placeholder-white/80 focus:outline-none focus:border-white transition-colors uppercase text-sm"
                  />
                  <Mail className="absolute right-0 bottom-2 w-5 h-5 text-white/80" />
                </div>

                <div className="pt-4 flex justify-center">
                  <button
                    type="submit"
                    className="w-full sm:w-auto min-w-[200px] bg-[#82b5ff] hover:bg-[#67a8ff] text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors tracking-wide"
                  >
                    SEND RESET LINK
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>

        <footer className="text-white/70 text-xs flex flex-wrap justify-center sm:justify-between items-center px-4 py-6 gap-y-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
            <div className="flex flex-col gap-2 uppercase tracking-wider">
              <a href="#!" className="hover:text-white transition-colors">Feedback</a>
              <a href="#!" className="hover:text-white transition-colors">Report an issue</a>
            </div>
            <div className="flex flex-col gap-2 uppercase tracking-wider">
              <a href="#!" className="hover:text-white transition-colors">Help Center</a>
              <a href="#!" className="hover:text-white transition-colors">FAQs</a>
            </div>
          </div>

          <div className="text-center text-white/50 space-y-1">
             <div className="uppercase tracking-wider hover:text-white transition-colors cursor-pointer">LEGAL</div>
             <div className="uppercase tracking-wider">
               <a href="#!" className="hover:text-white transition-colors">Terms</a>
               <span className="mx-2">|</span>
               <a href="#!" className="hover:text-white transition-colors">Privacy Policy</a>
             </div>
             <div className="pt-2 text-[10px]">&copy; 2024 UniSpace. All rights reserved</div>
          </div>

          <div className="uppercase tracking-wider hover:text-white transition-colors cursor-pointer">
            Connect
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ForgotPassword;
