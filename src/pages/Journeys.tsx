import React from 'react';
import { Workflow, Play, Clock, Mail } from 'lucide-react';

export default function Journeys() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Marketing Journeys</h1>
          <p className="text-xs text-gray-500">Visual automation builder.</p>
        </div>
        <button className="bg-amber-500 text-white px-4 py-2 rounded-lg font-bold">Launch Journey</button>
      </div>
      <div className="flex-1 bg-slate-100 p-8 flex justify-center items-start overflow-y-auto">
        <div className="flex flex-col items-center">
           <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm w-64 text-center z-10">
             <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-2"><Play className="w-4 h-4"/></div>
             <div className="font-bold text-gray-900 text-sm">Trigger: Cart Abandoned</div>
           </div>
           <div className="w-0.5 h-8 bg-gray-400"></div>
           <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm w-64 text-center z-10">
             <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2"><Clock className="w-4 h-4"/></div>
             <div className="font-bold text-gray-900 text-sm">Delay: 4 Hours</div>
           </div>
           <div className="w-0.5 h-8 bg-gray-400"></div>
           <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm w-64 text-center z-10">
             <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2"><Mail className="w-4 h-4"/></div>
             <div className="font-bold text-gray-900 text-sm">Action: Send Promo Email</div>
           </div>
        </div>
      </div>
    </div>
  );
}
