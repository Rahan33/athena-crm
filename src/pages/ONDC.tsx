import React from 'react';
import { ShoppingBag, ArrowRightLeft, Globe, TrendingUp, Search, Activity, Settings, Package, MapPin, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ONDC() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-50 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ONDC Network Manager</h1>
            <p className="text-xs text-green-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Live Sync Active (Buyer & Seller Apps)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm">
            <Settings className="w-4 h-4" /> Gateway Settings
          </button>
          <button className="px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm shadow-sm">
            <ArrowRightLeft className="w-4 h-4" /> Test Transaction
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full">
        {/* Network Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center border-4 border-green-50">
              <ShieldCheck className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Athena Seller Node is Verified</h2>
              <p className="text-sm text-gray-500">Your catalog is currently visible on Paytm, Magicpin, and PhonePe via ONDC.</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="text-center px-4 border-r border-gray-200">
               <div className="text-3xl font-black text-slate-900">1,204</div>
               <div className="text-xs font-bold text-gray-500 uppercase mt-1">Catalog Items</div>
             </div>
             <div className="text-center px-4">
               <div className="text-3xl font-black text-green-600">99.9%</div>
               <div className="text-xs font-bold text-gray-500 uppercase mt-1">Uptime</div>
             </div>
          </div>
        </div>

        {/* Dashboard Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Broadcasts */}
          <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" /> 
                Live Network Broadcasts
              </h3>
              <button className="text-sm font-bold text-blue-600 hover:underline">View All</button>
            </div>
            <div className="space-y-4 overflow-y-auto flex-1">
              {[
                { id: 'on_search', buyer: 'Paytm ONDC', type: 'Search Intent', item: 'Wireless Headphones', location: 'Bengaluru, KA', time: 'Just now' },
                { id: 'on_select', buyer: 'Magicpin', type: 'Add to Cart', item: 'Office Chair', location: 'Mumbai, MH', time: '2 mins ago' },
                { id: 'on_init', buyer: 'PhonePe', type: 'Checkout Init', item: 'Office Chair', location: 'Mumbai, MH', time: '3 mins ago' }
              ].map((b, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div>
                      <div className="font-bold text-sm text-gray-900">{b.type} <span className="text-gray-400 font-normal">from</span> {b.buyer}</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <Package className="w-3 h-3"/> {b.item} 
                        <span className="text-gray-300">|</span> 
                        <MapPin className="w-3 h-3"/> {b.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-gray-400">{b.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Error / Alert Feed */}
          <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-red-500" /> 
              Network Exceptions
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto">
               <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                 <div className="text-xs font-bold text-red-800 mb-1">Logistics Provider Failed</div>
                 <div className="text-xs text-red-600">Dunzo network rejected SLA for order #ONDC-992. Falling back to Shadowfax.</div>
               </div>
               <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                 <div className="text-xs font-bold text-yellow-800 mb-1">Pricing Mismatch</div>
                 <div className="text-xs text-yellow-700">Buyer app generated checkout signature with outdated pricing for item ID: 4922.</div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
