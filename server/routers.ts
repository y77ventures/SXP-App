import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  approveCoachProfile, getAllCoachProfiles, getAllSwimSchools,
  getClientProfileByUserId, getCoachAvailability, getCoachProfileByUserId,
  getExpiringCoachProfiles, getLessonsByClient, getLessonsByCoach,
  getLessonsBySchool, getPendingCoachProfiles, getPlatformStats,
  getPoolsByHost, getSchoolRoster, getSwimSchoolByOwner, rejectCoachProfile,
  setCoachAvailability, updateCoachTier, updateLessonStatus,
  updateUserPlatformRole, upsertClientProfile, upsertCoachProfile,
  upsertSwimSchool, createPool, updatePool, createLesson,
} from "./db";
import { storagePut } from "./storage";

// Role-gating middleware
const rootAdminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin" && ctx.user.platformRole !== "root_admin")
    throw new TRPCError({ code: "FORBIDDEN", message: "Root admin access required" });
  return next({ ctx });
});

const swimSchoolProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.platformRole !== "swim_school" && ctx.user.platformRole !== "root_admin")
    throw new TRPCError({ code: "FORBIDDEN", message: "Swim school admin access required" });
  return next({ ctx });
});

const coachProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.platformRole !== "coach" && ctx.user.platformRole !== "root_admin")
    throw new TRPCError({ code: "FORBIDDEN", message: "Coach access required" });
  return next({ ctx });
});

const poolHostProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.platformRole !== "pool_host" && ctx.user.platformRole !== "root_admin")
    throw new TRPCError({ code: "FORBIDDEN", message: "Pool host access required" });
  return next({ ctx });
});

async function uploadBase64File(base64: string, mimeType: string, keyPrefix: string) {
  const buffer = Buffer.from(base64, "base64");
  const ext = mimeType.split("/")[1]?.replace("jpeg", "jpg") ?? "bin";
  const key = `${keyPrefix}-${Date.now()}.${ext}`;
  return storagePut(key, buffer, mimeType);
}

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    setPlatformRole: protectedProcedure
      .input(z.object({ role: z.enum(["swim_school", "coach", "pool_host", "client"]) }))
      .mutation(async ({ ctx, input }) => {
        await updateUserPlatformRole(ctx.user.id, input.role);
        return { success: true };
      }),
  }),

  admin: router({
    platformStats: rootAdminProcedure.query(async () => getPlatformStats()),
    allCoaches: rootAdminProcedure.query(async () => getAllCoachProfiles()),
    pendingCoaches: rootAdminProcedure.query(async () => getPendingCoachProfiles()),
    expiringCoaches: rootAdminProcedure
      .input(z.object({ withinDays: z.number().default(30) }))
      .query(async ({ input }) => getExpiringCoachProfiles(input.withinDays)),
    approveCoach: rootAdminProcedure
      .input(z.object({ coachProfileId: z.number(), approve: z.boolean(), notes: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        if (input.approve) await approveCoachProfile(input.coachProfileId, ctx.user.id);
        else await rejectCoachProfile(input.coachProfileId, ctx.user.id, input.notes ?? "");
        return { success: true };
      }),
    setCoachTier: rootAdminProcedure
      .input(z.object({ coachProfileId: z.number(), tier: z.enum(["basic", "premium"]) }))
      .mutation(async ({ input }) => { await updateCoachTier(input.coachProfileId, input.tier); return { success: true }; }),
    allSwimSchools: rootAdminProcedure.query(async () => getAllSwimSchools()),
  }),

  swimSchool: router({
    mySchool: swimSchoolProcedure.query(async ({ ctx }) => getSwimSchoolByOwner(ctx.user.id)),
    upsert: swimSchoolProcedure
      .input(z.object({
        name: z.string().min(1), uen: z.string().optional(),
        contactEmail: z.string().email().optional(), contactPhone: z.string().optional(),
        address: z.string().optional(), postalCode: z.string().optional(), brandColor: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await upsertSwimSchool({ ownerId: ctx.user.id, ...input });
        return { success: true, id };
      }),
    uploadLogo: swimSchoolProcedure
      .input(z.object({ base64: z.string(), mimeType: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { key, url } = await uploadBase64File(input.base64, input.mimeType, `school-logos/${ctx.user.id}`);
        await upsertSwimSchool({ ownerId: ctx.user.id, name: "", logoKey: key, logoUrl: url });
        return { key, url };
      }),
    roster: swimSchoolProcedure.query(async ({ ctx }) => {
      const school = await getSwimSchoolByOwner(ctx.user.id);
      if (!school) return [];
      return getSchoolRoster(school.id);
    }),
    lessons: swimSchoolProcedure.query(async ({ ctx }) => {
      const school = await getSwimSchoolByOwner(ctx.user.id);
      if (!school) return [];
      return getLessonsBySchool(school.id);
    }),
  }),

  coach: router({
    myProfile: coachProcedure.query(async ({ ctx }) => getCoachProfileByUserId(ctx.user.id)),
    saveProfile: coachProcedure
      .input(z.object({
        bio: z.string().optional(), languages: z.string().optional(),
        hourlyRate: z.string().optional(), yearsExperience: z.number().optional(),
        primaryCert: z.enum(["AUSTSWIM", "STA", "NROC", "International Equivalent"]).optional(),
        primaryCertExpiry: z.date().optional(),
        lifesavingCert: z.enum(["Bronze Medallion", "CPR & AED", "First Aid", "Equivalent"]).optional(),
        lifesavingCertExpiry: z.date().optional(),
        videoPortfolioUrl: z.string().url().optional(),
        catchmentRegions: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const now = new Date();
        if (input.primaryCertExpiry && input.primaryCertExpiry < now)
          throw new TRPCError({ code: "BAD_REQUEST", message: "Registration cannot be accepted with an expired certification. Please upload an active, valid credential to proceed." });
        if (input.lifesavingCertExpiry && input.lifesavingCertExpiry < now)
          throw new TRPCError({ code: "BAD_REQUEST", message: "Registration cannot be accepted with an expired certification. Please upload an active, valid credential to proceed." });
        const id = await upsertCoachProfile({ userId: ctx.user.id, ...input });
        return { success: true, id };
      }),
    uploadCertProof: coachProcedure
      .input(z.object({ base64: z.string(), mimeType: z.string(), certType: z.enum(["primary", "lifesaving"]) }))
      .mutation(async ({ ctx, input }) => {
        const { key, url } = await uploadBase64File(input.base64, input.mimeType, `cert-proofs/${ctx.user.id}/${input.certType}`);
        const update = input.certType === "primary"
          ? { primaryCertProofKey: key, primaryCertProofUrl: url }
          : { lifesavingCertProofKey: key, lifesavingCertProofUrl: url };
        await upsertCoachProfile({ userId: ctx.user.id, ...update });
        return { key, url };
      }),
    uploadPhoto: coachProcedure
      .input(z.object({ base64: z.string(), mimeType: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { key, url } = await uploadBase64File(input.base64, input.mimeType, `coach-photos/${ctx.user.id}`);
        await upsertCoachProfile({ userId: ctx.user.id, photoKey: key, photoUrl: url });
        return { key, url };
      }),
    myLessons: coachProcedure.query(async ({ ctx }) => {
      const profile = await getCoachProfileByUserId(ctx.user.id);
      if (!profile) return [];
      return getLessonsByCoach(profile.id);
    }),
    availability: coachProcedure.query(async ({ ctx }) => {
      const profile = await getCoachProfileByUserId(ctx.user.id);
      if (!profile) return [];
      return getCoachAvailability(profile.id);
    }),
    setAvailability: coachProcedure
      .input(z.object({ slots: z.array(z.object({ dayOfWeek: z.number().min(0).max(6), startHour: z.number().min(0).max(23), endHour: z.number().min(1).max(24) })) }))
      .mutation(async ({ ctx, input }) => {
        const profile = await getCoachProfileByUserId(ctx.user.id);
        if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Coach profile not found" });
        if (profile.subscriptionTier !== "premium")
          throw new TRPCError({ code: "FORBIDDEN", message: "Availability calendar is a Premium feature. Upgrade to unlock." });
        await setCoachAvailability(profile.id, input.slots);
        return { success: true };
      }),
  }),

  poolHost: router({
    myPools: poolHostProcedure.query(async ({ ctx }) => getPoolsByHost(ctx.user.id)),
    registerPool: poolHostProcedure
      .input(z.object({
        poolType: z.enum(["condominium", "landed_estate", "other"]).default("condominium"),
        estateName: z.string().min(1), fullAddress: z.string().min(1),
        postalCode: z.string().length(6), unitNumber: z.string().optional(),
        poolLength: z.number().optional(), poolDepth: z.string().optional(),
        securityGuidelines: z.string().optional(), accessInstructions: z.string().optional(),
        mcstApproved: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await createPool({ hostUserId: ctx.user.id, ...input });
        return { success: true, id };
      }),
    updatePool: poolHostProcedure
      .input(z.object({ poolId: z.number(), data: z.object({ estateName: z.string().optional(), fullAddress: z.string().optional(), postalCode: z.string().optional(), securityGuidelines: z.string().optional(), accessInstructions: z.string().optional(), mcstApproved: z.boolean().optional() }) }))
      .mutation(async ({ input }) => { await updatePool(input.poolId, input.data); return { success: true }; }),
  }),

  clientProfile: router({
    myProfile: protectedProcedure.query(async ({ ctx }) => getClientProfileByUserId(ctx.user.id)),
    saveProfile: protectedProcedure
      .input(z.object({
        swimmerType: z.enum(["adult_self", "child"]).default("adult_self"),
        swimmerName: z.string().optional(), swimmerAge: z.number().optional(),
        swimmerAgeGroup: z.enum(["2-4", "5-7", "8-10", "11-13", "14-17", "18-25", "26-35", "36-45", "46-55", "56+"]).optional(),
        swimLevel: z.enum(["non_swimmer", "beginner", "intermediate", "advanced", "competitive"]).default("beginner"),
        goals: z.string().optional(), preferredPoolId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await upsertClientProfile({ userId: ctx.user.id, ...input });
        return { success: true, id };
      }),
    myLessons: protectedProcedure.query(async ({ ctx }) => {
      const profile = await getClientProfileByUserId(ctx.user.id);
      if (!profile) return [];
      return getLessonsByClient(profile.id);
    }),
    bookLesson: protectedProcedure
      .input(z.object({ coachId: z.number(), poolId: z.number().optional(), scheduledAt: z.date(), durationMinutes: z.number().default(60), rateAtBooking: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const profile = await getClientProfileByUserId(ctx.user.id);
        if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Client profile not found" });
        const rate = parseFloat(input.rateAtBooking);
        const feeAmount = rate * 0.1;
        const id = await createLesson({
          clientId: profile.id, coachId: input.coachId, poolId: input.poolId,
          scheduledAt: input.scheduledAt, durationMinutes: input.durationMinutes,
          rateAtBooking: input.rateAtBooking, platformFeePercent: "10.00",
          platformFeeAmount: feeAmount.toFixed(2), coachPayout: (rate - feeAmount).toFixed(2),
          status: "pending", paymentStatus: "unpaid",
        });
        return { success: true, id };
      }),
    updateLessonStatus: protectedProcedure
      .input(z.object({ lessonId: z.number(), status: z.enum(["confirmed", "cancelled"]) }))
      .mutation(async ({ input }) => { await updateLessonStatus(input.lessonId, input.status); return { success: true }; }),
  }),
});

export type AppRouter = typeof appRouter;
