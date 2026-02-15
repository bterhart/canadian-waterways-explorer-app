import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../prisma";
import type { AdminUser } from "@prisma/client";
import {
  sendEmailNotification,
  logAdminAction,
} from "../lib/auth-utils";
import { requireAdmin } from "../lib/admin-middleware";

type Variables = {
  admin: AdminUser;
};

const teacherApprovalRouter = new Hono<{ Variables: Variables }>();

// Validation schemas
const rejectSchema = z.object({
  rejectionReason: z.string().min(10, "Rejection reason must be at least 10 characters"),
});

const suspendSchema = z.object({
  reason: z.string().min(10, "Suspension reason must be at least 10 characters"),
});

// GET /api/teacher-approval/pending - List pending teachers (admin only)
teacherApprovalRouter.get("/pending", requireAdmin, async (c) => {
  const pendingTeachers = await prisma.teacher.findMany({
    where: {
      status: "pending",
    },
    select: {
      id: true,
      email: true,
      name: true,
      schoolName: true,
      schoolDistrict: true,
      province: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ data: pendingTeachers });
});

// GET /api/teacher-approval/all - List all teachers (admin only)
teacherApprovalRouter.get("/all", requireAdmin, async (c) => {
  const status = c.req.query("status");

  const teachers = await prisma.teacher.findMany({
    where: status ? { status } : undefined,
    select: {
      id: true,
      email: true,
      name: true,
      schoolName: true,
      schoolDistrict: true,
      province: true,
      status: true,
      approvedBy: true,
      approvedAt: true,
      rejectionReason: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { classes: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const result = teachers.map((teacher) => ({
    ...teacher,
    classCount: teacher._count.classes,
    _count: undefined,
  }));

  return c.json({ data: result });
});

// POST /api/teacher-approval/approve/:id - Approve teacher (admin only)
teacherApprovalRouter.post(
  "/approve/:id",
  requireAdmin,
  async (c) => {
    const id = c.req.param("id");
    const admin = c.get("admin");

    // Check if teacher exists and is pending
    const pendingTeacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!pendingTeacher) {
      return c.json(
        {
          error: {
            message: "Teacher not found",
            code: "NOT_FOUND",
          },
        },
        404
      );
    }

    if (pendingTeacher.status !== "pending") {
      return c.json(
        {
          error: {
            message: `Teacher is already ${pendingTeacher.status}`,
            code: "INVALID_STATUS",
          },
        },
        400
      );
    }

    // Approve teacher within a transaction to ensure atomicity
    const approvedTeacher = await prisma.$transaction(async (tx) => {
      return await tx.teacher.update({
        where: { id },
        data: {
          status: "approved",
          approvedBy: admin.id,
          approvedAt: new Date(),
        },
        select: {
          id: true,
          email: true,
          name: true,
          schoolName: true,
          schoolDistrict: true,
          province: true,
          status: true,
          approvedBy: true,
          approvedAt: true,
        },
      });
    });

    // Log action
    logAdminAction({
      adminId: admin.id,
      adminEmail: admin.email,
      action: "approve_teacher",
      targetType: "teacher",
      targetId: id,
      timestamp: new Date(),
    });

    // Send approval notification
    sendEmailNotification({
      to: approvedTeacher.email,
      subject: "Teacher Account Approved",
      body: `
Hello ${approvedTeacher.name},

Your teacher account has been approved! You can now log in to the platform.

Email: ${approvedTeacher.email}
School: ${approvedTeacher.schoolName || "Not specified"}

Welcome to the platform!
      `.trim(),
      type: "teacher_approved",
    });

    return c.json({
      data: {
        message: "Teacher approved successfully",
        teacher: approvedTeacher,
      },
    });
  }
);

// POST /api/teacher-approval/reject/:id - Reject teacher (admin only)
teacherApprovalRouter.post(
  "/reject/:id",
  requireAdmin,
  zValidator("json", rejectSchema),
  async (c) => {
    const id = c.req.param("id");
    const { rejectionReason } = c.req.valid("json");
    const admin = c.get("admin");

    // Check if teacher exists and is pending
    const pendingTeacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!pendingTeacher) {
      return c.json(
        {
          error: {
            message: "Teacher not found",
            code: "NOT_FOUND",
          },
        },
        404
      );
    }

    if (pendingTeacher.status !== "pending") {
      return c.json(
        {
          error: {
            message: `Teacher is already ${pendingTeacher.status}`,
            code: "INVALID_STATUS",
          },
        },
        400
      );
    }

    // Reject teacher within a transaction to ensure atomicity
    const rejectedTeacher = await prisma.$transaction(async (tx) => {
      return await tx.teacher.update({
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
    });

    // Log action
    logAdminAction({
      adminId: admin.id,
      adminEmail: admin.email,
      action: "reject_teacher",
      targetType: "teacher",
      targetId: id,
      details: { rejectionReason },
      timestamp: new Date(),
    });

    // Send rejection notification
    sendEmailNotification({
      to: rejectedTeacher.email,
      subject: "Teacher Account Registration - Update",
      body: `
Hello ${rejectedTeacher.name},

Thank you for your interest in becoming a teacher on our platform. Unfortunately, your registration request has not been approved at this time.

Reason: ${rejectionReason}

If you believe this is an error or have questions, please contact the administrator.
      `.trim(),
      type: "teacher_rejected",
    });

    return c.json({
      data: {
        message: "Teacher rejected",
        teacher: rejectedTeacher,
      },
    });
  }
);

// POST /api/teacher-approval/suspend/:id - Suspend teacher (admin only)
teacherApprovalRouter.post(
  "/suspend/:id",
  requireAdmin,
  zValidator("json", suspendSchema),
  async (c) => {
    const id = c.req.param("id");
    const { reason } = c.req.valid("json");
    const admin = c.get("admin");

    // Check if teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      return c.json(
        {
          error: {
            message: "Teacher not found",
            code: "NOT_FOUND",
          },
        },
        404
      );
    }

    if (teacher.status === "suspended") {
      return c.json(
        {
          error: {
            message: "Teacher is already suspended",
            code: "ALREADY_SUSPENDED",
          },
        },
        400
      );
    }

    // Suspend teacher within a transaction to ensure atomicity
    const suspendedTeacher = await prisma.$transaction(async (tx) => {
      return await tx.teacher.update({
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
    });

    // Log action
    logAdminAction({
      adminId: admin.id,
      adminEmail: admin.email,
      action: "suspend_teacher",
      targetType: "teacher",
      targetId: id,
      details: { reason },
      timestamp: new Date(),
    });

    return c.json({
      data: {
        message: "Teacher suspended successfully",
        teacher: suspendedTeacher,
      },
    });
  }
);

// POST /api/teacher-approval/reactivate/:id - Reactivate suspended teacher (admin only)
teacherApprovalRouter.post(
  "/reactivate/:id",
  requireAdmin,
  async (c) => {
    const id = c.req.param("id");
    const admin = c.get("admin");

    // Check if teacher exists and is suspended
    const teacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      return c.json(
        {
          error: {
            message: "Teacher not found",
            code: "NOT_FOUND",
          },
        },
        404
      );
    }

    if (teacher.status !== "suspended") {
      return c.json(
        {
          error: {
            message: `Teacher is ${teacher.status}, not suspended`,
            code: "INVALID_STATUS",
          },
        },
        400
      );
    }

    // Reactivate teacher within a transaction to ensure atomicity
    const reactivatedTeacher = await prisma.$transaction(async (tx) => {
      return await tx.teacher.update({
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
    });

    // Log action
    logAdminAction({
      adminId: admin.id,
      adminEmail: admin.email,
      action: "reactivate_teacher",
      targetType: "teacher",
      targetId: id,
      timestamp: new Date(),
    });

    // Send notification
    sendEmailNotification({
      to: reactivatedTeacher.email,
      subject: "Teacher Account Reactivated",
      body: `
Hello ${reactivatedTeacher.name},

Your teacher account has been reactivated. You can now log in to the platform again.

If you have any questions, please contact the administrator.
      `.trim(),
      type: "teacher_approved",
    });

    return c.json({
      data: {
        message: "Teacher reactivated successfully",
        teacher: reactivatedTeacher,
      },
    });
  }
);

export { teacherApprovalRouter };
