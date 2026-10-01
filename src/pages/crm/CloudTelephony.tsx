import { Device } from '@twilio/voice-sdk';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  PhoneForwarded, 
  PhoneCall, 
  PhoneOff, 
  PhoneIncoming, 
  PhoneOutgoing, 
  Mic, 
  MicOff, 
  Pause, 
  Play, 
  Volume2, 
  VolumeX, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  FileText, 
  User, 
  Activity, 
  Radio, 
  Sparkles,
  RotateCcw,
  FastForward,
  Headphones,
  Tag,
  Settings
} from 'lucide-react';
import CRMNavigation from '../../components/CRMNavigation';
import { io, Socket } from 'socket.io-client';

const STUN_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export default function CloudTelephony() {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [directionFilter, setDirectionFilter] = useState('All');

  // Softphone Dialer State
  const [selectedFromNumber, setSelectedFromNumber] = useState<string>('');
  const [dialNumber, setDialNumber] = useState('');
  const [callerName, setCallerName] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const callTimerRef = useRef<any>(null);

  // Audio Recording Player State
  const [selectedCallForPlayback, setSelectedCallForPlayback] = useState<any>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const audioIntervalRef = useRef<any>(null);

  // WebRTC Internet Calling State
  const [webrtcRoomId, setWebrtcRoomId] = useState<string>('');
  const [webrtcLink, setWebrtcLink] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const twilioDevice = useRef<any>(null);
  const twilioCall = useRef<any>(null);

  // Modals
  const [showLogCallModal, setShowLogCallModal] = useState(false);
  const [showEditCallModal, setShowEditCallModal] = useState(false);
  const [editingCall, setEditingCall] = useState<any>(null);

  // Manage Numbers Settings State
  const [showNumbersModal, setShowNumbersModal] = useState(false);
  const [telephonyNumbers, setTelephonyNumbers] = useState([
    { id: '1', number: '+91 8870370740', assignedTo: 'Admin (Rohan)', role: 'Sales Team', recordingEnabled: true }
  ]);
  const [newNumberForm, setNewNumberForm] = useState({
    countryCode: '+91',
    number: '',
    assignedTo: '',
    role: 'Sales Team',
    recordingEnabled: true
  });

  // Forms
  const [callFormData, setCallFormData] = useState({
    contactName: '',
    phoneNumber: '',
    direction: 'Outbound',
    durationSeconds: 60,
    status: 'Completed',
    agentName: 'Support Rep',
    sentiment: 'Positive',
    notes: '',
    tags: 'Inquiry, Pricing'
  });

  const fetchCalls = async () => {
    try {
      const res = await axios.get(`/api/crm/telephony/calls`);
      setCalls(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  useEffect(() => {
    if (telephonyNumbers.length > 0 && !selectedFromNumber) {
      setSelectedFromNumber(telephonyNumbers[0].number);
    } else if (telephonyNumbers.length === 0) {
      setSelectedFromNumber('');
    }
  }, [telephonyNumbers, selectedFromNumber]);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL || '', { path: '/socket.io' });
    setSocket(newSocket);

    return () => {
      if (localStream.current) localStream.current.getTracks().forEach(t => t.stop());
      if (peerConnection.current) peerConnection.current.close();
      newSocket.disconnect();
    };
  }, []);

  const generateWebRTCLink = async () => {
    if (!socket) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStream.current = stream;
      if (localAudioRef.current) localAudioRef.current.srcObject = stream;

      const roomId = `room-${Math.random().toString(36).substring(2, 9)}`;
      setWebrtcRoomId(roomId);
      setWebrtcLink(`${window.location.origin}/call/${roomId}`);
      
      const pc = new RTCPeerConnection(STUN_SERVERS);
      peerConnection.current = pc;
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (remoteAudioRef.current && event.streams[0]) {
          remoteAudioRef.current.srcObject = event.streams[0];
          setIsCalling(true);
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('webrtc_ice_candidate', { roomId, candidate: event.candidate });
        }
      };

      socket.on('peer_joined', async () => {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('webrtc_offer', { roomId, offer });
      });

      socket.on('webrtc_answer', async (data) => {
        if (data.roomId === roomId && peerConnection.current) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
      });

      socket.on('webrtc_ice_candidate', async (data) => {
        if (data.roomId === roomId && data.candidate && peerConnection.current) {
          try {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
          } catch (e) {
            console.error('Error adding ice candidate', e);
          }
        }
      });

      socket.emit('join_webrtc_room', roomId);
    } catch (err) {
      console.error(err);
      alert('Could not access microphone.');
    }
  };

  const sendWhatsAppLink = () => {
    if (!webrtcLink || !dialNumber) {
      alert('Please enter a destination phone number and generate a link first.');
      return;
    }
    const message = `Hi, please click this link to join a secure audio call with Athena OS Support: ${webrtcLink}`;
    
    // Simulate Backend API Call Scaffold
    axios.post(`/api/crm/whatsapp/send`, {
      to: dialNumber,
      message
    }).catch(console.error);

    // Deep link fallback for immediate usability
    const cleanNumber = dialNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Softphone Call Timer
  useEffect(() => {
    if (isCalling) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [isCalling]);

  // Audio Player Progress Simulator
  useEffect(() => {
    if (isPlayingAudio) {
      audioIntervalRef.current = setInterval(() => {
        setPlaybackProgress(prev => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 2 * playbackSpeed;
        });
      }, 500);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [isPlayingAudio, playbackSpeed]);

  const handleDialPadPress = (val: string) => {
    setDialNumber(prev => prev + val);
  };

  const handleStartCall = async () => {
    if (!selectedFromNumber) {
      alert('Please integrate and select a phone number in "Manage Numbers" to make calls from.');
      return;
    }
    if (!dialNumber) {
      alert('Please enter a destination phone number to dial.');
      return;
    }
    setIsCalling(true);
    try {
      const res = await fetch('/api/telephony/token');
      const data = await res.json();
      const device = new Device(data.token, {
        codecPreferences: ['opus', 'pcmu'],
        fakeLocalDTMF: true,
        enableRingingState: true
      });
      twilioDevice.current = device;
      await device.register();

        let cleanNumber = dialNumber.replace(/\D/g, '');
        if (cleanNumber.length === 10) cleanNumber = '+91' + cleanNumber;
        else if (!cleanNumber.startsWith('+')) cleanNumber = '+' + cleanNumber;
        const call = await device.connect({
          params: {
            To: cleanNumber,
            CallerId: selectedFromNumber
          }
        });
        twilioCall.current = call;
        call.on('disconnect', () => {
          setIsCalling(false);
          twilioCall.current = null;
        });
      
    } catch (err) {
      console.error(err);
      alert('Failed to connect call via Twilio.');
      setIsCalling(false);
    }
  };
  
  const handleEndCall = async () => {
    if (twilioCall.current) {
      twilioCall.current.disconnect();
    }
    setIsCalling(false);
  };

  const handleOpenLogCall = () => {
    setCallFormData({
      contactName: '',
      phoneNumber: '',
      direction: 'Outbound',
      durationSeconds: 45,
      status: 'Completed',
      agentName: 'Support Rep',
      sentiment: 'Positive',
      notes: '',
      tags: 'Inbound, Support'
    });
    setShowLogCallModal(true);
  };

  const handleOpenEditCall = (call: any) => {
    setEditingCall(call);
    setCallFormData({
      contactName: call.contactName || '',
      phoneNumber: call.phoneNumber || '',
      direction: call.direction || 'Outbound',
      durationSeconds: call.durationSeconds || 0,
      status: call.status || 'Completed',
      agentName: call.agentName || '',
      sentiment: call.sentiment || 'Positive',
      notes: call.notes || '',
      tags: Array.isArray(call.tags) ? call.tags.join(', ') : ''
    });
    setShowEditCallModal(true);
  };

  const handleLogCallSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`/api/crm/telephony/calls`, {
        ...callFormData,
        tags: callFormData.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      setShowLogCallModal(false);
      fetchCalls();
    } catch (err) {
      console.error(err);
      alert('Failed to log call');
    }
  };

  const handleEditCallSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCall) return;
    try {
      await axios.put(`/api/crm/telephony/calls/${editingCall.id}`, {
        ...callFormData,
        tags: callFormData.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      setShowEditCallModal(false);
      setEditingCall(null);
      fetchCalls();
    } catch (err) {
      console.error(err);
      alert('Failed to update call record');
    }
  };

  const handleDeleteCall = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this telephony recording and call record?')) return;
    try {
      await axios.delete(`/api/crm/telephony/calls/${id}`);
      if (selectedCallForPlayback?.id === id) {
        setSelectedCallForPlayback(null);
        setIsPlayingAudio(false);
      }
      fetchCalls();
    } catch (err) {
      console.error(err);
      alert('Failed to delete call');
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Metrics (Zero baseline)
  const totalCallsCount = calls.length;
  const inboundCount = calls.filter(c => c.direction === 'Inbound').length;
  const outboundCount = calls.filter(c => c.direction === 'Outbound').length;
  const recordingsCount = calls.filter(c => c.hasRecording).length;
  const avgDuration = totalCallsCount > 0 ? Math.round(calls.reduce((a, b) => a + (Number(b.durationSeconds) || 0), 0) / totalCallsCount) : 0;

  const filteredCalls = calls.filter(c => {
    const matchesSearch = 
      c.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phoneNumber?.includes(searchQuery) ||
      c.callId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDir = directionFilter === 'All' || c.direction === directionFilter;
    return matchesSearch && matchesDir;
  });

  const handleAddNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNumberForm.number || !newNumberForm.assignedTo) return;
    const fullNumber = `${newNumberForm.countryCode} ${newNumberForm.number}`;
    setTelephonyNumbers([...telephonyNumbers, { 
      id: Date.now().toString(), 
      number: fullNumber,
      assignedTo: newNumberForm.assignedTo,
      role: newNumberForm.role,
      recordingEnabled: newNumberForm.recordingEnabled
    }]);
    setNewNumberForm({ countryCode: '+91', number: '', assignedTo: '', role: 'Sales Team', recordingEnabled: true });
  };

  const handleDeleteNumber = (id: string) => {
    setTelephonyNumbers(telephonyNumbers.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <CRMNavigation />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <PhoneForwarded className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Cloud Telephony & Call Recordings</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Browser softphone dialer, WebRTC SIP trunking, call recording playback with audio waveforms and AI transcripts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNumbersModal(true)}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4" />
            <span>Manage Numbers</span>
          </button>
          <button
            onClick={handleOpenLogCall}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Log Call Record</span>
          </button>
        </div>
      </div>

      {/* Zero-based KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Calls</span>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{totalCallsCount}</p>
          <span className="text-[10px] text-gray-400 mt-0.5 block">Omnichannel volume</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider flex items-center gap-1">
            <PhoneIncoming className="w-3.5 h-3.5" /> Inbound
          </span>
          <p className="text-2xl font-extrabold text-blue-700 mt-1">{inboundCount}</p>
          <span className="text-[10px] text-blue-400 mt-0.5 block">Client calls received</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-xs">
          <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider flex items-center gap-1">
            <PhoneOutgoing className="w-3.5 h-3.5" /> Outbound
          </span>
          <p className="text-2xl font-extrabold text-purple-700 mt-1">{outboundCount}</p>
          <span className="text-[10px] text-purple-400 mt-0.5 block">Agent placed calls</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
            <Headphones className="w-3.5 h-3.5" /> Recordings
          </span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">{recordingsCount}</p>
          <span className="text-[10px] text-emerald-500 mt-0.5 block">Audio archives</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Avg Duration
          </span>
          <p className="text-2xl font-extrabold text-amber-700 mt-1">{avgDuration}s</p>
          <span className="text-[10px] text-amber-500 mt-0.5 block">Call handle time</span>
        </div>
      </div>

      {/* Main Telephony Layout: Dialer on Left, Call Logs + Recording Player on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SOFTPHONE DIALER KEYPAD (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="font-bold text-gray-900 text-sm">Cloud Softphone</h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
              WebRTC HD
            </span>
          </div>

          {/* Active Call HUD Banner */}
          {isCalling ? (
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                  <Activity className="w-3 h-3 animate-spin" /> In Call Active
                </span>
                <span className="font-mono text-sm font-bold text-purple-200">
                  {formatSeconds(callDuration)}
                </span>
              </div>
              <div className="bg-white/10 p-2 rounded-lg border border-white/20">
                <p className="text-[10px] text-purple-200 font-bold uppercase tracking-wider mb-0.5">Calling From (Integrated ID)</p>
                <p className="font-mono font-bold text-white text-xs">{selectedFromNumber}</p>
              </div>
              <div>
                <p className="text-[10px] text-purple-200 font-bold uppercase tracking-wider mb-0.5">Calling To (Destination)</p>
                <p className="font-bold text-sm text-white">{callerName || 'Prospect'}</p>
                <p className="text-xs text-purple-300 font-mono">{dialNumber}</p>
              </div>

              {/* In-Call Controls */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[10px] text-center">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2 rounded-lg font-bold flex flex-col items-center gap-1 transition-all ${
                    isMuted ? 'bg-red-500/30 text-red-200' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {isMuted ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4" />}
                  <span>{isMuted ? 'Muted' : 'Mute'}</span>
                </button>
                <button
                  onClick={() => setIsOnHold(!isOnHold)}
                  className={`p-2 rounded-lg font-bold flex flex-col items-center gap-1 transition-all ${
                    isOnHold ? 'bg-amber-500/30 text-amber-200' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Pause className="w-4 h-4" />
                  <span>{isOnHold ? 'Held' : 'Hold'}</span>
                </button>
                <button
                  onClick={handleEndCall}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex flex-col items-center gap-1 transition-all"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End</span>
                </button>
              </div>
            </div>
          ) : (
            /* Input fields when idle */
            <div className="space-y-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Call From (Integrated Number)</label>
                <select
                  value={selectedFromNumber}
                  onChange={e => setSelectedFromNumber(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {telephonyNumbers.length === 0 ? (
                    <option value="">-- No Numbers Integrated --</option>
                  ) : (
                    telephonyNumbers.map(n => (
                      <option key={n.id} value={n.number}>
                        {n.number} ({n.assignedTo})
                      </option>
                    ))
                  )}
                </select>
              </div>
              <input
                type="text"
                placeholder="Destination Contact Name (optional)"
                value={callerName}
                onChange={e => setCallerName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="relative">
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={dialNumber}
                  onChange={e => setDialNumber(e.target.value)}
                  className="w-full px-3 py-2 text-base font-mono font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10 text-center"
                />
                {dialNumber && (
                  <button
                    onClick={() => setDialNumber(dialNumber.slice(0, -1))}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold text-xs"
                  >
                    ⌫
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Keypad Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { num: '1', sub: '' },
              { num: '2', sub: 'ABC' },
              { num: '3', sub: 'DEF' },
              { num: '4', sub: 'GHI' },
              { num: '5', sub: 'JKL' },
              { num: '6', sub: 'MNO' },
              { num: '7', sub: 'PQRS' },
              { num: '8', sub: 'TUV' },
              { num: '9', sub: 'WXYZ' },
              { num: '*', sub: '' },
              { num: '0', sub: '+' },
              { num: '#', sub: '' }
            ].map(btn => (
              <button
                key={btn.num}
                type="button"
                onClick={() => handleDialPadPress(btn.num)}
                className="py-3 px-2 rounded-xl bg-gray-50 hover:bg-purple-50 hover:border-purple-300 border border-gray-200 transition-all flex flex-col items-center justify-center active:scale-95"
              >
                <span className="text-base font-extrabold text-gray-800">{btn.num}</span>
                {btn.sub && <span className="text-[9px] font-semibold text-gray-400">{btn.sub}</span>}
              </button>
            ))}
          </div>

          {/* Dial / Action Button */}
          {!isCalling && (
            <div className="space-y-2">
              <button
                onClick={handleStartCall}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Dial Call Now</span>
              </button>
            </div>
          )}
          
          {/* Hidden WebRTC Audio Elements */}
          <audio ref={localAudioRef} autoPlay muted />
          <audio ref={remoteAudioRef} autoPlay />
        </div>

        {/* RIGHT AREA: CALL LOGS & RECORDING AUDIO PLAYER (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* AUDIO RECORDING PLAYER SECTION (Active when a call is selected or sample) */}
          {selectedCallForPlayback && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-5 rounded-2xl shadow-md border border-purple-500/20 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-500/20 text-purple-300 rounded-lg">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Call Recording & AI Speech Analysis</h4>
                    <p className="text-xs text-purple-200">
                      {selectedCallForPlayback.contactName} • {selectedCallForPlayback.phoneNumber}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCallForPlayback(null)}
                  className="text-gray-400 hover:text-white text-xs font-bold"
                >
                  ✕ Close Player
                </button>
              </div>

              {/* Dynamic Waveform Simulation */}
              <div className="bg-black/30 p-3 rounded-xl border border-white/10 flex items-center gap-1 h-16 justify-center overflow-hidden">
                {[
                  12, 24, 38, 48, 20, 60, 80, 45, 30, 70, 90, 55, 35, 65, 85, 40,
                  25, 75, 95, 50, 30, 60, 40, 20, 55, 85, 65, 35, 20, 45, 70, 30,
                  15, 40, 60, 80, 50, 25, 65, 85, 45, 20, 55, 75, 35, 15, 30, 20
                ].map((height, i) => {
                  const isActive = (i / 48) * 100 <= playbackProgress;
                  return (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isActive
                          ? 'bg-purple-400 shadow-sm shadow-purple-500'
                          : 'bg-white/20'
                      }`}
                      style={{
                        height: isPlayingAudio ? `${Math.max(8, (height * (0.8 + Math.random() * 0.4)))}%` : `${height}%`
                      }}
                    />
                  );
                })}
              </div>

              {/* Audio Controls */}
              <div className="flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-all shadow-sm"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <button
                    onClick={() => setPlaybackProgress(0)}
                    className="p-2 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
                    title="Rewind to start"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-purple-200">
                    {formatSeconds(Math.round(((selectedCallForPlayback.durationSeconds || 30) * playbackProgress) / 100))} / {formatSeconds(selectedCallForPlayback.durationSeconds || 30)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-[10px]">Speed:</span>
                  {[1, 1.25, 1.5].map(spd => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        playbackSpeed === spd ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Transcript */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] font-bold text-purple-300 pb-1 border-b border-white/10">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Speech-to-Text Transcript
                  </span>
                  <span className="text-[10px] text-emerald-400 font-normal">Sentiment: Positive (94%)</span>
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {Array.isArray(selectedCallForPlayback.transcript) && selectedCallForPlayback.transcript.map((line: any, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <span className="font-bold text-purple-300 text-[10px] w-12 flex-shrink-0">
                        {line.speaker}:
                      </span>
                      <span className="text-gray-200 text-[11px]">{line.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CALL LOGS & HISTORY */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden space-y-3 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>Call Logs & Telephony Records</span>
              </h3>

              <div className="flex items-center gap-2">
                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search logs by number, contact..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <select
                  value={directionFilter}
                  onChange={e => setDirectionFilter(e.target.value)}
                  className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                >
                  <option value="All">All Directions</option>
                  <option value="Inbound">Inbound</option>
                  <option value="Outbound">Outbound</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">Call ID / Time</th>
                    <th className="py-2.5 px-3">Contact</th>
                    <th className="py-2.5 px-3">Direction</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Agent</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCalls.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400">
                        <PhoneCall className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="font-bold text-gray-700 text-sm">No call recordings or logs found</p>
                        <p className="text-xs text-gray-400 mt-0.5">Use the Cloud Softphone dialer on the left or click "+ Log Call Record" to log interactions.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCalls.map(c => (
                      <tr key={c.id} className="hover:bg-purple-50/20">
                        <td className="py-2.5 px-3">
                          <span className="font-mono font-bold text-purple-700 text-[11px]">{c.callId}</span>
                          <div className="text-[10px] text-gray-400">{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-gray-900">{c.contactName}</div>
                          <div className="font-mono text-[10px] text-gray-500">{c.phoneNumber}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            c.direction === 'Inbound' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {c.direction === 'Inbound' ? <PhoneIncoming className="w-3 h-3" /> : <PhoneOutgoing className="w-3 h-3" />}
                            {c.direction}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-medium text-gray-700">{formatSeconds(c.durationSeconds)}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                            c.status === 'Missed' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-gray-600">{c.agentName}</td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {c.hasRecording && (
                              <button
                                onClick={() => {
                                  setSelectedCallForPlayback(c);
                                  setIsPlayingAudio(true);
                                  setPlaybackProgress(0);
                                }}
                                className="p-1.5 text-purple-600 hover:bg-purple-50 rounded"
                                title="Listen to Recording"
                              >
                                <Play className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenEditCall(c)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit Call Log"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCall(c.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                              title="Delete Call"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* LOG CALL MODAL */}
      {showLogCallModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Log Telephony Call Record</h3>
              <button onClick={() => setShowLogCallModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>
            <form onSubmit={handleLogCallSubmit} className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={callFormData.contactName}
                    onChange={e => setCallFormData({ ...callFormData, contactName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+1 (555) 234-5678"
                    value={callFormData.phoneNumber}
                    onChange={e => setCallFormData({ ...callFormData, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Direction</label>
                  <select
                    value={callFormData.direction}
                    onChange={e => setCallFormData({ ...callFormData, direction: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  >
                    <option value="Outbound">Outbound</option>
                    <option value="Inbound">Inbound</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Duration (sec)</label>
                  <input
                    type="number"
                    min="0"
                    value={callFormData.durationSeconds}
                    onChange={e => setCallFormData({ ...callFormData, durationSeconds: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Outcome</label>
                  <select
                    value={callFormData.status}
                    onChange={e => setCallFormData({ ...callFormData, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Missed">Missed</option>
                    <option value="Busy">Busy</option>
                    <option value="Voicemail">Voicemail</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Agent Representative</label>
                  <input
                    type="text"
                    value={callFormData.agentName}
                    onChange={e => setCallFormData({ ...callFormData, agentName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sentiment</label>
                  <select
                    value={callFormData.sentiment}
                    onChange={e => setCallFormData({ ...callFormData, sentiment: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  >
                    <option value="Positive">Positive</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Escalation">Escalation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Call Notes & Summary</label>
                <textarea
                  rows={3}
                  placeholder="Summary of conversation, key points discussed..."
                  value={callFormData.notes}
                  onChange={e => setCallFormData({ ...callFormData, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowLogCallModal(false)}
                  className="px-4 py-2 border rounded-xl hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Call Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CALL MODAL */}
      {showEditCallModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Edit Call Record Details</h3>
              <button onClick={() => setShowEditCallModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>
            <form onSubmit={handleEditCallSubmit} className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={callFormData.contactName}
                    onChange={e => setCallFormData({ ...callFormData, contactName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={callFormData.phoneNumber}
                    onChange={e => setCallFormData({ ...callFormData, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Direction</label>
                  <select
                    value={callFormData.direction}
                    onChange={e => setCallFormData({ ...callFormData, direction: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  >
                    <option value="Outbound">Outbound</option>
                    <option value="Inbound">Inbound</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Duration (sec)</label>
                  <input
                    type="number"
                    min="0"
                    value={callFormData.durationSeconds}
                    onChange={e => setCallFormData({ ...callFormData, durationSeconds: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Outcome</label>
                  <select
                    value={callFormData.status}
                    onChange={e => setCallFormData({ ...callFormData, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Missed">Missed</option>
                    <option value="Busy">Busy</option>
                    <option value="Voicemail">Voicemail</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Call Notes & Resolution</label>
                <textarea
                  rows={3}
                  value={callFormData.notes}
                  onChange={e => setCallFormData({ ...callFormData, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditCallModal(false)}
                  className="px-4 py-2 border rounded-xl hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE NUMBERS SETTINGS MODAL */}
      {showNumbersModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-600" /> Manage Cloud Telephony Numbers
                </h3>
                <p className="text-xs text-gray-500 mt-1">Assign specific numbers to people/teams and configure call recording policies.</p>
              </div>
              <button onClick={() => setShowNumbersModal(false)} className="text-gray-400 hover:text-gray-600 font-bold p-2">✕</button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Add New Number Form */}
              <form onSubmit={handleAddNumberSubmit} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-sm text-gray-800 mb-3">Integrate New Phone Number</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                    <div className="flex">
                      <select
                        value={newNumberForm.countryCode}
                        onChange={e => setNewNumberForm({ ...newNumberForm, countryCode: e.target.value })}
                        className="px-2 py-2 text-xs border border-r-0 rounded-l-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+61">🇦🇺 +61</option>
                      </select>
                      <input
                        type="text"
                        required
                        placeholder="98765 43210"
                        value={newNumberForm.number}
                        onChange={e => setNewNumberForm({ ...newNumberForm, number: e.target.value })}
                        className="w-full px-3 py-2 text-xs border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Assign To (User)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={newNumberForm.assignedTo}
                      onChange={e => setNewNumberForm({ ...newNumberForm, assignedTo: e.target.value })}
                      className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Role / Team</label>
                    <select
                      value={newNumberForm.role}
                      onChange={e => setNewNumberForm({ ...newNumberForm, role: e.target.value })}
                      className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Sales Team">Sales Team</option>
                      <option value="Support Team">Support Team</option>
                      <option value="Executive">Executive</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Call Recording</label>
                    <div className="flex items-center h-[34px]">
                      <label className="flex items-center cursor-pointer gap-2">
                        <input
                          type="checkbox"
                          checked={newNumberForm.recordingEnabled}
                          onChange={e => setNewNumberForm({ ...newNumberForm, recordingEnabled: e.target.checked })}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-gray-700">Enable Recording</span>
                      </label>
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <button type="submit" className="w-full h-[34px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1">
                      <Plus className="w-3.5 h-3.5" /> Integrate
                    </button>
                  </div>
                </div>
              </form>

              {/* List of Configured Numbers */}
              <div>
                <h4 className="font-bold text-sm text-gray-800 mb-3">Assigned Numbers Overview</h4>
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4">Phone Number</th>
                        <th className="py-3 px-4">Assigned User</th>
                        <th className="py-3 px-4">Role / Team</th>
                        <th className="py-3 px-4">Call Recording</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {telephonyNumbers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-500">
                            No telephony numbers integrated yet.
                          </td>
                        </tr>
                      ) : (
                        telephonyNumbers.map((num) => (
                          <tr key={num.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 font-mono font-bold text-gray-900 flex items-center gap-2">
                              <PhoneForwarded className="w-3.5 h-3.5 text-gray-400" />
                              {num.number}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-gray-800">{num.assignedTo}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                {num.role}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {num.recordingEnabled ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-3 h-3" /> Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                  <PhoneOff className="w-3 h-3" /> Disabled
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleDeleteNumber(num.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                                title="Remove Number"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
