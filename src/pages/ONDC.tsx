import React, { useState, useEffect } from 'react';
import { Globe, Store, ShoppingBag, BarChart3, Settings, TrendingUp, RefreshCw, CheckCircle2, XCircle, ArrowUpRight, Check, Play } from 'lucide-react';

export default function ONDC() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [catalog, setCatalog] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCatalog();
    fetchOrders();
  }, []);

  const fetchCatalog = async () => {
    try {
      const res = await fetch('/api/ondc/catalog');
      const data = await res.json();
      if (data.success) {
        setCatalog(data.products);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/ondc/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const togglePublish = async (productId: string, currentlyPublished: boolean) => {
    try {
      const res = await fetch('/api/ondc/catalog/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webProductId: productId, publish: !currentlyPublished })
      });
      const data = await res.json();
      if (data.success) {
        fetchCatalog();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const simulateOrder = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ondc/simulate-order', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`Incoming ONDC Order via ${data.buyerApp}!\nNetwork ID: ${data.networkOrderId}\n\nInventory has been synced across all physical and online stores automatically.`);
        fetchOrders();
      } else {
        alert("Failed to simulate: " + data.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-200">
            <Globe className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">ONDC Network Dashboard</h1>
            <p className="text-sm text-emerald-600 font-bold flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
              Connected to Open Network
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={simulateOrder} 
            disabled={isLoading}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
            Simulate Network Purchase
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
          <div className="p-4 space-y-1.5 mt-2">
            {[
              { id: 'catalog', name: 'Network Catalog', icon: Store },
              { id: 'orders', name: 'Live Orders', icon: ShoppingBag },
              { id: 'analytics', name: 'Analytics', icon: BarChart3 },
              { id: 'settings', name: 'Network Settings', icon: Settings }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id 
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50' 
                    : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-emerald-600' : 'text-gray-400'}`} />
                {tab.name}
              </button>
            ))}
          </div>
          <div className="mt-auto p-6">
             <div className="bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 p-4 rounded-2xl">
                <div className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Network Status</div>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-bold text-gray-800">Buyer Apps: 104+</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-bold text-gray-800">Cities: 240+</span>
                </div>
             </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8">
          
          {(activeTab === 'catalog') && (
            <div className="max-w-6xl mx-auto space-y-6">
              
              {/* Info Banner */}
              <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                  <Globe className="w-64 h-64" />
                </div>
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-3xl font-black mb-3">Broadcast your products to millions.</h2>
                  <p className="text-emerald-100/90 text-lg font-medium leading-relaxed">
                    Select which products from your eCommerce store you want to push to the ONDC network. 
                    Once published, they will instantly appear on buyer apps like Paytm, Pincode, and Mystore.
                  </p>
                </div>
              </div>

              {/* Product List */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                  <h3 className="font-black text-xl text-gray-900">Your Catalog</h3>
                  <div className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {catalog.filter(c => c.ondcListing?.isPublished).length} Published
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-black tracking-wider">
                        <th className="p-5 pl-6">Product</th>
                        <th className="p-5">Store Price</th>
                        <th className="p-5">Network Price</th>
                        <th className="p-5">ONDC Status</th>
                        <th className="p-5 pr-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {catalog.map(product => {
                        const isPublished = product.ondcListing?.isPublished || false;
                        return (
                          <tr key={product.id} className="border-b border-gray-50 hover:bg-emerald-50/30 transition-colors">
                            <td className="p-5 pl-6">
                              <div className="font-bold text-gray-900">{product.title}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{product.posProduct?.sku || 'N/A'}</div>
                            </td>
                            <td className="p-5 font-bold text-gray-600">${product.onlinePrice.toFixed(2)}</td>
                            <td className="p-5 font-black text-emerald-700">
                              ${isPublished ? product.ondcListing?.networkPrice.toFixed(2) : product.onlinePrice.toFixed(2)}
                            </td>
                            <td className="p-5">
                              {isPublished ? (
                                <span className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center w-max gap-1.5 border border-emerald-200">
                                  <CheckCircle2 className="w-3.5 h-3.5"/> Published
                                </span>
                              ) : (
                                <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center w-max gap-1.5 border border-gray-200">
                                  <XCircle className="w-3.5 h-3.5"/> Not Published
                                </span>
                              )}
                            </td>
                            <td className="p-5 pr-6 text-right">
                              <button 
                                onClick={() => togglePublish(product.id, isPublished)}
                                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm ${
                                  isPublished 
                                    ? 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    : 'bg-gray-900 text-white hover:bg-gray-800'
                                }`}
                              >
                                {isPublished ? 'Unpublish' : 'Publish to ONDC'}
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                      {catalog.length === 0 && (
                        <tr><td colSpan={5} className="p-12 text-center text-gray-400 font-medium text-lg">No web products found in your eCommerce store. Add some first!</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'orders') && (
            <div className="max-w-6xl mx-auto space-y-6">
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                  <div className="text-gray-500 font-bold text-sm mb-3">Total Network Sales</div>
                  <div className="flex items-end gap-3">
                    <div className="text-4xl font-black text-gray-900">$4,291.50</div>
                    <div className="text-sm font-bold text-emerald-600 flex items-center mb-1.5 bg-emerald-50 px-2 py-0.5 rounded-md"><TrendingUp className="w-3.5 h-3.5 mr-1"/> 24%</div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                  <div className="text-gray-500 font-bold text-sm mb-3">Top Buyer App</div>
                  <div className="flex items-end gap-3">
                    <div className="text-3xl font-black text-blue-600">Paytm</div>
                    <div className="text-sm font-bold text-gray-500 mb-1.5">62% share</div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                  <div className="text-gray-500 font-bold text-sm mb-3">Live Network Orders</div>
                  <div className="flex items-end gap-3">
                    <div className="text-4xl font-black text-gray-900">{orders.length}</div>
                    <div className="text-sm font-bold text-emerald-600 flex items-center mb-1.5 bg-emerald-50 px-2 py-0.5 rounded-md"><ArrowUpRight className="w-3.5 h-3.5 mr-1"/> Active</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-white">
                  <h3 className="font-black text-xl text-gray-900">Live Network Orders</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-black tracking-wider">
                        <th className="p-5 pl-6">Order ID</th>
                        <th className="p-5">Buyer App</th>
                        <th className="p-5">Customer</th>
                        <th className="p-5">Items</th>
                        <th className="p-5 pr-6 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {orders.map(order => {
                        let parsedItems: any[] = [];
                        try { parsedItems = JSON.parse(order.items); } catch(e){}
                        
                        return (
                          <tr key={order.id} className="border-b border-gray-50 hover:bg-emerald-50/30 transition-colors">
                            <td className="p-5 pl-6 font-black text-emerald-600">{order.networkOrderId}</td>
                            <td className="p-5">
                               <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg font-bold text-xs">{order.buyerApp}</span>
                            </td>
                            <td className="p-5 font-bold text-gray-700">{order.customerName}</td>
                            <td className="p-5 text-gray-600 font-medium">
                               {parsedItems.map((i, idx) => (
                                 <div key={idx}>{i.quantity}x {i.name}</div>
                               ))}
                            </td>
                            <td className="p-5 pr-6 text-right font-black text-gray-900 text-lg">
                              ${parseFloat(order.totalAmount || 0).toFixed(2)}
                            </td>
                          </tr>
                        )
                      })}
                      {orders.length === 0 && (
                        <tr><td colSpan={5} className="p-12 text-center text-gray-400 font-medium text-lg">Waiting for network orders... Simulate one using the button above.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
