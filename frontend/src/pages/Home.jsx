import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Activity, Cpu, Wifi, HeartPulse } from 'lucide-react';

const floatVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export default function Home({ user }) {
  return (
    <div className="flex flex-col items-center pt-20 pb-20 relative overflow-hidden min-h-screen">

      {/* Animated aurora background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full opacity-20 animate-pulse-slow"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.6) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute -bottom-48 -left-48 w-[700px] h-[700px] rounded-full opacity-15 animate-pulse-slow"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)', filter: 'blur(80px)', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.4) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' width='64' height='64' fill='none' stroke='rgb(255 255 255 / 0.03)'%3e%3cpath d='M0 .5H63.5V64'/%3e%3c/svg%3e\")"
          }} />
      </div>

      {/* Hero Section */}
      <section className="w-full text-center py-20 px-4 relative z-10">
        <motion.div
          variants={floatVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
            style={{
              background: 'rgba(6,182,212,0.08)',
              border: '1px solid rgba(6,182,212,0.25)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest">
              AI-Powered Respiratory Intelligence
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white mb-6 tracking-tight leading-[0.95]">
            {user ? (
              <>
                Welcome back,{' '}
                <span className="text-gradient capitalize block sm:inline">
                  {user.full_name || user.username}
                </span>
              </>
            ) : (
              <>
                Next-Gen{' '}
                <span className="text-gradient block sm:inline">
                  Lung AI
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
          >
            {user
              ? 'Your respiratory health monitoring is active. Select an analysis mode below.'
              : 'Upload chest X-rays or cough recordings for instant AI-driven diagnostic analysis with clinical precision.'}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {user ? (
              <>
                <Link
                  to="/patient-dashboard"
                  className="group inline-flex items-center px-8 py-4 text-white font-bold rounded-2xl transition-all duration-300 text-sm relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                    boxShadow: '0 0 30px rgba(6,182,212,0.4), 0 4px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Enter Dashboard
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)' }} />
                </Link>
                <Link
                  to="/upload"
                  className="group inline-flex items-center px-8 py-4 text-white font-bold rounded-2xl transition-all duration-300 text-sm"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                >
                  <Activity className="mr-2 h-4 w-4 text-cyan-400" />
                  New Analysis
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/upload"
                  className="group inline-flex items-center px-8 py-4 text-white font-bold rounded-2xl transition-all duration-300 text-sm relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                    boxShadow: '0 0 30px rgba(6,182,212,0.4), 0 4px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start X-Ray Analysis
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)' }} />
                </Link>
                <Link
                  to="/login"
                  className="group inline-flex items-center px-8 py-4 text-white font-bold rounded-2xl transition-all duration-300 text-sm"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                >
                  <HeartPulse className="mr-2 h-4 w-4 text-violet-400" />
                  Sign In
                </Link>
              </>
            )}
          </motion.div>

          {/* Live stats ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex justify-center gap-8 text-xs font-mono"
          >
            {[
              { label: 'ACCURACY', value: '94.2%', color: '#22d3ee' },
              { label: 'UPTIME', value: '99.9%', color: '#34d399' },
              { label: 'LATENCY', value: '<200ms', color: '#a78bfa' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: stat.color }} />
                <span className="text-slate-500 uppercase tracking-widest">{stat.label}</span>
                <span className="font-bold" style={{ color: stat.color }}>{stat.value}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Cards */}
      <section className="grid md:grid-cols-3 gap-5 w-full max-w-5xl px-4 relative z-10">
        <FeatureCard
          icon={<Zap className="h-6 w-6" style={{ color: '#22d3ee' }} />}
          iconBg="rgba(6,182,212,0.12)"
          iconBorder="rgba(6,182,212,0.25)"
          glowColor="rgba(6,182,212,0.15)"
          title="Instant X-Ray AI"
          description="Clinical DenseNet-121 analyzes chest X-rays in under a second with GradCAM heatmaps."
          tag="Vision AI"
          delay={0.1}
        />
        <FeatureCard
          icon={<Activity className="h-6 w-6" style={{ color: '#a78bfa' }} />}
          iconBg="rgba(139,92,246,0.12)"
          iconBorder="rgba(139,92,246,0.25)"
          glowColor="rgba(139,92,246,0.15)"
          title="Cough Analyzer"
          description="ResNet18 audio model classifies cough patterns to detect COVID-19 and respiratory illness."
          tag="Audio AI"
          delay={0.25}
        />
        <FeatureCard
          icon={<ShieldCheck className="h-6 w-6" style={{ color: '#34d399' }} />}
          iconBg="rgba(52,211,153,0.12)"
          iconBorder="rgba(52,211,153,0.25)"
          glowColor="rgba(52,211,153,0.15)"
          title="Live Monitoring"
          description="Real-time SpO2, heart rate & respiratory tracking with AI-driven critical alerts."
          tag="IoT + ML"
          delay={0.4}
        />
      </section>

      {/* Bottom status bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 flex items-center gap-3 px-5 py-2.5 rounded-full relative z-10"
        style={{
          background: 'rgba(3,7,18,0.7)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <Wifi className="h-3 w-3 text-cyan-400" />
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">System Online</span>
        <span className="w-px h-3 bg-slate-700" />
        <Cpu className="h-3 w-3 text-violet-400" />
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Neural Engine Active</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, iconBg, iconBorder, glowColor, title, description, tag, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -6 }}
      className="relative p-6 rounded-3xl group cursor-default overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(13,26,45,0.6) 0%, rgba(7,13,26,0.5) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(6,182,212,0.25)';
        e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.5), 0 0 30px ${glowColor}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top shimmer line on hover */}
      <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.6), transparent)' }} />

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
      >
        {icon}
      </div>

      {/* Tag */}
      <div className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">{tag}</div>

      <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
        {title}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed font-light">
        {description}
      </p>
    </motion.div>
  );
}
