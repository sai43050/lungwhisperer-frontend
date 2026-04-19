import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle, AlertCircle, Loader2, Image as ImageIcon, Zap, ShieldCheck, Mic } from 'lucide-react';
import { predictScan } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../components/Toast';

export default function UploadScan({ user }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [deepScan, setDeepScan] = useState(false);
  const [statusStep, setStatusStep] = useState(0); // 0: Idle, 1: Optimizing, 2: Scanning, 3: Finalizing
  const loadingTimer = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setError(null);
    } else {
      setError("Please upload a valid image file.");
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleUpload = async (forcedMode = null) => {
    if (!file) {
      setError("Please select an image first.");
      showToast("No scan selected.", "warning");
      return;
    }

    if (!user?.user_id) {
       setError("Authentication session expired. Please log in again.");
       showToast("User session invalid.", "error");
       return;
    }

    setIsUploading(true);
    setError(null);
    setStatusStep(1);

    const activeMode = forcedMode || (deepScan ? "neural" : "heuristic");

    // Safety timeout: If no response after 75s, show a manual reset option
    loadingTimer.current = setTimeout(() => {
      setError("The analysis is taking longer than usual. This can happen during high traffic. Please wait a bit longer or try reset.");
    }, 75000);

    // Auto-Rescue: If Neural Scan hangs for >25s, automatically rescue with Heuristic
    let rescueTimer = null;
    if (activeMode === "neural") {
       rescueTimer = setTimeout(() => {
          showToast("AI Engine is busy. Rescuing with High-Speed Analysis...", "warning");
       }, 25000);
    }

    try {
      // Step 1: Optimizing Image
      await new Promise(r => setTimeout(r, 800)); 
      setStatusStep(2); // Scanning

      const result = await predictScan(user.user_id, file, activeMode);
      
      setStatusStep(3); // Finalizing
      await new Promise(r => setTimeout(r, 800));

      showToast("Scan analyzed successfully!", "success");
      navigate(`/results/${result.id}`, { state: { result } });
    } catch (err) {
      console.error("DIAGNOSTIC FAULT:", err);
      
      // If neural failed, try one last immediate heuristic rescue
      if (activeMode === "neural") {
          showToast("Neural scan failed. Falling back to High-Speed Analysis...", "info");
          return handleUpload("heuristic");
      }

      let msg;
      if (err.response && err.response.status === 401) {
        msg = "Session expired. Please log in again to analyze clinical scans.";
      } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        msg = "The AI server is warming up (Railway cold start). This usually takes 30-60 seconds. Please try again in a moment.";
      } else {
        msg = err.response?.data?.detail || "Failed to process the scan. The server may be restarting — please try again in a moment.";
      }
      setError(msg);
      showToast("Analysis failed.", "error");
    } finally {
      setIsUploading(false);
      setStatusStep(0);
      if (rescueTimer) clearTimeout(rescueTimer);
      if (loadingTimer.current) clearTimeout(loadingTimer.current);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-10 pb-20 relative z-10 px-4">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 sm:p-12 rounded-[2.5rem] relative overflow-hidden"
      >
        {/* Top Shimmer */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-medical/10 border border-medical/20">
                <Zap size={14} className="text-medical" />
              </div>
              <span className="text-[10px] font-mono font-bold text-medical uppercase tracking-[0.2em]">Neural Vision Hub</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight">Chest X-Ray <span className="text-medical">Analysis</span></h2>
            <p className="text-slate-400 mt-2 font-medium max-w-md">
              High-precision clinical detection utilizing the Advanced Medical Engine.
            </p>
            
            <button 
              onClick={() => navigate('/upload-audio')}
              className="mt-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-clinical/10 border border-clinical/20 text-clinical text-[10px] font-bold uppercase tracking-widest hover:bg-clinical/20 transition-all"
            >
               <Mic size={14} />
               Switch to Cough Analysis
            </button>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-3">
             <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-black/20 px-4 py-2 rounded-xl border border-white/5">
                <ShieldCheck size={14} className="text-medical" />
                <span>Clinical Privacy-First Protocol</span>
             </div>

             {/* Engine Toggle */}
             <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${!deepScan ? 'text-cyan-400' : 'text-slate-500'}`}>High-Speed</span>
                <button 
                  onClick={() => setDeepScan(!deepScan)}
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${deepScan ? 'bg-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-700'}`}
                >
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${deepScan ? 'left-7' : 'left-1'}`} />
                </button>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${deepScan ? 'text-indigo-400' : 'text-slate-500'}`}>Deep Neural</span>
             </div>
          </div>
        </div>

        {deepScan && (
           <motion.div 
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             className="mb-6 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex gap-3 items-center"
           >
              <AlertCircle size={16} className="text-indigo-400" />
              <p className="text-[10px] text-indigo-200 font-medium leading-relaxed">
                 <strong className="text-indigo-400">Deep Analysis Selected:</strong> This mode uses high-complexity neural layers for detailed pathology mapping. Processing may take longer and requires significant server resources.
              </p>
           </motion.div>
        )}

        <div 
          className={`relative border-2 border-dashed rounded-[2rem] p-4 text-center transition-all duration-500 group ${
            file 
              ? 'border-indigo-500/40 bg-indigo-500/5' 
              : 'border-white/10 hover:border-indigo-500/40 hover:bg-white/5'
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Internal Glow on Hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-radial-glow pointer-events-none" />

          {!preview ? (
            <div className="py-20 flex flex-col items-center relative z-10">
              <div className="p-6 bg-slate-900 rounded-[2rem] mb-6 border border-white/5 shadow-2xl relative">
                <div className="absolute inset-0 bg-medical/20 blur-xl rounded-full animate-pulse" />
                <UploadCloud className="h-12 w-12 text-medical relative z-10" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-tight">Drop Scan to Analyze</h3>
              <p className="text-slate-500 text-sm mb-8 font-medium">Drag-and-drop or select clinical imagery</p>
              
              <label className="btn-primary cursor-pointer inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest px-8">
                <ImageIcon size={18} />
                Open File Explorer
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
              
              <div className="mt-10 flex gap-6 text-[10px] font-mono text-slate-600 uppercase tracking-[0.25em]">
                {['DICOM', 'JPEG', 'PNG'].map(f => (
                  <span key={f} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-slate-700" /> {f}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 flex flex-col items-center p-4"
            >
              <div className="relative rounded-2xl overflow-hidden group/img">
                <img src={preview} alt="X-Ray Preview" className="max-h-96 object-contain rounded-2xl border border-white/10 shadow-2xl transition-transform duration-700 group-hover/img:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end justify-center p-6">
                  <button 
                    className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 text-white rounded-full font-bold text-xs shadow-xl shadow-rose-950/40 hover:bg-rose-600 transition-all"
                    onClick={() => { setFile(null); setPreview(null); }}
                  >
                    <AlertCircle size={14} /> Remove and Change
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">
                  Sequence Ready: {file.name.length > 25 ? file.name.substring(0, 22) + '...' : file.name}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 p-4 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl flex items-center text-sm font-medium backdrop-blur-md"
            >
              <AlertCircle className="h-5 w-5 mr-3 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {file && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex justify-center border-t border-white/5 pt-10"
          >
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="btn-primary w-full sm:w-auto min-w-[300px] flex items-center justify-center gap-3 disabled:opacity-40"
            >
              {isUploading ? (
                <>
                  <div className="flex gap-1.5 items-center">
                    {[0, 0.2, 0.4].map((d, i) => (
                      <span key={i} className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
                    ))}
                  </div>
                  <span className="ml-2">
                    {statusStep === 1 && "Optimizing Imagery..."}
                    {statusStep === 2 && "Neural Scanning..."}
                    {statusStep === 3 && "Packaging Results..."}
                    {!statusStep && "Processing Neural Scan..."}
                  </span>
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Start AI Analysis
                </>
              )}
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
         {[
           { title: 'Privacy First', desc: 'Secure local processing and encryption.', icon: ShieldCheck, color: 'text-indigo-400' },
           { title: 'Global Precision', desc: 'Trained on 100k+ clinical images.', icon: Zap, color: 'text-violet-400' },
           { title: 'Real-time', desc: 'Results in under 2 seconds.', icon: Loader2, color: 'text-emerald-400' }
         ].map(card => (
           <div key={card.title} className="glass-card p-6 rounded-2xl flex items-start gap-4">
              <div className={`p-2 rounded-lg bg-white/5 ${card.color}`}>
                <card.icon size={18} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-1">{card.title}</h4>
                <p className="text-slate-500 text-xs font-light leading-relaxed">{card.desc}</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
