/**
 * curriculum.ts — curriculum alignment by province (roadmap item 9, 2026-10-21).
 *
 * CurriculumOutcome rows quote a province's published curriculum: Ontario expectations and
 * Alberta outcomes carry the ministry's code; British Columbia's learning standards and
 * Quebec's competencies and knowledge elements carry none, so those are found by grade and
 * wording. LessonOutcome maps a lesson plan to an outcome. The set is small and changes only
 * through migrations, so it is loaded once and kept for CURRICULUM_TTL_MS.
 */
import { db } from "../db";

export const PROVINCES: Record<string, string> = { ON: "Ontario", BC: "British Columbia", AB: "Alberta", QC: "Quebec", SK: "Saskatchewan" };

export interface Outcome {
  id: string;
  province: string;
  provinceName: string;
  grade: string;
  course: string;
  strand: string | null;
  code: string | null;
  text: string;
  kind: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceYear: string | null;
  sortOrder: number;
  lessonCount: number;
}

export interface LessonOutcomeRow extends Outcome { note: string | null }

const CURRICULUM_TTL_MS = 10 * 60 * 1000;
let cache: { builtAt: number; outcomes: Outcome[]; byLesson: Map<string, LessonOutcomeRow[]> } | null = null;

async function load() {
  if (cache && Date.now() - cache.builtAt < CURRICULUM_TTL_MS) return cache;
  const [rows, maps] = await Promise.all([
    db.curriculumOutcome.findMany({ orderBy: [{ province: "asc" }, { grade: "asc" }, { sortOrder: "asc" }, { code: "asc" }] }),
    db.lessonOutcome.findMany(),
  ]);
  const counts = new Map<string, number>();
  for (const m of maps) counts.set(m.outcomeId, (counts.get(m.outcomeId) ?? 0) + 1);
  const outcomes: Outcome[] = rows.map((r) => ({
    id: r.id, province: r.province, provinceName: PROVINCES[r.province] ?? r.province, grade: r.grade, course: r.course, strand: r.strand,
    code: r.code, text: r.text, kind: r.kind, sourceTitle: r.sourceTitle, sourceUrl: r.sourceUrl, sourceYear: r.sourceYear, sortOrder: r.sortOrder,
    lessonCount: counts.get(r.id) ?? 0,
  }));
  const byId = new Map(outcomes.map((o) => [o.id, o]));
  const byLesson = new Map<string, LessonOutcomeRow[]>();
  for (const m of maps) {
    const o = byId.get(m.outcomeId);
    if (!o) continue;
    const list = byLesson.get(m.lessonPlanId) ?? [];
    list.push({ ...o, note: m.note });
    byLesson.set(m.lessonPlanId, list);
  }
  for (const list of byLesson.values()) list.sort((a, b) => a.province.localeCompare(b.province) || a.grade.localeCompare(b.grade, undefined, { numeric: true }) || a.sortOrder - b.sortOrder);
  cache = { builtAt: Date.now(), outcomes, byLesson };
  return cache;
}

export function clearCurriculumCache(): void { cache = null; }

/** Outcomes filtered by province, grade and a query matched against the code (exact, case-insensitive) or the wording. */
export async function listOutcomes(filter: { province?: string; grade?: string; q?: string } = {}): Promise<Outcome[]> {
  const { outcomes } = await load();
  const q = filter.q?.trim().toLowerCase();
  return outcomes.filter((o) =>
    (!filter.province || o.province === filter.province.toUpperCase()) &&
    (!filter.grade || o.grade === filter.grade) &&
    (!q || o.code?.toLowerCase() === q || o.code?.toLowerCase().startsWith(q) || o.text.toLowerCase().includes(q) || (o.strand ?? "").toLowerCase().includes(q) || o.course.toLowerCase().includes(q)),
  );
}

/** The provinces and grades that have outcomes, with counts, for the filter chips. */
export async function curriculumSummary(): Promise<{ province: string; provinceName: string; grades: { grade: string; course: string; outcomes: number }[]; sourceTitles: string[] }[]> {
  const { outcomes } = await load();
  const out = new Map<string, { province: string; provinceName: string; grades: Map<string, { grade: string; course: string; outcomes: number }>; sources: Set<string> }>();
  for (const o of outcomes) {
    const p = out.get(o.province) ?? { province: o.province, provinceName: o.provinceName, grades: new Map(), sources: new Set() };
    const g = p.grades.get(o.grade) ?? { grade: o.grade, course: o.course, outcomes: 0 };
    g.outcomes += 1; p.grades.set(o.grade, g); p.sources.add(o.sourceTitle); out.set(o.province, p);
  }
  return [...out.values()].map((p) => ({ province: p.province, provinceName: p.provinceName, grades: [...p.grades.values()].sort((a, b) => a.grade.localeCompare(b.grade, undefined, { numeric: true })), sourceTitles: [...p.sources] }));
}

/** The outcomes a lesson plan meets, in province and grade order. */
export async function outcomesForLesson(lessonPlanId: string): Promise<LessonOutcomeRow[]> {
  const { byLesson } = await load();
  return byLesson.get(lessonPlanId) ?? [];
}

/** Lesson plan ids that meet an outcome given by id or code (any province; a code narrowed by province when given). */
export async function lessonIdsForOutcome(outcomeIdOrCode: string, province?: string): Promise<string[]> {
  const { outcomes, byLesson } = await load();
  const key = outcomeIdOrCode.trim().toLowerCase();
  const matching = new Set(outcomes.filter((o) => (o.id === outcomeIdOrCode || o.code?.toLowerCase() === key) && (!province || o.province === province.toUpperCase())).map((o) => o.id));
  const ids: string[] = [];
  for (const [lessonId, list] of byLesson) if (list.some((o) => matching.has(o.id))) ids.push(lessonId);
  return ids;
}

/** Lesson plan ids that meet any outcome of a province (for the province filter on the lesson list). */
export async function lessonIdsForProvince(province: string): Promise<string[]> {
  const { byLesson } = await load();
  const p = province.toUpperCase();
  const ids: string[] = [];
  for (const [lessonId, list] of byLesson) if (list.some((o) => o.province === p)) ids.push(lessonId);
  return ids;
}
