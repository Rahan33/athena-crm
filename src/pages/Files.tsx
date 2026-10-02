import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Upload, FileText, Download, Hash, User as UserIcon, Calendar, RefreshCw, Pencil, Trash2, X, FileSpreadsheet, MonitorPlay, PenTool, Book, Search } from 'lucide-react';

export default function Files() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'drive';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab) setActiveTab(tab);
  }, [location.search]);

  const renderAppView = (title: string, description: string, icon: any, primaryColor: string) => {
    const Icon = icon;
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 rounded-2xl border border-gray-200 p-12 text-center min-h-[500px]">
        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg mb-6 ${primaryColor}`}>
          <Icon className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-500 max-w-lg mb-8 text-lg">{description}</p>
        <div className="flex gap-4">
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all">
            Create New Document
          </button>
          <button className="px-8 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm transition-all">
            Browse Templates
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Workspace & Office</h1>
          <p className="text-gray-500 mt-1 font-medium">Create, collaborate, and store all your company documents.</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 p-1.5 bg-gray-100/80 rounded-2xl mb-8 border border-gray-200/60 scrollbar-hide">
        {[
          { id: 'drive', name: 'WorkDrive', icon: Upload },
          { id: 'word', name: 'Writer', icon: FileText },
          { id: 'sheets', name: 'Sheet', icon: FileSpreadsheet },
          { id: 'slides', name: 'Show', icon: MonitorPlay },
          { id: 'pdf', name: 'PDF Editor', icon: FileText },
          { id: 'signatures', name: 'Digital Sign', icon: PenTool },
          { id: 'notes', name: 'Notebook', icon: Book }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {activeTab === 'word' && renderAppView('Writer', 'A powerful, collaborative word processor built for modern teams. Write, discuss, and finalize documents seamlessly.', FileText, 'bg-gradient-to-br from-blue-500 to-indigo-600')}
      {activeTab === 'sheets' && renderAppView('Sheet', 'Intelligent spreadsheet software for data analysis and collaborative modeling.', FileSpreadsheet, 'bg-gradient-to-br from-green-500 to-emerald-600')}
      {activeTab === 'slides' && renderAppView('Show', 'Create stunning presentations and slides with ease.', MonitorPlay, 'bg-gradient-to-br from-amber-400 to-orange-500')}
      {activeTab === 'signatures' && renderAppView('Digital Signatures', 'Secure, legally-binding electronic signatures for all your business contracts.', PenTool, 'bg-gradient-to-br from-purple-500 to-indigo-600')}
      {activeTab === 'notes' && renderAppView('Notebook', 'A beautiful home for all your ideas, meeting notes, and team wikis.', Book, 'bg-gradient-to-br from-rose-400 to-red-500')}
      {activeTab === 'pdf' && renderAppView('PDF Editor', 'Edit, annotate, and merge PDFs directly in your browser without external tools.', FileText, 'bg-gradient-to-br from-red-500 to-rose-600')}
      
      {activeTab === 'drive' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center min-h-[500px] flex items-center justify-center">
          <div>
            <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">WorkDrive Vault</h2>
            <p className="text-gray-500">Your cloud storage interface is active.</p>
          </div>
        </div>
      )}
    </div>
  );
}
