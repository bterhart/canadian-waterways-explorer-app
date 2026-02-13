import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAdmin } from "../lib/admin-middleware";

const adminPrintablesRouter = new Hono();

// Require admin authentication for all routes
adminPrintablesRouter.use("*", requireAdmin);

// Validation schemas
const createPrintableSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  resourceType: z.string().min(1, "Resource type is required"),
  gradeLevel: z.string().min(1, "Grade level is required"),
  topic: z.string().min(1, "Topic is required"),
  fileUrl: z.string().url().optional(),
  previewImageUrl: z.string().url().optional(),
  content: z.string().optional(),
  teacherNotes: z.string().optional(),
  answerKey: z.string().optional(),
  isPublished: z.boolean().default(false),
});

const updatePrintableSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  resourceType: z.string().min(1).optional(),
  gradeLevel: z.string().min(1).optional(),
  topic: z.string().min(1).optional(),
  fileUrl: z.string().url().optional().nullable(),
  previewImageUrl: z.string().url().optional().nullable(),
  content: z.string().optional().nullable(),
  teacherNotes: z.string().optional().nullable(),
  answerKey: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
});

// GET / - List all printable resources (including unpublished)
adminPrintablesRouter.get("/", async (c) => {
  const printables = await prisma.printableResource.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      resourceType: true,
      gradeLevel: true,
      topic: true,
      previewImageUrl: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ data: printables });
});

// GET /:id - Get a single printable resource for editing
adminPrintablesRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const printable = await prisma.printableResource.findUnique({
    where: { id },
  });

  if (!printable) {
    return c.json(
      { error: { message: "Printable resource not found", code: "NOT_FOUND" } },
      404
    );
  }

  return c.json({ data: printable });
});

// POST / - Create a new printable resource
adminPrintablesRouter.post(
  "/",
  zValidator("json", createPrintableSchema),
  async (c) => {
    const data = c.req.valid("json");

    const printable = await prisma.printableResource.create({
      data: {
        title: data.title,
        description: data.description,
        resourceType: data.resourceType,
        gradeLevel: data.gradeLevel,
        topic: data.topic,
        fileUrl: data.fileUrl,
        previewImageUrl: data.previewImageUrl,
        content: data.content,
        teacherNotes: data.teacherNotes,
        answerKey: data.answerKey,
        isPublished: data.isPublished,
      },
    });

    return c.json({ data: printable }, 201);
  }
);

// PATCH /:id - Update a printable resource
adminPrintablesRouter.patch(
  "/:id",
  zValidator("json", updatePrintableSchema),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");

    const existingPrintable = await prisma.printableResource.findUnique({
      where: { id },
    });

    if (!existingPrintable) {
      return c.json(
        { error: { message: "Printable resource not found", code: "NOT_FOUND" } },
        404
      );
    }

    const printable = await prisma.printableResource.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.resourceType !== undefined && { resourceType: data.resourceType }),
        ...(data.gradeLevel !== undefined && { gradeLevel: data.gradeLevel }),
        ...(data.topic !== undefined && { topic: data.topic }),
        ...(data.fileUrl !== undefined && { fileUrl: data.fileUrl }),
        ...(data.previewImageUrl !== undefined && { previewImageUrl: data.previewImageUrl }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.teacherNotes !== undefined && { teacherNotes: data.teacherNotes }),
        ...(data.answerKey !== undefined && { answerKey: data.answerKey }),
        ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
      },
    });

    return c.json({ data: printable });
  }
);

// DELETE /:id - Delete a printable resource
adminPrintablesRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const existingPrintable = await prisma.printableResource.findUnique({
    where: { id },
  });

  if (!existingPrintable) {
    return c.json(
      { error: { message: "Printable resource not found", code: "NOT_FOUND" } },
      404
    );
  }

  await prisma.printableResource.delete({
    where: { id },
  });

  return c.json({ data: { success: true, message: "Printable resource deleted successfully" } });
});

export { adminPrintablesRouter };
