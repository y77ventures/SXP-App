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

export default function Onboarding() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [waiverAccepted, setWaiverAccepted] = useState(false);

  // Swimmer type: 'self' = adult registering themselves; 'child' = registering a child/teen
  const [swimmerType, setSwimmerType] = useState<'self' | 'child' | ''>('');

  const [form, setForm] = useState({
    // Step 1 — Account holder
    parentName: '',
    email: '',
    phone: '',
    nric: '',
    emergencyName: '',
    emergencyPhone: '',
    // Step 2 — Swimmer profile (shared fields)
    swimmerName: '',
    swimmerAge: '',
    swimLevel: '',
    goals: [] as string[],
    customGoal: '',
    // Step 3 — Location
    language: '',
    region: '',
    locationType: '' as 'condo' | 'landed' | '',
    condoName: '',
    condoPostal: '',
    landedAddress: '',
    // Step 4 — Schedule
    schedule: [] as string[],
  });

  const setRoleMutation = trpc.auth.setPlatformRole.useMutation();
  const saveProfileMutation = trpc.clientProfile.saveProfile.useMutation();
  const registerPoolMutation = trpc.poolHost.registerPool.useMutation();

  const set = (key: keyof typeof form, val: string | string[]) =>
    setForm(f => ({ ...f, [key]: val }));

  const toggleGoal = (g: string) =>
    setForm(f => ({ ...f, goals: f.goals.includes(g) ? f.goals.filter(x => x !== g) : [...f.goals, g] }));

  const toggleSchedule = (s: string) =>
    setForm(f => ({ ...f, schedule: f.schedule.includes(s) ? f.schedule.filter(x => x !== s) : [...f.schedule, s] }));

  // Step-level validation
  const canProceed = () => {
    if (step === 1) return form.parentName && form.email && form.phone && form.nric && form.emergencyName && form.emergencyPhone;
    if (step === 2) return swimmerType && form.swimmerName && form.swimmerAge && form.swimLevel;
    if (step === 3) {
      if (!form.locationType || !form.region) return false;
      if (form.locationType === 'condo' && (!form.condoName || !form.condoPostal)) return false;
      if (form.locationType === 'landed' && (!form.condoName || !form.landedAddress)) return false;
      return true;
    }
    if (step === 4) return form.goals.length > 0 && form.language && form.schedule.length > 0;
    if (step === 5) return waiverAccepted;
    return true;
  };

  const handleNext = async () => {
    if (!canProceed()) {
      toast.error('Please complete all required fields before continuing');
      return;
    }
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      try {
        // 1. Set Platform Role
        await setRoleMutation.mutateAsync({ role: 'client' });

        // 2. Register Pool if applicable
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

        // 3. Save Client Profile
        await saveProfileMutation.mutateAsync({
          swimmerType: swimmerType === 'self' ? 'adult_self' : 'child',
          swimmerName: form.swimmerName,
          swimmerAge: parseInt(form.swimmerAge) || 0,
          swimLevel: form.swimLevel.toLowerCase().replace('-', '_') as any,
          goals: JSON.stringify({
            goals: form.goals,
            customGoal: form.customGoal,
            language: form.language,
            schedule: form.schedule,
            region: form.region
          }),
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
      {/* Header */}
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
              <div
                className="h-full bg-[oklch(0.72_0.13_200)] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        <h1 className="text-lg font-bold font-display text-navy">{STEPS[step].title}</h1>
        <p className="text-sm text-muted-foreground">{STEPS[step].subtitle}</p>
      </div>

      <div className="px-4 py-6 animate-fade-up">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="text-center py-8">
            <img src={LOGO_IMG} alt="SwimXP" className="h-32 w-auto object-contain mx-auto mb-5" />
            <h2 className="text-2xl font-extrabold font-display text-navy mb-3">Welcome to SwimXP</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              We match swimmers of all ages with certified private coaches. Answer a few quick questions to get started.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left mb-6">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-800 mb-1">Private Property Platform Only</p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    SwimXP operates exclusively at private condominium and landed estate pools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Account Holder */}
        {step === 1 && (
          <div className="space-y-4">
            <Label>Full Name (as per NRIC)</Label>
            <Input value={form.parentName} onChange={e => set('parentName', e.target.value)} />
            <Label>Email Address</Label>
            <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} />
            <Label>Mobile Number</Label>
            <Input value={form.phone} onChange={e => set('phone', e.target.value)} />
            <Label>NRIC / FIN (last 4 characters)</Label>
            <Input value={form.nric} onChange={e => set('nric', e.target.value.toUpperCase())} maxLength={4} />
            <Label>Emergency Contact Name</Label>
            <Input value={form.emergencyName} onChange={e => set('emergencyName', e.target.value)} />
            <Label>Emergency Contact Number</Label>
            <Input value={form.emergencyPhone} onChange={e => set('emergencyPhone', e.target.value)} />
          </div>
        )}

        {/* Step 2: Swimmer Profile */}
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
                <Label>Swimmer Name</Label>
                <Input value={form.swimmerName} onChange={e => set('swimmerName', e.target.value)} />
                <Label>Age</Label>
                <select className="w-full p-2 rounded-md border" value={form.swimmerAge} onChange={e => set('swimmerAge', e.target.value)}>
                  <option value="">Select Age</option>
                  {(swimmerType === 'child' ? CHILD_AGE_GROUPS : ADULT_AGE_GROUPS).map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <Label>Swim Level</Label>
                <div className="flex flex-wrap gap-2">
                  {SWIM_LEVELS.map(l => (
                    <Button key={l} variant={form.swimLevel === l ? 'default' : 'outline'} size="sm" onClick={() => set('swimLevel', l)}>{l}</Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <div className="space-y-4">
            <Label>Region</Label>
            <select className="w-full p-2 rounded-md border" value={form.region} onChange={e => set('region', e.target.value)}>
              <option value="">Select Region</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <Label>Location Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button variant={form.locationType === 'condo' ? 'default' : 'outline'} onClick={() => set('locationType', 'condo')}>Condo</Button>
              <Button variant={form.locationType === 'landed' ? 'default' : 'outline'} onClick={() => set('locationType', 'landed')}>Landed</Button>
            </div>
            {form.locationType === 'condo' && (
              <>
                <Label>Condo Name</Label>
                <Input value={form.condoName} onChange={e => set('condoName', e.target.value)} />
                <Label>Postal Code</Label>
                <Input value={form.condoPostal} onChange={e => set('condoPostal', e.target.value)} maxLength={6} />
              </>
            )}
            {form.locationType === 'landed' && (
              <>
                <Label>Estate Name</Label>
                <Input value={form.condoName} onChange={e => set('condoName', e.target.value)} />
                <Label>Full Address</Label>
                <Input value={form.landedAddress} onChange={e => set('landedAddress', e.target.value)} />
              </>
            )}
          </div>
        )}

        {/* Step 4: Preferences */}
        {step === 4 && (
          <div className="space-y-4">
            <Label>Preferred Language</Label>
            <select className="w-full p-2 rounded-md border" value={form.language} onChange={e => set('language', e.target.value)}>
              <option value="">Select Language</option>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <Label>Preferred Schedule</Label>
            <div className="flex flex-wrap gap-2">
              {SCHEDULE_PREFS.map(s => (
                <Button key={s} variant={form.schedule.includes(s) ? 'default' : 'outline'} size="sm" onClick={() => toggleSchedule(s)}>{s}</Button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Waiver */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/20 h-64 overflow-y-auto text-xs">
              <p className="font-bold mb-2">SwimXP Liability Waiver & Release</p>
              <p>I hereby acknowledge that swimming involves inherent risks...</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={waiverAccepted} onChange={e => setWaiverAccepted(e.target.checked)} />
              <Label className="text-xs">I accept the terms and conditions</Label>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8">
          <Button className="w-full" onClick={handleNext} disabled={!canProceed() || setRoleMutation.isPending || saveProfileMutation.isPending}>
            {step === STEPS.length - 1 ? (saveProfileMutation.isPending ? 'Saving...' : 'Complete Registration') : 'Continue'}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

function RequiredField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold text-navy flex items-center gap-1">
        {label} <span className="text-destructive">*</span>
      </Label>
      {children}
    </div>
  );
}
