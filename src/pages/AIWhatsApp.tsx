import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, Bot, Search, Settings, Activity, Truck, CheckCircle2, User, Link2, XCircle, RefreshCw, Key, Shield, Plus } from 'lucide-react';
import axios from 'axios';

export default function AIWhatsApp() {
  const [activeTab, setActiveTab] = useState('conversations');
  const [logs, setLogs] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Setup modal for new connection
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectForm, setConnectForm] = useState({ phoneNumber: '', businessName: '', provider: 'Meta Business Cloud', apiKey: '' });
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    fetchLogs();
    fetchAccounts();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('/api/ai-whatsapp/logs');
      setLogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('/api/ai-whatsapp/accounts');
      setAccounts(response.data.accounts || []);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const response = await axios.post('/api/ai-whatsapp/accounts/connect', connectForm);
      if (response.data.success) {
        alert('WhatsApp Business Account Connected Successfully!');
        setIsConnectModalOpen(false);
        setConnectForm({ phoneNumber: '', businessName: '', provider: 'Meta Business Cloud', apiKey: '' });
        fetchAccounts();
      }
    } catch (error) {
      alert('Failed to connect: ' + error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (id: string) => {
    if (!window.confirm("Disconnect this WhatsApp account?")) return;
    try {
      await axios.post(`/api/ai-whatsapp/accounts/${id}/disconnect`);
      fetchAccounts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI WhatsApp & Voice Engine</h1>
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Agent "Athena-Alpha" is Online
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('conversations')}
            className={`px-4 py-2 font-bold rounded-lg text-sm transition-colors ${activeTab === 'conversations' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
          >
            Live Conversations
          </button>
          <button 
            onClick={() => setActiveTab('integrations')}
            className={`px-4 py-2 font-bold rounded-lg text-sm transition-colors flex items-center gap-2 ${activeTab === 'integrations' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
          >
            <Link2 className="w-4 h-4"/> Integrations
          </button>
        </div>
      </div>

      {activeTab === 'conversations' && (
        <div className="flex-1 flex overflow-hidden">
          {/* Main Feed */}
          <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 md:p-6 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {loading && <div className="text-center p-8 text-gray-400 font-medium">Booting AI Engine...</div>}
              {logs.length === 0 && !loading && (
                <div className="text-center p-8 text-gray-400 font-medium">No active conversations. Waiting for incoming WhatsApp messages...</div>
              )}
              {logs.map((log: any, i: number) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-gray-300">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{log.customerName}</h3>
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          <MessageCircle className="w-3 h-3 text-green-500" /> {log.channel} â€¢ {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                    <div className="flex gap-3">
                      <div className="text-2xl">ðŸ‘¤</div>
                      <div>
                        <div className="text-xs font-bold text-gray-500 mb-1">Customer</div>
                        <div className="text-sm text-gray-800 font-medium">{log.inboundMessage}</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="text-2xl">ðŸ¤–</div>
                      <div>
                        <div className="text-xs font-bold text-green-600 mb-1 flex items-center gap-1"><Bot className="w-3 h-3"/> Athena AI Reply</div>
                        <div className="text-sm text-gray-800 font-medium bg-white p-3 rounded-xl border border-green-100 shadow-sm">
                          {log.aiResponse}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Action Bar */}
            <div className="mt-4 bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
              <h3 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" /> Dispatch Test Message (Twilio API)
              </h3>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  id="testPhone"
                  placeholder="Enter Phone Number (e.g. +1234567890)" 
                  className="w-1/3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-green-500 outline-none"
                />
                <input 
                  type="text" 
                  id="testMsg"
                  placeholder="Type a message..." 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-green-500 outline-none"
                />
                <button 
                  onClick={async () => {
                    const to = (document.getElementById('testPhone') as HTMLInputElement).value;
                    const body = (document.getElementById('testMsg') as HTMLInputElement).value;
                    if(!to || !body) return alert("Fill out both fields!");
                    
                    try {
                      const res = await fetch('/api/telephony/test-whatsapp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ to, body })
                      });
                      const data = await res.json();
                      if (data.success) {
                        alert('Successfully dispatched via Twilio!\nMessage SID: ' + data.sid);
                      } else {
                        alert('Twilio Error: ' + data.error);
                      }
                    } catch (e: any) {
                      alert('Network error connecting to backend: ' + e.message);
                    }
                  }}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-sm"
                >
                  Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-green-800 to-teal-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden flex justify-between items-center">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl font-black mb-3">WhatsApp API Integrations</h2>
                <p className="text-green-100/90 text-lg font-medium leading-relaxed">
                  Connect your official WhatsApp Business accounts. Once linked, the AI Engine will automatically handle inbound queries, bookings, and customer support on these numbers.
                </p>
              </div>
              <button onClick={() => setIsConnectModalOpen(true)} className="relative z-10 bg-white text-green-900 font-black px-6 py-3 rounded-xl shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Plus className="w-5 h-5" /> Connect Account
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <h3 className="font-black text-xl text-gray-900">Connected Accounts</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-black tracking-wider">
                      <th className="p-5 pl-6">Business Name</th>
                      <th className="p-5">Phone Number</th>
                      <th className="p-5">Provider</th>
                      <th className="p-5">Status</th>
                      <th className="p-5 pr-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {accounts.map(acc => (
                      <tr key={acc.id} className="border-b border-gray-50 hover:bg-green-50/30 transition-colors">
                        <td className="p-5 pl-6 font-bold text-gray-900">{acc.businessName}</td>
                        <td className="p-5 font-black text-gray-700">{acc.phoneNumber}</td>
                        <td className="p-5">
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg font-bold text-xs">{acc.provider}</span>
                        </td>
                        <td className="p-5">
                          {acc.status === 'Connected' ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Connected</span>
                          ) : (
                            <span className="text-gray-500 font-bold flex items-center gap-1.5"><XCircle className="w-4 h-4"/> Disconnected</span>
                          )}
                        </td>
                        <td className="p-5 pr-6 text-right">
                          {acc.status === 'Connected' && (
                            <button onClick={() => handleDisconnect(acc.id)} className="text-xs font-bold text-red-600 hover:underline">Disconnect</button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {accounts.length === 0 && (
                      <tr><td colSpan={5} className="p-12 text-center text-gray-400 font-medium text-lg">No WhatsApp accounts connected. Click above to integrate.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connect Account Modal */}
      {isConnectModalOpen && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="font-black text-xl text-gray-900 flex items-center gap-2"><Link2 className="w-5 h-5 text-green-600"/> Connect WhatsApp</h2>
              <button onClick={() => setIsConnectModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-gray-100 p-1.5 rounded-full"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-black text-gray-700 mb-1">Business Name</label>
                <input type="text" value={connectForm.businessName} onChange={e => setConnectForm({...connectForm, businessName: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white font-medium outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Acme Corp" />
              </div>
              <div>
                <label className="block text-sm font-black text-gray-700 mb-1">Phone Number (with Country Code)</label>
                <input type="text" value={connectForm.phoneNumber} onChange={e => setConnectForm({...connectForm, phoneNumber: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white font-medium outline-none focus:ring-2 focus:ring-green-500" placeholder="+1 234 567 8900" />
              </div>
              <div>
                <label className="block text-sm font-black text-gray-700 mb-1">API Provider</label>
                <select value={connectForm.provider} onChange={e => setConnectForm({...connectForm, provider: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white font-medium outline-none focus:ring-2 focus:ring-green-500">
                  <option value="Meta Business Cloud">Meta Business Cloud (Official API)</option>
                  <option value="Twilio WhatsApp API">Twilio WhatsApp API</option>
                  <option value="WATI / Interakt">WATI / Interakt</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-black text-gray-700 mb-1">API Access Token / Key</label>
                <div className="relative">
                  <Key className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                  <input type="password" value={connectForm.apiKey} onChange={e => setConnectForm({...connectForm, apiKey: e.target.value})} className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white font-medium outline-none focus:ring-2 focus:ring-green-500" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 mt-4">
                <Shield className="w-5 h-5 text-blue-600 shrink-0" />
                <p className="text-xs text-blue-800 font-medium">Your API keys are encrypted at rest. Upon connecting, we will instantly provision webhook routes so Athena AI can begin replying to messages.</p>
              </div>

            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsConnectModalOpen(false)} className="px-5 py-2.5 font-bold text-gray-600 hover:bg-gray-200 rounded-xl">Cancel</button>
              <button onClick={handleConnect} disabled={isConnecting} className="px-5 py-2.5 font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-sm flex items-center gap-2 disabled:opacity-50">
                {isConnecting ? <RefreshCw className="w-4 h-4 animate-spin"/> : <CheckCircle2 className="w-4 h-4"/>} 
                Connect Account
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
