import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// --- Domain Safety & Cache Recovery ---
if (window.location.hostname === 'lung-whisperer.netlify.app' || window.location.hostname === 'respiracare.netlify.app') {
  window.location.replace('https://lungwhisperer.netlify.app' + window.location.pathname);
}
// Force reload on outdated version detection
if (localStorage.getItem('app_version') !== '2.1.0') {
  localStorage.clear();
  localStorage.setItem('app_version', '2.1.0');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
