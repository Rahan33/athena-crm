import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Check, MessageSquare, ChevronRight, LayoutGrid, Monitor } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  // 'main' = Split Screen (Image 1), 'secondary' = Dark Card (Image 2)
  const [view, setView] = useState<'main' | 'secondary'>('main');
  const [step, setStep] = useState<'login' | 'otp'>('login');
  
  // States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subUsername, setSubUsername] = useState('');
  const [otp, setOtp] = useState('');
  
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      const payload = view === 'secondary'
        ? { email, subUsername, password } // Staff/Sub-user uses secondary
        : { email, password };             // Admin uses main

      const res = await fetch('/api/auth/company-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }
      
      setStep('otp');
      setMsg(data.message + (data.fallbackOtp ? ' (Test OTP: ' + data.fallbackOtp + ')' : ''));
    } catch (err) {
      setError('Network error');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Invalid OTP'); return; }

      localStorage.setItem('token', 'client-token');
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/client-portal');
    } catch (err) {
      setError('Network error');
    }
  };

  // -------------------------------------------------------------
  // DESIGN 1: SPLIT SCREEN (MAIN ADMIN LOGIN)
  // -------------------------------------------------------------
  if (view === 'main') {
    return (
      <div className="min-h-screen flex w-full bg-white font-sans">
        {/* Left Side: Form */}
        <div className="w-full lg:w-[45%] xl:w-[35%] flex flex-col p-8 sm:p-12 xl:p-16 relative">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-6 h-6 bg-purple-600 rounded-md"></div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">Athena</span>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            <div className="flex items-center gap-4 mb-6 text-sm font-semibold text-gray-400">
              <span className="text-gray-900 bg-gray-100 px-3 py-1 rounded-full cursor-pointer">Sign In</span>
              <Link to="/client-register" className="hover:text-gray-900 transition-colors">Create account</Link>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-2">Welcome <span className="text-purple-400">back.</span></h1>
            <p className="text-gray-500 text-sm mb-8">Sign in to your Athena Business OS workspace.</p>

            {/* Dummy SSO Buttons */}
            <div className="space-y-3 mb-8">
              <button type="button" className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>
              <div className="flex gap-3">
                <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  <Monitor className="w-4 h-4 text-blue-500" /> Microsoft
                </button>
                <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  <LayoutGrid className="w-4 h-4 text-gray-900" /> Apple
                </button>
              </div>
            </div>

            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {error && <div className="text-red-500 text-sm mb-4 font-medium text-center">{error}</div>}
            {msg && <div className="text-green-600 text-sm mb-4 font-medium text-center">{msg}</div>}

            {step === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email / Login</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm placeholder-gray-400" placeholder="my@email.com" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Password</label>
                    <a href="#" className="text-xs font-semibold text-purple-600 hover:text-purple-700">Forgot?</a>
                  </div>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm placeholder-gray-400" placeholder="••••••••" />
                </div>
                <div className="flex items-center gap-2 mt-2 mb-6">
                  <input type="checkbox" className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500" />
                  <span className="text-xs text-gray-500 font-medium">Keep me signed in for 30 days</span>
                </div>
                <button type="submit" className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2">
                  Sign In <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Enter 6-Digit OTP</label>
                  <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-4 py-4 text-center tracking-[0.5em] font-mono text-xl bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="000000" maxLength={6} />
                </div>
                <button type="submit" className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-lg shadow-green-600/30 transition-all">
                  Verify & Access Portal
                </button>
              </form>
            )}

            <p className="text-center text-xs text-gray-400 mt-6">
              Don't have an account? <Link to="/client-register" className="text-purple-600 font-semibold hover:underline">Create now</Link>
            </p>
          </div>

          {/* Toggle to secondary view */}
          <div className="absolute bottom-8 left-8 sm:left-12 xl:left-16 flex items-center gap-6 text-xs font-semibold text-gray-400">
            <button onClick={() => setView('secondary')} className="hover:text-gray-900 transition-colors">Staff Login</button>
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Docs</a>
          </div>
        </div>

        {/* Right Side: Marketing/Dark Panel */}
        <div className="hidden lg:flex flex-1 bg-[#0a0a0c] relative overflow-hidden flex-col items-center justify-center p-12">
          {/* Subtle gradient orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-xl text-center flex flex-col items-center">
            <h2 className="text-5xl xl:text-6xl font-bold text-white tracking-tight mb-1 leading-tight">
              Your entire <br/>business. <span className="text-purple-500">Unified.</span>
            </h2>
            
            {/* Mock Chat UI */}
            <div className="mt-12 w-full max-w-sm bg-[#111114] border border-white/5 rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">Athena ERP Assistant</p>
                  <p className="text-xs text-purple-400">Online</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-purple-600 text-white text-sm px-4 py-2 rounded-2xl rounded-tr-sm inline-block">
                    Can you generate the Q3 sales report?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-[#1c1c21] text-gray-300 text-sm px-4 py-2 rounded-2xl rounded-tl-sm inline-block max-w-[85%] border border-white/5">
                    Absolutely. Q3 revenue is up 15%. I've attached the full breakdown to your dashboard.
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-[#1c1c21] text-gray-300 text-sm px-4 py-2 rounded-2xl rounded-tl-sm inline-block max-w-[85%] border border-white/5">
                    10:45AM - Financial ledgers synced successfully.
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-purple-600 text-white text-sm px-4 py-2 rounded-2xl rounded-tr-sm inline-block">
                    Great, notify the finance team.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-12 w-full px-12 max-w-3xl flex justify-between text-white/40 text-sm font-medium">
            <div><p className="text-white font-bold text-xl mb-1">10K+</p><p>Active Users</p></div>
            <div><p className="text-white font-bold text-xl mb-1">50+</p><p>ERP Modules</p></div>
            <div><p className="text-white font-bold text-xl mb-1">99.9%</p><p>Uptime</p></div>
            <div><p className="text-white font-bold text-xl mb-1">24/7</p><p>Support</p></div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // DESIGN 2: DARK CARD (SECONDARY / STAFF LOGIN)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] font-sans p-4 relative overflow-hidden">
      {/* Background styling for secondary layout */}
      <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none"></div>
      
      <div className="absolute top-8 right-8">
        <button onClick={() => setView('main')} className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
          Switch to Admin Login
        </button>
      </div>

      <div className="w-full max-w-sm bg-[#111114] border border-white/10 rounded-[2rem] p-8 sm:p-10 shadow-2xl relative z-10 backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-600/20">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mb-1">Athena Staff Portal</h2>
          <p className="text-sm text-gray-400 font-medium">Sign in to your restricted workspace</p>
        </div>

        {error && <div className="text-red-400 text-sm mb-4 font-medium text-center">{error}</div>}
        {msg && <div className="text-green-400 text-sm mb-4 font-medium text-center">{msg}</div>}

        {step === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white text-sm placeholder-gray-600 transition-colors" placeholder="name@company.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Sub-Username (Staff)</label>
              <input type="text" required value={subUsername} onChange={(e) => setSubUsername(e.target.value)} className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white text-sm placeholder-gray-600 transition-colors" placeholder="jane.doe" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-gray-400">Password</label>
                <a href="#" className="text-xs font-semibold text-purple-400 hover:text-purple-300">Forgot password?</a>
              </div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white text-sm placeholder-gray-600 transition-colors" placeholder="••••••••" />
            </div>
            
            <button type="submit" className="w-full py-3 mt-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/20">
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center p-3 border border-purple-500/30 bg-purple-500/10 rounded-xl mb-2">
              <Mail className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-xs text-gray-300">Ask your Admin for the OTP sent to <b>{email}</b></p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 text-center">Secure OTP</label>
              <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-4 py-4 text-center tracking-[0.5em] font-mono text-xl bg-transparent border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white transition-colors" placeholder="000000" maxLength={6} />
            </div>
            <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-600/20">
              Verify OTP
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-4">Or Continue With</p>
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a1a1f] border border-white/5 hover:border-white/10 rounded-xl text-xs font-semibold text-gray-300 transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a1a1f] border border-white/5 hover:border-white/10 rounded-xl text-xs font-semibold text-gray-300 transition-colors">
              <Monitor className="w-3.5 h-3.5 text-[#00a4ef]" />
              Microsoft
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500 font-medium">
          Don't have an Athena account? <Link to="/client-register" className="text-purple-400 hover:text-purple-300 ml-1">Sign up now &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
