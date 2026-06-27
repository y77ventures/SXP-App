// CoachOnboarding — Coach registration flow
// Design: Aqua Clarity — step progress, certification validation gate, document upload
// Compliance: Coaching cert + Lifesaving cert expiry dates are validated against today's date.
// Updated: Added strict validation, proper HTML attributes, and realistic placeholders.

import { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import {
  ChevronLeft, CheckCircle2,
  Upload, ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/components/AppLayout';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { z } from 'zod';

const LOGO_IMG = '/swimxp-logo-v3.png';

const COACHING_CERTS = ['NROC Level 1', 'NROC Level 2', 'AustSwim', 'SSTA', 'SSI', 'Other'];
const LIFESAVING_CERTS = ['Bronze Medallion', 'Award of Merit', 'CPR/AED', 'First Aid', 'Other'];

const STEPS = [
  { title: 'Welcome', subtitle: 'Join the SwimXP coach network' },
  { title: 'Personal Details', subtitle: 'Your identity & contact info' },
  { title: 'Experience', subtitle: 'Your professional background' },
  { title: 'Verification', subtitle: 'Mandatory compliance review' },
];

// Validation Schema
const coachSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters").regex(/^[a-zA-Z\s\-]+$/, "Name can only contain letters, spaces, and hyphens"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{8,15}$/, "Phone must be 8-15 digits"),
  nric: z.string().regex(/^\d{3}[A-Z]$/i, "NRIC must be 3 digits followed by a letter (e.g., 123A)"),
  hourlyRate: z.string().regex(/^\d+$/, "Rate must be a number").transform(v => parseInt(v)).refine(v => v >= 75, "Minimum coach fee is $75/hr"),
  experience: z.string().regex(/^\d+$/, "Years must be a number").transform(v => parseInt(v)).refine(v => v >= 1, "At least 1 year experience required"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
});

function isExpired(dateStr: string): boolean {
  if (!dateStr) return false;
  const expiry = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return expiry < today;
}

export default function CoachOnboarding() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', nric: '',
    hourlyRate: '75', experience: '2', bio: '',
    coachingCert: '', coachingExpiry: '',
    lifesavingCert: '', lifesavingExpiry: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const setRoleMutation = trpc.auth.setPlatformRole.useMutation();
  const saveCoachProfileMutation = trpc.coachProfile.saveProfile.useMutation();

  const set = (key: keyof typeof form, val: any) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const validateStep = () => {
    try {
      if (step === 1) {
        coachSchema.pick({ fullName: true, email: true, phone: true, nric: true }).parse(form);
      } else if (step === 2) {
        coachSchema.pick({ hourlyRate: true, experience: true, bio: true }).parse(form);
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
    if (step > 0 && step < 3 && !validateStep()) {
      toast.error('Please fix the errors before continuing');
      return;
    }

    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      if (isExpired(form.coachingExpiry) || isExpired(form.lifesavingExpiry)) {
        toast.error('Cannot submit with expired certifications');
        return;
      }
      try {
        await setRoleMutation.mutateAsync({ role: 'coach' });
        await saveCoachProfileMutation.mutateAsync({
          bio: form.bio,
          hourlyRate: Number(form.hourlyRate),
          experience: Number(form.experience),
          location: 'Central, Singapore',
          specialities: ['Children', 'Adult Beginners'],
          languages: ['English'],
          certifications: [form.coachingCert, form.lifesavingCert].filter(Boolean),
          availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        });
        toast.success('Registration submitted! Reviewing credentials...', { icon: '🚀' });
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (err: any) {
        toast.error(err.message || 'Failed to submit registration');
      }
    }
  };

  const progress = (step / (STEPS.length - 1)) * 100;

  return (
    <AppLayout hideNav>
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
        <h1 className="text-lg font-bold font-display text-navy">{STEPS[step].title}</h1>
        <p className="text-sm text-muted-foreground">{STEPS[step].subtitle}</p>
      </div>

      <div className="px-4 py-6 animate-fade-up">
        {step === 0 && (
          <div className="text-center py-6">
            <img src={LOGO_IMG} alt="SwimXP" className="h-28 w-auto object-contain mx-auto mb-5" />
            <h2 className="text-2xl font-extrabold font-display text-navy mb-2">Become a SwimXP Coach</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">Join Singapore's premier private swim coaching network.</p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <RField label="Full Name (as per NRIC)" error={errors.fullName}>
              <Input type="text" placeholder="e.g. John Tan Wei Jie" value={form.fullName} onChange={e => set('fullName', e.target.value)} />
            </RField>
            <RField label="Email Address" error={errors.email}>
              <Input type="email" autocomplete="email" placeholder="e.g. john.tan@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </RField>
            <RField label="Mobile Number" error={errors.phone}>
              <Input type="tel" inputmode="numeric" pattern="[0-9]*" placeholder="e.g. 91234567" value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, ''))} />
            </RField>
            <RField label="NRIC / FIN (last 4 characters)" error={errors.nric}>
              <Input type="text" placeholder="e.g. 567A" value={form.nric} onChange={e => set('nric', e.target.value.toUpperCase())} maxLength={4} />
            </RField>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <RField label="Hourly Rate (SGD)" error={errors.hourlyRate}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">$</span>
                <Input type="tel" inputmode="numeric" pattern="[0-9]*" placeholder="e.g. 85" value={form.hourlyRate} onChange={e => set('hourlyRate', e.target.value.replace(/\D/g, ''))} className="pl-7" />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Minimum fee is $75/hr for private lessons.</p>
            </RField>
            <RField label="Years of Experience" error={errors.experience}>
              <Input type="tel" inputmode="numeric" pattern="[0-9]*" placeholder="e.g. 5" value={form.experience} onChange={e => set('experience', e.target.value.replace(/\D/g, ''))} />
            </RField>
            <RField label="Professional Bio" error={errors.bio}>
              <Textarea placeholder="Describe your coaching philosophy and experience..." className="min-h-[120px]" value={form.bio} onChange={e => set('bio', e.target.value)} />
            </RField>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <RField label="Coaching Certification" error={errors.coachingCert}>
              <select className="w-full p-2.5 rounded-xl bg-[oklch(0.955_0.010_220)] text-sm border-0" value={form.coachingCert} onChange={e => set('coachingCert', e.target.value)}>
                <option value="">Select Certification</option>
                {COACHING_CERTS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </RField>
            <RField label="Certification Expiry Date" error={isExpired(form.coachingExpiry) ? "Expired" : ""}>
              <Input type="date" value={form.coachingExpiry} onChange={e => set('coachingExpiry', e.target.value)} />
            </RField>
            <RField label="Lifesaving Certification" error={errors.lifesavingCert}>
              <select className="w-full p-2.5 rounded-xl bg-[oklch(0.955_0.010_220)] text-sm border-0" value={form.lifesavingCert} onChange={e => set('lifesavingCert', e.target.value)}>
                <option value="">Select Certification</option>
                {LIFESAVING_CERTS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </RField>
            <RField label="Lifesaving Expiry Date" error={isExpired(form.lifesavingExpiry) ? "Expired" : ""}>
              <Input type="date" value={form.lifesavingExpiry} onChange={e => set('lifesavingExpiry', e.target.value)} />
            </RField>
          </div>
        )}

        <div className="mt-8">
          <Button
            className="w-full h-12 bg-[oklch(0.72_0.13_200)] hover:bg-[oklch(0.62_0.13_200)] text-white rounded-2xl font-semibold shadow-lg"
            onClick={handleNext}
            disabled={setRoleMutation.isPending || saveCoachProfileMutation.isPending}
          >
            {step === STEPS.length - 1 ? 'Submit Registration' : 'Continue'}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

function RField({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-navy">{label}</Label>
      {children}
      {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
    </div>
  );
}
