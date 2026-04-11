import { useEffect, useState } from 'react';
import { getPatients, updateReport } from '../api';
import { 
  Users, Search, Filter, ChevronRight, Activity, 
  Clock, Shield, AlertCircle, CheckCircle2, 
  MapPin, Calendar, FileText, Send, User, 
  ExternalLink, ClipboardList, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function PatientRow({ patient, onSelect, isSelected }) {
  const isHealthy = patient.latest_diagnosis?.toLowerCase().includes('normal');
  const hasHistory = patient.history && patient.history.length > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => onSelect(patient)}
      className={`relative group cursor-pointer p-4 rounded-2xl transition-all duration-300 border ${
        isSelected 
          ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
          : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${isSelected ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 transition-colors'}`}>
            <User size={20} />
          </div>
          <div>
            <h4 className="font-display font-bold text-white text-sm tracking-tight capitalize">
              {patient.full_name || patient.username}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">UID: {String(patient.id).padStart(4, '0')}</span>
              {hasHistory && <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">{patient.history.length} records</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter border ${
            isHealthy 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {patient.latest_diagnosis || 'Unscanned'}
          </div>
          <ChevronRight size={16} className={`text-slate-600 transition-transform ${isSelected ? 'translate-x-1 text-cyan-400' : ''}`} />
        </div>
      </div>
    </motion.div>
  );
}

const DoctorPanel = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');
  const [reportText, setReportText] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
        if (data.length > 0) setSelectedPatient(data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    (p.full_name || p.username).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateReport = async () => {
    if (!selectedPatient || !reportText.trim()) return;
    try {
      await updateReport(selectedPatient.id, reportText);
      // Refresh local state or show success
      setSelectedPatient(prev => ({ ...prev, current_report: reportText }));
      setReportText('');
      alert("Report synchronized successfully");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mb-4" />
        <span className="text-slate-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">Initializing Command Center...</span>
      </div>
    );
  }

  return (
    <div className="pt-4 pb-20 relative z-10 px-4 max-w-7xl mx-auto space-y-6">
      
      {/* Header Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { label: 'Total Patients', val: patients.length, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
           { label: 'Critical Triage', val: patients.filter(p => p.tag === 'Critical').length, icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
           { label: 'Pending AI Analysis', val: 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
           { label: 'Clinic Status', val: 'Online', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
         ].map(m => (
           <div key={m.label} className="glass-panel p-5 rounded-2xl flex items-center justify-between border-white/5">
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">{m.label}</p>
                <p className="text-2xl font-display font-black text-white">{m.val}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${m.bg} ${m.color}`}>
                <m.icon size={20} />
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Patient List */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-[2.5rem] border-white/5 h-[calc(100vh-280px)] flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-display font-black text-white text-xl flex items-center gap-2">
                <Users className="text-cyan-400" size={22} />
                Directory
             </h3>
             <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors">
                <Filter size={16} />
             </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text"
              placeholder="Filter patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
            {filteredPatients.map(p => (
              <PatientRow 
                key={p.id} 
                patient={p} 
                onSelect={setSelectedPatient} 
                isSelected={selectedPatient?.id === p.id} 
              />
            ))}
            {filteredPatients.length === 0 && <div className="text-center py-10 text-slate-600 font-mono text-xs italic">No patients matched criteria.</div>}
          </div>
        </div>

        {/* Right: Detailed View */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           <AnimatePresence mode="wait">
             {selectedPatient ? (
               <motion.div
                 key={selectedPatient.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-6"
               >
                 {/* Detail Header */}
                 <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <User size={120} />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                       <div className="flex gap-6 items-center">
                          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white text-3xl font-black shadow-2xl">
                             {(selectedPatient.full_name || selectedPatient.username)[0].toUpperCase()}
                          </div>
                          <div>
                             <h2 className="text-4xl font-display font-black text-white tracking-tight uppercase">
                                {selectedPatient.full_name || selectedPatient.username}
                             </h2>
                             <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                                   <MapPin size={14} className="text-cyan-400" /> Bengaluru, India
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                                   <Calendar size={14} className="text-cyan-400" /> Joined April 2026
                                </div>
                             </div>
                          </div>
                       </div>
                       <div className="flex gap-3">
                          <button className="px-5 py-2.5 rounded-xl bg-cyan-500 text-white font-bold text-xs shadow-xl shadow-cyan-900/40 hover:bg-cyan-400 transition-all flex items-center gap-2">
                             <ExternalLink size={14} /> Tele-Link
                          </button>
                          <button className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold text-xs hover:bg-white/10 transition-all">
                             View EMR
                          </button>
                       </div>
                    </div>

                    <div className="mt-8 flex gap-2 border-b border-white/5 pb-px">
                       {['Overview', 'Vitals', 'AI Reports', 'Clinical Notes'].map(tab => (
                         <button 
                           key={tab} 
                           onClick={() => setActiveTab(tab)}
                           className={`px-6 py-3 text-xs font-bold transition-all relative ${activeTab === tab ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                         >
                           {tab}
                           {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />}
                         </button>
                       ))}
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                          <p className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest mb-2">Age / Gender</p>
                          <p className="text-lg text-white font-bold">42 • Male</p>
                       </div>
                       <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                          <p className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest mb-2">Latest SpO2</p>
                          <p className="text-lg text-emerald-400 font-bold">98% <span className="text-[10px] text-slate-500 ml-1">Normal</span></p>
                       </div>
                       <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                          <p className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest mb-2">Latest Diagnosis</p>
                          <p className="text-lg text-rose-400 font-bold uppercase">{selectedPatient.latest_diagnosis || 'None'}</p>
                       </div>
                    </div>
                 </div>

                 {/* Tab Content */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Clinical Note Editor */}
                    <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 space-y-6">
                       <div className="flex items-center justify-between">
                          <h4 className="font-display font-bold text-white flex items-center gap-2">
                             <ClipboardList className="text-violet-400" size={18} />
                             Prescriptive Consultation
                          </h4>
                          <span className="text-[9px] font-mono text-slate-500 uppercase">Autosaved</span>
                       </div>
                       <textarea 
                          value={reportText}
                          onChange={(e) => setReportText(e.target.value)}
                          placeholder="Type clinical observations, prescriptions or advice..."
                          className="w-full h-48 bg-black/40 border border-white/5 rounded-2xl p-5 text-sm font-light text-slate-300 focus:outline-none focus:border-violet-500/40 transition-all custom-scrollbar"
                       />
                       <button 
                          onClick={handleUpdateReport}
                          className="w-full btn-primary flex items-center justify-center gap-3"
                          style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', boxShadow: '0 10px 25px rgba(139,92,246,0.3)' }}
                       >
                          <Send size={16} /> Update Digital Record
                       </button>
                    </div>

                    {/* Quick Stats / History */}
                    <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 space-y-6">
                       <h4 className="font-display font-bold text-white flex items-center gap-2">
                          <TrendingUp className="text-cyan-400" size={18} />
                          Case Timeline
                       </h4>
                       <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                          {(selectedPatient.history || []).length > 0 ? (
                            selectedPatient.history.map((h, i) => (
                              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-all">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-cyan-400">
                                       <Activity size={14} />
                                    </div>
                                    <div>
                                       <p className="text-xs font-bold text-white">{h.prediction}</p>
                                       <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">{new Date(h.timestamp).toLocaleDateString()}</p>
                                    </div>
                                 </div>
                                 <div className="text-xs font-black text-slate-400">{h.confidence}%</div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-10">
                               <p className="text-slate-600 text-xs italic">No prior clinical history found.</p>
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
               </motion.div>
             ) : (
               <div className="flex flex-col items-center justify-center py-20 opacity-50">
                  <Activity size={60} className="text-slate-800 mb-4" />
                  <p className="text-slate-600">Select a patient profile to begin analysis.</p>
               </div>
             )}
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default DoctorPanel;

function Loader2(props) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
