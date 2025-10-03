'use client';

import { useEffect } from 'react';

export function ServiceWorkerManager() {
  useEffect(() => {
    // Unregister any existing service workers on client side only
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister().then(function(boolean) {
            console.log('Service worker unregistered:', boolean);
          });
        }
      });
    }
  }, []);

  return null;
}