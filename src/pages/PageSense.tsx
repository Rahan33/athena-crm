import React from 'react';
import { MousePointer2, Activity, LayoutDashboard, Eye } from 'lucide-react';

export default function PageSense() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">PageSense (A/B & Heatmaps)</h1>
          <p className="text-sm text-gray-500">Track user behavior and optimize conversions.</p>
        </div>
        <button className="bg-rose-600 text-white px-4 py-2 rounded-lg font-bold">New Experiment</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Live A/B Tests</h3>
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
             <div className="flex justify-between items-center mb-4">
               <div className="font-bold text-rose-900">Checkout Button Color</div>
               <div className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-1 rounded">Running (72% Confidence)</div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-4 rounded-lg shadow-sm">
                 <div className="text-xs text-gray-500 font-bold">Variant A (Original - Blue)</div>
                 <div className="text-2xl font-black text-gray-900 mt-1">2.4% <span className="text-xs font-normal text-gray-500">Conv. Rate</span></div>
               </div>
               <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-rose-500">
                 <div className="text-xs text-rose-600 font-bold">Variant B (Challenger - Green)</div>
                 <div className="text-2xl font-black text-rose-600 mt-1">3.8% <span className="text-xs font-normal text-rose-500">Conv. Rate</span></div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
