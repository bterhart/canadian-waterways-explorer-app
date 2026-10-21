/**
 * curriculum.ts — curriculum alignment by province (roadmap item 9, 2026-10-21).
 *
 * GET /api/curriculum                       → { data: summary[] }   provinces, grades and counts
 * GET /api/curriculum/outcomes?province&grade&q → { data: Outcome[] }  q matches a code or the wording
 * GET /api/curriculum/outcomes/:id/lessons  → { data: LessonPlanSummary[] }  the lessons meeting one outcome
 * Public, read-only. Lesson plans carry their outcomes on GET /api/lesson-plans/:id and filter by
 * ?province= and ?outcome= (id or code) on GET /api/lesson-plans.
 */
import { Hono } from "hono";
import { db } from "../db";
import { curriculumSummary, lessonIdsForOutcome, listOutcomes } from "../lib/curriculum";

const curriculumRouter = new Hono();

curriculumRouter.get("/", async (c) => c.json({ data: await curriculumSummary() }));

curriculumRouter.get("/outcomes", async (c) => {
  const province = c.req.query("province") || undefined;
  const grade = c.req.query("grade") || undefined;
  const q = c.req.query("q") || undefined;
  return c.json({ data: await listOutcomes({ province, grade, q }) });
});

curriculumRouter.get("/outcomes/:id/lessons", async (c) => {
  const ids = await lessonIdsForOutcome(c.req.param("id"));
  if (ids.length === 0) return c.json({ data: [] });
  const lessons = await db.lessonPlan.findMany({
    where: { id: { in: ids }, isPublished: true },
    select: { id: true, title: true, description: true, gradeLevel: true, topic: true, estimatedMinutes: true, heroImageUrl: true, readingTimeMinutes: true, createdAt: true },
    orderBy: { title: "asc" },
  });
  return c.json({ data: lessons });
});

export { curriculumRouter };
