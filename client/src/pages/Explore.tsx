// Explore — Coach Marketplace with search, filters, and Singapore region map
// Design: Aqua Clarity — filter chips, SVG region map, card grid
// Updated: Removed pools, enforced minimum coach fee of $75 logic (visual filter), focus on coach discovery

import { useState } from 'react';
import { Search, MapPin, Star, CheckCircle2, Map } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import AppLayout from '@/components/AppLayout';
import { coaches } from '@/lib/mockData';
import SEOHead, { SEO_PAGES } from '@/components/SEOHead';
import SingaporeRegionMap, { type SgRegion } from '@/components/SingaporeRegionMap';
import { cn } from '@/lib/utils';

const SPECIALITY_FILTERS = ['All', 'Toddlers', 'Children', 'Adult Beginners', 'Competitive', 'Water Confidence', 'Special Needs'];
const PRICE_FILTERS = ['All', '$75–$90', '$90+']; // Minimum fee of $75

// Region → location keyword mapping
const REGION_KEYWORDS: Record<string, string[]> = {
  Central: ['orchard', 'bishan', 'toa payoh', 'novena', 'clementi', 'queenstown', 'buona vista', 'holland', 'river valley', 'tiong bahru', 'bukit timah', 'newton'],
  North: ['woodlands', 'yishun', 'sembawang', 'admiralty', 'canberra', 'marsiling', 'kranji'],
  'North-East': ['sengkang', 'punggol', 'hougang', 'serangoon', 'ang mo kio', 'kovan', 'lorong chuan'],
  East: ['tampines', 'pasir ris', 'bedok', 'changi', 'simei', 'east coast', 'marine parade', 'paya lebar', 'geylang', 'katong'],
  West: ['jurong', 'boon lay', 'bukit batok', 'choa chu kang', 'bukit panjang', 'tengah', 'pioneer', 'tuas', 'lakeside'],
};

function matchesRegion(location: string, region: SgRegion): boolean {
  if (!region) return true;
  const loc = location.toLowerCase();
  return REGION_KEYWORDS[region]?.some(k => loc.includes(k)) ?? false;
}

export default function Explore() {
  const [search, setSearch] = useState('');
  const [speciality, setSpeciality] = useState('All');
  const [price, setPrice] = useState('All');
  const [region, setRegion] = useState<SgRegion>(null);
  const [showMap, setShowMap] = useState(false);

  const filteredCoaches = coaches.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    const matchSpec = speciality === 'All' || c.specialities.some(s => s === speciality);
    
    // Price filter logic with minimum $75
    const matchPrice = price === 'All' ||
      (price === '$75–$90' && c.hourlyRate >= 75 && c.hourlyRate <= 90) ||
      (price === '$90+' && c.hourlyRate > 90);
      
    const matchReg = !region || matchesRegion(c.location, region);
    return matchSearch && matchSpec && matchPrice && matchReg;
  });

  return (
    <AppLayout>
      <SEOHead {...SEO_PAGES.explore} />

      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-[oklch(0.965_0.012_220)]/95 backdrop-blur-xl border-b border-border/50">
        <div className="px-4 pt-4 pb-3">
          <h1 className="text-xl font-bold font-display text-navy mb-3">Find a Coach</h1>

          {/* Search */}
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search coaches, locations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 rounded-xl bg-[oklch(0.955_0.010_220)] border-0 text-sm"
            />
          </div>

          {/* Map toggle + region clear */}
          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={() => setShowMap(m => !m)}
              className={cn(
                'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all border flex-shrink-0',
                showMap
                  ? 'bg-[oklch(0.76_0.14_192)] text-white border-transparent'
                  : 'bg-white text-muted-foreground border-border/40'
              )}
            >
              <Map size={12} />
              {showMap ? 'Hide Map' : 'Region Map'}
              {region && !showMap && (
                <span className="ml-1 bg-[oklch(0.76_0.14_192)] text-white rounded-full px-1.5 py-0.5 text-[10px]">{region}</span>
              )}
            </button>
            {region && (
              <button
                onClick={() => setRegion(null)}
                className="text-xs text-[oklch(0.76_0.14_192)] font-semibold flex-shrink-0"
              >
                Clear region ✕
              </button>
            )}
          </div>

          {/* SVG Region Map — collapsible */}
          {showMap && (
            <div className="pb-3 animate-fade-up">
              <SingaporeRegionMap selected={region} onSelect={setRegion} />
            </div>
          )}

          {/* Speciality chips */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {SPECIALITY_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setSpeciality(f)}
                className={cn(
                  'flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150',
                  speciality === f
                    ? 'bg-[oklch(0.76_0.14_192)] text-white'
                    : 'bg-[oklch(0.955_0.010_220)] text-muted-foreground'
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Price chips */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {PRICE_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setPrice(f)}
                className={cn(
                  'flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150',
                  price === f
                    ? 'bg-navy text-white'
                    : 'bg-[oklch(0.955_0.010_220)] text-muted-foreground'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground">
            {filteredCoaches.length} coach{filteredCoaches.length !== 1 ? 'es' : ''} found
            {region ? ` in ${region}` : ''}
          </p>
          {(region || speciality !== 'All' || price !== 'All') && (
            <button
              onClick={() => { setRegion(null); setSpeciality('All'); setPrice('All'); }}
              className="text-xs text-[oklch(0.76_0.14_192)] font-semibold"
            >
              Clear all filters
            </button>
          )}
        </div>

        <div className="space-y-3">
          {filteredCoaches.map((coach, i) => (
            <Link key={coach.id} href={`/coach/${coach.id}`}>
              <div className={cn(
                'animate-fade-up flex gap-3 bg-white rounded-2xl border border-border/50 overflow-hidden card-hover cursor-pointer p-3',
                `animate-fade-up-${Math.min(i + 1, 5)}`
              )}>
                <div className="relative flex-shrink-0">
                  <img src={coach.photo} alt={coach.name} className="w-20 h-20 rounded-xl object-cover" />
                  {coach.verified && (
                    <CheckCircle2 size={14} className="absolute -bottom-1 -right-1 text-[oklch(0.76_0.14_192)] bg-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm font-display text-navy">{coach.name}</h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{coach.location} · {coach.distance}</span>
                      </div>
                    </div>
                    {coach.matchScore && (
                      <span className="match-badge text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                        {coach.matchScore}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center gap-0.5">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold">{coach.rating}</span>
                      <span className="text-xs text-muted-foreground">({coach.reviewCount})</span>
                    </div>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{coach.experience} yrs</span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex gap-1 flex-wrap">
                      {coach.specialities.slice(0, 2).map(s => (
                        <Badge key={s} variant="secondary" className="text-[10px] py-0 bg-[oklch(0.93_0.05_200)] text-[oklch(0.52_0.14_200)] border-0">
                          {s}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-sm font-bold text-[oklch(0.76_0.14_192)] font-display">${coach.hourlyRate}/hr</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {filteredCoaches.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No coaches found</p>
              <p className="text-xs mt-1">Try a different region or adjust your filters.</p>
              {region && (
                <button
                  onClick={() => setRegion(null)}
                  className="mt-3 text-xs text-[oklch(0.76_0.14_192)] font-semibold underline"
                >
                  Show all regions
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
