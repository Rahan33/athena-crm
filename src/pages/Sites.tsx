import React from 'react';
import { Globe, LayoutTemplate, Monitor, Smartphone, Plus, Settings, Play } from 'lucide-react';

export default function Sites() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><LayoutTemplate /></div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">Website Builder</h1>
            <p className="text-xs text-gray-500">athenastore.com (Published)</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold flex items-center gap-2"><Monitor className="w-4 h-4"/> Desktop</button>
          <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold flex items-center gap-2"><Smartphone className="w-4 h-4"/> Mobile</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold ml-4">Publish Changes</button>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase">Elements</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-3 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex flex-col items-center gap-1"><LayoutTemplate className="w-5 h-5"/> Section</button>
            <button className="p-3 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex flex-col items-center gap-1"><Monitor className="w-5 h-5"/> Image</button>
          </div>
          <h3 className="text-xs font-bold text-gray-400 uppercase mt-6">Pages</h3>
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold">Home</button>
            <button className="w-full text-left px-3 py-2 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50">About Us</button>
            <button className="w-full text-left px-3 py-2 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50">Contact</button>
          </div>
        </div>
        <div className="flex-1 bg-gray-200 p-8 flex justify-center overflow-y-auto">
          <div className="w-full max-w-4xl bg-white min-h-full shadow-lg border border-gray-300 rounded-t-xl overflow-hidden">
            <div className="h-16 bg-slate-900 flex items-center px-8 justify-between text-white">
              <div className="font-bold text-xl">Athena Store</div>
              <div className="flex gap-4 text-sm font-semibold"><span className="opacity-50">Home</span><span className="opacity-50">About</span></div>
            </div>
            <div className="h-64 bg-blue-50 flex flex-col items-center justify-center border-b border-dashed border-blue-300 hover:bg-blue-100 transition-colors cursor-pointer relative group">
               <div className="absolute top-2 right-2 hidden group-hover:flex gap-1"><button className="p-1.5 bg-white shadow rounded"><Settings className="w-4 h-4 text-gray-600"/></button></div>
               <h1 className="text-4xl font-black text-slate-800 mb-4">Welcome to the Future</h1>
               <button className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold">Shop Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
