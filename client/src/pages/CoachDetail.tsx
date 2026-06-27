// CoachDetail — Full coach profile page
// Design: Aqua Clarity — hero photo, stats, reviews, booking CTA

import { useParams, useLocation } from 'wouter';
import { ChevronLeft, Star, MapPin, Clock, CheckCircle2, Heart, Calendar, Bookmark, Users, Languages, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/AppLayout';
import { coaches } from '@/lib/mockData';
import { toast } from 'sonner';
import SEOHead from '@/components/SEOHead';

export default function CoachDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const coach = coaches.find(c => c.id === id) ?? coaches[0];

  const coachStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: coach.name,
    jobTitle: 'Certified Swim Coach',
    description: coach.bio,
    image: coach.photo,
    url: `https://swimxp.com/coach/${coach.id}`,
    address: { '@type': 'PostalAddress', addressLocality: coach.location, addressCountry: 'SG' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: coach.rating, reviewCount: coach.reviewCount },
  };

  return (
    <AppLayout hideNav>
      <SEOHead
        title={`${coach.name} — Certified Swim Coach in ${coach.location}`}
        description={`Book private swim lessons with ${coach.name} in ${coach.location}, Singapore. ${coach.experience} years experience, ${coach.rating}★ rating. $${coach.hourlyRate}/hr.`}
        path={`/coach/${coach.id}`}
        ogType="profile"
        structuredData={coachStructuredData}
      />
      {/* Back button */}
      <div className="sticky top-0 z-40 bg-transparent">
        <button
          onClick={() => navigate('/explore')}
          className="m-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md"
        >
          <ChevronLeft size={20} className="text-navy" />
        </button>
      </div>

      {/* Hero photo */}
      <div className="relative -mt-14" style={{ height: 380 }}>
        <img src={coach.photo} alt={coach.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Verified Credentials badge — shown only when certStatus === 'approved' */}
        {coach.certStatus === 'approved' && (
          <div className="absolute top-16 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-2xl shadow-md flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[oklch(0.72_0.13_200)] flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={13} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-[oklch(0.52_0.14_200)] leading-none">Verified Credentials</p>
              <p className="text-[9px] text-muted-foreground leading-none mt-0.5">Admin-approved</p>
            </div>
          </div>
        )}
        {coach.matchScore && (
          <div className="absolute bottom-20 right-4">
            <div className="match-badge px-4 py-2 rounded-2xl text-center shadow-lg">
              <div className="text-2xl font-extrabold font-display leading-none">{coach.matchScore}%</div>
              <div className="text-xs opacity-90">Match</div>
            </div>
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-extrabold text-white font-display">{coach.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span className="text-white font-semibold text-sm">{coach.rating}</span>
              <span className="text-white/70 text-xs">({coach.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-white/70" />
              <span className="text-white/70 text-xs">{coach.location} · {coach.distance}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5 space-y-5">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: `${coach.experience}yrs`, label: 'Experience', icon: Clock },
            { value: `${coach.studentCount}`, label: 'Students', icon: Users },
            { value: `$${coach.hourlyRate}`, label: 'Per Hour', icon: Calendar },
          ].map(s => (
            <div key={s.label} className="bg-[oklch(0.955_0.010_220)] rounded-2xl p-3 text-center">
              <div className="text-lg font-bold font-display text-[oklch(0.72_0.13_200)]">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* About */}
        <div>
          <h2 className="font-bold text-base font-display text-navy mb-2">About</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{coach.bio}</p>
        </div>

        {/* Specialities */}
        <div>
          <h2 className="font-bold text-base font-display text-navy mb-2">Specialities</h2>
          <div className="flex flex-wrap gap-2">
            {coach.specialities.map(s => (
              <Badge key={s} className="bg-[oklch(0.93_0.05_200)] text-[oklch(0.52_0.14_200)] border-0">
                {s}
              </Badge>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h2 className="font-bold text-base font-display text-navy mb-2">Certifications</h2>

          {/* Verified Credentials detail block — only when admin-approved */}
          {coach.certStatus === 'approved' && (coach.coachingCertType || coach.lifesavingCertType) && (
            <div className="mb-3 bg-[oklch(0.93_0.05_200)] rounded-2xl p-3 border border-[oklch(0.85_0.08_200)]/40">
              <div className="flex items-center gap-1.5 mb-2">
                <ShieldCheck size={13} className="text-[oklch(0.52_0.14_200)]" />
                <span className="text-xs font-bold text-[oklch(0.52_0.14_200)]">Verified Credentials</span>
                <span className="ml-auto text-[9px] bg-[oklch(0.72_0.13_200)] text-white px-1.5 py-0.5 rounded-full font-semibold">Admin Approved</span>
              </div>
              {coach.coachingCertType && (
                <div className="flex items-start gap-2 mb-1.5">
                  <CheckCircle2 size={12} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-navy">{coach.coachingCertType}</p>
                    {coach.coachingCertExpiry && (
                      <p className="text-[10px] text-muted-foreground">
                        Expires {new Date(coach.coachingCertExpiry).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {coach.lifesavingCertType && (
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={12} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-navy">{coach.lifesavingCertType}</p>
                    {coach.lifesavingCertExpiry && (
                      <p className="text-[10px] text-muted-foreground">
                        Expires {new Date(coach.lifesavingCertExpiry).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pending review notice */}
          {coach.certStatus === 'pending_review' && (
            <div className="mb-3 bg-amber-50 rounded-2xl p-3 border border-amber-200 flex items-center gap-2">
              <AlertTriangle size={13} className="text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-700">Credential review in progress. Badge will appear once admin-approved.</p>
            </div>
          )}

          <div className="space-y-2">
            {coach.certifications.map(cert => (
              <div key={cert} className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[oklch(0.72_0.13_200)] flex-shrink-0" />
                <span className="text-sm text-foreground">{cert}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div>
          <h2 className="font-bold text-base font-display text-navy mb-2">Languages</h2>
          <div className="flex gap-2">
            {coach.languages.map(l => (
              <Badge key={l} variant="outline" className="text-xs">
                <Languages size={11} className="mr-1" />
                {l}
              </Badge>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <h2 className="font-bold text-base font-display text-navy mb-2">Availability</h2>
          <div className="flex gap-2 flex-wrap">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => (
              <div
                key={day}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-semibold ${
                  coach.availability.includes(day)
                    ? 'bg-[oklch(0.72_0.13_200)] text-white'
                    : 'bg-[oklch(0.955_0.010_220)] text-muted-foreground'
                }`}
              >
                {day.slice(0, 2)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 bg-[oklch(0.965_0.012_220)]/95 backdrop-blur-xl border-t border-border/50 p-4 pb-safe">
        <div className="flex gap-3">
          <button
            onClick={() => toast.success(`${coach.name} saved!`, { icon: '⭐' })}
            className="w-12 h-12 rounded-2xl border-2 border-border flex items-center justify-center flex-shrink-0"
          >
            <Bookmark size={18} className="text-muted-foreground" />
          </button>
          <button
            onClick={() => toast.success(`Liked ${coach.name}!`, { icon: '❤️' })}
            className="w-12 h-12 rounded-2xl border-2 border-[oklch(0.72_0.13_200)]/30 flex items-center justify-center flex-shrink-0"
          >
            <Heart size={18} className="text-[oklch(0.72_0.13_200)]" />
          </button>
          <Button
            className="flex-1 bg-[oklch(0.72_0.13_200)] hover:bg-[oklch(0.62_0.13_200)] text-white rounded-2xl font-semibold h-12"
            onClick={() => navigate('/book')}
          >
            <Calendar size={16} className="mr-2" />
            Book Trial Lesson · ${coach.hourlyRate}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
