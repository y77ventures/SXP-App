import { useAuth } from '@/_core/hooks/useAuth';
// Home — Landing page / App home screen
// Design: Aqua Clarity — hero with swim image, featured coaches, testimonials
// Updated: Removed Dashboard for public, added focus on Find/Become Coach, removed Explore Pools

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, ChevronRight, Waves, Users, Calendar, Shield, ArrowRight } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { coaches, testimonials } from '@/lib/mockData';
import SEOHead, { SEO_PAGES } from '@/components/SEOHead';

const HERO_IMG = '/hero-swim.jpg';
const LOGO_IMG = '/swimxp-logo-v3.png';
const UNDERWATER_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663787850072/HM5C7RcyProJEpB8Er5afd/matching-bg-TzXm9fEuAejsgLU9e4VMJf.webp';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.querySelector('main');
    const onScroll = () => setScrolled((el?.scrollTop ?? 0) > 60);
    el?.addEventListener('scroll', onScroll);
    return () => el?.removeEventListener('scroll', onScroll);
  }, []);

  const featuredCoaches = coaches.slice(0, 4);

  // Dashboard visible only for logged-in coaches (Premium placeholder)
  const showDashboard = isAuthenticated && user?.role === 'coach';

  return (
    <AppLayout>
      <SEOHead {...SEO_PAGES.home} />
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ height: '92vh', minHeight: 560 }}>
        <img src={HERO_IMG} alt="Swim coaching" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75" />

        {/* Top Nav Overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4 pb-2">
          <img src={LOGO_IMG} alt="SwimXP" className="h-20 w-auto object-contain" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.45))' }} />
          <div className="flex items-center gap-2">
            {showDashboard && (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-xs text-white hover:text-white hover:bg-white/20 font-semibold">
                  Dashboard
                </Button>
              </Link>
            )}
            <Link href="/onboarding">
              <Button size="sm" className="bg-[oklch(0.76_0.14_192)] hover:bg-[oklch(0.65_0.14_192)] text-white text-xs rounded-full px-4 font-semibold shadow-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 z-10">
          <div className="animate-fade-up">
            <Badge className="bg-[oklch(0.76_0.14_192)]/90 text-white border-0 mb-3 text-xs backdrop-blur-sm">
              🏊 Singapore's Swim Coach Marketplace
            </Badge>
            <h1 className="text-3xl font-extrabold text-white font-display leading-tight mb-2">
              Find Your Perfect<br />
              <span className="text-[oklch(0.85_0.10_200)]">Swim Coach Match</span>
            </h1>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              Match with certified coaches, and book lessons that fit your schedule at your private condo or landed pool.
            </p>
            <div className="flex gap-3">
              <Link href="/onboarding">
                <Button className="bg-[oklch(0.76_0.14_192)] hover:bg-[oklch(0.65_0.14_192)] text-white rounded-full px-6 font-semibold shadow-lg shadow-[oklch(0.76_0.14_192)]/30">
                  Find a Coach
                </Button>
              </Link>
              <Link href="/coach-register">
                <Button variant="outline" className="rounded-full px-6 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white/20">
                  Become a Coach
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-8">
        <h2 className="text-xl font-bold font-display text-navy mb-5">How SwimXP Works</h2>
        <div className="space-y-4">
          {[
            { step: '01', icon: Users, title: 'Create your profile', desc: 'Tell us about the swimmer\'s age (children to adults), level, and goals.', color: 'bg-[oklch(0.97_0.005_220)]', iconColor: 'text-[oklch(0.76_0.14_192)]' },
            { step: '02', icon: Waves, title: 'Get matched with coaches', desc: 'Our system matches you with certified coaches based on your location and goals.', color: 'bg-amber-50', iconColor: 'text-amber-500' },
            { step: '03', icon: Calendar, title: 'Book lessons at your private pool', desc: 'Verify your condo or landed estate pool details and finalize your booking.', color: 'bg-[oklch(0.97_0.005_220)]', iconColor: 'text-[oklch(0.76_0.14_192)]' },
          ].map((item, i) => (
            <div key={i} className={`flex gap-4 p-4 rounded-2xl ${item.color}`}>
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <item.icon size={18} className={item.iconColor} />
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-muted-foreground mb-0.5">STEP {item.step}</div>
                <h3 className="font-semibold text-sm text-navy font-display">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Coaches */}
      <section className="py-6">
        <div className="flex items-center justify-between px-4 mb-4">
          <h2 className="text-xl font-bold font-display text-navy">Top Coaches Near You</h2>
          <Link href="/explore">
            <button className="text-[oklch(0.76_0.14_192)] text-sm font-medium flex items-center gap-1">
              See all <ChevronRight size={14} />
            </button>
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x snap-mandatory">
          {featuredCoaches.map((coach) => (
            <Link key={coach.id} href={`/coach/${coach.id}`}>
              <div className="snap-start flex-shrink-0 w-64 bg-white rounded-2xl border border-border/50 overflow-hidden card-hover cursor-pointer">
                <div className="relative">
                  <img src={coach.photo} alt={coach.name} className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {coach.matchScore && <span className="match-badge absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full">{coach.matchScore}% Match</span>}
                  <div className="absolute bottom-2 left-3 right-3">
                    <p className="text-white font-semibold text-sm font-display">{coach.name}</p>
                    <div className="flex items-center gap-1"><MapPin size={10} className="text-white/70" /><span className="text-white/70 text-xs">{coach.distance}</span></div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" /><span className="text-xs font-semibold">{coach.rating}</span></div>
                    <span className="text-sm font-bold text-[oklch(0.76_0.14_192)] font-display">${coach.hourlyRate}/hr</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Match CTA Banner */}
      <section className="mx-4 my-2 rounded-3xl overflow-hidden relative" style={{ minHeight: 160 }}>
        <img src={UNDERWATER_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[oklch(0.2_0.04_240)]/70" />
        <div className="relative p-6 text-center">
          <h2 className="text-xl font-extrabold text-white font-display mb-1">Find Your 96% Match</h2>
          <p className="text-white/75 text-sm mb-4">Answer quick questions and we'll show you your top coach matches.</p>
          <Link href="/onboarding">
            <Button className="bg-[oklch(0.76_0.14_192)] hover:bg-[oklch(0.65_0.14_192)] text-white rounded-full text-sm font-semibold">
              See My Matches <ArrowRight size={14} className="ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-6 bg-[oklch(0.97_0.005_220)]">
        <div className="px-4 mb-4">
          <h2 className="text-xl font-bold font-display text-navy">What Parents Say</h2>
          <p className="text-sm text-muted-foreground mt-1">Real stories from SwimXP families</p>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x">
          {testimonials.map((t) => (
            <div key={t.id} className="snap-start flex-shrink-0 w-72 bg-white rounded-2xl p-4 shadow-sm border border-border/30">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(t.rating)].map((_, j) => <Star key={j} size={12} className="fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.photo} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                <div><p className="font-semibold text-sm font-display">{t.name}</p><p className="text-xs text-muted-foreground">{t.role}</p></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-4 py-6">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Shield, title: 'Verified Coaches', desc: 'All coaches background-checked & certified' },
            { icon: Star, title: 'Quality Guaranteed', desc: 'Free rematch if you\'re not satisfied' },
            { icon: Calendar, title: 'Flexible Booking', desc: 'Cancel or reschedule up to 24hrs before' },
            { icon: Users, title: 'Family-Friendly', desc: 'Designed for parents and children first' },
          ].map((item, i) => (
            <div key={i} className="bg-[oklch(0.97_0.005_220)] rounded-2xl p-4">
              <item.icon size={20} className="text-[oklch(0.76_0.14_192)] mb-2" />
              <h3 className="font-semibold text-xs font-display text-navy">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-4 mb-6 bg-[oklch(0.2_0.04_240)] rounded-3xl p-6 text-center">
        <img src={LOGO_IMG} alt="SwimXP" className="w-12 h-12 object-contain mx-auto mb-3" />
        <h2 className="text-xl font-extrabold text-white font-display mb-2">Join SwimXP Connect Today</h2>
        <p className="text-white/70 text-sm mb-6 leading-relaxed">Your child's perfect swim coach is waiting. First trial lesson from $65.</p>
        <Link href="/onboarding">
          <Button className="bg-[oklch(0.76_0.14_192)] hover:bg-[oklch(0.65_0.14_192)] text-white rounded-full px-8 font-semibold w-full shadow-lg shadow-[oklch(0.76_0.14_192)]/30">
            Get My Coach Matches
          </Button>
        </Link>
      </section>
    </AppLayout>
  );
}
