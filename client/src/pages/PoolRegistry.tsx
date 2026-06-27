// PoolRegistry — Dynamic Public Pool & Condo Registry
// Lead generation: 50 Singapore locations, no-coach detection, waitlist/email capture banner

import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search, MapPin, ChevronLeft, Users, Bell, CheckCircle2,
  Waves, Filter, ChevronRight
} from 'lucide-react';
import { poolRegistry, regionColors, typeIcons, PoolRegion } from '@/lib/poolRegistry';
import { toast } from 'sonner';
import SEOHead, { SEO_PAGES } from '@/components/SEOHead';

const REGIONS: PoolRegion[] = ['North', 'South', 'East', 'West', 'Central'];

export default function PoolRegistry() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<PoolRegion | 'All'>('All');
  const [waitlistEmail, setWaitlistEmail] = useState<Record<string, string>>({});
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [activeWaitlist, setActiveWaitlist] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return poolRegistry.filter(p => {
      const matchRegion = region === 'All' || p.region === region;
      const matchQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.address.toLowerCase().includes(query.toLowerCase()) ||
        p.landmark.toLowerCase().includes(query.toLowerCase());
      return matchRegion && matchQuery;
    });
  }, [query, region]);

  const noCoachCount = filtered.filter(p => !p.hasActiveCoach).length;
  const activeCount = filtered.filter(p => p.hasActiveCoach).length;

  const handleJoinWaitlist = (poolId: string, poolName: string) => {
    const email = waitlistEmail[poolId] || '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    setJoined(prev => { const next = new Set(prev); next.add(poolId); return next; });
    setActiveWaitlist(null);
    toast.success(`You're on the waitlist for ${poolName}!`, {
      description: "We'll notify you the moment a certified coach opens slots there.",
    });
  };

  return (
    <AppLayout>
      <SEOHead {...SEO_PAGES.pools} />
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[oklch(0.965_0.012_220)] border-b border-border/50">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate('/')} className="w-8 h-8 rounded-xl bg-[oklch(0.955_0.010_220)] flex items-center justify-center">
              <ChevronLeft size={16} />
            </button>
            <div>
              <h1 className="text-lg font-bold font-display" style={{ color: 'oklch(0.22 0.06 240)' }}>
                Pool &amp; Condo Registry
              </h1>
              <p className="text-xs text-muted-foreground">50 locations across Singapore</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-2">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search pool, condo, or area..."
              className="pl-9 rounded-xl bg-white border-border/60 text-sm"
            />
          </div>

          {/* Region filter */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
            {(['All', ...REGIONS] as const).map(r => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                  region === r
                    ? 'bg-[oklch(0.72_0.13_200)] text-white'
                    : 'bg-[oklch(0.955_0.010_220)] text-muted-foreground'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3 pb-24">
        {/* Browse by Region — deep links to /pools/:region */}
        <div className="mb-1">
          <h2 className="text-sm font-bold font-display text-navy mb-2 flex items-center gap-2">
            <MapPin size={14} className="text-[oklch(0.55_0.14_200)]" />
            Browse by Region
          </h2>
          <div className="grid grid-cols-5 gap-1.5">
            {([
              { key: 'central', label: 'Central', emoji: '🏙️', color: 'oklch(0.42 0.14 200)' },
              { key: 'north',   label: 'North',   emoji: '🌿', color: 'oklch(0.42 0.18 150)' },
              { key: 'south',   label: 'South',   emoji: '⚓', color: 'oklch(0.42 0.18 240)' },
              { key: 'east',    label: 'East',    emoji: '🌅', color: 'oklch(0.50 0.18 50)'  },
              { key: 'west',    label: 'West',    emoji: '🌆', color: 'oklch(0.42 0.18 300)' },
            ] as const).map(r => (
              <button
                key={r.key}
                onClick={() => navigate(`/pools/${r.key}`)}
                className="flex flex-col items-center gap-1 rounded-2xl py-2.5 px-1 border border-border/40 bg-white hover:shadow-md transition-all active:scale-95"
              >
                <span className="text-xl">{r.emoji}</span>
                <span className="text-[10px] font-semibold" style={{ color: r.color }}>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[oklch(0.93_0.05_200)] rounded-xl p-3 text-center">
            <div className="text-xl font-bold font-display text-[oklch(0.42_0.14_200)]">{activeCount}</div>
            <div className="text-xs text-[oklch(0.52_0.14_200)]">Pools with Coaches</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <div className="text-xl font-bold font-display text-amber-700">{noCoachCount}</div>
            <div className="text-xs text-amber-600">Waiting for Coaches</div>
          </div>
        </div>

        {/* Pool list */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Waves size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No pools found for "{query}"</p>
          </div>
        ) : (
          filtered.map(pool => (
            <div key={pool.id} className="bg-white rounded-2xl border border-border/50 overflow-hidden shadow-sm">
              {/* Pool header */}
              <div className="px-4 pt-3 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-base">{typeIcons[pool.type]}</span>
                      <h3 className="font-semibold text-sm font-display text-foreground leading-tight truncate">
                        {pool.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin size={11} />
                      <span className="truncate">{pool.address} · {pool.landmark}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <Badge className={`text-xs px-2 py-0.5 border-0 ${regionColors[pool.region]}`}>
                      {pool.region}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{pool.type}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {pool.tags.map(tag => (
                    <span key={tag} className="text-xs bg-[oklch(0.955_0.010_220)] text-muted-foreground px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status section */}
              {pool.hasActiveCoach ? (
                <div className="mx-4 mb-3 bg-[oklch(0.93_0.05_200)] rounded-xl px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[oklch(0.72_0.13_200)] animate-pulse" />
                    <span className="text-xs font-semibold text-[oklch(0.42_0.14_200)]">
                      {pool.coachCount} coach{(pool.coachCount ?? 0) > 1 ? 'es' : ''} active here
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="h-7 text-xs rounded-full bg-[oklch(0.72_0.13_200)] hover:bg-[oklch(0.62_0.13_200)] text-white px-3"
                    onClick={() => navigate('/explore')}
                  >
                    Book Now <ChevronRight size={12} className="ml-0.5" />
                  </Button>
                </div>
              ) : joined.has(pool.id) ? (
                <div className="mx-4 mb-3 bg-green-50 rounded-xl px-3 py-2 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-600" />
                  <span className="text-xs font-semibold text-green-700">
                    You're on the waitlist! We'll notify you when a coach opens slots here.
                  </span>
                </div>
              ) : (
                <div className="mx-4 mb-3">
                  {/* No-coach high-converting banner */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <Bell size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs font-semibold text-amber-800 leading-snug">
                        No coach active at {pool.name} yet!
                      </p>
                    </div>
                    <p className="text-xs text-amber-700 leading-relaxed mb-2.5">
                      Drop your email to vote for this pool — we'll notify you the moment a certified coach opens slots in your neighbourhood.
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 mb-2.5">
                      <Users size={12} />
                      <span>{pool.waitlistCount} {pool.waitlistCount === 1 ? 'person' : 'people'} already waiting</span>
                    </div>

                    {activeWaitlist === pool.id ? (
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={waitlistEmail[pool.id] || ''}
                          onChange={e => setWaitlistEmail(prev => ({ ...prev, [pool.id]: e.target.value }))}
                          placeholder="your@email.com"
                          className="flex-1 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                          onKeyDown={e => e.key === 'Enter' && handleJoinWaitlist(pool.id, pool.name)}
                        />
                        <Button
                          size="sm"
                          className="h-8 text-xs rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-3 flex-shrink-0"
                          onClick={() => handleJoinWaitlist(pool.id, pool.name)}
                        >
                          Notify Me
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full h-8 text-xs rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                        onClick={() => setActiveWaitlist(pool.id)}
                      >
                        <Bell size={12} className="mr-1.5" />
                        Vote for This Pool — Get Notified First
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
}
