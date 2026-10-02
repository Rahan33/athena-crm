import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Book, Folder, Clock, Plus, Share2, MoreVertical, Tag } from 'lucide-react';

export default function Notebook() {
  const [value, setValue] = useState('<h1>Q4 Strategy Brainstorming</h1><p><br/></p><h3>Key Objectives:</h3><ul><li>Increase enterprise sales by 15%</li><li>Launch new AI modules</li><li>Hire 3 new senior engineers</li></ul><p><br/></p><p><strong>Note:</strong> We need to finalize the budget by next Friday.</p>');

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-bold text-gray-900 flex items-center gap-2"><Book className="w-5 h-5 text-amber-500"/> My Notebooks</h2>
          <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><Plus className="w-4 h-4"/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-2 bg-gray-200/50 rounded-lg font-bold text-sm text-gray-900 flex items-center gap-2 cursor-pointer"><Folder className="w-4 h-4 text-gray-400 fill-gray-400"/> Personal Notes</div>
          <div className="px-3 py-2 hover:bg-gray-200/50 rounded-lg font-bold text-sm text-gray-600 flex items-center gap-2 cursor-pointer"><Folder className="w-4 h-4 text-blue-400 fill-blue-400"/> Engineering</div>
          <div className="px-3 py-2 hover:bg-gray-200/50 rounded-lg font-bold text-sm text-gray-600 flex items-center gap-2 cursor-pointer"><Folder className="w-4 h-4 text-pink-400 fill-pink-400"/> Marketing</div>
          
          <h3 className="text-xs font-bold text-gray-400 uppercase mt-6 mb-2 px-3">Recent Pages</h3>
          <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer border-l-4 border-l-amber-500">
            <div className="font-bold text-sm text-gray-900 truncate">Q4 Strategy Brainstorming</div>
            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Clock className="w-3 h-3"/> 2 mins ago</div>
          </div>
          <div className="px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer mt-1">
            <div className="font-bold text-sm text-gray-600 truncate">Weekly Standup Notes</div>
            <div className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Clock className="w-3 h-3"/> Yesterday</div>
          </div>
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b border-gray-200 px-6 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Personal Notes</span>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-bold text-gray-900">Q4 Strategy Brainstorming</span>
          </div>
          <div className="flex items-center gap-3">
             <button className="text-gray-400 hover:text-gray-600"><Tag className="w-4 h-4"/></button>
             <button className="text-gray-400 hover:text-gray-600"><Share2 className="w-4 h-4"/></button>
             <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4"/></button>
          </div>
        </div>
        <div className="flex-1 p-8 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto h-full">
            <style dangerouslySetInnerHTML={{__html: ".ql-toolbar { border: none !important; border-bottom: 1px solid #e5e7eb !important; padding: 12px 0 !important; margin-bottom: 20px; } .ql-container { border: none !important; font-size: 16px; font-family: inherit; } .ql-editor { padding: 0; }"}} />
            <ReactQuill theme="snow" value={value} onChange={setValue} className="h-[80%]" placeholder="Start typing your notes here..." />
          </div>
        </div>
      </div>
    </div>
  );
}
