// Explore — Premium concierge coach preview
// Design: Aqua Clarity — max 6 sample coaches, premium info blurred, sign-up gate
// Policy: No public pool listings / pool search / pool explorer.
//   Clicking a coach (or revealing premium info) requires account creation.

import { useLocation } from 'wouter';
import { Star, MapPin, CheckCircle2, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/AppLayout';
import { coaches } from '@/lib/mockData';
import SEOHead, { SEO_PAGES } from '@/components/SEOHead';

// Maximum 6 sample dummy profiles for the public preview
const SAMPLE_COACHES = coaches.slice(0, 6);

export default function Explore() {
  const [, navigate] = useLocation();

  // Any attempt to view a coach requires account creation
  const requireSignup = () => navigate('/onboarding');

  return (
    <AppLayout>
      <SEOHead {...SEO_PAGES.explore} />

      {/* Header */}
      <div className="px-4 pt-6 pb-4 text-center">
        <Badge className="bg-[oklch(0.93_0.05_200)] text-[oklch(0.52_0.14_200)] border-0 mb-3">
          <Sparkles size={11} className="mr-1" /> Curated Preview
        </Badge>
        <h1 className="text-2xl font-extrabold font-display text-navy">Meet Our Elite Coaches</h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-sm mx-auto">
          A glimpse of the certified coaches in our network. Create a free account to unlock full profiles and get your
          personally matched Top 3.
        </p>
      </div>

      {/* Sample coach grid — premium info blurred */}
      <div className="px-4 pb-4 grid grid-cols-2 gap-3">
        {SAMPLE_COACHES.map(coach => (
          <button
            key={coach.id}
            onClick={requireSignup}
            className="text-left bg-white rounded-2xl border border-border/50 overflow-hidden card-hover cursor-pointer"
          >
            <div className="relative">
              <img src={coach.photo} alt="SwimXP coach" className="w-full h-32 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              {coach.verified && (
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={10} className="text-[oklch(0.76_0.14_192)]" />
                  <span className="text-[9px] font-semibold text-[oklch(0.76_0.14_192)]">Verified</span>
                </div>
              )}
              {/* Match score is premium — blurred */}
              <span className="absolute top-2 right-2 match-badge text-[10px] px-2 py-0.5 rounded-full blur-[3px] select-none">
                {coach.matchScore ?? 95}%
              </span>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white font-semibold text-xs font-display">{firstNameOnly(coach.name)}</p>
                {/* Exact location is premium — blurred */}
                <div className="flex items-center gap-1">
                  <MapPin size={9} className="text-white/70" />
                  <span className="text-white/70 text-[10px] blur-[3px] select-none">{coach.location}</span>
                </div>
              </div>
            </div>
            <div className="p-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold">{coach.rating}</span>
                </div>
                {/* Rate is premium — blurred + lock */}
                <span className="flex items-center gap-0.5 text-xs font-bold text-[oklch(0.76_0.14_192)] font-display">
                  <Lock size={10} className="text-muted-foreground" />
                  <span className="blur-[3px] select-none">${coach.hourlyRate}/hr</span>
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {coach.specialities.slice(0, 1).map(s => (
                  <Badge key={s} variant="secondary" className="text-[9px] py-0 bg-[oklch(0.93_0.05_200)] text-[oklch(0.52_0.14_200)] border-0">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Sign-up gate banner */}
      <section className="mx-4 mb-8 bg-[oklch(0.2_0.04_240)] rounded-3xl p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
          <Lock size={22} className="text-[oklch(0.85_0.12_195)]" />
        </div>
        <h2 className="text-lg font-extrabold text-white font-display mb-2">Unlock Full Coach Profiles</h2>
        <p className="text-white/70 text-sm mb-5 leading-relaxed">
          Rates, exact locations, availability and match scores are reserved for members. Create a free account and
          we'll personally recommend your Top 3 coaches.
        </p>
        <Button
          onClick={requireSignup}
          className="w-full h-12 bg-[oklch(0.76_0.14_192)] hover:bg-[oklch(0.65_0.14_192)] text-white rounded-2xl font-bold shadow-lg shadow-[oklch(0.76_0.14_192)]/30"
        >
          Create Free Account <ArrowRight size={16} className="ml-1.5" />
        </Button>
      </section>
    </AppLayout>
  );
}

function firstNameOnly(name: string) {
  return `Coach ${name.split(' ')[0]}`;
}
