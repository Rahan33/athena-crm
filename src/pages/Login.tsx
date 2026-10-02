import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, ShieldCheck, Mail } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'employee' | 'client'>('employee');
  const [step, setStep] = useState<'login' | 'otp'>('login');
  
  // Employee State
  const [username, setUsername] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  
  // Client State
  const [email, setEmail] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: empPassword })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError('Network error or server is down');
    }
  };

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      const res = await fetch('/api/auth/company-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: clientPassword })
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Tabs */}
        <div className="flex border-b border-gray-200">
          <button 
            onClick={() => { setTab('employee'); setStep('login'); setError(''); }}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${tab === 'employee' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
          >
            <ShieldCheck className="w-4 h-4" />
            Employee Login
          </button>
          <button 
            onClick={() => { setTab('client'); setStep('login'); setError(''); }}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${tab === 'client' ? 'bg-purple-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
          >
            <Building2 className="w-4 h-4" />
            Client Portal
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className={`text-2xl font-black ${tab === 'employee' ? 'text-blue-600' : 'text-purple-600'}`}>
              {tab === 'employee' ? 'Athena Workspace' : 'Client Access Portal'}
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              {tab === 'employee' ? 'Sign in to your internal employee dashboard' : 'Secure OTP login for registered companies'}
            </p>
          </div>
          
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 font-semibold text-center">{error}</div>}
          {msg && <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4 font-semibold text-center">{msg}</div>}

          {tab === 'employee' ? (
            <form onSubmit={handleEmployeeLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="admin" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                <input type="password" required value={empPassword} onChange={(e) => setEmpPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all">
                Secure Sign In
              </button>
            </form>
          ) : step === 'login' ? (
            <form onSubmit={handleClientLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Company Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all" placeholder="billing@company.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                <input type="password" required value={clientPassword} onChange={(e) => setClientPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-all">
                Send OTP to Email
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100 mb-4">
                <Mail className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-purple-800 font-medium">We sent a 6-digit code to <b>{email}</b></p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 text-center">Enter Secure OTP</label>
                <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-4 py-4 text-center text-2xl tracking-widest font-mono bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all" placeholder="000000" maxLength={6} />
              </div>
              <button type="submit" className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-all">
                Verify & Login
              </button>
              <button type="button" onClick={() => setStep('login')} className="w-full py-2 text-sm text-gray-500 hover:text-gray-800 font-semibold">
                Back to Login
              </button>
            </form>
          )}

          {tab === 'client' && step === 'login' && (
            <div className="mt-6 text-center text-sm text-gray-600">
              New client?{' '}
              <Link to="/client-register" className="text-purple-600 font-bold hover:underline">
                Register Company
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
