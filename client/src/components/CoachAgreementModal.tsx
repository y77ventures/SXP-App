// CoachAgreementModal — Coach Professional Agreement
// Required in Coach onboarding flow
// Legal: independent freelancer status, safety protocols, non-compete / off-platform payment ban

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GraduationCap, FileText, AlertTriangle, PenLine, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface CoachAgreementModalProps {
  open: boolean;
  onAccept: (signature: string) => void;
  onClose: () => void;
  coachName?: string;
}

export default function CoachAgreementModal({ open, onAccept, onClose, coachName = '' }: CoachAgreementModalProps) {
  const [step, setStep] = useState<'read' | 'sign'>('read');
  const [checks, setChecks] = useState({
    freelancer: false,
    safety: false,
    credentials: false,
    nonCompete: false,
    payments: false,
    conduct: false,
    referralPolicy: false,
  });
  const [signature, setSignature] = useState('');
  const today = new Date().toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' });

  const allChecked = Object.values(checks).every(Boolean);
  const canSign = allChecked && signature.trim().length >= 3;

  const toggle = (key: keyof typeof checks) =>
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));

  const handleAccept = () => {
    if (!canSign) return;
    onAccept(signature.trim());
    toast.success('Coach Agreement signed', {
      description: 'Your professional agreement has been recorded. Welcome to SwimXP!',
    });
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] flex flex-col p-0 gap-0 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[oklch(0.35_0.08_240)] px-5 py-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[oklch(0.72_0.13_200)]/25 flex items-center justify-center flex-shrink-0 mt-0.5">
            <GraduationCap size={20} className="text-[oklch(0.72_0.13_200)]" />
          </div>
          <div>
            <DialogTitle className="text-white font-display text-base leading-tight">
              Coach Professional Agreement
            </DialogTitle>
            <p className="text-white/60 text-xs mt-0.5">Independent Contractor &amp; Platform Terms</p>
          </div>
        </div>

        {step === 'read' ? (
          <>
            <ScrollArea className="flex-1 max-h-[58vh]">
              <div className="px-5 py-4 space-y-4 text-sm">
                {/* Notice */}
                <div className="flex gap-2 bg-[oklch(0.93_0.05_200)] border border-[oklch(0.82_0.10_200)] rounded-xl p-3">
                  <AlertTriangle size={16} className="text-[oklch(0.52_0.14_200)] flex-shrink-0 mt-0.5" />
                  <p className="text-[oklch(0.32_0.10_220)] text-xs leading-relaxed">
                    This agreement governs your relationship with Swim Xperience Pte. Ltd. as an independent coach on the platform. Please read all clauses carefully before signing.
                  </p>
                </div>

                {/* Section 1 */}
                <div>
                  <h3 className="font-semibold font-display text-[oklch(0.22_0.06_240)] mb-1.5 flex items-center gap-1.5">
                    <FileText size={14} /> 1. Independent Freelancer Status
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    I confirm that I am registering as an <strong className="text-foreground">independent freelance coach</strong> and not as an employee, agent, or representative of Swim Xperience Pte. Ltd. ("the Platform"). I acknowledge that no employer-employee relationship exists between myself and the Platform.
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                    As an independent contractor, I am solely responsible for: (a) my own income tax obligations and CPF contributions (if applicable); (b) maintaining my own professional indemnity and public liability insurance; (c) compliance with all applicable Singapore laws and regulations governing freelance coaching activities.
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <h3 className="font-semibold font-display text-[oklch(0.22_0.06_240)] mb-1.5 flex items-center gap-1.5">
                    <FileText size={14} /> 2. Safety Protocols &amp; Duty of Care
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    I accept full and sole responsibility for implementing appropriate safety protocols during all coaching sessions, including but not limited to: conducting pre-lesson health checks, ensuring appropriate student-to-coach ratios, maintaining vigilance for signs of distress, and following all pool facility rules.
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                    I confirm I hold a valid first aid certification (or will obtain one within 30 days of registration) and will maintain all required qualifications throughout my tenure on the Platform. <strong className="text-foreground">The Platform bears no liability for any safety incidents arising from my failure to implement adequate safety measures.</strong>
                  </p>
                </div>

                {/* Section 3 */}
                <div>
                  <h3 className="font-semibold font-display text-[oklch(0.22_0.06_240)] mb-1.5 flex items-center gap-1.5">
                    <FileText size={14} /> 3. Credentials &amp; Punctuality
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    I confirm that all credentials, certifications, and qualifications submitted to the Platform are genuine, current, and accurately represent my professional standing. I agree to promptly notify the Platform of any changes to my certification status.
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                    I commit to punctuality for all booked sessions. Repeated late arrivals or no-shows without 24-hour advance notice may result in suspension or removal from the Platform at the Platform's sole discretion.
                  </p>
                </div>

                {/* Section 4 — Non-Compete */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <h3 className="font-semibold font-display text-red-800 mb-1.5 flex items-center gap-1.5">
                    <FileText size={14} /> 4. Non-Compete &amp; Client Poaching Prohibition
                  </h3>
                  <p className="text-xs text-red-700 leading-relaxed">
                    <strong>I agree that during my active registration on the Platform and for a period of 12 months following my departure</strong>, I will not directly solicit, approach, or accept private coaching engagements from any client who was first introduced to me through the SwimXP platform, outside of the Platform's booking system.
                  </p>
                  <p className="text-xs text-red-700 leading-relaxed mt-2">
                    Any breach of this clause may result in immediate account termination, forfeiture of pending earnings, and civil legal action for damages at the Platform's discretion.
                  </p>
                </div>

                {/* Section 5 — Off-Platform Payments */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <h3 className="font-semibold font-display text-amber-800 mb-1.5 flex items-center gap-1.5">
                    <FileText size={14} /> 5. Off-Platform Payment Prohibition
                  </h3>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    <strong>I agree that all payments for coaching services rendered to clients introduced through the Platform must be processed exclusively through the Platform's integrated Stripe Connect wallet engine.</strong> I will not accept cash, bank transfers, PayNow, PayLah!, or any other direct payment method from Platform-sourced clients for services booked through the Platform.
                  </p>
                  <p className="text-xs text-amber-700 leading-relaxed mt-2">
                    Violation of this clause constitutes a material breach of this Agreement and may result in immediate account suspension, forfeiture of all pending earnings, and recovery of Platform commissions owed.
                  </p>
                </div>

                {/* Section 6 — Introductory Referral Policy */}
                <div className="bg-[oklch(0.22_0.06_240)] border border-[oklch(0.32_0.08_240)] rounded-xl p-3">
                  <h3 className="font-semibold font-display text-white mb-1.5 flex items-center gap-1.5">
                    <FileText size={14} /> 6. Introductory Referral Policy
                  </h3>
                  <p className="text-xs text-white/90 leading-relaxed">
                    <strong className="text-[oklch(0.72_0.13_200)]">
                      To support platform marketing and client matching infrastructure, 100% of the gross coaching fee generated during a Coach's first three (3) successfully completed individual lessons on the platform will be retained by the application as a baseline referral commission. Standard platform payout splits will apply automatically starting from the fourth (4th) lesson onward.
                    </strong>
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-white/75 leading-relaxed">
                    <p>• <strong className="text-white">Lessons 1–3:</strong> 100% of gross lesson fee → Platform corporate wallet. Coach payout: S$0.00.</p>
                    <p>• <strong className="text-white">Lesson 4 onward:</strong> 85% of gross lesson fee → Coach's Stripe Connect account. 15% platform commission.</p>
                    <p>• The lesson counter is tracked automatically per coach profile and is visible in the Coach Dashboard Payouts screen.</p>
                    <p>• This policy applies to each new coach profile independently and cannot be waived or transferred.</p>
                  </div>
                </div>

                {/* Section 7 — Standard Commission */}
                <div>
                  <h3 className="font-semibold font-display text-[oklch(0.22_0.06_240)] mb-1.5 flex items-center gap-1.5">
                    <FileText size={14} /> 7. Standard Platform Commission &amp; Earnings
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    From lesson 4 onward, I acknowledge that the Platform retains a 15% service commission on all bookings processed through the platform. The remaining 85% is disbursed weekly to my registered Stripe Connect account, subject to a minimum payout threshold and standard Stripe processing times.
                  </p>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-2 border-t border-border">
                  <p className="text-xs font-semibold text-foreground">I confirm and agree to the following:</p>
                  {[
                    { key: 'freelancer' as const, label: 'I confirm I am an independent freelancer and no employer-employee relationship exists with the Platform.' },
                    { key: 'safety' as const, label: 'I accept full responsibility for safety protocols during all sessions and hold (or will obtain) valid first aid certification.' },
                    { key: 'credentials' as const, label: 'I confirm all submitted credentials are genuine and I will maintain punctuality for all booked sessions.' },
                    { key: 'nonCompete' as const, label: 'I agree to the non-compete clause and will not poach or privately solicit Platform-sourced clients for 12 months.' },
                    { key: 'payments' as const, label: 'I agree that all payments from Platform-sourced clients must be processed exclusively through the Platform\'s Stripe Connect wallet.' },
                    { key: 'conduct' as const, label: 'I have read, understood, and agree to be legally bound by this Coach Professional Agreement.' },
                    { key: 'referralPolicy' as const, label: 'I understand and accept the Introductory Referral Policy: 100% of my first 3 lesson fees are retained by the Platform as a baseline referral commission, with standard 85/15 splits applying from lesson 4 onward.' },
                  ].map(item => (
                    <div key={item.key} className="flex items-start gap-3">
                      <Checkbox
                        id={`coach-${item.key}`}
                        checked={checks[item.key]}
                        onCheckedChange={() => toggle(item.key)}
                        className="mt-0.5 flex-shrink-0"
                      />
                      <label htmlFor={`coach-${item.key}`} className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>

            <div className="px-5 py-4 border-t border-border bg-background">
              <Button
                className="w-full bg-[oklch(0.35_0.08_240)] hover:bg-[oklch(0.28_0.08_240)] text-white rounded-xl font-semibold"
                disabled={!allChecked}
                onClick={() => setStep('sign')}
              >
                Proceed to Digital Signature
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-2">All 7 declarations must be checked</p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col px-5 py-5 gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <PenLine size={16} className="text-[oklch(0.72_0.13_200)]" />
              Digital Signature
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              By typing your full legal name below, you provide a legally binding digital signature confirming your acceptance of the Coach Professional Agreement dated <strong>{today}</strong>.
            </p>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Full Legal Name *</label>
              <input
                type="text"
                value={signature}
                onChange={e => setSignature(e.target.value)}
                placeholder={coachName || 'e.g. Marcus Tan Wei Jie'}
                className="w-full rounded-xl border border-border bg-[oklch(0.955_0.010_220)] px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.13_200)] placeholder:text-muted-foreground/60"
                style={{ fontFamily: "'Dancing Script', cursive, sans-serif", fontSize: '1.1rem' }}
              />
            </div>
            <div className="bg-[oklch(0.955_0.010_220)] rounded-xl p-3 text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Key obligations:</strong> Independent freelancer status · Full safety responsibility · Valid credentials · No client poaching · All payments via Platform only · <strong className="text-[oklch(0.35_0.08_240)]">100% platform fee for first 3 lessons; 85/15 split from lesson 4+.</strong>
            </div>
            <div className="flex gap-3 mt-auto">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep('read')}>Back</Button>
              <Button
                className="flex-1 bg-[oklch(0.35_0.08_240)] hover:bg-[oklch(0.28_0.08_240)] text-white rounded-xl font-semibold"
                disabled={!canSign}
                onClick={handleAccept}
              >
                <CheckCircle2 size={15} className="mr-1.5" />
                Sign &amp; Agree
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
