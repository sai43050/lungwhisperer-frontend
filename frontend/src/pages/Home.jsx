import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Activity } from 'lucide-react';

export default function Home({ user }) {
  return (
    <div className="flex flex-col items-center pt-24 pb-12 relative overflow-hidden min-h-screen">
      
      {/* Background glowing orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-accent-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-vignan-500/20 rounded-full blur-[120px] animate-pulse-slow font-display delay-1000"></div>

      {/* Hero Section */}
      <section className="w-full text-center py-20 px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full glass-panel border-accent-500/30">
              <span className="text-sm font-semibold text-accent-400 uppercase tracking-widest">Advanced Respiratory Diagnostic Matrix</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white mb-6 tracking-tight leading-tight">
            {user ? (
              <>Welcome back, <span className="text-gradient capitalize">{user.username}</span></>
            ) : (
              <>Next-Gen <span className="text-gradient animate-pulse-slow block sm:inline">Respiratory AI</span></>
            )}
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            {user ? (
              "Your diagnostic network nodes are operational. Select an analysis mode below or proceed to your synchronized dashboard."
            ) : (
              "Upload chest radiography or acoustic cough data to our <span className='font-semibold text-white'>Dual-Mode Deep Learning Network</span> for instantaneous, highly-accurate clinical diagnostics."
            )}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            {user ? (
              <>
                <Link
                  to="/patient-dashboard"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent-500 to-vignan-500 hover:from-accent-400 hover:to-vignan-400 text-white font-bold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(0,154,228,0.4)] hover:shadow-[0_0_30px_rgba(0,154,228,0.6)] transform hover:-translate-y-1"
                >
                  Enter Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/upload"
                  className="inline-flex items-center px-8 py-4 glass-panel hover:bg-white/10 text-white font-bold rounded-full transition-all duration-300 hover:border-vignan-400/50 transform hover:-translate-y-1"
                >
                  New Analysis
                  <Activity className="ml-2 h-5 w-5 text-accent-400" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/upload"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent-500 to-vignan-500 hover:from-accent-400 hover:to-vignan-400 text-white font-bold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(0,154,228,0.4)] hover:shadow-[0_0_30px_rgba(0,154,228,0.6)] transform hover:-translate-y-1"
                >
                  Initialize X-Ray Scan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/upload-audio"
                  className="inline-flex items-center px-8 py-4 glass-panel hover:bg-white/10 text-white font-bold rounded-full transition-all duration-300 hover:border-vignan-400/50 transform hover:-translate-y-1"
                >
                  Acoustic Anomaly Test
                  <Activity className="ml-2 h-5 w-5 text-accent-400" />
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 w-full max-w-6xl mt-16 px-4 relative z-10">
        <FeatureCard 
          icon={<Zap className="h-8 w-8 text-accent-400" />}
          title="Instant Radiography"
          description="Powered by state-of-the-art ResNet models to deliver structural X-Ray predictions within milliseconds."
          delay={0.1}
        />
        <FeatureCard 
          icon={<Activity className="h-8 w-8 text-vignan-400" />}
          title="Acoustic Intelligence"
          description="Transforms cough waveforms into deep Mel-Spectrogram features to pinpoint acoustic tissue abnormalities."
          delay={0.3}
        />
        <FeatureCard 
          icon={<ShieldCheck className="h-8 w-8 text-healthcare-400" />}
          title="Live AI Telemetry"
          description="A fully integrated Gemini LLM subsystem bridging remote web-RTC streams with predictive IoT vitals."
          delay={0.5}
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay }}
      whileHover={{ y: -10 }}
      className="glass-card p-8 rounded-3xl flex flex-col items-center text-center group"
    >
      <div className="bg-slate-900/50 p-4 rounded-2xl mb-6 border border-slate-700 group-hover:border-accent-500/50 transition-colors shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-accent-400 transition-colors">{title}</h3>
      <p className="text-slate-400 leading-relaxed font-light">{description}</p>
    </motion.div>
  );
}
