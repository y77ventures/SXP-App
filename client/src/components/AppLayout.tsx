// AppLayout — Mobile-first PWA shell with bottom tab navigation
// Design: Aqua Clarity — frosted glass bottom nav, safe area support

import { Link, useLocation } from 'wouter';
import { Home, Search, Heart, CalendarDays, User, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/_core/hooks/useAuth';

interface AppLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/explore', icon: Search, label: 'Explore' },
  { path: '/matches', icon: Heart, label: 'Matches' },
  { path: '/schedule', icon: CalendarDays, label: 'Schedule', authRequired: true },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function AppLayout({ children, hideNav = false }: AppLayoutProps) {
  const { isAuthenticated, user } = useAuth();
  const [location] = useLocation();

  const filteredNavItems = navItems.filter(item => {
    if (item.authRequired && !isAuthenticated) return false;
    // Hide schedule from students if preferred, but usually students also have a schedule.
    // However, the prompt says "Hide Schedule and Dashboard from students and public users"
    if (item.path === '/schedule' && user?.role === 'client') return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background max-w-md mx-auto relative">
      {/* Main content area */}
      <main className={cn('flex-1 overflow-y-auto', !hideNav && 'pb-20')}>
        {children}
      </main>

      {/* Bottom Tab Navigation */}
      {!hideNav && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
          <div
            className="bg-[oklch(0.965_0.012_220)]/95 backdrop-blur-xl border-t border-border/50 pb-safe"
            style={{ boxShadow: '0 -4px 24px rgba(0,0,0,0.08)' }}
          >
            <div className="flex items-center justify-around px-2 py-2">
              {filteredNavItems.map(({ path, icon: Icon, label }) => {
                const isActive = path === '/'
                  ? location === '/'
                  : location.startsWith(path);
                return (
                  <Link key={path} href={path}>
                    <button
                      className={cn(
                        'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200',
                        isActive
                          ? 'text-[oklch(0.72_0.13_200)]'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <div className={cn(
                        'p-1.5 rounded-xl transition-all duration-200',
                        isActive && 'bg-[oklch(0.93_0.05_200)]'
                      )}>
                        <Icon
                          size={20}
                          strokeWidth={isActive ? 2.5 : 1.8}
                          className={cn(isActive && 'text-[oklch(0.72_0.13_200)]')}
                        />
                      </div>
                      <span className={cn(
                        'text-[10px] font-medium leading-none',
                        isActive ? 'font-semibold' : 'font-normal'
                      )}>
                        {label}
                      </span>
                    </button>
                  </Link>
                );
              })}

              {/* Shop Gear — external storefront link */}
              <a
                href="https://systeme.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 text-muted-foreground hover:text-[oklch(0.72_0.13_200)] active:scale-95"
              >
                <div className="p-1.5 rounded-xl transition-all duration-200 hover:bg-[oklch(0.93_0.05_200)]">
                  <ShoppingBag size={20} strokeWidth={1.8} />
                </div>
                <span className="text-[10px] font-medium leading-none">Shop Gear</span>
              </a>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
