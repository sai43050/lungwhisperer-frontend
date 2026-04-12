import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle, AlertCircle, Loader2, Mic, Activity, Headphones, Sparkles } from 'lucide-react';
import { predictAudio } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../components/Toast';

export default function UploadAudio({ user }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type.startsWith('audio/') || droppedFile.name.endsWith('.ogg'))) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please upload a valid audio file (.wav, .ogg, .mp3).");
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an audio file first.");
      showToast("No audio file selected.", "warning");
      return;
    }

    if (!user?.user_id) {
       setError("Authentication session expired. Please log in again.");
       showToast("User session invalid.", "error");
       return;
    }

    setIsUploading(true);
    setError(null);
    try {
      const result = await predictAudio(user.user_id, file);
      showToast("Acoustic analysis complete!", "success");
      navigate(`/results/${result.id}`, { state: { result } });
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to process the audio scan. High server latency detected.";
      setError(msg);
      showToast("Audio analysis failed.", "error");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-10 pb-20 relative z-10 px-4">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 sm:p-12 rounded-[2.5rem] relative overflow-hidden"
      >
        {/* Top Shimmer */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <Activity size={14} className="text-violet-400" />
              </div>
              <span className="text-[10px] font-mono font-bold text-violet-400 uppercase tracking-widest">Acoustic Biomarker AI</span>
            </div>
            <h2 className="text-4xl font-display font-black text-white tracking-tight">Cough <span className="text-gradient-violet">Analyzer</span></h2>
            <p className="text-slate-400 mt-2 font-light max-w-md">
              AI-driven acoustic analysis to identify respiratory patterns and anomalies.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-black/20 px-4 py-2 rounded-xl border border-white/5">
             <Headphones size={14} className="text-violet-400" />
             <span>High-Fidelity Audio Pipeline</span>
          </div>
        </div>

        <div 
          className={`relative border-2 border-dashed rounded-[2rem] p-4 text-center transition-all duration-500 group ${
            file 
              ? 'border-violet-500/40 bg-violet-500/5' 
              : 'border-white/10 hover:border-violet-500/40 hover:bg-white/5'
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Internal Glow on Hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" 
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />

          {!file ? (
            <div className="py-20 flex flex-col items-center relative z-10">
              <div className="p-6 bg-slate-900 rounded-3xl mb-6 border border-white/5 shadow-2xl relative">
                <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full animate-pulse" />
                <Mic className="h-12 w-12 text-violet-400 relative z-10" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2">Drop cough recording here</h3>
              <p className="text-slate-500 text-sm mb-8 font-light">or click to upload audio from your device</p>
              
              <label className="btn-primary cursor-pointer inline-flex items-center gap-2 text-sm"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}>
                <Headphones size={18} />
                Select Audio File
                <input type="file" className="hidden" accept="audio/*,.ogg" onChange={handleFileChange} />
              </label>
              
              <div className="mt-10 flex gap-6 text-[10px] font-mono text-slate-600 uppercase tracking-[0.2em]">
                {['WAV', 'OGG', 'MP3', 'FLAC'].map(f => (
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
              className="relative z-10 flex flex-col items-center p-8 bg-black/40 rounded-3xl border border-white/5"
            >
              <div className="w-20 h-20 rounded-2xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center mb-6">
                 <div className="flex items-end gap-1 h-10">
                    {[0, 0.4, 0.2, 0.8, 0.5].map((h, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: ['40%', '100%', '40%'] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1.5 bg-violet-400 rounded-full"
                      />
                    ))}
                 </div>
              </div>
              
              <h3 className="text-lg font-display font-bold text-white mb-1 truncate max-w-xs">{file.name}</h3>
              <p className="text-slate-500 text-xs font-mono mb-8 uppercase tracking-widest">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for scan
              </p>

              <div className="w-full max-w-md bg-black/60 p-4 rounded-2xl border border-white/5 mb-8">
                 <audio controls src={URL.createObjectURL(file)} className="w-full" />
              </div>

              <button 
                className="flex items-center gap-2 px-6 py-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full font-bold text-xs hover:bg-rose-500 hover:text-white transition-all"
                onClick={() => { setFile(null); }}
              >
                <AlertCircle size={14} /> Remove and Reset
              </button>
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
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', boxShadow: '0 10px 30px rgba(139,92,246,0.3)' }}
            >
              {isUploading ? (
                <>
                  <div className="flex gap-1.5 items-center">
                    {[0, 0.2, 0.4].map((d, i) => (
                      <span key={i} className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
                    ))}
                  </div>
                  <span className="ml-2">Analyzing Spectrum...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze Cough Audio
                </>
              )}
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
         {[
           { title: 'Audio Analysis', desc: 'ResNet18 identifies spectral anomalies.', icon: Mic, color: 'text-violet-400' },
           { title: 'Pattern Match', desc: 'Matched against clinical cough database.', icon: Sparkles, color: 'text-cyan-400' },
           { title: 'Secure Vault', desc: 'Your health data is 256-bit encrypted.', icon: CheckCircle, color: 'text-emerald-400' }
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
