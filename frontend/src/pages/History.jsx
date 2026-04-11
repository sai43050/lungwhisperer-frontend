import { useEffect, useState } from 'react';
import { getHistory } from '../api';
import { 
  Activity, Clock, AlertCircle, CheckCircle2, 
  Calendar, Microscope, Headphones, ChevronRight, 
  Search, Filter, TrendingUp, FileText, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function History({ user }) {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory(user.user_id);
        setScans(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const filteredScans = scans.filter(s => 
    s.prediction.toLowerCase().includes(searchTerm.toLowerCase()) || 
    String(s.id).includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 text-cyan-400 animate-spin mb-4" />
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">Syncing Medical Vault...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-6 pb-24 relative z-10 px-4">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
         <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <Clock size={14} className="text-cyan-400" />
               </div>
               <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">Diagnostic Archives</span>
            </div>
            <h2 className="text-4xl font-display font-black text-white tracking-tight">Case <span className="text-gradient-cyan">History</span></h2>
            <p className="text-slate-400 mt-2 font-light max-w-md">
               Longitudinal record of all AI-assisted respiratory assessments.
            </p>
         </div>

         <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
               <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
               <input 
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-600"
               />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold text-xs hover:bg-white/10 transition-all">
               <Filter size={16} /> Filter modality
            </button>
         </div>
      </div>

      {scans.length === 0 ? (
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="glass-panel p-20 text-center rounded-[3rem] border-white/5"
        >
          <div className="p-8 bg-slate-900 rounded-full border border-white/5 mb-8 inline-block shadow-2xl">
             <FileText className="h-16 w-16 text-slate-700" />
          </div>
          <h3 className="text-2xl font-display font-bold text-white mb-2">No Records Found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-10 font-light leading-relaxed">
             You haven't initiated any AI scans yet. Upload an X-ray or audio clip to begin your health history.
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="btn-primary"
          >
            Start First Analysis
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredScans.map((scan, i) => {
              const isNormal = scan.prediction.toLowerCase().includes('normal') || scan.prediction.toLowerCase().includes('healthy');
              const isAudio = scan.prediction.startsWith('COUGH:');
              const displayText = scan.prediction.replace('X-RAY: ', '').replace('COUGH: ', '');
              
              return (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/results/${scan.id}`, { state: { result: scan } })}
                  className="glass-card group cursor-pointer p-6 rounded-[2rem] border-white/5 relative overflow-hidden"
                >
                  {/* Modality Icon Float */}
                  <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                     {isAudio ? <Headphones size={120} /> : <Microscope size={120} />}
                  </div>

                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl ${isAudio ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'} border`}>
                       {isAudio ? <Headphones size={20} /> : <Microscope size={20} />}
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">ID: #{String(scan.id).padStart(5, '0')}</p>
                       <div className="flex items-center justify-end gap-1.5 text-[10px] text-slate-400 font-mono">
                          <Calendar size={12} className="text-cyan-400" /> {new Date(scan.timestamp).toLocaleDateString()}
                       </div>
                    </div>
                  </div>

                  <h4 className="text-2xl font-display font-black text-white mb-2 group-hover:text-cyan-400 transition-colors uppercase tracking-tight truncate">
                     {displayText}
                  </h4>
                  
                  <div className="flex items-center gap-3 mb-6">
                     <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${
                        isNormal 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.1)]'
                     }`}>
                        {isNormal ? 'Stable Diagnosis' : 'Pathological Match'}
                     </span>
                     <div className="w-1 h-1 rounded-full bg-slate-700" />
                     <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                        {scan.confidence}% Confidence
                     </span>
                  </div>

                  <div className="pt-5 border-t border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <TrendingUp size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-mono text-slate-600 uppercase">Longitudinal Tracking</span>
                     </div>
                     <ChevronRight size={16} className="text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Ticker / Note */}
      <div className="mt-12 p-6 glass-panel rounded-[2rem] border-white/5 flex flex-col md:flex-row items-center gap-6 opacity-60">
         <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shrink-0">
            <Activity className="text-cyan-400" size={24} />
         </div>
         <div>
            <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-widest">Health Record Continuity</h4>
            <p className="text-slate-500 text-xs font-light leading-relaxed max-w-2xl">
               Historical data is cross-referenced during new analyses to detect trajectory changes in respiratory health biomarkers. 
               All data is hashed and stored in accordance with medical data residence protocols.
            </p>
         </div>
      </div>
    </div>
  );
}
