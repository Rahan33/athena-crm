import React, { useState } from 'react';
import { ShoppingBag, Package, Users, BarChart3, Settings, Plus, Search, Tag, Eye, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function ECommerce() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">eCommerce Storefront</h1>
            <p className="text-xs text-green-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Store is Live (athenastore.com)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4" /> View Store
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm shadow-sm">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
          <div className="p-4 space-y-1">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'orders', name: 'Orders', icon: ShoppingBag },
              { id: 'products', name: 'Products', icon: Package },
              { id: 'customers', name: 'Customers', icon: Users },
              { id: 'discounts', name: 'Discounts', icon: Tag },
              { id: 'settings', name: 'Store Settings', icon: Settings }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="text-gray-500 font-bold text-sm mb-2">Total Sales</div>
              <div className="flex items-end gap-3">
                <div className="text-3xl font-black text-gray-900">$24,592.00</div>
                <div className="text-sm font-bold text-green-600 flex items-center mb-1"><ArrowUpRight className="w-4 h-4"/> 14%</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="text-gray-500 font-bold text-sm mb-2">Active Sessions</div>
              <div className="flex items-end gap-3">
                <div className="text-3xl font-black text-gray-900">342</div>
                <div className="text-sm font-bold text-green-600 flex items-center mb-1"><ArrowUpRight className="w-4 h-4"/> 5%</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="text-gray-500 font-bold text-sm mb-2">Conversion Rate</div>
              <div className="flex items-end gap-3">
                <div className="text-3xl font-black text-gray-900">3.2%</div>
                <div className="text-sm font-bold text-red-500 flex items-center mb-1">-0.4%</div>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Recent Online Orders</h3>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input type="text" placeholder="Search orders..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-200 text-xs uppercase text-gray-500 font-black tracking-wider">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Fulfillment</th>
                    <th className="p-4">Total</th>
                  </tr>
                 </thead>
                 <tbody className="text-sm">
                   <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                     <td className="p-4 font-bold text-indigo-600">#ORD-8991</td>
                     <td className="p-4 font-semibold text-gray-900">Samantha Miller</td>
                     <td className="p-4 text-gray-500">Today, 10:42 AM</td>
                     <td className="p-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-bold text-xs">Unfulfilled</span></td>
                     <td className="p-4 font-bold">$129.99</td>
                   </tr>
                   <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                     <td className="p-4 font-bold text-indigo-600">#ORD-8990</td>
                     <td className="p-4 font-semibold text-gray-900">David Chen</td>
                     <td className="p-4 text-gray-500">Today, 09:15 AM</td>
                     <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded font-bold text-xs flex items-center w-max gap-1"><CheckCircle2 className="w-3 h-3"/> Shipped</span></td>
                     <td className="p-4 font-bold">$49.50</td>
                   </tr>
                 </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
