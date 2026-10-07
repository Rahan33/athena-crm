import React from 'react';
import { Activity, Server, Database, Globe } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '00:00', cpu: 12, memory: 45, requests: 1200 },
  { time: '04:00', cpu: 18, memory: 55, requests: 2100 },
  { time: '08:00', cpu: 65, memory: 82, requests: 9800 },
  { time: '12:00', cpu: 82, memory: 88, requests: 14500 },
  { time: '16:00', cpu: 75, memory: 85, requests: 12100 },
  { time: '20:00', cpu: 45, memory: 65, requests: 5400 },
  { time: '24:00', cpu: 15, memory: 48, requests: 1500 },
];

export default function Monitoring() {
  return (
    <div className="flex flex-col h-full bg-gray-950 text-gray-100 overflow-y-auto">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center text-green-400">
            <Activity className="mr-3" />
            DevOps Server Observability
          </h1>
          <p className="text-gray-400 text-sm mt-1">Real-time metrics for production Athena clusters</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-green-900/50 text-green-400 border border-green-800 px-3 py-1 rounded-full text-xs font-bold flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            All Systems Operational
          </span>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-300 flex items-center"><Server className="w-4 h-4 mr-2 text-blue-400"/> CPU Load</h3>
            <span className="text-2xl font-black text-white">42%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-300 flex items-center"><Database className="w-4 h-4 mr-2 text-purple-400"/> Memory</h3>
            <span className="text-2xl font-black text-white">12.4 GB</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }}></div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-300 flex items-center"><Globe className="w-4 h-4 mr-2 text-emerald-400"/> Network I/O</h3>
            <span className="text-2xl font-black text-white">1.2 Gbps</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '35%' }}></div>
          </div>
        </div>
        
        <div className="md:col-span-3 bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg mt-4 h-[400px]">
          <h3 className="font-bold text-gray-300 mb-6">Global Cluster CPU & Memory Telemetry (24h)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }} />
              <Area type="monotone" dataKey="cpu" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="memory" stackId="2" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
