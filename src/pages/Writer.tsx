import React, { useState } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Link, Image, MessageSquare, Download, Share2, Type, ArrowLeft, MoreHorizontal, Printer, Plus, Minus } from 'lucide-react';

export default function Writer() {
  const [content, setContent] = useState('Athena Business OS integrates every operational process into a single, cohesive engine. By eliminating silos and uniting data across CRM, Finance, and HR, modern enterprises can move faster and make decisions with unparalleled clarity.\n\nThis document serves as the architectural overview and strategy manual for deploying Athena OS across global branches.');

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50 overflow-hidden">
      
      {/* Top Navigation Bar */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                defaultValue="Athena Implementation Strategy" 
                className="font-bold text-gray-900 border-transparent hover:border-gray-200 focus:border-blue-500 focus:ring-0 rounded px-1 -ml-1 text-lg outline-none w-64 transition-all"
              />
              <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase">Saved</span>
            </div>
            <div className="flex gap-4 text-xs font-medium text-gray-500">
              <button className="hover:text-blue-600 transition-colors">File</button>
              <button className="hover:text-blue-600 transition-colors">Edit</button>
              <button className="hover:text-blue-600 transition-colors">View</button>
              <button className="hover:text-blue-600 transition-colors">Insert</button>
              <button className="hover:text-blue-600 transition-colors">Format</button>
              <button className="hover:text-blue-600 transition-colors">Tools</button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-2">
            <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center text-xs font-bold text-white z-20">A</div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-500 flex items-center justify-center text-xs font-bold text-white z-10">M</div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 z-0">+2</div>
          </div>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded-lg flex items-center gap-2 shadow-sm transition-colors text-sm">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="bg-white border-b border-gray-200 py-2 px-4 flex flex-wrap items-center gap-2 justify-center shadow-sm z-10 relative">
        <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 font-medium outline-none">
          <option>Normal text</option>
          <option>Title</option>
          <option>Subtitle</option>
          <option>Heading 1</option>
          <option>Heading 2</option>
        </select>
        
        <div className="w-px h-6 bg-gray-200 mx-1"></div>
        
        <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 font-medium outline-none w-32">
          <option>Inter</option>
          <option>Arial</option>
          <option>Times New Roman</option>
          <option>Courier New</option>
        </select>
        
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
          <button className="p-1.5 text-gray-600 hover:bg-gray-200"><Minus className="w-4 h-4" /></button>
          <span className="text-sm font-bold w-8 text-center border-x border-gray-200">11</span>
          <button className="p-1.5 text-gray-600 hover:bg-gray-200"><Plus className="w-4 h-4" /></button>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-1"></div>

        <div className="flex items-center gap-1">
          <button className="p-1.5 text-gray-700 hover:bg-blue-100 hover:text-blue-700 rounded transition-colors bg-blue-50"><Bold className="w-4 h-4" /></button>
          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"><Italic className="w-4 h-4" /></button>
          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"><Underline className="w-4 h-4" /></button>
          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"><Type className="w-4 h-4" /></button>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-1"></div>

        <div className="flex items-center gap-1">
          <button className="p-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors bg-gray-100"><AlignLeft className="w-4 h-4" /></button>
          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"><AlignCenter className="w-4 h-4" /></button>
          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"><AlignRight className="w-4 h-4" /></button>
          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"><AlignJustify className="w-4 h-4" /></button>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-1"></div>

        <div className="flex items-center gap-1">
          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"><List className="w-4 h-4" /></button>
          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"><ListOrdered className="w-4 h-4" /></button>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-1"></div>

        <div className="flex items-center gap-1">
          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"><Link className="w-4 h-4" /></button>
          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"><Image className="w-4 h-4" /></button>
          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"><Printer className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Editor Canvas Container */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-8 flex justify-center">
        {/* The Page (A4 Aspect Ratio Mock) */}
        <div className="w-full max-w-[816px] bg-white min-h-[1056px] shadow-md border border-gray-200 p-16 flex flex-col focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-300 transition-all outline-none">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full flex-1 resize-none outline-none text-gray-800 text-[15px] leading-relaxed font-sans placeholder-gray-300"
            placeholder="Type your document here..."
            spellCheck="false"
          />
        </div>
      </div>

    </div>
  );
}
// Note: We're missing Plus and Minus in the imports. I'll add them using string replacement or just add them.
