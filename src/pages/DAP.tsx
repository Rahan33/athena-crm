import React from 'react';
import { Box, Settings, ArrowLeft } from 'lucide-react';

export default function DAP() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50 overflow-hidden">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">DAP Engine</h1>
            <p className="text-xs text-gray-500 font-medium">Athena Business OS Native Module</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm">
          <Settings className="w-4 h-4" /> Configure
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50">
        <Box className="w-24 h-24 text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">DAP Dashboard is Active</h2>
        <p className="text-gray-500 max-w-md mx-auto">This module is currently running on the Athena Core architecture. Use the configuration panel to connect databases and APIs.</p>
      </div>
    </div>
  );
}
