// CoachOnboarding — Coach registration flow
// Design: Aqua Clarity — step progress, certification validation gate, document upload
// Compliance: Coaching cert + Lifesaving cert expiry dates are validated against today's date.
// Expired certifications BLOCK form submission with a red-highlighted error.

import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import {
  ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle,
  Info, Upload, FileText, XCircle, ShieldCheck, Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/components/AppLayout';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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

// ── Expiry date validation helper ─────────────────────────────────────────────
// Returns true if the date string is a valid future date (not expired).
function isDateValid(dateStr: string): boolean {
  if (!dateStr) return false;
  const expiry = new Date(dateStr);
  if (isNaN(expiry.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // compare date only, not time
  return expiry >= today;
}

// Returns true if the date string is a non-empty, parseable, EXPIRED date.
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

type SerializableForm = Omit<ReturnType<typeof defaultForm>, 'coachingProofFile' | 'lifesavingProofFile'>;

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

function loadDraft(): { form: ReturnType<typeof defaultForm>; step: number } | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const { form, step } = JSON.parse(raw) as { form: SerializableForm; step: number };
    return { form: { ...defaultForm(), ...form }, step };
  } catch {
    return null;
  }
}

function saveDraft(form: ReturnType<typeof defaultForm>, step: number) {
  // File objects are not serializable — save only text/array fields
  const { coachingProofFile: _c, lifesavingProofFile: _l, ...serializable } = form;
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ form: serializable, step }));
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CoachOnboarding() {
  const [, navigate] = useLocation();
  const savedDraft = loadDraft();
  const [step, setStep] = useState(savedDraft?.step ?? 0);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null);

  const coachingProofRef = useRef<HTMLInputElement>(null);
  const lifesavingProofRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(savedDraft?.form ?? {
    // Step 1 — Personal
    fullName: '',
    email: '',
    phone: '',
    nric: '',
    // Step 2 — Certifications
    coachingCert: '',
    coachingExpiry: '',
    coachingProofFile: null as File | null,
    lifesavingCert: '',
    lifesavingExpiry: '',
    lifesavingProofFile: null as File | null,
    // Step 3 — Teaching profile
    specialities: [] as string[],
    languages: [] as string[],
    regions: [] as string[],
    schedule: [] as string[],
    bio: '',
    hourlyRate: '',
  });

  // Auto-restore notice: if draft was loaded, show a toast once on mount
  useEffect(() => {
    if (savedDraft) {
      toast.info('Draft restored. Your previous progress has been loaded.', {
        icon: '📋',
        duration: 4000,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveDraft = () => {
    saveDraft(form, step);
    setDraftSavedAt(new Date());
    toast.success('Draft saved! You can safely close the app and return later.', {
      icon: '💾',
      description: 'Note: certification document files must be re-attached when you return.',
      duration: 5000,
    });
  };

  const set = <K extends keyof typeof form>(key: K, val: typeof form[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  const toggleArr = (key: 'specialities' | 'languages' | 'regions' | 'schedule', val: string) =>
    setForm(f => ({
      ...f,
      [key]: (f[key] as string[]).includes(val)
        ? (f[key] as string[]).filter(x => x !== val)
        : [...(f[key] as string[]), val],
    }));

  // ── Derived certification validation state ────────────────────────────────
  const coachingExpired = isExpired(form.coachingExpiry);
  const lifesavingExpired = isExpired(form.lifesavingExpiry);
  const certBlocksSubmit = coachingExpired || lifesavingExpired;

  // ── Step-level validation ─────────────────────────────────────────────────
  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return !!(form.fullName && form.email && form.phone && form.nric);
      case 2: {
        if (!form.coachingCert || !form.coachingExpiry) return false;
        if (!form.lifesavingCert || !form.lifesavingExpiry) return false;
        if (!form.coachingProofFile || !form.lifesavingProofFile) return false;
        // Block if either cert is expired
        if (certBlocksSubmit) return false;
        // Both expiry dates must be valid future dates
        if (!isDateValid(form.coachingExpiry) || !isDateValid(form.lifesavingExpiry)) return false;
        return true;
      }
      case 3:
        return form.specialities.length > 0 && form.languages.length > 0 && form.regions.length > 0 && !!form.hourlyRate;
      case 4:
        return agreementAccepted;
      default:
        return true;
    }
  };

  // ── tRPC mutations ──────────────────────────────────────────────────────────
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
        await uploadCertDoc.mutateAsync({ base64, mimeType: form.coachingProofFile.type, certType: 'primary' as const });
      }
      if (form.lifesavingProofFile) {
        const base64 = await fileToBase64(form.lifesavingProofFile);
        await uploadCertDoc.mutateAsync({ base64, mimeType: form.lifesavingProofFile.type, certType: 'lifesaving' as const });
      }
      const certMap: Record<string, 'AUSTSWIM' | 'STA' | 'NROC' | 'International Equivalent'> = {
        'AUSTSWIM Teacher of Swimming & Water Safety': 'AUSTSWIM',
        'STA (Swimming Teachers Association)': 'STA',
        'NROC (National Registry of Coaches)': 'NROC',
        'International Equivalent': 'International Equivalent',
      };
      const lifesavingMap: Record<string, 'Bronze Medallion' | 'CPR & AED' | 'First Aid' | 'Equivalent'> = {
        'Bronze Medallion': 'Bronze Medallion',
        'CPR & AED': 'CPR & AED',
        'First Aid': 'First Aid',
        'Equivalent Lifesaving Certification': 'Equivalent',
      };
      await saveProfile.mutateAsync({
        bio: form.bio || undefined,
        languages: form.languages.join(', ') || undefined,
        hourlyRate: form.hourlyRate || undefined,
        primaryCert: certMap[form.coachingCert] ?? undefined,
        primaryCertExpiry: form.coachingExpiry ? new Date(form.coachingExpiry) : undefined,
        lifesavingCert: lifesavingMap[form.lifesavingCert] ?? undefined,
        lifesavingCertExpiry: form.lifesavingExpiry ? new Date(form.lifesavingExpiry) : undefined,
        catchmentRegions: form.regions.join(',') || undefined,
      });
      localStorage.removeItem('swimxp_coach_draft');
      toast.success('Application submitted! Our team will review your credentials.', { icon: '🎉' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step === 2 && certBlocksSubmit) {
      toast.error(
        'Registration cannot be accepted with an expired certification. Please upload an active, valid credential to proceed.',
        { duration: 6000 }
      );
      return;
    }
    if (!canProceed()) {
      toast.error('Please complete all required fields before continuing');
      return;
    }
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      handleSubmitApplication();
    }
  };

  const progress = (step / (STEPS.length - 1)) * 100;

  return (
    <AppLayout hideNav>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[oklch(0.965_0.012_220)]/95 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="w-8 h-8 rounded-xl bg-[oklch(0.955_0.010_220)] flex items-center justify-center"
            >
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

        {/* ── Step 0: Welcome ── */}
        {step === 0 && (
          <div className="text-center py-6">
            <img
              src={LOGO_IMG}
              alt="SwimXP"
              className="h-28 w-auto object-contain mx-auto mb-5"
              style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.15))' }}
            />
            <h2 className="text-2xl font-extrabold font-display text-navy mb-2">
              Become a SwimXP Coach
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Join Singapore's premier private swim coaching network. We connect certified coaches with families at private condominium and estate pools.
            </p>
            {/* Compliance notice */}
            <div className="bg-[oklch(0.22_0.06_240)] rounded-2xl p-4 text-left mb-5">
              <div className="flex items-start gap-2">
                <ShieldCheck size={16} className="text-[oklch(0.85_0.10_200)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white mb-1">Mandatory Certification Compliance</p>
                  <p className="text-xs text-white/75 leading-relaxed">
                    All coaches must hold a <strong className="text-white">current, non-expired</strong> primary coaching certification (AUSTSWIM, STA, NROC, or equivalent) and a valid lifesaving/CPR credential. Expired certifications will be automatically rejected.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3 text-left">
              {[
                { emoji: '🏊', text: 'Teach at private condo and estate pools across Singapore' },
                { emoji: '💳', text: 'Transparent earnings with platform wallet & Stripe payouts' },
                { emoji: '📋', text: 'Verified coach badge after credential review' },
                { emoji: '🎯', text: 'Smart client matching based on your specialities & region' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3 bg-[oklch(0.955_0.010_220)] rounded-xl p-3">
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-sm text-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 1: Personal Details ── */}
        {step === 1 && (
          <div className="space-y-4">
            <RField label="Full Name (as per NRIC)">
              <Input
                placeholder="Marcus Tan Wei Jie"
                value={form.fullName}
                onChange={e => set('fullName', e.target.value)}
                className="rounded-xl bg-[oklch(0.955_0.010_220)] border-0"
              />
            </RField>
            <RField label="Email Address">
              <Input
                type="email"
                placeholder="marcus@email.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className="rounded-xl bg-[oklch(0.955_0.010_220)] border-0"
              />
            </RField>
            <RField label="Mobile Number">
              <Input
                placeholder="+65 9123 4567"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                className="rounded-xl bg-[oklch(0.955_0.010_220)] border-0"
              />
            </RField>
            <RField label="NRIC / FIN (last 4 characters)" helper="Used for identity verification only. Stored securely.">
              <Input
                placeholder="e.g. 234B"
                maxLength={4}
                value={form.nric}
                onChange={e => set('nric', e.target.value.toUpperCase())}
                className="rounded-xl bg-[oklch(0.955_0.010_220)] border-0 uppercase"
              />
            </RField>
          </div>
        )}

        {/* ── Step 2: Certifications (compliance gate) ── */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Compliance banner */}
            <div className="bg-[oklch(0.22_0.06_240)] rounded-2xl p-4 flex items-start gap-2">
              <ShieldCheck size={16} className="text-[oklch(0.85_0.10_200)] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-white/80 leading-relaxed">
                Both certifications must be <strong className="text-white">currently valid</strong>. Expired credentials will block your registration. Upload clear PDF or image proof for admin verification.
              </p>
            </div>

            {/* ── Coaching Certification ── */}
            <div className="bg-white rounded-2xl border border-border/60 p-4 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-[oklch(0.93_0.05_200)] flex items-center justify-center">
                  <ShieldCheck size={14} className="text-[oklch(0.52_0.14_200)]" />
                </div>
                <h3 className="font-bold text-sm text-navy">Primary Coaching Certification</h3>
              </div>

              <RField label="Certification Type">
                <div className="space-y-2">
                  {COACHING_CERTS.map(cert => (
                    <button
                      key={cert}
                      onClick={() => set('coachingCert', cert)}
                      className={cn(
                        'w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between',
                        form.coachingCert === cert
                          ? 'bg-[oklch(0.72_0.13_200)] text-white'
                          : 'bg-[oklch(0.955_0.010_220)] text-foreground'
                      )}
                    >
                      {cert}
                      {form.coachingCert === cert && <CheckCircle2 size={15} />}
                    </button>
                  ))}
                </div>
              </RField>

              <RField
                label="Certification Expiry Date"
                error={
                  coachingExpired
                    ? 'Registration cannot be accepted with an expired certification. Please upload an active, valid credential to proceed.'
                    : undefined
                }
              >
                <Input
                  type="date"
                  value={form.coachingExpiry}
                  onChange={e => set('coachingExpiry', e.target.value)}
                  className={cn(
                    'rounded-xl border-0',
                    coachingExpired
                      ? 'bg-red-50 ring-2 ring-red-400 text-red-700 focus-visible:ring-red-500'
                      : form.coachingExpiry && isDateValid(form.coachingExpiry)
                        ? 'bg-green-50 ring-2 ring-green-400'
                        : 'bg-[oklch(0.955_0.010_220)]'
                  )}
                />
                {form.coachingExpiry && isDateValid(form.coachingExpiry) && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 size={11} /> Valid — expires {new Date(form.coachingExpiry).toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </RField>

              <RField label="Upload PDF or Image Proof of Active Certification">
                <FileUploadButton
                  file={form.coachingProofFile}
                  inputRef={coachingProofRef}
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={file => set('coachingProofFile', file)}
                  hint="PDF, JPG, or PNG · Max 10 MB"
                />
              </RField>
            </div>

            {/* ── Lifesaving / CPR Certification ── */}
            <div className="bg-white rounded-2xl border border-border/60 p-4 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                  <AlertTriangle size={14} className="text-amber-600" />
                </div>
                <h3 className="font-bold text-sm text-navy">Lifesaving / CPR Certification</h3>
              </div>

              <RField label="Certification Type">
                <div className="space-y-2">
                  {LIFESAVING_CERTS.map(cert => (
                    <button
                      key={cert}
                      onClick={() => set('lifesavingCert', cert)}
                      className={cn(
                        'w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between',
                        form.lifesavingCert === cert
                          ? 'bg-amber-500 text-white'
                          : 'bg-[oklch(0.955_0.010_220)] text-foreground'
                      )}
                    >
                      {cert}
                      {form.lifesavingCert === cert && <CheckCircle2 size={15} />}
                    </button>
                  ))}
                </div>
              </RField>

              <RField
                label="Certification Expiry Date"
                error={
                  lifesavingExpired
                    ? 'Registration cannot be accepted with an expired certification. Please upload an active, valid credential to proceed.'
                    : undefined
                }
              >
                <Input
                  type="date"
                  value={form.lifesavingExpiry}
                  onChange={e => set('lifesavingExpiry', e.target.value)}
                  className={cn(
                    'rounded-xl border-0',
                    lifesavingExpired
                      ? 'bg-red-50 ring-2 ring-red-400 text-red-700 focus-visible:ring-red-500'
                      : form.lifesavingExpiry && isDateValid(form.lifesavingExpiry)
                        ? 'bg-green-50 ring-2 ring-green-400'
                        : 'bg-[oklch(0.955_0.010_220)]'
                  )}
                />
                {form.lifesavingExpiry && isDateValid(form.lifesavingExpiry) && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 size={11} /> Valid — expires {new Date(form.lifesavingExpiry).toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </RField>

              <RField label="Upload PDF or Image Proof of Active Certification">
                <FileUploadButton
                  file={form.lifesavingProofFile}
                  inputRef={lifesavingProofRef}
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={file => set('lifesavingProofFile', file)}
                  hint="PDF, JPG, or PNG · Max 10 MB"
                />
              </RField>
            </div>

            {/* Expired cert global error banner */}
            {certBlocksSubmit && (
              <div className="bg-red-50 border-2 border-red-400 rounded-2xl p-4 flex items-start gap-3">
                <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-700 mb-1">Expired Certification Detected</p>
                  <p className="text-xs text-red-600 leading-relaxed">
                    Registration cannot be accepted with an expired certification. Please upload an active, valid credential to proceed.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Teaching Profile ── */}
        {step === 3 && (
          <div className="space-y-5">
            <RField label="Specialities (select all that apply)">
              <div className="flex flex-wrap gap-2">
                {SPECIALITIES.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleArr('specialities', s)}
                    className={cn(
                      'text-xs px-3 py-1.5 rounded-full font-medium transition-all',
                      form.specialities.includes(s)
                        ? 'bg-[oklch(0.72_0.13_200)] text-white'
                        : 'bg-[oklch(0.955_0.010_220)] text-muted-foreground'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </RField>

            <RField label="Teaching Languages">
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(l => (
                  <button
                    key={l}
                    onClick={() => toggleArr('languages', l)}
                    className={cn(
                      'text-xs px-3 py-1.5 rounded-full font-medium transition-all',
                      form.languages.includes(l)
                        ? 'bg-[oklch(0.72_0.13_200)] text-white'
                        : 'bg-[oklch(0.955_0.010_220)] text-muted-foreground'
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </RField>

            <RField label="Preferred Regions">
              <div className="grid grid-cols-3 gap-2">
                {REGIONS.map(r => (
                  <button
                    key={r}
                    onClick={() => toggleArr('regions', r)}
                    className={cn(
                      'py-2.5 rounded-xl text-xs font-semibold transition-all',
                      form.regions.includes(r)
                        ? 'bg-[oklch(0.72_0.13_200)] text-white'
                        : 'bg-[oklch(0.955_0.010_220)] text-muted-foreground'
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </RField>

            <RField label="Availability">
              <div className="space-y-2">
                {SCHEDULE_PREFS.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleArr('schedule', s)}
                    className={cn(
                      'w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-between',
                      form.schedule.includes(s)
                        ? 'bg-[oklch(0.72_0.13_200)] text-white'
                        : 'bg-[oklch(0.955_0.010_220)] text-foreground'
                    )}
                  >
                    {s}
                    {form.schedule.includes(s) && <CheckCircle2 size={16} />}
                  </button>
                ))}
              </div>
            </RField>

            <RField label="Hourly Rate (SGD)" helper="Set your standard rate per lesson hour. You can update this later.">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder="85"
                  min={30}
                  max={500}
                  value={form.hourlyRate}
                  onChange={e => set('hourlyRate', e.target.value)}
                  className="rounded-xl bg-[oklch(0.955_0.010_220)] border-0 pl-7"
                />
              </div>
            </RField>

            <div>
              <Label className="text-sm font-semibold text-navy mb-1.5 block">
                Short Bio <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <textarea
                placeholder="e.g. AUSTSWIM-certified coach with 6 years of experience teaching children and adults at condo pools across Central Singapore..."
                value={form.bio}
                onChange={e => set('bio', e.target.value)}
                rows={4}
                className="w-full rounded-xl bg-[oklch(0.955_0.010_220)] border-0 text-sm p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.13_200)]"
              />
            </div>
          </div>
        )}

        {/* ── Step 4: Agreement ── */}
        {step === 4 && (
          <div className="space-y-4">
            {/* Certification summary */}
            <div className="bg-[oklch(0.93_0.05_200)] rounded-2xl p-4 space-y-2">
              <p className="text-xs font-bold text-[oklch(0.52_0.14_200)] mb-2 flex items-center gap-1.5">
                <ShieldCheck size={13} /> Certification Summary
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Coaching Cert</span>
                  <span className="text-xs font-semibold text-navy truncate max-w-[55%] text-right">{form.coachingCert || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Coaching Expiry</span>
                  <span className={cn('text-xs font-semibold', isDateValid(form.coachingExpiry) ? 'text-green-600' : 'text-red-500')}>
                    {form.coachingExpiry ? new Date(form.coachingExpiry).toLocaleDateString('en-SG') : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Lifesaving Cert</span>
                  <span className="text-xs font-semibold text-navy truncate max-w-[55%] text-right">{form.lifesavingCert || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Lifesaving Expiry</span>
                  <span className={cn('text-xs font-semibold', isDateValid(form.lifesavingExpiry) ? 'text-green-600' : 'text-red-500')}>
                    {form.lifesavingExpiry ? new Date(form.lifesavingExpiry).toLocaleDateString('en-SG') : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Proof Uploaded</span>
                  <span className="text-xs font-semibold text-green-600">
                    {form.coachingProofFile && form.lifesavingProofFile ? '✓ Both documents attached' : 'Missing'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[oklch(0.955_0.010_220)] rounded-2xl p-4 max-h-64 overflow-y-auto">
              <h3 className="font-bold text-sm font-display text-navy mb-3">Coach Agreement & Platform Terms</h3>
              <div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                <p>By submitting your coach application, you confirm and agree to the following:</p>
                <p><strong>1. Independent Contractor:</strong> You are registering as an independent freelance coach, not as an employee of Swim Xperience Pte. Ltd. You are solely responsible for your own tax obligations, CPF contributions, and professional insurance.</p>
                <p><strong>2. Certification Accuracy:</strong> All credentials, certifications, and qualifications submitted are genuine, current, and accurately represent your professional standing. You agree to notify the Platform immediately of any changes to your certification status.</p>
                <p><strong>3. Compliance Obligation:</strong> You must maintain valid coaching and lifesaving certifications throughout your active tenure on the Platform. The Platform reserves the right to suspend your account if certifications lapse.</p>
                <p><strong>4. Private Property Conduct:</strong> You will conduct all sessions strictly at the client's registered private facility and comply with all MCST or estate management rules.</p>
                <p><strong>5. Platform Payments Only:</strong> All payments for Platform-sourced clients must be processed exclusively through the Platform's integrated wallet. Cash, PayNow, or direct transfers are prohibited for Platform bookings.</p>
                <p><strong>6. Non-Solicitation:</strong> You agree not to privately solicit or accept bookings from Platform-sourced clients outside the Platform for 12 months following your departure.</p>
                <p><strong>7. Referral Commission:</strong> 100% of gross fees from your first 3 completed lessons on the Platform will be retained as a baseline referral commission. Standard payout splits apply from the 4th lesson onward.</p>
                <p className="font-semibold text-foreground">This agreement is legally binding. Please read carefully before accepting.</p>
              </div>
            </div>

            <button
              onClick={() => setAgreementAccepted(!agreementAccepted)}
              className={cn(
                'w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all',
                agreementAccepted
                  ? 'border-[oklch(0.72_0.13_200)] bg-[oklch(0.93_0.05_200)]'
                  : 'border-border bg-white'
              )}
            >
              <div className={cn(
                'w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0',
                agreementAccepted
                  ? 'border-[oklch(0.72_0.13_200)] bg-[oklch(0.72_0.13_200)]'
                  : 'border-border'
              )}>
                {agreementAccepted && <CheckCircle2 size={14} className="text-white" />}
              </div>
              <span className="text-sm font-medium text-navy text-left">
                I have read, understood, and agree to the Coach Agreement & Platform Terms
              </span>
            </button>

            {agreementAccepted && (
              <div className="bg-green-50 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-700">Agreement accepted. Your application is ready to submit!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 bg-[oklch(0.965_0.012_220)]/95 backdrop-blur-xl border-t border-border/50 p-4 pb-safe">
        {/* Save as Draft — shown on all steps except Welcome (step 0) */}
        {step > 0 && step < STEPS.length - 1 && (
          <button
            onClick={handleSaveDraft}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-[oklch(0.52_0.14_200)] bg-[oklch(0.93_0.05_200)] hover:bg-[oklch(0.88_0.07_200)] rounded-xl py-2.5 mb-2.5 transition-colors"
          >
            <Save size={13} />
            Save as Draft
            {draftSavedAt && (
              <span className="text-[10px] text-muted-foreground font-normal ml-1">
                (last saved {draftSavedAt.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })})
              </span>
            )}
          </button>
        )}
        <Button
          onClick={handleNext}
          className="w-full bg-[oklch(0.72_0.13_200)] hover:bg-[oklch(0.62_0.13_200)] text-white rounded-2xl font-semibold h-12 text-base disabled:opacity-50"
          disabled={!canProceed()}
        >
          {step === STEPS.length - 1 ? (
            <>Submit Application 🎉</>
          ) : (
            <>Continue <ChevronRight size={16} className="ml-1" /></>
          )}
        </Button>
        {step === 2 && certBlocksSubmit && (
          <p className="text-center text-xs text-red-500 mt-2 font-medium">
            Expired certification detected — please correct before continuing
          </p>
        )}
        {!canProceed() && !certBlocksSubmit && step > 0 && (
          <p className="text-center text-xs text-muted-foreground mt-2">Complete all required fields to continue</p>
        )}
      </div>
    </AppLayout>
  );
}

// ── FileUploadButton ──────────────────────────────────────────────────────────
function FileUploadButton({
  file,
  inputRef,
  accept,
  onChange,
  hint,
}: {
  file: File | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  accept: string;
  onChange: (file: File | null) => void;
  hint?: string;
}) {
  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0] ?? null;
          if (f && f.size > 10 * 1024 * 1024) {
            toast.error('File exceeds 10 MB limit. Please upload a smaller file.');
            return;
          }
          onChange(f);
        }}
      />
      {file ? (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3">
          <FileText size={18} className="text-green-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-green-700 truncate">{file.name}</p>
            <p className="text-xs text-green-600">{(file.size / 1024).toFixed(0)} KB · Ready for upload</p>
          </div>
          <button
            onClick={() => { onChange(null); if (inputRef.current) inputRef.current.value = ''; }}
            className="text-green-600 hover:text-red-500 transition-colors"
          >
            <XCircle size={16} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-dashed border-border bg-[oklch(0.955_0.010_220)] hover:border-[oklch(0.72_0.13_200)] hover:bg-[oklch(0.93_0.05_200)] transition-all"
        >
          <Upload size={20} className="text-muted-foreground" />
          <span className="text-xs font-semibold text-navy">Tap to upload document</span>
          {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
        </button>
      )}
    </div>
  );
}

// ── RField — Required field wrapper ──────────────────────────────────────────
function RField({
  label,
  helper,
  error,
  children,
}: {
  label: string;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-sm font-semibold text-navy mb-1.5 flex items-center gap-1">
        {label}
        <span className="text-red-500 text-xs">*</span>
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-red-600 mt-1.5 flex items-start gap-1 font-medium">
          <XCircle size={11} className="flex-shrink-0 mt-0.5" />
          {error}
        </p>
      ) : helper ? (
        <p className="text-xs text-muted-foreground mt-1.5 flex items-start gap-1">
          <Info size={11} className="flex-shrink-0 mt-0.5" />
          {helper}
        </p>
      ) : null}
    </div>
  );
}
