import type { Context, Next } from "hono";
import { prisma } from "../prisma";
import type { Teacher } from "@prisma/client";
import { verifyAccessToken } from "./jwt-utils";

/**
 * Middleware to verify teacher authentication via JWT
 * Expects Authorization header with Bearer token
 */
export async function requireTeacher(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json(
      {
        error: {
          message: "Authentication required",
          code: "UNAUTHORIZED",
        },
      },
      401
    );
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  // Verify access token
  const payload = verifyAccessToken(token);

  if (!payload || payload.type !== "teacher") {
    return c.json(
      {
        error: {
          message: "Invalid or expired token",
          code: "UNAUTHORIZED",
        },
      },
      401
    );
  }

  // Fetch teacher from database
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
    return c.json(
      {
        error: {
          message: "Account is locked",
          code: "FORBIDDEN",
        },
      },
      403
    );
  }

  // Store teacher in context for use in route handlers
  c.set("teacher", teacher as Teacher);
  await next();
}

/**
 * Middleware to verify either admin or teacher authentication
 * Useful for endpoints accessible to both roles
 */
export async function requireAuth(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json(
      {
        error: {
          message: "Authentication required",
          code: "UNAUTHORIZED",
        },
      },
      401
    );
  }

  const token = authHeader.substring(7);

  // Verify access token
  const payload = verifyAccessToken(token);

  if (!payload) {
    return c.json(
      {
        error: {
          message: "Invalid or expired token",
          code: "UNAUTHORIZED",
        },
      },
      401
    );
  }

  if (payload.type === "admin") {
    const admin = await prisma.adminUser.findUnique({
      where: { id: payload.userId },
    });

    if (!admin || admin.status !== "approved") {
      return c.json(
        {
          error: {
            message: "Authentication failed",
            code: "UNAUTHORIZED",
          },
        },
        401
      );
    }

    c.set("user", { ...admin, userType: "admin" });
  } else if (payload.type === "teacher") {
    const teacher = await prisma.teacher.findUnique({
      where: { id: payload.userId },
    });

    if (!teacher) {
      return c.json(
        {
          error: {
            message: "Authentication failed",
            code: "UNAUTHORIZED",
          },
        },
        401
      );
    }

    c.set("user", { ...teacher, userType: "teacher" });
  } else {
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

  await next();
}
