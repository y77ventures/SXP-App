// PWAInstallPrompt — Modern mobile install banner for SwimXP Connect
// Detects iOS / Android, shows native-feeling "Add to Home Screen" prompt
// Auto-dismisses after 10 seconds; persists dismissal in localStorage for 7 days

import { useState, useEffect } from 'react';
import { X, Download, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LOGO_IMG = '/swimxp-logo-v3.png';
const DISMISS_KEY = 'swimxp-pwa-prompt-dismissed';
const DISMISS_DAYS = 7;

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isAndroid() {
  return /android/i.test(navigator.userAgent);
}

function isInStandaloneMode() {
  return (
    ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true) ||
    window.matchMedia('(display-mode: standalone)').matches
  );
}

function wasDismissedRecently(): boolean {
  const ts = localStorage.getItem(DISMISS_KEY);
  if (!ts) return false;
  const elapsed = Date.now() - parseInt(ts, 10);
  return elapsed < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

export default function PWAInstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Don't show if already installed or dismissed recently
    if (isInStandaloneMode() || wasDismissedRecently()) return;

    const ios = isIOS();
    const android = isAndroid();

    if (!ios && !android) return; // Desktop — skip

    if (ios) {
      setPlatform('ios');
      // Delay 3s for page to settle
      const t = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(t);
    }

    // Android — listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPlatform('android');
      const t = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(t);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setVisible(false);
        localStorage.setItem(DISMISS_KEY, Date.now().toString());
      }
      setDeferredPrompt(null);
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-20 left-3 right-3 z-[9999] animate-slide-up"
      role="dialog"
      aria-label="Install SwimXP app"
    >
      <div
        className="relative rounded-2xl shadow-2xl overflow-hidden"
        style={{
          background: 'oklch(0.18 0.05 230)',
          border: '1px solid oklch(0.72 0.13 200 / 40%)',
        }}
      >
        {/* Top gradient accent */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, oklch(0.72 0.13 200), oklch(0.55 0.18 250))' }}
        />

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* App icon */}
            <div
              className="w-14 h-14 rounded-2xl flex-shrink-0 overflow-hidden flex items-center justify-center"
              style={{ background: 'oklch(0.965 0.012 220)' }}
            >
              <img src={LOGO_IMG} alt="SwimXP" className="w-12 h-12 object-contain" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-sm font-display leading-tight">
                Install SwimXP
              </h3>
              <p className="text-white/60 text-xs mt-0.5 leading-relaxed">
                Add to your home screen for instant access — no app store needed.
              </p>
            </div>

            {/* Dismiss */}
            <button
              onClick={handleDismiss}
              className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 -mt-0.5"
              aria-label="Dismiss"
            >
              <X size={13} className="text-white/70" />
            </button>
          </div>

          {/* Platform-specific instructions */}
          {platform === 'ios' ? (
            <div
              className="mt-3 rounded-xl p-3 flex items-start gap-2"
              style={{ background: 'oklch(0.25 0.06 230)' }}
            >
              <Share size={15} className="text-[oklch(0.72_0.13_200)] flex-shrink-0 mt-0.5" />
              <p className="text-white/80 text-xs leading-relaxed">
                Tap the <strong className="text-white">Share</strong> button in Safari, then select{' '}
                <strong className="text-white">"Add to Home Screen"</strong> to install SwimXP.
              </p>
            </div>
          ) : (
            <div className="mt-3 flex gap-2">
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="flex-1 h-9 text-white/60 hover:text-white hover:bg-white/10 rounded-xl text-xs"
              >
                Not now
              </Button>
              <Button
                onClick={handleInstall}
                size="sm"
                className="flex-1 h-9 rounded-xl text-xs font-semibold"
                style={{ background: 'oklch(0.72 0.13 200)', color: 'white' }}
              >
                <Download size={13} className="mr-1.5" />
                Install App
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
