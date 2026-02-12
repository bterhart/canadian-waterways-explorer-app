import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../prisma";
import type { AdminUser } from "@prisma/client";
import {
  passwordSchema,
  hashPassword,
  registrationRateLimiter,
  sendEmailNotification,
  logAdminAction,
} from "../lib/auth-utils";
import {
  requireAdmin,
  requireSuperAdmin,
} from "../lib/admin-middleware";

type Variables = {
  admin: AdminUser;
};

const adminApprovalRouter = new Hono<{ Variables: Variables }>();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email("Valid email is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  organization: z.string().optional(),
  password: passwordSchema,
});

const approveSchema = z.object({
  canCreateGlobalContent: z.boolean().default(false),
  permissions: z.record(z.string(), z.boolean()).optional(),
});

const rejectSchema = z.object({
  rejectionReason: z.string().min(10, "Rejection reason must be at least 10 characters"),
});

const grantSuperAdminSchema = z.object({
  confirm: z.literal(true),
});

const suspendSchema = z.object({
  reason: z.string().min(10, "Suspension reason must be at least 10 characters"),
});

// POST /api/admin-approval/register - Public endpoint for admin registration
adminApprovalRouter.post(
  "/register",
  zValidator("json", registerSchema),
  async (c) => {
    const { email, name, organization, password } = c.req.valid("json");

    // Rate limiting check (max 3 attempts per IP per hour)
    const clientIp = c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown";
    const rateLimitKey = `register:${clientIp}`;

    if (!registrationRateLimiter.check(rateLimitKey, 3, 60 * 60 * 1000)) {
      return c.json(
        {
          error: {
            message: "Too many registration attempts. Please try again later.",
            code: "RATE_LIMIT_EXCEEDED",
          },
        },
        429
      );
    }

    // Check if email already exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return c.json(
        {
          error: {
            message: "An admin with this email already exists",
            code: "EMAIL_EXISTS",
          },
        },
        409
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create pending admin user
    const admin = await prisma.adminUser.create({
      data: {
        email,
        name,
        organization,
        passwordHash,
        role: "moderator",
        status: "pending",
      },
      select: {
        id: true,
        email: true,
        name: true,
        organization: true,
        status: true,
        createdAt: true,
      },
    });

    // Get all super-admins to notify
    const superAdmins = await prisma.adminUser.findMany({
      where: {
        role: "super_admin",
        status: "approved",
      },
      select: {
        email: true,
        name: true,
      },
    });

    // Send notification to super-admins
    for (const superAdmin of superAdmins) {
      sendEmailNotification({
        to: superAdmin.email,
        subject: "New Admin Registration Request",
        body: `
Hello ${superAdmin.name},

A new admin registration request has been submitted:

Name: ${name}
Email: ${email}
Organization: ${organization || "Not specified"}
Registered: ${new Date().toLocaleString()}

Please review and approve/reject this request in the admin panel.
        `.trim(),
        type: "admin_registration",
      });
    }

    return c.json({
      data: {
        message: "Registration successful. Your request is pending super-admin approval.",
        admin,
      },
    });
  }
);

// GET /api/admin-approval/pending - List pending admin requests (super-admin only)
adminApprovalRouter.get("/pending", requireAdmin, requireSuperAdmin, async (c) => {
  const pendingAdmins = await prisma.adminUser.findMany({
    where: {
      status: "pending",
    },
    select: {
      id: true,
      email: true,
      name: true,
      organization: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ data: pendingAdmins });
});

// GET /api/admin-approval/all - List all admins (super-admin only)
adminApprovalRouter.get("/all", requireAdmin, requireSuperAdmin, async (c) => {
  const status = c.req.query("status");

  const admins = await prisma.adminUser.findMany({
    where: status ? { status } : undefined,
    select: {
      id: true,
      email: true,
      name: true,
      organization: true,
      role: true,
      status: true,
      approvedBy: true,
      approvedAt: true,
      rejectionReason: true,
      canCreateGlobalContent: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ data: admins });
});

// POST /api/admin-approval/approve/:id - Approve admin (super-admin only)
adminApprovalRouter.post(
  "/approve/:id",
  requireAdmin,
  requireSuperAdmin,
  zValidator("json", approveSchema),
  async (c) => {
    const id = c.req.param("id");
    const { canCreateGlobalContent, permissions } = c.req.valid("json");
    const superAdmin = c.get("admin");

    // Check if admin exists and is pending
    const pendingAdmin = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!pendingAdmin) {
      return c.json(
        {
          error: {
            message: "Admin not found",
            code: "NOT_FOUND",
          },
        },
        404
      );
    }

    if (pendingAdmin.status !== "pending") {
      return c.json(
        {
          error: {
            message: `Admin is already ${pendingAdmin.status}`,
            code: "INVALID_STATUS",
          },
        },
        400
      );
    }

    // Approve admin
    const approvedAdmin = await prisma.adminUser.update({
      where: { id },
      data: {
        status: "approved",
        approvedBy: superAdmin.id,
        approvedAt: new Date(),
        canCreateGlobalContent,
        permissions: permissions ? JSON.stringify(permissions) : null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        organization: true,
        role: true,
        status: true,
        approvedBy: true,
        approvedAt: true,
        canCreateGlobalContent: true,
      },
    });

    // Log action
    logAdminAction({
      adminId: superAdmin.id,
      adminEmail: superAdmin.email,
      action: "approve_admin",
      targetType: "admin",
      targetId: id,
      details: { canCreateGlobalContent, permissions },
      timestamp: new Date(),
    });

    // Send approval notification
    sendEmailNotification({
      to: approvedAdmin.email,
      subject: "Admin Account Approved",
      body: `
Hello ${approvedAdmin.name},

Your admin account has been approved! You can now log in to the admin panel.

Email: ${approvedAdmin.email}
Role: ${approvedAdmin.role}
Global Content Creation: ${canCreateGlobalContent ? "Enabled" : "Disabled"}

Welcome to the team!
      `.trim(),
      type: "admin_approved",
    });

    return c.json({
      data: {
        message: "Admin approved successfully",
        admin: approvedAdmin,
      },
    });
  }
);

// POST /api/admin-approval/reject/:id - Reject admin (super-admin only)
adminApprovalRouter.post(
  "/reject/:id",
  requireAdmin,
  requireSuperAdmin,
  zValidator("json", rejectSchema),
  async (c) => {
    const id = c.req.param("id");
    const { rejectionReason } = c.req.valid("json");
    const superAdmin = c.get("admin");

    // Check if admin exists and is pending
    const pendingAdmin = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!pendingAdmin) {
      return c.json(
        {
          error: {
            message: "Admin not found",
            code: "NOT_FOUND",
          },
        },
        404
      );
    }

    if (pendingAdmin.status !== "pending") {
      return c.json(
        {
          error: {
            message: `Admin is already ${pendingAdmin.status}`,
            code: "INVALID_STATUS",
          },
        },
        400
      );
    }

    // Reject admin
    const rejectedAdmin = await prisma.adminUser.update({
      where: { id },
      data: {
        status: "rejected",
        rejectionReason,
      },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        rejectionReason: true,
      },
    });

    // Log action
    logAdminAction({
      adminId: superAdmin.id,
      adminEmail: superAdmin.email,
      action: "reject_admin",
      targetType: "admin",
      targetId: id,
      details: { rejectionReason },
      timestamp: new Date(),
    });

    // Send rejection notification
    sendEmailNotification({
      to: rejectedAdmin.email,
      subject: "Admin Account Registration - Update",
      body: `
Hello ${rejectedAdmin.name},

Thank you for your interest in becoming an admin. Unfortunately, your registration request has not been approved at this time.

Reason: ${rejectionReason}

If you believe this is an error or have questions, please contact the administrator.
      `.trim(),
      type: "admin_rejected",
    });

    return c.json({
      data: {
        message: "Admin rejected",
        admin: rejectedAdmin,
      },
    });
  }
);

// POST /api/admin-approval/grant-super-admin/:id - Grant super-admin role (super-admin only)
adminApprovalRouter.post(
  "/grant-super-admin/:id",
  requireAdmin,
  requireSuperAdmin,
  zValidator("json", grantSuperAdminSchema),
  async (c) => {
    const id = c.req.param("id");
    const superAdmin = c.get("admin");

    // Check if admin exists and is approved
    const admin = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!admin) {
      return c.json(
        {
          error: {
            message: "Admin not found",
            code: "NOT_FOUND",
          },
        },
        404
      );
    }

    if (admin.status !== "approved") {
      return c.json(
        {
          error: {
            message: "Admin must be approved before granting super-admin role",
            code: "INVALID_STATUS",
          },
        },
        400
      );
    }

    if (admin.role === "super_admin") {
      return c.json(
        {
          error: {
            message: "Admin is already a super-admin",
            code: "ALREADY_SUPER_ADMIN",
          },
        },
        400
      );
    }

    // Grant super-admin role
    const updatedAdmin = await prisma.adminUser.update({
      where: { id },
      data: {
        role: "super_admin",
        canCreateGlobalContent: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        canCreateGlobalContent: true,
      },
    });

    // Log action
    logAdminAction({
      adminId: superAdmin.id,
      adminEmail: superAdmin.email,
      action: "grant_super_admin",
      targetType: "admin",
      targetId: id,
      timestamp: new Date(),
    });

    // Send notification
    sendEmailNotification({
      to: updatedAdmin.email,
      subject: "Super-Admin Role Granted",
      body: `
Hello ${updatedAdmin.name},

You have been granted super-admin privileges! You now have full access to all admin features including:

- Approving/rejecting new admin requests
- Granting super-admin role to other admins
- Approving global content
- Managing all system content

Please use these privileges responsibly.
      `.trim(),
      type: "admin_approved",
    });

    return c.json({
      data: {
        message: "Super-admin role granted successfully",
        admin: updatedAdmin,
      },
    });
  }
);

// POST /api/admin-approval/suspend/:id - Suspend admin (super-admin only)
adminApprovalRouter.post(
  "/suspend/:id",
  requireAdmin,
  requireSuperAdmin,
  zValidator("json", suspendSchema),
  async (c) => {
    const id = c.req.param("id");
    const { reason } = c.req.valid("json");
    const superAdmin = c.get("admin");

    // Check if admin exists
    const admin = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!admin) {
      return c.json(
        {
          error: {
            message: "Admin not found",
            code: "NOT_FOUND",
          },
        },
        404
      );
    }

    // Cannot suspend another super-admin
    if (admin.role === "super_admin") {
      return c.json(
        {
          error: {
            message: "Cannot suspend a super-admin",
            code: "FORBIDDEN",
          },
        },
        403
      );
    }

    // Cannot suspend self
    if (admin.id === superAdmin.id) {
      return c.json(
        {
          error: {
            message: "Cannot suspend your own account",
            code: "FORBIDDEN",
          },
        },
        403
      );
    }

    if (admin.status === "suspended") {
      return c.json(
        {
          error: {
            message: "Admin is already suspended",
            code: "ALREADY_SUSPENDED",
          },
        },
        400
      );
    }

    // Suspend admin
    const suspendedAdmin = await prisma.adminUser.update({
      where: { id },
      data: {
        status: "suspended",
        rejectionReason: reason, // Reuse this field for suspension reason
      },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        rejectionReason: true,
      },
    });

    // Log action
    logAdminAction({
      adminId: superAdmin.id,
      adminEmail: superAdmin.email,
      action: "suspend_admin",
      targetType: "admin",
      targetId: id,
      details: { reason },
      timestamp: new Date(),
    });

    return c.json({
      data: {
        message: "Admin suspended successfully",
        admin: suspendedAdmin,
      },
    });
  }
);

// POST /api/admin-approval/reactivate/:id - Reactivate suspended admin (super-admin only)
adminApprovalRouter.post(
  "/reactivate/:id",
  requireAdmin,
  requireSuperAdmin,
  async (c) => {
    const id = c.req.param("id");
    const superAdmin = c.get("admin");

    // Check if admin exists and is suspended
    const admin = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!admin) {
      return c.json(
        {
          error: {
            message: "Admin not found",
            code: "NOT_FOUND",
          },
        },
        404
      );
    }

    if (admin.status !== "suspended") {
      return c.json(
        {
          error: {
            message: `Admin is ${admin.status}, not suspended`,
            code: "INVALID_STATUS",
          },
        },
        400
      );
    }

    // Reactivate admin
    const reactivatedAdmin = await prisma.adminUser.update({
      where: { id },
      data: {
        status: "approved",
        rejectionReason: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
      },
    });

    // Log action
    logAdminAction({
      adminId: superAdmin.id,
      adminEmail: superAdmin.email,
      action: "reactivate_admin",
      targetType: "admin",
      targetId: id,
      timestamp: new Date(),
    });

    // Send notification
    sendEmailNotification({
      to: reactivatedAdmin.email,
      subject: "Admin Account Reactivated",
      body: `
Hello ${reactivatedAdmin.name},

Your admin account has been reactivated. You can now log in to the admin panel again.

If you have any questions, please contact the administrator.
      `.trim(),
      type: "admin_approved",
    });

    return c.json({
      data: {
        message: "Admin reactivated successfully",
        admin: reactivatedAdmin,
      },
    });
  }
);

export { adminApprovalRouter };
