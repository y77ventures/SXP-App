// AuthRedirect — Handles /login and /register public routes
// Redirects to the OAuth portal via getLoginUrl(). Shown as a brief loading state.

import { useEffect } from 'react';
import { getLoginUrl } from '@/const';
import { Waves } from 'lucide-react';

export default function AuthRedirect() {
  useEffect(() => {
    const t = setTimeout(() => {
      window.location.href = getLoginUrl();
    }, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[oklch(0.2_0.04_240)] text-white px-6 text-center">
      <Waves size={36} className="text-[oklch(0.85_0.12_195)] mb-4 animate-pulse" />
      <h1 className="text-xl font-extrabold font-display mb-1">Redirecting to secure login…</h1>
      <p className="text-white/70 text-sm">Please wait while we connect you to SwimXP.</p>
    </div>
  );
}
