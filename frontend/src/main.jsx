import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// --- Storage Safety & Recovery Logic ---
const safeStorageClear = () => {
  try {
    localStorage.clear();
  } catch (e) {
    console.error("Storage blocked by browser security.", e);
  }
};

const safeGetItem = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
};

const safeSetItem = (key, val) => {
  try {
    localStorage.setItem(key, val);
  } catch (e) {
    // Fail silently
  }
};

// --- Domain Safety & Canonical Recovery ---
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && window.location.hostname !== 'lungwhisperer.netlify.app') {
  console.warn("Legacy domain detected. Redirecting to canonical host.");
  window.location.replace('https://lungwhisperer.netlify.app' + window.location.pathname);
}

// Version Migration Safeguard
if (safeGetItem('app_version') !== '2.1.8') {
  safeStorageClear();
  safeSetItem('app_version', '2.1.8');
}

try {
  const root = document.getElementById('root');
  if (!root) throw new Error("DOM Root '#root' not found.");
  
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (error) {
  console.error("Fatal System Initialization Error:", error);
  // Emergency fallback UI if React completely fails to mount
  document.body.innerHTML = `
    <div style="min-height: 100vh; background: #030712; color: white; display: flex; align-items: center; justify-content: center; font-family: sans-serif; text-align: center; padding: 20px;">
      <div>
        <h1 style="font-size: 24px; margin-bottom: 10px;">Neural Recovery Protocol Active</h1>
        <p style="color: #94a3b8; margin-bottom: 20px;">The system encountered a configuration conflict. Local state has been cleared.</p>
        <button onclick="window.location.reload()" style="background: linear-gradient(135deg, #06b6d4, #8b5cf6); border: none; padding: 12px 24px; color: white; font-weight: bold; border-radius: 12px; cursor: pointer;">Initialize System Reboot</button>
      </div>
    </div>
  `;
}
