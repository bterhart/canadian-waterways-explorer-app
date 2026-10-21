// Relabel the quiz "Canada's Waterways Geography" from K-3 to 7-9 (owner, 2026-10-21, spec 10.34):
// its questions (the Mackenzie's length in kilometres, which Great Lake lies entirely within Canada)
// were written for 7-9 and labelled down. Three K-3 quizzes written for the band now exist.
//   bun run prisma/turso-migrations/2026-10-21-relabel-geography-quiz.ts [--apply]
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const QUIZ_ID = "cmlhdl1nt001im2c83w27tuca";
const TITLE = "Canada's Waterways Geography";
const TO = "7-9";

async function main() {
  const quiz = await db.quiz.findUnique({ where: { id: QUIZ_ID }, select: { id: true, title: true, gradeLevel: true, difficulty: true, category: true, _count: { select: { questions: true } } } });
  if (!quiz) throw new Error(`quiz not found: ${QUIZ_ID}`);
  if (quiz.title !== TITLE) throw new Error(`quiz ${QUIZ_ID} is "${quiz.title}", expected "${TITLE}"`);
  const backupFile = writeBackup("2026-10-21-relabel-geography-quiz-before", { quiz: { id: quiz.id, title: quiz.title, before: { gradeLevel: quiz.gradeLevel } } });
  report("relabel geography quiz", { id: quiz.id, title: quiz.title, from: quiz.gradeLevel, to: TO, difficulty: quiz.difficulty, category: quiz.category, questions: quiz._count.questions, backupFile });
  if (quiz.gradeLevel === TO) { console.log("already relabelled; nothing to do"); return; }
  if (!APPLY) return;
  await db.quiz.update({ where: { id: QUIZ_ID }, data: { gradeLevel: TO } });
  const after = await db.quiz.findUnique({ where: { id: QUIZ_ID }, select: { gradeLevel: true } });
  const bands = (await db.$queryRawUnsafe<{ g: string | null; n: number }[]>(`SELECT gradeLevel AS g, COUNT(*) AS n FROM "Quiz" GROUP BY gradeLevel ORDER BY gradeLevel`)).map((r) => `${r.g ?? "null"}=${Number(r.n)}`).join("  ");
  report("verify", { gradeLevel: after?.gradeLevel, quizzesByBand: bands });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
