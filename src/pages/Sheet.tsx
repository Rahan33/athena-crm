import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Table, Download, Share2, Users, FileSpreadsheet } from 'lucide-react';

export default function Sheet() {
  const [rowData] = useState([
    { id: 1, name: 'Q1 Marketing Budget', category: 'Finance', status: 'Approved', amount: 45000, date: '2026-01-15' },
    { id: 2, name: 'Server Upgrades', category: 'IT', status: 'Pending', amount: 12500, date: '2026-02-10' },
    { id: 3, name: 'New Hires (Engineering)', category: 'HR', status: 'In Review', amount: 180000, date: '2026-03-01' },
    { id: 4, name: 'Annual Retreat', category: 'HR', status: 'Approved', amount: 25000, date: '2026-04-12' },
    { id: 5, name: 'Ad Spend (Google)', category: 'Marketing', status: 'Approved', amount: 30000, date: '2026-01-20' },
    { id: 6, name: 'Office Supplies', category: 'Operations', status: 'Paid', amount: 1200, date: '2026-01-05' },
    { id: 7, name: 'SaaS Subscriptions', category: 'IT', status: 'Paid', amount: 8400, date: '2026-01-10' },
    { id: 8, name: 'Legal Retainer', category: 'Legal', status: 'Pending', amount: 15000, date: '2026-02-28' },
  ]);

  const [columnDefs] = useState<any[]>([ 
    { field: 'id', headerName: 'ID', width: 80, editable: true },
    { field: 'name', headerName: 'Expense Item', flex: 1, editable: true },
    { field: 'category', headerName: 'Department', width: 150, editable: true },
    { field: 'status', headerName: 'Status', width: 120, editable: true },
    { field: 'amount', headerName: 'Amount ($)', width: 150, editable: true, valueFormatter: (p:any) => '$' + p.value.toLocaleString() },
    { field: 'date', headerName: 'Date', width: 150, editable: true },
  ]);

  const defaultColDef = useMemo(() => ({ sortable: true, filter: true, resizable: true }), []);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><FileSpreadsheet className="w-5 h-5"/></div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg">2026 Financial Projections.xlsx</h1>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Saved to Cloud</span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1 text-emerald-600 font-bold"><Users className="w-3 h-3"/> 3 Active Collaborators</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold flex items-center gap-2 text-gray-700 hover:bg-gray-200"><Download className="w-4 h-4"/> Export</button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-700"><Share2 className="w-4 h-4"/> Share</button>
        </div>
      </div>
      <div className="flex-1 w-full h-full p-6">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 w-full h-full">
           <div className="ag-theme-alpine w-full h-full rounded-lg overflow-hidden">
             <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                animateRows={true}
                rowSelection="multiple"
             />
           </div>
        </div>
      </div>
    </div>
  );
}
