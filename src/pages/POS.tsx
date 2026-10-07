import React, { useState } from 'react';
import { ShoppingCart, Search, Plus, Minus, CreditCard, Banknote, Receipt, User, ScanLine, Tag, Settings, Trash2 } from 'lucide-react';

export default function POS() {
  const [cart, setCart] = useState<any[]>([]);
  
  const products = [
    { id: 1, name: 'Wireless Noise-Cancelling Headphones', price: 299.99, stock: 45, category: 'Electronics', color: 'bg-blue-100 text-blue-800' },
    { id: 2, name: 'Ergonomic Office Chair', price: 199.50, stock: 12, category: 'Furniture', color: 'bg-amber-100 text-amber-800' },
    { id: 3, name: 'Mechanical Keyboard (Cherry MX)', price: 129.99, stock: 8, category: 'Electronics', color: 'bg-blue-100 text-blue-800' },
    { id: 4, name: 'USB-C Fast Charger 65W', price: 35.00, stock: 120, category: 'Accessories', color: 'bg-gray-100 text-gray-800' },
    { id: 5, name: 'Standing Desk Converter', price: 149.00, stock: 23, category: 'Furniture', color: 'bg-amber-100 text-amber-800' },
    { id: 6, name: 'Bluetooth Mouse', price: 45.00, stock: 67, category: 'Electronics', color: 'bg-blue-100 text-blue-800' },
    { id: 7, name: 'Monitor Arm Mount', price: 79.99, stock: 34, category: 'Accessories', color: 'bg-gray-100 text-gray-800' },
    { id: 8, name: 'Webcam 1080p 60fps', price: 89.99, stock: 19, category: 'Electronics', color: 'bg-blue-100 text-blue-800' },
  ];

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

    const handleCheckout = async (paymentType: string) => {
    if (cart.length === 0) return alert('Cart is empty!');
    try {
      const res = await fetch('/api/pos/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(i => ({ id: i.id, cartQty: i.qty, price: i.price })),
          subtotal,
          tax,
          total,
          paymentType,
          cashierId: 'CASHIER-1'
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Payment Successful!\nReceipt ID: ' + data.receiptId + '\n\nPrinting Receipt...');
        window.print();
        setCart([]); // Clear cart
      } else {
        alert('Checkout failed: ' + data.error);
      }
    } catch(err: any) {
      alert('Error connecting to POS API: ' + err.message);
    }
  };
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-gray-100 overflow-hidden">
      
      {/* Product Grid (Left Side) */}
      <div className="flex-1 flex flex-col p-4">
        {/* Top Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-4 flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Scan barcode or search products (e.g. Headphones)..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
            />
          </div>
          <button className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100">
            <ScanLine className="w-6 h-6" />
          </button>
          <button className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
            <Tag className="w-6 h-6" />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {['All Products', 'Electronics', 'Furniture', 'Accessories', 'Cables'].map((cat, idx) => (
            <button key={idx} className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors shadow-sm ${idx === 0 ? 'bg-slate-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <div 
                key={product.id} 
                onClick={() => addToCart(product)}
                className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between group active:scale-95"
              >
                <div>
                  <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block mb-2 ${product.color}`}>
                    {product.category}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div className="text-lg font-black text-slate-900">${product.price.toFixed(2)}</div>
                  <div className="text-xs font-semibold text-gray-500">{product.stock} in stock</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart (Right Side) */}
      <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col shadow-xl z-10">
        {/* Cart Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500" />
            <span className="font-bold text-gray-700">Walk-in Customer</span>
          </div>
          <button className="text-blue-600 font-bold text-sm hover:underline">Add Customer</button>
        </div>

        {/* Cart Items */}
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

        {/* Totals & Payment */}
        <div className="p-4 border-t border-gray-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-gray-500 font-medium">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 font-medium">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-black text-gray-900 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button className="flex flex-col items-center justify-center gap-2 bg-blue-50 text-blue-700 py-3 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors font-bold">
              <Banknote className="w-6 h-6" />
              Cash
            </button>
            <button className="flex flex-col items-center justify-center gap-2 bg-indigo-50 text-indigo-700 py-3 rounded-xl border border-indigo-200 hover:bg-indigo-100 transition-colors font-bold">
              <CreditCard className="w-6 h-6" />
              Card
            </button>
          </div>
          
          <button className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all ${cart.length > 0 ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            <Receipt className="w-5 h-5" />
            Charge ${total.toFixed(2)}
          </button>
        </div>
      </div>

    </div>
  );
}
