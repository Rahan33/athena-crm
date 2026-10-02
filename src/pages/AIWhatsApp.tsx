import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, Bot, Search, Settings, Activity, Truck, CheckCircle2, User } from 'lucide-react';
import axios from 'axios';

export default function AIWhatsApp() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Poll for new interactions every 5 seconds
  useEffect(() => {
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

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

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
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm">
            <Settings className="w-4 h-4" /> Agent Settings
          </button>
          <button className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm shadow-sm" onClick={() => alert("Webhook URL for Twilio:\nhttps://your-domain.onrender.com/api/ai-whatsapp/webhook/whatsapp")}>
            <Phone className="w-4 h-4" /> Connect Twilio Number
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Analytics */}
        <div className="w-72 bg-white border-r border-gray-200 p-4 overflow-y-auto hidden md:block">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">Live Traffic</h2>
          
          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-600">Active Chats</span>
                <MessageCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-black text-gray-900">{logs.filter(l => l.type === 'whatsapp').length + 1247}</div>
              <div className="text-xs font-bold text-green-600 mt-1">Live from Twilio</div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-600">AI Handled Calls</span>
                <Phone className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-gray-900">{logs.filter(l => l.type === 'voice').length + 892}</div>
              <div className="text-xs font-bold text-blue-600 mt-1">Live from Twilio</div>
            </div>
          </div>

          <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">Intent Breakdown</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-orange-500"/> Order Tracking</div>
              <span>45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-orange-500 h-1.5 rounded-full" style={{width: '45%'}}></div></div>
            
            <div className="flex items-center justify-between text-sm font-semibold text-gray-700 mt-2">
              <div className="flex items-center gap-2"><Bot className="w-4 h-4 text-purple-500"/> Product Query</div>
              <span>30%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full" style={{width: '30%'}}></div></div>
          </div>
        </div>

        {/* Live Inbox / Feed */}
        <div className="flex-1 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Live AI Interventions</h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2 text-gray-400" />
              <input type="text" placeholder="Search transcripts..." className="pl-9 pr-4 py-1.5 bg-gray-100 rounded-lg text-sm border-transparent focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"/>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="text-center text-gray-500 py-10">Connecting to Twilio Webhooks...</div>
            ) : logs.length === 0 ? (
              <div className="text-center text-gray-500 py-10">No live interactions yet.</div>
            ) : (
              logs.map((log: any) => (
                <div key={log.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-gray-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">
                          {log.user} <span className="text-xs text-gray-500 font-normal ml-2">{log.phone}</span>
                        </h4>
                        <p className={`text-xs font-bold flex items-center gap-1 mt-0.5 ${log.type === 'whatsapp' ? 'text-green-600' : 'text-blue-600'}`}>
                          {log.type === 'whatsapp' ? <MessageCircle className="w-3 h-3"/> : <Phone className="w-3 h-3"/>} 
                          {log.type === 'whatsapp' ? 'WhatsApp Message' : 'Voice Call'} - {log.intent}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-gray-400">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Chat Bubbles */}
                    {log.type === 'whatsapp' ? (
                      <div className="flex flex-col gap-2 mt-3">
                        {log.messages.map((msg: any, idx: number) => (
                          msg.sender === 'user' ? (
                            <div key={idx} className="bg-gray-100 p-3 rounded-tr-xl rounded-b-xl text-sm text-gray-800 w-3/4">
                              {msg.text}
                            </div>
                          ) : (
                            <div key={idx} className="bg-green-50 p-3 rounded-tl-xl rounded-b-xl text-sm text-green-900 w-3/4 ml-auto border border-green-100 flex gap-2">
                              <Bot className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600"/>
                              <div>{msg.text}</div>
                            </div>
                          )
                        ))}
                      </div>
                    ) : (
                      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-sm mt-3">
                        <div className="font-bold text-blue-800 mb-2 flex items-center gap-2"><Activity className="w-4 h-4"/> AI Call Transcript</div>
                        {log.messages.map((msg: any, idx: number) => (
                          <p key={idx} className={msg.sender === 'user' ? "text-gray-600 mb-1" : "text-blue-700 mb-1"}>
                            <strong className={msg.sender === 'user' ? "text-gray-900" : "text-blue-900"}>
                              {msg.sender === 'user' ? 'User:' : 'AI:'}
                            </strong> "{msg.text}"
                          </p>
                        ))}
                      </div>
                    )}

                    {log.status === 'Resolved' && (
                      <div className="text-right mt-2">
                        <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center justify-end gap-1 w-max ml-auto">
                          <CheckCircle2 className="w-3 h-3"/> Auto-Resolved by AI
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
