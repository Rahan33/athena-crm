import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShoppingCart, ShoppingBag, CreditCard, Tag, Truck, CheckCircle2 } from 'lucide-react';
import CRMNavigation from '../../components/CRMNavigation';

export default function Sales() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'orders';
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
          Launch Module
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Sales & Commerce</h1>
        <p className="text-gray-500 font-medium mt-1">Manage B2B orders, physical retail, and online storefronts.</p>
      </div>

      <CRMNavigation />

      <div className="flex overflow-x-auto gap-2 p-1.5 bg-gray-100/80 rounded-2xl mb-6 border border-gray-200/60 scrollbar-hide mt-6">
        {[
          { id: 'orders', name: 'Sales Orders', icon: ShoppingCart },
          { id: 'pos', name: 'Point of Sale (POS)', icon: ShoppingBag },
          { id: 'ecommerce', name: 'eCommerce Store', icon: ShoppingBag },
          { id: 'ondc', name: 'ONDC Network', icon: Truck }
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

      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">B2B Sales Orders</h2>
            <p className="text-gray-500">Manage traditional B2B invoices and orders.</p>
          </div>
        </div>
      )}

      {activeTab === 'pos' && renderAppView('Point of Sale', 'Cloud-based cash register system for brick-and-mortar retail stores.', ShoppingBag, 'bg-emerald-600')}
      {activeTab === 'ecommerce' && renderAppView('eCommerce Storefront', 'Build, design, and manage your online D2C catalog and shopping cart.', ShoppingBag, 'bg-blue-600')}
      {activeTab === 'ondc' && renderAppView('ONDC Integration', 'Sync your inventory directly with the Indian ONDC network infrastructure.', Truck, 'bg-orange-600')}

    </div>
  );
}
