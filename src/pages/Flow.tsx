import React, { useState, useCallback } from 'react';
import ReactFlow, { MiniMap, Controls, Background, BackgroundVariant, addEdge, applyNodeChanges, applyEdgeChanges, type Node, type Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { Workflow, Play, Save } from 'lucide-react';

const initialNodes: Node[] = [
  { id: '1', position: { x: 50, y: 50 }, data: { label: 'Webhook Trigger (Salesforce)' }, type: 'input', style: { border: '2px solid #8b5cf6', background: '#ede9fe', borderRadius: '8px', padding: '10px' } },
  { id: '2', position: { x: 50, y: 150 }, data: { label: 'Format Payload' }, style: { border: '1px solid #d1d5db', background: '#fff', borderRadius: '8px', padding: '10px' } },
  { id: '3', position: { x: 50, y: 250 }, data: { label: 'Post to Athena ERP API' }, type: 'output', style: { border: '2px solid #3b82f6', background: '#dbeafe', borderRadius: '8px', padding: '10px' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#8b5cf6' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#3b82f6' } },
];

export default function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-6 border-b border-gray-200 bg-white flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Workflow className="mr-3 text-purple-600" />
            Flow (API Integrations)
          </h1>
          <p className="text-sm text-gray-500 mt-1">Visual Zapier-style integration builder</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </button>
          <button className="flex items-center px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 shadow-sm">
            <Play className="w-4 h-4 mr-2" />
            Deploy Flow
          </button>
        </div>
      </div>
      
      <div className="flex-1 w-full h-[600px] border border-gray-200 m-6 bg-white rounded-xl overflow-hidden shadow-sm">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
