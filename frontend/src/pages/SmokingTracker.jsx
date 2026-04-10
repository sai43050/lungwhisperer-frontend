import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, DollarSign, Heart, Clock, CheckCircle2, Trophy, TrendingUp } from 'lucide-react';

const milestones = [
  { label: '20 Minutes', effect: 'Heart rate and blood pressure drop.', icon: Clock, time: 20 / 60 / 24 },
  { label: '12 Hours', effect: 'Carbon monoxide levels in blood return to normal.', icon: Leaf, time: 12 / 24 },
  { label: '48 Hours', effect: 'Nerve endings start to regrow. Smell and taste improve.', icon: Heart, time: 2 },
  { label: '72 Hours', effect: 'Bronchial tubes relax. Breathing becomes easier.', icon: TrendingUp, time: 3 },
  { label: '2-12 Weeks', effect: 'Circulation improves. Lung function increases.', icon: Trophy, time: 14 },
  { label: '1-9 Months', effect: 'Coughing and shortness of breath decrease.', icon: CheckCircle2, time: 30 }
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
  const moneySaved = cigsAvoided * 5; // Assuming 5 INR per cig
  const lifeSaved = (cigsAvoided * 11) / 1440; // 11 mins life saved per cig avoided

  return (
    <div className="space-y-6 pt-4 max-w-4xl mx-auto pb-24 relative z-10">
      <div className="glass-panel p-8 rounded-[2.5rem] border border-vignan-500/20 shadow-2xl">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-display font-black text-white tracking-tight">Quit <span className="text-accent-400">Tracker</span></h1>
          <p className="text-vignan-200 text-sm font-light mt-1 uppercase tracking-widest opacity-80">Reclaiming your health, one day at a time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="glass-card p-8 rounded-3xl text-center border-vignan-400/30">
              <div className="text-vignan-300 text-[10px] uppercase tracking-[0.2em] font-black mb-4">You have been smoke-free for</div>
              <div className="flex justify-center items-baseline gap-2">
                <span className="text-6xl font-display font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{days}</span>
                <span className="text-xl font-display font-bold text-accent-400">DAYS</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-6">
                <div className="bg-black/20 p-3 rounded-2xl border border-white/5">
                  <div className="text-xl font-display font-black text-white">{hours}</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Hours</div>
                </div>
                <div className="bg-black/20 p-3 rounded-2xl border border-white/5">
                  <div className="text-xl font-display font-black text-white">{minutes}</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Mins</div>
                </div>
                <div className="bg-black/20 p-3 rounded-2xl border border-white/5">
                  <div className="text-xl font-display font-black text-white">{seconds}</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Secs</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
               {[
                 { label: 'Avoided', val: cigsAvoided, unit: 'Cigs', color: 'text-vignan-300', bg: 'bg-vignan-500/10' },
                 { label: 'Saved', val: `₹${moneySaved}`, unit: 'INR', color: 'text-accent-400', bg: 'bg-accent-500/10' },
                 { label: 'Recovery', val: lifeSaved.toFixed(1), unit: 'Days', color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
               ].map((stat, i) => (
                 <div key={i} className={`${stat.bg} p-4 rounded-2xl border border-white/5 text-center`}>
                    <div className={`text-xl font-display font-black ${stat.color}`}>{stat.val}</div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mt-1">{stat.label}</div>
                 </div>
               ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border-white/5">
            <h3 className="text-lg font-display font-bold text-white mb-6 px-2">Recovery Milestones</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {milestones.map((ms, i) => {
                const Icon = ms.icon;
                const isDone = ms.time <= days;
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-4 rounded-2xl border flex gap-4 items-start transition-all ${isDone ? 'bg-accent-500/10 border-accent-500/20' : 'bg-black/10 border-white/5 opacity-50'}`}
                  >
                    <div className={`p-2.5 rounded-xl ${isDone ? 'bg-accent-500 text-white shadow-lg' : 'bg-vignan-800 text-slate-500'}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between mb-0.5">
                        <h4 className={`text-sm font-bold ${isDone ? 'text-white' : 'text-slate-400'}`}>{ms.label}</h4>
                        {isDone && <CheckCircle2 size={14} className="text-accent-400" />}
                      </div>
                      <p className="text-[11px] font-light text-slate-400 leading-relaxed">{ms.effect}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 p-6 bg-accent-600/10 border border-accent-400/20 rounded-[2rem] flex items-center gap-6">
           <div className="p-4 bg-accent-500 rounded-2xl shadow-xl shadow-accent-900/40">
              <TrendingUp className="text-white" size={32} />
           </div>
           <div>
              <h4 className="text-xl font-display font-bold text-white">Lung Capacity Regeneration</h4>
              <p className="text-slate-400 text-sm font-light mt-1">Your blood's oxygen levels have stabilized, and your lung function has likely improved by 15-20% since you quit.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SmokingTracker;
