import React, { useState } from 'react';
import { Mail as MailIcon, Inbox, Send, Archive, Trash2, Star, Clock, FileText, AlertCircle, Search, Edit3, MoreVertical, Paperclip, Reply, Forward } from 'lucide-react';

export default function Mail() {
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedMail, setSelectedMail] = useState<number | null>(1);

  const folders = [
    { id: 'inbox', name: 'Inbox', icon: Inbox, count: 24 },
    { id: 'starred', name: 'Starred', icon: Star, count: 5 },
    { id: 'snoozed', name: 'Snoozed', icon: Clock, count: 0 },
    { id: 'sent', name: 'Sent', icon: Send, count: 0 },
    { id: 'drafts', name: 'Drafts', icon: FileText, count: 12 },
    { id: 'spam', name: 'Spam', icon: AlertCircle, count: 4 },
    { id: 'trash', name: 'Trash', icon: Trash2, count: 0 },
  ];

  const emails = [
    {
      id: 1,
      sender: 'Stripe',
      email: 'receipts@stripe.com',
      subject: 'Payment successfully processed for Invoice #INV-2026-098',
      preview: 'Your payment of $4,500.00 to Cloud Hosting Services has been processed successfully...',
      time: '10:42 AM',
      date: 'Today',
      isUnread: true,
      isStarred: false,
      body: 'Hi Admin,\n\nWe successfully processed your payment of $4,500.00 for Invoice #INV-2026-098. You can download your official receipt using the link below.\n\nThank you for using Stripe.',
    },
    {
      id: 2,
      sender: 'Sarah Jenkins',
      email: 's.jenkins@clientcorp.com',
      subject: 'Re: Q4 Marketing Proposal Review',
      preview: 'Hi team, I reviewed the proposal and it looks great. Just a few minor adjustments needed on page 4...',
      time: '09:15 AM',
      date: 'Today',
      isUnread: true,
      isStarred: true,
      body: 'Hi team,\n\nI reviewed the proposal and it looks great. Just a few minor adjustments needed on page 4 regarding the budget breakdown. \n\nCan we jump on a quick 10-minute call this afternoon to finalize it?\n\nBest,\nSarah',
    },
    {
      id: 3,
      sender: 'System Alerts',
      email: 'noreply@athena-os.com',
      subject: 'Server Capacity Warning: DB-Node-02',
      preview: 'Warning: Database node 02 is currently operating at 87% capacity. Please scale up resources...',
      time: 'Yesterday',
      date: 'Oct 01',
      isUnread: false,
      isStarred: false,
      body: 'Warning: Database node 02 is currently operating at 87% capacity. \n\nPlease scale up resources or perform cleanup within the next 24 hours to prevent performance degradation.',
    },
    {
      id: 4,
      sender: 'Michael Chang',
      email: 'm.chang@internal.com',
      subject: 'Weekly Team Sync Notes',
      preview: 'Here are the minutes from today\'s sync. Action items are highlighted in bold...',
      time: 'Yesterday',
      date: 'Oct 01',
      isUnread: false,
      isStarred: false,
      body: 'Here are the minutes from today\'s sync.\n\nAction items:\n- Review Q3 targets (All)\n- Finalize the UI mockups (Design)\n- Send the compliance report to Legal (Mike)\n\nLet me know if I missed anything!',
    }
  ];

  const activeEmailData = emails.find(e => e.id === selectedMail);

  return (
    <div className="h-[calc(100vh-4rem)] bg-white flex overflow-hidden rounded-2xl shadow-sm border border-gray-200">
      
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-4">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors">
            <Edit3 className="w-5 h-5" />
            Compose
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {folders.map(folder => (
            <button
              key={folder.id}
              onClick={() => setActiveFolder(folder.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeFolder === folder.id 
                  ? 'bg-blue-100/50 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-200/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <folder.icon className={`w-4 h-4 ${activeFolder === folder.id ? 'text-blue-600' : 'text-gray-400'}`} />
                {folder.name}
              </div>
              {folder.count > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeFolder === folder.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {folder.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Email List */}
      <div className="w-full md:w-[350px] lg:w-[400px] border-r border-gray-200 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200 flex flex-col gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search all emails..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {emails.map(email => (
            <div 
              key={email.id}
              onClick={() => setSelectedMail(email.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedMail === email.id ? 'bg-blue-50/50' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm ${email.isUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                  {email.sender}
                </span>
                <span className={`text-xs ${email.isUnread ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                  {email.time}
                </span>
              </div>
              <div className={`text-sm mb-1 truncate ${email.isUnread ? 'font-bold text-gray-900' : 'text-gray-800'}`}>
                {email.subject}
              </div>
              <div className="text-xs text-gray-500 line-clamp-2">
                {email.preview}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Body Pane */}
      <div className="flex-1 flex flex-col bg-white hidden sm:flex">
        {activeEmailData ? (
          <>
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-gray-900">{activeEmailData.subject}</h2>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                    {activeEmailData.sender.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{activeEmailData.sender}</span>
                      <span className="text-xs text-gray-500">&lt;{activeEmailData.email}&gt;</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      to me • {activeEmailData.date} at {activeEmailData.time}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Archive className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed max-w-3xl">
                {activeEmailData.body}
              </div>
              
              <div className="mt-8 flex gap-3">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                  <Reply className="w-4 h-4" />
                  Reply
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                  <Forward className="w-4 h-4" />
                  Forward
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MailIcon className="w-16 h-16 mb-4 opacity-20" />
            <p>Select an email to read</p>
          </div>
        )}
      </div>

    </div>
  );
}
