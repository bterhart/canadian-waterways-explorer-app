import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../prisma";
import {
  verifyRefreshToken,
  generateAccessToken,
  tokenBlacklist,
} from "../lib/jwt-utils";

const authRouter = new Hono();

// Validation schema for refresh token
const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// Validation schema for logout
const logoutSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

/**
 * POST /refresh - Refresh access token
 * Accepts refresh token and returns new access token
 */
authRouter.post(
  "/refresh",
  zValidator("json", refreshSchema),
  async (c) => {
    const { refreshToken } = c.req.valid("json");

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      return c.json(
        {
          error: {
            message: "Invalid or expired refresh token",
            code: "UNAUTHORIZED",
          },
        },
        401
      );
    }

    // Check if user still has access (not suspended/not approved)
    if (payload.type === "admin") {
      const admin = await prisma.adminUser.findUnique({
        where: { id: payload.userId },
      });

      if (!admin) {
        return c.json(
          {
            error: {
              message: "Admin not found",
              code: "UNAUTHORIZED",
            },
          },
          401
        );
      }

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

      // Check if account is locked
      if (admin.lockedUntil && admin.lockedUntil > new Date()) {
        const minutesLeft = Math.ceil(
          (admin.lockedUntil.getTime() - Date.now()) / 1000 / 60
        );
        return c.json(
          {
            error: {
              message: `Account is locked. Please try again in ${minutesLeft} minutes.`,
              code: "ACCOUNT_LOCKED",
            },
          },
          403
        );
      }

      // Generate new access token
      const accessToken = generateAccessToken({
        userId: admin.id,
        email: admin.email,
        role: admin.role as "admin" | "super_admin" | "moderator",
        type: "admin",
        status: admin.status,
        permissions: admin.permissions ? JSON.parse(admin.permissions) : undefined,
      });

      return c.json({
        data: {
          accessToken,
        },
      });
    } else if (payload.type === "teacher") {
      const teacher = await prisma.teacher.findUnique({
        where: { id: payload.userId },
      });

      if (!teacher) {
        return c.json(
          {
            error: {
              message: "Teacher not found",
              code: "UNAUTHORIZED",
            },
          },
          401
        );
      }

      // Check if account is locked
      if (teacher.lockedUntil && teacher.lockedUntil > new Date()) {
        const minutesLeft = Math.ceil(
          (teacher.lockedUntil.getTime() - Date.now()) / 1000 / 60
        );
        return c.json(
          {
            error: {
              message: `Account is locked. Please try again in ${minutesLeft} minutes.`,
              code: "ACCOUNT_LOCKED",
            },
          },
          403
        );
      }

      // Generate new access token
      const accessToken = generateAccessToken({
        userId: teacher.id,
        email: teacher.email,
        role: "teacher",
        type: "teacher",
        status: "approved",
      });

      return c.json({
        data: {
          accessToken,
        },
      });
    }

    return c.json(
      {
        error: {
          message: "Invalid token type",
          code: "UNAUTHORIZED",
        },
      },
      401
    );
  }
);

/**
 * POST /logout - Logout and blacklist refresh token
 */
authRouter.post(
  "/logout",
  zValidator("json", logoutSchema),
  async (c) => {
    const { refreshToken } = c.req.valid("json");

    // Add refresh token to blacklist
    tokenBlacklist.add(refreshToken);

    console.log(`[LOGOUT] Token blacklisted at ${new Date().toISOString()}`);

    return c.json({
      data: {
        success: true,
        message: "Logged out successfully",
      },
    });
  }
);

export { authRouter };
