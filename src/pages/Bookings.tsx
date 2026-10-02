import React from 'react';
import { Calendar as CalendarIcon, Clock, Users, Globe, Link2, Copy } from 'lucide-react';

export default function Bookings() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Bookings & Appointments</h1>
          <p className="text-xs text-gray-500">Manage your public scheduling pages.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">New Event Type</button>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-8">
           <img src="https://ui-avatars.com/api/?name=John+Doe&background=2563eb&color=fff" className="w-16 h-16 rounded-full" />
           <div>
             <h2 className="text-2xl font-black text-gray-900">John Doe</h2>
             <a href="#" className="text-blue-600 font-bold hover:underline flex items-center gap-1"><Link2 className="w-4 h-4"/> athena.com/johndoe</a>
           </div>
        </div>
        
        <h3 className="font-bold text-gray-900 mb-4">Active Event Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 relative group border-t-4 border-t-blue-500">
              <div className="absolute top-4 right-4"><button className="text-gray-400 hover:text-gray-600"><Copy className="w-5 h-5"/></button></div>
              <h3 className="text-xl font-black text-gray-900 mb-2">30 Minute Meeting</h3>
              <p className="text-gray-500 font-bold flex items-center gap-2 text-sm mb-4"><Clock className="w-4 h-4"/> 30 mins <Globe className="w-4 h-4 ml-2"/> Web conferencing</p>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                 <button className="text-blue-600 font-bold text-sm">View booking page</button>
                 <button className="px-4 py-1.5 border border-gray-200 font-bold text-sm rounded-lg hover:bg-gray-50">Share</button>
              </div>
           </div>
           
           <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 relative group border-t-4 border-t-purple-500">
              <div className="absolute top-4 right-4"><button className="text-gray-400 hover:text-gray-600"><Copy className="w-5 h-5"/></button></div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Discovery Call</h3>
              <p className="text-gray-500 font-bold flex items-center gap-2 text-sm mb-4"><Clock className="w-4 h-4"/> 15 mins <Globe className="w-4 h-4 ml-2"/> Phone call</p>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                 <button className="text-blue-600 font-bold text-sm">View booking page</button>
                 <button className="px-4 py-1.5 border border-gray-200 font-bold text-sm rounded-lg hover:bg-gray-50">Share</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
