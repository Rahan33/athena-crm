import React from 'react';
import { MousePointer2, Activity, TrendingUp, Eye, Target, Users } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend
} from 'recharts';

const conversionData = [
  { name: 'Mon', original: 2.1, variant: 3.4 },
  { name: 'Tue', original: 2.3, variant: 3.8 },
  { name: 'Wed', original: 2.0, variant: 4.1 },
  { name: 'Thu', original: 2.5, variant: 3.9 },
  { name: 'Fri', original: 2.2, variant: 4.3 },
  { name: 'Sat', original: 2.8, variant: 4.5 },
  { name: 'Sun', original: 2.4, variant: 4.2 },
];

const funnelData = [
  { name: 'Total Visitors', count: 14500 },
  { name: 'Product View', count: 8200 },
  { name: 'Add to Cart', count: 3100 },
  { name: 'Checkout Initiated', count: 1800 },
  { name: 'Purchase Complete', count: 840 },
];

export default function PageSense() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">PageSense (A/B Testing & Funnels)</h1>
          <p className="text-sm text-gray-500">Real-time user behavior analytics and conversion optimization.</p>
        </div>
        <button className="bg-rose-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
          <Target className="w-4 h-4"/> New Experiment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* A/B Testing Live Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Activity className="w-5 h-5 text-rose-500"/> Checkout Button Color A/B Test</h3>
            <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-1 rounded">Running (72% Confidence)</span>
          </div>
          
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={conversionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVariant" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOriginal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(v) => v + '%'} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }}/>
                <Area type="monotone" name="Variant B (Green Button)" dataKey="variant" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVariant)" />
                <Area type="monotone" name="Variant A (Blue Button)" dataKey="original" stroke="#94a3b8" strokeWidth={3} fillOpacity={1} fill="url(#colorOriginal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel Dropoff Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-indigo-500"/> E-Commerce Funnel Dropoff</h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">Last 7 Days</span>
          </div>

          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontWeight: 600}} width={120} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         {/* Live Visitors Tracker */}
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
           <div>
             <div className="text-sm font-bold text-gray-500 mb-1">Live Visitors (Right Now)</div>
             <div className="text-4xl font-black text-gray-900 flex items-center gap-3">
               342 <span className="w-3 h-3 bg-rose-500 rounded-full animate-ping"></span>
             </div>
           </div>
           <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500"><Users className="w-8 h-8"/></div>
         </div>
      </div>
    </div>
  );
}
