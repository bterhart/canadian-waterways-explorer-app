// Matonabbee on the Churchill River (2026-10-20).
//   bun run prisma/turso-migrations/2026-10-20-matonabbee-churchill.ts [--apply]
//
// Owner's report from build 64: Prince of Wales Fort lists Thanadelthur among its notable
// figures but not Matonabbee, who guided Hearne from that fort to the Coppermine and back
// (DCB, "Matonabbee", biographi.ca/en/bio/matonabbee_4E). His associatedLocations named the
// fort and the Coppermine but not the fort's river, and the place sheet matched on the river's
// name. The route now also matches the place's own name; this adds "Churchill River" so the
// waterway sheet lists him too. Idempotent; backup before --apply.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const ID = "matonabbee_leader";
const ADD = ["Churchill River"];

async function main() {
  const figure = await db.notableFigure.findUnique({ where: { id: ID }, select: { id: true, name: true, associatedLocations: true } });
  if (!figure || figure.name !== "Matonabbee") throw new Error(`figure not found or renamed: ${ID}`);
  const current: string[] = figure.associatedLocations ? JSON.parse(figure.associatedLocations) : [];
  const missing = ADD.filter((x) => !current.includes(x));
  const next = [...current, ...missing];
  const backupFile = writeBackup("2026-10-20-matonabbee-churchill-before", { figure });
  report("Matonabbee associatedLocations", { current, adding: missing, backupFile });
  if (!APPLY || missing.length === 0) return;
  await db.notableFigure.update({ where: { id: ID }, data: { associatedLocations: JSON.stringify(next) } });
  const after = await db.notableFigure.findUnique({ where: { id: ID }, select: { associatedLocations: true } });
  report("verify", { associatedLocations: after?.associatedLocations });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
