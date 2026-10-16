// Decision 1b (2026-10-16): the fifteen people in Explorer who are not explorers move to
// NotableFigure. Thirteen already have a figure row; Chief Peguis and Shawnadithit get one
// created from their Explorer row. Then:
//   - LessonPlan.keyFigures[].explorerId → notableFigureId for these people (35 entries)
//   - ReadingGuide rows explorer:<id> → notable_figure:<figureId>
//   - NotableFigure.associatedExplorers[] entries naming one of them gain notableFigureId
//   - a figure without imageUrl takes the Explorer portrait, EXCEPT Thanadelthur, for whom
//     no likeness exists (rule: portraits only where a verified likeness exists); the
//     report flags portraits whose provenance the owner should confirm
//   - the Explorer rows are deleted (none has an ExplorerWaterway row or any other reference)
//   bun run prisma/turso-migrations/2026-10-16-move-people-to-notable-figures.ts [--apply]
import { db } from "../../src/db";
import { APPLY, writeBackup, report, parseJsonArray } from "./lib/migration";

const MOVE = [
  "Akaitcho", "Big Bear", "Charlotte Small", "Chief Peguis", "Crowfoot", "Cuthbert Grant", "Gabriel Dumont",
  "Isabel Gunn", "Jean-Baptiste Lagimodiere", "Louis Riel", "Marie-Anne Gaboury", "Matonabbee", "Poundmaker",
  "Thanadelthur", "Shawnadithit",
];
const NO_LIKENESS = new Set(["Thanadelthur"]);
const PROVENANCE_TO_CONFIRM = new Set(["Cuthbert Grant", "Jean-Baptiste Lagimodiere", "Matonabbee"]);

// New figure rows for the two who have none
const NEW_FIGURES: Record<string, { figureType: string; nation: string; role: string; isFeatured: boolean }> = {
  "Chief Peguis": { figureType: "indigenous_leader", nation: "Saulteaux (Ojibwe)", role: "Saulteaux (Ojibwe) chief at Red River and ally of the Selkirk settlers", isFeatured: false },
  "Shawnadithit": { figureType: "woman", nation: "Beothuk", role: "Last known Beothuk; recorded her people's history and language", isFeatured: false },
};

const base = (s: string) => s.replace(/\s*\(.*\)\s*$/, "").trim();

async function main() {
  const explorers = await db.explorer.findMany({ where: { name: { in: MOVE } }, include: { _count: { select: { waterways: true } } } });
  const missing = MOVE.filter((n) => !explorers.some((e) => e.name === n));
  const figures = await db.notableFigure.findMany();
  const lessons = await db.lessonPlan.findMany({ select: { id: true, title: true, keyFigures: true } });
  const explorerIds = explorers.map((e) => e.id);
  const guides = await db.readingGuide.findMany({ where: { targetType: "explorer", targetId: { in: explorerIds } } });

  const refs = {
    explorerWaterway: explorers.reduce((s, e) => s + e._count.waterways, 0),
    documents: await db.primarySourceDocument.count({ where: { explorerId: { in: explorerIds } } }),
    timeline: await db.timelineEvent.count({ where: { explorerId: { in: explorerIds } } }),
    historical: await db.historicalEvent.count({ where: { explorerId: { in: explorerIds } } }),
    quizQuestions: await db.quizQuestion.count({ where: { sourceId: { in: explorerIds } } }),
    pron: await db.pronunciationGuide.count({ where: { explorerId: { in: explorerIds } } }),
    pins: await db.mapPin.count({ where: { linkedExplorerId: { in: explorerIds } } }),
    routes: await db.mapRoute.count({ where: { compareToExplorerId: { in: explorerIds } } }),
    journal: await db.journalEntry.count({ where: { explorerId: { in: explorerIds } } }),
    saved: await db.savedLocation.count({ where: { explorerId: { in: explorerIds } } }),
  };

  // explorer → figure (existing or to create)
  const mapping = explorers.map((e) => {
    const figure = figures.find((f) => base(f.name) === e.name || f.name === e.name);
    const create = !figure ? NEW_FIGURES[e.name] : undefined;
    if (!figure && !create) throw new Error(`No figure row and no NEW_FIGURES entry for ${e.name}`);
    const copyPortrait = !!e.imageUrl && !NO_LIKENESS.has(e.name) && (!figure || !figure.imageUrl);
    return { explorerId: e.id, name: e.name, figureId: figure?.id ?? `nf_${e.name.toLowerCase().replace(/[^a-z]+/g, "_")}`, figureExists: !!figure, create, copyPortrait, portraitUrl: e.imageUrl, provenanceFlag: PROVENANCE_TO_CONFIRM.has(e.name), explorer: e };
  });
  const figureIdFor = new Map(mapping.map((m) => [m.explorerId, m.figureId]));
  const figureIdByName = new Map(mapping.map((m) => [m.name, m.figureId]));

  // key figure rewrites
  const lessonRewrites = lessons.flatMap((l) => {
    const kf = parseJsonArray<{ name: string; explorerId?: string | null; notableFigureId?: string | null }>(l.keyFigures);
    let changed = 0;
    const next = kf.map((k) => {
      if (k.explorerId && figureIdFor.has(k.explorerId)) { changed++; const { explorerId, ...rest } = k; return { ...rest, notableFigureId: figureIdFor.get(explorerId)! }; }
      return k;
    });
    return changed ? [{ id: l.id, title: l.title, changed, keyFigures: next }] : [];
  });

  // associated explorers gain notableFigureId
  const figureRewrites = figures.flatMap((f) => {
    const ae = parseJsonArray<{ name: string; relationship?: string; explorerId?: string | null; notableFigureId?: string | null }>(f.associatedExplorers);
    let changed = 0;
    const next = ae.map((a) => (figureIdByName.has(a.name) && !a.notableFigureId ? (changed++, { ...a, notableFigureId: figureIdByName.get(a.name)! }) : a));
    return changed ? [{ id: f.id, name: f.name, changed, associatedExplorers: next }] : [];
  });

  const backupFile = writeBackup("2026-10-16-move-people-before", { explorers, figures: figures.filter((f) => mapping.some((m) => m.figureId === f.id) || figureRewrites.some((r) => r.id === f.id)), lessons: lessons.filter((l) => lessonRewrites.some((r) => r.id === l.id)), readingGuides: guides });

  report("move people to NotableFigure", {
    missingExplorers: missing,
    refsPointingAtExplorers: refs,
    mapping: mapping.map((m) => ({ name: m.name, figureId: m.figureId, figureExists: m.figureExists, create: !!m.create, copyPortrait: m.copyPortrait, noLikeness: NO_LIKENESS.has(m.name), provenanceToConfirm: m.provenanceFlag })),
    lessonRewrites: lessonRewrites.map((l) => `${l.title}: ${l.changed}`),
    totalKeyFigureEntries: lessonRewrites.reduce((s, l) => s + l.changed, 0),
    figureRewrites: figureRewrites.map((f) => `${f.name}: ${f.changed}`),
    readingGuidesToRetarget: guides.length,
    backupFile,
  });

  const blocking = Object.entries(refs).filter(([, n]) => n > 0);
  if (blocking.length) throw new Error(`Rows still point at these explorers: ${JSON.stringify(blocking)}`);
  if (!APPLY) return;

  await db.$transaction(async (tx) => {
    for (const m of mapping) {
      if (m.create) {
        await tx.notableFigure.create({ data: {
          id: m.figureId, name: m.name, birthYear: m.explorer.birthYear, deathYear: m.explorer.deathYear, nation: m.create.nation,
          figureType: m.create.figureType, role: m.create.role, biography: m.explorer.biography,
          significance: m.explorer.notableAchievements ?? m.explorer.biography.split(". ")[0] + ".",
          imageUrl: m.copyPortrait ? m.portraitUrl : null, isFeatured: m.create.isFeatured,
        } });
      } else if (m.copyPortrait) {
        await tx.notableFigure.update({ where: { id: m.figureId }, data: { imageUrl: m.portraitUrl } });
      }
    }
    for (const l of lessonRewrites) await tx.lessonPlan.update({ where: { id: l.id }, data: { keyFigures: JSON.stringify(l.keyFigures) } });
    for (const f of figureRewrites) await tx.notableFigure.update({ where: { id: f.id }, data: { associatedExplorers: JSON.stringify(f.associatedExplorers) } });
    for (const g of guides) await tx.readingGuide.update({ where: { id: g.id }, data: { targetType: "notable_figure", targetId: figureIdFor.get(g.targetId)! } });
    await tx.explorer.deleteMany({ where: { id: { in: explorerIds } } });
  });

  const remainingKf = (await db.lessonPlan.findMany({ select: { keyFigures: true } })).flatMap((l) => parseJsonArray<{ explorerId?: string }>(l.keyFigures)).filter((k) => k.explorerId && explorerIds.includes(k.explorerId)).length;
  report("verify", {
    explorers: await db.explorer.count(),
    notableFigures: await db.notableFigure.count(),
    keyFiguresStillPointingAtMoved: remainingKf,
    guidesOnFigures: await db.readingGuide.count({ where: { targetType: "notable_figure" } }),
    guidesOnMovedExplorers: await db.readingGuide.count({ where: { targetType: "explorer", targetId: { in: explorerIds } } }),
  });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
