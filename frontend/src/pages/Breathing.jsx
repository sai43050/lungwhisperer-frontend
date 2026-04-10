import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Play, Pause, RotateCcw, Info } from 'lucide-react';

const techniques = [
  {
    name: 'Box Breathing',
    benefit: 'Reduces stress and anxiety',
    desc: 'Equal phases of inhale, hold, exhale, and hold. Used by Navy SEALs for calm under pressure.',
    timing: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  },
  {
    name: '4-7-8 Technique',
    benefit: 'Better sleep and relaxation',
    desc: 'Natural tranquilizer for the nervous system.',
    timing: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
  },
  {
    name: 'Diaphragmatic',
    benefit: 'Deep oxygenation',
    desc: 'Belly breathing for maximum lung capacity.',
    timing: { inhale: 5, hold1: 2, exhale: 5, hold2: 0 },
  },
  {
    name: 'Pursed Lip',
    benefit: 'Airway opening',
    desc: 'Keeps airways open longer during exhalation.',
    timing: { inhale: 2, hold1: 0, exhale: 4, hold2: 0 },
  },
  {
    name: 'Energizing',
    benefit: 'Quick energy boost',
    desc: 'Rapid rhythmic breathing to increase alertness.',
    timing: { inhale: 1, hold1: 0, exhale: 1, hold2: 0 },
  }
];

const Breathing = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('TAP TO START');
  const [count, setCount] = useState(0);
  const [round, setRound] = useState(0);
  const [totalMins, setTotalMins] = useState(0);

  const currentEx = techniques[selectedIdx];

  useEffect(() => {
    let timer;
    if (isActive) {
      const runExercise = async () => {
        const { inhale, hold1, exhale, hold2 } = currentEx.timing;
        
        while (isActive) {
          // Inhale
          setPhase('INHALE');
          for (let i = inhale; i > 0; i--) {
            setCount(i);
            await new Promise(r => setTimeout(r, 1000));
          }
          
          // Hold 1
          if (hold1 > 0) {
            setPhase('HOLD');
            for (let i = hold1; i > 0; i--) {
              setCount(i);
              await new Promise(r => setTimeout(r, 1000));
            }
          }
          
          // Exhale
          setPhase('EXHALE');
          for (let i = exhale; i > 0; i--) {
            setCount(i);
            await new Promise(r => setTimeout(r, 1000));
          }
          
          // Hold 2
          if (hold2 > 0) {
            setPhase('HOLD');
            for (let i = hold2; i > 0; i--) {
              setCount(i);
              await new Promise(r => setTimeout(r, 1000));
            }
          }
          
          setRound(r => r + 1);
          setTotalMins(m => m + (inhale + hold1 + exhale + hold2) / 60);
        }
      };
      runExercise();
    } else {
      setPhase('TAP TO START');
      setCount(0);
    }
    return () => clearTimeout(timer);
  }, [isActive, selectedIdx]);

  return (
    <div className="space-y-6 pt-4 max-w-4xl mx-auto pb-24 relative z-10">
      <div className="glass-panel p-8 rounded-[2.5rem] border border-vignan-500/20 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-display font-black text-white tracking-tight">Breathing <span className="text-accent-400">Therapy</span></h1>
            <p className="text-vignan-200 text-sm font-light mt-1 uppercase tracking-widest opacity-80">Evidence-based respiratory exercises</p>
          </div>
          <div className="flex gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/5">
             {['Overview', 'History'].map(tab => (
               <button key={tab} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${tab === 'Overview' ? 'bg-vignan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                 {tab}
               </button>
             ))}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar mb-8">
          {techniques.map((ex, idx) => (
            <button
              key={ex.name}
              onClick={() => { setSelectedIdx(idx); setIsActive(false); }}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl text-sm font-bold border transition-all duration-500 ${selectedIdx === idx ? 'bg-accent-500 text-white border-accent-400 shadow-[0_0_20px_rgba(0,154,228,0.4)]' : 'bg-vignan-900/40 text-vignan-300 border-vignan-700/50 hover:border-vignan-500/50'}`}
            >
              {ex.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-display font-bold text-white">{currentEx.name}</h3>
            <p className="text-accent-400 text-sm font-semibold flex items-center justify-center gap-2">
              <Info size={16} /> {currentEx.benefit}
            </p>
            <p className="text-slate-300 text-sm leading-relaxed font-light mx-auto max-w-sm">
              {currentEx.desc}
            </p>
            
            <div className="flex justify-center gap-6 pt-6">
              <div className="text-center">
                <div className="text-3xl font-display font-black text-vignan-200">{round}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Rounds</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-black text-accent-400">{totalMins.toFixed(1)}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-black text-vignan-200">3</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Day Streak</div>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center h-80">
            {/* Animated Ring */}
            <AnimatePresence>
               {isActive && (
                 <motion.div 
                   className="absolute rounded-full border-2 border-accent-400/30"
                   initial={{ width: 160, height: 160 }}
                   animate={{ 
                     width: phase === 'INHALE' ? 280 : phase === 'EXHALE' ? 160 : phase === 'HOLD' ? 280 : 160,
                     height: phase === 'INHALE' ? 280 : phase === 'EXHALE' ? 160 : phase === 'HOLD' ? 280 : 160,
                     opacity: [0.3, 0.6, 0.3],
                   }}
                   transition={{ 
                     duration: phase === 'INHALE' ? currentEx.timing.inhale : phase === 'EXHALE' ? currentEx.timing.exhale : 0.5,
                     ease: "easeInOut"
                   }}
                 />
               )}
            </AnimatePresence>

            <motion.div 
              onClick={() => setIsActive(!isActive)}
              className={`w-48 h-48 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-700 shadow-2xl relative z-10 ${isActive ? 'bg-accent-500/10 border-accent-500/40 ring-4 ring-accent-500/20' : 'bg-vignan-800/20 border-vignan-600/30'}`}
              style={{ border: '2px solid' }}
              animate={{
                scale: phase === 'INHALE' ? 1.4 : phase === 'EXHALE' ? 1 : 1
              }}
              transition={{ 
                duration: phase === 'INHALE' ? currentEx.timing.inhale : phase === 'EXHALE' ? currentEx.timing.exhale : 1,
                ease: "easeInOut"
              }}
            >
              <div className="text-accent-400 font-display font-black text-xs tracking-[0.2em] mb-1">{phase}</div>
              <div className="text-5xl font-display font-black text-white mb-2">{count > 0 ? count : (isActive ? '...' : <Play size={40} className="fill-white" />)}</div>
              {isActive && <div className="text-[10px] text-slate-400 uppercase tracking-widest">Seconds</div>}
            </motion.div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-around gap-4 pt-8 border-t border-white/5">
           {Object.entries(currentEx.timing).map(([k, v]) => (
             v > 0 && (
               <div key={k} className="flex flex-col items-center">
                  <div className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">{k.replace(/[0-9]/g, '')}</div>
                  <div className="text-white font-display font-bold text-lg">{v}s</div>
               </div>
             )
           ))}
        </div>
      </div>
    </div>
  );
};

export default Breathing;
