// Booking — 4-step trial lesson booking flow
// Design: Aqua Clarity — step progress, coach selection, location validation, payment messaging
// Updated: Removed pool selection, restricted to Condo/Landed only, updated payment/lesson messaging

import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, Calendar, Clock, MapPin, CheckCircle2, MessageCircle, Info, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/components/AppLayout';
import { coaches } from '@/lib/mockData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const STEPS = ['Coach', 'Location', 'Date & Time', 'Confirm'];

export default function Booking() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [selectedCoach, setSelectedCoach] = useState(coaches[0]);
  const [locationType, setLocationType] = useState<'Condo' | 'Landed' | ''>('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else {
      toast.success('Booking request sent! Redirecting to WhatsApp...', { icon: '💬' });
      // Final production behavior: redirect to WhatsApp intro
      const whatsappMsg = encodeURIComponent(`Hi ${selectedCoach.name}, I'd like to book a trial swim lesson at my ${locationType} (${address}) on ${date} at ${time}. Found you on SwimXP!`);
      setTimeout(() => {
        window.open(`https://wa.me/6591234567?text=${whatsappMsg}`, '_blank');
        navigate('/dashboard');
      }, 1500);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <AppLayout hideNav>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/')} className="w-8 h-8 rounded-xl bg-[oklch(0.97_0.005_220)] flex items-center justify-center">
            <ChevronLeft size={16} />
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</span>
              <span className="text-xs font-semibold text-[oklch(0.76_0.14_192)]">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-[oklch(0.92_0.005_220)] rounded-full overflow-hidden">
              <div className="h-full bg-[oklch(0.76_0.14_192)] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        <h1 className="text-lg font-bold font-display text-navy">{STEPS[step]}</h1>
      </div>

      <div className="px-4 py-6 animate-fade-up">
        {/* Step 0: Coach Selection */}
        {step === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">Select your preferred coach for the trial lesson.</p>
            {coaches.slice(0, 5).map(coach => (
              <div
                key={coach.id}
                onClick={() => setSelectedCoach(coach)}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer',
                  selectedCoach.id === coach.id ? 'border-[oklch(0.76_0.14_192)] bg-[oklch(0.95_0.04_192)]' : 'border-border bg-white'
                )}
              >
                <img src={coach.photo} alt={coach.name} className="w-14 h-14 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-navy">{coach.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    <span>{coach.rating}</span> · <span>${coach.hourlyRate}/hr</span>
                  </div>
                </div>
                {selectedCoach.id === coach.id && <CheckCircle2 size={20} className="text-[oklch(0.76_0.14_192)]" />}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Location (Condo/Landed only) */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
              <Info size={18} className="text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">
                SwimXP coaches only travel to **private residences (Condominiums or Landed Estates)** with their own pools. We do not support public pools at this time.
              </p>
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-navy">Lesson Location Type</Label>
              <div className="grid grid-cols-2 gap-3">
                {['Condo', 'Landed'].map(type => (
                  <button
                    key={type}
                    onClick={() => setLocationType(type as any)}
                    className={cn(
                      'py-3 rounded-xl font-semibold text-sm border-2 transition-all',
                      locationType === type ? 'border-[oklch(0.76_0.14_192)] bg-[oklch(0.95_0.04_192)] text-[oklch(0.76_0.14_192)]' : 'border-border text-muted-foreground'
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-navy">Full Address / Condo Name</Label>
              <Input
                placeholder="e.g. The Sail @ Marina Bay, 2 Marina Blvd"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="rounded-xl bg-[oklch(0.97_0.005_220)] border-0"
              />
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-navy">Preferred Date</Label>
              <Input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="rounded-xl bg-[oklch(0.97_0.005_220)] border-0"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-navy">Preferred Time</Label>
              <div className="grid grid-cols-3 gap-2">
                {['09:00', '10:00', '11:00', '15:00', '16:00', '17:00'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={cn(
                      'py-2 rounded-lg text-xs font-medium border transition-all',
                      time === t ? 'bg-[oklch(0.76_0.14_192)] text-white border-transparent' : 'bg-white text-muted-foreground border-border'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-border/50 overflow-hidden shadow-sm">
              <div className="p-4 bg-[oklch(0.97_0.005_220)] border-b border-border/50">
                <h3 className="font-bold text-navy font-display">Booking Summary</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Coach</span>
                  <span className="font-semibold text-navy">{selectedCoach.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-semibold text-navy">{locationType} · {address}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span className="font-semibold text-navy">{date} @ {time}</span>
                </div>
                <div className="pt-3 border-t border-dashed border-border flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold text-navy">Trial Lesson Fee</span>
                    <p className="text-[10px] text-muted-foreground">45-minute private session</p>
                  </div>
                  <span className="text-xl font-bold text-[oklch(0.76_0.14_192)]">${selectedCoach.hourlyRate}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 flex gap-3">
              <MessageCircle size={18} className="text-blue-600 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-blue-900">What happens next?</p>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Clicking "Confirm Booking" will introduce you to **{selectedCoach.name}** via WhatsApp to finalize the schedule.
                </p>
                <p className="text-[11px] text-blue-800 font-semibold mt-1">
                  💡 Note: Regular lessons are typically booked in blocks of 4 to ensure consistent progress.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8">
          <Button
            onClick={handleNext}
            disabled={
              (step === 1 && (!locationType || !address)) ||
              (step === 2 && (!date || !time))
            }
            className="w-full h-12 bg-[oklch(0.76_0.14_192)] hover:bg-[oklch(0.65_0.14_192)] text-white rounded-2xl font-semibold shadow-lg shadow-[oklch(0.76_0.14_192)]/20"
          >
            {step === STEPS.length - 1 ? (
              <>Confirm Booking <CheckCircle2 size={16} className="ml-2" /></>
            ) : (
              <>Continue <ChevronRight size={16} className="ml-1" /></>
            )}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
