import React from 'react';
import { FileText, Type, Edit3, Image as ImageIcon, Download, Scissors } from 'lucide-react';

export default function PDFEditor() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-200">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 text-red-600 rounded-lg"><FileText className="w-5 h-5"/></div>
          <h1 className="font-bold text-gray-900 text-lg">Marketing_Brochure_Final.pdf</h1>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold flex items-center gap-2"><Download className="w-4 h-4"/> Export PDF</button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Tools Sidebar */}
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
          <button className="p-3 bg-red-50 text-red-600 rounded-xl" title="Text Tool"><Type className="w-5 h-5"/></button>
          <button className="p-3 text-gray-500 hover:bg-gray-100 rounded-xl" title="Draw"><Edit3 className="w-5 h-5"/></button>
          <button className="p-3 text-gray-500 hover:bg-gray-100 rounded-xl" title="Add Image"><ImageIcon className="w-5 h-5"/></button>
          <button className="p-3 text-gray-500 hover:bg-gray-100 rounded-xl" title="Crop/Extract"><Scissors className="w-5 h-5"/></button>
        </div>
        
        {/* PDF Document Canvas Mock */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
          <div className="w-full max-w-3xl bg-white shadow-2xl h-[1000px] border border-gray-300 relative p-12">
             <div className="absolute top-12 left-12 border-2 border-dashed border-red-400 bg-red-50/50 p-4 w-64 cursor-move">
               <div className="text-xs text-red-500 font-bold mb-1 font-mono">TEXT BOX ADDED</div>
               <div className="text-3xl font-black text-gray-900">Athena OS</div>
             </div>
             
             <div className="absolute top-40 left-12 text-gray-600 leading-relaxed max-w-lg">
               The ultimate business operating system. Built for speed, scale, and security. We are launching the next generation of cloud applications designed to run your entire enterprise from a single unified interface.
             </div>
             
             <div className="absolute top-12 right-12 w-48 h-48 bg-gray-100 border-2 border-gray-300 rounded flex items-center justify-center text-gray-400">
                [Image Placeholder]
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
