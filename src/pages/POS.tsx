import React, { useState, useEffect } from "react";
import { ShoppingCart, Search, Plus, Minus, CreditCard, Banknote, Receipt, User, ScanLine, Tag, Settings, Trash2, Edit3, X } from "lucide-react";

export default function POS() {
  const [cart, setCart] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({ name: "", price: "", stock: "", category: "", sku: "", barcode: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/pos/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: "", price: "", stock: "", category: "General", sku: "SKU-" + Math.floor(Math.random()*1000), barcode: "BC-" + Math.floor(Math.random()*1000) });
    setIsModalOpen(true);
  };

  const openEditModal = (e: any, product: any) => {
    e.stopPropagation(); // prevent adding to cart
    setEditingProduct(product);
    setFormData({ 
      name: product.name, 
      price: product.price, 
      stock: product.stock, 
      category: product.category || "General",
      sku: product.sku || "SKU-" + Math.floor(Math.random()*1000),
      barcode: product.barcode || "BC-" + Math.floor(Math.random()*1000)
    });
    setIsModalOpen(true);
  };

  const deleteProduct = async (e: any, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/pos/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveProduct = async () => {
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price as string),
        stock: parseInt(formData.stock as string, 10)
      };

      const url = editingProduct ? `/api/pos/products/${editingProduct.id}` : "/api/pos/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        alert("Error saving product: " + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleCheckout = async (paymentType: string) => {
    if (cart.length === 0) return alert("Cart is empty!");
    try {
      const res = await fetch("/api/pos/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(i => ({ id: i.id, cartQty: i.qty, price: i.price })),
          subtotal,
          tax,
          total,
          paymentType,
          cashierId: "CASHIER-1"
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Payment Successful!\nReceipt ID: " + data.receiptId + "\n\nPrinting...");
        window.print();
        setCart([]);
        fetchProducts();
      } else {
        alert("Checkout failed: " + data.error);
      }
    } catch(err: any) {
      alert("Error connecting to POS API: " + err.message);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-gray-100 overflow-hidden relative">
      <div className="flex-1 flex flex-col p-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-4 flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Scan barcode or search products..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
            />
          </div>
          <button className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100">
            <ScanLine className="w-6 h-6" />
          </button>
          <button onClick={openAddModal} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span className="font-bold hidden sm:block">Add Product</span>
          </button>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {["All Products", "Electronics", "Furniture", "Accessories", "Cables"].map((cat, idx) => (
            <button key={idx} className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors shadow-sm ${idx === 0 ? "bg-slate-900 text-white" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <div 
                key={product.id} 
                onClick={() => addToCart(product)}
                className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between group active:scale-95 relative"
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                   <button onClick={(e) => openEditModal(e, product)} className="p-1.5 bg-white border border-gray-200 shadow-sm rounded-lg text-blue-600 hover:bg-blue-50"><Edit3 className="w-4 h-4" /></button>
                   <button onClick={(e) => deleteProduct(e, product.id)} className="p-1.5 bg-white border border-gray-200 shadow-sm rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block mb-2 bg-blue-100 text-blue-800">
                    {product.category}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div className="text-lg font-black text-slate-900">${parseFloat(product.price || 0).toFixed(2)}</div>
                  <div className="text-xs font-semibold text-gray-500">{product.stock} in stock</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col shadow-xl z-10">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500" />
            <span className="font-bold text-gray-700">Walk-in Customer</span>
          </div>
          <button className="text-blue-600 font-bold text-sm hover:underline">Add Customer</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingCart className="w-16 h-16 opacity-20" />
              <p className="font-medium">Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2 relative">
                <button onClick={() => removeFromCart(item.id)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="pr-6 font-bold text-sm text-gray-900 truncate">{item.name}</div>
                <div className="flex items-center justify-between">
                  <div className="font-black text-slate-900">${(item.price * item.qty).toFixed(2)}</div>
                  <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                    <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 bg-white rounded-md flex items-center justify-center text-gray-700 shadow-sm hover:text-blue-600 transition-colors"><Minus className="w-4 h-4" /></button>
                    <span className="font-bold w-4 text-center text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 bg-white rounded-md flex items-center justify-center text-gray-700 shadow-sm hover:text-blue-600 transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-gray-500 font-medium"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-gray-500 font-medium"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-xl font-black text-gray-900 pt-2 border-t border-gray-100"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleCheckout("Credit Card")} className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-black text-lg rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center justify-center gap-2"><CreditCard className="w-6 h-6" /> Card</button>
            <button onClick={() => handleCheckout("Cash")} className="flex-1 py-4 bg-slate-800 hover:bg-slate-900 text-white font-black text-lg rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"><Banknote className="w-6 h-6" /> Cash</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-lg">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
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
                  <label className="block text-sm font-bold text-gray-700 mb-1">Stock Qty</label>
                  <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white" placeholder="0" />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white">
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Accessories">Accessories</option>
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