import React, { useEffect, useState, useRef } from 'react';
import { simulateVitals, getVitalsHistory, sendAIChatMessage } from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heart, Activity, Wind, AlertTriangle, ShieldCheck, MessageCircle, Send, X } from 'lucide-react';

const VitalsCard = ({ title, value, unit, icon: Icon, colorClass, statusClass }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-sm border ${statusClass} flex items-center justify-between transition-all duration-300`}>
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <div className="flex items-baseline gap-1">
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        <span className="text-slate-500 font-medium">{unit}</span>
      </div>
    </div>
    <div className={`p-4 rounded-xl ${colorClass}`}>
      <Icon className="w-8 h-8" />
    </div>
  </div>
);

const PatientDashboard = ({ user }) => {
  const [vitals, setVitals] = useState({ spo2: 98, respiratory_rate: 16, heart_rate: 75 });
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('Normal');
  const [recommendation, setRecommendation] = useState('Normal condition');
  const [isSimulating, setIsSimulating] = useState(false);
  const intervalRef = useRef(null);

  // Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ sender: 'ai', text: `Hello ${user?.username || 'there'}! I am RespiraBot. How can I help you regarding your vitals today?` }]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Initial Fetch
  const fetchHistory = async () => {
    try {
      const data = await getVitalsHistory(user.user_id);
      if (Array.isArray(data)) {
        // Format for recharts
        const formatted = data.map(d => ({
          time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          spo2: d.spo2,
          heart_rate: d.heart_rate,
          respiratory_rate: d.respiratory_rate
        })).slice(-15); // Show last 15 points
        setHistory(formatted);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const generateRandomVitals = (prev) => {
    // Add small random noise
    const noise = (val, maxDelta, min, max) => {
      let next = val + (Math.random() * maxDelta * 2 - maxDelta);
      if (next < min) next = min;
      if (next > max) next = max;
      return parseFloat(next.toFixed(1));
    };

    // To simulate an emergency, maybe clicking a button forces bad vitals?
    // For now, normal variation.
    return {
      spo2: noise(prev.spo2, 1, 85, 100),
      heart_rate: noise(prev.heart_rate, 3, 50, 140),
      respiratory_rate: noise(prev.respiratory_rate, 1, 10, 35)
    };
  };

  const triggerVitalsUpdate = async (forcedValues = null) => {
    try {
      let payload;
      if (forcedValues) {
        payload = forcedValues;
      } else {
        setVitals(prev => {
          payload = generateRandomVitals(prev);
          return payload;
        });
      }
      
      const res = await simulateVitals(user.user_id, payload.spo2, payload.respiratory_rate, payload.heart_rate);
      setStatus(res.health_status);
      setRecommendation(res.recommendation);
      setVitals(payload);
      fetchHistory(); // Refresh graph
    } catch (err) {
      console.error("Simulation error", err);
    }
  };

  const toggleSimulation = () => {
    if (isSimulating) {
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(() => triggerVitalsUpdate(), 4000);
    }
    setIsSimulating(!isSimulating);
  };

  const forceEmergency = () => {
    const critical = { spo2: 88, heart_rate: 125, respiratory_rate: 32 };
    triggerVitalsUpdate(critical);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const newMsg = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setChatLoading(true);
    
    try {
      const data = await sendAIChatMessage(newMsg.text);
      setChatMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: "Sorry, my brain went offline momentarily. Try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Status mapping
  const statusConfig = {
    Normal: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', icon: ShieldCheck },
    Warning: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: AlertTriangle },
    Critical: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: AlertTriangle }
  };
  
  const currentConfig = statusConfig[status] || statusConfig.Normal;
  const StatusIcon = currentConfig.icon;

  return (
    <div className="space-y-6 relative z-10 pt-4">
      <div className="flex justify-between items-center glass-panel p-6 rounded-3xl border border-vignan-500/20">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-wide">
            Welcome back, <span className="text-accent-400 capitalize">{user?.username || 'Patient'}</span>
          </h1>
          <p className="text-vignan-200 text-sm font-light mt-1">Your autonomous physiological inference matrix is online.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={forceEmergency}
            className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold rounded-xl transition-colors border border-red-500/30 backdrop-blur-md"
          >
            Force Event
          </button>
          <button 
            onClick={toggleSimulation}
            className={`px-5 py-2.5 text-white text-sm font-semibold rounded-xl transition-all duration-300 ${isSimulating ? 'bg-red-500/80 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-gradient-to-r from-accent-500 to-vignan-600 hover:from-accent-400 hover:to-vignan-500 shadow-[0_0_15px_rgba(0,154,228,0.4)]'}`}
          >
            {isSimulating ? 'Stop IoT Simulator' : 'Start IoT Simulator'}
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className={`p-5 rounded-2xl flex items-center justify-between border backdrop-blur-md shadow-lg ${currentConfig.bg} ${currentConfig.border} ${currentConfig.text}`}>
        <div className="flex items-center gap-3">
          <StatusIcon className="w-7 h-7" />
          <h2 className="font-display font-bold text-xl uppercase tracking-widest">AI Assessment: {status}</h2>
        </div>
        <div className="font-medium bg-black/20 px-5 py-1.5 rounded-full text-sm border border-white/5">
          Recommendation: {recommendation}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <VitalsCard 
          title="Oxygen Saturation" 
          value={vitals.spo2} 
          unit="%" 
          icon={Activity} 
          colorClass="bg-accent-500/20 text-accent-400 border border-accent-500/30 shadow-[0_0_15px_rgba(0,154,228,0.3)]" 
          statusClass={vitals.spo2 < 95 ? 'border-red-500/50 shadow-red-500/30 animate-pulse' : 'border-slate-700/50'} 
        />
        <VitalsCard 
          title="Heart Rate" 
          value={Math.round(vitals.heart_rate)} 
          unit="bpm" 
          icon={Heart} 
          colorClass="bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          statusClass={vitals.heart_rate > 100 || vitals.heart_rate < 50 ? 'border-red-500/50 shadow-red-500/30 animate-pulse' : 'border-slate-700/50'} 
        />
        <VitalsCard 
          title="Respiratory Rate" 
          value={Math.round(vitals.respiratory_rate)} 
          unit="bpm" 
          icon={Wind} 
          colorClass="bg-vignan-500/30 text-vignan-300 border border-vignan-500/50 shadow-[0_0_15px_rgba(106,141,206,0.3)]" 
          statusClass={vitals.respiratory_rate > 24 ? 'border-red-500/50 shadow-red-500/30 animate-pulse' : 'border-slate-700/50'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl">
          <h3 className="font-display font-bold text-slate-200 mb-4 tracking-wider">SpO2 Trend (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis domain={['auto', 'auto']} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'rgba(0,154,228,0.5)', borderRadius: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="spo2" stroke="#0aa1f2" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-card p-6 rounded-3xl">
          <h3 className="font-display font-bold text-slate-200 mb-4 tracking-wider">Heart Rate Trend (BPM)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis domain={['auto', 'auto']} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'rgba(239,68,68,0.5)', borderRadius: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="heart_rate" stroke="#ef4444" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Floating Chatbot Component */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen ? (
           <div className="glass-panel w-80 sm:w-[400px] rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-vignan-400/30 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
             <div className="bg-vignan-800/80 backdrop-blur-xl p-4 flex justify-between items-center text-white border-b border-vignan-600/50">
               <div className="flex items-center gap-2">
                  <Activity size={20} className="text-accent-400" />
                  <h4 className="font-display font-bold tracking-wide">RespiraBot Assistant</h4>
               </div>
               <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-accent-400 p-1 rounded transition-colors"><X size={20} /></button>
             </div>
             <div className="h-[350px] overflow-y-auto p-4 bg-slate-900/60 custom-scrollbar space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] p-3.5 rounded-3xl text-sm ${msg.sender === 'user' ? 'bg-gradient-to-r from-accent-500 to-vignan-500 text-white rounded-br-none shadow-[0_0_15px_rgba(0,154,228,0.3)] font-medium' : 'bg-vignan-800/80 border border-vignan-600/50 text-slate-200 rounded-bl-none shadow-md font-light leading-relaxed'}`}>
                        {msg.text}
                     </div>
                  </div>
                ))}
                {chatLoading && (
                   <div className="flex justify-start">
                     <div className="bg-vignan-800/80 border border-vignan-600/50 p-4 rounded-3xl rounded-bl-none flex gap-1.5 items-center">
                        <span className="w-2 h-2 bg-accent-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                        <span className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                     </div>
                   </div>
                )}
             </div>
             <form onSubmit={handleChatSubmit} className="p-4 bg-vignan-900/90 backdrop-blur-xl border-t border-vignan-700/50 flex gap-3">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-grow bg-slate-900/80 border border-vignan-600/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent-500 placeholder-vignan-400 shadow-inner transition-all"
                  placeholder="Query telemetry data..."
                  disabled={chatLoading}
                />
                <button 
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="bg-gradient-to-r from-accent-500 to-vignan-500 text-white p-3 rounded-xl hover:from-accent-400 hover:to-vignan-400 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(0,154,228,0.3)] hover:shadow-[0_0_20px_rgba(0,154,228,0.6)]"
                >
                  <Send size={18} />
                </button>
             </form>
           </div>
        ) : (
           <button 
             onClick={() => setIsChatOpen(true)}
             className="bg-gradient-to-tr from-accent-500 to-vignan-600 text-white p-4 sm:px-6 sm:py-4 rounded-full shadow-[0_0_20px_rgba(0,154,228,0.5)] hover:shadow-[0_0_30px_rgba(0,154,228,0.7)] hover:scale-105 transition-all flex items-center justify-center gap-3 animate-float"
           >
             <MessageCircle size={26} />
             <span className="font-display font-bold text-lg hidden sm:inline tracking-wider">Respira AI</span>
           </button>
        )}
      </div>

    </div>
  );
};

export default PatientDashboard;
