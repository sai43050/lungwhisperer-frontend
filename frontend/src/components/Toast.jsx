import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, Bell } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ message, type, onClose }) => {
  const config = {
    success: { icon: CheckCircle, bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    error: { icon: AlertCircle, bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400' },
    info: { icon: Info, bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' },
    warning: { icon: Bell, bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
  };

  const { icon: Icon, bg, border, text } = config[type] || config.info;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.9 }}
      className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl border ${bg} ${border} backdrop-blur-xl shadow-2xl min-w-[300px] max-w-[400px]`}
    >
      <div className={`p-2 rounded-xl bg-black/20 ${text}`}>
        <Icon size={20} />
      </div>
      <div className="flex-grow">
        <p className={`text-sm font-medium ${text}`}>{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1.5 rounded-lg hover:bg-black/10 text-slate-500 transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};
