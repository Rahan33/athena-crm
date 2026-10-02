import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Target, Megaphone, Plus, Search, Filter, TrendingUp, CheckCircle2, Globe, Layout, Share2, ClipboardList, SplitSquareHorizontal, Video, MapPin, Users, Workflow } from 'lucide-react';
import CRMNavigation from '../../components/CRMNavigation';

export default function GoalsCampaigns() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'goals';
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
        <div className="flex gap-4">
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all">
            Get Started
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Marketing & Web Presence</h1>
        <p className="text-gray-500 font-medium mt-1">Manage your websites, social media, and digital campaigns.</p>
      </div>

      <CRMNavigation />

      {/* Modern Tab Bar */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-gray-100/80 rounded-2xl mb-6 border border-gray-200/60 scrollbar-hide mt-6">
        {[
          { id: 'goals', name: 'Goals', icon: Target },
          { id: 'campaigns', name: 'Campaigns', icon: Megaphone },
          { id: 'websites', name: 'Site Builder', icon: Globe },
          { id: 'landingpages', name: 'Landing Pages', icon: Layout },
          { id: 'domains', name: 'Domains', icon: Globe },
          { id: 'social', name: 'Social', icon: Share2 },
          { id: 'surveys', name: 'Surveys', icon: ClipboardList },
          { id: 'abtesting', name: 'PageSense', icon: SplitSquareHorizontal },
          { id: 'events', name: 'Events', icon: Video },
          { id: 'publish', name: 'Listings', icon: MapPin },
          { id: 'community', name: 'Community', icon: Users },
          { id: 'journeys', name: 'Journeys', icon: Workflow }
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

      {activeTab === 'goals' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <Target className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Marketing Goals</h2>
            <p className="text-gray-500">Track and manage your Q3/Q4 pipeline targets.</p>
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <Megaphone className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Email Campaigns</h2>
            <p className="text-gray-500">Create and send targeted email blasts.</p>
          </div>
        </div>
      )}

      {activeTab === 'websites' && renderAppView('Site Builder', 'Drag-and-drop website creator with hosting included.', Globe, 'bg-blue-600')}
      {activeTab === 'landingpages' && renderAppView('Landing Pages', 'High-conversion landing page builder for ad campaigns.', Layout, 'bg-indigo-600')}
      {activeTab === 'domains' && renderAppView('Domain Registrar', 'Buy, transfer, and manage your DNS settings.', Globe, 'bg-slate-800')}
      {activeTab === 'social' && renderAppView('Social Media Manager', 'Schedule posts across Twitter, LinkedIn, and Facebook.', Share2, 'bg-sky-500')}
      {activeTab === 'surveys' && renderAppView('External Surveys', 'Design forms and collect customer feedback instantly.', ClipboardList, 'bg-emerald-500')}
      {activeTab === 'abtesting' && renderAppView('A/B Testing Engine', 'Optimize website conversions with heatmaps and split testing.', SplitSquareHorizontal, 'bg-orange-500')}
      {activeTab === 'events' && renderAppView('Event & Webinar Studio', 'End-to-end management for virtual and physical events.', Video, 'bg-rose-500')}
      {activeTab === 'publish' && renderAppView('Local Listings', 'Sync your Google My Business and Yelp reviews centrally.', MapPin, 'bg-red-500')}
      {activeTab === 'community' && renderAppView('Brand Community', 'Build an exclusive network and link-in-bio page.', Users, 'bg-purple-600')}
      {activeTab === 'journeys' && renderAppView('Journey Automation', 'Design complex multi-step trigger campaigns visually.', Workflow, 'bg-fuchsia-600')}

    </div>
  );
}
