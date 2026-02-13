import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../prisma";
import { generateAccessToken, generateRefreshToken } from "../lib/jwt-utils";
import { loginRateLimiter } from "../lib/auth-utils";
import bcrypt from "bcryptjs";

const adminRouter = new Hono();

// Validation schema for admin login
const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

// Validation schema for updating contribution status
const updateContributionSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  adminNotes: z.string().optional(),
  reviewedBy: z.string().min(1, "Reviewer name is required"),
});

// POST /login - Admin login with JWT tokens
adminRouter.post(
  "/login",
  zValidator("json", loginSchema),
  async (c) => {
    const { email, password } = c.req.valid("json");

    // Rate limiting check (5 attempts per 15 minutes)
    const rateLimitKey = `admin-login:${email}`;
    const rateLimit = loginRateLimiter.check(rateLimitKey, 5, 15 * 60 * 1000);

    if (!rateLimit.success) {
      return c.json(
        {
          error: {
            message: `Too many login attempts. Please try again in ${Math.ceil(rateLimit.remaining / 1000 / 60)} minutes.`,
            code: "RATE_LIMIT_EXCEEDED",
          },
        },
        429
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      return c.json(
        { error: { message: "Invalid email or password", code: "UNAUTHORIZED" } },
        401
      );
    }

    // Check if account is locked
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil(
        (admin.lockedUntil.getTime() - Date.now()) / 1000 / 60
      );
      return c.json(
        {
          error: {
            message: `Account is locked due to too many failed login attempts. Please try again in ${minutesLeft} minutes.`,
            code: "ACCOUNT_LOCKED",
          },
        },
        403
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isValid) {
      // Increment failed login attempts
      const failedAttempts = admin.failedLoginAttempts + 1;
      const shouldLock = failedAttempts >= 5;

      await prisma.adminUser.update({
        where: { id: admin.id },
        data: {
          failedLoginAttempts: failedAttempts,
          lockedUntil: shouldLock
            ? new Date(Date.now() + 15 * 60 * 1000) // Lock for 15 minutes
            : null,
        },
      });

      return c.json(
        {
          error: {
            message: shouldLock
              ? "Too many failed login attempts. Account locked for 15 minutes."
              : "Invalid email or password",
            code: "UNAUTHORIZED",
          },
        },
        401
      );
    }

    // Check if admin is approved
    if (admin.status !== "approved") {
      return c.json(
        {
          error: {
            message: "Admin account is not approved",
            code: "FORBIDDEN",
          },
        },
        403
      );
    }

    // Reset failed login attempts and update last login
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        lastLoginAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    // Generate JWT tokens
    const accessToken = generateAccessToken({
      userId: admin.id,
      email: admin.email,
      role: admin.role as "admin" | "super_admin" | "moderator",
      type: "admin",
      status: admin.status,
      permissions: admin.permissions ? JSON.parse(admin.permissions) : undefined,
    });

    const refreshToken = generateRefreshToken({
      userId: admin.id,
      email: admin.email,
      role: admin.role as "admin" | "super_admin" | "moderator",
      type: "admin",
      status: admin.status,
      permissions: admin.permissions ? JSON.parse(admin.permissions) : undefined,
    });

    // Log successful login
    console.log(`[ADMIN LOGIN] ${admin.email} logged in at ${new Date().toISOString()}`);

    return c.json({
      data: {
        success: true,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
        accessToken,
        refreshToken,
      },
    });
  }
);

// GET /contributions - Get all pending contributions (for admin review)
adminRouter.get("/contributions", async (c) => {
  const status = c.req.query("status") || "pending";

  const contributions = await prisma.userContribution.findMany({
    where: {
      status: status,
    },
    select: {
      id: true,
      title: true,
      content: true,
      contributionType: true,
      contributorName: true,
      contributorEmail: true,
      imageUrl: true,
      waterwayId: true,
      locationId: true,
      status: true,
      adminNotes: true,
      reviewedAt: true,
      reviewedBy: true,
      createdAt: true,
      updatedAt: true,
      waterway: {
        select: {
          id: true,
          name: true,
        },
      },
      location: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ data: contributions });
});

// PATCH /contributions/:id - Update contribution status (approve/reject)
adminRouter.patch(
  "/contributions/:id",
  zValidator("json", updateContributionSchema),
  async (c) => {
    const id = c.req.param("id");
    const { status, adminNotes, reviewedBy } = c.req.valid("json");

    // Check if contribution exists
    const existingContribution = await prisma.userContribution.findUnique({
      where: { id },
    });

    if (!existingContribution) {
      return c.json(
        { error: { message: "Contribution not found", code: "NOT_FOUND" } },
        404
      );
    }

    // Update contribution status within a transaction to ensure atomicity
    const contribution = await prisma.$transaction(async (tx) => {
      return await tx.userContribution.update({
        where: { id },
        data: {
          status,
          adminNotes,
          reviewedBy,
          reviewedAt: new Date(),
        },
        select: {
          id: true,
          title: true,
          content: true,
          contributionType: true,
          contributorName: true,
          contributorEmail: true,
          imageUrl: true,
          waterwayId: true,
          locationId: true,
          status: true,
          adminNotes: true,
          reviewedAt: true,
          reviewedBy: true,
          createdAt: true,
          updatedAt: true,
          waterway: {
            select: {
              id: true,
              name: true,
            },
          },
          location: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });

    return c.json({ data: contribution });
  }
);

export { adminRouter };
