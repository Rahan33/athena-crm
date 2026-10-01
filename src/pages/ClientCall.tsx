import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { Phone, PhoneOff, Mic, MicOff, ShieldCheck } from 'lucide-react';

const STUN_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export default function ClientCall() {
  const { roomId } = useParams<{ roomId: string }>();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<string>('Initializing...');
  const [isMuted, setIsMuted] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [audioError, setAudioError] = useState('');

  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Connect to signaling server
    const newSocket = io(import.meta.env.VITE_API_URL || '', {
      path: '/socket.io'
    });
    setSocket(newSocket);

    return () => {
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      newSocket.disconnect();
    };
  }, []);

  const initWebRTC = async (s: Socket) => {
    try {
      setStatus('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStream.current = stream;
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }
      setStatus('Waiting for agent to connect...');
      
      const pc = new RTCPeerConnection(STUN_SERVERS);
      peerConnection.current = pc;

      // Add local tracks to peer connection
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      // Handle incoming remote stream
      pc.ontrack = (event) => {
        if (remoteAudioRef.current && event.streams[0]) {
          remoteAudioRef.current.srcObject = event.streams[0];
          setInCall(true);
          setStatus('In Call with Athena OS Agent');
        }
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          s.emit('webrtc_ice_candidate', {
            roomId,
            candidate: event.candidate
          });
        }
      };

      // Signaling Handlers
      s.on('webrtc_offer', async (data) => {
        if (data.roomId !== roomId) return;
        setStatus('Call connecting...');
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        s.emit('webrtc_answer', {
          roomId,
          answer
        });
      });

      s.on('webrtc_ice_candidate', async (data) => {
        if (data.roomId !== roomId || !data.candidate) return;
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {
          console.error('Error adding received ice candidate', e);
        }
      });

      // Announce presence in the room so the agent knows to send an offer
      s.emit('join_webrtc_room', roomId);

    } catch (err) {
      console.error(err);
      setAudioError('Microphone access denied or unavailable. Please allow microphone access to join the call.');
      setStatus('Failed to connect.');
    }
  };

  useEffect(() => {
    if (!socket || !roomId) return;
    initWebRTC(socket);
  }, [socket, roomId]);

  const toggleMute = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const endCall = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    if (socket) {
      socket.disconnect();
    }
    setStatus('Call Ended.');
    setInCall(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
      {/* Hidden audio elements for WebRTC */}
      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />

      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
          <Phone className={`w-10 h-10 ${inCall ? 'text-emerald-400 animate-pulse' : 'text-purple-400'}`} />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">Athena OS Support</h1>
          <p className="text-slate-400 font-mono text-sm">{status}</p>
          {audioError && <p className="text-red-400 text-xs mt-2">{audioError}</p>}
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-xs font-bold border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" /> End-to-End Encrypted WebRTC
        </div>

        <div className="flex items-center justify-center gap-6 mt-8 w-full pt-8 border-t border-slate-800">
          <button
            onClick={toggleMute}
            disabled={!inCall}
            className={`p-4 rounded-full transition-all ${
              !inCall ? 'opacity-50 cursor-not-allowed bg-slate-800' :
              isMuted ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          
          <button
            onClick={endCall}
            className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all shadow-lg shadow-red-900/50"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
