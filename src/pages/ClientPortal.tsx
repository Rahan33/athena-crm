import { useNavigate } from 'react-router-dom';
import { LogOut, Building2, Ticket, FileText } from 'lucide-react';

export default function ClientPortal() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user || user.role !== 'Client') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">Unauthorized Access</h2>
          <button onClick={() => navigate('/login')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Building2 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-800">{user.companyName} Portal</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" />
          Secure Logout
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <Ticket className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-lg font-bold text-gray-800">Support Tickets</h3>
            <p className="text-sm text-gray-500 mb-4">View and track your active support requests.</p>
            <button className="text-sm font-bold text-blue-600 hover:underline">View Tickets &rarr;</button>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <FileText className="w-8 h-8 text-emerald-500 mb-4" />
            <h3 className="text-lg font-bold text-gray-800">Invoices & Billing</h3>
            <p className="text-sm text-gray-500 mb-4">Download past invoices and check payment status.</p>
            <button className="text-sm font-bold text-emerald-600 hover:underline">View Invoices &rarr;</button>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-6 rounded-2xl shadow-md text-white">
            <h3 className="text-lg font-bold mb-2">Special Offers</h3>
            <p className="text-sm text-purple-100 mb-4">Because your email is verified, you are eligible for an exclusive 20% discount on your next renewal!</p>
            <button className="px-4 py-2 bg-white text-purple-700 text-sm font-black rounded-lg shadow-sm">Claim Offer</button>
          </div>
        </div>
      </main>
    </div>
  );
}
