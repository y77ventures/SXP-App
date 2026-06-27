// Profile — User profile page with role switcher
// Design: Aqua Clarity — avatar, stats, role-based sections

import { useState } from 'react';
import { Settings, ChevronRight, Star, Calendar, Users, Wallet, Shield, Bell, HelpCircle, LogOut, MapPin, Briefcase, Share2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useLocation } from 'wouter';
import AppLayout from '@/components/AppLayout';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import HealthWaiverModal from '@/components/HealthWaiverModal';
import CondoPoolClauseModal from '@/components/CondoPoolClauseModal';
import CoachAgreementModal from '@/components/CoachAgreementModal';

const LOGO_IMG = '/swimxp-logo-v3.png';

type Role = 'Parent' | 'Coach' | 'SwimSchool' | 'PoolHost';

const ROLE_MENU: Record<Role, { icon: React.ElementType; label: string; href: string }[]> = {
  Parent: [
    { icon: Calendar, label: 'My Lessons', href: '/schedule' },
    { icon: Users, label: 'My Children', href: '/profile' },
    { icon: Wallet, label: 'Payments & Wallet', href: '/wallet' },
    { icon: MapPin, label: 'Pool & Condo Registry', href: '/pool-registry' },
    { icon: Star, label: 'My Reviews', href: '/profile' },
  ],
  Coach: [
    { icon: Calendar, label: 'My Schedule', href: '/schedule' },
    { icon: Users, label: 'My Students', href: '/dashboard' },
    { icon: Briefcase, label: 'Jobs Bulletin Board', href: '/jobs' },
    { icon: Share2, label: 'Share My Link', href: '/share' },
    { icon: Wallet, label: 'Earnings', href: '/wallet' },
    { icon: Shield, label: 'Certifications', href: '/dashboard' },
  ],
  SwimSchool: [
    { icon: Calendar, label: 'School Scheduler', href: '/dashboard' },
    { icon: Users, label: 'Student Roster', href: '/dashboard' },
    { icon: Wallet, label: 'Revenue', href: '/wallet' },
    { icon: Star, label: 'School Profile', href: '/profile' },
  ],
  PoolHost: [
    { icon: Calendar, label: 'Pool Availability', href: '/schedule' },
    { icon: Users, label: 'Upcoming Bookings', href: '/schedule' },
    { icon: Wallet, label: 'Rental Earnings', href: '/wallet' },
    { icon: Home, label: 'Condo Pool Clause', href: '/profile' },
    { icon: Settings, label: 'Pool Settings', href: '/profile' },
  ],
};

export default function Profile() {
  const [, navigate] = useLocation();
  const [role, setRole] = useState<Role>('Parent');
  const [showWaiver, setShowWaiver] = useState(false);
  const [showCondoClause, setShowCondoClause] = useState(false);
  const [showCoachAgreement, setShowCoachAgreement] = useState(false);
  const [waiverSigned, setWaiverSigned] = useState(false);
  const [condoClauseSigned, setCondoClauseSigned] = useState(false);
  const [coachAgreementSigned, setCoachAgreementSigned] = useState(false);

  const menuItems = ROLE_MENU[role];

  return (
    <AppLayout>
      {/* Header */}
      <div className="bg-gradient-to-b from-[oklch(0.93_0.05_200)] to-white px-4 pt-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold font-display text-navy">Profile</h1>
          <button onClick={() => toast.info('Settings coming soon')} className="p-2 rounded-xl bg-white/60">
            <Settings size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Avatar + info */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-[oklch(0.72_0.13_200)] flex items-center justify-center shadow-lg shadow-[oklch(0.72_0.13_200)]/30">
              <span className="text-2xl font-bold text-white font-display">JL</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg font-display text-navy">Jennifer Lim</h2>
            <p className="text-sm text-muted-foreground">jennifer.lim@email.com</p>
            <div className="flex items-center gap-1 mt-1">
              <Badge className="bg-[oklch(0.72_0.13_200)] text-white border-0 text-xs">{role}</Badge>
              <Badge variant="outline" className="text-xs text-green-600 border-green-200">Verified</Badge>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: '12', label: 'Lessons' },
            { value: '2', label: 'Children' },
            { value: '4.9', label: 'Rating' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-3 text-center shadow-sm">
              <div className="text-xl font-bold font-display text-[oklch(0.72_0.13_200)]">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Role switcher */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Switch Role</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {(['Parent', 'Coach', 'SwimSchool', 'PoolHost'] as Role[]).map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  'flex-shrink-0 text-xs px-4 py-2 rounded-full font-semibold transition-all duration-200',
                  role === r
                    ? 'bg-[oklch(0.72_0.13_200)] text-white shadow-md shadow-[oklch(0.72_0.13_200)]/30'
                    : 'bg-[oklch(0.955_0.010_220)] text-muted-foreground'
                )}
              >
                {r === 'SwimSchool' ? 'Swim School' : r === 'PoolHost' ? 'Pool Host' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Role-specific menu */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{role} Dashboard</p>
          <div className="bg-white rounded-2xl border border-border/50 overflow-hidden">
            {menuItems.map((item, i) => (
              <Link key={item.label} href={item.href}>
                <button className={cn(
                  'w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[oklch(0.955_0.010_220)] transition-colors',
                  i < menuItems.length - 1 && 'border-b border-border/30'
                )}>
                  <div className="w-8 h-8 rounded-xl bg-[oklch(0.93_0.05_200)] flex items-center justify-center flex-shrink-0">
                    <item.icon size={15} className="text-[oklch(0.72_0.13_200)]" />
                  </div>
                  <span className="text-sm font-medium text-navy flex-1">{item.label}</span>
                  <ChevronRight size={14} className="text-muted-foreground" />
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Legal compliance section */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Legal &amp; Compliance</p>
          <div className="bg-white rounded-2xl border border-border/50 overflow-hidden">
            {[
              {
                icon: Shield,
                label: 'Health Declaration & Liability Waiver',
                sublabel: waiverSigned ? '✓ Signed' : 'Required for all users',
                action: () => setShowWaiver(true),
                signed: waiverSigned,
              },
              {
                icon: Home,
                label: 'Private Property & Condo Pool Clause',
                sublabel: condoClauseSigned ? '✓ Signed' : role === 'PoolHost' ? 'Required for Pool Hosts' : 'Required for condo bookings',
                action: () => setShowCondoClause(true),
                signed: condoClauseSigned,
              },
              ...(role === 'Coach' ? [{
                icon: Briefcase,
                label: 'Coach Professional Agreement',
                sublabel: coachAgreementSigned ? '✓ Signed' : 'Required for all coaches',
                action: () => setShowCoachAgreement(true),
                signed: coachAgreementSigned,
              }] : []),
            ].map((item, i, arr) => (
              <button
                key={item.label}
                onClick={item.action}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[oklch(0.955_0.010_220)] transition-colors',
                  i < arr.length - 1 && 'border-b border-border/30'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0',
                  item.signed ? 'bg-green-100' : 'bg-[oklch(0.93_0.05_200)]'
                )}>
                  <item.icon size={15} className={item.signed ? 'text-green-600' : 'text-[oklch(0.72_0.13_200)]'} />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-navy block">{item.label}</span>
                  <span className={cn('text-xs', item.signed ? 'text-green-600' : 'text-muted-foreground')}>{item.sublabel}</span>
                </div>
                <ChevronRight size={14} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Quick Access</p>
          <div className="bg-white rounded-2xl border border-border/50 overflow-hidden">
            {[
              { icon: Bell, label: 'Notifications', action: () => toast.info('Notifications coming soon') },
              { icon: HelpCircle, label: 'Help & Support', action: () => toast.info('Support coming soon') },
              { icon: LogOut, label: 'Sign Out', action: () => toast.info('Signed out') },
            ].map((item, i) => (
              <button
                key={item.label}
                onClick={item.action}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[oklch(0.955_0.010_220)] transition-colors',
                  i < 3 && 'border-b border-border/30'
                )}
              >
                <div className="w-8 h-8 rounded-xl bg-[oklch(0.955_0.010_220)] flex items-center justify-center flex-shrink-0">
                  <item.icon size={15} className="text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-navy flex-1">{item.label}</span>
                <ChevronRight size={14} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Admin link */}
        <Link href="/admin">
          <div className="bg-[oklch(0.22_0.06_240)] rounded-2xl p-4 flex items-center gap-3">
            <img
              src={LOGO_IMG}
              alt="SwimXP"
              className="h-14 w-auto object-contain"
              style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.15))' }}
            />
            <div className="flex-1">
              <p className="text-white font-semibold text-sm font-display">Admin Dashboard</p>
              <p className="text-white/60 text-xs">Platform analytics & management</p>
            </div>
            <ChevronRight size={16} className="text-white/60" />
          </div>
        </Link>

        <p className="text-center text-xs text-muted-foreground pb-2">SwimXP v1.0 · Singapore</p>
      </div>

      {/* Legal modals */}
      <HealthWaiverModal
        open={showWaiver}
        onAccept={(_sig: string) => { setWaiverSigned(true); setShowWaiver(false); }}
        onClose={() => setShowWaiver(false)}
        userName="Jennifer Lim"
      />
      <CondoPoolClauseModal
        open={showCondoClause}
        role={role === 'PoolHost' ? 'host' : 'client'}
        onAccept={() => { setCondoClauseSigned(true); setShowCondoClause(false); }}
        onClose={() => setShowCondoClause(false)}
      />
      <CoachAgreementModal
        open={showCoachAgreement}
        onAccept={(_sig: string) => { setCoachAgreementSigned(true); setShowCoachAgreement(false); }}
        onClose={() => setShowCoachAgreement(false)}
        coachName="Marcus Tan"
      />
    </AppLayout>
  );
}
