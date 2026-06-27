// CoachCard — Reusable coach display card
// Design: Aqua Clarity — card hover lift, match badge gradient

import { Star, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Coach } from '@/lib/mockData';

interface CoachCardProps {
  coach: Coach;
  showMatch?: boolean;
  onBook?: () => void;
  onLike?: () => void;
  compact?: boolean;
  className?: string;
}

export default function CoachCard({ coach, showMatch = false, onBook, onLike, compact = false, className }: CoachCardProps) {
  return (
    <div className={cn(
      'bg-white rounded-2xl border border-border/50 overflow-hidden card-hover',
      compact ? 'flex gap-3 p-3' : '',
      className
    )}>
      {compact ? (
        // Compact horizontal layout
        <>
          <div className="relative flex-shrink-0">
            <img
              src={coach.photo}
              alt={coach.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            {coach.verified && (
              <CheckCircle2 size={14} className="absolute -bottom-1 -right-1 text-[oklch(0.72_0.13_200)] bg-white rounded-full" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-sm font-display text-navy truncate">{coach.name}</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={11} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground truncate">{coach.location} · {coach.distance}</span>
                </div>
              </div>
              {showMatch && coach.matchScore && (
                <span className="match-badge text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                  {coach.matchScore}%
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex items-center gap-0.5">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium">{coach.rating}</span>
                <span className="text-xs text-muted-foreground">({coach.reviewCount})</span>
              </div>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs font-semibold text-[oklch(0.72_0.13_200)]">${coach.hourlyRate}/hr</span>
            </div>
          </div>
        </>
      ) : (
        // Full card layout
        <>
          <div className="relative">
            <img
              src={coach.photo}
              alt={coach.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            {showMatch && coach.matchScore && (
              <div className="absolute top-3 right-3">
                <span className="match-badge text-sm px-3 py-1 rounded-full shadow-lg">
                  {coach.matchScore}% Match
                </span>
              </div>
            )}
            {coach.verified && (
              <div className="absolute top-3 left-3">
                <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 text-[oklch(0.72_0.13_200)]">
                  <CheckCircle2 size={11} />
                  Verified
                </span>
              </div>
            )}
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-bold text-lg text-white font-display leading-tight">{coach.name}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={12} className="text-white/80" />
                <span className="text-white/80 text-xs">{coach.location} · {coach.distance}</span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="font-semibold text-sm">{coach.rating}</span>
                <span className="text-muted-foreground text-xs">({coach.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock size={13} />
                <span className="text-xs">{coach.experience} yrs exp</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {coach.specialities.slice(0, 3).map(s => (
                <Badge key={s} variant="secondary" className="text-xs bg-[oklch(0.93_0.05_200)] text-[oklch(0.52_0.14_200)] border-0">
                  {s}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{coach.bio}</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg font-display text-[oklch(0.72_0.13_200)]">
                ${coach.hourlyRate}<span className="text-sm font-normal text-muted-foreground">/hr</span>
              </span>
              <div className="flex gap-2">
                {onLike && (
                  <Button variant="outline" size="sm" onClick={onLike} className="border-[oklch(0.72_0.13_200)] text-[oklch(0.72_0.13_200)]">
                    ♡ Like
                  </Button>
                )}
                {onBook && (
                  <Button size="sm" onClick={onBook} className="bg-[oklch(0.72_0.13_200)] hover:bg-[oklch(0.62_0.13_200)] text-white">
                    Book Trial
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
