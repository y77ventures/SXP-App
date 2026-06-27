// RegionalPools — SEO-optimised regional pool landing pages
// Routes: /pools/central | /pools/north | /pools/south | /pools/east | /pools/west
// Each region gets its own <title>, <meta description>, JSON-LD structured data, and H1

import { useState, useMemo } from 'react';
import { useParams, useLocation } from 'wouter';
import AppLayout from '@/components/AppLayout';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  MapPin, ChevronLeft, Users, Bell, CheckCircle2,
  Waves, Search, ArrowRight, Star, SlidersHorizontal, X, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { poolRegistry, regionColors, typeIcons, PoolRegion, PoolType } from '@/lib/poolRegistry';
import { toast } from 'sonner';

// ─── Region metadata for SEO ─────────────────────────────────────────────────

const REGION_META: Record<
  string,
  {
    label: PoolRegion;
    title: string;
    description: string;
    landmark: string;
    color: string;
    bgGradient: string;
    emoji: string;
    neighborhoods: string[];
  }
> = {
  central: {
    label: 'Central',
    title: 'Private Swim Lessons in Central Singapore — Condo & Club Pools',
    description:
      'Book certified private swim coaches at condo pools in Bishan, Novena, Toa Payoh, Marina Bay, and Orchard. SwimXP connects Singapore parents with verified swim instructors near their home.',
    landmark: 'Bishan, Novena, Marina Bay, Orchard, Toa Payoh',
    color: 'oklch(0.42 0.14 200)',
    bgGradient: 'from-[oklch(0.93_0.05_200)] to-[oklch(0.97_0.02_220)]',
    emoji: '🏙️',
    neighborhoods: ['Bishan', 'Novena', 'Toa Payoh', 'Marina Bay', 'Orchard', 'Ang Mo Kio', 'Serangoon', 'Bukit Timah'],
  },
  north: {
    label: 'North',
    title: 'Private Swim Lessons in North Singapore — Yishun, Woodlands & Sembawang',
    description:
      'Find certified swim coaches at condo and public pools in Yishun, Woodlands, Sembawang, and Canberra. SwimXP matches Singapore parents with trusted swim instructors in the North.',
    landmark: 'Yishun, Woodlands, Sembawang, Canberra, Admiralty',
    color: 'oklch(0.42 0.18 150)',
    bgGradient: 'from-emerald-50 to-[oklch(0.97_0.02_160)]',
    emoji: '🌿',
    neighborhoods: ['Yishun', 'Woodlands', 'Sembawang', 'Canberra', 'Admiralty', 'Marsiling'],
  },
  south: {
    label: 'South',
    title: 'Private Swim Lessons in South Singapore — Harbourfront, Sentosa & Queenstown',
    description:
      'Book private swim coaches at condo pools in Harbourfront, Sentosa, Queenstown, and Buona Vista. SwimXP connects families in South Singapore with verified swim instructors.',
    landmark: 'Harbourfront, Sentosa, Queenstown, Buona Vista, Telok Blangah',
    color: 'oklch(0.42 0.18 240)',
    bgGradient: 'from-blue-50 to-[oklch(0.97_0.02_240)]',
    emoji: '⚓',
    neighborhoods: ['Harbourfront', 'Sentosa', 'Queenstown', 'Buona Vista', 'Telok Blangah', 'Pasir Panjang'],
  },
  east: {
    label: 'East',
    title: 'Private Swim Lessons in East Singapore — Tampines, Bedok & Pasir Ris',
    description:
      'Find certified swim coaches at condo and public pools in Tampines, Bedok, Pasir Ris, and Changi. SwimXP matches East Singapore families with trusted private swim instructors.',
    landmark: 'Tampines, Bedok, Pasir Ris, Changi, Simei',
    color: 'oklch(0.50 0.18 50)',
    bgGradient: 'from-orange-50 to-[oklch(0.97_0.02_60)]',
    emoji: '🌅',
    neighborhoods: ['Tampines', 'Bedok', 'Pasir Ris', 'Changi', 'Simei', 'Loyang', 'Kembangan'],
  },
  west: {
    label: 'West',
    title: 'Private Swim Lessons in West Singapore — Jurong, Clementi & Bukit Batok',
    description:
      'Book certified private swim coaches at condo pools in Jurong, Clementi, Bukit Batok, and Choa Chu Kang. SwimXP connects West Singapore families with verified swim instructors.',
    landmark: 'Jurong East, Clementi, Bukit Batok, Choa Chu Kang, Tengah',
    color: 'oklch(0.42 0.18 300)',
    bgGradient: 'from-purple-50 to-[oklch(0.97_0.02_300)]',
    emoji: '🌆',
    neighborhoods: ['Jurong East', 'Jurong West', 'Clementi', 'Bukit Batok', 'Choa Chu Kang', 'Tengah', 'Boon Lay'],
  },
};

// ─── Structured data builder ─────────────────────────────────────────────────

function buildStructuredData(regionKey: string, meta: typeof REGION_META[string], pools: typeof poolRegistry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${meta.label} Singapore Swimming Pools — SwimXP`,
    description: meta.description,
    url: `https://swimxp.com/pools/${regionKey}`,
    numberOfItems: pools.length,
    itemListElement: pools.slice(0, 10).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: p.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: p.address,
          addressLocality: p.landmark,
          addressCountry: 'SG',
        },
        description: `${p.type} in ${meta.label} Singapore. ${p.hasActiveCoach ? `${p.coachCount} certified swim coach${(p.coachCount ?? 0) > 1 ? 'es' : ''} available.` : 'Join the waitlist to be notified when a coach opens slots here.'}`,
      },
    })),
  };
}

// ─── Common amenity tags to surface as filter chips ─────────────────────────
const AMENITY_CHIPS = [
  '50m pool', '25m pool', 'Learners pool', 'Kids pool', 'Wading pool',
  'Heated', 'Lap pool', 'Olympic', 'Infinity pool', 'Private',
];

const POOL_TYPES: Array<'All' | PoolType> = [
  'All', 'Public Complex', 'Condo Cluster', 'Clubhouse', 'Sports Hub', 'RC Pool',
];

type SortKey = 'availability' | 'coaches' | 'waitlist' | 'name';

// ─── Component ───────────────────────────────────────────────────────────────

export default function RegionalPools() {
  const { region: regionParam } = useParams<{ region: string }>();
  const [, navigate] = useLocation();
  const [search, setSearch] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState<Record<string, string>>({});
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [activeWaitlist, setActiveWaitlist] = useState<string | null>(null);

  // ── Filter & sort state ──────────────────────────────────────────────────
  const [sortBy, setSortBy] = useState<SortKey>('availability');
  const [selectedType, setSelectedType] = useState<'All' | PoolType>('All');
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const toggleAmenity = (tag: string) =>
    setSelectedAmenities(prev => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });

  const clearFilters = () => {
    setSelectedType('All');
    setSelectedAmenities(new Set());
    setSortBy('availability');
    setSearch('');
  };

  const regionKey = (regionParam ?? '').toLowerCase();
  const meta = REGION_META[regionKey];

  // Fallback: unknown region → redirect to full registry
  if (!meta) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <Waves size={48} className="text-muted-foreground mb-4" />
          <h1 className="text-xl font-bold font-display text-navy mb-2">Region not found</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Valid regions are: Central, North, South, East, West.
          </p>
          <Button onClick={() => navigate('/pool-registry')} className="rounded-full">
            View All Pools
          </Button>
        </div>
      </AppLayout>
    );
  }

  // ── Derived filtered + sorted pool list ─────────────────────────────────
  const regionPools = useMemo(() => {
    let pools = poolRegistry.filter(p => {
      if (p.region !== meta.label) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) &&
            !p.address.toLowerCase().includes(q) &&
            !p.landmark.toLowerCase().includes(q)) return false;
      }
      if (selectedType !== 'All' && p.type !== selectedType) return false;
      if (selectedAmenities.size > 0) {
        const hasAll = Array.from(selectedAmenities).every(a => p.tags.includes(a));
        if (!hasAll) return false;
      }
      return true;
    });

    // Sort
    pools = [...pools].sort((a, b) => {
      if (sortBy === 'availability') {
        // Active coaches first, then by coach count desc
        if (a.hasActiveCoach !== b.hasActiveCoach) return a.hasActiveCoach ? -1 : 1;
        return (b.coachCount ?? 0) - (a.coachCount ?? 0);
      }
      if (sortBy === 'coaches') return (b.coachCount ?? 0) - (a.coachCount ?? 0);
      if (sortBy === 'waitlist') return b.waitlistCount - a.waitlistCount;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return pools;
  }, [meta.label, search, selectedType, selectedAmenities, sortBy]);

  const activePools = regionPools.filter(p => p.hasActiveCoach);
  const waitlistPools = regionPools.filter(p => !p.hasActiveCoach);
  const activeFilterCount = (selectedType !== 'All' ? 1 : 0) + selectedAmenities.size + (sortBy !== 'availability' ? 1 : 0);

  const handleJoinWaitlist = (poolId: string) => {
    const email = waitlistEmail[poolId]?.trim();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setJoined(prev => { const next = new Set(prev); next.add(poolId); return next; });
    setActiveWaitlist(null);
    toast.success('You\'re on the waitlist!', {
      description: 'We\'ll notify you the moment a certified coach opens slots there.',
    });
  };

  const structuredData = buildStructuredData(regionKey, meta, regionPools);

  return (
    <AppLayout>
      <SEOHead
        title={meta.title}
        description={meta.description}
        path={`/pools/${regionKey}`}
        structuredData={structuredData}
      />

      {/* Hero header */}
      <div className={`bg-gradient-to-br ${meta.bgGradient} px-4 pt-12 pb-6`}>
        {/* Back nav */}
        <button
          onClick={() => navigate('/pool-registry')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
        >
          <ChevronLeft size={16} />
          All Regions
        </button>

        {/* Region badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{meta.emoji}</span>
          <Badge
            className="text-xs font-semibold px-3 py-1 rounded-full border-0"
            style={{ background: `${meta.color}20`, color: meta.color }}
          >
            {meta.label} Singapore
          </Badge>
        </div>

        {/* H1 — primary SEO heading */}
        <h1 className="text-2xl font-extrabold font-display leading-tight mb-2" style={{ color: 'oklch(0.18 0.05 230)' }}>
          Swim Lessons Near You<br />
          <span style={{ color: meta.color }}>in {meta.label} Singapore</span>
        </h1>

        {/* H2 — secondary SEO context */}
        <h2 className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {meta.landmark}
        </h2>

        {/* Neighbourhood pills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {meta.neighborhoods.map(n => (
            <span
              key={n}
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: `${meta.color}15`, color: meta.color }}
            >
              {n}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { value: regionPools.length, label: 'Pools Listed' },
            { value: activePools.length, label: 'Active Coaches' },
            { value: waitlistPools.reduce((s, p) => s + p.waitlistCount, 0), label: 'On Waitlist' },
          ].map(s => (
            <div key={s.label} className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 text-center shadow-sm">
              <div className="text-xl font-extrabold font-display" style={{ color: meta.color }}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Filter toggle row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`Search pools in ${meta.label}…`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 rounded-xl bg-white/80 backdrop-blur-sm border-white/50 h-10 text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={cn(
              'flex items-center gap-1.5 h-10 px-3 rounded-xl text-xs font-semibold transition-all flex-shrink-0',
              showFilters || activeFilterCount > 0
                ? 'bg-navy text-white'
                : 'bg-white/80 backdrop-blur-sm border border-white/50 text-muted-foreground'
            )}
          >
            <SlidersHorizontal size={13} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-white/30 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Expandable filter panel ── */}
      {showFilters && (
        <div className="bg-white border-b border-border/40 px-4 py-4 space-y-4">

          {/* Sort by */}
          <div>
            <p className="text-xs font-bold text-navy mb-2 flex items-center gap-1.5">
              <ChevronDown size={12} /> Sort by
            </p>
            <div className="flex flex-wrap gap-1.5">
              {([
                { key: 'availability', label: 'Availability' },
                { key: 'coaches',      label: 'Most Coaches' },
                { key: 'waitlist',     label: 'Most Demand'  },
                { key: 'name',         label: 'A – Z'        },
              ] as { key: SortKey; label: string }[]).map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(opt.key)}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-full font-semibold transition-all',
                    sortBy === opt.key
                      ? 'text-white'
                      : 'bg-[oklch(0.955_0.010_220)] text-muted-foreground hover:bg-[oklch(0.93_0.03_220)]'
                  )}
                  style={sortBy === opt.key ? { background: meta.color } : {}}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pool type */}
          <div>
            <p className="text-xs font-bold text-navy mb-2 flex items-center gap-1.5">
              <ChevronDown size={12} /> Pool Type
            </p>
            <div className="flex flex-wrap gap-1.5">
              {POOL_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-full font-semibold transition-all',
                    selectedType === t
                      ? 'text-white'
                      : 'bg-[oklch(0.955_0.010_220)] text-muted-foreground hover:bg-[oklch(0.93_0.03_220)]'
                  )}
                  style={selectedType === t ? { background: meta.color } : {}}
                >
                  {t === 'All' ? 'All Types' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <p className="text-xs font-bold text-navy mb-2 flex items-center gap-1.5">
              <ChevronDown size={12} /> Amenities
            </p>
            <div className="flex flex-wrap gap-1.5">
              {AMENITY_CHIPS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleAmenity(tag)}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-full font-semibold transition-all',
                    selectedAmenities.has(tag)
                      ? 'text-white'
                      : 'bg-[oklch(0.955_0.010_220)] text-muted-foreground hover:bg-[oklch(0.93_0.03_220)]'
                  )}
                  style={selectedAmenities.has(tag) ? { background: meta.color } : {}}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Clear filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-destructive font-semibold hover:underline"
            >
              <X size={12} /> Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Active filter summary pills */}
      {!showFilters && activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 pt-3 pb-1">
          {sortBy !== 'availability' && (
            <span
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold text-white"
              style={{ background: meta.color }}
            >
              Sort: {sortBy === 'coaches' ? 'Most Coaches' : sortBy === 'waitlist' ? 'Most Demand' : 'A–Z'}
              <button onClick={() => setSortBy('availability')}><X size={10} /></button>
            </span>
          )}
          {selectedType !== 'All' && (
            <span
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold text-white"
              style={{ background: meta.color }}
            >
              {selectedType}
              <button onClick={() => setSelectedType('All')}><X size={10} /></button>
            </span>
          )}
          {Array.from(selectedAmenities).map(a => (
            <span
              key={a}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold text-white"
              style={{ background: meta.color }}
            >
              {a}
              <button onClick={() => toggleAmenity(a)}><X size={10} /></button>
            </span>
          ))}
        </div>
      )}

      {/* Result count summary */}
      <div className="flex items-center justify-between px-4 pt-4 pb-1">
        <p className="text-xs text-muted-foreground">
          <span className="font-bold text-foreground">{regionPools.length}</span> pool{regionPools.length !== 1 ? 's' : ''} found
          {activeFilterCount > 0 && <span className="text-muted-foreground"> (filtered)</span>}
        </p>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs font-semibold flex items-center gap-1"
            style={{ color: meta.color }}
          >
            <X size={11} /> Clear
          </button>
        )}
      </div>

      {/* Active coach pools */}
      {activePools.length > 0 && (
        <section className="px-4 pt-5 pb-2">
          <h3 className="text-base font-bold font-display text-navy mb-3 flex items-center gap-2">
            <CheckCircle2 size={16} style={{ color: meta.color }} />
            Coaches Active Now
            <Badge className="ml-auto text-xs rounded-full border-0 bg-emerald-100 text-emerald-700">
              {activePools.length} pools
            </Badge>
          </h3>
          <div className="space-y-3">
            {activePools.map(pool => (
              <div
                key={pool.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-border/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{typeIcons[pool.type]}</span>
                      <h3 className="font-semibold text-sm font-display text-navy leading-tight truncate">
                        {pool.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <MapPin size={11} />
                      <span>{pool.address} · {pool.landmark}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {pool.tags.map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-[oklch(0.955_0.010_220)] text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex">
                        {Array.from({ length: pool.coachCount ?? 1 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs -ml-1 first:ml-0"
                            style={{ background: meta.color }}
                          >
                            <Star size={9} className="text-white fill-white" />
                          </div>
                        ))}
                      </div>
                      <span className="text-xs font-semibold" style={{ color: meta.color }}>
                        {pool.coachCount} certified coach{(pool.coachCount ?? 0) > 1 ? 'es' : ''} available
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-xl text-xs h-9 px-4 flex-shrink-0 font-semibold"
                    style={{ background: meta.color, color: 'white' }}
                    onClick={() => navigate('/book')}
                  >
                    Book
                    <ArrowRight size={12} className="ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Waitlist pools */}
      {waitlistPools.length > 0 && (
        <section className="px-4 pt-5 pb-24">
          <h3 className="text-base font-bold font-display text-navy mb-1 flex items-center gap-2">
            <Bell size={16} className="text-amber-500" />
            Join the Waitlist
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            No coach yet at these pools — drop your email to be first when one opens slots near you.
          </p>
          <div className="space-y-3">
            {waitlistPools.map(pool => (
              <div
                key={pool.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{typeIcons[pool.type]}</span>
                      <h3 className="font-semibold text-sm font-display text-navy leading-tight truncate">
                        {pool.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <MapPin size={11} />
                      <span>{pool.address} · {pool.landmark}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {pool.tags.map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={11} className="text-amber-500" />
                      <span className="text-xs text-amber-600 font-medium">
                        {pool.waitlistCount} parents waiting
                      </span>
                    </div>
                  </div>
                </div>

                {/* Waitlist CTA */}
                {joined.has(pool.id) ? (
                  <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-3 py-2.5">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                    <span className="text-xs text-emerald-700 font-medium">You're on the waitlist!</span>
                  </div>
                ) : activeWaitlist === pool.id ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="your@email.com"
                      type="email"
                      value={waitlistEmail[pool.id] ?? ''}
                      onChange={e => setWaitlistEmail(prev => ({ ...prev, [pool.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleJoinWaitlist(pool.id)}
                      className="h-9 text-xs rounded-xl flex-1"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      className="h-9 rounded-xl text-xs px-3 bg-amber-500 hover:bg-amber-600 text-white"
                      onClick={() => handleJoinWaitlist(pool.id)}
                    >
                      Notify Me
                    </Button>
                  </div>
                ) : (
                  <button
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors"
                    onClick={() => setActiveWaitlist(pool.id)}
                  >
                    <Bell size={12} />
                    Vote for a Coach Here
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {regionPools.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <Waves size={40} className="text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No pools found matching "{search}"</p>
          <button onClick={() => setSearch('')} className="text-xs mt-2" style={{ color: meta.color }}>
            Clear search
          </button>
        </div>
      )}
    </AppLayout>
  );
}
