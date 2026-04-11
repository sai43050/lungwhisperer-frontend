import { Link, useLocation } from 'react-router-dom';
import { Activity, UploadCloud, History, Info, Home, LayoutDashboard, PhoneCall, LogOut, Wind, Pill, Leaf, CloudSun } from 'lucide-react';

function Navbar({ user, onLogout }) {
  const location = useLocation();

  let navLinks = [
    { name: 'Home', path: '/', icon: Home },
  ];

  if (user) {
    if (user.role === 'patient') {
      navLinks.push(
        { name: 'Dashboard', path: '/patient-dashboard', icon: LayoutDashboard },
        { name: 'Breathing', path: '/breathing', icon: Wind },
        { name: 'Quit Smoking', path: '/quitsmoking', icon: Leaf },
        { name: 'Meds', path: '/medications', icon: Pill },
        { name: 'Weather', path: '/weather', icon: CloudSun },
        { name: 'Analysis', path: '/upload', icon: UploadCloud },
        { name: 'Scan History', path: '/history', icon: History }
      );
    } else {
      navLinks.push(
        { name: 'Admin Panel', path: '/doctor-panel', icon: LayoutDashboard },
        { name: 'Telemedicine', path: '/telemedicine', icon: PhoneCall },
        { name: 'Recent History', path: '/history', icon: History }
      );
    }
  }

  navLinks.push({ name: 'About', path: '/about', icon: Info });

  return (
    <div className="pt-4 px-4 sm:px-8 max-w-7xl mx-auto fixed top-0 w-full z-50">
      <nav className="glass-panel rounded-full px-4 py-2 border border-vignan-500/20 shadow-lg shadow-vignan-900/50 backdrop-blur-md bg-vignan-900/60">
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="flex items-center space-x-3 pl-2 group">
            <div className="bg-accent-500/20 p-2 rounded-full border border-accent-400/30 group-hover:bg-accent-500/40 transition-all shadow-[0_0_15px_rgba(0,154,228,0.3)] group-hover:shadow-[0_0_20px_rgba(0,154,228,0.6)] animate-pulse-slow">
              <Activity className="h-5 w-5 text-accent-400" />
            </div>
            <span className="font-display font-bold text-xl text-white hidden sm:block tracking-wide">Lung Whisperer <span className="text-accent-400">AI</span></span>
          </Link>
          
          <div className="hidden md:flex space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-vignan-700/80 text-white border border-vignan-500/50 shadow-md shadow-vignan-900/30'
                      : 'text-slate-300 hover:text-white hover:bg-vignan-800/60 border border-transparent hover:border-vignan-600/30'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3 pr-2">
            {user && (
              <>
                <div className="flex items-center bg-vignan-800/80 rounded-full py-1 px-3 border border-vignan-600/50 shadow-inner">
                  <span className="text-sm font-medium text-slate-200 capitalize mr-2">
                    {user.role === 'doctor' ? 'Dr. ' : ''}{user.username}
                  </span>
                  <div className="h-7 w-7 rounded-full bg-accent-500 flex items-center justify-center text-white font-bold border-2 border-vignan-900 shadow-[0_0_10px_rgba(0,154,228,0.5)]">
                    {user.username ? user.username[0].toUpperCase() : 'U'}
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-pink-400 hover:text-white bg-pink-500/10 hover:bg-pink-600 border border-pink-500/20 hover:border-pink-500 px-4 py-1.5 rounded-full transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
            {!user && (
              <Link to="/login" className="text-sm font-bold text-white bg-gradient-to-r from-accent-500 to-vignan-500 hover:from-accent-400 hover:to-vignan-400 px-6 py-2 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(0,154,228,0.4)] hover:shadow-[0_0_20px_rgba(0,154,228,0.6)] border border-accent-400/50">
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
