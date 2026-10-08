import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, Users, BarChart3, Settings, Plus, Search, Tag, Eye, ArrowUpRight, CheckCircle2, Edit3, Trash2, X } from 'lucide-react';

export default function ECommerce() {
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', category: '', sku: '' });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/ecommerce/orders');
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/ecommerce/products');
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (e) {
      console.error(e);
    }
  };

  const markShipped = async (id: string) => {
    try {
      const res = await fetch(`/api/ecommerce/orders/${id}/ship`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        alert('Order marked as shipped! Tracking: ' + data.trackingNumber);
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const simulateOnlinePurchase = async () => {
    try {
      const res = await fetch('/api/ecommerce/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: "Jane Doe " + Math.floor(Math.random()*100),
          customerEmail: "jane@example.com",
          shippingAddress: "123 Main St",
          totalAmount: 299.99,
          items: [{ sku: "HW-101", quantity: 1, name: "Headphones" }]
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Customer just bought an item on your website!\nOrder: ' + data.orderNumber + '\n\nOmnichannel Sync: POS Inventory was automatically deducted!');
        fetchOrders();
      }
    } catch(e) {
      alert('Error simulating checkout');
    }
  };

  // --- Product CRUD ---
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', stock: '', category: 'General', sku: 'WEB-' + Math.floor(Math.random()*1000) });
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({ 
      name: product.name, 
      price: product.price, 
      stock: product.stock, 
      category: product.category || 'General',
      sku: product.sku || 'WEB-' + Math.floor(Math.random()*1000)
    });
    setIsModalOpen(true);
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this web product?')) return;
    try {
      const res = await fetch(`/api/ecommerce/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const saveProduct = async () => {
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price as string),
        stock: parseInt(formData.stock as string, 10),
        status: 'Active'
      };

      const url = editingProduct ? `/api/ecommerce/products/${editingProduct.id}` : "/api/ecommerce/products";
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        alert('Error saving product: ' + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50 overflow-hidden relative">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">eCommerce Storefront</h1>
            <p className="text-xs text-green-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Store is Live (athenastore.com)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={simulateOnlinePurchase} className="px-4 py-2 bg-pink-100 text-pink-700 font-bold rounded-lg hover:bg-pink-200 transition-colors flex items-center gap-2 text-sm border border-pink-200 shadow-sm">
            <ShoppingBag className="w-4 h-4" /> Simulate Online Customer Purchase
          </button>
          <button onClick={openAddModal} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm shadow-sm">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
          <div className="p-4 space-y-1">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'orders', name: 'Orders', icon: ShoppingBag },
              { id: 'products', name: 'Products', icon: Package },
              { id: 'customers', name: 'Customers', icon: Users },
              { id: 'discounts', name: 'Discounts', icon: Tag },
              { id: 'settings', name: 'Store Settings', icon: Settings }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {(activeTab === 'overview' || activeTab === 'orders') && (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className="text-gray-500 font-bold text-sm mb-2">Total Sales</div>
                  <div className="flex items-end gap-3">
                    <div className="text-3xl font-black text-gray-900">$24,592.00</div>
                    <div className="text-sm font-bold text-green-600 flex items-center mb-1"><ArrowUpRight className="w-4 h-4"/> 14%</div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className="text-gray-500 font-bold text-sm mb-2">Active Sessions</div>
                  <div className="flex items-end gap-3">
                    <div className="text-3xl font-black text-gray-900">342</div>
                    <div className="text-sm font-bold text-green-600 flex items-center mb-1"><ArrowUpRight className="w-4 h-4"/> 5%</div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className="text-gray-500 font-bold text-sm mb-2">Conversion Rate</div>
                  <div className="flex items-end gap-3">
                    <div className="text-3xl font-black text-gray-900">3.2%</div>
                    <div className="text-sm font-bold text-red-500 flex items-center mb-1">-0.4%</div>
                  </div>
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-gray-900">Recent Online Orders</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-gray-200 text-xs uppercase text-gray-500 font-black tracking-wider">
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Fulfillment</th>
                        <th className="p-4">Total</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {orders.map(order => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-bold text-indigo-600">{order.orderNumber}</td>
                          <td className="p-4 font-semibold text-gray-900">{order.customerName}</td>
                          <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</td>
                          <td className="p-4">
                            {order.status === 'Shipped' ? (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-bold text-xs flex items-center w-max gap-1"><CheckCircle2 className="w-3 h-3"/> Shipped ({order.trackingNumber})</span>
                            ) : (
                              <button onClick={() => markShipped(order.id)} className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1 rounded font-bold text-xs transition-colors">Mark Shipped</button>
                            )}
                          </td>
                          <td className="p-4 font-bold">${parseFloat(order.totalAmount || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-gray-500">No online orders yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'products' && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(product => (
                <div key={product.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between relative group">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button onClick={() => openEditModal(product)} className="p-1.5 bg-white border border-gray-200 shadow-sm rounded-lg text-indigo-600 hover:bg-indigo-50"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => deleteProduct(product.id)} className="p-1.5 bg-white border border-gray-200 shadow-sm rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block mb-2 bg-indigo-100 text-indigo-800">
                      {product.category}
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2">{product.name}</h3>
                  </div>
                  <div className="flex items-end justify-between mt-4">
                    <div className="text-lg font-black text-slate-900">${parseFloat(product.price || 0).toFixed(2)}</div>
                    <div className="text-xs font-semibold text-gray-500">{product.stock} units online</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* CRUD Modal for Products */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-lg">{editingProduct ? 'Edit Web Product' : 'Add New Web Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white" placeholder="e.g. Mechanical Keyboard" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
                  <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white" placeholder="0.00" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Online Stock Qty</label>
                  <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white" placeholder="0" />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white">
                    <option value="Electronics">Electronics</option>
                    <option value="Home Appliances">Home Appliances</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">SKU</label>
                  <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white" />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 font-bold text-gray-600 hover:bg-gray-200 rounded-xl">Cancel</button>
              <button onClick={saveProduct} className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm">Save Product</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
