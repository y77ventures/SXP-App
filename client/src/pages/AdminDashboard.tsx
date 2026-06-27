// AdminDashboard — Platform-level analytics and management
// Design: Aqua Clarity — KPI cards, charts, verification queue, revenue

import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, CheckCircle2, XCircle, AlertCircle, TrendingUp, Users, Calendar, DollarSign, Shield, FileText, Clock, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/AppLayout';
import { coaches, adminStats } from '@/lib/mockData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LOGO_IMG = '/swimxp-logo-v3.png';

const revenueData = [
  { month: 'Jan', revenue: 8400 },
  { month: 'Feb', revenue: 9200 },
  { month: 'Mar', revenue: 11000 },
  { month: 'Apr', revenue: 10500 },
  { month: 'May', revenue: 13200 },
  { month: 'Jun', revenue: 15800 },
];

const pendingCoaches = coaches.filter(c => !c.verified).slice(0, 3);

// ── Cert date helpers ─────────────────────────────────────────────────────────
function daysUntilExpiry(dateStr?: string): number | null {
  if (!dateStr) return null;
  const expiry = new Date(dateStr);
  if (isNaN(expiry.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatExpiry(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });
}

function expiryBadgeProps(days: number | null): { label: string; className: string } {
  if (days === null) return { label: 'No date', className: 'bg-gray-100 text-gray-500' };
  if (days < 0) return { label: 'EXPIRED', className: 'bg-red-100 text-red-600 font-bold' };
  if (days <= 30) return { label: `${days}d left`, className: 'bg-amber-100 text-amber-700 font-bold' };
  return { label: `${days}d left`, className: 'bg-green-100 text-green-700' };
}

type AdminTab = 'overview' | 'coaches' | 'revenue' | 'compliance';

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [verifiedIds, setVerifiedIds] = useState<string[]>([]);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const platformRevenue = adminStats.monthlyRevenue;
  const _unused = platformRevenue;

  const handleVerify = (id: string, name: string) => {
    setVerifiedIds(prev => [...prev, id]);
    toast.success(`${name} verified!`, { icon: '✅' });
  };
  const handleReject = (id: string, name: string) => {
    setRejectedIds(prev => [...prev, id]);
    toast.error(`${name} rejected`, { icon: '❌' });
  };

  return (
    <AppLayout hideNav>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[oklch(0.965_0.012_220)]/95 backdrop-blur-xl border-b border-border/50">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate('/profile')} className="w-8 h-8 rounded-xl bg-[oklch(0.955_0.010_220)] flex items-center justify-center">
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-2">
              <img
                src={LOGO_IMG}
                alt="SwimXP"
                className="h-14 w-auto object-contain"
                style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.15))' }}
              />
              <div>
                <h1 className="text-base font-bold font-display text-navy leading-tight">Admin Dashboard</h1>
                <p className="text-[10px] text-muted-foreground">Platform Management</p>
              </div>
            </div>
          </div>
          <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
            {(['overview', 'coaches', 'revenue', 'compliance'] as AdminTab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition-all capitalize',
                  tab === t ? 'bg-[oklch(0.72_0.13_200)] text-white' : 'bg-[oklch(0.955_0.010_220)] text-muted-foreground'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 animate-fade-up">
        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Users', value: (adminStats.totalParents + adminStats.totalCoaches).toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Active Coaches', value: adminStats.totalCoaches, icon: Shield, color: 'text-[oklch(0.72_0.13_200)]', bg: 'bg-[oklch(0.93_0.05_200)]' },
                { label: 'Total Bookings', value: adminStats.totalBookings.toLocaleString(), icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Monthly Revenue', value: `$${adminStats.monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map(card => (
                <div key={card.label} className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-2', card.bg)}>
                    <card.icon size={18} className={card.color} />
                  </div>
                  <div className="text-xl font-bold font-display text-navy">{card.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{card.label}</div>
                </div>
              ))}
            </div>

            {/* Pending verifications */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={16} className="text-amber-600" />
                <h3 className="font-semibold text-sm font-display text-amber-800">
                  {pendingCoaches.length} Coaches Pending Verification
                </h3>
              </div>
              <div className="space-y-2">
                {pendingCoaches.slice(0, 2).map(coach => (
                  <div key={coach.id} className="flex items-center gap-2 bg-white rounded-xl p-2">
                    <img src={coach.photo} alt={coach.name} className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-xs font-medium text-navy flex-1">{coach.name}</span>
                    <button onClick={() => handleVerify(coach.id, coach.name)} className="text-xs text-green-600 font-semibold">Verify</button>
                    <button onClick={() => handleReject(coach.id, coach.name)} className="text-xs text-red-500 font-semibold ml-2">Reject</button>
                  </div>
                ))}
              </div>
              <button onClick={() => setTab('coaches')} className="text-xs text-amber-700 font-semibold mt-2">View all →</button>
            </div>

            {/* Platform health */}
            <div className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
              <h3 className="font-semibold text-sm font-display text-navy mb-3">Platform Health</h3>
              <div className="space-y-3">
                {[
                  { label: 'Coach Verification Rate', value: 78, color: 'bg-[oklch(0.72_0.13_200)]' },
                  { label: 'Lesson Completion Rate', value: 94, color: 'bg-green-500' },
                  { label: 'Parent Satisfaction', value: 96, color: 'bg-blue-500' },
                  { label: 'Pool Utilisation', value: 78, color: 'bg-amber-500' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                      <span className="text-xs font-semibold text-navy">{item.value}%</span>
                    </div>
                    <div className="h-1.5 bg-[oklch(0.92_0.005_220)] rounded-full">
                      <div className={cn('h-full rounded-full', item.color)} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COACHES VERIFICATION */}
        {tab === 'coaches' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">{coaches.length} coaches total · {pendingCoaches.length} pending</p>
            {coaches.slice(0, 10).map(coach => {
              const isVerified = coach.verified || verifiedIds.includes(coach.id);
              const isRejected = rejectedIds.includes(coach.id);
              return (
                <div key={coach.id} className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={coach.photo} alt={coach.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm font-display text-navy">{coach.name}</h3>
                      <p className="text-xs text-muted-foreground">{coach.experience} yrs · {coach.specialities[0]}</p>
                    </div>
                    {isVerified ? (
                      <Badge className="bg-green-50 text-green-600 border-0 text-xs">Verified</Badge>
                    ) : isRejected ? (
                      <Badge className="bg-red-50 text-red-500 border-0 text-xs">Rejected</Badge>
                    ) : (
                      <Badge className="bg-amber-50 text-amber-600 border-0 text-xs">Pending</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {coach.certifications.slice(0, 2).map(cert => (
                      <Badge key={cert} variant="outline" className="text-[10px]">{cert}</Badge>
                    ))}
                  </div>
                  {!isVerified && !isRejected && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 text-xs border-red-200 text-red-500 rounded-xl"
                        onClick={() => handleReject(coach.id, coach.name)}>
                        <XCircle size={12} className="mr-1" /> Reject
                      </Button>
                      <Button size="sm" className="flex-1 text-xs bg-green-500 text-white rounded-xl"
                        onClick={() => handleVerify(coach.id, coach.name)}>
                        <CheckCircle2 size={12} className="mr-1" /> Verify
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* REVENUE */}
        {tab === 'revenue' && (
          <div className="space-y-4">
            <div className="bg-[oklch(0.22_0.06_240)] rounded-2xl p-5 text-white">
              <p className="text-white/60 text-xs mb-1">Total Platform Revenue (YTD)</p>
              <div className="text-3xl font-extrabold font-display">${adminStats.monthlyRevenue.toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp size={14} className="text-[oklch(0.85_0.10_200)]" />
                <span className="text-[oklch(0.85_0.10_200)] text-sm font-semibold">+23% vs last month</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
              <h3 className="font-semibold text-sm font-display text-navy mb-4">Monthly Revenue</h3>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.76 0.14 192)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.76 0.14 192)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 220)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="oklch(0.76 0.14 192)" strokeWidth={2} fill="url(#revenueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Coach Payouts', value: '$42,800', change: '+18%' },
                { label: 'Pool Rentals', value: '$12,400', change: '+31%' },
                { label: 'Platform Fees', value: '$8,200', change: '+23%' },
                { label: 'Avg Lesson Value', value: '$78', change: '+5%' },
              ].map(item => (
                <div key={item.label} className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
                  <div className="text-lg font-bold font-display text-navy">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                  <div className="text-xs font-semibold text-green-600 mt-1">{item.change} MoM</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMPLIANCE */}
        {tab === 'compliance' && (
          <ComplianceTab
            verifiedIds={verifiedIds}
            onApprove={(id, name) => { setVerifiedIds(prev => [...prev, id]); toast.success(`${name}'s credentials approved!`, { icon: '✅' }); }}
            onReject={(id, name) => { setRejectedIds(prev => [...prev, id]); toast.error(`${name}'s credentials rejected`, { icon: '❌' }); }}
          />
        )}
      </div>
    </AppLayout>
  );
}

// ── ComplianceTab ─────────────────────────────────────────────────────────────
function ComplianceTab({
  verifiedIds,
  onApprove,
  onReject,
}: {
  verifiedIds: string[];
  onApprove: (id: string, name: string) => void;
  onReject: (id: string, name: string) => void;
}) {
  // Coaches with cert data
  const certCoaches = coaches.filter(c => c.coachingCertExpiry || c.lifesavingCertExpiry);

  // Expiring within 30 days (not yet expired)
  const expiringCoaches = certCoaches.filter(c => {
    const d1 = daysUntilExpiry(c.coachingCertExpiry);
    const d2 = daysUntilExpiry(c.lifesavingCertExpiry);
    const soonest = [d1, d2].filter((d): d is number => d !== null);
    if (!soonest.length) return false;
    const min = Math.min(...soonest);
    return min >= 0 && min <= 30;
  });

  // Expired
  const expiredCoaches = certCoaches.filter(c => {
    const d1 = daysUntilExpiry(c.coachingCertExpiry);
    const d2 = daysUntilExpiry(c.lifesavingCertExpiry);
    return (d1 !== null && d1 < 0) || (d2 !== null && d2 < 0);
  });

  // Pending review
  const pendingReview = certCoaches.filter(c => c.certStatus === 'pending_review' && !verifiedIds.includes(c.id));

  return (
    <div className="space-y-5">
      {/* Summary KPI row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Expiring ≤30d', value: expiringCoaches.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Expired', value: expiredCoaches.length, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Pending Review', value: pendingReview.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-border/50 p-3 shadow-sm text-center">
            <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-1.5', k.bg)}>
              <k.icon size={15} className={k.color} />
            </div>
            <div className="text-xl font-extrabold font-display text-navy">{k.value}</div>
            <div className="text-[10px] text-muted-foreground leading-tight">{k.label}</div>
          </div>
        ))}
      </div>

      {/* 30-day expiry alert banner */}
      {expiringCoaches.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell size={15} className="text-amber-600" />
            <h3 className="font-bold text-sm text-amber-800">
              {expiringCoaches.length} Coach{expiringCoaches.length > 1 ? 'es' : ''} — Expiring Within 30 Days
            </h3>
          </div>
          <div className="space-y-2">
            {expiringCoaches.map(c => {
              const d1 = daysUntilExpiry(c.coachingCertExpiry);
              const d2 = daysUntilExpiry(c.lifesavingCertExpiry);
              const soonest = [d1, d2].filter((d): d is number => d !== null);
              const min = Math.min(...soonest);
              return (
                <div key={c.id} className="flex items-center gap-3 bg-white rounded-xl p-2.5">
                  <img src={c.photo} alt={c.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-navy truncate">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground">{c.location}</p>
                  </div>
                  <span className={cn('text-[10px] px-2 py-1 rounded-full font-bold', min <= 7 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700')}>
                    {min}d left
                  </span>
                  <button
                    onClick={() => toast.success(`Renewal reminder sent to ${c.name}!`, { icon: '📧' })}
                    className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-lg hover:bg-amber-200 transition-colors flex-shrink-0"
                  >
                    Remind
                  </button>
                </div>
              );
            })}
          </div>
          <Button
            size="sm"
            className="mt-3 w-full bg-amber-500 hover:bg-amber-600 text-white text-xs rounded-xl"
            onClick={() => toast.success(`Renewal reminders sent to all ${expiringCoaches.length} coaches!`, { icon: '📧' })}
          >
            Send All Renewal Reminders
          </Button>
        </div>
      )}

      {/* Expired certs alert */}
      {expiredCoaches.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={15} className="text-red-500" />
            <h3 className="font-bold text-sm text-red-700">
              {expiredCoaches.length} Coach{expiredCoaches.length > 1 ? 'es' : ''} — Expired Certifications
            </h3>
          </div>
          <p className="text-xs text-red-600 mb-3">These coaches are blocked from new bookings until credentials are renewed and re-approved.</p>
          <div className="space-y-2">
            {expiredCoaches.map(c => (
              <div key={c.id} className="flex items-center gap-3 bg-white rounded-xl p-2.5 border border-red-100">
                <img src={c.photo} alt={c.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-navy truncate">{c.name}</p>
                  <p className="text-[10px] text-red-500">Coaching: {formatExpiry(c.coachingCertExpiry)} · Lifesaving: {formatExpiry(c.lifesavingCertExpiry)}</p>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full font-bold bg-red-100 text-red-600">EXPIRED</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending credential review */}
      {pendingReview.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-sm font-display text-navy flex items-center gap-2">
            <FileText size={14} className="text-blue-600" />
            Pending Credential Review ({pendingReview.length})
          </h3>
          {pendingReview.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <img src={c.photo} alt={c.name} className="w-11 h-11 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-navy">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.location} · {c.experience} yrs exp</p>
                </div>
                <Badge className="bg-blue-50 text-blue-600 border-0 text-[10px]">Pending Review</Badge>
              </div>
              <div className="space-y-2 mb-3">
                <CertRow label="Coaching Cert" certType={c.coachingCertType} expiry={c.coachingCertExpiry} proofUploaded={c.proofUploaded} />
                <CertRow label="Lifesaving Cert" certType={c.lifesavingCertType} expiry={c.lifesavingCertExpiry} proofUploaded={c.proofUploaded} />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs border-red-200 text-red-500 rounded-xl" onClick={() => onReject(c.id, c.name)}>
                  <XCircle size={12} className="mr-1" /> Reject
                </Button>
                <Button size="sm" className="flex-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-xl" onClick={() => onApprove(c.id, c.name)}>
                  <CheckCircle2 size={12} className="mr-1" /> Approve Credentials
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All coaches cert status table */}
      <div>
        <h3 className="font-bold text-sm font-display text-navy mb-3 flex items-center gap-2">
          <Shield size={14} className="text-[oklch(0.72_0.13_200)]" />
          All Coach Certification Status
        </h3>
        <div className="space-y-2">
          {certCoaches.map(c => {
            const d1 = daysUntilExpiry(c.coachingCertExpiry);
            const d2 = daysUntilExpiry(c.lifesavingCertExpiry);
            const isApproved = c.certStatus === 'approved' || verifiedIds.includes(c.id);
            const isExpired = (d1 !== null && d1 < 0) || (d2 !== null && d2 < 0);
            const isExpiring = !isExpired && [d1, d2].some(d => d !== null && d >= 0 && d <= 30);
            return (
              <div key={c.id} className={cn('bg-white rounded-2xl border p-3 shadow-sm', isExpired ? 'border-red-200' : isExpiring ? 'border-amber-200' : 'border-border/50')}>
                <div className="flex items-center gap-2.5 mb-2">
                  <img src={c.photo} alt={c.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-navy truncate">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground">{c.location}</p>
                  </div>
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-semibold',
                    isExpired ? 'bg-red-100 text-red-600' :
                    isExpiring ? 'bg-amber-100 text-amber-700' :
                    isApproved ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-600'
                  )}>
                    {isExpired ? 'Expired' : isExpiring ? 'Expiring Soon' : isApproved ? 'Active' : 'Pending'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <CertMiniRow label="Coaching" expiry={c.coachingCertExpiry} days={d1} />
                  <CertMiniRow label="Lifesaving" expiry={c.lifesavingCertExpiry} days={d2} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Static compliance overview */}
      <div className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
        <h3 className="font-semibold text-sm font-display text-navy mb-3">Platform Compliance Overview</h3>
        <div className="space-y-3">
          {[
            { label: 'Waivers Signed', value: '1,189', status: 'good' },
            { label: 'Background Checks Completed', value: '89/89', status: 'good' },
            { label: 'Pending Insurance Docs', value: '2 pools', status: 'warning' },
            { label: 'PDPA Compliance', value: 'Compliant', status: 'good' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <span className="text-sm text-foreground">{item.label}</span>
              <div className="flex items-center gap-1.5">
                {item.status === 'good' ? <CheckCircle2 size={14} className="text-green-500" /> : <AlertCircle size={14} className="text-amber-500" />}
                <span className={cn('text-xs font-semibold', item.status === 'good' ? 'text-green-600' : 'text-amber-600')}>{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CertRow({ label, certType, expiry, proofUploaded }: { label: string; certType?: string; expiry?: string; proofUploaded?: boolean; }) {
  const days = daysUntilExpiry(expiry);
  const badge = expiryBadgeProps(days);
  return (
    <div className="flex items-start gap-2 bg-[oklch(0.955_0.010_220)] rounded-xl p-2.5">
      <FileText size={13} className="text-muted-foreground flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-navy">{label}</p>
        <p className="text-[10px] text-muted-foreground truncate">{certType ?? '—'}</p>
        <p className="text-[10px] text-muted-foreground">Expires: {formatExpiry(expiry)}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full', badge.className)}>{badge.label}</span>
        {proofUploaded && <span className="text-[10px] text-green-600 flex items-center gap-0.5"><CheckCircle2 size={9} /> Proof</span>}
      </div>
    </div>
  );
}

function CertMiniRow({ label, expiry, days }: { label: string; expiry?: string; days: number | null; }) {
  const badge = expiryBadgeProps(days);
  return (
    <div className="bg-[oklch(0.955_0.010_220)] rounded-lg p-2">
      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-[10px] font-semibold text-navy">{formatExpiry(expiry)}</p>
      <span className={cn('text-[9px] px-1.5 py-0.5 rounded-full inline-block mt-0.5', badge.className)}>{badge.label}</span>
    </div>
  );
}
