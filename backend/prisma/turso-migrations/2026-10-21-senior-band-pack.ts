// Apply the 10-12 pack (owner, 2026-10-21, after item 12): three source-based lessons, three
// quizzes, two field trips, two printables, two comparisons and the curriculum mappings, written
// for the senior band on records already in Turso (packs/grade-bands-senior.ts).
//   bun run prisma/turso-migrations/2026-10-21-senior-band-pack.ts [--apply]
import * as pack from "./packs/grade-bands-senior";
import { applyBandPack } from "./lib/apply-band-pack";

applyBandPack(pack, "senior band pack (10-12)", "2026-10-21-senior-band-pack-before")
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });
