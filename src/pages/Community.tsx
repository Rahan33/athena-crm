import React from 'react';
import { Users, Link as LinkIcon, MessageCircle } from 'lucide-react';

export default function Community() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brand Community</h1>
          <p className="text-sm text-gray-500">Manage your forums and link-in-bio pages.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-6"><Users className="w-5 h-5 text-indigo-600"/> Discussion Forum</h3>
          <div className="text-4xl font-black text-gray-900 mb-2">12,492</div>
          <div className="text-sm text-gray-500 font-bold mb-6">Active Members</div>
          <button className="w-full py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg">Moderate Posts</button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-6"><LinkIcon className="w-5 h-5 text-pink-600"/> Link-in-Bio Tracker</h3>
          <div className="text-4xl font-black text-gray-900 mb-2">84.2K</div>
          <div className="text-sm text-gray-500 font-bold mb-6">Link Clicks (30d)</div>
          <button className="w-full py-2 bg-pink-50 text-pink-700 font-bold rounded-lg">Edit Link Tree</button>
        </div>
      </div>
    </div>
  );
}
