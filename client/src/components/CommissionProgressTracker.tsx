// CommissionProgressTracker.tsx
// Reusable progress tracker for the First-3 Classes Commission Rule
// Shows milestone bar, lesson count, payout status, and split breakdown

import { CheckCircle2, Lock, Unlock, TrendingUp, DollarSign, Info } from 'lucide-react';
import {
  CoachCommissionRecord,
  INTRODUCTORY_LESSON_COUNT,
  formatSGD,
  getMilestoneLabel,
} from '@/lib/commissionEngine';

interface CommissionProgressTrackerProps {
  record: CoachCommissionRecord;
  compact?: boolean; // compact mode for dashboard widget
}

export default function CommissionProgressTracker({
  record,
  compact = false,
}: CommissionProgressTrackerProps) {
  const completedIntro = Math.min(record.completedPaidLessons, INTRODUCTORY_LESSON_COUNT);
  const progressPct = Math.min((completedIntro / INTRODUCTORY_LESSON_COUNT) * 100, 100);
  const isUnlocked = record.status === 'standard';

  // ── Compact widget (for Dashboard overview) ──────────────────────────────
  if (compact) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isUnlocked ? (
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                <Unlock size={13} className="text-emerald-600" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-[oklch(0.93_0.05_200)] flex items-center justify-center">
                <Lock size={13} className="text-[oklch(0.45_0.12_200)]" />
              </div>
            )}
            <span className="text-sm font-semibold text-foreground">Earnings Status</span>
          </div>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isUnlocked
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-[oklch(0.93_0.05_200)] text-[oklch(0.35_0.12_200)]'
            }`}
          >
            {isUnlocked ? 'Standard Payout' : 'Introductory'}
          </span>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>{getMilestoneLabel(record)}</span>
            <span>{completedIntro}/{INTRODUCTORY_LESSON_COUNT}</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isUnlocked
                  ? 'bg-emerald-500'
                  : 'bg-[oklch(0.55_0.14_200)]'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Milestone dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: INTRODUCTORY_LESSON_COUNT }).map((_, i) => {
            const done = i < completedIntro;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    done
                      ? 'bg-[oklch(0.55_0.14_200)] text-white'
                      : 'bg-muted text-muted-foreground border border-border'
                  }`}
                >
                  {done ? <CheckCircle2 size={13} /> : i + 1}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {done ? 'Done' : `Lesson ${i + 1}`}
                </span>
              </div>
            );
          })}
          {/* Unlock milestone */}
          <div className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                isUnlocked
                  ? 'bg-emerald-500 text-white'
                  : 'bg-muted text-muted-foreground border border-border'
              }`}
            >
              {isUnlocked ? <Unlock size={13} /> : <Lock size={11} />}
            </div>
            <span className="text-[10px] text-muted-foreground">
              {isUnlocked ? 'Unlocked' : 'Lesson 4+'}
            </span>
          </div>
        </div>

        {/* Current split */}
        <div className="flex gap-2">
          <div className="flex-1 rounded-xl bg-muted/60 p-2 text-center">
            <p className="text-[10px] text-muted-foreground">Your Cut</p>
            <p className={`text-sm font-bold ${isUnlocked ? 'text-emerald-600' : 'text-[oklch(0.45_0.12_200)]'}`}>
              {isUnlocked ? '85%' : '0%'}
            </p>
          </div>
          <div className="flex-1 rounded-xl bg-muted/60 p-2 text-center">
            <p className="text-[10px] text-muted-foreground">Platform</p>
            <p className="text-sm font-bold text-foreground">{isUnlocked ? '15%' : '100%'}</p>
          </div>
          <div className="flex-1 rounded-xl bg-muted/60 p-2 text-center">
            <p className="text-[10px] text-muted-foreground">Earned</p>
            <p className="text-sm font-bold text-foreground">{formatSGD(record.totalEarned)}</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Full panel (for Wallet / Payouts screen) ──────────────────────────────
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header banner */}
      <div
        className={`px-5 py-4 ${
          isUnlocked
            ? 'bg-gradient-to-r from-emerald-600 to-emerald-500'
            : 'bg-gradient-to-r from-[oklch(0.28_0.08_240)] to-[oklch(0.38_0.10_210)]'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              {isUnlocked ? (
                <TrendingUp size={20} className="text-white" />
              ) : (
                <Lock size={20} className="text-white" />
              )}
            </div>
            <div>
              <p className="text-white font-display font-semibold text-base leading-tight">
                {isUnlocked ? 'Standard Payout Active' : 'Introductory Commission Period'}
              </p>
              <p className="text-white/70 text-xs mt-0.5">
                {isUnlocked
                  ? 'You earn 85% of every lesson fee'
                  : `${record.introLessonsRemaining} introductory lesson${record.introLessonsRemaining !== 1 ? 's' : ''} remaining`}
              </p>
            </div>
          </div>
          <span className="text-white/80 text-xs font-medium bg-white/15 px-3 py-1 rounded-full">
            {isUnlocked ? '85 / 15' : '0 / 100'}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Milestone progress bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-foreground">Milestone Progress</span>
            <span className="text-xs text-muted-foreground">
              {completedIntro} of {INTRODUCTORY_LESSON_COUNT} introductory classes
            </span>
          </div>
          <div className="relative h-4 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isUnlocked ? 'bg-emerald-500' : 'bg-[oklch(0.55_0.14_200)]'
              }`}
              style={{ width: `${progressPct}%` }}
            />
            {/* Tick marks */}
            {Array.from({ length: INTRODUCTORY_LESSON_COUNT - 1 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-px bg-background/40"
                style={{ left: `${((i + 1) / INTRODUCTORY_LESSON_COUNT) * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Lesson milestone steps */}
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: INTRODUCTORY_LESSON_COUNT }).map((_, i) => {
            const done = i < completedIntro;
            const current = i === completedIntro && !isUnlocked;
            return (
              <div
                key={i}
                className={`rounded-xl p-3 text-center border transition-all ${
                  done
                    ? 'bg-[oklch(0.93_0.05_200)] border-[oklch(0.80_0.10_200)]'
                    : current
                    ? 'bg-[oklch(0.97_0.02_200)] border-[oklch(0.72_0.13_200)] ring-1 ring-[oklch(0.72_0.13_200)]'
                    : 'bg-muted/40 border-border'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full mx-auto mb-1.5 flex items-center justify-center text-xs font-bold ${
                    done
                      ? 'bg-[oklch(0.55_0.14_200)] text-white'
                      : current
                      ? 'bg-[oklch(0.72_0.13_200)] text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {done ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                <p className="text-[10px] font-semibold text-foreground">Lesson {i + 1}</p>
                <p className={`text-[10px] mt-0.5 ${done ? 'text-[oklch(0.45_0.12_200)]' : 'text-muted-foreground'}`}>
                  {done ? '100% platform' : 'Pending'}
                </p>
              </div>
            );
          })}
          {/* Unlock card */}
          <div
            className={`rounded-xl p-3 text-center border transition-all ${
              isUnlocked
                ? 'bg-emerald-50 border-emerald-300'
                : 'bg-muted/40 border-border'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full mx-auto mb-1.5 flex items-center justify-center ${
                isUnlocked ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
              }`}
            >
              {isUnlocked ? <Unlock size={14} /> : <Lock size={12} />}
            </div>
            <p className="text-[10px] font-semibold text-foreground">Lesson 4+</p>
            <p className={`text-[10px] mt-0.5 ${isUnlocked ? 'text-emerald-600' : 'text-muted-foreground'}`}>
              {isUnlocked ? '85% yours' : 'Locked'}
            </p>
          </div>
        </div>

        {/* Earnings breakdown */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-muted/50 p-3 text-center">
            <DollarSign size={14} className="mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Total Earned</p>
            <p className="text-base font-bold text-foreground mt-0.5">{formatSGD(record.totalEarned)}</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-3 text-center">
            <TrendingUp size={14} className="mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Platform Fees</p>
            <p className="text-base font-bold text-foreground mt-0.5">{formatSGD(record.totalPlatformFees)}</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-3 text-center">
            <CheckCircle2 size={14} className="mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Lessons Done</p>
            <p className="text-base font-bold text-foreground mt-0.5">{record.completedPaidLessons}</p>
          </div>
        </div>

        {/* Info notice */}
        {!isUnlocked && (
          <div className="flex gap-2 bg-[oklch(0.95_0.02_220)] border border-[oklch(0.85_0.05_220)] rounded-xl p-3">
            <Info size={14} className="text-[oklch(0.45_0.10_220)] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[oklch(0.35_0.08_220)] leading-relaxed">
              <strong>Introductory Referral Policy:</strong> 100% of your first {INTRODUCTORY_LESSON_COUNT} lesson fees are retained by the platform as a baseline referral commission. Your standard 85% payout activates automatically from lesson {INTRODUCTORY_LESSON_COUNT + 1} onward. This is disclosed in your Coach Professional Agreement.
            </p>
          </div>
        )}
        {isUnlocked && record.unlockedAt && (
          <div className="flex gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-700 leading-relaxed">
              <strong>Standard payout unlocked</strong> on {new Date(record.unlockedAt).toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' })}. You now receive 85% of every lesson fee directly to your Stripe Connect account.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
