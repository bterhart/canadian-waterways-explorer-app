// Template-field sweep, pass 16 (2026-10-19): asterisk the four documents with no documented source.
//   bun run prisma/turso-migrations/2026-10-19-sweep-16-asterisk-undocumented.ts [--apply]
//
// Owner's decision of 2026-10-19: the four seed documents that describe records no archive or
// edition is known to hold (the York Factory trade record of 1780, the "letter from Matonabbee" of
// 1772, La Salle's letter to Frontenac of 1681, Thompson's references to Charlotte Small) are kept,
// because what they say is consistent with the documented record and still elucidating, but are
// marked: an asterisk at the end of the title, and a line in historicalContext saying that no
// documented source exists for them. Idempotent; backup before --apply.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const NOTE = "* No documented source: no record of this document has been found in any archive or published edition. It is kept as an illustrative text because what it describes is consistent with the documented history of the people and places involved; it should not be cited as a primary source.";
const IDS: Array<{ id: string; was: string }> = [
  { id: "cmlirhtoq000nm2hcschn05zl", was: "York Factory Trade Record, 1780" },
  { id: "cmlirhtos000om2hccuc6ejmy", was: "Letter from Matonabbee to Samuel Hearne, 1772" },
  { id: "cmlmsw8tw0007m22s7tg7og5z", was: "Letter from La Salle to Governor Frontenac on Mississippi Exploration, 1681" },
  { id: "cmlitwdbs0004m2hgkjbonqnc", was: "David Thompson's References to Charlotte Small, 1799-1811" },
];

async function main() {
  const docs = await db.primarySourceDocument.findMany({ where: { id: { in: IDS.map((x) => x.id) } }, select: { id: true, title: true, historicalContext: true, transcription: true } });
  const updates = IDS.map((x) => {
    const d = docs.find((y) => y.id === x.id); if (!d) throw new Error(`document not found: ${x.id}`);
    if (d.title !== x.was && d.title !== `${x.was} *`) throw new Error(`title mismatch: ${d.title}`);
    if (d.transcription) throw new Error(`unexpected transcription on ${d.title}`);
    const title = d.title.endsWith(" *") ? d.title : `${d.title} *`;
    const ctx = d.historicalContext ?? "";
    const historicalContext = ctx.includes("No documented source") ? ctx : `${ctx.trimEnd()}\n\n${NOTE}`;
    return { id: d.id, before: d, data: { title, historicalContext }, changed: title !== d.title || historicalContext !== ctx };
  }).filter((u) => u.changed);
  const backupFile = writeBackup("2026-10-19-sweep-16-before", { documents: updates.map((u) => u.before) });
  report("sweep pass 16: asterisk undocumented documents", { documents: updates.map((u) => `${u.before.title} → ${u.data.title}`), backupFile });
  if (!APPLY) return;
  await db.$transaction(async (tx) => { for (const u of updates) await tx.primarySourceDocument.update({ where: { id: u.id }, data: u.data }); }, { timeout: 60000 });
  report("verify", { asterisked: (await db.primarySourceDocument.findMany({ where: { title: { endsWith: " *" } }, select: { title: true } })).map((d) => d.title) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
