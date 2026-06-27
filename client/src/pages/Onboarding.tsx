// Onboarding — Swimmer registration flow (All Ages: Children, Teens, Adults)
// Design: Aqua Clarity — step progress, animated transitions, waiver modal
// Private-property-only: Condo Pool / Landed Estate only. No public ActiveSG pools.
// Swimmer profile: flexible — register yourself (Adult) or a child/teen.

import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, CheckCircle2, AlertTriangle, User, Users } from 'lucide-react';
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

const SWIM_LEVELS = ['Non-swimmer', 'Beginner', 'Intermediate', 'Advanced', 'Competitive'];
const LANGUAGES = ['English', 'Mandarin', 'Malay', 'Tamil', 'Hindi', 'Korean', 'Filipino'];
const SCHEDULE_PREFS = ['Weekday Mornings', 'Weekday Afternoons', 'Weekday Evenings', 'Weekend Mornings', 'Weekend Afternoons'];
const REGIONS = ['Central', 'North', 'North-East', 'East', 'West'];

const CHILD_AGE_GROUPS = ['2–4 yrs', '5–7 yrs', '8–10 yrs', '11–13 yrs', '14–17 yrs'];
const ADULT_AGE_GROUPS = ['18–25', '26–35', '36–45', '46–55', '56+'];

const STEPS = [
  { title: 'Welcome', subtitle: "Let's find your perfect coach" },
  { title: 'Your Details', subtitle: 'Tell us about yourself' },
  { title: 'Swimmer Profile', subtitle: 'Who are we coaching?' },
  { title: 'Lesson Location', subtitle: 'Your private pool details' },
  { title: 'Preferences', subtitle: 'What matters most to you?' },
  { title: 'Waiver', subtitle: 'Almost done!' },
];

// Validation Schema
const onboardingSchema = z.object({
  parentName: z.string().min(3, "Name must be at least 3 characters").regex(/^[a-zA-Z\s\-]+$/, "Name can only contain letters, spaces, and hyphens"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{8,15}$/, "Phone must be 8-15 digits"),
  nric: z.string().regex(/^\d{3}[A-Z]$/i, "NRIC must be 3 digits followed by a letter (e.g., 123A)"),
  emergencyName: z.string().min(3, "Name must be at least 3 characters").regex(/^[a-zA-Z\s\-]+$/, "Name can only contain letters, spaces, and hyphens"),
  emergencyPhone: z.string().regex(/^\d{8,15}$/, "Phone must be 8-15 digits"),
  swimmerName: z.string().min(3, "Name must be at least 3 characters").regex(/^[a-zA-Z\s\-]+$/, "Name can only contain letters, spaces, and hyphens"),
  swimmerAge: z.string().min(1, "Age is required"),
  swimLevel: z.string().min(1, "Level is required"),
  region: z.string().min(1, "Region is required"),
  locationType: z.enum(['condo', 'landed', '']),
  condoName: z.string().optional(),
  condoPostal: z.string().optional(),
  landedAddress: z.string().optional(),
}).refine(data => data.phone !== data.emergencyPhone, {
  message: "Emergency contact cannot be the same as primary phone",
  path: ["emergencyPhone"]
});

export default function Onboarding() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const [swimmerType, setSwimmerType] = useState<'self' | 'child' | ''>('');

  const [form, setForm] = useState({
    parentName: '',
    email: '',
    phone: '',
    nric: '',
    emergencyName: '',
    emergencyPhone: '',
    swimmerName: '',
    swimmerAge: '',
    swimLevel: '',
    goals: [] as string[],
    customGoal: '',
    language: '',
    region: '',
    locationType: '' as 'condo' | 'landed' | '',
    condoName: '',
    condoPostal: '',
    landedAddress: '',
    schedule: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const setRoleMutation = trpc.auth.setPlatformRole.useMutation();
  const saveProfileMutation = trpc.clientProfile.saveProfile.useMutation();
  const registerPoolMutation = trpc.poolHost.registerPool.useMutation();

  const set = (key: keyof typeof form, val: any) => {
    setForm(f => ({ ...f, [key]: val }));
    // Clear error when user types
    if (errors[key]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const toggleSchedule = (s: string) =>
    setForm(f => ({ ...f, schedule: f.schedule.includes(s) ? f.schedule.filter(x => x !== s) : [...f.schedule, s] }));

  const validateStep = () => {
    try {
      if (step === 1) {
        onboardingSchema.pick({ parentName: true, email: true, phone: true, nric: true, emergencyName: true, emergencyPhone: true }).parse(form);
      } else if (step === 2) {
        onboardingSchema.pick({ swimmerName: true, swimmerAge: true, swimLevel: true }).parse(form);
      } else if (step === 3) {
        onboardingSchema.pick({ region: true, locationType: true }).parse(form);
        if (form.locationType === 'condo' && (!form.condoName || !form.condoPostal)) throw new Error("Condo details required");
        if (form.locationType === 'landed' && (!form.condoName || !form.landedAddress)) throw new Error("Landed details required");
      }
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach(e => { if (e.path[0]) newErrors[e.path[0] as string] = e.message; });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNext = async () => {
    if (step > 0 && !validateStep()) {
      toast.error('Please fix the errors before continuing');
      return;
    }

    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      if (!waiverAccepted) {
        toast.error('Please accept the waiver to continue');
        return;
      }
      try {
        await setRoleMutation.mutateAsync({ role: 'client' });
        let poolId: number | undefined;
        if (form.locationType) {
          const poolResult = await registerPoolMutation.mutateAsync({
            poolType: form.locationType === 'condo' ? 'condominium' : 'landed_estate',
            estateName: form.condoName,
            fullAddress: form.locationType === 'condo' ? `${form.condoName}, Singapore ${form.condoPostal}` : form.landedAddress,
            postalCode: form.condoPostal || '000000',
            mcstApproved: true,
          });
          poolId = poolResult.id;
        }
        await saveProfileMutation.mutateAsync({
          swimmerType: swimmerType === 'self' ? 'adult_self' : 'child',
          swimmerName: form.swimmerName,
          swimmerAge: parseInt(form.swimmerAge) || 0,
          swimLevel: form.swimLevel.toLowerCase().replace('-', '_') as any,
          goals: JSON.stringify({ goals: form.goals, customGoal: form.customGoal, language: form.language, schedule: form.schedule, region: form.region }),
          preferredPoolId: poolId,
        });
        toast.success('Profile created! Finding your matches...', { icon: '🎉' });
        setTimeout(() => navigate('/matches'), 1200);
      } catch (err: any) {
        toast.error(err.message || 'Failed to complete onboarding');
      }
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
        {step === 0 && (
          <div className="text-center py-8">
            <img src={LOGO_IMG} alt="SwimXP" className="h-32 w-auto object-contain mx-auto mb-5" />
            <h2 className="text-2xl font-extrabold font-display text-navy mb-3">Welcome to SwimXP</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">We match swimmers of all ages with certified private coaches.</p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <RequiredField label="Full Name (as per NRIC)" error={errors.parentName}>
              <Input type="text" placeholder="e.g. John Tan Wei Jie" value={form.parentName} onChange={e => set('parentName', e.target.value)} />
            </RequiredField>
            <RequiredField label="Email Address" error={errors.email}>
              <Input type="email" autocomplete="email" placeholder="e.g. john.tan@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </RequiredField>
            <RequiredField label="Mobile Number" error={errors.phone}>
              <Input type="tel" inputmode="numeric" pattern="[0-9]*" placeholder="e.g. 91234567" value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, ''))} />
            </RequiredField>
            <RequiredField label="NRIC / FIN (last 4 characters)" error={errors.nric}>
              <Input type="text" placeholder="e.g. 567A" value={form.nric} onChange={e => set('nric', e.target.value.toUpperCase())} maxLength={4} />
            </RequiredField>
            <RequiredField label="Emergency Contact Name" error={errors.emergencyName}>
              <Input type="text" placeholder="e.g. Mary Lim" value={form.emergencyName} onChange={e => set('emergencyName', e.target.value)} />
            </RequiredField>
            <RequiredField label="Emergency Contact Number" error={errors.emergencyPhone}>
              <Input type="tel" inputmode="numeric" pattern="[0-9]*" placeholder="e.g. 81234567" value={form.emergencyPhone} onChange={e => set('emergencyPhone', e.target.value.replace(/\D/g, ''))} />
            </RequiredField>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <Button variant={swimmerType === 'self' ? 'default' : 'outline'} onClick={() => { setSwimmerType('self'); set('swimmerName', form.parentName); }}>
                <User className="mr-2 h-4 w-4" /> Myself
              </Button>
              <Button variant={swimmerType === 'child' ? 'default' : 'outline'} onClick={() => { setSwimmerType('child'); set('swimmerName', ''); }}>
                <Users className="mr-2 h-4 w-4" /> Child / Teen
              </Button>
            </div>
            {swimmerType && (
              <div className="space-y-4">
                <RequiredField label="Swimmer Name" error={errors.swimmerName}>
                  <Input type="text" placeholder="e.g. Tan Xiao Ming" value={form.swimmerName} onChange={e => set('swimmerName', e.target.value)} />
                </RequiredField>
                <RequiredField label="Age" error={errors.swimmerAge}>
                  <select className="w-full p-2 rounded-md border text-sm" value={form.swimmerAge} onChange={e => set('swimmerAge', e.target.value)}>
                    <option value="">Select Age</option>
                    {(swimmerType === 'child' ? CHILD_AGE_GROUPS : ADULT_AGE_GROUPS).map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </RequiredField>
                <RequiredField label="Swim Level" error={errors.swimLevel}>
                  <div className="flex flex-wrap gap-2">
                    {SWIM_LEVELS.map(l => (
                      <Button key={l} variant={form.swimLevel === l ? 'default' : 'outline'} size="sm" onClick={() => set('swimLevel', l)}>{l}</Button>
                    ))}
                  </div>
                </RequiredField>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <RequiredField label="Region" error={errors.region}>
              <select className="w-full p-2 rounded-md border text-sm" value={form.region} onChange={e => set('region', e.target.value)}>
                <option value="">Select Region</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </RequiredField>
            <RequiredField label="Location Type" error={errors.locationType}>
              <div className="grid grid-cols-2 gap-3">
                <Button variant={form.locationType === 'condo' ? 'default' : 'outline'} onClick={() => set('locationType', 'condo')}>Condo</Button>
                <Button variant={form.locationType === 'landed' ? 'default' : 'outline'} onClick={() => set('locationType', 'landed')}>Landed</Button>
              </div>
            </RequiredField>
            {form.locationType === 'condo' && (
              <>
                <RequiredField label="Condo Name">
                  <Input type="text" placeholder="e.g. The Rivervale" value={form.condoName} onChange={e => set('condoName', e.target.value)} />
                </RequiredField>
                <RequiredField label="Postal Code">
                  <Input type="tel" inputmode="numeric" pattern="[0-9]*" placeholder="e.g. 543210" value={form.condoPostal} onChange={e => set('condoPostal', e.target.value.replace(/\D/g, ''))} maxLength={6} />
                </RequiredField>
              </>
            )}
            {form.locationType === 'landed' && (
              <>
                <RequiredField label="Estate Name">
                  <Input type="text" placeholder="e.g. Serangoon Gardens" value={form.condoName} onChange={e => set('condoName', e.target.value)} />
                </RequiredField>
                <RequiredField label="Full Address">
                  <Input type="text" placeholder="e.g. 123 Flower Road" value={form.landedAddress} onChange={e => set('landedAddress', e.target.value)} />
                </RequiredField>
              </>
            )}
          </div>
        )}

        <div className="mt-8">
          <Button className="w-full" onClick={handleNext} disabled={setRoleMutation.isPending || saveProfileMutation.isPending}>
            {step === STEPS.length - 1 ? (saveProfileMutation.isPending ? 'Saving...' : 'Complete Registration') : 'Continue'}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

function RequiredField({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold text-navy flex items-center gap-1">
        {label} <span className="text-destructive">*</span>
      </Label>
      {children}
      {error && <p className="text-[10px] text-destructive font-medium">{error}</p>}
    </div>
  );
}
