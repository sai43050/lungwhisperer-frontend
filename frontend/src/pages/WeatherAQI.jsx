import React, { useState, useEffect } from 'react';
import { Cloud, Sun, Droplets, Wind, Eye, Thermometer, AlertCircle, CheckCircle2, MapPin, Loader2, Navigation } from 'lucide-react';

const WeatherAQI = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('Sathupalli, Telangana');
  const [manualKey, setManualKey] = useState(localStorage.getItem('weather_api_key') || '');

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || manualKey;

  const fetchWeather = async (query) => {
    if (!API_KEY) {
      setLoading(false);
      return;
    }

    try {
      const resp = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}&aqi=yes`);
      if (!resp.ok) throw new Error("API Key might be invalid or expired.");
      const json = await resp.json();
      setData(json);
      setLocation(`${json.location.name}, ${json.location.region}`);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleManualKeySubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('weather_api_key', manualKey);
    setLoading(true);
    fetchWeather(location);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latLon = `${position.coords.latitude},${position.coords.longitude}`;
          fetchWeather(latLon);
        },
        (err) => {
          console.warn("Location access denied or unavailable:", err);
          fetchWeather('Sathupalli'); // Fallback to Sathupalli
        }
      );
    } else {
      fetchWeather('Sathupalli');
    }
  }, []);

  if (!API_KEY && !loading) {
    return (
      <div className="space-y-6 pt-4 max-w-4xl mx-auto pb-24 relative z-10">
        <div className="glass-panel p-10 rounded-[2.5rem] border border-vignan-500/20 text-center">
          <div className="bg-accent-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-accent-500/30">
            <ShieldCheck className="text-accent-400" size={32} />
          </div>
          <h2 className="text-2xl font-display font-black text-white mb-2">Real-Time Connectivity</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">To fetch accurate weather and AQI data for your location, please provide a free API key from WeatherAPI.com.</p>
          <form onSubmit={handleManualKeySubmit} className="flex gap-3 max-w-md mx-auto">
            <input 
              type="text" 
              placeholder="Enter WeatherAPI.com Key" 
              value={manualKey}
              onChange={(e) => setManualKey(e.target.value)}
              className="flex-grow bg-black/40 border border-vignan-500/30 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-accent-400 outline-none"
            />
            <button type="submit" className="px-6 py-2 bg-accent-500 text-white rounded-xl font-bold hover:bg-accent-400 transition-all">Enable</button>
          </form>
          <p className="mt-6 text-[10px] text-slate-500 uppercase tracking-widest font-black">Secure • Client-side only • No server storage</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-white space-y-4">
        <Loader2 className="animate-spin text-accent-400" size={48} />
        <p className="font-display font-bold animate-pulse">Requesting Location & Telemetry...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="glass-panel p-10 rounded-[2.5rem] border border-red-500/20 text-center max-w-2xl mx-auto mt-10">
        <div className="bg-red-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
          <AlertCircle className="text-red-400" size={32} />
        </div>
        <h2 className="text-2xl font-display font-black text-white mb-2">Configuration Error</h2>
        <p className="text-slate-400 text-sm mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-vignan-600 text-white rounded-xl font-bold hover:bg-vignan-500 transition-all">Retry Connection</button>
      </div>
    );
  }

  const current = data.current;
  const aqi = current.air_quality;
  const usEpa = aqi['us-epa-index'];

  const getAqiConfig = (idx) => {
    if (idx <= 2) return { label: 'Good', color: 'text-emerald-400', bg: 'bg-emerald-500/20', desc: 'Air quality is satisfactory, and air pollution poses little or no risk.', sev: 'low' };
    if (idx <= 4) return { label: 'Moderate', color: 'text-vignan-300', bg: 'bg-vignan-500/20', desc: 'Moderate air quality. Sensitive groups should limit outdoor activity.', sev: 'mod' };
    return { label: 'Unhealthy', color: 'text-rose-400', bg: 'bg-rose-500/20', desc: 'Health alert: everyone may experience health effects. Avoid outdoors.', sev: 'high' };
  };

  const aqiConfig = getAqiConfig(usEpa);

  return (
    <div className="space-y-6 pt-4 max-w-4xl mx-auto pb-24 relative z-10">
      <div className="glass-panel p-8 rounded-[2.5rem] border border-vignan-500/20 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-display font-black text-white tracking-tight">Weather <span className="text-accent-400">& AQI</span></h1>
            <p className="text-vignan-200 text-sm font-light mt-1 uppercase tracking-widest opacity-80">Live Environmental Health Intelligence</p>
          </div>
          <div className="bg-black/40 px-6 py-4 rounded-3xl border border-white/5 flex items-center gap-4 group">
            <div className={`w-3 h-3 rounded-full ${aqiConfig.bg.replace('/20', '')} animate-pulse shadow-[0_0_10px_currentColor]`}></div>
            <div>
               <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black flex items-center gap-1">
                 <MapPin size={10} className="text-accent-400" /> Current Geo-Location
               </div>
               <div className="text-sm font-bold text-white group-hover:text-accent-400 transition-colors">{location}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-8 rounded-[2rem] text-center border-white/5 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img src={current.condition.icon} alt={current.condition.text} className="w-24 h-24 mx-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
              <div className="text-6xl font-display font-black text-white">{Math.round(current.temp_c)}°C</div>
              <div className="text-accent-400 font-bold mt-2 uppercase tracking-widest text-sm">{current.condition.text}</div>
              
              <div className="mt-8 grid grid-cols-2 gap-3">
                 <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                    <Droplets className="mx-auto mb-2 text-blue-400" size={18} />
                    <div className="text-lg font-bold">{current.humidity}%</div>
                    <div className="text-[10px] text-slate-500 font-black">Humidity</div>
                 </div>
                 <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                    <Wind className="mx-auto mb-2 text-vignan-300" size={18} />
                    <div className="text-lg font-bold">{current.wind_kph} <span className="text-[10px]">km/h</span></div>
                    <div className="text-[10px] text-slate-500 font-black">Wind</div>
                 </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-8 rounded-[2rem] border-white/5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-display font-bold text-white">Air Quality Index</h3>
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${aqiConfig.bg} ${aqiConfig.color} border border-current/20`}>US-EPA: {usEpa}</span>
              </div>
              
              <div className="relative h-4 bg-slate-800 rounded-full mb-10 flex overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '20%' }} />
                <div className="h-full bg-vignan-300" style={{ width: '20%' }} />
                <div className="h-full bg-amber-500" style={{ width: '20%' }} />
                <div className="h-full bg-rose-500" style={{ width: '20%' }} />
                <div className="h-full bg-purple-600" style={{ width: '20%' }} />
                <div className={`absolute top-1/2 -ml-1 -mt-4 w-2 h-12 bg-white rounded-full border-4 border-slate-900 shadow-xl transition-all duration-1000`} style={{ left: `${(usEpa / 6) * 100}%` }} />
              </div>

              <div className="flex justify-between text-[10px] text-slate-500 font-black uppercase tracking-widest mb-10">
                <span>Good</span><span>Moderate</span><span>Unhealthy</span><span>Hazardous</span>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-display font-bold text-white flex items-center gap-2">
                  <Navigation size={18} className="text-accent-400" /> Respiratory Impact Assessment
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-5 rounded-2xl border ${current.temp_c > 35 ? 'bg-red-500/10 border-red-500/20' : 'bg-vignan-900/40 border-vignan-500/10'}`}>
                    <div className="font-bold text-white text-sm mb-1">Temperature Analysis</div>
                    <p className="text-xs font-light text-slate-400 leading-relaxed">{current.temp_c}°C suggests {current.temp_c > 30 ? 'potential respiratory stress. Keep hydrated.' : 'normal thermal conditions.'}</p>
                  </div>
                  <div className={`p-5 rounded-2xl border ${aqiConfig.bg} border-white/5`}>
                    <div className="font-bold text-white text-sm mb-1">AQI Advisory</div>
                    <p className="text-xs font-light text-slate-400 leading-relaxed">{aqiConfig.desc}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
               {[
                 { label: 'PM2.5', val: Math.round(aqi.pm2_5), unit: 'µg/m³' },
                 { label: 'CO', val: Math.round(aqi.co), unit: 'µg/m³' },
                 { label: 'NO₂', val: Math.round(aqi.no2), unit: 'µg/m³' }
               ].map((p, i) => (
                 <div key={i} className="bg-black/20 p-4 rounded-2xl border border-white/5 text-center">
                    <div className="text-lg font-bold text-white">{p.val}</div>
                    <div className="text-[9px] text-slate-500 font-black uppercase">{p.label} <span className="lowercase font-normal">({p.unit})</span></div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherAQI;
