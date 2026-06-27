// AppLayout — Mobile-first PWA shell with bottom tab navigation
// Design: Aqua Clarity — frosted glass bottom nav, safe area support
// Navigation policy:
//   • Logged OUT (public): only Home, Become A Coach, Pricing, FAQ, Login.
//     Authenticated surfaces (Dashboard, Schedule, Messages, Matches, Analytics,
//     Payments, Notifications) are completely hidden.
//   • Logged IN: full in-app nav (Home, Explore, Matches, Schedule, Profile).

import { Link, useLocation } from 'wouter';
import { Home, Search, Heart, CalendarDays, User, Award, Tag, HelpCircle, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';

interface AppLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

// Public navigation — visible without login
const PUBLIC_NAV = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/coach-register', icon: Award, label: 'Coach' },
  { path: '/pricing', icon: Tag, label: 'Pricing' },
  { path: '/faq', icon: HelpCircle, label: 'FAQ' },
];

// Authenticated navigation — in-app surfaces
const PRIVATE_NAV = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/explore', icon: Search, label: 'Explore' },
  { path: '/matches', icon: Heart, label: 'Matches' },
  { path: '/schedule', icon: CalendarDays, label: 'Schedule' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function AppLayout({ children, hideNav = false }: AppLayoutProps) {
  const { isAuthenticated, loading } = useAuth();
  const [location] = useLocation();

  const navItems = isAuthenticated ? PRIVATE_NAV : PUBLIC_NAV;

  return (
    <div className="min-h-screen flex flex-col bg-background max-w-md mx-auto relative">
      <main className={cn('flex-1 overflow-y-auto', !hideNav && 'pb-20')}>
        {children}
      </main>

      {!hideNav && !loading && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
          <div
            className="bg-[oklch(0.965_0.012_220)]/95 backdrop-blur-xl border-t border-border/50 pb-safe"
            style={{ boxShadow: '0 -4px 24px rgba(0,0,0,0.08)' }}
          >
            <div className="flex items-center justify-around px-2 py-2">
              {navItems.map(({ path, icon: Icon, label }) => {
                const isActive = path === '/' ? location === '/' : location.startsWith(path);
                return (
                  <Link key={path} href={path}>
                    <button
                      className={cn(
                        'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200',
                        isActive ? 'text-[oklch(0.72_0.13_200)]' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <div className={cn('p-1.5 rounded-xl transition-all duration-200', isActive && 'bg-[oklch(0.93_0.05_200)]')}>
                        <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} className={cn(isActive && 'text-[oklch(0.72_0.13_200)]')} />
                      </div>
                      <span className={cn('text-[10px] font-medium leading-none', isActive ? 'font-semibold' : 'font-normal')}>
                        {label}
                      </span>
                    </button>
                  </Link>
                );
              })}

              {/* Login — public only */}
              {!isAuthenticated && (
                <button
                  onClick={() => { window.location.href = getLoginUrl(); }}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 text-muted-foreground hover:text-[oklch(0.72_0.13_200)] active:scale-95"
                >
                  <div className="p-1.5 rounded-xl transition-all duration-200 hover:bg-[oklch(0.93_0.05_200)]">
                    <LogIn size={20} strokeWidth={1.8} />
                  </div>
                  <span className="text-[10px] font-medium leading-none">Login</span>
                </button>
              )}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
