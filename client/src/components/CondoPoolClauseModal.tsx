// CondoPoolClauseModal — Private Property & Condo Pool Clause
// Required in both Client/Parent and Pool Host onboarding flows
// Legal: client responsible for MCST permission; platform is independent matchmaking intermediary

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface CondoPoolClauseModalProps {
  open: boolean;
  role: 'client' | 'host';
  onAccept: () => void;
  onClose: () => void;
}

export default function CondoPoolClauseModal({ open, role, onAccept, onClose }: CondoPoolClauseModalProps) {
  const [checks, setChecks] = useState({
    permission: false,
    mcst: false,
    fines: false,
    intermediary: false,
    indemnify: false,
  });

  const allChecked = Object.values(checks).every(Boolean);
  const toggle = (key: keyof typeof checks) =>
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));

  const handleAccept = () => {
    if (!allChecked) return;
    onAccept();
    toast.success('Condo Pool Clause accepted', {
      description: 'Your agreement has been recorded.',
    });
  };

  const isHost = role === 'host';

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] flex flex-col p-0 gap-0 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[oklch(0.52_0.14_200)] px-5 py-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <DialogTitle className="text-white font-display text-base leading-tight">
              Private Property &amp; Condo Pool Clause
            </DialogTitle>
            <p className="text-white/70 text-xs mt-0.5">
              {isHost ? 'Pool Host Agreement' : 'Client / Parent Agreement'}
            </p>
          </div>
        </div>

        <ScrollArea className="flex-1 max-h-[60vh]">
          <div className="px-5 py-4 space-y-4 text-sm">
            {/* Warning */}
            <div className="flex gap-2 bg-blue-50 border border-blue-200 rounded-xl p-3">
              <AlertTriangle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-blue-800 text-xs leading-relaxed">
                This clause applies to all swimming sessions conducted at private residential properties, condominium pools, and managed estate facilities.
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h3 className="font-semibold font-display text-[oklch(0.22_0.06_240)] mb-1.5 flex items-center gap-1.5">
                <FileText size={14} /> 1. Responsibility for Obtaining Permission
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isHost
                  ? 'As a Pool Host, you confirm that you are the authorised representative of the property and have obtained all necessary permissions from the Management Corporation Strata Title ("MCST"), estate management, or relevant property authority to list this pool for private coaching sessions on the SwimXP platform.'
                  : 'As a Client/Parent, you are entirely and solely responsible for securing written or verbal permission from your condominium\'s Management Corporation Strata Title ("MCST"), estate management office, or relevant property authority before conducting any private coaching session at your residential pool or estate facility.'}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                <strong className="text-foreground">Swim Xperience Pte. Ltd. ("the Platform") does not obtain, verify, or guarantee</strong> any such permissions on behalf of clients, parents, coaches, or pool hosts. The responsibility to comply with all estate guidelines, by-laws, and management rules rests entirely with the booking user.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="font-semibold font-display text-[oklch(0.22_0.06_240)] mb-1.5 flex items-center gap-1.5">
                <FileText size={14} /> 2. Platform as Independent Matchmaking Intermediary
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Swim Xperience Pte. Ltd. operates exclusively as an <strong className="text-foreground">independent digital matchmaking intermediary</strong> that connects swim coaches with clients and pool facilities. The Platform does not employ coaches, manage pool facilities, or supervise any coaching sessions.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                The Platform has no legal standing as a party to any arrangement between a client, coach, and pool facility. All contractual obligations, safety responsibilities, and compliance duties lie with the individual parties to each booking.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h3 className="font-semibold font-display text-[oklch(0.22_0.06_240)] mb-1.5 flex items-center gap-1.5">
                <FileText size={14} /> 3. Fines, Disputes &amp; Pool Closures
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Any fines, penalties, pool access revocations, resident disputes, or legal notices</strong> issued by condominium security, estate management, MCST, or any government authority in connection with a coaching session conducted at a private or managed property shall be the <strong className="text-foreground">sole liability of the booking user</strong> (client, parent, or pool host, as applicable).
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                The Platform shall bear no financial, legal, or reputational liability arising from such incidents. The booking user agrees to indemnify the Platform against any claims, costs, or damages arising from non-compliance with estate rules or management directives.
              </p>
            </div>

            {/* Section 4 — Host specific */}
            {isHost && (
              <div>
                <h3 className="font-semibold font-display text-[oklch(0.22_0.06_240)] mb-1.5 flex items-center gap-1.5">
                  <FileText size={14} /> 4. Pool Host Additional Obligations
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  As a Pool Host, you further confirm that: (a) the pool meets all safety standards required by the Singapore Sports Council and relevant authorities; (b) valid public liability insurance is in place for the facility; (c) you will promptly notify the Platform of any changes to pool availability, access restrictions, or management directives that may affect bookings.
                </p>
              </div>
            )}

            {/* Checkboxes */}
            <div className="space-y-3 pt-2 border-t border-border">
              <p className="text-xs font-semibold text-foreground">I confirm and agree to the following:</p>

              {[
                {
                  key: 'permission' as const,
                  label: isHost
                    ? 'I confirm I have obtained all necessary MCST/management permissions to list this pool.'
                    : 'I understand I am solely responsible for obtaining MCST/management permission before any coaching session at my condo pool.',
                },
                {
                  key: 'mcst' as const,
                  label: 'I acknowledge the Platform does not obtain or verify estate permissions on my behalf.',
                },
                {
                  key: 'fines' as const,
                  label: 'I accept that any fines, pool closures, or resident disputes are my sole liability, not the Platform\'s.',
                },
                {
                  key: 'intermediary' as const,
                  label: 'I understand the Platform operates solely as an independent matchmaking intermediary with no supervisory role.',
                },
                {
                  key: 'indemnify' as const,
                  label: 'I agree to indemnify Swim Xperience Pte. Ltd. against any claims arising from non-compliance with estate or management rules.',
                },
              ].map(item => (
                <div key={item.key} className="flex items-start gap-3">
                  <Checkbox
                    id={`condo-${item.key}`}
                    checked={checks[item.key]}
                    onCheckedChange={() => toggle(item.key)}
                    className="mt-0.5 flex-shrink-0"
                  />
                  <label htmlFor={`condo-${item.key}`} className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
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
            className="w-full bg-[oklch(0.52_0.14_200)] hover:bg-[oklch(0.42_0.14_200)] text-white rounded-xl font-semibold"
            disabled={!allChecked}
            onClick={handleAccept}
          >
            <CheckCircle2 size={16} className="mr-2" />
            I Accept the Condo Pool Clause
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-2">
            All 5 declarations must be checked to continue
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
