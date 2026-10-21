import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";
import { applyScope, scopeForUser } from "../lib/content-scope";
import { completeResource, POINTS } from "../lib/progress";
import { lessonIdsForOutcome, lessonIdsForProvince, outcomesForLesson } from "../lib/curriculum";

const completeSchema = z.object({
  userId: z.string().min(1, "userId is required"), // device identity (mobile lib/identity.ts)
});

const lessonPlansRouter = new Hono();

// GET / - List all published lesson plans with optional filters
lessonPlansRouter.get("/", async (c) => {
  // Class content scope (spec 10.27): a student device sends its id; the list is cut to what its classes allow.
  const scopeUserId = c.req.query("userId");
  const gradeLevel = c.req.query("gradeLevel");
  const topic = c.req.query("topic");
  // Curriculum filters (item 9): a province whose outcomes the lesson meets, or one outcome by id or code
  const province = c.req.query("province");
  const outcome = c.req.query("outcome");

  const whereClause: {
    isPublished: boolean;
    gradeLevel?: string;
    topic?: string;
    id?: { in: string[] };
  } = {
    isPublished: true,
  };

  if (gradeLevel) {
    whereClause.gradeLevel = gradeLevel;
  }
  if (topic) {
    whereClause.topic = topic;
  }
  if (outcome) {
    whereClause.id = { in: await lessonIdsForOutcome(outcome, province || undefined) };
  } else if (province) {
    whereClause.id = { in: await lessonIdsForProvince(province) };
  }

  const lessonPlans = await db.lessonPlan.findMany({
    where: whereClause,
    select: {
      id: true,
      title: true,
      description: true,
      gradeLevel: true,
      topic: true,
      estimatedMinutes: true,
      heroImageUrl: true,
      readingTimeMinutes: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ data: applyScope(await scopeForUser(scopeUserId), lessonPlans, "lesson_plan") });
});

// GET /:id - Get a single lesson plan with full details
lessonPlansRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const lessonPlan = await db.lessonPlan.findUnique({
    where: { id, isPublished: true },
  });

  if (!lessonPlan) {
    return c.json(
      { error: { message: "Lesson plan not found", code: "NOT_FOUND" } },
      404
    );
  }

  // Parse JSON fields - General User content
  const result = {
    ...lessonPlan,
    // Curriculum outcomes the lesson meets, by province (item 9); [] until mapped
    outcomes: await outcomesForLesson(lessonPlan.id),
    // General user narrative content
    images: lessonPlan.images ? JSON.parse(lessonPlan.images) : null,
    keyFigures: lessonPlan.keyFigures ? JSON.parse(lessonPlan.keyFigures) : null,
    timeline: lessonPlan.timeline ? JSON.parse(lessonPlan.timeline) : null,
    // Teacher content (excluded from general user view by default)
    curriculumConnections: lessonPlan.curriculumConnections
      ? JSON.parse(lessonPlan.curriculumConnections)
      : null,
    objectives: lessonPlan.objectives ? JSON.parse(lessonPlan.objectives) : [],
    materials: lessonPlan.materials ? JSON.parse(lessonPlan.materials) : null,
    activities: lessonPlan.activities ? JSON.parse(lessonPlan.activities) : null,
    discussionQuestions: lessonPlan.discussionQuestions
      ? JSON.parse(lessonPlan.discussionQuestions)
      : null,
    teacherObjectives: lessonPlan.teacherObjectives
      ? JSON.parse(lessonPlan.teacherObjectives)
      : null,
    teacherActivities: lessonPlan.teacherActivities
      ? JSON.parse(lessonPlan.teacherActivities)
      : null,
    teacherQuestions: lessonPlan.teacherQuestions
      ? JSON.parse(lessonPlan.teacherQuestions)
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

// POST /:id/complete - A device finished the lesson: points, achievements,
// and completion of any matching class assignment (PUBLIC, device-id keyed).
lessonPlansRouter.post(
  "/:id/complete",
  zValidator("json", completeSchema),
  async (c) => {
    const id = c.req.param("id");
    const { userId } = c.req.valid("json");

    const lesson = await db.lessonPlan.findUnique({
      where: { id, isPublished: true },
      select: { id: true },
    });
    if (!lesson) {
      return c.json(
        { error: { message: "Lesson plan not found", code: "NOT_FOUND" } },
        404
      );
    }

    const result = await completeResource({
      userId,
      kind: "lesson_plan",
      resourceId: id,
      points: POINTS.lessonCompleted,
      activityType: "lesson_completed",
    });

    return c.json({ data: result });
  }
);

export { lessonPlansRouter };
