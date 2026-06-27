// Booking — 5-step lesson booking flow
// Design: Aqua Clarity — step progress, coach/pool/date/time/confirm

import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, ChevronRight, CheckCircle2, Calendar, Clock, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/AppLayout';
import { coaches, pools } from '@/lib/mockData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const STEPS = ['Coach', 'Pool', 'Date', 'Time', 'Confirm'];
const TIMES = ['07:00', '08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

function getDates() {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export default function Booking() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState({
    coach: coaches[0],
    pool: pools[0],
    date: null as Date | null,
    time: '',
  });

  const dates = getDates();
  const progress = (step / (STEPS.length - 1)) * 100;

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else {
      toast.success('Lesson booked! See you at the pool! 🏊', { duration: 3000 });
      setTimeout(() => navigate('/schedule'), 1500);
    }
  };

  const canProceed = () => {
    if (step === 2) return selected.date !== null;
    if (step === 3) return selected.time !== '';
    return true;
  };

  return (
    <AppLayout hideNav>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[oklch(0.965_0.012_220)]/95 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1 as any)}
            className="w-8 h-8 rounded-xl bg-[oklch(0.955_0.010_220)] flex items-center justify-center"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</span>
              <div className="flex gap-1">
                {STEPS.map((s, i) => (
                  <div
                    key={s}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300',
                      i <= step ? 'bg-[oklch(0.72_0.13_200)]' : 'bg-[oklch(0.92_0.005_220)]',
                      i === step ? 'w-6' : 'w-3'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-lg font-bold font-display text-navy">
          {step === 0 ? 'Select Your Coach' :
           step === 1 ? 'Choose a Pool' :
           step === 2 ? 'Pick a Date' :
           step === 3 ? 'Select Time' :
           'Confirm Booking'}
        </h1>
      </div>

      <div className="px-4 py-4 animate-fade-up">
        {/* Step 0: Select Coach */}
        {step === 0 && (
          <div className="space-y-3">
            {coaches.slice(0, 8).map(coach => (
              <button
                key={coach.id}
                onClick={() => setSelected(s => ({ ...s, coach }))}
                className={cn(
                  'w-full flex gap-3 p-3 rounded-2xl border-2 transition-all text-left',
                  selected.coach.id === coach.id
                    ? 'border-[oklch(0.72_0.13_200)] bg-[oklch(0.93_0.05_200)]'
                    : 'border-border bg-white'
                )}
              >
                <img src={coach.photo} alt={coach.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm font-display text-navy">{coach.name}</h3>
                    {selected.coach.id === coach.id && <CheckCircle2 size={16} className="text-[oklch(0.72_0.13_200)]" />}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{coach.specialities[0]}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs font-semibold text-[oklch(0.72_0.13_200)]">${coach.hourlyRate}/hr</span>
                  </div>
                  {coach.matchScore && (
                    <span className="match-badge text-xs px-2 py-0.5 rounded-full mt-1 inline-block">
                      {coach.matchScore}% Match
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 1: Select Pool */}
        {step === 1 && (
          <div className="space-y-3">
            {pools.slice(0, 6).map(pool => (
              <button
                key={pool.id}
                onClick={() => setSelected(s => ({ ...s, pool }))}
                className={cn(
                  'w-full flex gap-3 p-3 rounded-2xl border-2 transition-all text-left',
                  selected.pool.id === pool.id
                    ? 'border-[oklch(0.72_0.13_200)] bg-[oklch(0.93_0.05_200)]'
                    : 'border-border bg-white'
                )}
              >
                <img src={pool.image} alt={pool.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm font-display text-navy truncate pr-2">{pool.name}</h3>
                    {selected.pool.id === pool.id && <CheckCircle2 size={16} className="text-[oklch(0.72_0.13_200)] flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={11} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{pool.distance}</span>
                  </div>
                  <span className="text-xs font-semibold text-[oklch(0.72_0.13_200)]">${pool.rentalRate}/hr rental</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Select Date */}
        {step === 2 && (
          <div>
            <div className="grid grid-cols-4 gap-2">
              {dates.map(date => {
                const isSelected = selected.date?.toDateString() === date.toDateString();
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelected(s => ({ ...s, date }))}
                    className={cn(
                      'flex flex-col items-center py-3 rounded-2xl border-2 transition-all',
                      isSelected
                        ? 'border-[oklch(0.72_0.13_200)] bg-[oklch(0.72_0.13_200)] text-white'
                        : 'border-border bg-white text-foreground'
                    )}
                  >
                    <span className={cn('text-[10px] font-medium', isSelected ? 'text-white/80' : 'text-muted-foreground')}>
                      {dayNames[date.getDay()]}
                    </span>
                    <span className="text-lg font-bold font-display">{date.getDate()}</span>
                    <span className={cn('text-[10px]', isSelected ? 'text-white/80' : 'text-muted-foreground')}>
                      {date.toLocaleString('default', { month: 'short' })}
                    </span>
                  </button>
                );
              })}
            </div>
            {selected.date && (
              <div className="mt-4 bg-[oklch(0.93_0.05_200)] rounded-2xl p-3 flex items-center gap-2">
                <Calendar size={16} className="text-[oklch(0.72_0.13_200)]" />
                <span className="text-sm font-semibold text-[oklch(0.52_0.14_200)]">
                  Selected: {selected.date.toLocaleDateString('en-SG', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Select Time */}
        {step === 3 && (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Available slots for {selected.coach.name} on {selected.date?.toLocaleDateString('en-SG', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {TIMES.map(time => {
                const isAvailable = Math.random() > 0.3;
                const isSelected = selected.time === time;
                return (
                  <button
                    key={time}
                    onClick={() => isAvailable && setSelected(s => ({ ...s, time }))}
                    disabled={!isAvailable}
                    className={cn(
                      'py-3 rounded-2xl border-2 text-sm font-semibold transition-all',
                      isSelected
                        ? 'border-[oklch(0.72_0.13_200)] bg-[oklch(0.72_0.13_200)] text-white'
                        : isAvailable
                        ? 'border-border bg-white text-foreground hover:border-[oklch(0.72_0.13_200)]'
                        : 'border-border bg-[oklch(0.955_0.010_220)] text-muted-foreground/40 line-through cursor-not-allowed'
                    )}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[oklch(0.72_0.13_200)]" /> Available</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[oklch(0.955_0.010_220)] border" /> Unavailable</div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="bg-[oklch(0.93_0.05_200)] rounded-3xl p-5">
              <h2 className="font-bold text-base font-display text-navy mb-4">Booking Summary</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src={selected.coach.photo} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <p className="font-semibold text-sm font-display text-navy">{selected.coach.name}</p>
                    <p className="text-xs text-muted-foreground">{selected.coach.specialities[0]}</p>
                  </div>
                </div>
                <div className="h-px bg-border/50" />
                {[
                  { icon: MapPin, label: 'Pool', value: selected.pool.name },
                  { icon: Calendar, label: 'Date', value: selected.date?.toLocaleDateString('en-SG', { weekday: 'long', day: 'numeric', month: 'long' }) ?? '' },
                  { icon: Clock, label: 'Time', value: `${selected.time} (45 minutes)` },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
                      <item.icon size={14} className="text-[oklch(0.72_0.13_200)]" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-semibold text-navy">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="bg-white rounded-2xl border border-border/50 p-4">
              <h3 className="font-semibold text-sm font-display text-navy mb-3">Price Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coach fee (45 min)</span>
                  <span className="font-medium">${Math.round(selected.coach.hourlyRate * 0.75)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pool rental (45 min)</span>
                  <span className="font-medium">${Math.round(selected.pool.rentalRate * 0.75)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform fee</span>
                  <span className="font-medium">$5</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between font-bold text-base">
                  <span className="font-display text-navy">Total</span>
                  <span className="text-[oklch(0.72_0.13_200)]">
                    ${Math.round(selected.coach.hourlyRate * 0.75) + Math.round(selected.pool.rentalRate * 0.75) + 5}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-3 flex items-start gap-2">
              <span className="text-lg">💡</span>
              <p className="text-xs text-amber-700">This is a mock booking — no actual payment will be processed.</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 bg-[oklch(0.965_0.012_220)]/95 backdrop-blur-xl border-t border-border/50 p-4 pb-safe">
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full bg-[oklch(0.72_0.13_200)] hover:bg-[oklch(0.62_0.13_200)] text-white rounded-2xl font-semibold h-12 text-base disabled:opacity-50"
        >
          {step === STEPS.length - 1 ? (
            <>Confirm Booking <CheckCircle2 size={16} className="ml-2" /></>
          ) : (
            <>Continue <ChevronRight size={16} className="ml-1" /></>
          )}
        </Button>
      </div>
    </AppLayout>
  );
}
