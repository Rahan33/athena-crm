import React, { useState } from 'react';
import { MessageCircle, Phone, Bot, Search, Settings, Activity, Users, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AIWhatsApp() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI WhatsApp & Voice Engine</h1>
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Agent "Athena-Alpha" is Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm">
            <Settings className="w-4 h-4" /> Agent Settings
          </button>
          <button className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm shadow-sm">
            <Phone className="w-4 h-4" /> Connect Twilio Number
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Analytics */}
        <div className="w-72 bg-white border-r border-gray-200 p-4 overflow-y-auto hidden md:block">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">Live Traffic</h2>
          
          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-600">Active Chats</span>
                <MessageCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-black text-gray-900">1,248</div>
              <div className="text-xs font-bold text-green-600 mt-1">+12% today</div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-600">AI Handled Calls</span>
                <Phone className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-gray-900">892</div>
              <div className="text-xs font-bold text-blue-600 mt-1">94% resolution rate</div>
            </div>
          </div>

          <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">Intent Breakdown</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-orange-500"/> Order Tracking</div>
              <span>45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-orange-500 h-1.5 rounded-full" style={{width: '45%'}}></div></div>
            
            <div className="flex items-center justify-between text-sm font-semibold text-gray-700 mt-2">
              <div className="flex items-center gap-2"><Bot className="w-4 h-4 text-purple-500"/> Product Query</div>
              <span>30%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full" style={{width: '30%'}}></div></div>
          </div>
        </div>

        {/* Live Inbox / Feed */}
        <div className="flex-1 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Live AI Interventions</h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2 text-gray-400" />
              <input type="text" placeholder="Search transcripts..." className="pl-9 pr-4 py-1.5 bg-gray-100 rounded-lg text-sm border-transparent focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"/>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Mock Chat 1 */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-gray-600">JD</div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">John Doe <span className="text-xs text-gray-500 font-normal ml-2">+91 98765 43210</span></h4>
                    <p className="text-xs text-orange-600 font-bold flex items-center gap-1 mt-0.5"><Truck className="w-3 h-3"/> Order Tracking</p>
                  </div>
                  <span className="text-xs font-bold text-gray-400">Just now</span>
                </div>
                <div className="bg-gray-100 p-3 rounded-tr-xl rounded-b-xl text-sm text-gray-800 mb-2 w-3/4">
                  Where is my order? It was supposed to be delivered yesterday. Order ID #4492.
                </div>
                <div className="bg-green-50 p-3 rounded-tl-xl rounded-b-xl text-sm text-green-900 w-3/4 ml-auto border border-green-100 flex gap-2">
                  <Bot className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600"/>
                  <div>
                    I apologize for the delay, John! I just checked your tracking. The delivery partner (Delhivery) attempted delivery yesterday but couldn't reach your location. It is out for delivery again today and will reach you by 4:00 PM. Here is the live tracking link: <u>zho.ink/trck4492</u>
                  </div>
                </div>
                <div className="text-right mt-1">
                  <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center justify-end gap-1 w-max ml-auto">
                    <CheckCircle2 className="w-3 h-3"/> Auto-Resolved by AI
                  </span>
                </div>
              </div>
            </div>

            {/* Mock Call 1 */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-gray-600">SM</div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Sarah Mitchell <span className="text-xs text-gray-500 font-normal ml-2">+1 415 555 0192</span></h4>
                    <p className="text-xs text-blue-600 font-bold flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3"/> Voice Call (Inbound)</p>
                  </div>
                  <span className="text-xs font-bold text-gray-400">5 mins ago</span>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-sm">
                  <div className="font-bold text-blue-800 mb-2 flex items-center gap-2"><Activity className="w-4 h-4"/> AI Call Transcript</div>
                  <p className="text-gray-600 mb-1"><strong className="text-gray-900">User:</strong> "Hi, I need to know if the 65W charger works with the new MacBook Pro."</p>
                  <p className="text-blue-700 mb-1"><strong className="text-blue-900">AI:</strong> "Yes, Sarah. Our 65W USB-C charger is fully compatible with the new MacBook Pro models and will fast-charge them."</p>
                  <p className="text-gray-600 mb-1"><strong className="text-gray-900">User:</strong> "Great, can you add one to my current order?"</p>
                  <p className="text-blue-700"><strong className="text-blue-900">AI:</strong> "I've added the 65W charger to Order #4490. Your card on file has been charged $35.00. You'll receive a confirmation SMS shortly."</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
