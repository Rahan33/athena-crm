import React from 'react';
import { CalendarDays, Video, Users, Ticket } from 'lucide-react';

export default function Backstage() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backstage Events</h1>
          <p className="text-sm text-gray-500">Webinars, Conferences, and Virtual Events.</p>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold">Create Event</button>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-900 h-32 flex items-center justify-center relative">
             <Video className="w-12 h-12 text-white opacity-20 absolute"/>
             <h2 className="text-2xl font-black text-white relative z-10">Athena Developer Summit 2026</h2>
          </div>
          <div className="p-6">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 bg-gray-50 p-3 rounded-lg text-center"><div className="text-xl font-black text-gray-900">4,290</div><div className="text-xs text-gray-500 font-bold uppercase">Registrations</div></div>
              <div className="flex-1 bg-gray-50 p-3 rounded-lg text-center"><div className="text-xl font-black text-green-600"></div><div className="text-xs text-gray-500 font-bold uppercase">Ticket Revenue</div></div>
            </div>
            <button className="w-full py-2 bg-purple-50 text-purple-700 font-bold rounded-lg">Manage Event</button>
          </div>
        </div>
      </div>
    </div>
  );
}
