import React from 'react';
import { Lock, Key, KeyRound, Shield, Search, Plus, Copy, Eye } from 'lucide-react';

const passwords = [
  { id: 1, name: 'AWS Production Root', url: 'aws.amazon.com', username: 'admin@athena.com', lastModified: '2 days ago', strength: 'Strong' },
  { id: 2, name: 'Stripe API Keys', url: 'dashboard.stripe.com', username: 'finance@athena.com', lastModified: '1 week ago', strength: 'Strong' },
  { id: 3, name: 'Salesforce Admin', url: 'login.salesforce.com', username: 'crm_admin@athena.com', lastModified: '3 weeks ago', strength: 'Medium' },
  { id: 4, name: 'Twilio Console', url: 'twilio.com/console', username: 'devops@athena.com', lastModified: '1 month ago', strength: 'Strong' },
];

export default function Vault() {
  return (
    <div className="flex h-full bg-slate-50">
      {/* Left Menu */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-xl font-bold flex items-center text-slate-800">
            <Shield className="mr-2 text-indigo-600" />
            Password Vault
          </h1>
        </div>
        <div className="p-4 space-y-2">
          <button className="w-full text-left px-3 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg flex items-center">
            <Lock className="w-4 h-4 mr-3" /> All Items
          </button>
          <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold rounded-lg flex items-center">
            <Key className="w-4 h-4 mr-3" /> Logins
          </button>
          <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold rounded-lg flex items-center">
            <KeyRound className="w-4 h-4 mr-3" /> API Keys
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center">
          <div className="relative w-96">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search vault..." className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg flex items-center shadow-sm hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <tr>
                  <th className="p-4 font-bold">Name</th>
                  <th className="p-4 font-bold">Username</th>
                  <th className="p-4 font-bold">Strength</th>
                  <th className="p-4 font-bold">Last Modified</th>
                  <th className="p-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {passwords.map(pw => (
                  <tr key={pw.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{pw.name}</div>
                      <div className="text-xs text-slate-500">{pw.url}</div>
                    </td>
                    <td className="p-4 text-slate-600 font-mono text-sm">{pw.username}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${pw.strength === 'Strong' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {pw.strength}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-sm">{pw.lastModified}</td>
                    <td className="p-4 flex gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="Copy Password">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="View Password">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
