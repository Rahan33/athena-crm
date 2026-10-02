import React, { useState } from 'react';
import { CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, Search, Download, Filter, FileText, CheckCircle2, Clock } from 'lucide-react';

export default function Payments() {
  const [activeTab, setActiveTab] = useState('transactions');

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Unified Payment Gateway</h1>
            <p className="text-xs text-gray-500 font-medium">Stripe, Razorpay, & PayPal Integrations</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm shadow-sm">
            <DollarSign className="w-4 h-4" /> Create Payment Link
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="text-gray-500 font-bold text-sm mb-2">Net Volume (30d)</div>
            <div className="flex items-end gap-3">
              <div className="text-3xl font-black text-gray-900">$142,390</div>
              <div className="text-sm font-bold text-green-600 flex items-center mb-1"><ArrowUpRight className="w-4 h-4"/> 12.5%</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="text-gray-500 font-bold text-sm mb-2">Successful Payments</div>
            <div className="flex items-end gap-3">
              <div className="text-3xl font-black text-gray-900">1,204</div>
              <div className="text-sm font-bold text-green-600 flex items-center mb-1"><ArrowUpRight className="w-4 h-4"/> 8%</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="text-gray-500 font-bold text-sm mb-2">Refunds</div>
            <div className="flex items-end gap-3">
              <div className="text-3xl font-black text-gray-900">$1,420</div>
              <div className="text-sm font-bold text-red-500 flex items-center mb-1"><ArrowDownRight className="w-4 h-4"/> 2.1%</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 bg-gradient-to-br from-emerald-500 to-teal-700 text-white border-transparent">
            <div className="text-emerald-100 font-bold text-sm mb-2">Available Balance</div>
            <div className="flex items-end gap-3">
              <div className="text-3xl font-black text-white">$45,290.50</div>
            </div>
            <button className="mt-4 w-full py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold text-sm transition-colors backdrop-blur-sm">
              Payout to Bank
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="border-b border-gray-200 p-2 flex items-center gap-2 bg-gray-50/50">
            {['Transactions', 'Payment Links', 'Subscriptions', 'Refunds', 'Disputes'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === tab.toLowerCase() ? 'bg-white text-emerald-700 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input type="text" placeholder="Search by email, card, or ID..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-black tracking-wider">
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                </tr>
               </thead>
               <tbody className="text-sm">
                 <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                   <td className="p-4 font-black text-gray-900">$4,500.00</td>
                   <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold text-xs flex items-center w-max gap-1"><CheckCircle2 className="w-3 h-3"/> Succeeded</span></td>
                   <td className="p-4 text-gray-600">Invoice #INV-2026-098</td>
                   <td className="p-4 font-semibold text-gray-900">cloud_services@stripe.com</td>
                   <td className="p-4 text-gray-500">Oct 02, 10:42 AM</td>
                 </tr>
                 <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                   <td className="p-4 font-black text-gray-900">$129.99</td>
                   <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold text-xs flex items-center w-max gap-1"><CheckCircle2 className="w-3 h-3"/> Succeeded</span></td>
                   <td className="p-4 text-gray-600">eCommerce Checkout</td>
                   <td className="p-4 font-semibold text-gray-900">s.miller@gmail.com</td>
                   <td className="p-4 text-gray-500">Oct 02, 10:30 AM</td>
                 </tr>
                 <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                   <td className="p-4 font-black text-gray-900">$890.00</td>
                   <td className="p-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-bold text-xs flex items-center w-max gap-1"><Clock className="w-3 h-3"/> Pending</span></td>
                   <td className="p-4 text-gray-600">Payment Link (Consulting)</td>
                   <td className="p-4 font-semibold text-gray-900">mike.robinson@acme.co</td>
                   <td className="p-4 text-gray-500">Oct 02, 09:15 AM</td>
                 </tr>
               </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
