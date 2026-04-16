import { Link, useLocation } from 'react-router-dom';
import { Activity, UploadCloud, History, Info, Home, LayoutDashboard, PhoneCall, LogOut, Wind, Pill, Leaf, CloudSun, Mic } from 'lucide-react';
import { getCurrentUser } from '../api';
import brandLogo from '../assets/hero_logo.png';

function Navbar({ user, onLogout }) {
  const location = useLocation();
  const activeUser = user || getCurrentUser();

  let navLinks = [
    { name: 'Home', path: '/', icon: Home },
  ];

  if (activeUser) {
    if (activeUser.role === 'patient') {
      navLinks.push(
        { name: 'Dashboard', path: '/patient-dashboard', icon: LayoutDashboard },
        { name: 'X-Ray AI', path: '/upload', icon: UploadCloud },
        { name: 'Cough AI', path: '/upload-audio', icon: Mic },
        { name: 'Breathing', path: '/breathing', icon: Wind },
        { name: 'Meds', path: '/medications', icon: Pill },
        { name: 'Quit Smoking', path: '/quitsmoking', icon: Leaf },
        { name: 'Weather Impact', path: '/weather', icon: CloudSun },
        { name: 'History', path: '/history', icon: History }
      );
    } else {
      navLinks.push(
        { name: 'Admin Panel', path: '/doctor-panel', icon: LayoutDashboard },
        { name: 'Telemedicine', path: '/telemedicine', icon: PhoneCall },
        { name: 'History', path: '/history', icon: History }
      );
    }
  }

  navLinks.push({ name: 'About', path: '/about', icon: Info });

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center mt-2 w-full px-4 pointer-events-none">
      <nav
        className="rounded-full px-3 py-2 backdrop-blur-[40px] pointer-events-auto flex justify-between items-center w-full max-w-5xl"
        style={{
          background: 'rgba(5, 5, 5, 0.4)',
          border: 'none',
          boxShadow: '0 0 0 0.5px rgba(255,255,255,0.06), 0 20px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex justify-between items-center w-full h-12">
          {/* Typography Branding */}
          <Link to="/" className="flex items-center space-x-3 pl-3 group">
            <div className="hidden sm:block">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                  <span className="font-display font-black text-xl text-white tracking-tighter">
                    LUNG<span className="text-cyan-400 font-light">WHISPERER</span>
                  </span>
               </div>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  style={isActive ? {
                    background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.1))',
                    border: '1px solid rgba(6,182,212,0.25)',
                    boxShadow: '0 0 12px rgba(6,182,212,0.15)',
                  } : {
                    border: '1px solid transparent',
                  }}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-cyan-400' : ''}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User section */}
          <div className="flex items-center gap-2 pr-1">
            {activeUser && (
              <>
                <div
                  className="flex items-center rounded-xl py-1.5 px-3 gap-2.5"
                  style={{
                    background: 'rgba(3,7,18,0.6)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                      boxShadow: '0 0 12px rgba(6,182,212,0.4)',
                    }}
                  >
                    {(activeUser.full_name || activeUser.username) ? (activeUser.full_name || activeUser.username)[0].toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:block leading-none">
                    <div className="text-xs font-semibold text-white capitalize truncate max-w-[100px]">
                      {activeUser.role === 'doctor' ? 'Dr. ' : ''}{activeUser.full_name || activeUser.username}
                    </div>
                    <div className="text-[9px] text-cyan-500/70 uppercase tracking-wider font-mono mt-0.5">{activeUser.role}</div>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-white px-3 py-2 rounded-xl transition-all duration-200 hover:bg-rose-500/15"
                  style={{ border: '1px solid rgba(251,113,133,0.2)' }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
            {!activeUser && (
              <Link
                to="/login"
                className="btn-primary text-sm px-5 py-2"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                  borderRadius: '0.75rem',
                  padding: '0.5rem 1.25rem',
                }}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
