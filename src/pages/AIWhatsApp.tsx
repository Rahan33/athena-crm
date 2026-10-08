import React, { useState, useEffect } from 'react';
import { MessageCircle, Bot, Link2, RefreshCw, Smartphone, QrCode, Shield, CheckCircle2, XCircle, User } from 'lucide-react';
import axios from 'axios';

export default function AIWhatsApp() {
  const [activeTab, setActiveTab] = useState('conversations');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Device Linking State
  const [webStatus, setWebStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [activeNumber, setActiveNumber] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
    fetchWebStatus();
    const logInterval = setInterval(fetchLogs, 3000);
    const webInterval = setInterval(fetchWebStatus, 2000);
    return () => {
      clearInterval(logInterval);
      clearInterval(webInterval);
    };
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

  const fetchWebStatus = async () => {
    try {
      const response = await axios.get('/api/ai-whatsapp/web-status');
      if (response.data.success) {
        setWebStatus(response.data.status);
        setQrCode(response.data.qrCode);
        setActiveNumber(response.data.activeNumber);
      }
    } catch (error) {
      console.error("Error fetching web status:", error);
    }
  };

  const startWebConnection = async () => {
    try {
      await axios.post('/api/ai-whatsapp/web-connect');
    } catch (error) {
      console.error("Error starting connection:", error);
    }
  };

  const logoutWebConnection = async () => {
    if (!window.confirm("Are you sure you want to disconnect your personal WhatsApp?")) return;
    try {
      await axios.post('/api/ai-whatsapp/web-disconnect');
    } catch (error) {
      console.error("Error disconnecting:", error);
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
            <h1 className="text-xl font-bold text-gray-900">AI WhatsApp Engine</h1>
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
            onClick={() => setActiveTab('linking')}
            className={`px-4 py-2 font-bold rounded-lg text-sm transition-colors flex items-center gap-2 ${activeTab === 'linking' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
          >
            <Smartphone className="w-4 h-4"/> Device Linking
          </button>
        </div>
      </div>

      {activeTab === 'conversations' && (
        <div className="flex-1 flex overflow-hidden">
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
                          <MessageCircle className="w-3 h-3 text-green-500" /> {log.channel} • {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Handled by AI
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                    <div className="flex gap-3">
                      <div className="text-2xl">👤</div>
                      <div>
                        <div className="text-xs font-bold text-gray-500 mb-1">Customer</div>
                        <div className="text-sm text-gray-800 font-medium">{log.inboundMessage}</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="text-2xl">🤖</div>
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
            
            {webStatus === 'disconnected' && (
              <div className="mt-4 bg-orange-50 border border-orange-200 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-orange-800 mb-1">Your WhatsApp is Disconnected</h3>
                  <p className="text-xs text-orange-700">The AI cannot reply to messages until you link your device.</p>
                </div>
                <button onClick={() => setActiveTab('linking')} className="px-4 py-2 bg-orange-600 text-white text-sm font-bold rounded-lg shadow-sm">Link Device Now</button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'linking' && (
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex justify-center">
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Instructions Side */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-800 to-teal-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                  <Smartphone className="w-64 h-64" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-black mb-3">Link Your Personal WhatsApp</h2>
                  <p className="text-green-100/90 text-lg font-medium leading-relaxed mb-6">
                    Use your phone to scan the QR code. Athena AI will run in the background as a linked device, automatically reading and replying to incoming text queries as you.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-black">1</div>
                      <p className="font-medium text-sm">Open WhatsApp on your phone.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-black">2</div>
                      <p className="font-medium text-sm">Tap <strong>Menu</strong> or <strong>Settings</strong> and select <strong>Linked Devices</strong>.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-black">3</div>
                      <p className="font-medium text-sm">Tap <strong>Link a Device</strong> and scan the QR code.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Side */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center">
              
              {webStatus === 'disconnected' && (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    <QrCode className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Ready to Connect</h3>
                    <p className="text-gray-500 font-medium mb-6">Click below to generate your secure linking QR code.</p>
                    <button 
                      onClick={startWebConnection}
                      className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95"
                    >
                      Generate QR Code
                    </button>
                  </div>
                </div>
              )}

              {webStatus === 'connecting' && (
                <div className="space-y-6 flex flex-col items-center">
                  {qrCode ? (
                    <div className="p-4 bg-white border-2 border-green-500 rounded-2xl shadow-lg animate-fade-in">
                      <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64" />
                    </div>
                  ) : (
                    <div className="w-64 h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400">
                      <RefreshCw className="w-8 h-8 animate-spin mb-4 text-green-500" />
                      <p className="font-bold text-sm">Requesting Secure Session...</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Scan QR Code</h3>
                    <p className="text-gray-500 font-medium">Point your phone's camera at the screen above.</p>
                  </div>
                </div>
              )}

              {webStatus === 'connected' && (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="w-24 h-24 bg-green-100 border-4 border-green-500 rounded-full flex items-center justify-center text-green-600 shadow-xl">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Device Linked!</h3>
                    <p className="text-green-600 font-bold mb-1">Athena AI is active and monitoring.</p>
                    <p className="text-gray-500 font-medium text-sm mb-6">Connected Number: <strong>+{activeNumber}</strong></p>
                    
                    <button 
                      onClick={logoutWebConnection}
                      className="px-8 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2 mx-auto"
                    >
                      <XCircle className="w-5 h-5"/> Logout Device
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
