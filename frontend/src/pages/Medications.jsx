import React, { useState } from 'react';
import { Pill, Clock, Plus, CheckCircle2, AlertCircle, Calendar, Trash2 } from 'lucide-react';

const Medications = () => {
  const [meds, setMeds] = useState([
    { id: 1, name: 'Salbutamol 100mcg', dose: '2 puffs', time: '08:00', taken: true },
    { id: 2, name: 'Beclomethasone', dose: '1 puff', time: '20:00', taken: false }
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDose, setNewDose] = useState('');
  const [newTime, setNewTime] = useState('08:00');

  const toggleMed = (id) => {
    setMeds(meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const deleteMed = (id) => {
    setMeds(meds.filter(m => m.id !== id));
  };

  const addMed = () => {
    if (!newName) return;
    setMeds([...meds, { id: Date.now(), name: newName, dose: newDose, time: newTime, taken: false }]);
    setNewName(''); setNewDose(''); setShowAdd(false);
  };

  const adherence = Math.round((meds.filter(m => m.taken).length / meds.length) * 100) || 0;

  return (
    <div className="space-y-6 pt-4 max-w-4xl mx-auto pb-24 relative z-10">
      <div className="glass-panel p-8 rounded-[2.5rem] border border-vignan-500/20 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-display font-black text-white tracking-tight">Medication <span className="text-accent-400">Schedule</span></h1>
            <p className="text-vignan-200 text-sm font-light mt-1 uppercase tracking-widest opacity-80">Reminders & Adherence Tracking</p>
          </div>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-400 text-white font-bold rounded-2xl shadow-lg shadow-accent-900/40 transition-all"
          >
            <Plus size={20} /> Add Medication
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {showAdd && (
              <div className="glass-card p-6 rounded-[2rem] border-accent-500/30 mb-6 bg-vignan-900/60 animate-in fade-in zoom-in duration-300">
                <h3 className="text-lg font-display font-bold text-white mb-4">New Reminder</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Medication Name" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-accent-400"
                  />
                  <input 
                    type="text" 
                    placeholder="Dosage (e.g. 2 puffs)" 
                    value={newDose}
                    onChange={(e) => setNewDose(e.target.value)}
                    className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-accent-400"
                  />
                  <input 
                    type="time" 
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-accent-400"
                  />
                  <button 
                    onClick={addMed}
                    className="bg-accent-500 text-white font-bold rounded-xl py-3 hover:bg-accent-400 transition-all"
                  >
                    Save Reminder
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {meds.map((med) => (
                <div 
                  key={med.id}
                  className={`glass-card p-6 rounded-[2rem] border-white/5 flex items-center gap-6 group transition-all ${med.taken ? 'opacity-60 bg-white/5' : 'hover:border-accent-500/30'}`}
                >
                  <div className={`p-4 rounded-2xl ${med.taken ? 'bg-emerald-500/20 text-emerald-400' : 'bg-accent-500/20 text-accent-400 shadow-[0_0_15px_rgba(0,154,228,0.2)]'}`}>
                    <Pill size={24} />
                  </div>
                  <div className="flex-grow">
                     <h4 className={`text-lg font-display font-bold ${med.taken ? 'text-slate-400' : 'text-white'}`}>{med.name}</h4>
                     <p className="text-xs text-slate-500 font-medium">{med.dose} • {med.time}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleMed(med.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${med.taken ? 'bg-emerald-500 text-white' : 'bg-vignan-800 text-slate-400 hover:text-white hover:bg-vignan-700'}`}
                    >
                      {med.taken ? 'Taken' : 'Mark Taken'}
                    </button>
                    <button onClick={() => deleteMed(med.id)} className="p-2 text-slate-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-8 rounded-[2rem] border-white/5 text-center">
              <div className="relative w-32 h-32 mx-auto mb-6">
                 {/* Progress Ring */}
                 <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="45" fill="none" stroke="var(--accent-400)" strokeWidth="8" 
                      strokeDasharray={`${adherence * 2.82} 282`} 
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      style={{ stroke: '#0aa1f2', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-display font-black text-white">{adherence}%</div>
                    <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black">Adherence</div>
                 </div>
              </div>
              <p className="text-xs text-slate-400 font-light leading-relaxed">You are maintaining a {adherence >= 80 ? 'great' : 'fair'} adherence rate this week. Keep it up!</p>
            </div>

            <div className="glass-card p-6 rounded-[2rem] border-white/5">
              <h4 className="text-xs font-display font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <Calendar size={14} className="text-accent-400" /> Weekly Insights
              </h4>
              <div className="flex gap-2 items-end h-24 pt-4 px-2">
                {[80, 100, 90, 60, 100, 40, 20].map((h, i) => (
                  <div key={i} className="flex-grow flex flex-col items-center gap-2">
                    <div className="w-full bg-accent-500/10 rounded-t-lg relative group">
                      <div 
                        className="bg-accent-500 rounded-t-lg transition-all duration-1000" 
                        style={{ height: `${h}%`, opacity: h / 100 }}
                      />
                    </div>
                    <span className="text-[8px] text-slate-600 font-black">MTWTFSS'[i]</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Medications;
