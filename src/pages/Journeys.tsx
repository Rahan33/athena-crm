import React, { useCallback } from 'react';
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Play, Clock, Mail, CheckCircle, Save, Settings } from 'lucide-react';

// Initial Flow Layout
const initialNodes = [
  {
    id: 'trigger-1',
    type: 'input',
    data: { 
      label: (
        <div className="flex flex-col items-center p-2">
          <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2"><Play className="w-4 h-4"/></div>
          <div className="font-bold text-sm">Trigger: Cart Abandoned</div>
        </div>
      )
    },
    position: { x: 250, y: 50 },
    style: { border: '2px solid #fbbf24', borderRadius: '12px', background: '#fff', width: 200 }
  },
  {
    id: 'delay-1',
    data: { 
      label: (
        <div className="flex flex-col items-center p-2">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2"><Clock className="w-4 h-4"/></div>
          <div className="font-bold text-sm">Wait: 4 Hours</div>
        </div>
      )
    },
    position: { x: 250, y: 200 },
    style: { border: '2px solid #60a5fa', borderRadius: '12px', background: '#fff', width: 200 }
  },
  {
    id: 'email-1',
    data: { 
      label: (
        <div className="flex flex-col items-center p-2">
          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2"><Mail className="w-4 h-4"/></div>
          <div className="font-bold text-sm">Action: Promo Email 1</div>
        </div>
      )
    },
    position: { x: 250, y: 350 },
    style: { border: '2px solid #4ade80', borderRadius: '12px', background: '#fff', width: 200 }
  },
  {
    id: 'condition-1',
    data: { 
      label: (
        <div className="flex flex-col items-center p-2">
          <div className="font-bold text-sm text-purple-700">Did they purchase?</div>
        </div>
      )
    },
    position: { x: 250, y: 500 },
    style: { border: '2px solid #c084fc', borderRadius: '8px', background: '#f3e8ff', width: 200 }
  },
  {
    id: 'end-success',
    type: 'output',
    data: { 
      label: (
        <div className="flex flex-col items-center p-2">
          <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2"><CheckCircle className="w-4 h-4"/></div>
          <div className="font-bold text-sm text-emerald-800">End Journey</div>
        </div>
      )
    },
    position: { x: 100, y: 650 },
    style: { border: '2px dashed #10b981', borderRadius: '12px', background: '#ecfdf5', width: 150 }
  },
  {
    id: 'email-2',
    type: 'output',
    data: { 
      label: (
        <div className="flex flex-col items-center p-2">
          <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2"><Mail className="w-4 h-4"/></div>
          <div className="font-bold text-sm text-red-800">Action: Final Warning Email</div>
        </div>
      )
    },
    position: { x: 400, y: 650 },
    style: { border: '2px solid #f87171', borderRadius: '12px', background: '#fef2f2', width: 200 }
  }
];

const initialEdges = [
  { id: 'e1-2', source: 'trigger-1', target: 'delay-1', animated: true, style: { stroke: '#9ca3af', strokeWidth: 2 } },
  { id: 'e2-3', source: 'delay-1', target: 'email-1', animated: true, style: { stroke: '#9ca3af', strokeWidth: 2 } },
  { id: 'e3-4', source: 'email-1', target: 'condition-1', style: { stroke: '#9ca3af', strokeWidth: 2 } },
  { id: 'e4-yes', source: 'condition-1', target: 'end-success', label: 'Yes', labelStyle: { fill: '#10b981', fontWeight: 700 }, style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'e4-no', source: 'condition-1', target: 'email-2', label: 'No', labelStyle: { fill: '#ef4444', fontWeight: 700 }, style: { stroke: '#ef4444', strokeWidth: 2 } },
];

export default function Journeys() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Marketing Journeys Builder</h1>
          <p className="text-xs text-gray-500 flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span> Draft Mode: "Abandoned Cart Recovery"</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm">
             <Settings className="w-4 h-4"/> Settings
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm shadow-sm hover:bg-blue-700">
             <Save className="w-4 h-4"/> Save & Publish
          </button>
        </div>
      </div>
      
      {/* ReactFlow Canvas */}
      <div className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          attributionPosition="bottom-right"
        >
          <Controls />
          <MiniMap nodeStrokeColor={(n) => {
              if (n.type === 'input') return '#fbbf24';
              if (n.type === 'output') return '#10b981';
              return '#3b82f6';
            }} 
            nodeColor={(n) => '#fff'} 
          />
          <Background color="#ccc" gap={16} />
        </ReactFlow>
        
        {/* Floating Sidebar (Mockup) */}
        <div className="absolute top-6 left-6 bg-white w-64 rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col z-10">
          <div className="bg-gray-900 text-white font-bold p-4 text-sm">Component Library</div>
          <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
             <div className="p-3 border border-gray-200 rounded-lg text-sm font-bold flex items-center gap-3 cursor-grab hover:bg-gray-50"><Play className="w-4 h-4 text-amber-500"/> Trigger Event</div>
             <div className="p-3 border border-gray-200 rounded-lg text-sm font-bold flex items-center gap-3 cursor-grab hover:bg-gray-50"><Clock className="w-4 h-4 text-blue-500"/> Time Delay</div>
             <div className="p-3 border border-gray-200 rounded-lg text-sm font-bold flex items-center gap-3 cursor-grab hover:bg-gray-50"><Mail className="w-4 h-4 text-green-500"/> Send Email</div>
             <div className="p-3 border border-gray-200 rounded-lg text-sm font-bold flex items-center gap-3 cursor-grab hover:bg-gray-50"><Settings className="w-4 h-4 text-purple-500"/> Condition Split</div>
          </div>
        </div>
      </div>
    </div>
  );
}
