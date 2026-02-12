import type { Context, Next } from "hono";
import { prisma } from "../prisma";
import type { AdminUser } from "@prisma/client";
import { verifyAccessToken } from "./jwt-utils";

/**
 * Middleware to verify admin authentication via JWT
 * Expects Authorization header with Bearer token
 */
export async function requireAdmin(c: Context, next: Next) {
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

  if (!payload || payload.type !== "admin") {
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

  // Fetch admin from database
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

  // Store admin in context for use in route handlers
  c.set("admin", admin as AdminUser);
  await next();
}

/**
 * Middleware to verify super-admin role
 * Must be used after requireAdmin middleware
 */
export async function requireSuperAdmin(c: Context, next: Next) {
  const admin = c.get("admin") as AdminUser | undefined;

  if (!admin) {
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

  if (admin.role !== "super_admin") {
    return c.json(
      {
        error: {
          message: "Super-admin access required",
          code: "FORBIDDEN",
        },
      },
      403
    );
  }

  await next();
}

/**
 * Middleware to check if admin can create global content
 */
export async function requireGlobalContentPermission(c: Context, next: Next) {
  const admin = c.get("admin") as AdminUser | undefined;

  if (!admin) {
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

  if (!admin.canCreateGlobalContent && admin.role !== "super_admin") {
    return c.json(
      {
        error: {
          message: "Permission to create global content required",
          code: "FORBIDDEN",
        },
      },
      403
    );
  }

  await next();
}

/**
 * Check if content is accessible by admin
 */
export function canAccessContent(
  content: { isCore?: boolean; visibility?: string; createdById?: string | null },
  admin: { id: string; role: string }
): boolean {
  // Super-admins can access everything
  if (admin.role === "super_admin") {
    return true;
  }

  // Core content is read-only for all admins
  if (content.isCore) {
    return true;
  }

  // Global content is accessible to all admins
  if (content.visibility === "global") {
    return true;
  }

  // Private content is only accessible to creator
  if (content.visibility === "private" && content.createdById === admin.id) {
    return true;
  }

  // Pending approval content is accessible to creator and super-admins
  if (
    content.visibility === "pending_approval" &&
    content.createdById === admin.id
  ) {
    return true;
  }

  return false;
}

/**
 * Check if content can be edited by admin
 */
export function canEditContent(
  content: { isCore?: boolean; visibility?: string; createdById?: string | null },
  admin: { id: string; role: string }
): boolean {
  // Super-admins can edit everything
  if (admin.role === "super_admin") {
    return true;
  }

  // Core content cannot be edited by regular admins
  if (content.isCore) {
    return false;
  }

  // Only creator can edit their own content
  if (content.createdById === admin.id) {
    return true;
  }

  return false;
}

/**
 * Check if content can be deleted by admin
 */
export function canDeleteContent(
  content: { isCore?: boolean; createdById?: string | null },
  admin: { id: string; role: string }
): boolean {
  // Super-admins can delete anything except core content
  if (admin.role === "super_admin") {
    return !content.isCore;
  }

  // Core content cannot be deleted
  if (content.isCore) {
    return false;
  }

  // Only creator can delete their own content
  if (content.createdById === admin.id) {
    return true;
  }

  return false;
}
