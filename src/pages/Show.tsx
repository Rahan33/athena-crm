import React from 'react';
import { Presentation, Play, Plus, Image as ImageIcon, Type, Square, Share2, Download } from 'lucide-react';

export default function Show() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex justify-between items-center z-10 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg"><Presentation className="w-5 h-5"/></div>
          <h1 className="font-bold text-lg">Q4 Marketing Pitch Deck</h1>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-700 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-600"><Share2 className="w-4 h-4"/> Share</button>
          <button className="px-4 py-2 bg-yellow-500 text-slate-900 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-yellow-400"><Play className="w-4 h-4"/> Present</button>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {/* Slides list */}
        <div className="w-48 bg-slate-800 border-r border-slate-700 p-4 space-y-4 overflow-y-auto">
          <div className="aspect-video bg-white rounded border-2 border-yellow-500 p-2 flex items-center justify-center relative cursor-pointer">
            <div className="absolute -left-3 top-1 text-xs text-slate-400 font-bold">1</div>
            <div className="text-[8px] font-bold text-center">Athena OS<br/>Q4 Strategy</div>
          </div>
          <div className="aspect-video bg-slate-200 rounded border-2 border-transparent p-2 opacity-70 cursor-pointer relative hover:opacity-100">
            <div className="absolute -left-3 top-1 text-xs text-slate-400 font-bold">2</div>
            <div className="text-[6px] flex flex-col gap-1"><div className="w-3/4 h-1 bg-slate-400"/><div className="w-full h-1 bg-slate-300"/><div className="w-5/6 h-1 bg-slate-300"/></div>
          </div>
          <button className="w-full py-2 border border-dashed border-slate-600 text-slate-400 rounded flex items-center justify-center gap-1 hover:bg-slate-700 hover:text-white"><Plus className="w-4 h-4"/> New Slide</button>
        </div>
        {/* Main Canvas */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center relative overflow-hidden bg-slate-900">
          <div className="absolute top-4 bg-slate-800 rounded-lg p-2 flex gap-2 shadow-lg">
             <button className="p-2 hover:bg-slate-700 text-slate-300 rounded"><Type className="w-5 h-5"/></button>
             <button className="p-2 hover:bg-slate-700 text-slate-300 rounded"><ImageIcon className="w-5 h-5"/></button>
             <button className="p-2 hover:bg-slate-700 text-slate-300 rounded"><Square className="w-5 h-5"/></button>
          </div>
          <div className="aspect-video w-full max-w-4xl bg-white shadow-2xl rounded-sm flex flex-col items-center justify-center relative">
             <h1 className="text-6xl font-black text-slate-800 mb-6 tracking-tight">Athena OS</h1>
             <h2 className="text-2xl font-bold text-yellow-500 uppercase tracking-widest">Q4 Growth Strategy</h2>
             <div className="absolute bottom-6 left-8 text-sm font-bold text-slate-400">October 2026</div>
             <div className="absolute bottom-6 right-8 text-sm font-bold text-slate-400">Confidential</div>
          </div>
        </div>
      </div>
    </div>
  );
}
