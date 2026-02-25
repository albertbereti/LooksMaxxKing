import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// KILL SWITCH: Force unregister any rogue Service Workers and clear all caches
if ('serviceWorker' in navigator) {
  // Unregister all service workers
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      console.log('KILL SWITCH: Unregistering service worker:', registration.scope);
      registration.unregister().then(() => {
        console.log('KILL SWITCH: Successfully unregistered');
      });
    }
  });

  // Clear all caches
  if ('caches' in window) {
    caches.keys().then(function (cacheNames) {
      cacheNames.forEach(function (cacheName) {
        console.log('KILL SWITCH: Deleting cache:', cacheName);
        caches.delete(cacheName);
      });
    });
  }
}

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
