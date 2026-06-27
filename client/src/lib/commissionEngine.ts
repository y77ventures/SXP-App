// commissionEngine.ts
// Progressive Referral Fee Deduction Engine
// Design: Aqua Clarity — tracks per-coach lesson counts and applies 100% platform fee for first 3 lessons,
// then switches to standard 15% platform / 85% coach split from lesson #4 onward.

// ─── Constants ────────────────────────────────────────────────────────────────

export const INTRODUCTORY_LESSON_COUNT = 3;
export const STANDARD_PLATFORM_FEE_PCT = 0.15;  // 15% to platform
export const STANDARD_COACH_PAYOUT_PCT = 0.85;  // 85% to coach
export const INTRO_PLATFORM_FEE_PCT = 1.0;       // 100% to platform for first 3 lessons
export const INTRO_COACH_PAYOUT_PCT = 0.0;       // $0.00 to coach for first 3 lessons

// ─── Types ────────────────────────────────────────────────────────────────────

export type CommissionStatus = 'introductory' | 'standard';

export interface CoachCommissionRecord {
  coachId: string;
  coachName: string;
  completedPaidLessons: number;       // total count of completed + paid lessons
  status: CommissionStatus;           // 'introductory' | 'standard'
  totalEarned: number;                // cumulative coach payout (SGD)
  totalPlatformFees: number;          // cumulative platform fees collected (SGD)
  introLessonsRemaining: number;      // 0 when status = 'standard'
  unlockedAt: string | null;          // ISO date when standard status was triggered
}

export interface LessonPaymentSplit {
  lessonNumber: number;
  grossAmount: number;
  platformFee: number;
  coachPayout: number;
  platformFeePct: number;
  coachPayoutPct: number;
  status: CommissionStatus;
  note: string;
}

// ─── Mock Database Table ──────────────────────────────────────────────────────
// In production this would be a Supabase/Postgres table:
// CREATE TABLE coach_commission_records (
//   coach_id UUID PRIMARY KEY REFERENCES coaches(id),
//   completed_paid_lessons INT DEFAULT 0,
//   status TEXT DEFAULT 'introductory' CHECK (status IN ('introductory', 'standard')),
//   total_earned DECIMAL(10,2) DEFAULT 0,
//   total_platform_fees DECIMAL(10,2) DEFAULT 0,
//   unlocked_at TIMESTAMPTZ,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );

export const mockCoachCommissionDB: CoachCommissionRecord[] = [
  {
    coachId: 'coach-001',
    coachName: 'Marcus Tan',
    completedPaidLessons: 1,
    status: 'introductory',
    totalEarned: 0,
    totalPlatformFees: 240,
    introLessonsRemaining: 2,
    unlockedAt: null,
  },
  {
    coachId: 'coach-002',
    coachName: 'Sarah Chen',
    completedPaidLessons: 3,
    status: 'introductory',
    totalEarned: 0,
    totalPlatformFees: 360,
    introLessonsRemaining: 0,
    unlockedAt: null,
  },
  {
    coachId: 'coach-003',
    coachName: 'Emma Toh',
    completedPaidLessons: 7,
    status: 'standard',
    totalEarned: 714,
    totalPlatformFees: 486,
    introLessonsRemaining: 0,
    unlockedAt: '2026-05-12T08:00:00Z',
  },
  {
    coachId: 'coach-004',
    coachName: 'Linda Park',
    completedPaidLessons: 12,
    status: 'standard',
    totalEarned: 1530,
    totalPlatformFees: 630,
    introLessonsRemaining: 0,
    unlockedAt: '2026-04-20T09:30:00Z',
  },
  {
    coachId: 'coach-005',
    coachName: 'James Koh',
    completedPaidLessons: 2,
    status: 'introductory',
    totalEarned: 0,
    totalPlatformFees: 160,
    introLessonsRemaining: 1,
    unlockedAt: null,
  },
];

// ─── Engine Functions ─────────────────────────────────────────────────────────

/**
 * Compute the payment split for a given coach and lesson amount.
 * Applies 100% platform fee for lessons 1–3, then 15/85 split from lesson 4+.
 */
export function computePaymentSplit(
  coachRecord: CoachCommissionRecord,
  grossAmount: number
): LessonPaymentSplit {
  const lessonNumber = coachRecord.completedPaidLessons + 1;
  const isIntroductory = lessonNumber <= INTRODUCTORY_LESSON_COUNT;

  const platformFeePct = isIntroductory ? INTRO_PLATFORM_FEE_PCT : STANDARD_PLATFORM_FEE_PCT;
  const coachPayoutPct = isIntroductory ? INTRO_COACH_PAYOUT_PCT : STANDARD_COACH_PAYOUT_PCT;

  const platformFee = parseFloat((grossAmount * platformFeePct).toFixed(2));
  const coachPayout = parseFloat((grossAmount * coachPayoutPct).toFixed(2));

  return {
    lessonNumber,
    grossAmount,
    platformFee,
    coachPayout,
    platformFeePct,
    coachPayoutPct,
    status: isIntroductory ? 'introductory' : 'standard',
    note: isIntroductory
      ? `Introductory lesson ${lessonNumber} of ${INTRODUCTORY_LESSON_COUNT} — 100% platform referral fee applies. Coach payout: $0.00.`
      : `Standard commission — 15% platform fee, 85% coach payout.`,
  };
}

/**
 * Process a completed paid lesson: update the coach record and trigger status flag change if needed.
 * Returns the updated record and the payment split.
 */
export function processCompletedLesson(
  record: CoachCommissionRecord,
  grossAmount: number
): { updatedRecord: CoachCommissionRecord; split: LessonPaymentSplit } {
  const split = computePaymentSplit(record, grossAmount);

  const newCompletedCount = record.completedPaidLessons + 1;
  const newStatus: CommissionStatus =
    newCompletedCount >= INTRODUCTORY_LESSON_COUNT ? 'standard' : 'introductory';
  const justUnlocked = record.status === 'introductory' && newStatus === 'standard';

  const updatedRecord: CoachCommissionRecord = {
    ...record,
    completedPaidLessons: newCompletedCount,
    status: newStatus,
    totalEarned: parseFloat((record.totalEarned + split.coachPayout).toFixed(2)),
    totalPlatformFees: parseFloat((record.totalPlatformFees + split.platformFee).toFixed(2)),
    introLessonsRemaining: Math.max(0, INTRODUCTORY_LESSON_COUNT - newCompletedCount),
    unlockedAt: justUnlocked ? new Date().toISOString() : record.unlockedAt,
  };

  return { updatedRecord, split };
}

/**
 * Get the commission record for a specific coach by ID.
 * Returns a default introductory record if not found (new coach).
 */
export function getCoachCommissionRecord(coachId: string): CoachCommissionRecord {
  return (
    mockCoachCommissionDB.find(r => r.coachId === coachId) ?? {
      coachId,
      coachName: 'New Coach',
      completedPaidLessons: 0,
      status: 'introductory',
      totalEarned: 0,
      totalPlatformFees: 0,
      introLessonsRemaining: INTRODUCTORY_LESSON_COUNT,
      unlockedAt: null,
    }
  );
}

/**
 * Format a currency value as SGD string.
 */
export function formatSGD(amount: number): string {
  return `S$${amount.toFixed(2)}`;
}

/**
 * Get a human-readable milestone label for the progress tracker.
 */
export function getMilestoneLabel(record: CoachCommissionRecord): string {
  if (record.status === 'standard') return 'Earnings Unlocked — Standard Payout Active';
  const done = INTRODUCTORY_LESSON_COUNT - record.introLessonsRemaining;
  return `${done} of ${INTRODUCTORY_LESSON_COUNT} Introductory Classes Completed`;
}
