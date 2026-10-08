import React, { useState, useEffect } from 'react';
import { CreditCard, ArrowUpRight, Settings, CheckCircle2, TrendingUp, XCircle, RefreshCw, Plus, Copy, Search, ShieldCheck, Link2 } from 'lucide-react';

export default function Payments() {
  const [activeTab, setActiveTab] = useState('transactions');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Link Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkData, setLinkData] = useState({ amount: '', description: '' });

  useEffect(() => {
    fetchTransactions();
    fetchLinks();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/payments/transactions');
      const data = await res.json();
      if (data.success) setTransactions(data.transactions);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/payments/links');
      const data = await res.json();
      if (data.success) setLinks(data.links);
    } catch (e) {
      console.error(e);
    }
  };

  const simulatePayment = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/payments/simulate', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`Incoming Payment Received!\nSource: ${data.transaction.source}\nAmount: $${data.transaction.amount}\n\nThe Unified Ledger has been updated.`);
        fetchTransactions();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const issueRefund = async (id: string) => {
    if (!window.confirm("Are you sure you want to refund this transaction?")) return;
    try {
      const res = await fetch(`/api/payments/transactions/${id}/refund`, { method: 'POST' });
      const data = await res.json();
      if (data.success) fetchTransactions();
    } catch (e) {
      console.error(e);
    }
  };

  const createPaymentLink = async () => {
    try {
      const res = await fetch('/api/payments/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(linkData)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setLinkData({ amount: '', description: '' });
        fetchLinks();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-50 overflow-hidden relative">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-200">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Unified Payments</h1>
            <p className="text-sm text-blue-600 font-bold flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
              Secure Banking & Settlements Gateway
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={simulatePayment} 
            disabled={isLoading}
            className="px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-md flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Simulate Incoming Payment
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
          <div className="p-4 space-y-1.5 mt-2">
            {[
              { id: 'transactions', name: 'Master Ledger', icon: CreditCard },
              { id: 'links', name: 'Payment Links', icon: Link2 },
              { id: 'settlements', name: 'Settlements', icon: TrendingUp },
              { id: 'settings', name: 'Gateway Settings', icon: Settings }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50' 
                    : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`} />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8">
          
          {(activeTab === 'transactions') && (
            <div className="max-w-6xl mx-auto space-y-6">
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                  <div className="text-gray-500 font-bold text-sm mb-3">Total Volume (Today)</div>
                  <div className="flex items-end gap-3">
                    <div className="text-4xl font-black text-gray-900">$18,492.50</div>
                    <div className="text-sm font-bold text-emerald-600 flex items-center mb-1.5 bg-emerald-50 px-2 py-0.5 rounded-md"><ArrowUpRight className="w-3.5 h-3.5 mr-1"/> 12%</div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                  <div className="text-gray-500 font-bold text-sm mb-3">Successful Transactions</div>
                  <div className="flex items-end gap-3">
                    <div className="text-3xl font-black text-blue-600">{transactions.filter(t => t.status === 'Success').length}</div>
                    <div className="text-sm font-bold text-gray-500 mb-1.5">Processed</div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                  <div className="text-gray-500 font-bold text-sm mb-3">Pending Settlements</div>
                  <div className="flex items-end gap-3">
                    <div className="text-4xl font-black text-gray-900">$4,120.00</div>
                    <div className="text-sm font-bold text-blue-600 flex items-center mb-1.5 bg-blue-50 px-2 py-0.5 rounded-md">Clears Tomorrow</div>
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                  <h3 className="font-black text-xl text-gray-900">Universal Ledger</h3>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input type="text" placeholder="Search Txn ID..." className="pl-9 pr-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-black tracking-wider">
                        <th className="p-5 pl-6">Transaction ID</th>
                        <th className="p-5">Source</th>
                        <th className="p-5">Customer</th>
                        <th className="p-5">Status</th>
                        <th className="p-5">Amount</th>
                        <th className="p-5 pr-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {transactions.map(txn => (
                        <tr key={txn.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                          <td className="p-5 pl-6 font-black text-blue-600">{txn.transactionId}</td>
                          <td className="p-5">
                            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg font-bold text-xs">{txn.source}</span>
                          </td>
                          <td className="p-5 font-bold text-gray-700">{txn.customerName}</td>
                          <td className="p-5">
                            {txn.status === 'Success' && <span className="text-emerald-700 font-bold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Success</span>}
                            {txn.status === 'Refunded' && <span className="text-orange-700 font-bold flex items-center gap-1.5"><RefreshCw className="w-4 h-4 text-orange-500"/> Refunded</span>}
                          </td>
                          <td className="p-5 font-black text-gray-900 text-lg">${parseFloat(txn.amount || 0).toFixed(2)}</td>
                          <td className="p-5 pr-6 text-right">
                            {txn.status === 'Success' && (
                              <button onClick={() => issueRefund(txn.id)} className="text-xs font-bold text-gray-500 hover:text-red-600 transition-colors">Issue Refund</button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {transactions.length === 0 && (
                        <tr><td colSpan={6} className="p-12 text-center text-gray-400 font-medium text-lg">No transactions yet. Click Simulate to generate one!</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'links') && (
            <div className="max-w-6xl mx-auto space-y-6">
              
              <div className="bg-gradient-to-r from-blue-800 to-indigo-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden flex justify-between items-center">
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-3xl font-black mb-3">Payment Links</h2>
                  <p className="text-blue-100/90 text-lg font-medium leading-relaxed">
                    Generate secure checkout links to send via WhatsApp, Email, or SMS. Customers can pay using Card, UPI, or NetBanking instantly.
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="relative z-10 bg-white text-blue-900 font-black px-6 py-3 rounded-xl shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Plus className="w-5 h-5" /> Create Link
                </button>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-white">
                  <h3 className="font-black text-xl text-gray-900">Active Links</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-black tracking-wider">
                        <th className="p-5 pl-6">Link ID</th>
                        <th className="p-5">Description</th>
                        <th className="p-5">Amount</th>
                        <th className="p-5">Status</th>
                        <th className="p-5 pr-6 text-right">Copy Link</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {links.map(link => (
                        <tr key={link.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                          <td className="p-5 pl-6 font-black text-blue-600">{link.linkId}</td>
                          <td className="p-5 font-bold text-gray-700">{link.description}</td>
                          <td className="p-5 font-black text-gray-900 text-lg">${parseFloat(link.amount || 0).toFixed(2)}</td>
                          <td className="p-5">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-bold text-xs">{link.status}</span>
                          </td>
                          <td className="p-5 pr-6 text-right">
                            <button onClick={() => copyToClipboard(link.url)} className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors inline-block">
                              <Copy className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {links.length === 0 && (
                        <tr><td colSpan={5} className="p-12 text-center text-gray-400 font-medium text-lg">No payment links created yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Create Link Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="font-black text-xl text-gray-900">Create Payment Link</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-gray-100 p-1.5 rounded-full"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">Amount ($)</label>
                <input type="number" step="0.01" value={linkData.amount} onChange={e => setLinkData({...linkData, amount: e.target.value})} className="w-full p-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white font-medium outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">Description / Invoice Note</label>
                <input type="text" value={linkData.description} onChange={e => setLinkData({...linkData, description: e.target.value})} className="w-full p-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white font-medium outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Website Design Deposit" />
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 font-bold text-gray-600 hover:bg-gray-200 rounded-xl">Cancel</button>
              <button onClick={createPaymentLink} className="px-5 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm flex items-center gap-2"><Link2 className="w-4 h-4"/> Generate Link</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
