import React, { useState } from 'react';
import { Code, Play, Save, Layout, Settings } from 'lucide-react';
import Editor from '@monaco-editor/react';

export default function Creator() {
  const [code, setCode] = useState(`// Athena Low-Code Application Definition
const myApp = {
  name: "Internal Helpdesk v2",
  theme: "blue",
  pages: [
    {
      title: "Dashboard",
      components: [
        { type: "chart", source: "tickets_by_status" },
        { type: "datagrid", source: "recent_tickets" }
      ]
    }
  ]
};

export default myApp;
`);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="p-4 border-b border-gray-800 bg-gray-950 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold flex items-center">
            <Code className="mr-3 text-blue-500" />
            Creator (App Builder)
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 bg-gray-800 text-gray-300 font-bold rounded hover:bg-gray-700 text-sm border border-gray-700">
            <Save className="w-4 h-4 mr-2" />
            Save Code
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 text-sm">
            <Play className="w-4 h-4 mr-2" />
            Live Preview
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Menu */}
        <div className="w-64 bg-gray-950 border-r border-gray-800 p-4 flex flex-col gap-2">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Explorer</div>
          <button className="text-left px-3 py-2 bg-gray-800 text-blue-400 font-mono text-sm rounded border-l-2 border-blue-500">app.config.ts</button>
          <button className="text-left px-3 py-2 text-gray-400 hover:text-gray-200 font-mono text-sm rounded">schema.prisma</button>
          <button className="text-left px-3 py-2 text-gray-400 hover:text-gray-200 font-mono text-sm rounded">api/resolvers.ts</button>
          
          <div className="mt-8 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Visual Tools</div>
          <button className="text-left px-3 py-2 flex items-center text-gray-300 hover:text-white text-sm rounded">
            <Layout className="w-4 h-4 mr-2" />
            UI Builder (Beta)
          </button>
          <button className="text-left px-3 py-2 flex items-center text-gray-300 hover:text-white text-sm rounded">
            <Settings className="w-4 h-4 mr-2" />
            Environment Vars
          </button>
        </div>

        {/* Code Editor */}
        <div className="flex-1 h-full">
          <Editor
            height="100%"
            defaultLanguage="typescript"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
              padding: { top: 16 }
            }}
          />
        </div>
      </div>
    </div>
  );
}
