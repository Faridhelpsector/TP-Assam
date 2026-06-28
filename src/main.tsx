import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept and swallow harmless sandbox-related WebSocket and HMR connection error alerts
if (typeof window !== 'undefined') {
  const handleWSErrors = (event: ErrorEvent) => {
    const errorMsg = event?.message || '';
    if (errorMsg.includes('WebSocket') || errorMsg.includes('websocket') || errorMsg.includes('vite')) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleWSRejections = (event: PromiseRejectionEvent) => {
    const reason = event?.reason;
    const reasonStr = reason ? String(reason) : '';
    const reasonMsg = reason?.message || '';
    if (
      reasonStr.includes('WebSocket') ||
      reasonStr.includes('websocket') ||
      reasonStr.includes('ws://') ||
      reasonMsg.includes('WebSocket') ||
      reasonMsg.includes('websocket')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  window.addEventListener('error', handleWSErrors, true);
  window.addEventListener('unhandledrejection', handleWSRejections, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
