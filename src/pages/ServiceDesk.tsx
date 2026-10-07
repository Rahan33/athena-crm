import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { LifeBuoy, Plus } from 'lucide-react';

const initialRowData = [
  { id: 'TKT-1042', title: 'VPN Connection Failing for Remote Users', priority: 'High', status: 'Open', assignee: 'Jane Smith', date: '2026-10-07' },
  { id: 'TKT-1043', title: 'Need access to Salesforce Sandbox', priority: 'Low', status: 'Resolved', assignee: 'Alex Johnson', date: '2026-10-06' },
  { id: 'TKT-1044', title: 'Laptop battery replacement request', priority: 'Medium', status: 'In Progress', assignee: 'IT Hardware', date: '2026-10-07' },
  { id: 'TKT-1045', title: 'Can\'t access email from mobile device', priority: 'High', status: 'Open', assignee: 'Jane Smith', date: '2026-10-07' },
  { id: 'TKT-1046', title: 'ERP login page is extremely slow', priority: 'Critical', status: 'Escalated', assignee: 'DevOps Team', date: '2026-10-07' },
];

export default function ServiceDesk() {
  const [rowData] = useState(initialRowData);
  
  const [columnDefs] = useState<any[]>([
    { field: 'id', headerName: 'Ticket ID', sortable: true, filter: true, width: 120 },
    { field: 'title', headerName: 'Issue Description', sortable: true, filter: true, flex: 1 },
    { field: 'priority', headerName: 'Priority', sortable: true, filter: true, width: 120 },
    { field: 'status', headerName: 'Status', sortable: true, filter: true, width: 130 },
    { field: 'assignee', headerName: 'Assignee', sortable: true, filter: true, width: 150 },
    { field: 'date', headerName: 'Created Date', sortable: true, filter: true, width: 150 }
  ]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-6 bg-white border-b border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center text-blue-800">
            <LifeBuoy className="mr-3 text-blue-600" />
            IT ServiceDesk
          </h1>
          <p className="text-sm text-gray-500 mt-1">Internal ticketing and hardware management</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </button>
      </div>
      
      <div className="flex-1 p-6">
        <div className="ag-theme-alpine w-full h-full shadow-sm rounded-xl overflow-hidden border border-gray-200">
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={20}
            rowSelection="multiple"
            defaultColDef={{
              resizable: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}
