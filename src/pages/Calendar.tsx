import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Users, Clock, MapPin, Video, MoreHorizontal } from 'lucide-react';

export default function Calendar() {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  return (
    <div className="h-[calc(100vh-4rem)] bg-white flex flex-col rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Calendar Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setView('month')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'month' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setView('week')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'week' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Week
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-gray-900 min-w-[140px] text-center">October 2026</h2>
            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-colors">
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar (Mini Calendar & Categories) */}
        <div className="w-64 border-r border-gray-200 p-4 hidden lg:block bg-gray-50">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">My Calendars</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Personal</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500" />
              <span className="text-sm text-gray-700">Work & Meetings</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500" />
              <span className="text-sm text-gray-700">Project Deadlines</span>
            </label>
          </div>

          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-8 mb-4">Upcoming</h3>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-xs font-bold text-blue-600 mb-1">Tomorrow, 10:00 AM</div>
              <div className="text-sm font-semibold text-gray-900">Q4 Strategy Sync</div>
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                <Video className="w-3 h-3" /> Zoom Link
              </div>
            </div>
          </div>
        </div>

        {/* Grid View (Mockup for Month view) */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            {/* Days of week */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-white py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                {day}
              </div>
            ))}
            
            {/* Days Grid - Generating 35 cells for a typical month view */}
            {Array.from({ length: 35 }).map((_, i) => {
              const day = i - 2; // Offset to start at Oct 1st
              const isCurrentMonth = day > 0 && day <= 31;
              const isToday = day === 2; // Mocking today as Oct 2
              
              return (
                <div key={i} className={`min-h-[120px] bg-white p-2 transition-colors hover:bg-gray-50 ${!isCurrentMonth ? 'opacity-50 bg-gray-50' : ''}`}>
                  <div className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>
                    {day > 0 ? (day > 31 ? day - 31 : day) : 30 + day}
                  </div>
                  
                  {/* Mock Events */}
                  {day === 2 && (
                    <div className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded truncate mb-1 border border-purple-200">
                      10:00 AM Sync
                    </div>
                  )}
                  {day === 5 && (
                    <div className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded truncate mb-1 border border-green-200">
                      Proj Deadline
                    </div>
                  )}
                  {day === 14 && (
                    <div className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded truncate mb-1 border border-blue-200">
                      All-Hands
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
