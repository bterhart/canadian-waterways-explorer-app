// Decision 2 (2026-10-16): delete the later-created copy of each duplicated
// IndigenousNation (7), Cartographer (Bellin, Jolliet) and Quiz (6 titles).
//   bun run prisma/turso-migrations/2026-10-16-dedupe-nations-cartographers-quizzes.ts [--apply]
// Rules: the copy kept is the earliest by createdAt, except that a Cartographer copy
// holding a Location link is always kept. Class assignments that point at a deleted
// quiz copy are repointed to the kept copy (ClassAssignment.quizId has no FK). Quiz
// attempts are 0 today; the script refuses to run if any exist on a copy to delete.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

async function main() {
  // ---- nations
  const nations = await db.indigenousNation.findMany({ orderBy: { createdAt: "asc" } });
  const nationKeep = new Map<string, string>();
  const nationDelete: typeof nations = [];
  for (const n of nations) {
    if (nationKeep.has(n.name)) nationDelete.push(n);
    else nationKeep.set(n.name, n.id);
  }

  // ---- cartographers
  const cartographers = await db.cartographer.findMany({
    include: { _count: { select: { locations: true } } },
    orderBy: { createdAt: "asc" },
  });
  const cartoGroups = new Map<string, typeof cartographers>();
  for (const c of cartographers) cartoGroups.set(c.name, [...(cartoGroups.get(c.name) ?? []), c]);
  const cartoDelete: typeof cartographers = [];
  const cartoRepoint: Array<{ from: string; to: string }> = [];
  for (const [, group] of cartoGroups) {
    if (group.length < 2) continue;
    const keep = group.find((c) => c._count.locations > 0) ?? group[0]!;
    for (const c of group) {
      if (c.id === keep.id) continue;
      cartoDelete.push(c);
      if (c._count.locations > 0) cartoRepoint.push({ from: c.id, to: keep.id });
    }
  }

  // ---- quizzes
  const quizzes = await db.quiz.findMany({
    include: { _count: { select: { attempts: true, questions: true } } },
    orderBy: { createdAt: "asc" },
  });
  const quizGroups = new Map<string, typeof quizzes>();
  for (const q of quizzes) quizGroups.set(q.title, [...(quizGroups.get(q.title) ?? []), q]);
  const quizDelete: typeof quizzes = [];
  const quizKeepFor = new Map<string, string>(); // deleted id → kept id
  for (const [, group] of quizGroups) {
    if (group.length < 2) continue;
    const keep = group[0]!;
    for (const q of group.slice(1)) {
      quizDelete.push(q);
      quizKeepFor.set(q.id, keep.id);
    }
  }
  const attemptsOnDeleted = quizDelete.reduce((s, q) => s + q._count.attempts, 0);
  const assignments = await db.classAssignment.findMany({ where: { quizId: { in: [...quizKeepFor.keys()] } } });
  const assignmentRepoint = assignments.map((a) => ({ id: a.id, title: a.title, from: a.quizId!, to: quizKeepFor.get(a.quizId!)! }));

  const backupFile = writeBackup("2026-10-16-dedupe-before", {
    nationsDeleted: nationDelete,
    cartographersDeleted: cartoDelete,
    cartographerRepoint: cartoRepoint,
    quizzesDeleted: await db.quiz.findMany({ where: { id: { in: quizDelete.map((q) => q.id) } }, include: { questions: true } }),
    assignmentRepoint,
  });

  report("dedupe", {
    nations: { total: nations.length, delete: nationDelete.map((n) => `${n.name} ${n.id}`), keep: [...nationKeep.values()].length },
    cartographers: { delete: cartoDelete.map((c) => `${c.name} ${c.id}`), repoint: cartoRepoint },
    quizzes: {
      delete: quizDelete.map((q) => `${q.title} ${q.id} (${q._count.questions} questions, ${q._count.attempts} attempts)`),
      attemptsOnDeleted,
      assignmentRepoint,
    },
    backupFile,
  });

  if (attemptsOnDeleted > 0) throw new Error("Attempts exist on a quiz copy to delete; decide before applying.");
  if (!APPLY) return;

  await db.$transaction(async (tx) => {
    for (const a of assignmentRepoint) await tx.classAssignment.update({ where: { id: a.id }, data: { quizId: a.to } });
    for (const r of cartoRepoint) await tx.location.updateMany({ where: { cartographerId: r.from }, data: { cartographerId: r.to } });
    await tx.indigenousNation.deleteMany({ where: { id: { in: nationDelete.map((n) => n.id) } } });
    await tx.cartographer.deleteMany({ where: { id: { in: cartoDelete.map((c) => c.id) } } });
    await tx.quiz.deleteMany({ where: { id: { in: quizDelete.map((q) => q.id) } } }); // questions cascade
  });

  report("verify", {
    nations: await db.indigenousNation.count(),
    cartographers: await db.cartographer.count(),
    quizzes: await db.quiz.count(),
    questions: await db.quizQuestion.count(),
    assignmentsPointingAtMissingQuiz: (await db.classAssignment.findMany({ where: { quizId: { not: null } }, select: { quizId: true } }))
      .filter((a) => !quizzes.some((q) => q.id === a.quizId && !quizKeepFor.has(q.id))).length,
  });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
