import React, { useEffect, useRef, useState } from 'react';
import { Video, Mic, MicOff, PhoneOff, MonitorUp, Activity, ShieldPlus, User as UserIcon, Zap, ShieldCheck, Maximize2, MoreHorizontal, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

const Telemedicine = () => {
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);
  
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const roomName = "telemdicine_room_1"; // Default mockup shared room

  // Setup WebRTC and Socket
  useEffect(() => {
    const socketURL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:8000"
      : "https://lungwhisperer-backend-production.up.railway.app";

    socketRef.current = io(socketURL, {
      path: "/ws/socket.io",
      transports: ["websocket"]
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to signaling server");
      socketRef.current.emit("join_room", { room: roomName });
    });

    socketRef.current.on("peer_joined", async () => {
      createOffer();
    });

    socketRef.current.on("offer", async (data) => {
      await handleReceiveOffer(data);
    });

    socketRef.current.on("answer", async (data) => {
      await handleReceiveAnswer(data);
    });

    socketRef.current.on("ice_candidate", async (data) => {
      await handleNewICECandidateMsg(data);
    });

    startLocalStream();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (peerConnectionRef.current) peerConnectionRef.current.close();
      if (localVideoRef.current && localVideoRef.current.srcObject) {
         const tracks = localVideoRef.current.srcObject.getTracks();
         tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const initPeerConnection = () => {
    const configuration = { 
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" } 
      ] 
    };
    const peerConnection = new RTCPeerConnection(configuration);
    
    peerConnection.addEventListener("icecandidate", event => {
      if (event.candidate) {
        socketRef.current.emit("ice_candidate", { room: roomName, candidate: event.candidate });
      }
    });

    peerConnection.addEventListener("track", event => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setIsConnected(true);
      }
    });

    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => {
        peerConnection.addTrack(track, localVideoRef.current.srcObject);
      });
    }
    
    peerConnectionRef.current = peerConnection;
    return peerConnection;
  };

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  const createOffer = async () => {
    const pc = initPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketRef.current.emit("offer", { room: roomName, sdp: offer });
  };

  const handleReceiveOffer = async (data) => {
    const pc = initPeerConnection();
    await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socketRef.current.emit("answer", { room: roomName, sdp: answer });
  };

  const handleReceiveAnswer = async (data) => {
    const pc = peerConnectionRef.current;
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
    }
  };

  const handleNewICECandidateMsg = async (data) => {
    const pc = peerConnectionRef.current;
    if (pc && data.candidate) {
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  };

  const toggleVideo = () => {
    const stream = localVideoRef.current?.srcObject;
    if (stream) {
      stream.getVideoTracks()[0].enabled = !videoActive;
      setVideoActive(!videoActive);
    }
  };

  const toggleAudio = () => {
    const stream = localVideoRef.current?.srcObject;
    if (stream) {
      stream.getAudioTracks()[0].enabled = !micActive;
      setMicActive(!micActive);
    }
  };

  const handleHangup = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full relative z-10 px-4 pt-4 pb-10 max-w-7xl mx-auto space-y-6">
      
      {/* Upper Status Bar */}
      <div className="flex items-center justify-between px-4">
         <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
               <ShieldCheck size={18} className="text-emerald-400" />
            </div>
            <div>
               <h3 className="text-white font-black text-xs uppercase tracking-widest">End-to-End Encrypted Session</h3>
               <p className="text-[10px] text-slate-500 font-mono tracking-tighter mt-0.5">PEER_ID: LW-772-XT</p>
            </div>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Rec Active</span>
            </div>
            <div className="text-white font-mono text-xs font-black tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
               00:12:45
            </div>
         </div>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row gap-6 h-full items-stretch">
        
        {/* Main Video Interface */}
        <div className="flex-grow glass-panel rounded-[3rem] p-3 border-white/5 relative overflow-hidden flex flex-col">
           <div className="flex-grow rounded-[2.5rem] bg-slate-900 relative overflow-hidden flex items-center justify-center border border-white/5 group bg-grid-pattern">
             
              {/* Scanline Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.03] z-20" />

              <video 
                 ref={remoteVideoRef} 
                 autoPlay 
                 playsInline 
                 className="w-full h-full object-cover rounded-[2.5rem] relative z-10" 
              />
              
              {!isConnected && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 bg-slate-900/80 backdrop-blur-3xl z-30">
                  <div className="relative mb-8">
                     <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full animate-pulse" />
                     <Video className="w-24 h-24 relative z-10 opacity-20" />
                  </div>
                  <h2 className="text-xl font-display font-black text-white mb-2 uppercase tracking-widest">Awaiting Remote Link</h2>
                  <p className="font-mono text-[9px] px-6 py-2 bg-black/40 border border-white/5 rounded-full text-slate-400 animate-pulse tracking-[0.3em]">SYNCHRONIZING PEER SIGNAL...</p>
                </div>
              )}
              
              {/* Picture in picture (Local) */}
              <motion.div 
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                className="absolute bottom-8 right-8 w-64 h-40 bg-black/60 rounded-[2rem] border-2 border-white/10 shadow-2xl overflow-hidden z-40 group/pip cursor-move"
              >
                 <video 
                    ref={localVideoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/pip:scale-110"
                 />
                 <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/60 text-white/50 text-[8px] font-black font-mono uppercase tracking-widest backdrop-blur-md">Local Uplink</div>
              </motion.div>

              {/* HUD Overlays (Remote Stream) */}
              <div className="absolute top-8 left-8 z-30 flex flex-col gap-3">
                 <div className="bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/5 flex items-center gap-3">
                    <UserIcon size={16} className="text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-tight">Participant Joined</span>
                 </div>
                 <div className="bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/5 flex items-center gap-3">
                    <Zap size={16} className="text-violet-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-tight">92ms Latency</span>
                 </div>
              </div>

              {/* Functional Overlays */}
              <div className="absolute top-8 right-8 z-30 flex gap-2">
                 <button className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/5 text-slate-400 hover:text-white transition-all">
                    <Maximize2 size={16} />
                 </button>
                 <button className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/5 text-slate-400 hover:text-white transition-all">
                    <Settings size={16} />
                 </button>
              </div>
           </div>
        </div>

        {/* Clinical Sidebar / Vitals Panel */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
           <div className="glass-panel rounded-[3rem] p-8 border-white/5 flex flex-col shadow-2xl h-full">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="font-display font-black text-white text-xl flex items-center gap-3 tracking-tight">
                    <Activity className="text-cyan-400" size={24} />
                    Live Metrics
                 </h3>
                 <MoreHorizontal className="text-slate-700" size={20} />
              </div>
              
              <div className="space-y-4 flex-grow overflow-y-auto custom-scrollbar pr-1">
                {[
                  { label: 'Oxygen Saturation', val: 97, unit: '%', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                  { label: 'Heart Rate Intensity', val: 102, unit: 'bpm', color: 'text-rose-400', bg: 'bg-rose-500/10', alert: 'HYPER' },
                  { label: 'Respiratory Freq', val: 18, unit: 'p/m', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                  { label: 'Systolic Load', val: 124, unit: 'mmhg', color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
                ].map(metric => (
                  <div key={metric.label} className="bg-black/40 p-5 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all group">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 px-1">{metric.label}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                         <span className={`text-4xl font-display font-black ${metric.color} tracking-tighter`}>{metric.val}</span>
                         <span className="text-xs font-bold text-slate-600 uppercase">{metric.unit}</span>
                      </div>
                      <div className={`p-2.5 rounded-xl ${metric.bg} ${metric.color} transition-all group-hover:scale-110`}>
                         <Activity size={18} />
                      </div>
                    </div>
                    {metric.alert && (
                       <div className="mt-3 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                          <span className="text-[9px] font-mono font-black text-rose-500 uppercase tracking-[0.2em]">{metric.alert} ANALYSIS ACTIVE</span>
                       </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
                 <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest flex justify-center items-center gap-3 transition-all hover:bg-slate-200 active:scale-95 shadow-xl shadow-white/5">
                   <MonitorUp size={18} /> Broadcast Analytics
                 </button>
                 <button className="w-full py-4 bg-violet-600/10 text-violet-400 border border-violet-500/20 rounded-2xl font-black text-xs uppercase tracking-widest flex justify-center items-center gap-3 transition-all hover:bg-violet-600 hover:text-white">
                   Request EMR Access
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Control Module */}
      <div className="flex justify-center pt-4">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-panel rounded-[2.5rem] px-10 py-5 flex gap-8 items-center border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black/80 backdrop-blur-3xl"
        >
          <ControlButton icon={micActive ? Mic : MicOff} active={micActive} onClick={toggleAudio} tooltip="Toggle Audio" />
          <ControlButton icon={Video} active={videoActive} onClick={toggleVideo} tooltip="Toggle Vision" />
          <div className="w-px h-10 bg-white/10 mx-2" />
          <button 
             onClick={handleHangup}
             className="w-16 h-16 rounded-3xl flex items-center justify-center transition-all bg-rose-500 hover:bg-rose-600 text-white shadow-2xl shadow-rose-950/40 active:scale-90 group"
          >
            <PhoneOff size={28} className="group-hover:rotate-[135deg] transition-transform duration-500" />
          </button>
        </motion.div>
      </div>

      {/* Decorative Corner HUD */}
      <div className="fixed bottom-10 left-10 pointer-events-none opacity-20 hidden xxl:block">
         <div className="flex flex-col gap-2 font-mono text-[8px] text-white uppercase tracking-[0.3em]">
            <div>LINK_SIGNAL: STABLE</div>
            <div>BITRATE: 4.2 MBPS</div>
            <div>CORE: NEURAL_B7</div>
         </div>
      </div>
    </div>
  );
};

const ControlButton = ({ icon: Icon, active, onClick, tooltip }) => (
  <button 
     onClick={onClick}
     className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-500 relative group overflow-hidden ${
       active 
        ? 'bg-white/5 text-white border border-white/10 hover:bg-white/10' 
        : 'bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
      }`}
  >
    <div className="relative z-10 transition-transform group-hover:scale-110">
       <Icon size={22} />
    </div>
    {/* Internal Shimmer */}
    {active && <div className="absolute inset-0 bg-shimmer opacity-0 group-hover:opacity-10 transition-opacity" />}
  </button>
);

export default Telemedicine;
