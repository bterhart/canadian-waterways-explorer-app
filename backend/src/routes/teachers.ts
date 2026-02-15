import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../prisma";
import { generateAccessToken, generateRefreshToken } from "../lib/jwt-utils";
import { loginRateLimiter } from "../lib/auth-utils";
import { requireTeacher } from "../lib/teacher-middleware";
import type { Teacher } from "@prisma/client";

const teachersRouter = new Hono();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email("Valid email is required"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  schoolName: z.string().optional(),
  schoolDistrict: z.string().optional(),
  province: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  schoolName: z.string().optional().nullable(),
  schoolDistrict: z.string().optional().nullable(),
  province: z.string().optional().nullable(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

// POST /register - Register a new teacher
teachersRouter.post(
  "/register",
  zValidator("json", registerSchema),
  async (c) => {
    const data = c.req.valid("json");

    // Check if email already exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { email: data.email },
    });

    if (existingTeacher) {
      return c.json(
        { error: { message: "Email already registered", code: "EMAIL_EXISTS" } },
        400
      );
    }

    // Hash password using Bun's built-in password hashing
    const passwordHash = await Bun.password.hash(data.password);

    const teacher = await prisma.teacher.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
        schoolName: data.schoolName,
        schoolDistrict: data.schoolDistrict,
        province: data.province,
      },
      select: {
        id: true,
        email: true,
        name: true,
        schoolName: true,
        schoolDistrict: true,
        province: true,
        createdAt: true,
      },
    });

    return c.json({ data: teacher }, 201);
  }
);

// POST /login - Teacher login with JWT tokens
teachersRouter.post(
  "/login",
  zValidator("json", loginSchema),
  async (c) => {
    const { email, password } = c.req.valid("json");

    // Rate limiting check (5 attempts per 15 minutes)
    const rateLimitKey = `teacher-login:${email}`;
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

    const teacher = await prisma.teacher.findUnique({
      where: { email },
    });

    if (!teacher) {
      return c.json(
        { error: { message: "Invalid email or password", code: "UNAUTHORIZED" } },
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
            message: `Account is locked due to too many failed login attempts. Please try again in ${minutesLeft} minutes.`,
            code: "ACCOUNT_LOCKED",
          },
        },
        403
      );
    }

    // Check approval status before allowing login
    if (teacher.status === "pending") {
      return c.json(
        {
          error: {
            message: "Your account is pending approval. Please wait for an administrator to approve your registration.",
            code: "PENDING_APPROVAL",
          },
        },
        403
      );
    }

    if (teacher.status === "rejected") {
      return c.json(
        {
          error: {
            message: teacher.rejectionReason
              ? `Your account registration was rejected: ${teacher.rejectionReason}`
              : "Your account registration was rejected. Please contact an administrator for more information.",
            code: "ACCOUNT_REJECTED",
          },
        },
        403
      );
    }

    if (teacher.status === "suspended") {
      return c.json(
        {
          error: {
            message: teacher.rejectionReason
              ? `Your account has been suspended: ${teacher.rejectionReason}`
              : "Your account has been suspended. Please contact an administrator for more information.",
            code: "ACCOUNT_SUSPENDED",
          },
        },
        403
      );
    }

    // Verify password using Bun's password verification (matches Bun.password.hash used during registration)
    const isValid = await Bun.password.verify(password, teacher.passwordHash);

    if (!isValid) {
      // Increment failed login attempts
      const failedAttempts = teacher.failedLoginAttempts + 1;
      const shouldLock = failedAttempts >= 5;

      await prisma.teacher.update({
        where: { id: teacher.id },
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

    // Reset failed login attempts
    await prisma.teacher.update({
      where: { id: teacher.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    // Generate JWT tokens
    const accessToken = generateAccessToken({
      userId: teacher.id,
      email: teacher.email,
      role: "teacher",
      type: "teacher",
      status: teacher.status,
    });

    const refreshToken = generateRefreshToken({
      userId: teacher.id,
      email: teacher.email,
      role: "teacher",
      type: "teacher",
      status: teacher.status,
    });

    // Log successful login
    console.log(`[TEACHER LOGIN] ${teacher.email} logged in at ${new Date().toISOString()}`);

    return c.json({
      data: {
        success: true,
        teacher: {
          id: teacher.id,
          email: teacher.email,
          name: teacher.name,
          schoolName: teacher.schoolName,
          schoolDistrict: teacher.schoolDistrict,
          province: teacher.province,
        },
        accessToken,
        refreshToken,
      },
    });
  }
);

// Require teacher authentication for all routes below this point
teachersRouter.use("*", requireTeacher);

// GET /:id - Get teacher profile
teachersRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const teacher = await prisma.teacher.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      schoolName: true,
      schoolDistrict: true,
      province: true,
      createdAt: true,
      _count: {
        select: { classes: true },
      },
    },
  });

  if (!teacher) {
    return c.json(
      { error: { message: "Teacher not found", code: "NOT_FOUND" } },
      404
    );
  }

  const result = {
    id: teacher.id,
    email: teacher.email,
    name: teacher.name,
    schoolName: teacher.schoolName,
    schoolDistrict: teacher.schoolDistrict,
    province: teacher.province,
    createdAt: teacher.createdAt,
    classCount: teacher._count.classes,
  };

  return c.json({ data: result });
});

// PATCH /:id - Update teacher profile
teachersRouter.patch(
  "/:id",
  zValidator("json", updateProfileSchema),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");

    // Get authenticated teacher from middleware
    const authenticatedTeacher = (c as any).get("teacher") as Teacher;

    // Verify the authenticated teacher owns this profile
    if (authenticatedTeacher?.id !== id) {
      return c.json(
        { error: { message: "You can only update your own profile", code: "FORBIDDEN" } },
        403
      );
    }

    const existingTeacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!existingTeacher) {
      return c.json(
        { error: { message: "Teacher not found", code: "NOT_FOUND" } },
        404
      );
    }

    const teacher = await prisma.teacher.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.schoolName !== undefined && { schoolName: data.schoolName }),
        ...(data.schoolDistrict !== undefined && { schoolDistrict: data.schoolDistrict }),
        ...(data.province !== undefined && { province: data.province }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        schoolName: true,
        schoolDistrict: true,
        province: true,
        createdAt: true,
      },
    });

    return c.json({ data: teacher });
  }
);

// POST /:id/change-password - Change teacher password
teachersRouter.post(
  "/:id/change-password",
  zValidator("json", changePasswordSchema),
  async (c) => {
    const id = c.req.param("id");
    const { currentPassword, newPassword } = c.req.valid("json");

    // Get authenticated teacher from middleware
    const authenticatedTeacher = (c as any).get("teacher") as Teacher;

    // Verify the authenticated teacher owns this account
    if (authenticatedTeacher?.id !== id) {
      return c.json(
        { error: { message: "You can only change your own password", code: "FORBIDDEN" } },
        403
      );
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      return c.json(
        { error: { message: "Teacher not found", code: "NOT_FOUND" } },
        404
      );
    }

    const isValid = await Bun.password.verify(currentPassword, teacher.passwordHash);

    if (!isValid) {
      return c.json(
        { error: { message: "Current password is incorrect", code: "INVALID_PASSWORD" } },
        400
      );
    }

    // Hash new password and update within a transaction to ensure atomicity
    const newPasswordHash = await Bun.password.hash(newPassword);

    await prisma.$transaction(async (tx) => {
      await tx.teacher.update({
        where: { id },
        data: { passwordHash: newPasswordHash },
      });
    });

    return c.json({ data: { success: true, message: "Password changed successfully" } });
  }
);

// GET /:id/classes - Get all classes for a teacher
teachersRouter.get("/:id/classes", async (c) => {
  const id = c.req.param("id");

  const teacher = await prisma.teacher.findUnique({
    where: { id },
  });

  if (!teacher) {
    return c.json(
      { error: { message: "Teacher not found", code: "NOT_FOUND" } },
      404
    );
  }

  const classes = await prisma.class.findMany({
    where: { teacherId: id },
    select: {
      id: true,
      name: true,
      gradeLevel: true,
      schoolYear: true,
      joinCode: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: { students: true, assignments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const result = classes.map((cls) => ({
    id: cls.id,
    name: cls.name,
    gradeLevel: cls.gradeLevel,
    schoolYear: cls.schoolYear,
    joinCode: cls.joinCode,
    isActive: cls.isActive,
    createdAt: cls.createdAt,
    studentCount: cls._count.students,
    assignmentCount: cls._count.assignments,
  }));

  return c.json({ data: result });
});

export { teachersRouter };
