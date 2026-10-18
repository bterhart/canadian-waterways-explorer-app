// Delete the three primary-source documents attributed to "Richard Stuart" (2026-10-18).
//   bun run prisma/turso-migrations/2026-10-18-delete-richard-stuart-documents.ts [--apply]
//
// The explorer row was deleted on the owner's instruction (no such person in the record). The three
// documents under his name carry quoted "transcriptions" of journals and letters that cannot exist,
// so they go with him. Backed up before deletion. The same audit found 44 other documents with
// quoted transcriptions from the original seed data; those are listed for the owner in spec 9.14
// and left in place pending a decision.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

async function main() {
  const docs = await db.primarySourceDocument.findMany({ where: { author: "Richard Stuart" } });
  const backupFile = writeBackup("2026-10-18-delete-richard-stuart-documents-before", { documents: docs });
  report("delete Richard Stuart documents", { toDelete: docs.map((d) => d.title), backupFile });
  if (!APPLY) return;
  await db.primarySourceDocument.deleteMany({ where: { id: { in: docs.map((d) => d.id) } } });
  report("verify", { documents: await db.primarySourceDocument.count(), richardStuartDocuments: await db.primarySourceDocument.count({ where: { author: "Richard Stuart" } }) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
