// Apply the grade-band pack (roadmap item 12): K-3 and 4-6 lessons, quizzes, field trips,
// printables, comparisons and curriculum mappings, written for the band (packs/grade-bands.ts).
//   bun run prisma/turso-migrations/2026-10-21-grade-band-pack.ts [--apply]
//
// The dry run checks that every id the pack points at exists in Turso (explorers, waterways,
// locations, figures, timeline events, curriculum outcomes, quizzes referenced by lessons), that
// every image URL answers, and that no row id is already taken; then prints what would be written.
// --apply writes everything in one transaction after a JSON record of the ids it creates and of the
// previous content of any printable whose sheet changed. Idempotent by id: rows that already exist
// are skipped (a printable whose content differs from the pack is updated), and missing LessonOutcome
// mappings are added.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";
import * as pack from "./packs/grade-bands";

const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const problems: string[] = [];
const warnings: string[] = [];

async function checkUrl(url: string) {
  try {
    const r = await fetch(url, { method: "HEAD", redirect: "follow", headers: { "User-Agent": BROWSER_UA } });
    // Commons rate-limits bursts of HEADs with 429; every URL here is already on a Turso record that
    // an earlier pack checked, so a 429 is a warning, anything else that is not ok is a problem.
    if (r.status === 429) warnings.push(`image rate-limited (429), not re-checked: ${url}`);
    else if (!r.ok) problems.push(`image ${r.status}: ${url}`);
    if (url.includes("commons.wikimedia.org")) await new Promise((res) => setTimeout(res, 400));
  } catch (e) {
    problems.push(`image unreachable: ${url} (${(e as Error).message})`);
  }
}

async function main() {
  const [explorers, waterways, locations, figures, events, outcomes, existingLessons, existingQuizzes, existingTrips, existingPrintables, existingComparisons, existingMappings] = await Promise.all([
    db.explorer.findMany({ select: { id: true } }), db.waterway.findMany({ select: { id: true } }), db.location.findMany({ select: { id: true } }),
    db.notableFigure.findMany({ select: { id: true } }), db.timelineEvent.findMany({ select: { id: true } }), db.curriculumOutcome.findMany({ select: { id: true } }),
    db.lessonPlan.findMany({ select: { id: true } }), db.quiz.findMany({ select: { id: true } }), db.virtualFieldTrip.findMany({ select: { id: true } }),
    db.printableResource.findMany({ select: { id: true, content: true } }), db.comparisonTemplate.findMany({ select: { id: true } }), db.lessonOutcome.findMany({ select: { id: true } }),
  ]);
  const has = (rows: { id: string }[]) => new Set(rows.map((r) => r.id));
  const ex = has(explorers), ww = has(waterways), loc = has(locations), fig = has(figures), tev = has(events), oc = has(outcomes);
  const lessonIds = has(existingLessons), quizIds = has(existingQuizzes), tripIds = has(existingTrips), printableIds = has(existingPrintables), cmpIds = has(existingComparisons), mapIds = has(existingMappings);
  const need = (set: Set<string>, id: string, what: string) => { if (!set.has(id)) problems.push(`${what} not found: ${id}`); };

  // ---- referential checks
  for (const l of pack.lessons) {
    for (const id of l.relatedWaterwayIds) need(ww, id, `lesson ${l.id} waterway`);
    for (const id of l.relatedLocationIds) need(loc, id, `lesson ${l.id} location`);
    for (const id of l.relatedExplorerIds) need(ex, id, `lesson ${l.id} explorer`);
    for (const k of l.keyFigures) { if (k.explorerId) need(ex, k.explorerId, `lesson ${l.id} key figure explorer`); if (k.notableFigureId) need(fig, k.notableFigureId, `lesson ${l.id} key figure`); }
    for (const t of l.timeline) if (t.eventId) need(tev, t.eventId, `lesson ${l.id} timeline event`);
    for (const q of l.relatedQuizIds) if (!pack.quizzes.some((x) => x.id === q) && !quizIds.has(q)) problems.push(`lesson ${l.id} quiz not in pack or Turso: ${q}`);
    for (const o of l.outcomes) need(oc, Array.isArray(o) ? o[0] : o, `lesson ${l.id} outcome`);
  }
  for (const q of pack.quizzes) for (const [i, qq] of q.questions.entries()) {
    const set = qq.sourceType === "explorer" ? ex : qq.sourceType === "waterway" ? ww : qq.sourceType === "location" ? loc : fig;
    need(set, qq.sourceId, `quiz ${q.id} q${i + 1} ${qq.sourceType}`);
    if (qq.correct < 0 || qq.correct >= qq.options.length) problems.push(`quiz ${q.id} q${i + 1}: correct index out of range`);
  }
  for (const t of pack.fieldTrips) for (const s of t.stops) { if (s.locationId) need(loc, s.locationId, `trip ${t.id} stop location`); need(ww, s.waterwayId, `trip ${t.id} stop waterway`); }

  // ---- images
  const urls = new Set<string>();
  for (const l of pack.lessons) { urls.add(l.heroImageUrl); for (const i of l.images) urls.add(i.url); }
  for (const t of pack.fieldTrips) { urls.add(t.coverImageUrl); for (const s of t.stops) urls.add(s.imageUrl); }
  for (const u of urls) await checkUrl(u);

  // ---- rows
  const lessonRows = pack.lessons.filter((l) => !lessonIds.has(l.id)).map((l) => ({
    id: l.id, title: l.title, description: l.description, gradeLevel: l.gradeLevel, topic: l.topic, estimatedMinutes: l.estimatedMinutes, readingTimeMinutes: l.readingTimeMinutes,
    isPublished: true, isCore: false, visibility: "private", heroImageUrl: l.heroImageUrl, images: JSON.stringify(l.images),
    narrativeContent: l.narrativeContent, introduction: l.introduction, mainContent: l.mainContent,
    objectives: JSON.stringify(l.objectives), materials: JSON.stringify(l.materials), activities: JSON.stringify(l.activities), discussionQuestions: JSON.stringify(l.discussionQuestions),
    assessment: l.assessment, extensions: l.extensions, curriculumConnections: JSON.stringify(l.curriculumConnections),
    teacherObjectives: JSON.stringify(l.teacherObjectives), teacherActivities: JSON.stringify(l.teacherActivities), teacherQuestions: JSON.stringify(l.teacherQuestions), teacherNotes: l.teacherNotes,
    keyFigures: JSON.stringify(l.keyFigures), timeline: JSON.stringify(l.timeline),
    relatedWaterwayIds: JSON.stringify(l.relatedWaterwayIds), relatedLocationIds: JSON.stringify(l.relatedLocationIds), relatedExplorerIds: JSON.stringify(l.relatedExplorerIds), relatedQuizIds: JSON.stringify(l.relatedQuizIds),
  }));
  const quizRows = pack.quizzes.filter((q) => !quizIds.has(q.id)).map((q) => ({
    id: q.id, title: q.title, description: q.description, category: q.category, gradeLevel: q.gradeLevel, difficulty: q.difficulty, isPublished: true,
    questions: q.questions.map((qq, i) => ({ id: `${q.id}_q${i + 1}`, questionText: qq.questionText, questionType: "multiple_choice", options: JSON.stringify(qq.options.map((text, j) => ({ id: String.fromCharCode(97 + j), text }))), correctAnswer: String.fromCharCode(97 + qq.correct), explanation: qq.explanation, sourceType: qq.sourceType, sourceId: qq.sourceId, orderIndex: i, points: 1 })),
  }));
  const tripRows = pack.fieldTrips.filter((t) => !tripIds.has(t.id)).map((t) => ({
    id: t.id, title: t.title, description: t.description, gradeLevel: t.gradeLevel, estimatedMinutes: t.estimatedMinutes, theme: t.theme, coverImageUrl: t.coverImageUrl, isPublished: true, isCore: false, visibility: "private",
    stops: t.stops.map((s, i) => ({ id: `${t.id}_stop_${i}`, orderIndex: i, title: s.title, description: s.description, locationId: s.locationId, waterwayId: s.waterwayId, latitude: s.lat, longitude: s.lng, imageUrl: s.imageUrl, funFact: s.funFact, thinkQuestion: s.thinkQuestion })),
  }));
  const printableRows = pack.printables.filter((p) => !printableIds.has(p.id)).map((p) => ({ id: p.id, title: p.title, description: p.description, resourceType: p.resourceType, gradeLevel: p.gradeLevel, topic: p.topic, content: p.content, teacherNotes: p.teacherNotes, answerKey: p.answerKey, isPublished: true, isCore: false, visibility: "private" }));
  const printableUpdates = pack.printables.flatMap((p) => { const live = existingPrintables.find((x) => x.id === p.id); return live && live.content !== p.content ? [{ id: p.id, title: p.title, before: live.content, content: p.content, teacherNotes: p.teacherNotes, answerKey: p.answerKey }] : []; });
  const comparisonRows = pack.comparisons.filter((c) => !cmpIds.has(c.id)).map((c) => ({ id: c.id, title: c.title, description: c.description, comparisonType: c.comparisonType, gradeLevel: c.gradeLevel, items: JSON.stringify(c.items), criteria: JSON.stringify(c.criteria), analysisPrompts: JSON.stringify(c.analysisPrompts), isPublished: true }));
  const mappingRows = pack.lessons.flatMap((l) => l.outcomes.map((o) => { const [outcomeId, note] = Array.isArray(o) ? o : [o, null]; return { id: `lo_${l.id}_${outcomeId}`, lessonPlanId: l.id, outcomeId, note }; })).filter((m) => !mapIds.has(m.id));
  const dupMaps = new Set<string>();
  for (const m of mappingRows) { if (dupMaps.has(m.id)) problems.push(`duplicate outcome on a lesson: ${m.id}`); dupMaps.add(m.id); }

  const backupFile = writeBackup("2026-10-21-grade-band-pack-before", {
    note: "The pack only creates rows; this file lists the ids it creates so they can be removed if needed.",
    lessons: lessonRows.map((r) => r.id), quizzes: quizRows.map((r) => r.id), fieldTrips: tripRows.map((r) => r.id), printables: printableRows.map((r) => r.id), comparisons: comparisonRows.map((r) => r.id), lessonOutcomes: mappingRows.map((r) => r.id),
    printablesUpdated: printableUpdates.map((u) => ({ id: u.id, before: { content: u.before } })),
  });
  report("grade-band pack (item 12)", {
    lessons: lessonRows.map((r) => `${r.gradeLevel} ${r.title} (${JSON.parse(r.relatedWaterwayIds).length} waters, ${JSON.parse(r.keyFigures).length} figures, ${JSON.parse(r.timeline).length} timeline items)`),
    lessonsSkipped: pack.lessons.filter((l) => lessonIds.has(l.id)).map((l) => l.id),
    quizzes: quizRows.map((r) => `${r.gradeLevel} ${r.title} (${r.questions.length} q, ${r.category})`), quizzesSkipped: pack.quizzes.filter((q) => quizIds.has(q.id)).map((q) => q.id),
    fieldTrips: tripRows.map((r) => `${r.gradeLevel} ${r.title} (${r.stops.length} stops)`), fieldTripsSkipped: pack.fieldTrips.filter((t) => tripIds.has(t.id)).map((t) => t.id),
    printables: printableRows.map((r) => `${r.gradeLevel} ${r.title} (${r.resourceType}, ${(r.content.length / 1024).toFixed(0)} KB)`), printablesSkipped: pack.printables.filter((p) => printableIds.has(p.id)).map((p) => p.id),
    printablesUpdated: printableUpdates.map((u) => `${u.title} (sheet changed)`),
    comparisons: comparisonRows.map((r) => `${r.gradeLevel} ${r.title}`), comparisonsSkipped: pack.comparisons.filter((c) => cmpIds.has(c.id)).map((c) => c.id),
    lessonOutcomes: mappingRows.length, perLesson: pack.lessons.map((l) => ({ title: l.title, outcomes: l.outcomes.length })),
    imagesChecked: urls.size, warnings, problems, backupFile,
  });
  if (problems.length) throw new Error("Resolve the problems above before applying.");
  if (!APPLY) return;

  await db.$transaction(async (tx) => {
    for (const r of lessonRows) await tx.lessonPlan.create({ data: r });
    for (const { questions, ...q } of quizRows) await tx.quiz.create({ data: { ...q, questions: { create: questions } } });
    for (const { stops, ...t } of tripRows) await tx.virtualFieldTrip.create({ data: { ...t, stops: { create: stops } } });
    for (const r of printableRows) await tx.printableResource.create({ data: r });
    for (const u of printableUpdates) await tx.printableResource.update({ where: { id: u.id }, data: { content: u.content, teacherNotes: u.teacherNotes, answerKey: u.answerKey } });
    for (const r of comparisonRows) await tx.comparisonTemplate.create({ data: r });
    for (const r of mappingRows) await tx.lessonOutcome.create({ data: r });
  }, { timeout: 120_000 });

  // ---- verify
  const bands = async (table: string) => (await db.$queryRawUnsafe<{ g: string | null; n: number }[]>(`SELECT gradeLevel AS g, COUNT(*) AS n FROM "${table}" GROUP BY gradeLevel ORDER BY gradeLevel`)).map((r) => `${r.g ?? "null"}=${Number(r.n)}`).join("  ");
  report("verify", {
    LessonPlan: await bands("LessonPlan"), Quiz: await bands("Quiz"), VirtualFieldTrip: await bands("VirtualFieldTrip"), PrintableResource: await bands("PrintableResource"), ComparisonTemplate: await bands("ComparisonTemplate"),
    questions: Number((await db.$queryRawUnsafe<{ n: number }[]>(`SELECT COUNT(*) AS n FROM "QuizQuestion" WHERE quizId IN (${pack.quizzes.map((q) => `'${q.id}'`).join(",")})`))[0]?.n ?? 0),
    stops: Number((await db.$queryRawUnsafe<{ n: number }[]>(`SELECT COUNT(*) AS n FROM "FieldTripStop" WHERE tripId IN (${pack.fieldTrips.map((t) => `'${t.id}'`).join(",")})`))[0]?.n ?? 0),
    mappings: Number((await db.$queryRawUnsafe<{ n: number }[]>(`SELECT COUNT(*) AS n FROM "LessonOutcome" WHERE lessonPlanId IN (${pack.lessons.map((l) => `'${l.id}'`).join(",")})`))[0]?.n ?? 0),
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
