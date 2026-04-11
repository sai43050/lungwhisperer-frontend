import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ChevronLeft, Microscope, Stethoscope, Lightbulb, ScanLine } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="text-center py-20 flex flex-col items-center relative z-10">
        <div className="bg-yellow-500/10 p-6 rounded-full border border-yellow-500/30 mb-6">
          <AlertCircle className="h-16 w-16 text-yellow-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">No Result Data Found</h2>
        <p className="text-slate-400 mt-2 mb-8">Please upload a scan to see results.</p>
        <button
          onClick={() => navigate('/upload')}
          className="px-8 py-3 bg-gradient-to-r from-accent-500 to-vignan-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(0,154,228,0.4)] hover:shadow-[0_0_30px_rgba(0,154,228,0.6)] transition-all"
        >
          Go to Upload
        </button>
      </div>
    );
  }

  const rawPrediction = result.prediction;
  const isAudio = rawPrediction.startsWith("COUGH: ");
  const predictionText = rawPrediction.replace("X-RAY: ", "").replace("COUGH: ", "");
  const isNormal = predictionText.toLowerCase() === 'normal' || predictionText.toLowerCase() === 'healthy';

  const statusGradient = isNormal
    ? 'from-emerald-600/80 to-teal-600/80 border-emerald-500/30'
    : 'from-red-700/80 to-rose-600/80 border-red-500/30';

  const confidenceColor = result.confidence > 90
    ? 'from-emerald-500 to-teal-400'
    : result.confidence > 75
    ? 'from-yellow-500 to-amber-400'
    : 'from-red-500 to-rose-400';

  const findings = result.findings || [];
  const suggestions = result.suggestions || [];

  return (
    <div className="max-w-5xl mx-auto pt-4 pb-16 relative z-10 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(isAudio ? '/upload-audio' : '/upload')}
        className="flex items-center text-slate-400 hover:text-white transition-colors gap-1 group"
      >
        <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        Back to {isAudio ? 'Audio' : 'X-Ray'} Upload
      </button>

      {/* Main Result Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-panel p-8 rounded-3xl border bg-gradient-to-r ${statusGradient} shadow-2xl`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${isNormal ? 'bg-emerald-500/30' : 'bg-red-500/30'}`}>
              {isNormal
                ? <CheckCircle2 className="h-10 w-10 text-white" />
                : <AlertCircle className="h-10 w-10 text-white" />}
            </div>
            <div>
              <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-1">
                {isAudio ? 'Cough Acoustic Analysis' : 'Chest X-Ray Analysis'} — Result
              </p>
              <h1 className="text-3xl font-display font-black text-white tracking-wide">{predictionText}</h1>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Record ID</p>
            <p className="text-white font-display font-black text-2xl">#{String(result.id).padStart(5, '0')}</p>
            <p className="text-white/40 text-xs mt-1">{new Date(result.timestamp).toLocaleString()}</p>
          </div>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GradCAM / Scan Visual */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-3xl border border-vignan-500/20 space-y-4"
        >
          <h3 className="font-display font-bold text-white flex items-center gap-2 text-lg">
            <ScanLine className="text-accent-400" size={20} />
            {isAudio ? 'Audio Classification' : 'GradCAM Activation Heatmap'}
          </h3>

          {result.gradcam ? (
            <div className="relative rounded-2xl overflow-hidden border border-accent-500/30 bg-slate-900/60 shadow-[0_0_20px_rgba(0,154,228,0.2)] group">
              <img
                src={result.gradcam}
                alt="GradCAM Heatmap"
                className="w-full object-contain rounded-2xl transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
              <div className="absolute top-4 left-4">
                 <div className="px-3 py-1 bg-red-500/80 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-tighter shadow-lg border border-red-500/50 flex items-center gap-1.5 animate-pulse">
                    <AlertCircle size={10} /> Active Pathology Matrix
                 </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white/80 text-xs font-semibold drop-shadow-md">
                   Model attention heatmap indicates high probability clinical markers in the highlighted regions.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-vignan-600/30 bg-slate-900/40 p-12 text-center flex flex-col items-center">
              <div className="bg-vignan-800/50 p-5 rounded-2xl border border-vignan-600/40 mb-4">
                <Microscope className="h-10 w-10 text-vignan-300" />
              </div>
              <p className="text-slate-400 font-medium">
                {isAudio ? 'Cough signal processed via Mel-Spectrogram' : 'Heatmap not available'}
              </p>
              <p className="text-slate-600 text-sm mt-1">
                {isAudio ? 'ResNet18 audio model classification complete' : 'GradCAM visualization unavailable for this scan'}
              </p>
            </div>
          )}

          {/* Confidence */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Model Confidence</p>
              <p className="text-white font-display font-black text-2xl">{result.confidence}%</p>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.confidence}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                className={`h-3 rounded-full bg-gradient-to-r ${confidenceColor} shadow-md`}
              />
            </div>
          </div>
        </motion.div>

        {/* Findings & Suggestions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Clinical Findings */}
          {findings.length > 0 && (
            <div className="glass-panel p-6 rounded-3xl border border-vignan-500/20">
              <h3 className="font-display font-bold text-white flex items-center gap-2 text-lg mb-4">
                <Microscope className="text-red-400" size={20} />
                Clinical Findings
              </h3>
              <ul className="space-y-3">
                {findings.map((f, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3 bg-red-500/10 p-3 rounded-2xl border border-red-500/20"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                    <span className="text-sm text-slate-200 font-light">{f}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="glass-panel p-6 rounded-3xl border border-vignan-500/20">
              <h3 className="font-display font-bold text-white flex items-center gap-2 text-lg mb-4">
                <Lightbulb className="text-accent-400" size={20} />
                Recommended Actions
              </h3>
              <ul className="space-y-3">
                {suggestions.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-3 bg-accent-500/10 p-3 rounded-2xl border border-accent-500/20"
                  >
                    <div className="w-2 h-2 rounded-full bg-accent-400 shrink-0" />
                    <span className="text-sm text-slate-200 font-light">{s}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Generic Clinical Note */}
          <div className="glass-panel p-6 rounded-3xl border border-vignan-500/20">
            <h3 className="font-display font-bold text-white flex items-center gap-2 text-lg mb-3">
              <Stethoscope className="text-vignan-300" size={20} />
              Clinical Note
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {isNormal
                ? "The AI system detected no significant pathological markers in this scan. All radiographic features appear within normal limits."
                : `The AI model identified indicators consistent with ${predictionText}. Immediate follow-up with a qualified radiologist or pulmonologist is strongly recommended.`}
            </p>
            <div className="mt-4 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-yellow-300 text-xs font-medium">
              ⚠ This is an AI-assisted preliminary screening. It is not a substitute for professional medical diagnosis.
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <button
          onClick={() => navigate(isAudio ? '/upload-audio' : '/upload')}
          className="px-8 py-3 glass-panel text-white font-bold rounded-full hover:bg-white/10 transition-all border border-vignan-500/30"
        >
          New Analysis
        </button>
        <button
          onClick={() => navigate('/history')}
          className="px-8 py-3 bg-gradient-to-r from-accent-500 to-vignan-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(0,154,228,0.3)] hover:shadow-[0_0_30px_rgba(0,154,228,0.5)] transition-all"
        >
          View Scan History
        </button>
      </div>
    </div>
  );
}
