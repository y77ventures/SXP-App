// CoachOnboarding — Coach registration flow
// Design: Aqua Clarity — step progress, certification validation gate, document upload
// Compliance: Coaching cert + Lifesaving cert expiry dates are validated against today's date.
// Expired certifications BLOCK form submission with a red-highlighted error.

import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import {
  ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle,
  Upload, XCircle, ShieldCheck, Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/components/AppLayout';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { z } from 'zod';

const LOGO_IMG = '/swimxp-logo-v3.png';

// ── Constants ─────────────────────────────────────────────────────────────────
const COACHING_CERTS = [
  'AUSTSWIM Teacher of Swimming & Water Safety',
  'STA (Swimming Teachers Association)',
  'NROC (National Registry of Coaches)',
  'International Equivalent',
];

const LIFESAVING_CERTS = [
  'Bronze Medallion',
  'CPR & AED',
  'First Aid',
  'Equivalent Lifesaving Certification',
];

const LANGUAGES = ['English', 'Mandarin', 'Malay', 'Tamil', 'Hindi', 'Korean', 'Filipino'];
const REGIONS = ['Central', 'North', 'North-East', 'East', 'West'];
const SPECIALITIES = [
  'Children (3–6 yrs)', 'Children (7–12 yrs)', 'Teens (13–17 yrs)',
  'Adults', 'Competitive Training', 'Stroke Technique', 'Water Safety',
  'SwimSafer', 'Triathlon / Fitness', 'Open Water',
];
const SCHEDULE_PREFS = [
  'Weekday Mornings', 'Weekday Afternoons', 'Weekday Evenings',
  'Weekend Mornings', 'Weekend Afternoons',
];

const STEPS = [
  { title: 'Welcome', subtitle: 'Join the SwimXP coach network' },
  { title: 'Personal Details', subtitle: 'Your identity & contact info' },
  { title: 'Certifications', subtitle: 'Mandatory compliance verification' },
  { title: 'Teaching Profile', subtitle: 'Your specialities & availability' },
  { title: 'Agreement', subtitle: 'Coach terms & platform policy' },
];

// Validation Schema
const coachSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters").regex(/^[a-zA-Z\s\-]+$/, "Name can only contain letters, spaces, and hyphens"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{8,15}$/, "Phone must be 8-15 digits"),
  nric: z.string().regex(/^\d{3}[A-Z]$/i, "NRIC must be 3 digits followed by a letter (e.g., 123A)"),
  coachingCert: z.string().min(1, "Coaching cert is required"),
  coachingExpiry: z.string().min(1, "Expiry date is required"),
  lifesavingCert: z.string().min(1, "Lifesaving cert is required"),
  lifesavingExpiry: z.string().min(1, "Expiry date is required"),
  hourlyRate: z.string().regex(/^\d+$/, "Rate must be a number").transform(v => parseInt(v)).refine(v => v >= 30 && v <= 500, "Rate must be between $30 and $500"),
});

// ── Expiry date validation helper ─────────────────────────────────────────────
function isDateValid(dateStr: string): boolean {
  if (!dateStr) return false;
  const expiry = new Date(dateStr);
  if (isNaN(expiry.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return expiry >= today;
}

function isExpired(dateStr: string): boolean {
  if (!dateStr) return false;
  const expiry = new Date(dateStr);
  if (isNaN(expiry.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return expiry < today;
}

// ── Draft persistence helpers ─────────────────────────────────────────────────
const DRAFT_KEY = 'swimxp_coach_draft';

function defaultForm() {
  return {
    fullName: '', email: '', phone: '', nric: '',
    coachingCert: '', coachingExpiry: '', coachingProofFile: null as File | null,
    lifesavingCert: '', lifesavingExpiry: '', lifesavingProofFile: null as File | null,
    specialities: [] as string[], languages: [] as string[],
    regions: [] as string[], schedule: [] as string[],
    bio: '', hourlyRate: '',
  };
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const { form, step } = JSON.parse(raw);
    return { form: { ...defaultForm(), ...form }, step };
  } catch { return null; }
}

function saveDraft(form: any, step: number) {
  const { coachingProofFile, lifesavingProofFile, ...serializable } = form;
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ form: serializable, step }));
}

export default function CoachOnboarding() {
  const [, navigate] = useLocation();
  const savedDraft = loadDraft();
  const [step, setStep] = useState(savedDraft?.step ?? 0);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const coachingProofRef = useRef<HTMLInputElement>(null);
  const lifesavingProofRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(savedDraft?.form ?? defaultForm());

  const set = (key: keyof ReturnType<typeof defaultForm>, val: any) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const toggleArr = (key: 'specialities' | 'languages' | 'regions' | 'schedule', val: string) =>
    setForm(f => ({
      ...f,
      [key]: (f[key] as string[]).includes(val) ? (f[key] as string[]).filter(x => x !== val) : [...(f[key] as string[]), val],
    }));

  const coachingExpired = isExpired(form.coachingExpiry);
  const lifesavingExpired = isExpired(form.lifesavingExpiry);
  const certBlocksSubmit = coachingExpired || lifesavingExpired;

  const validateStep = () => {
    try {
      if (step === 1) {
        coachSchema.pick({ fullName: true, email: true, phone: true, nric: true }).parse(form);
      } else if (step === 2) {
        coachSchema.pick({ coachingCert: true, coachingExpiry: true, lifesavingCert: true, lifesavingExpiry: true }).parse(form);
        if (!form.coachingProofFile || !form.lifesavingProofFile) throw new Error("Documents required");
        if (certBlocksSubmit) throw new Error("Expired certification");
      } else if (step === 3) {
        coachSchema.pick({ hourlyRate: true }).parse(form);
        if (form.specialities.length === 0 || form.languages.length === 0 || form.regions.length === 0) throw new Error("Selections required");
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

  const saveProfile = trpc.coach.saveProfile.useMutation();
  const uploadCertDoc = trpc.coach.uploadCertProof.useMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      if (form.coachingProofFile) {
        const base64 = await fileToBase64(form.coachingProofFile);
        await uploadCertDoc.mutateAsync({ base64, mimeType: form.coachingProofFile.type, certType: 'primary' });
      }
      if (form.lifesavingProofFile) {
        const base64 = await fileToBase64(form.lifesavingProofFile);
        await uploadCertDoc.mutateAsync({ base64, mimeType: form.lifesavingProofFile.type, certType: 'lifesaving' });
      }
      await saveProfile.mutateAsync({
        bio: form.bio || undefined,
        languages: form.languages.join(', ') || undefined,
        hourlyRate: form.hourlyRate || undefined,
        primaryCert: form.coachingCert as any,
        primaryCertExpiry: new Date(form.coachingExpiry),
        lifesavingCert: form.lifesavingCert as any,
        lifesavingCertExpiry: new Date(form.lifesavingExpiry),
        catchmentRegions: form.regions.join(',') || undefined,
      });
      localStorage.removeItem(DRAFT_KEY);
      toast.success('Application submitted!', { icon: '🎉' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step > 0 && !validateStep()) {
      toast.error('Please complete all required fields correctly');
      return;
    }
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else handleSubmitApplication();
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
            <RField label="Primary Coaching Certification" error={errors.coachingCert}>
              <select className="w-full p-2.5 rounded-xl bg-[oklch(0.955_0.010_220)] text-sm border-0" value={form.coachingCert} onChange={e => set('coachingCert', e.target.value)}>
                <option value="">Select Certification</option>
                {COACHING_CERTS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </RField>
            <RField label="Certification Expiry Date" error={errors.coachingExpiry || (coachingExpired ? "Expired" : "")}>
              <Input type="date" value={form.coachingExpiry} onChange={e => set('coachingExpiry', e.target.value)} />
            </RField>
            <RField label="Upload Proof">
              <FileUploadButton file={form.coachingProofFile} inputRef={coachingProofRef} onChange={file => set('coachingProofFile', file)} />
            </RField>

            <RField label="Lifesaving Certification" error={errors.lifesavingCert}>
              <select className="w-full p-2.5 rounded-xl bg-[oklch(0.955_0.010_220)] text-sm border-0" value={form.lifesavingCert} onChange={e => set('lifesavingCert', e.target.value)}>
                <option value="">Select Certification</option>
                {LIFESAVING_CERTS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </RField>
            <RField label="Lifesaving Expiry Date" error={errors.lifesavingExpiry || (lifesavingExpired ? "Expired" : "")}>
              <Input type="date" value={form.lifesavingExpiry} onChange={e => set('lifesavingExpiry', e.target.value)} />
            </RField>
            <RField label="Upload Proof">
              <FileUploadButton file={form.lifesavingProofFile} inputRef={lifesavingProofRef} onChange={file => set('lifesavingProofFile', file)} />
            </RField>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <RField label="Hourly Rate (SGD)" error={errors.hourlyRate}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">$</span>
                <Input type="tel" inputmode="numeric" pattern="[0-9]*" placeholder="e.g. 85" value={form.hourlyRate} onChange={e => set('hourlyRate', e.target.value.replace(/\D/g, ''))} className="pl-7" />
              </div>
            </RField>
            {/* Specialities, Languages, Regions selection buttons... */}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <Button variant={agreementAccepted ? 'default' : 'outline'} className="w-full justify-start h-auto p-4" onClick={() => setAgreementAccepted(!agreementAccepted)}>
              <div className={cn("w-5 h-5 rounded border mr-3 flex items-center justify-center", agreementAccepted ? "bg-white text-navy" : "bg-transparent")}>
                {agreementAccepted && <CheckCircle2 size={12} />}
              </div>
              <span className="text-sm text-left">I agree to the Coach Agreement & Platform Terms</span>
            </Button>
          </div>
        )}

        <div className="mt-8 space-y-3">
          {step > 0 && step < 4 && (
            <Button variant="ghost" className="w-full text-xs" onClick={() => { saveDraft(form, step); toast.success('Draft saved'); }}>
              <Save className="mr-2 h-3 w-3" /> Save as Draft
            </Button>
          )}
          <Button className="w-full h-12 rounded-2xl font-bold" onClick={handleNext} disabled={isSubmitting || (step === 4 && !agreementAccepted)}>
            {step === 4 ? (isSubmitting ? 'Submitting...' : 'Submit Application 🎉') : 'Continue'}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

function RField({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold text-navy">{label} <span className="text-destructive">*</span></Label>
      {children}
      {error && <p className="text-[10px] text-destructive font-medium">{error}</p>}
    </div>
  );
}

function FileUploadButton({ file, inputRef, onChange }: { file: File | null; inputRef: React.RefObject<HTMLInputElement>; onChange: (f: File) => void }) {
  return (
    <div onClick={() => inputRef.current?.click()} className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
      <input type="file" ref={inputRef} className="hidden" onChange={e => e.target.files?.[0] && onChange(e.target.files[0])} />
      {file ? <p className="text-xs font-medium text-green-600 truncate">{file.name}</p> : <div className="flex flex-col items-center gap-1"><Upload size={16} className="text-muted-foreground" /><p className="text-[10px] text-muted-foreground">Click to upload document</p></div>}
    </div>
  );
}
