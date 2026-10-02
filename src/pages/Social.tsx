import React from 'react';
import { Share2, ThumbsUp, MessageCircle, Twitter, Facebook, Linkedin, Plus } from 'lucide-react';

export default function Social() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Social Media Manager</h1>
          <p className="text-sm text-gray-500">Schedule posts and monitor engagement across all channels.</p>
        </div>
        <button className="bg-pink-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus className="w-4 h-4"/> New Post</button>
      </div>
      
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div><div className="text-xs font-bold text-gray-500 mb-1">Total Audience</div><div className="text-2xl font-black text-gray-900">45.2K</div></div>
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"><UsersIcon className="w-5 h-5 text-gray-600"/></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div><div className="text-xs font-bold text-gray-500 mb-1">Engagement Rate</div><div className="text-2xl font-black text-pink-600">4.8%</div></div>
          <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center"><ThumbsUp className="w-5 h-5 text-pink-600"/></div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">Upcoming Schedule</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 border border-gray-100 bg-gray-50 rounded-xl">
             <div className="bg-blue-600 p-2 rounded-lg text-white"><Linkedin className="w-5 h-5"/></div>
             <div className="flex-1">
               <div className="flex justify-between items-start mb-2">
                 <div className="font-bold text-gray-900 text-sm">Product Launch Announcement</div>
                 <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Tomorrow, 10:00 AM</div>
               </div>
               <p className="text-sm text-gray-600">We are thrilled to announce the launch of Athena Commerce 2.0! Built for speed and scale. ?? #SaaS #Launch</p>
             </div>
          </div>
          <div className="flex items-start gap-4 p-4 border border-gray-100 bg-gray-50 rounded-xl">
             <div className="bg-sky-500 p-2 rounded-lg text-white"><Twitter className="w-5 h-5"/></div>
             <div className="flex-1">
               <div className="flex justify-between items-start mb-2">
                 <div className="font-bold text-gray-900 text-sm">Thread: 5 ways to optimize workflow</div>
                 <div className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">Draft</div>
               </div>
               <p className="text-sm text-gray-600">Are you losing 15 hours a week to context switching? Here is how to fix it...</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// Temporary mock for missing icons in this block
const UsersIcon = ({className}: {className?: string}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
