import React, { useEffect, useRef, useState } from 'react';
import { Video, Mic, MicOff, PhoneOff, MonitorUp, Activity, ShieldPlus, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

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
    // 1. Connect to our signaling server
    socketRef.current = io("http://localhost:8000", {
      path: "/ws/socket.io",
      transports: ["websocket"]
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to signaling server");
      socketRef.current.emit("join_room", { room: roomName });
    });

    // Handle incoming logic
    socketRef.current.on("peer_joined", async () => {
      // If someone else joins, we (the caller) instantiate an offer
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
      // Cleanup
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
        { urls: "stun:global.stun.twilio.com:3478" } // Universal strict-NAT failover
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
    <div className="flex flex-col h-[calc(100vh-140px)] w-full">
      <div className="flex-grow flex gap-6 bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative p-4">
        
        {/* Main Video Area (Remote) */}
        <div className="flex-grow bg-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-700 shadow-inner group">
          <video 
             ref={remoteVideoRef} 
             autoPlay 
             playsInline 
             className="w-full h-full object-cover rounded-2xl" 
          />
          {!isConnected && (
            <div className="absolute flex flex-col items-center justify-center text-slate-400">
              <Video className="w-16 h-16 mb-4 opacity-50" />
              <p className="font-semibold px-4 py-1 bg-slate-700 rounded-full inline-block animate-pulse">Wait for participant to join...</p>
            </div>
          )}
          
          {/* Picture in picture (Local) */}
          <div className="absolute bottom-6 right-6 w-56 h-36 bg-slate-700 backdrop-blur-md rounded-xl border-4 border-slate-600 shadow-2xl overflow-hidden z-10 transition-transform hover:scale-105">
             <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
             />
             <div className="absolute bottom-1 right-2 text-white/50 text-xs font-bold font-mono">You</div>
          </div>
        </div>

        {/* Sidebar / Vitals Panel */}
        <div className="w-80 bg-slate-800 rounded-2xl p-5 border border-slate-700 flex flex-col shadow-inner">
          <h3 className="font-bold text-white text-lg flex items-center gap-2 mb-6">
            <ShieldPlus className="text-healthcare-400" /> Patient Stream
          </h3>
          
          <div className="space-y-4 flex-grow">
            <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Live SpO2</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-blue-400">97<span className="text-base font-medium ml-1">%</span></span>
                <Activity className="text-blue-400" />
              </div>
            </div>
            
            <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 border-l-4 border-l-yellow-500">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Heart Rate</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-yellow-500">102<span className="text-base font-medium ml-1">bpm</span></span>
                <div className="bg-yellow-500/20 px-2 py-1 rounded text-xs font-bold text-yellow-400 animate-pulse">ELEVATED</div>
              </div>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Resp Rate</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-emerald-400">18<span className="text-base font-medium ml-1">bpm</span></span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-600">
             <button className="w-full py-3 bg-healthcare-600 hover:bg-healthcare-500 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-colors">
               <MonitorUp className="w-5 h-5" /> Share Screen (Reports)
             </button>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex justify-center mt-6">
        <div className="bg-slate-800 rounded-full px-8 py-3 flex gap-6 shadow-xl border border-slate-700 items-center">
          <ControlButton icon={micActive ? Mic : MicOff} active={micActive} onClick={toggleAudio} />
          <ControlButton icon={Video} active={videoActive} onClick={toggleVideo} />
          <button 
             onClick={handleHangup}
             className="w-14 h-14 ml-4 rounded-full flex items-center justify-center transition-all bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]"
          >
            <PhoneOff size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ControlButton = ({ icon: Icon, active, onClick }) => (
  <button 
     onClick={onClick}
     className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${active ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-red-500/20 text-red-500 hover:bg-red-500/40'}`}>
    <Icon />
  </button>
);

export default Telemedicine;
