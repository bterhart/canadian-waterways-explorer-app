/**
 * content-scope.ts — what a class's students see (spec section 10.27, 2026-10-21).
 *
 * A teacher sets on each class a scopeMode: 'all' (everything), 'bands' (only content whose grade
 * band is among contentBands, or the class's own band when none are listed) or 'assigned' (only the
 * lessons, quizzes and field trips assigned to the class; other banded content by band as above).
 * The student's device sends its id (mobile lib/identity.ts) as ?userId= on the banded list routes
 * and on search; the scope is the union of what the student's active classes allow, so a student
 * in two classes sees what either permits, and a student in no class sees everything. Content with
 * no grade band is never hidden. Reference layers (map, waterways, explorers, figures, historical
 * maps, timeline) are not banded and are not affected.
 */
import { db } from "../db";

export const BANDS = ["K-3", "4-6", "7-9", "10-12"] as const;
export type Band = (typeof BANDS)[number];
export type ScopeMode = "all" | "bands" | "assigned";
export const SCOPE_MODES: ScopeMode[] = ["all", "bands", "assigned"];

export type AssignableKind = "lesson_plan" | "quiz" | "field_trip";

export interface ContentScope {
  /** false when some class leaves everything open or the device is in no class. */
  restricted: boolean;
  /** Bands any class allows (union). */
  bands: Set<string>;
  /** Assigned ids any 'assigned' class allows, by kind. */
  assigned: Record<AssignableKind, Set<string>>;
  /** true when every class the device is in is in 'assigned' mode: assignable kinds show assigned work only. */
  assignedOnly: boolean;
}

/** The band a class's gradeLevel falls in: "K-3", "4-6", "7-9", "10-12" as given, or a single grade mapped to its band. */
export function bandOfGrade(gradeLevel: string): Band | null {
  const g = gradeLevel.trim();
  if ((BANDS as readonly string[]).includes(g)) return g as Band;
  if (g.toUpperCase() === "K") return "K-3";
  const n = Number(g);
  if (!Number.isFinite(n)) return null;
  if (n <= 3) return "K-3";
  if (n <= 6) return "4-6";
  if (n <= 9) return "7-9";
  return "10-12";
}

export function parseBands(raw: string | null | undefined): Band[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((b): b is Band => (BANDS as readonly string[]).includes(b)) : [];
  } catch {
    return [];
  }
}

/** The bands a class lets its students see: its contentBands, else its own band. */
export function classBands(cls: { gradeLevel: string; contentBands: string | null }): Band[] {
  const listed = parseBands(cls.contentBands);
  if (listed.length > 0) return listed;
  const own = bandOfGrade(cls.gradeLevel);
  return own ? [own] : [];
}

const OPEN: ContentScope = { restricted: false, bands: new Set(BANDS), assigned: { lesson_plan: new Set(), quiz: new Set(), field_trip: new Set() }, assignedOnly: false };

/** The scope for a device id; open when the id is absent, unknown, or in a class that shows everything. */
export async function scopeForUser(userId: string | null | undefined): Promise<ContentScope> {
  if (!userId) return OPEN;
  const memberships = await db.classStudent.findMany({
    where: { userId, class: { isActive: true } },
    select: { class: { select: { gradeLevel: true, scopeMode: true, contentBands: true, assignments: { where: { isActive: true }, select: { assignmentType: true, lessonPlanId: true, quizId: true, fieldTripId: true } } } } },
  });
  if (memberships.length === 0) return OPEN;
  const scope: ContentScope = { restricted: true, bands: new Set(), assigned: { lesson_plan: new Set(), quiz: new Set(), field_trip: new Set() }, assignedOnly: true };
  for (const m of memberships) {
    const cls = m.class;
    if (cls.scopeMode !== "bands" && cls.scopeMode !== "assigned") return OPEN;
    for (const b of classBands(cls)) scope.bands.add(b);
    if (cls.scopeMode === "assigned") {
      for (const a of cls.assignments) {
        if (a.lessonPlanId) scope.assigned.lesson_plan.add(a.lessonPlanId);
        if (a.quizId) scope.assigned.quiz.add(a.quizId);
        if (a.fieldTripId) scope.assigned.field_trip.add(a.fieldTripId);
      }
    } else {
      scope.assignedOnly = false;
    }
  }
  return scope;
}

/** Keep the items the scope allows. Items with no band always pass. For an assignable kind in assigned-only scope, only assigned items pass; otherwise band membership or assignment passes. */
export function applyScope<T extends { id: string; gradeLevel: string | null }>(scope: ContentScope, items: T[], kind?: AssignableKind): T[] {
  if (!scope.restricted) return items;
  return items.filter((item) => {
    if (kind && scope.assigned[kind].has(item.id)) return true;
    if (kind && scope.assignedOnly) return false;
    if (!item.gradeLevel) return true;
    return scope.bands.has(item.gradeLevel);
  });
}
