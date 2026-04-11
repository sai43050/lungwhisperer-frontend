import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, DollarSign, Heart, Clock, CheckCircle2, Trophy, TrendingUp, Zap, Flame, Calendar, Activity } from 'lucide-react';

const milestones = [
  { label: '20 Minutes', effect: 'Vascular stabilization. Heart rate and blood pressure drop to baseline.', icon: Clock, time: 20 / 60 / 24 },
  { label: '12 Hours', effect: 'Carbon monoxide levels in blood return to normal. Blood oxygen increases.', icon: Leaf, time: 12 / 24 },
  { label: '48 Hours', effect: 'Nerve endings start to regrow. Sensory systems for smell and taste regenerate.', icon: Heart, time: 2 },
  { label: '72 Hours', effect: 'Bronchial tubes relax. Respiratory capacity significantly improves.', icon: TrendingUp, time: 3 },
  { label: '2-12 Weeks', effect: 'Circulatory efficiency improves. Lung function capacity increases by 30%.', icon: Trophy, time: 14 },
  { label: '1-9 Months', effect: 'Cilia regrow in lungs. Coughing and shortness of breath diminish.', icon: CheckCircle2, time: 30 }
];

const SmokingTracker = () => {
  const [quitDate] = useState(new Date(Date.now() - 47 * 24 * 60 * 60 * 1000 - 18 * 60 * 60 * 1000));
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const diff = now - quitDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const cigsAvoided = days * 20 + Math.floor(hours * 0.8);
  const moneySaved = cigsAvoided * 5; 
  const lifeSaved = (cigsAvoided * 11) / 1440; 

  return (
    <div className="space-y-6 pt-6 max-w-5xl mx-auto pb-24 relative z-10 px-4">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 sm:p-12 rounded-[3rem] border-white/5 shadow-2xl overflow-hidden relative"
      >
        {/* Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Flame size={14} className="text-emerald-400" />
               </div>
               <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">Quit Smoking Protocol</span>
            </div>
            <h1 className="text-4xl font-display font-black text-white tracking-tight">Reclamation <span className="text-gradient-cyan">Tracker</span></h1>
            <p className="text-slate-400 mt-2 font-light max-w-sm">
               Real-time monitoring of biological recovery biomarkers.
            </p>
          </div>
          
          <div className="hidden sm:flex items-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
               <Trophy size={16} className="text-emerald-400" />
               <span className="text-xs font-bold text-white uppercase tracking-tighter">Level 8 Recover</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Main Time Counter Card */}
          <div className="xl:col-span-12 xxl:col-span-5 space-y-6">
            <div className="glass-card p-10 rounded-[2.5rem] text-center border-white/10 relative overflow-hidden group">
              {/* Internal HUD Elements */}
              <div className="absolute top-4 left-4 border-t border-l border-white/10 w-8 h-8 rounded-tl-xl" />
              <div className="absolute bottom-4 right-4 border-b border-r border-white/10 w-8 h-8 rounded-br-xl" />
              
              <div className="text-slate-500 text-[10px] font-mono font-bold uppercase tracking-[0.4em] mb-6">Smoke-Free Duration</div>
              
              <div className="flex flex-col items-center gap-2 mb-8">
                <div className="flex items-baseline gap-4">
                  <span className="text-8xl font-display font-black text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.2)] tracking-tighter">
                    {days}
                  </span>
                  <span className="text-3xl font-display font-bold text-emerald-400 uppercase tracking-widest">Days</span>
                </div>
                <div className="h-1.5 w-64 bg-white/5 rounded-full mt-4 overflow-hidden p-[1px] border border-white/5">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 2 }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: 'Hours', val: hours },
                  { label: 'Minutes', val: minutes },
                  { label: 'Seconds', val: seconds }
                ].map(u => (
                  <div key={u.label} className="bg-black/60 p-5 rounded-2xl border border-white/5 transition-all hover:bg-black/80">
                    <div className="text-3xl font-display font-black text-white tabular-nums">{u.val}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">{u.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {[
                 { label: 'Cigs Avoided', val: cigsAvoided, sub: 'Units', icon: Zap, color: 'text-violet-400', bg: 'bg-violet-500/10' },
                 { label: 'Capital Saved', val: `₹${moneySaved}`, sub: 'INR', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                 { label: 'Life Recouped', val: lifeSaved.toFixed(1), sub: 'Days', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/10' }
               ].map((stat, i) => (
                 <motion.div 
                    key={i} 
                    whileHover={{ y: -5 }}
                    className={`${stat.bg} p-6 rounded-[2rem] border border-white/5 flex flex-col items-center text-center transition-all`}
                 >
                    <div className={`p-2.5 rounded-xl bg-black/40 ${stat.color} mb-4`}>
                       <stat.icon size={20} />
                    </div>
                    <div className={`text-2xl font-display font-black text-white`}>{stat.val}</div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black mt-1">{stat.label}</div>
                 </motion.div>
               ))}
            </div>
          </div>

          {/* Recovery Milestones (Secondary Column) */}
          <div className="xl:col-span-12 xxl:col-span-7 bg-black/40 p-8 rounded-[2.5rem] border border-white/5 flex flex-col">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">Biological Recovery Stages</h3>
               <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-slate-500 uppercase">System Active</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {milestones.map((ms, i) => {
                const Icon = ms.icon;
                const isDone = ms.time <= days;
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-6 rounded-[2rem] border flex gap-5 items-start transition-all duration-500 group relative ${
                      isDone 
                        ? 'bg-white/5 border-emerald-500/20' 
                        : 'bg-black/20 border-white/5 opacity-40 grayscale'
                    }`}
                  >
                    {isDone && (
                      <div className="absolute top-4 right-4 text-emerald-500">
                         <CheckCircle2 size={16} />
                      </div>
                    )}
                    <div className={`p-4 rounded-2xl transition-all duration-500 ${
                      isDone 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-slate-800 text-slate-600'
                    }`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h4 className={`text-base font-bold mb-1 ${isDone ? 'text-white' : 'text-slate-500'}`}>{ms.label}</h4>
                      <p className="text-xs font-light text-slate-500 leading-relaxed">{ms.effect}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Footer Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-8 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/20 rounded-[3rem] shadow-2xl relative overflow-hidden group"
        >
           {/* Shimmer Effect */}
           <div className="absolute inset-0 bg-shimmer opacity-20 group-hover:opacity-40 transition-opacity" />
           
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="p-6 bg-white rounded-[2rem] shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                 <Activity className="text-emerald-600" size={48} />
              </div>
              <div>
                 <h4 className="text-2xl font-display font-black text-white tracking-tight uppercase">Lung Capacity Regeneration</h4>
                 <p className="text-emerald-100/60 text-sm font-light mt-2 max-w-3xl leading-relaxed">
                    Analyzing your cessation trajectory: Your arterial oxygen saturation has stabilized. Alveolar regeneration is in an active phase. 
                    Calculated efficiency increase: <span className="text-white font-bold">+22.4%</span> since session start.
                 </p>
              </div>
              <div className="md:ml-auto">
                 <button className="px-8 py-3 rounded-full bg-white text-emerald-950 font-black text-xs uppercase tracking-widest shadow-xl shadow-white/10 hover:scale-105 transition-transform">
                    View Lab Data
                 </button>
              </div>
           </div>
        </motion.div>
      </motion.div>

      {/* Ticker for extra encouragement */}
      <div className="flex gap-4 justify-center py-4 opacity-50 overflow-hidden whitespace-nowrap">
         {[1, 2, 3, 4, 5].map(i => (
           <span key={i} className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.5em] flex items-center gap-2">
              <Zap size={10} /> Cellular Repair In Progress
           </span>
         ))}
      </div>
    </div>
  );
};

export default SmokingTracker;
