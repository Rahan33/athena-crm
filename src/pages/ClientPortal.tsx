import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Building2, Ticket, FileText, Users, Lock, CreditCard, ShieldAlert, Check } from 'lucide-react';

export default function ClientPortal() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const [activeTab, setActiveTab] = useState<'dashboard' | 'team'>('dashboard');
  const [showPaywall, setShowPaywall] = useState(false);
  
  // Team Management State
  const [subUsers, setSubUsers] = useState<any[]>([]);
  const [newSubUser, setNewSubUser] = useState({ username: '', password: '', permissions: [] as string[] });

  useEffect(() => {
    if (user && user.role === 'CompanyAdmin') {
      // In a real app, fetch subusers from /api/auth/company-details
      fetch(`/api/auth/company-details?email=${user.email}&password=${user.password}`)
        .then(res => res.json())
        .then(data => {
          if (data.company) setSubUsers(data.company.subUsers || []);
        });
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const hasPermission = (module: string) => {
    if (user?.role === 'CompanyAdmin') return true;
    if (user?.permissions?.includes('all')) return true;
    return user?.permissions?.includes(module);
  };

  const handleAddSubUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subUsers.length >= 4) {
      setShowPaywall(true);
      return;
    }

    try {
      const res = await fetch('/api/auth/add-subuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          adminPassword: user.password,
          subUsername: newSubUser.username,
          subPassword: newSubUser.password,
          permissions: newSubUser.permissions
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSubUsers(data.subUsers);
        setNewSubUser({ username: '', password: '', permissions: [] });
      } else if (res.status === 403) {
        setShowPaywall(true);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Error adding user');
    }
  };

  const togglePermission = (perm: string) => {
    setNewSubUser(prev => {
      if (prev.permissions.includes(perm)) {
        return { ...prev, permissions: prev.permissions.filter(p => p !== perm) };
      } else {
        return { ...prev, permissions: [...prev.permissions, perm] };
      }
    });
  };

  if (!user || (user.role !== 'CompanyAdmin' && user.role !== 'CompanyMember')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Unauthorized Access</h2>
          <button onClick={() => navigate('/login')} className="mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md">Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Building2 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-800">{user.companyName} Portal</h1>
            <p className="text-sm text-gray-500 font-medium">Logged in as: <span className="text-purple-600">{user.role === 'CompanyAdmin' ? 'Admin' : user.username}</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {user.role === 'CompanyAdmin' && (
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === 'dashboard' ? 'bg-white shadow-sm text-purple-700' : 'text-gray-500'}`}>Dashboard</button>
              <button onClick={() => setActiveTab('team')} className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === 'team' ? 'bg-white shadow-sm text-purple-700' : 'text-gray-500'}`}>Team Access</button>
            </div>
          )}
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 mt-8">
        
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hasPermission('tickets') ? (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                <Ticket className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-lg font-bold text-gray-800">Support Tickets</h3>
                <p className="text-sm text-gray-500 mb-4">View and track your active support requests.</p>
                <button className="text-sm font-bold text-blue-600 hover:underline">View Tickets &rarr;</button>
              </div>
            ) : (
              <div className="bg-gray-100 p-6 rounded-2xl border border-gray-200 opacity-60 flex flex-col items-center justify-center text-center">
                <Lock className="w-8 h-8 text-gray-400 mb-2" />
                <h3 className="text-sm font-bold text-gray-500">Access Restricted</h3>
                <p className="text-xs text-gray-400">You do not have permission to view Tickets.</p>
              </div>
            )}
            
            {hasPermission('invoices') ? (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                <FileText className="w-8 h-8 text-emerald-500 mb-4" />
                <h3 className="text-lg font-bold text-gray-800">Invoices & Billing</h3>
                <p className="text-sm text-gray-500 mb-4">Download past invoices and check payment status.</p>
                <button className="text-sm font-bold text-emerald-600 hover:underline">View Invoices &rarr;</button>
              </div>
            ) : (
              <div className="bg-gray-100 p-6 rounded-2xl border border-gray-200 opacity-60 flex flex-col items-center justify-center text-center">
                <Lock className="w-8 h-8 text-gray-400 mb-2" />
                <h3 className="text-sm font-bold text-gray-500">Access Restricted</h3>
                <p className="text-xs text-gray-400">You do not have permission to view Invoices.</p>
              </div>
            )}

            {hasPermission('offers') ? (
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-6 rounded-2xl shadow-md text-white hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="text-lg font-bold mb-2">Special Offers</h3>
                <p className="text-sm text-purple-100 mb-4">Because your email is verified, you are eligible for an exclusive 20% discount on your next renewal!</p>
                <button className="px-4 py-2 bg-white text-purple-700 text-sm font-black rounded-lg shadow-sm">Claim Offer</button>
              </div>
            ) : (
               <div className="bg-gray-100 p-6 rounded-2xl border border-gray-200 opacity-60 flex flex-col items-center justify-center text-center">
                <Lock className="w-8 h-8 text-gray-400 mb-2" />
                <h3 className="text-sm font-bold text-gray-500">Access Restricted</h3>
              </div>
            )}
          </div>
        )}

        {activeTab === 'team' && user.role === 'CompanyAdmin' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2"><Users className="w-6 h-6 text-purple-600"/> Team Access Management</h2>
                <p className="text-gray-500 text-sm mt-1">Strictly control which modules your staff can access.</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-700">Licenses Used</p>
                <p className="text-2xl font-black text-purple-600">{subUsers.length} <span className="text-lg text-gray-400">/ 4</span></p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Add Sub-User</h3>
                <form onSubmit={handleAddSubUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Sub-Username</label>
                    <input type="text" required value={newSubUser.username} onChange={(e) => setNewSubUser({...newSubUser, username: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="jane.doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                    <input type="password" required value={newSubUser.password} onChange={(e) => setNewSubUser({...newSubUser, password: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="••••••••" />
                  </div>
                  
                  <div className="pt-2">
                    <label className="block text-sm font-bold text-gray-700 mb-3">Strict Module Access</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" checked={newSubUser.permissions.includes('tickets')} onChange={() => togglePermission('tickets')} className="w-4 h-4 text-purple-600 focus:ring-purple-500 rounded" />
                        <span className="text-sm font-semibold text-gray-700">Support Tickets</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" checked={newSubUser.permissions.includes('invoices')} onChange={() => togglePermission('invoices')} className="w-4 h-4 text-purple-600 focus:ring-purple-500 rounded" />
                        <span className="text-sm font-semibold text-gray-700">Invoices & Billing</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" checked={newSubUser.permissions.includes('offers')} onChange={() => togglePermission('offers')} className="w-4 h-4 text-purple-600 focus:ring-purple-500 rounded" />
                        <span className="text-sm font-semibold text-gray-700">Special Offers & Marketing</span>
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3 mt-4 bg-gray-900 hover:bg-black text-white font-bold rounded-lg shadow-md transition-all">
                    Create Sub-User
                  </button>
                </form>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Active Staff Members</h3>
                {subUsers.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-sm text-gray-500 font-medium">No sub-users created yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {subUsers.map((su, idx) => (
                      <div key={idx} className="p-4 border border-gray-200 rounded-xl flex items-center justify-between bg-gray-50 hover:bg-white transition-colors">
                        <div>
                          <p className="font-bold text-gray-800">{su.username}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Access: {su.permissions.length > 0 ? su.permissions.join(', ') : 'None'}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">Active</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <button onClick={() => setShowPaywall(true)} className="w-full mt-6 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Unlock Premium Modules ($49/mo)
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Paywall Modal Simulator */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-gray-900 p-6 text-center">
              <Lock className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <h3 className="text-2xl font-black text-white">Upgrade Required</h3>
              <p className="text-gray-400 text-sm mt-2">You have reached a limit or tried to access a Premium feature.</p>
            </div>
            
            <div className="p-8">
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 font-medium">Unlimited Sub-Users</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 font-medium">Advanced API Access</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 font-medium">Dedicated Account Manager</span>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-700">Enterprise License</span>
                  <span className="font-black text-xl text-gray-900">$49<span className="text-sm font-medium text-gray-500">/mo</span></span>
                </div>
                <p className="text-xs text-gray-500">Billed monthly. Cancel anytime.</p>
              </div>

              <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mb-3">
                <CreditCard className="w-5 h-5" /> Pay with Stripe
              </button>
              <button onClick={() => setShowPaywall(false)} className="w-full py-2 text-gray-500 font-bold hover:text-gray-800">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
