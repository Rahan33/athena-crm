import React from 'react';
import { MapPin, Star, MessageSquare } from 'lucide-react';

export default function Publish() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Local Listings (Publish)</h1>
          <p className="text-sm text-gray-500">Sync Google My Business, Yelp, and Apple Maps.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
             <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600"><MapPin className="w-8 h-8"/></div>
             <div>
               <h2 className="text-xl font-bold text-gray-900">Athena HQ (San Francisco)</h2>
               <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">4.8 <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/> (128 Reviews)</div>
             </div>
           </div>
           <div className="text-right">
             <div className="text-sm font-bold text-gray-500 mb-1">Local SEO Score</div>
             <div className="text-3xl font-black text-green-600">92/100</div>
           </div>
        </div>
        <h3 className="font-bold text-gray-900 mb-4">Recent Reviews</h3>
        <div className="space-y-4">
           <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
             <div className="flex justify-between mb-2">
               <div className="font-bold text-sm text-gray-900">Google User</div>
               <div className="flex"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400"/><Star className="w-3 h-3 text-yellow-400 fill-yellow-400"/><Star className="w-3 h-3 text-yellow-400 fill-yellow-400"/><Star className="w-3 h-3 text-yellow-400 fill-yellow-400"/><Star className="w-3 h-3 text-yellow-400 fill-yellow-400"/></div>
             </div>
             <p className="text-sm text-gray-600 mb-3">Great software company. Support team is amazing.</p>
             <button className="text-xs font-bold text-blue-600 hover:underline">Reply to Review</button>
           </div>
        </div>
      </div>
    </div>
  );
}
