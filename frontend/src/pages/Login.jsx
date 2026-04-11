import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api';
import { Activity, Lock, Stethoscope, Heart, Eye, EyeOff, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      if (isRegistering) {
        await register(username, password, role, fullName);
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
      setErrorMsg(
        isRegistering
          ? "Registration failed. Username may already be taken."
          : "Incorrect username or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden"
      style={{ background: '#030712' }}
    >
      {/* Background aurora */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full opacity-20 animate-pulse-slow"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.8) 0%, transparent 70%)', filter: 'blur(100px)' }} />
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full opacity-15 animate-pulse-slow"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.8) 0%, transparent 70%)', filter: 'blur(100px)', animationDelay: '2s' }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-40"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.025)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(13,26,45,0.85) 0%, rgba(7,13,26,0.9) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 0 0 0.5px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.07)',
            backdropFilter: 'blur(40px)',
          }}
        >
          {/* Top neon bar */}
          <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.8) 20%, rgba(139,92,246,0.8) 80%, transparent)' }} />

          <div className="px-8 py-10">
            {/* Logo + Title */}
            <div className="flex flex-col items-center mb-8">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="p-3.5 rounded-2xl mb-4 relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.1))',
                  border: '1px solid rgba(6,182,212,0.3)',
                  boxShadow: '0 0 25px rgba(6,182,212,0.25)',
                }}
              >
                <Activity className="w-8 h-8 text-cyan-400" />
              </motion.div>
              <h1 className="text-2xl font-display font-bold text-white">
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {isRegistering
                  ? 'Join Lung Whisperer AI Platform'
                  : 'Sign in to your medical account'}
              </p>

              {/* Mode tabs */}
              <div
                className="mt-5 flex rounded-xl p-1 w-full"
                style={{ background: 'rgba(3,7,18,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {['Sign In', 'Register'].map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => { setIsRegistering(i === 1); setErrorMsg(''); }}
                    className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
                    style={
                      (!isRegistering && i === 0) || (isRegistering && i === 1)
                        ? {
                            background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(139,92,246,0.15))',
                            border: '1px solid rgba(6,182,212,0.3)',
                            color: 'white',
                          }
                        : { color: 'rgba(148,163,184,0.7)', border: '1px solid transparent' }
                    }
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={isRegistering ? 'register' : 'login'}
                initial={{ opacity: 0, x: isRegistering ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRegistering ? -20 : 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleAuth}
                className="space-y-4"
              >
                {/* Full Name (Register only) */}
                {isRegistering && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={15} />
                      <input
                        type="text"
                        required={isRegistering}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="input-dark w-full pl-10 pr-4 py-3 text-sm"
                        placeholder="Your full name"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Username */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={15} />
                    <input
                      type="text"
                      required
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="input-dark w-full pl-10 pr-4 py-3 text-sm"
                      placeholder="Enter username"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={15} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete={isRegistering ? 'new-password' : 'current-password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-dark w-full pl-10 pr-12 py-3 text-sm"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Role selection */}
                {isRegistering && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                      I am registering as
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'patient', label: 'Patient', icon: Heart, color: 'rgba(6,182,212,0.3)', bg: 'rgba(6,182,212,0.1)' },
                        { value: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'rgba(139,92,246,0.3)', bg: 'rgba(139,92,246,0.1)' },
                      ].map(opt => {
                        const Icon = opt.icon;
                        const active = role === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setRole(opt.value)}
                            className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-sm font-semibold transition-all duration-200"
                            style={active
                              ? { background: opt.bg, border: `1px solid ${opt.color}`, color: 'white', boxShadow: `0 0 12px ${opt.bg}` }
                              : { background: 'rgba(3,7,18,0.4)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(148,163,184,0.6)' }
                            }
                          >
                            <Icon size={15} />
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Error */}
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl text-rose-400 text-xs text-center"
                    style={{ background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.2)' }}
                  >
                    {errorMsg}
                  </motion.div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-white text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                    boxShadow: '0 0 25px rgba(6,182,212,0.35), 0 4px 15px rgba(0,0,0,0.3)',
                  }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.boxShadow = '0 0 40px rgba(6,182,212,0.55), 0 8px 25px rgba(0,0,0,0.4)')}
                  onMouseLeave={e => !loading && (e.currentTarget.style.boxShadow = '0 0 25px rgba(6,182,212,0.35), 0 4px 15px rgba(0,0,0,0.3)')}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {isRegistering ? 'Creating Account...' : 'Signing In...'}
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      {isRegistering ? 'Create Account' : 'Sign In'}
                    </>
                  )}
                </button>
              </motion.form>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer badges */}
        <div className="mt-5 flex justify-center gap-6 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
          <span>🔒 Encrypted</span>
          <span>🏥 HIPAA</span>
          <span>⚡ AI-Powered</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
