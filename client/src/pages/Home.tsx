import { useAuth } from '@/_core/hooks/useAuth';
// Home — Premium concierge marketplace landing page
// Design: Aqua Clarity — concierge hero, How It Works, testimonials, trust indicators
// Positioning: SwimXP is a premium concierge platform (not software). CTAs: Find My Coach / Become A Coach.

import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Star, ShieldCheck, Sparkles, Award, Calendar, MapPin,
  ArrowRight, ClipboardList, Users, Waves, Quote,
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { testimonials } from '@/lib/mockData';
import SEOHead, { SEO_PAGES } from '@/components/SEOHead';

const HERO_IMG = '/hero-swim.jpg';
const LOGO_IMG = '/swimxp-logo-v3.png';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const showDashboard = isAuthenticated && (user as any)?.platformRole === 'coach';

  return (
    <AppLayout>
      <SEOHead {...SEO_PAGES.home} />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: '94vh' }}>
        <img src={HERO_IMG} alt="Private swim coaching" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.2_0.04_240)]/70 via-[oklch(0.2_0.04_240)]/30 to-[oklch(0.15_0.03_240)]/90" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4 pb-2">
          <img src={LOGO_IMG} alt="SwimXP" className="h-16 w-auto object-contain" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }} />
          <div className="flex items-center gap-2">
            {showDashboard && (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-xs text-white hover:text-white hover:bg-white/20 font-semibold">
                  Dashboard
                </Button>
              </Link>
            )}
            <Link href="/onboarding">
              <Button size="sm" className="bg-white text-[oklch(0.2_0.04_240)] hover:bg-white/90 text-xs rounded-full px-4 font-bold shadow-lg">
                Find My Coach
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 z-10">
          <div className="animate-fade-up">
            <Badge className="bg-white/15 text-white border border-white/25 mb-4 text-[11px] backdrop-blur-md font-semibold tracking-wide">
              <Sparkles size={11} className="mr-1" /> SINGAPORE'S PREMIUM SWIM CONCIERGE
            </Badge>
            <h1 className="text-[2.1rem] font-extrabold text-white font-display leading-[1.1] mb-3">
              Your Personal<br />
              <span className="text-[oklch(0.85_0.12_195)]">Swim Coaching Concierge</span>
            </h1>
            <p className="text-white/85 text-[15px] mb-7 leading-relaxed max-w-sm">
              We personally match your family with elite, fully-vetted swim coaches who come to your private condo or
              landed pool. No searching, no guesswork — just a hand-picked shortlist made for you.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/onboarding">
                <Button className="w-full h-13 py-3.5 bg-[oklch(0.76_0.14_192)] hover:bg-[oklch(0.65_0.14_192)] text-white rounded-2xl font-bold text-base shadow-xl shadow-[oklch(0.76_0.14_192)]/30">
                  Find My Coach <ArrowRight size={18} className="ml-1.5" />
                </Button>
              </Link>
              <Link href="/coach-register">
                <Button variant="outline" className="w-full h-13 py-3.5 rounded-2xl border-white/60 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 font-bold text-base">
                  Become A Coach
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ────────────────────────────────────────── */}
      <section className="px-4 py-6 bg-white border-b border-border/40">
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { stat: '100%', label: 'Vetted & Certified' },
            { stat: 'Top 3', label: 'Hand-Picked Matches' },
            { stat: '24/7', label: 'Concierge Support' },
          ].map(item => (
            <div key={item.label}>
              <div className="text-xl font-extrabold font-display text-[oklch(0.76_0.14_192)]">{item.stat}</div>
              <div className="text-[10px] text-muted-foreground font-medium mt-0.5 leading-tight">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────── */}
      <section className="px-4 py-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold font-display text-navy">How It Works</h2>
          <p className="text-sm text-muted-foreground mt-1">White-glove matching in three simple steps</p>
        </div>
        <div className="space-y-4">
          {[
            { step: '01', icon: ClipboardList, title: 'Tell us your goals', desc: 'Share the swimmer\'s level, goals, location and availability in a 2-minute concierge questionnaire.' },
            { step: '02', icon: Users, title: 'We hand-pick your Top 3', desc: 'Our team personally curates the three best-fit certified coaches for your family — no endless scrolling.' },
            { step: '03', icon: Waves, title: 'Swim at your private pool', desc: 'Your chosen coach travels to your condo or landed estate pool. We handle the introductions.' },
          ].map(item => (
            <div key={item.step} className="flex gap-4 p-4 rounded-2xl bg-[oklch(0.97_0.005_220)] border border-border/40">
              <div className="flex-shrink-0">
                <div className="w-11 h-11 rounded-2xl bg-[oklch(0.76_0.14_192)] flex items-center justify-center shadow-md shadow-[oklch(0.76_0.14_192)]/20">
                  <item.icon size={19} className="text-white" />
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[oklch(0.76_0.14_192)] mb-0.5">STEP {item.step}</div>
                <h3 className="font-bold text-[15px] text-navy font-display">{item.title}</h3>
                <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/onboarding">
          <Button className="w-full mt-6 h-12 bg-navy hover:bg-navy/90 text-white rounded-2xl font-bold shadow-lg">
            Start My Concierge Match <ArrowRight size={16} className="ml-1.5" />
          </Button>
        </Link>
      </section>

      {/* ── Testimonials ───────────────────────────────────────── */}
      <section className="py-8 bg-[oklch(0.97_0.005_220)]">
        <div className="px-4 mb-5 text-center">
          <h2 className="text-2xl font-extrabold font-display text-navy">Loved by Families</h2>
          <p className="text-sm text-muted-foreground mt-1">Real stories from SwimXP households</p>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x">
          {(testimonials && testimonials.length > 0 ? testimonials : PLACEHOLDER_TESTIMONIALS).map((t: any) => (
            <div key={t.id} className="snap-start flex-shrink-0 w-72 bg-white rounded-2xl p-5 shadow-sm border border-border/30">
              <Quote size={20} className="text-[oklch(0.76_0.14_192)]/40 mb-2" />
              <div className="flex items-center gap-1 mb-3">
                {[...Array(t.rating || 5)].map((_, j) => <Star key={j} size={12} className="fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                {t.photo
                  ? <img src={t.photo} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                  : <div className="w-9 h-9 rounded-full bg-[oklch(0.93_0.05_200)] flex items-center justify-center text-[oklch(0.52_0.14_200)] font-bold text-sm">{t.name?.[0] ?? 'S'}</div>}
                <div>
                  <p className="font-semibold text-sm font-display">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust indicators ───────────────────────────────────── */}
      <section className="px-4 py-8">
        <div className="text-center mb-5">
          <h2 className="text-2xl font-extrabold font-display text-navy">Why Families Trust Us</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: ShieldCheck, title: 'Fully Vetted', desc: 'Every coach is background-checked, certified and lifesaving-qualified.' },
            { icon: Award, title: 'Elite Coaches', desc: 'Hand-selected professionals with proven track records.' },
            { icon: Calendar, title: 'Flexible & Private', desc: 'Lessons at your own pool, on your schedule.' },
            { icon: MapPin, title: 'Concierge Service', desc: 'We manage matching and introductions personally.' },
          ].map(item => (
            <div key={item.title} className="bg-[oklch(0.97_0.005_220)] rounded-2xl p-4 border border-border/40">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm mb-2.5">
                <item.icon size={18} className="text-[oklch(0.76_0.14_192)]" />
              </div>
              <h3 className="font-bold text-[13px] font-display text-navy">{item.title}</h3>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────── */}
      <section className="mx-4 mb-8 bg-[oklch(0.2_0.04_240)] rounded-3xl p-7 text-center">
        <img src={LOGO_IMG} alt="SwimXP" className="w-14 h-14 object-contain mx-auto mb-4" />
        <h2 className="text-xl font-extrabold text-white font-display mb-2">Let Us Find Your Perfect Coach</h2>
        <p className="text-white/70 text-sm mb-6 leading-relaxed">
          Tell us what you need and we'll personally recommend the Top 3 coaches for your family.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/onboarding">
            <Button className="w-full bg-[oklch(0.76_0.14_192)] hover:bg-[oklch(0.65_0.14_192)] text-white rounded-2xl px-8 font-bold h-12 shadow-lg shadow-[oklch(0.76_0.14_192)]/30">
              Find My Coach
            </Button>
          </Link>
          <Link href="/coach-register">
            <Button variant="outline" className="w-full rounded-2xl border-white/40 text-white bg-white/5 hover:bg-white/15 font-bold h-12">
              Become A Coach
            </Button>
          </Link>
        </div>
      </section>
    </AppLayout>
  );
}

const PLACEHOLDER_TESTIMONIALS = [
  { id: 'p1', rating: 5, text: 'SwimXP found us the perfect coach for our daughter within a day. The whole experience felt truly premium.', name: 'Jennifer L.', role: 'Parent, Bukit Timah' },
  { id: 'p2', rating: 5, text: 'As a busy professional, having a concierge hand-pick coaches who come to our condo pool is invaluable.', name: 'Marcus T.', role: 'Parent, Sentosa Cove' },
  { id: 'p3', rating: 5, text: 'Every coach they recommended was certified, punctual and fantastic with kids. Highly recommend.', name: 'Priya S.', role: 'Parent, East Coast' },
];
