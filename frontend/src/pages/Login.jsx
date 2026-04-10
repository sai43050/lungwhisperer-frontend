import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api';
import { Activity, ShieldCheck, Zap, Lock, Globe, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      if (isRegistering) {
         await register(username, password, role);
         const user = await login(username, password);
         onLogin(user);
         navigate(user.role === 'patient' ? '/patient-dashboard' : '/doctor-panel');
      } else {
         const user = await login(username, password);
         onLogin(user);
         navigate(user.role === 'patient' ? '/patient-dashboard' : '/doctor-panel');
      }
    } catch (error) {
      console.error("Auth Error:", error);
      setErrorMsg(error.response?.data?.detail || "Authentication Failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#050b18]">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-accent-500/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, -80, 0],
            y: [0, 80, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -left-1/4 w-[700px] h-[700px] bg-vignan-600/20 rounded-full blur-[150px]"
        />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-xl w-full relative z-10"
      >
        <div className="glass-panel p-8 sm:p-12 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl overflow-hidden relative">
          
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-500 to-transparent"></div>

          <div className="text-center mb-10">
            <motion.div 
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-flex p-4 bg-gradient-to-tr from-accent-600/20 to-vignan-500/20 rounded-2xl border border-white/10 mb-6 shadow-xl"
            >
              <Activity className="w-10 h-10 text-accent-400" />
            </motion.div>
            <h2 className="text-4xl font-display font-black text-white tracking-tight leading-tight">
              {isRegistering ? 'Initialize Node' : 'Network Access'}
            </h2>
            <p className="mt-3 text-slate-400 font-light tracking-wide flex items-center justify-center gap-2">
              <Globe size={14} className="text-accent-500" />
              Vignan Respiratory Analytics Grid
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.form 
              key={isRegistering ? 'reg' : 'login'}
              initial={{ opacity: 0, x: isRegistering ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRegistering ? -20 : 20 }}
              onSubmit={handleAuth} 
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Zap className="h-5 w-5 text-vignan-400 group-focus-within:text-accent-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all font-medium backdrop-blur-sm"
                    placeholder="Enter Matrix Username"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-500/50 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500"></div>
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-vignan-400 group-focus-within:text-accent-400 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all font-medium backdrop-blur-sm"
                    placeholder="Security Passcode"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-vignan-500/50 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500"></div>
                </div>

                {isRegistering && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-2"
                  >
                    <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-4 ml-1">Access Tier Selection</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setRole('patient')}
                        className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl border transition-all duration-300 font-bold ${
                          role === 'patient' 
                            ? 'border-accent-500 bg-accent-500/10 text-white shadow-[0_0_20px_rgba(0,154,228,0.2)]' 
                            : 'border-white/5 text-slate-400 hover:bg-white/5'
                        }`}
                      >
                        <ShieldCheck size={18} />
                        Patient
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('doctor')}
                        className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl border transition-all duration-300 font-bold ${
                          role === 'doctor' 
                            ? 'border-healthcare-400 bg-healthcare-500/10 text-white shadow-[0_0_20px_rgba(120,99,157,0.2)]' 
                            : 'border-white/5 text-slate-400 hover:bg-white/5'
                        }`}
                      >
                        <Database size={18} />
                        Clinician
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold text-center"
                >
                  {errorMsg}
                </motion.div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl text-white bg-gradient-to-r from-accent-600 to-vignan-600 hover:from-accent-500 hover:to-vignan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition-all duration-300 shadow-[0_10px_30px_rgba(0,154,228,0.3)] hover:shadow-[0_15px_40px_rgba(0,154,228,0.5)] transform hover:-translate-y-1 disabled:opacity-70 disabled:transform-none"
                >
                  <span className="font-black tracking-widest uppercase flex items-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Connecting...
                      </>
                    ) : (
                      isRegistering ? 'Bootstrap Node' : 'Establish Link'
                    )}
                  </span>
                </button>
              </div>
            </motion.form>
          </AnimatePresence>

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm font-medium">
              {isRegistering ? "Existing matrix identity recognized?" : "New to the respiratory network?"}
            </p>
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="mt-2 text-white font-black tracking-widest uppercase text-xs hover:text-accent-400 transition-colors"
            >
              {isRegistering ? 'Return to Access Gate' : 'Initialize New Access Node'}
            </button>
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="mt-12 flex justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
           <div className="flex items-center gap-2 text-[10px] text-white font-black tracking-tighter uppercase">
             <ShieldCheck size={14} /> Encrypted
           </div>
           <div className="flex items-center gap-2 text-[10px] text-white font-black tracking-tighter uppercase">
             <Database size={14} /> Decentralized
           </div>
           <div className="flex items-center gap-2 text-[10px] text-white font-black tracking-tighter uppercase">
             <Lock size={14} /> ISO 27001
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
