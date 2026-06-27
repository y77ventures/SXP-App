import { and, desc, eq, gte, lt, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  clientProfiles,
  coachAvailability,
  coachProfiles,
  InsertUser,
  lessons,
  platformFees,
  poolRegistrations,
  schoolCoaches,
  swimSchools,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── User helpers ─────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const textFields = ["name", "email", "loginMethod"] as const;
  for (const f of textFields) {
    const v = user[f];
    if (v !== undefined) { values[f] = v ?? null; updateSet[f] = v ?? null; }
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }

  if (user.openId === ENV.ownerOpenId) {
    values.role = "admin"; values.platformRole = "root_admin";
    updateSet.role = "admin"; updateSet.platformRole = "root_admin";
  } else if (user.role !== undefined) {
    values.role = user.role; updateSet.role = user.role;
  }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function updateUserPlatformRole(
  userId: number,
  platformRole: "root_admin" | "swim_school" | "coach" | "pool_host" | "client"
) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ platformRole }).where(eq(users.id, userId));
}

// ─── Swim School helpers ──────────────────────────────────────────────────────
export async function getSwimSchoolByOwner(ownerId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(swimSchools).where(eq(swimSchools.ownerId, ownerId)).limit(1);
  return result[0];
}

export async function upsertSwimSchool(data: {
  ownerId: number; name: string; uen?: string; contactEmail?: string;
  contactPhone?: string; address?: string; postalCode?: string;
  brandColor?: string; logoKey?: string; logoUrl?: string;
}) {
  const db = await getDb();
  if (!db) return undefined;
  const existing = await getSwimSchoolByOwner(data.ownerId);
  if (existing) {
    await db.update(swimSchools).set({ ...data, updatedAt: new Date() }).where(eq(swimSchools.id, existing.id));
    return existing.id;
  }
  const result = await db.insert(swimSchools).values(data);
  return (result as any)[0]?.insertId as number;
}

export async function getAllSwimSchools() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(swimSchools).orderBy(desc(swimSchools.createdAt));
}

// ─── Coach Profile helpers ────────────────────────────────────────────────────
export async function getCoachProfileByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(coachProfiles).where(eq(coachProfiles.userId, userId)).limit(1);
  return result[0];
}

export async function upsertCoachProfile(
  data: Partial<typeof coachProfiles.$inferInsert> & { userId: number }
) {
  const db = await getDb();
  if (!db) return undefined;
  const existing = await getCoachProfileByUserId(data.userId);
  if (existing) {
    await db.update(coachProfiles).set({ ...data, updatedAt: new Date() }).where(eq(coachProfiles.id, existing.id));
    return existing.id;
  }
  const result = await db.insert(coachProfiles).values({ ...data, certStatus: "pending" });
  return (result as any)[0]?.insertId as number;
}

export async function getAllCoachProfiles() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(coachProfiles).orderBy(desc(coachProfiles.createdAt));
}

export async function getPendingCoachProfiles() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(coachProfiles).where(eq(coachProfiles.certStatus, "pending"));
}

export async function getExpiringCoachProfiles(withinDays = 30) {
  const db = await getDb();
  if (!db) return [];
  const now = new Date();
  const cutoff = new Date(now.getTime() + withinDays * 24 * 60 * 60 * 1000);
  return db.select().from(coachProfiles).where(
    and(eq(coachProfiles.certStatus, "approved"), gte(coachProfiles.primaryCertExpiry, now), lt(coachProfiles.primaryCertExpiry, cutoff))
  );
}

export async function approveCoachProfile(coachProfileId: number, adminUserId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(coachProfiles).set({ certStatus: "approved", approvedAt: new Date(), approvedBy: adminUserId }).where(eq(coachProfiles.id, coachProfileId));
}

export async function rejectCoachProfile(coachProfileId: number, adminUserId: number, notes: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(coachProfiles).set({ certStatus: "rejected", adminNotes: notes, approvedBy: adminUserId }).where(eq(coachProfiles.id, coachProfileId));
}

export async function updateCoachTier(coachProfileId: number, tier: "basic" | "premium") {
  const db = await getDb();
  if (!db) return;
  await db.update(coachProfiles).set({ subscriptionTier: tier }).where(eq(coachProfiles.id, coachProfileId));
}

// ─── Coach Availability ───────────────────────────────────────────────────────
export async function getCoachAvailability(coachId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(coachAvailability).where(eq(coachAvailability.coachId, coachId));
}

export async function setCoachAvailability(
  coachId: number,
  slots: { dayOfWeek: number; startHour: number; endHour: number }[]
) {
  const db = await getDb();
  if (!db) return;
  await db.delete(coachAvailability).where(eq(coachAvailability.coachId, coachId));
  if (slots.length > 0) await db.insert(coachAvailability).values(slots.map((s) => ({ ...s, coachId })));
}

// ─── Pool Registration helpers ────────────────────────────────────────────────
export async function getPoolsByHost(hostUserId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(poolRegistrations).where(eq(poolRegistrations.hostUserId, hostUserId));
}

export async function createPool(data: typeof poolRegistrations.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(poolRegistrations).values(data);
  return (result as any)[0]?.insertId as number;
}

export async function updatePool(poolId: number, data: Partial<typeof poolRegistrations.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(poolRegistrations).set({ ...data, updatedAt: new Date() }).where(eq(poolRegistrations.id, poolId));
}

// ─── Client Profile helpers ───────────────────────────────────────────────────
export async function getClientProfileByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(clientProfiles).where(eq(clientProfiles.userId, userId)).limit(1);
  return result[0];
}

export async function upsertClientProfile(
  data: Partial<typeof clientProfiles.$inferInsert> & { userId: number }
) {
  const db = await getDb();
  if (!db) return undefined;
  const existing = await getClientProfileByUserId(data.userId);
  if (existing) {
    await db.update(clientProfiles).set({ ...data, updatedAt: new Date() }).where(eq(clientProfiles.id, existing.id));
    return existing.id;
  }
  const result = await db.insert(clientProfiles).values(data);
  return (result as any)[0]?.insertId as number;
}

// ─── Lesson helpers ───────────────────────────────────────────────────────────
export async function getLessonsByClient(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lessons).where(eq(lessons.clientId, clientId)).orderBy(desc(lessons.scheduledAt));
}

export async function getLessonsByCoach(coachId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lessons).where(eq(lessons.coachId, coachId)).orderBy(desc(lessons.scheduledAt));
}

export async function getLessonsBySchool(swimSchoolId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lessons).where(eq(lessons.swimSchoolId, swimSchoolId)).orderBy(desc(lessons.scheduledAt));
}

export async function createLesson(data: typeof lessons.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(lessons).values(data);
  return (result as any)[0]?.insertId as number;
}

export async function updateLessonStatus(
  lessonId: number,
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show"
) {
  const db = await getDb();
  if (!db) return;
  await db.update(lessons).set({ status, updatedAt: new Date() }).where(eq(lessons.id, lessonId));
}

// ─── Platform Analytics (Root Admin) ─────────────────────────────────────────
export async function getPlatformStats() {
  const db = await getDb();
  if (!db) return { totalUsers: 0, totalCoaches: 0, totalLessons: 0, totalFees: "0" };
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [coachCount] = await db.select({ count: sql<number>`count(*)` }).from(coachProfiles);
  const [lessonCount] = await db.select({ count: sql<number>`count(*)` }).from(lessons);
  const [feeSum] = await db.select({ total: sql<string>`COALESCE(SUM(amount), 0)` }).from(platformFees);
  return {
    totalUsers: Number(userCount?.count ?? 0),
    totalCoaches: Number(coachCount?.count ?? 0),
    totalLessons: Number(lessonCount?.count ?? 0),
    totalFees: feeSum?.total ?? "0",
  };
}

export async function getSchoolRoster(swimSchoolId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schoolCoaches).where(eq(schoolCoaches.swimSchoolId, swimSchoolId));
}
