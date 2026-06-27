// Matches — Top 3 coach matching logic
// Design: Aqua Clarity — coach cards, match scores, quick booking
// Updated: Implemented Top 3 matching logic and improved UI cards from backup.

import { useLocation } from 'wouter';
import { ChevronLeft, Star, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/AppLayout';
import { coaches } from '@/lib/mockData';

export default function Matches() {
  const [, navigate] = useLocation();

  // Phase 2: Top 3 matching logic
  // In a real app, this would be based on the onboarding form data
  const topMatches = coaches
    .slice(0, 3)
    .map((c, i) => ({ ...c, matchScore: 98 - i * 3 }));

  return (
    <AppLayout>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/onboarding')} className="w-8 h-8 rounded-xl bg-[oklch(0.97_0.005_220)] flex items-center justify-center">
            <ChevronLeft size={16} />
          </button>
          <h1 className="text-lg font-bold font-display text-navy">Your Top Matches</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 animate-fade-up">
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <p className="text-xs text-blue-800 font-medium leading-relaxed">
            Based on your preferences, we've found **3 expert coaches** who travel to your area and match your schedule.
          </p>
        </div>

        <div className="space-y-4">
          {topMatches.map((coach, i) => (
            <div key={coach.id} className="bg-white rounded-3xl border border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="relative h-48">
                <img src={coach.photo} alt={coach.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-[oklch(0.76_0.14_192)] text-white border-0 shadow-lg">
                    {coach.matchScore}% Match
                  </Badge>
                </div>
                {i === 0 && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-amber-400 text-white border-0 shadow-lg">
                      Best for Kids
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-navy text-lg font-display">{coach.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-navy">{coach.rating}</span>
                      <span className="text-xs text-muted-foreground">({coach.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-[oklch(0.76_0.14_192)]">${coach.hourlyRate}</span>
                    <p className="text-[10px] text-muted-foreground">per hour</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {coach.specialities.slice(0, 3).map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 bg-[oklch(0.97_0.005_220)] text-muted-foreground rounded-full font-medium">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <MapPin size={12} className="text-[oklch(0.76_0.14_192)]" />
                    <span>Travels to you</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Clock size={12} className="text-[oklch(0.76_0.14_192)]" />
                    <span>Flexible Slots</span>
                  </div>
                </div>

                <div className="pt-3 flex gap-2">
                  <Button
                    onClick={() => navigate(`/coach/${coach.id}`)}
                    variant="outline"
                    className="flex-1 h-10 rounded-xl text-xs font-bold border-border"
                  >
                    View Profile
                  </Button>
                  <Button
                    onClick={() => navigate('/booking')}
                    className="flex-1 h-10 rounded-xl text-xs font-bold bg-[oklch(0.76_0.14_192)] hover:bg-[oklch(0.65_0.14_192)] text-white shadow-md shadow-[oklch(0.76_0.14_192)]/20"
                  >
                    Book Trial
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground mb-4">Didn't find what you're looking for?</p>
          <Button
            variant="ghost"
            onClick={() => navigate('/explore')}
            className="text-xs font-bold text-[oklch(0.76_0.14_192)]"
          >
            Explore all 50+ coaches
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
