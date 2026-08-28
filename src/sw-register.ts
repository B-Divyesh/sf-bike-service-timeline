export function registerServiceWorker(onUpdate: (registration: ServiceWorkerRegistration) => void): void {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return;
  const install = () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      if (registration.waiting) onUpdate(registration);
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) onUpdate(registration);
        });
      });
    }).catch(() => { /* The app remains fully usable without installation. */ });
  };
  if (document.readyState === 'complete') install();
  else window.addEventListener('load', install, { once: true });
}
