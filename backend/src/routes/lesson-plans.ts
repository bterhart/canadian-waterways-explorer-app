import { Hono } from "hono";
import { prisma } from "../prisma";

const lessonPlansRouter = new Hono();

// GET / - List all published lesson plans with optional filters
lessonPlansRouter.get("/", async (c) => {
  const gradeLevel = c.req.query("gradeLevel");
  const topic = c.req.query("topic");

  const whereClause: {
    isPublished: boolean;
    gradeLevel?: string;
    topic?: string;
  } = {
    isPublished: true,
  };

  if (gradeLevel) {
    whereClause.gradeLevel = gradeLevel;
  }
  if (topic) {
    whereClause.topic = topic;
  }

  const lessonPlans = await prisma.lessonPlan.findMany({
    where: whereClause,
    select: {
      id: true,
      title: true,
      description: true,
      gradeLevel: true,
      topic: true,
      estimatedMinutes: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ data: lessonPlans });
});

// GET /:id - Get a single lesson plan with full details
lessonPlansRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const lessonPlan = await prisma.lessonPlan.findUnique({
    where: { id, isPublished: true },
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

export { lessonPlansRouter };
