import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Target, Activity, ShieldCheck, Key, Fingerprint, Database, Cpu, TestTube, Code, Bot, Cloud, AlertOctagon } from 'lucide-react';
import OSNavigation from '../components/OSNavigation';

export default function OwnerDashboard() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'executive';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab) setActiveTab(tab);
  }, [location.search]);

  const renderAppView = (title: string, description: string, icon: any, primaryColor: string) => {
    const Icon = icon;
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-200 p-12 text-center min-h-[500px] shadow-sm mt-6">
        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg mb-6 ${primaryColor}`}>
          <Icon className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-500 max-w-lg mb-8 text-lg">{description}</p>
        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all">
          Open Console
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">System & Developer Console</h1>
        <p className="text-gray-500 font-medium mt-1">Manage IT infrastructure, build apps, and configure security.</p>
      </div>

      <OSNavigation />

      <div className="flex overflow-x-auto gap-2 p-1.5 bg-gray-100/80 rounded-2xl mb-6 border border-gray-200/60 scrollbar-hide mt-6">
        {[
          { id: 'executive', name: 'Executive Pulse', icon: Target },
          { id: 'apps', name: 'App Creator', icon: Code },
          { id: 'integrations', name: 'Flow API', icon: Database },
          { id: 'rpa', name: 'RPA Bots', icon: Bot },
          { id: 'cloud', name: 'Cloud Server', icon: Cloud },
          { id: 'testing', name: 'QEngine', icon: TestTube },
          { id: 'iot', name: 'IoT Devices', icon: Cpu },
          { id: 'passwords', name: 'Password Vault', icon: Key },
          { id: 'sso', name: 'Directory SSO', icon: Fingerprint },
          { id: 'monitoring', name: 'Site24x7', icon: Activity },
          { id: 'siem', name: 'Log360 SIEM', icon: AlertOctagon }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
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

      {activeTab === 'executive' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <Target className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Executive Dashboard</h2>
            <p className="text-gray-500">Live operational metrics and KPIs.</p>
          </div>
        </div>
      )}

      {activeTab === 'apps' && renderAppView('Low-Code Creator', 'Visually build custom business applications with drag-and-drop elements.', Code, 'bg-indigo-600')}
      {activeTab === 'integrations' && renderAppView('API Flow Hub', 'Zapier-style visual workflow orchestration and webhook management.', Database, 'bg-emerald-600')}
      {activeTab === 'rpa' && renderAppView('RPA Bot Studio', 'Record and deploy macros to automate tedious manual UI workflows.', Bot, 'bg-blue-600')}
      {activeTab === 'cloud' && renderAppView('Serverless Cloud Hosting', 'Deploy node.js workers and full-stack environments globally.', Cloud, 'bg-sky-600')}
      {activeTab === 'testing' && renderAppView('Test Automation', 'Automated QA testing pipeline for your custom web applications.', TestTube, 'bg-purple-600')}
      {activeTab === 'iot' && renderAppView('IoT Device Manager', 'Track telemetry and control connected hardware devices at scale.', Cpu, 'bg-slate-700')}
      
      {/* Security */}
      {activeTab === 'passwords' && renderAppView('Enterprise Password Vault', 'Securely store and share organizational secrets and credentials.', Key, 'bg-red-500')}
      {activeTab === 'sso' && renderAppView('Identity & SSO Directory', 'Manage user access, SCIM provisioning, and multi-factor auth.', Fingerprint, 'bg-blue-800')}
      {activeTab === 'monitoring' && renderAppView('Server Observability', 'Live uptime monitoring and incident response tracking.', Activity, 'bg-emerald-500')}
      {activeTab === 'siem' && renderAppView('SIEM Threat Detection', 'Aggregate network logs and monitor for cyber security threats.', AlertOctagon, 'bg-rose-600')}

    </div>
  );
}
