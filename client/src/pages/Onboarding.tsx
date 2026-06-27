// Onboarding — Student concierge questionnaire
// Design: Aqua Clarity — step progress, animated transitions
// Collects: Name, Email, Mobile, Postal Code, Lesson Location, Swimming Level, Goal, Preferred Days, Preferred Time
// Lesson Location: Condo Pool / Landed Property Pool only (no public pools).
// Closes with the Top 3 concierge recommendation promise.

import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, CheckCircle2, Building2, Home as HomeIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/components/AppLayout';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { z } from 'zod';

const LOGO_IMG = '/swimxp-logo-v3.png';

const LESSON_LOCATIONS = [
  { id: 'condo', label: 'Condo Pool', desc: 'Lessons at your condominium pool', icon: Building2 },
  { id: 'landed', label: 'Landed Property Pool', desc: 'Lessons at your private landed estate pool', icon: HomeIcon },
];
const SWIM_LEVELS = ['Non-swimmer', 'Beginner', 'Intermediate', 'Advanced', 'Competitive'];
const SWIM_GOALS = ['Water Confidence', 'Learn Freestyle', 'Stroke Correction', 'Competitive Training', 'Adult Beginner', 'Water Safety'];
const PREFERRED_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const PREFERRED_TIMES = ['Morning', 'Afternoon', 'Evening'];

const STEPS = [
  { title: 'Welcome', subtitle: "Let's find your perfect coach" },
  { title: 'Your Details', subtitle: 'How we reach you' },
  { title: 'Lesson Location', subtitle: 'Where you want to swim' },
  { title: 'Swimming Profile', subtitle: 'Your level & goal' },
  { title: 'Availability', subtitle: 'When works best' },
];

// Validation Schema
const onboardingSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').regex(/^[a-zA-Z\s\-]+$/, 'Name can only contain letters, spaces, and hyphens'),
  email: z.string().email('Please enter a valid email address'),
  mobile: z.string().regex(/^\d{8,15}$/, 'Mobile must be 8-15 digits'),
  postalCode: z.string().regex(/^\d{6}$/, 'Singapore postal code must be 6 digits'),
});

export default function Onboarding() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    postalCode: '',
    lessonLocation: '',
    swimLevel: '',
    goal: '',
    preferredDays: [] as string[],
    preferredTime: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const setRoleMutation = trpc.auth.setPlatformRole.useMutation();
  const saveProfileMutation = trpc.clientProfile.saveProfile.useMutation();

  const set = (key: keyof typeof form, val: any) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const toggleDay = (d: string) =>
    setForm(f => ({ ...f, preferredDays: f.preferredDays.includes(d) ? f.preferredDays.filter(x => x !== d) : [...f.preferredDays, d] }));

  const validateStep = () => {
    try {
      if (step === 1) {
        onboardingSchema.parse(form);
      } else if (step === 2) {
        if (!form.lessonLocation) throw new z.ZodError([{ code: 'custom', path: ['lessonLocation'], message: 'Please select a lesson location' }]);
      } else if (step === 3) {
        if (!form.swimLevel) throw new z.ZodError([{ code: 'custom', path: ['swimLevel'], message: 'Please select a swimming level' }]);
        if (!form.goal) throw new z.ZodError([{ code: 'custom', path: ['goal'], message: 'Please select a goal' }]);
      }
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((e) => { if (e.path[0]) newErrors[e.path[0] as string] = e.message; });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNext = async () => {
    if (step > 0 && step < 4 && !validateStep()) {
      toast.error('Please fix the errors before continuing');
      return;
    }

    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
      return;
    }

    if (form.preferredDays.length === 0 || !form.preferredTime) {
      toast.error('Please select your preferred days and time');
      return;
    }

    // Persist via existing tRPC wiring. The detailed concierge answers are stored
    // in the free-form `goals` JSON field accepted by clientProfile.saveProfile.
    try {
      if (isAuthenticated) {
        await setRoleMutation.mutateAsync({ role: 'client' });
        await saveProfileMutation.mutateAsync({
          swimmerType: 'adult_self',
          swimmerName: form.name,
          swimLevel: form.swimLevel.toLowerCase().replace('-', '_') as any,
          goals: JSON.stringify({
            name: form.name,
            email: form.email,
            mobile: form.mobile,
            postalCode: form.postalCode,
            lessonLocation: form.lessonLocation,
            goal: form.goal,
            preferredDays: form.preferredDays,
            preferredTime: form.preferredTime,
          }),
        });
      } else {
        // Not logged in — preserve answers and route to account creation/login.
        try { localStorage.setItem('swimxp_onboarding', JSON.stringify(form)); } catch {}
      }
      toast.success("Thanks! We'll prepare your Top 3 coach recommendations.", { icon: '🎯' });
      setTimeout(() => navigate(isAuthenticated ? '/matches' : '/register'), 1200);
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete onboarding');
    }
  };

  const progress = (step / (STEPS.length - 1)) * 100;

  return (
    <AppLayout hideNav>
      <div className="sticky top-0 z-40 bg-[oklch(0.965_0.012_220)]/95 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="w-8 h-8 rounded-xl bg-[oklch(0.955_0.010_220)] flex items-center justify-center">
              <ChevronLeft size={16} />
            </button>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</span>
              <span className="text-xs font-semibold text-[oklch(0.72_0.13_200)]">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-[oklch(0.92_0.005_220)] rounded-full overflow-hidden">
              <div className="h-full bg-[oklch(0.72_0.13_200)] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        <h1 className="text-lg font-bold font-display text-navy">{STEPS[step].title}</h1>
        <p className="text-sm text-muted-foreground">{STEPS[step].subtitle}</p>
      </div>

      <div className="px-4 py-6 animate-fade-up">
        {/* Step 0 — Welcome */}
        {step === 0 && (
          <div className="text-center py-4">
            <img src={LOGO_IMG} alt="SwimXP" className="w-20 h-20 object-contain mx-auto mb-5" />
            <h2 className="text-2xl font-extrabold font-display text-navy mb-3">Your Concierge Match</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Answer a few quick questions and our team will personally curate the best coaches for you.
            </p>
            <div className="bg-[oklch(0.95_0.04_192)] border border-[oklch(0.76_0.14_192)]/30 rounded-2xl p-4 flex items-start gap-3 text-left">
              <Sparkles size={20} className="text-[oklch(0.76_0.14_192)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-navy font-medium leading-relaxed">
                We'll personally recommend the Top 3 coaches based on your goals, location and availability.
              </p>
            </div>
          </div>
        )}

        {/* Step 1 — Your Details */}
        {step === 1 && (
          <div className="space-y-4">
            <RequiredField label="Full Name" error={errors.name}>
              <Input type="text" placeholder="e.g. John Tan Wei Jie" value={form.name} onChange={e => set('name', e.target.value)} />
            </RequiredField>
            <RequiredField label="Email Address" error={errors.email}>
              <Input type="email" autoComplete="email" placeholder="e.g. john.tan@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </RequiredField>
            <RequiredField label="Mobile Number (WhatsApp)" error={errors.mobile}>
              <Input type="tel" inputMode="numeric" pattern="[0-9]*" placeholder="e.g. 91234567" value={form.mobile} onChange={e => set('mobile', e.target.value.replace(/\D/g, ''))} />
            </RequiredField>
            <RequiredField label="Postal Code" error={errors.postalCode}>
              <Input type="tel" inputMode="numeric" pattern="[0-9]*" maxLength={6} placeholder="e.g. 238801" value={form.postalCode} onChange={e => set('postalCode', e.target.value.replace(/\D/g, ''))} />
            </RequiredField>
          </div>
        )}

        {/* Step 2 — Lesson Location */}
        {step === 2 && (
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-navy">Where will lessons take place?</Label>
            {LESSON_LOCATIONS.map(loc => (
              <button
                key={loc.id}
                onClick={() => set('lessonLocation', loc.id)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left',
                  form.lessonLocation === loc.id ? 'border-[oklch(0.76_0.14_192)] bg-[oklch(0.95_0.04_192)]' : 'border-border bg-white'
                )}
              >
                <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', form.lessonLocation === loc.id ? 'bg-[oklch(0.76_0.14_192)] text-white' : 'bg-[oklch(0.955_0.010_220)] text-muted-foreground')}>
                  <loc.icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-navy">{loc.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{loc.desc}</p>
                </div>
                {form.lessonLocation === loc.id && <CheckCircle2 size={18} className="text-[oklch(0.76_0.14_192)]" />}
              </button>
            ))}
            {errors.lessonLocation && <p className="text-[10px] text-red-500 font-medium">{errors.lessonLocation}</p>}
          </div>
        )}

        {/* Step 3 — Swimming Profile */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-navy">Swimming Level</Label>
              <div className="flex flex-wrap gap-2">
                {SWIM_LEVELS.map(l => (
                  <button
                    key={l}
                    onClick={() => set('swimLevel', l)}
                    className={cn('text-xs px-3 py-2 rounded-full font-medium transition-all', form.swimLevel === l ? 'bg-[oklch(0.76_0.14_192)] text-white' : 'bg-[oklch(0.97_0.005_220)] text-muted-foreground')}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {errors.swimLevel && <p className="text-[10px] text-red-500 font-medium">{errors.swimLevel}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-navy">Primary Goal</Label>
              <div className="flex flex-wrap gap-2">
                {SWIM_GOALS.map(g => (
                  <button
                    key={g}
                    onClick={() => set('goal', g)}
                    className={cn('text-xs px-3 py-2 rounded-full font-medium transition-all', form.goal === g ? 'bg-[oklch(0.76_0.14_192)] text-white' : 'bg-[oklch(0.97_0.005_220)] text-muted-foreground')}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {errors.goal && <p className="text-[10px] text-red-500 font-medium">{errors.goal}</p>}
            </div>
          </div>
        )}

        {/* Step 4 — Availability */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-navy">Preferred Days (select multiple)</Label>
              <div className="flex flex-wrap gap-2">
                {PREFERRED_DAYS.map(d => (
                  <button
                    key={d}
                    onClick={() => toggleDay(d)}
                    className={cn('w-12 h-12 rounded-xl font-semibold text-sm transition-all', form.preferredDays.includes(d) ? 'bg-[oklch(0.76_0.14_192)] text-white' : 'bg-[oklch(0.97_0.005_220)] text-muted-foreground')}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-navy">Preferred Time</Label>
              <div className="grid grid-cols-3 gap-2">
                {PREFERRED_TIMES.map(t => (
                  <button
                    key={t}
                    onClick={() => set('preferredTime', t)}
                    className={cn('py-3 rounded-xl font-semibold text-sm transition-all', form.preferredTime === t ? 'bg-[oklch(0.76_0.14_192)] text-white' : 'bg-[oklch(0.97_0.005_220)] text-muted-foreground')}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-[oklch(0.95_0.04_192)] border border-[oklch(0.76_0.14_192)]/30 rounded-2xl p-4 flex items-start gap-3">
              <Sparkles size={20} className="text-[oklch(0.76_0.14_192)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-navy font-medium leading-relaxed">
                We'll personally recommend the Top 3 coaches based on your goals, location and availability.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8">
          <Button
            className="w-full h-12 bg-[oklch(0.72_0.13_200)] hover:bg-[oklch(0.62_0.13_200)] text-white rounded-2xl font-semibold shadow-lg"
            onClick={handleNext}
            disabled={setRoleMutation.isPending || saveProfileMutation.isPending}
          >
            {step === STEPS.length - 1 ? 'Get My Top 3 Coaches' : 'Continue'}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

function RequiredField({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-navy">{label}</Label>
      {children}
      {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
    </div>
  );
}
