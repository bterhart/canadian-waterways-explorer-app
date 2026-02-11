import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../prisma";

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

// POST /login - Simple admin login
adminRouter.post(
  "/login",
  zValidator("json", loginSchema),
  async (c) => {
    const { email, password } = c.req.valid("json");

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      return c.json(
        { error: { message: "Invalid email or password", code: "UNAUTHORIZED" } },
        401
      );
    }

    // Simple password comparison using Bun's built-in password verification
    const isValid = await Bun.password.verify(password, admin.passwordHash);

    if (!isValid) {
      return c.json(
        { error: { message: "Invalid email or password", code: "UNAUTHORIZED" } },
        401
      );
    }

    // Update last login time
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    return c.json({
      data: {
        success: true,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
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

    const contribution = await prisma.userContribution.update({
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

    return c.json({ data: contribution });
  }
);

export { adminRouter };
