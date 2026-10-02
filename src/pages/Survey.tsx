import React from 'react';
import { ClipboardList, PieChart, BarChart } from 'lucide-react';

export default function Survey() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Survey Builder & Analytics</h1>
          <p className="text-sm text-gray-500">Collect feedback and calculate NPS scores.</p>
        </div>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg font-bold">New Survey</button>
      </div>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
          <div className="text-gray-500 font-bold text-sm mb-2">Company NPS Score</div>
          <div className="text-5xl font-black text-teal-600 mb-2">72</div>
          <div className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Excellent</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 col-span-2">
          <h3 className="font-bold text-gray-900 mb-4">Active Surveys</h3>
          <div className="space-y-3">
             <div className="flex justify-between items-center border-b border-gray-100 pb-3">
               <div><div className="font-bold text-sm text-gray-800">Q3 Customer Satisfaction (CSAT)</div><div className="text-xs text-gray-500">1,492 Responses</div></div>
               <button className="text-teal-600 font-bold text-sm hover:underline">View Results</button>
             </div>
             <div className="flex justify-between items-center">
               <div><div className="font-bold text-sm text-gray-800">Post-Onboarding Feedback</div><div className="text-xs text-gray-500">34 Responses</div></div>
               <button className="text-teal-600 font-bold text-sm hover:underline">View Results</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
