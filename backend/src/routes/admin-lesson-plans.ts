import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAdmin } from "../lib/admin-middleware";

const adminLessonPlansRouter = new Hono();

// Require admin authentication for all routes
adminLessonPlansRouter.use("*", requireAdmin);

// Validation schemas
const createLessonPlanSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  gradeLevel: z.string().min(1, "Grade level is required"),
  topic: z.string().min(1, "Topic is required"),
  curriculumConnections: z.array(z.object({
    subject: z.string(),
    strand: z.string(),
    expectation: z.string().optional(),
  })).optional(),
  objectives: z.array(z.string()).min(1, "At least one objective required"),
  estimatedMinutes: z.number().int().positive().default(60),
  materials: z.array(z.string()).optional(),
  introduction: z.string().optional(),
  mainContent: z.string().min(1, "Main content is required"),
  activities: z.array(z.string()).optional(),
  discussionQuestions: z.array(z.string()).optional(),
  assessment: z.string().optional(),
  extensions: z.string().optional(),
  relatedQuizIds: z.array(z.string()).optional(),
  relatedWaterwayIds: z.array(z.string()).optional(),
  relatedLocationIds: z.array(z.string()).optional(),
  relatedExplorerIds: z.array(z.string()).optional(),
  isPublished: z.boolean().default(false),
  createdById: z.string().optional(),
});

const updateLessonPlanSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  gradeLevel: z.string().min(1).optional(),
  topic: z.string().min(1).optional(),
  curriculumConnections: z.array(z.object({
    subject: z.string(),
    strand: z.string(),
    expectation: z.string().optional(),
  })).optional().nullable(),
  objectives: z.array(z.string()).min(1).optional(),
  estimatedMinutes: z.number().int().positive().optional(),
  materials: z.array(z.string()).optional().nullable(),
  introduction: z.string().optional().nullable(),
  mainContent: z.string().min(1).optional(),
  activities: z.array(z.string()).optional().nullable(),
  discussionQuestions: z.array(z.string()).optional().nullable(),
  assessment: z.string().optional().nullable(),
  extensions: z.string().optional().nullable(),
  relatedQuizIds: z.array(z.string()).optional().nullable(),
  relatedWaterwayIds: z.array(z.string()).optional().nullable(),
  relatedLocationIds: z.array(z.string()).optional().nullable(),
  relatedExplorerIds: z.array(z.string()).optional().nullable(),
  isPublished: z.boolean().optional(),
});

// GET / - List all lesson plans (including unpublished)
adminLessonPlansRouter.get("/", async (c) => {
  const lessonPlans = await prisma.lessonPlan.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      gradeLevel: true,
      topic: true,
      estimatedMinutes: true,
      isPublished: true,
      createdById: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ data: lessonPlans });
});

// GET /:id - Get a single lesson plan for editing
adminLessonPlansRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const lessonPlan = await prisma.lessonPlan.findUnique({
    where: { id },
  });

  if (!lessonPlan) {
    return c.json(
      { error: { message: "Lesson plan not found", code: "NOT_FOUND" } },
      404
    );
  }

  // Parse JSON fields
  const result = {
    ...lessonPlan,
    curriculumConnections: lessonPlan.curriculumConnections
      ? JSON.parse(lessonPlan.curriculumConnections)
      : null,
    objectives: JSON.parse(lessonPlan.objectives),
    materials: lessonPlan.materials ? JSON.parse(lessonPlan.materials) : null,
    activities: lessonPlan.activities ? JSON.parse(lessonPlan.activities) : null,
    discussionQuestions: lessonPlan.discussionQuestions
      ? JSON.parse(lessonPlan.discussionQuestions)
      : null,
    relatedQuizIds: lessonPlan.relatedQuizIds
      ? JSON.parse(lessonPlan.relatedQuizIds)
      : null,
    relatedWaterwayIds: lessonPlan.relatedWaterwayIds
      ? JSON.parse(lessonPlan.relatedWaterwayIds)
      : null,
    relatedLocationIds: lessonPlan.relatedLocationIds
      ? JSON.parse(lessonPlan.relatedLocationIds)
      : null,
    relatedExplorerIds: lessonPlan.relatedExplorerIds
      ? JSON.parse(lessonPlan.relatedExplorerIds)
      : null,
  };

  return c.json({ data: result });
});

// POST / - Create a new lesson plan
adminLessonPlansRouter.post(
  "/",
  zValidator("json", createLessonPlanSchema),
  async (c) => {
    const data = c.req.valid("json");

    const lessonPlan = await prisma.lessonPlan.create({
      data: {
        title: data.title,
        description: data.description,
        gradeLevel: data.gradeLevel,
        topic: data.topic,
        curriculumConnections: data.curriculumConnections
          ? JSON.stringify(data.curriculumConnections)
          : null,
        objectives: JSON.stringify(data.objectives),
        estimatedMinutes: data.estimatedMinutes,
        materials: data.materials ? JSON.stringify(data.materials) : null,
        introduction: data.introduction,
        mainContent: data.mainContent,
        activities: data.activities ? JSON.stringify(data.activities) : null,
        discussionQuestions: data.discussionQuestions
          ? JSON.stringify(data.discussionQuestions)
          : null,
        assessment: data.assessment,
        extensions: data.extensions,
        relatedQuizIds: data.relatedQuizIds
          ? JSON.stringify(data.relatedQuizIds)
          : null,
        relatedWaterwayIds: data.relatedWaterwayIds
          ? JSON.stringify(data.relatedWaterwayIds)
          : null,
        relatedLocationIds: data.relatedLocationIds
          ? JSON.stringify(data.relatedLocationIds)
          : null,
        relatedExplorerIds: data.relatedExplorerIds
          ? JSON.stringify(data.relatedExplorerIds)
          : null,
        isPublished: data.isPublished,
        createdById: data.createdById,
      },
    });

    return c.json({ data: lessonPlan }, 201);
  }
);

// PATCH /:id - Update a lesson plan
adminLessonPlansRouter.patch(
  "/:id",
  zValidator("json", updateLessonPlanSchema),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");

    const existingLessonPlan = await prisma.lessonPlan.findUnique({
      where: { id },
    });

    if (!existingLessonPlan) {
      return c.json(
        { error: { message: "Lesson plan not found", code: "NOT_FOUND" } },
        404
      );
    }

    const lessonPlan = await prisma.lessonPlan.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.gradeLevel !== undefined && { gradeLevel: data.gradeLevel }),
        ...(data.topic !== undefined && { topic: data.topic }),
        ...(data.curriculumConnections !== undefined && {
          curriculumConnections: data.curriculumConnections
            ? JSON.stringify(data.curriculumConnections)
            : null,
        }),
        ...(data.objectives !== undefined && {
          objectives: JSON.stringify(data.objectives),
        }),
        ...(data.estimatedMinutes !== undefined && {
          estimatedMinutes: data.estimatedMinutes,
        }),
        ...(data.materials !== undefined && {
          materials: data.materials ? JSON.stringify(data.materials) : null,
        }),
        ...(data.introduction !== undefined && { introduction: data.introduction }),
        ...(data.mainContent !== undefined && { mainContent: data.mainContent }),
        ...(data.activities !== undefined && {
          activities: data.activities ? JSON.stringify(data.activities) : null,
        }),
        ...(data.discussionQuestions !== undefined && {
          discussionQuestions: data.discussionQuestions
            ? JSON.stringify(data.discussionQuestions)
            : null,
        }),
        ...(data.assessment !== undefined && { assessment: data.assessment }),
        ...(data.extensions !== undefined && { extensions: data.extensions }),
        ...(data.relatedQuizIds !== undefined && {
          relatedQuizIds: data.relatedQuizIds
            ? JSON.stringify(data.relatedQuizIds)
            : null,
        }),
        ...(data.relatedWaterwayIds !== undefined && {
          relatedWaterwayIds: data.relatedWaterwayIds
            ? JSON.stringify(data.relatedWaterwayIds)
            : null,
        }),
        ...(data.relatedLocationIds !== undefined && {
          relatedLocationIds: data.relatedLocationIds
            ? JSON.stringify(data.relatedLocationIds)
            : null,
        }),
        ...(data.relatedExplorerIds !== undefined && {
          relatedExplorerIds: data.relatedExplorerIds
            ? JSON.stringify(data.relatedExplorerIds)
            : null,
        }),
        ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
      },
    });

    return c.json({ data: lessonPlan });
  }
);

// DELETE /:id - Delete a lesson plan
adminLessonPlansRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const existingLessonPlan = await prisma.lessonPlan.findUnique({
    where: { id },
  });

  if (!existingLessonPlan) {
    return c.json(
      { error: { message: "Lesson plan not found", code: "NOT_FOUND" } },
      404
    );
  }

  await prisma.lessonPlan.delete({
    where: { id },
  });

  return c.json({ data: { success: true, message: "Lesson plan deleted successfully" } });
});

export { adminLessonPlansRouter };
