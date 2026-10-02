import React from 'react';
import { Layout, MousePointerClick, TrendingUp, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Landing Pages</h1>
          <p className="text-sm text-gray-500">Manage high-converting squeeze pages and lead magnets.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold">Create New Page</button>
      </div>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="text-gray-500 font-bold text-sm mb-2">Total Visitors</div>
          <div className="text-3xl font-black text-gray-900">14,290</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="text-gray-500 font-bold text-sm mb-2">Leads Captured</div>
          <div className="text-3xl font-black text-indigo-600">3,104</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="text-gray-500 font-bold text-sm mb-2">Avg Conversion Rate</div>
          <div className="text-3xl font-black text-green-600">21.7%</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-black text-gray-500">
            <tr><th className="p-4">Page Name</th><th className="p-4">Status</th><th className="p-4">Views</th><th className="p-4">Conversions</th><th className="p-4">Action</th></tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-4 font-bold text-gray-900">Q4 E-Book Download</td>
              <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Published</span></td>
              <td className="p-4 text-gray-600">8,402</td>
              <td className="p-4 font-bold text-indigo-600">28.4% (2,386)</td>
              <td className="p-4"><button className="text-indigo-600 font-bold hover:underline">Edit Builder</button></td>
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-4 font-bold text-gray-900">Webinar Registration (Nov)</td>
              <td className="p-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">A/B Testing</span></td>
              <td className="p-4 text-gray-600">5,888</td>
              <td className="p-4 font-bold text-indigo-600">12.2% (718)</td>
              <td className="p-4"><button className="text-indigo-600 font-bold hover:underline">Edit Builder</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
