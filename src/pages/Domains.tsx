import React from 'react';
import { Globe, ShieldCheck, Server, Search } from 'lucide-react';

export default function Domains() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Domain Management</h1>
          <p className="text-sm text-gray-500">Register new domains and manage DNS records.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400"/>
            <input type="text" placeholder="Search new domain..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">Buy Domain</button>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 flex justify-between items-center">
         <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><Globe className="w-6 h-6"/></div>
           <div>
             <h2 className="text-xl font-bold text-gray-900">athenastore.com</h2>
             <p className="text-sm text-green-600 font-bold flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> Auto-Renew Active • SSL Secured</p>
           </div>
         </div>
         <button className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200">Manage DNS</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 font-bold text-gray-700">DNS Records (athenastore.com)</div>
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 text-xs uppercase font-black text-gray-500 bg-white">
            <tr><th className="p-4">Type</th><th className="p-4">Host</th><th className="p-4">Value / Points To</th><th className="p-4">TTL</th></tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-gray-100">
              <td className="p-4 font-bold text-blue-600">A</td><td className="p-4 font-mono text-gray-600">@</td><td className="p-4 font-mono">76.76.21.21</td><td className="p-4 text-gray-500">3600</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="p-4 font-bold text-purple-600">CNAME</td><td className="p-4 font-mono text-gray-600">www</td><td className="p-4 font-mono">cname.athena-os.com</td><td className="p-4 text-gray-500">3600</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="p-4 font-bold text-orange-600">TXT</td><td className="p-4 font-mono text-gray-600">_dmarc</td><td className="p-4 font-mono">v=DMARC1; p=quarantine;</td><td className="p-4 text-gray-500">3600</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
