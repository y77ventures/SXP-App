// Matches — Dating-app inspired coach matching with swipe cards
// Design: Aqua Clarity — Tinder-style card stack, match percentage, like/save/request

import { useState } from 'react';
import { Heart, X, Star, Bookmark, Calendar, MapPin, CheckCircle2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useLocation } from 'wouter';
import AppLayout from '@/components/AppLayout';
import { coaches } from '@/lib/mockData';
import { toast } from 'sonner';
import SEOHead, { SEO_PAGES } from '@/components/SEOHead';
import { cn } from '@/lib/utils';

const UNDERWATER_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663787850072/HM5C7RcyProJEpB8Er5afd/matching-bg-TzXm9fEuAejsgLU9e4VMJf.webp';

const sortedCoaches = [...coaches].sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));

export default function Matches() {
  const [, navigate] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);
  const [liked, setLiked] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [view, setView] = useState<'stack' | 'liked'>('stack');

  const currentCoach = sortedCoaches[currentIndex];

  const handleSwipe = (dir: 'left' | 'right') => {
    setSwipeDir(dir);
    if (dir === 'right') {
      setLiked(prev => [...prev, currentCoach.id]);
      toast.success(`You liked ${currentCoach.name}!`, { icon: '❤️' });
    } else {
      toast('Skipped', { icon: '👋' });
    }
    setTimeout(() => {
      setSwipeDir(null);
      setCurrentIndex(i => i + 1);
    }, 350);
  };

  const handleSave = () => {
    setSaved(prev => [...prev, currentCoach.id]);
    toast.success(`${currentCoach.name} saved!`, { icon: '⭐' });
  };

  const handleRequestTrial = () => {
    navigate('/book');
    toast.success('Opening booking flow...', { icon: '📅' });
  };

  const likedCoaches = sortedCoaches.filter(c => liked.includes(c.id));

  return (
    <AppLayout>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[oklch(0.965_0.012_220)]/95 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-display text-navy">Your Matches</h1>
          <div className="flex gap-1 bg-[oklch(0.955_0.010_220)] p-1 rounded-xl">
            {(['stack', 'liked'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-200 capitalize',
                  view === v ? 'bg-white text-navy shadow-sm' : 'text-muted-foreground'
                )}
              >
                {v === 'stack' ? 'Discover' : `Liked (${liked.length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === 'stack' ? (
        <div className="px-4 py-6">
          {currentIndex < sortedCoaches.length ? (
            <>
              {/* Match card */}
              <div className="relative mb-6">
                {/* Background card (next) */}
                {currentIndex + 1 < sortedCoaches.length && (
                  <div className="absolute inset-x-4 top-3 bottom-0 bg-white rounded-3xl border border-border/50 shadow-sm" />
                )}

                {/* Main card */}
                <div
                  className={cn(
                    'relative bg-white rounded-3xl border border-border/50 overflow-hidden shadow-xl transition-transform',
                    swipeDir === 'left' && 'swipe-left',
                    swipeDir === 'right' && 'swipe-right'
                  )}
                  style={{ boxShadow: '0 20px 60px rgba(12,198,198,0.15)' }}
                >
                  {/* Photo */}
                  <div className="relative" style={{ height: 380 }}>
                    <img
                      src={currentCoach.photo}
                      alt={currentCoach.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* Match badge */}
                    <div className="absolute top-4 right-4">
                      <div className="match-badge px-4 py-2 rounded-2xl text-center shadow-lg">
                        <div className="text-2xl font-extrabold font-display leading-none">{currentCoach.matchScore}%</div>
                        <div className="text-xs opacity-90">Match</div>
                      </div>
                    </div>

                    {/* Verified */}
                    {currentCoach.verified && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-[oklch(0.72_0.13_200)]" />
                        <span className="text-xs font-semibold text-[oklch(0.72_0.13_200)]">Verified</span>
                      </div>
                    )}

                    {/* Coach info overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-2xl font-extrabold text-white font-display">{currentCoach.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          <Star size={13} className="fill-amber-400 text-amber-400" />
                          <span className="text-white font-semibold text-sm">{currentCoach.rating}</span>
                          <span className="text-white/70 text-xs">({currentCoach.reviewCount})</span>
                        </div>
                        <span className="text-white/50">·</span>
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-white/70" />
                          <span className="text-white/70 text-xs">{currentCoach.distance}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {currentCoach.specialities.map(s => (
                        <Badge key={s} className="bg-[oklch(0.93_0.05_200)] text-[oklch(0.52_0.14_200)] border-0 text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{currentCoach.bio}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">Hourly Rate</div>
                        <div className="text-xl font-bold font-display text-[oklch(0.72_0.13_200)]">${currentCoach.hourlyRate}/hr</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Experience</div>
                        <div className="text-xl font-bold font-display text-navy">{currentCoach.experience} yrs</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Students</div>
                        <div className="text-xl font-bold font-display text-navy">{currentCoach.studentCount}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handleSwipe('left')}
                  className="w-14 h-14 rounded-full bg-white border-2 border-red-200 flex items-center justify-center shadow-md active:scale-95 transition-transform"
                >
                  <X size={24} className="text-red-400" />
                </button>
                <button
                  onClick={handleSave}
                  className="w-12 h-12 rounded-full bg-white border-2 border-amber-200 flex items-center justify-center shadow-md active:scale-95 transition-transform"
                >
                  <Bookmark size={20} className="text-amber-400" />
                </button>
                <button
                  onClick={() => handleSwipe('right')}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-[oklch(0.72_0.13_200)] to-[oklch(0.62_0.13_200)] flex items-center justify-center shadow-lg shadow-[oklch(0.72_0.13_200)]/30 active:scale-95 transition-transform"
                >
                  <Heart size={24} className="text-white fill-white" />
                </button>
                <button
                  onClick={handleRequestTrial}
                  className="w-12 h-12 rounded-full bg-white border-2 border-[oklch(0.72_0.13_200)]/30 flex items-center justify-center shadow-md active:scale-95 transition-transform"
                >
                  <Calendar size={20} className="text-[oklch(0.72_0.13_200)]" />
                </button>
              </div>

              {/* Progress */}
              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  {currentIndex + 1} of {sortedCoaches.length} coaches · {sortedCoaches.length - currentIndex - 1} remaining
                </p>
                <div className="flex gap-1 justify-center mt-2">
                  {sortedCoaches.slice(0, Math.min(8, sortedCoaches.length)).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-1 rounded-full transition-all duration-300',
                        i < currentIndex ? 'w-2 bg-[oklch(0.72_0.13_200)]' :
                        i === currentIndex ? 'w-4 bg-[oklch(0.72_0.13_200)]' :
                        'w-2 bg-[oklch(0.92_0.005_220)]'
                      )}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            // All coaches viewed
            <div className="text-center py-16">
              <div
                className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, oklch(0.76 0.14 192), oklch(0.68 0.19 22))' }}
              >
                <Heart size={36} className="text-white fill-white" />
              </div>
              <h2 className="text-xl font-bold font-display text-navy mb-2">You've seen all coaches!</h2>
              <p className="text-sm text-muted-foreground mb-6">
                You liked {liked.length} coach{liked.length !== 1 ? 'es' : ''}. Check your liked list or explore more.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => { setCurrentIndex(0); setLiked([]); }}>
                  Start Over
                </Button>
                <Button
                  className="bg-[oklch(0.72_0.13_200)] text-white"
                  onClick={() => setView('liked')}
                >
                  View Liked ({liked.length})
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Liked coaches list
        <div className="px-4 py-4">
          {likedCoaches.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Heart size={40} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">No liked coaches yet. Start swiping!</p>
              <Button variant="outline" className="mt-4" onClick={() => setView('stack')}>
                Discover Coaches
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground mb-3">{likedCoaches.length} liked coaches</p>
              {likedCoaches.map(coach => (
                <div key={coach.id} className="bg-white rounded-2xl border border-border/50 p-3 shadow-sm">
                  <div className="flex gap-3">
                    <img src={coach.photo} alt={coach.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm font-display text-navy">{coach.name}</h3>
                        <span className="match-badge text-xs px-2 py-0.5 rounded-full">{coach.matchScore}%</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs">{coach.rating}</span>
                        <span className="text-xs text-muted-foreground">· {coach.distance}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs text-muted-foreground">{coach.specialities[0]}</span>
                        <span className="text-sm font-bold text-[oklch(0.72_0.13_200)] font-display">${coach.hourlyRate}/hr</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2.5">
                    <button
                      onClick={() => navigate('/chat')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-[oklch(0.93_0.05_200)] text-[oklch(0.52_0.14_200)] active:scale-95 transition-transform"
                    >
                      <MessageCircle size={13} /> Message
                    </button>
                    <Link href={`/coach/${coach.id}`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-[oklch(0.965_0.012_220)] text-navy active:scale-95 transition-transform">
                        View Profile
                      </button>
                    </Link>
                    <Link href="/book" className="flex-1">
                      <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-[oklch(0.72_0.13_200)] text-white active:scale-95 transition-transform">
                        <Calendar size={13} /> Book
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
              <Link href="/book">
                <Button className="w-full bg-[oklch(0.72_0.13_200)] text-white rounded-xl mt-2">
                  <Calendar size={16} className="mr-2" />
                  Book a Trial Lesson
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
