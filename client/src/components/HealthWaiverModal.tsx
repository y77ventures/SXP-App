// HealthWaiverModal — Health Declaration & Liability Waiver
// Must be accepted before completing registration (Parent/Client flow)
// Legal: platform not liable for undisclosed medical conditions, injuries, or pool incidents

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, AlertTriangle, FileText, PenLine } from 'lucide-react';
import { toast } from 'sonner';

interface HealthWaiverModalProps {
  open: boolean;
  onAccept: (signature: string) => void;
  onClose: () => void;
  userName?: string;
}

export default function HealthWaiverModal({ open, onAccept, onClose, userName = '' }: HealthWaiverModalProps) {
  const [checks, setChecks] = useState({
    medical: false,
    liability: false,
    pool: false,
    age: false,
    terms: false,
  });
  const [signature, setSignature] = useState('');
  const [step, setStep] = useState<'read' | 'sign'>('read');
  const today = new Date().toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' });

  const allChecked = Object.values(checks).every(Boolean);
  const canSign = allChecked && signature.trim().length >= 3;

  const toggle = (key: keyof typeof checks) =>
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));

  const handleAccept = () => {
    if (!canSign) return;
    onAccept(signature.trim());
    toast.success('Waiver signed and accepted', {
      description: 'Your health declaration has been recorded.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] flex flex-col p-0 gap-0 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[oklch(0.22_0.06_240)] px-5 py-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[oklch(0.72_0.13_200)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Shield size={20} className="text-[oklch(0.72_0.13_200)]" />
          </div>
          <div>
            <DialogTitle className="text-white font-display text-base leading-tight">
              Health Declaration &amp; Liability Waiver
            </DialogTitle>
            <p className="text-white/60 text-xs mt-0.5">Required before completing registration</p>
          </div>
        </div>

        {step === 'read' ? (
          <>
            <ScrollArea className="flex-1 max-h-[55vh]">
              <div className="px-5 py-4 space-y-4 text-sm text-foreground">
                {/* Warning banner */}
                <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-800 text-xs leading-relaxed">
                    Please read this document carefully. By proceeding, you confirm that you have read, understood, and agree to all terms below.
                  </p>
                </div>

                {/* Section 1 */}
                <div>
                  <h3 className="font-semibold font-display text-[oklch(0.22_0.06_240)] mb-1.5 flex items-center gap-1.5">
                    <FileText size={14} /> 1. Health &amp; Medical Disclosure
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    I, the undersigned, hereby declare that I (and/or the minor(s) I am registering) am in a suitable physical condition to participate in swimming lessons and aquatic activities. I confirm that I have disclosed all known medical conditions, physical limitations, allergies, and health concerns to the assigned coach prior to commencement of any lesson.
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                    <strong className="text-foreground">Swim Xperience Pte. Ltd. ("the Platform") shall bear no liability whatsoever</strong> for any adverse health events, medical emergencies, injuries, or fatalities arising from undisclosed pre-existing medical conditions, physical limitations, or health risks that were not communicated to the coach or the Platform prior to participation.
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <h3 className="font-semibold font-display text-[oklch(0.22_0.06_240)] mb-1.5 flex items-center gap-1.5">
                    <FileText size={14} /> 2. Assumption of Risk &amp; Physical Injury
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    I acknowledge that swimming and aquatic activities carry inherent risks including but not limited to: slipping on pool decks, physical contact with pool infrastructure, muscle strains, and drowning. I voluntarily assume all such risks on behalf of myself and any minor(s) under my guardianship.
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                    <strong className="text-foreground">The Platform, its directors, employees, contractors, and affiliated coaches shall not be held liable</strong> under any circumstance for physical injuries, accidents, or fatalities occurring during or in connection with any lesson booked through the Platform, whether caused by negligence, equipment failure, or unforeseen circumstances.
                  </p>
                </div>

                {/* Section 3 */}
                <div>
                  <h3 className="font-semibold font-display text-[oklch(0.22_0.06_240)] mb-1.5 flex items-center gap-1.5">
                    <FileText size={14} /> 3. Pool Incident &amp; Accidental Liability
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    I understand that the Platform does not own, operate, manage, or supervise any swimming pool facility. All pool venues are independently owned and operated. In the event of any accidental pool incident, near-drowning, or property damage occurring at a booked venue, <strong className="text-foreground">liability rests solely with the pool facility operator and/or the participating individuals</strong>, and not with the Platform.
                  </p>
                </div>

                {/* Section 4 */}
                <div>
                  <h3 className="font-semibold font-display text-[oklch(0.22_0.06_240)] mb-1.5 flex items-center gap-1.5">
                    <FileText size={14} /> 4. Indemnification
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    I agree to indemnify, defend, and hold harmless Swim Xperience Pte. Ltd. and its affiliates from and against any claims, damages, losses, liabilities, costs, and expenses (including legal fees) arising out of or related to my participation in any activity facilitated through the Platform.
                  </p>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-2 border-t border-border">
                  <p className="text-xs font-semibold text-foreground">Please confirm each statement:</p>

                  {[
                    { key: 'medical' as const, label: 'I confirm I have disclosed all known medical conditions for myself and any registered minor(s).' },
                    { key: 'liability' as const, label: 'I understand the Platform bears no liability for injuries, medical emergencies, or fatalities from undisclosed conditions.' },
                    { key: 'pool' as const, label: 'I accept that pool incidents are the liability of the facility operator and participating individuals, not the Platform.' },
                    { key: 'age' as const, label: 'I confirm I am 18 years of age or older, or am the legal guardian of the minor(s) being registered.' },
                    { key: 'terms' as const, label: 'I have read, understood, and agree to be legally bound by this Health Declaration & Liability Waiver.' },
                  ].map(item => (
                    <div key={item.key} className="flex items-start gap-3">
                      <Checkbox
                        id={item.key}
                        checked={checks[item.key]}
                        onCheckedChange={() => toggle(item.key)}
                        className="mt-0.5 flex-shrink-0"
                      />
                      <label htmlFor={item.key} className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-border bg-background">
              <Button
                className="w-full bg-[oklch(0.72_0.13_200)] hover:bg-[oklch(0.62_0.13_200)] text-white rounded-xl font-semibold"
                disabled={!allChecked}
                onClick={() => setStep('sign')}
              >
                Proceed to Digital Signature
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-2">
                All 5 declarations must be checked to continue
              </p>
            </div>
          </>
        ) : (
          /* Signature step */
          <div className="flex-1 flex flex-col px-5 py-5 gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <PenLine size={16} className="text-[oklch(0.72_0.13_200)]" />
              Digital Signature
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              By typing your full legal name below, you are providing a legally binding digital signature confirming your acceptance of the Health Declaration &amp; Liability Waiver dated <strong>{today}</strong>.
            </p>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">
                Full Legal Name *
              </label>
              <input
                type="text"
                value={signature}
                onChange={e => setSignature(e.target.value)}
                placeholder={userName || 'e.g. Jennifer Lim Mei Ling'}
                className="w-full rounded-xl border border-border bg-[oklch(0.955_0.010_220)] px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.13_200)] placeholder:text-muted-foreground/60"
                style={{ fontFamily: "'Dancing Script', cursive, sans-serif", fontSize: '1.1rem' }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your signature will be timestamped and stored securely.
              </p>
            </div>

            <div className="bg-[oklch(0.955_0.010_220)] rounded-xl p-3 text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Summary of Agreement:</strong> You confirm full health disclosure, assume all inherent risks, and release Swim Xperience Pte. Ltd. from all liability related to injuries, medical events, and pool incidents.
            </div>

            <div className="flex gap-3 mt-auto">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep('read')}>
                Back
              </Button>
              <Button
                className="flex-2 bg-[oklch(0.22_0.06_240)] hover:bg-[oklch(0.30_0.06_240)] text-white rounded-xl font-semibold px-6"
                disabled={!canSign}
                onClick={handleAccept}
              >
                Sign &amp; Accept
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
