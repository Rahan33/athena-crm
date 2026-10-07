import React, { useState } from 'react';
import { Joyride, STATUS, type Step } from 'react-joyride';
import { Compass, Play, Plus, Target, CheckCircle, BarChart, Users } from 'lucide-react';

export default function DAP() {
  const [runTour, setRunTour] = useState(false);
  
  const steps: Step[] = [
    {
      target: '.dap-header',
      content: 'Welcome to the Digital Adoption Platform! This is where you configure onboarding tours without writing code.',
    },
    {
      target: '.dap-new-tour',
      content: 'Click here to create a new step-by-step walkthrough for your employees.',
    },
    {
      target: '.dap-stats',
      content: 'Track how many users actually complete the onboarding vs how many drop off.',
    },
    {
      target: '.dap-tour-list',
      content: 'Manage all your active and drafted product tours right here.',
    }
  ];

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setRunTour(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* @ts-ignore */}
      <Joyride
        steps={steps}
        run={runTour}
        continuous
      />
      
      <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center">
        <div className="dap-header">
          <h1 className="text-2xl font-bold flex items-center text-slate-800">
            <Compass className="mr-3 text-sky-500" />
            Digital Adoption Platform (DAP)
          </h1>
          <p className="text-sm text-slate-500 mt-1">Interactive In-Product Guidance Builder</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setRunTour(true)}
            className="flex items-center px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 shadow-sm"
          >
            <Play className="w-4 h-4 mr-2 text-green-400" />
            Test Live Demo
          </button>
          <button className="flex items-center px-4 py-2 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 shadow-sm dap-new-tour">
            <Plus className="w-4 h-4 mr-2" />
            New Tour
          </button>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dap-stats bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mr-4">
            <Users className="text-sky-600 w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-slate-500 font-bold">Total Tour Views</div>
            <div className="text-2xl font-black text-slate-800">14,208</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
            <CheckCircle className="text-green-600 w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-slate-500 font-bold">Completion Rate</div>
            <div className="text-2xl font-black text-slate-800">72.4%</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
            <BarChart className="text-purple-600 w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-slate-500 font-bold">Active Tours</div>
            <div className="text-2xl font-black text-slate-800">3</div>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <div className="dap-tour-list bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-bold text-slate-800">Active Walkthroughs</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-white border-b border-slate-100 text-slate-500 text-sm">
              <tr>
                <th className="p-4 font-bold">Tour Name</th>
                <th className="p-4 font-bold">Target Page</th>
                <th className="p-4 font-bold">Steps</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-800">New Employee Welcome Tour</td>
                <td className="p-4 text-slate-600">/dashboard</td>
                <td className="p-4 text-slate-600">5 steps</td>
                <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Live</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-800">How to generate a Payroll Report</td>
                <td className="p-4 text-slate-600">/erp/hr</td>
                <td className="p-4 text-slate-600">12 steps</td>
                <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Live</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-800">New AI Agent Features Guide</td>
                <td className="p-4 text-slate-600">/agents</td>
                <td className="p-4 text-slate-600">3 steps</td>
                <td className="p-4"><span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold">Draft</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
