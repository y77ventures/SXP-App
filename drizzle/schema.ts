import {
  boolean,
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// ─── Users ──────────────────────────────────────────────────────────────────
// The 5 platform roles:
//   root_admin      → Global platform command panel
//   swim_school     → B2B swim school CRM admin
//   coach           → Freelance coach (basic or premium tier)
//   pool_host       → Condo / estate pool host
//   client          → Parent or adult swimmer
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  // Legacy admin/user kept for OAuth compatibility; platform role below drives UI
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // SwimXP-specific role
  platformRole: mysqlEnum("platformRole", [
    "root_admin",
    "swim_school",
    "coach",
    "pool_host",
    "client",
  ]).default("client"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Swim Schools (B2B tenants) ──────────────────────────────────────────────
export const swimSchools = mysqlTable("swim_schools", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(), // FK → users.id
  name: varchar("name", { length: 255 }).notNull(),
  logoKey: varchar("logoKey", { length: 512 }), // S3 storage key
  logoUrl: varchar("logoUrl", { length: 512 }), // /manus-storage/... URL
  brandColor: varchar("brandColor", { length: 16 }).default("#1B3A5C"),
  uen: varchar("uen", { length: 32 }), // Singapore UEN business number
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 32 }),
  address: text("address"),
  postalCode: varchar("postalCode", { length: 16 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SwimSchool = typeof swimSchools.$inferSelect;

// ─── Coach Profiles ──────────────────────────────────────────────────────────
export const coachProfiles = mysqlTable("coach_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(), // FK → users.id
  swimSchoolId: int("swimSchoolId"), // null = freelance
  // Subscription tier
  subscriptionTier: mysqlEnum("subscriptionTier", ["basic", "premium"])
    .default("basic")
    .notNull(),
  // Basic profile fields (visible on all tiers)
  bio: text("bio"),
  languages: varchar("languages", { length: 512 }), // comma-separated
  hourlyRate: decimal("hourlyRate", { precision: 8, scale: 2 }),
  yearsExperience: int("yearsExperience"),
  // Certifications
  primaryCert: mysqlEnum("primaryCert", [
    "AUSTSWIM",
    "STA",
    "NROC",
    "International Equivalent",
  ]),
  primaryCertExpiry: timestamp("primaryCertExpiry"),
  primaryCertProofKey: varchar("primaryCertProofKey", { length: 512 }),
  primaryCertProofUrl: varchar("primaryCertProofUrl", { length: 512 }),
  lifesavingCert: mysqlEnum("lifesavingCert", [
    "Bronze Medallion",
    "CPR & AED",
    "First Aid",
    "Equivalent",
  ]),
  lifesavingCertExpiry: timestamp("lifesavingCertExpiry"),
  lifesavingCertProofKey: varchar("lifesavingCertProofKey", { length: 512 }),
  lifesavingCertProofUrl: varchar("lifesavingCertProofUrl", { length: 512 }),
  // Admin approval
  certStatus: mysqlEnum("certStatus", [
    "pending",
    "approved",
    "rejected",
    "expired",
  ])
    .default("pending")
    .notNull(),
  adminNotes: text("adminNotes"),
  approvedAt: timestamp("approvedAt"),
  approvedBy: int("approvedBy"), // FK → users.id (root_admin)
  // Premium-only fields
  videoPortfolioUrl: varchar("videoPortfolioUrl", { length: 512 }),
  catchmentRegions: text("catchmentRegions"), // JSON array of region strings
  // Profile photo
  photoKey: varchar("photoKey", { length: 512 }),
  photoUrl: varchar("photoUrl", { length: 512 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CoachProfile = typeof coachProfiles.$inferSelect;

// ─── Coach Availability Blocks (Premium only) ────────────────────────────────
export const coachAvailability = mysqlTable("coach_availability", {
  id: int("id").autoincrement().primaryKey(),
  coachId: int("coachId").notNull(), // FK → coach_profiles.id
  dayOfWeek: int("dayOfWeek").notNull(), // 0=Sun … 6=Sat
  startHour: int("startHour").notNull(), // 0–23
  endHour: int("endHour").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Pool Registrations (Pool Hosts) ─────────────────────────────────────────
export const poolRegistrations = mysqlTable("pool_registrations", {
  id: int("id").autoincrement().primaryKey(),
  hostUserId: int("hostUserId").notNull(), // FK → users.id
  poolType: mysqlEnum("poolType", ["condominium", "landed_estate", "other"])
    .default("condominium")
    .notNull(),
  estateName: varchar("estateName", { length: 255 }).notNull(),
  fullAddress: text("fullAddress").notNull(),
  postalCode: varchar("postalCode", { length: 16 }).notNull(),
  unitNumber: varchar("unitNumber", { length: 64 }),
  poolLength: int("poolLength"), // metres
  poolDepth: varchar("poolDepth", { length: 64 }), // e.g. "0.9m–1.8m"
  securityGuidelines: text("securityGuidelines"),
  accessInstructions: text("accessInstructions"),
  mcstApproved: boolean("mcstApproved").default(false),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PoolRegistration = typeof poolRegistrations.$inferSelect;

// ─── Client Profiles ─────────────────────────────────────────────────────────
export const clientProfiles = mysqlTable("client_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(), // FK → users.id
  swimSchoolId: int("swimSchoolId"), // null = private booking
  // Swimmer type
  swimmerType: mysqlEnum("swimmerType", ["adult_self", "child"]).default(
    "adult_self"
  ),
  swimmerName: varchar("swimmerName", { length: 255 }),
  swimmerAge: int("swimmerAge"),
  swimmerAgeGroup: mysqlEnum("swimmerAgeGroup", [
    "2-4",
    "5-7",
    "8-10",
    "11-13",
    "14-17",
    "18-25",
    "26-35",
    "36-45",
    "46-55",
    "56+",
  ]),
  swimLevel: mysqlEnum("swimLevel", [
    "non_swimmer",
    "beginner",
    "intermediate",
    "advanced",
    "competitive",
  ]).default("beginner"),
  goals: text("goals"),
  // Pool preference
  preferredPoolId: int("preferredPoolId"), // FK → pool_registrations.id
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientProfile = typeof clientProfiles.$inferSelect;

// ─── Lessons ─────────────────────────────────────────────────────────────────
export const lessons = mysqlTable("lessons", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(), // FK → client_profiles.id
  coachId: int("coachId").notNull(), // FK → coach_profiles.id
  poolId: int("poolId"), // FK → pool_registrations.id
  swimSchoolId: int("swimSchoolId"), // FK → swim_schools.id (if school booking)
  scheduledAt: timestamp("scheduledAt").notNull(),
  durationMinutes: int("durationMinutes").default(60).notNull(),
  status: mysqlEnum("status", [
    "pending",
    "confirmed",
    "completed",
    "cancelled",
    "no_show",
  ])
    .default("pending")
    .notNull(),
  // Compliance: lesson must start/end inside platform
  coachConfirmedStart: boolean("coachConfirmedStart").default(false),
  coachConfirmedEnd: boolean("coachConfirmedEnd").default(false),
  clientConfirmedEnd: boolean("clientConfirmedEnd").default(false),
  // Billing
  rateAtBooking: decimal("rateAtBooking", { precision: 8, scale: 2 }),
  platformFeePercent: decimal("platformFeePercent", {
    precision: 5,
    scale: 2,
  }).default("10.00"),
  platformFeeAmount: decimal("platformFeeAmount", { precision: 8, scale: 2 }),
  coachPayout: decimal("coachPayout", { precision: 8, scale: 2 }),
  paymentStatus: mysqlEnum("paymentStatus", [
    "unpaid",
    "paid",
    "refunded",
    "disputed",
  ])
    .default("unpaid")
    .notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lesson = typeof lessons.$inferSelect;

// ─── Platform Fee Ledger (Root Admin) ────────────────────────────────────────
export const platformFees = mysqlTable("platform_fees", {
  id: int("id").autoincrement().primaryKey(),
  lessonId: int("lessonId").notNull().unique(),
  amount: decimal("amount", { precision: 8, scale: 2 }).notNull(),
  collectedAt: timestamp("collectedAt").defaultNow().notNull(),
});

// ─── Swim School Roster (school → coach membership) ──────────────────────────
export const schoolCoaches = mysqlTable("school_coaches", {
  id: int("id").autoincrement().primaryKey(),
  swimSchoolId: int("swimSchoolId").notNull(),
  coachId: int("coachId").notNull(), // FK → coach_profiles.id
  role: mysqlEnum("role", ["head_coach", "assistant", "guest"])
    .default("assistant")
    .notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});
