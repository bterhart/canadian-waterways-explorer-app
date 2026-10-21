// Apply the grade-band pack (roadmap item 12): K-3 and 4-6 lessons, quizzes, field trips,
// printables, comparisons and curriculum mappings, written for the band (packs/grade-bands.ts).
//   bun run prisma/turso-migrations/2026-10-21-grade-band-pack.ts [--apply]
// The checks, the dry run, the transaction and the verification live in lib/apply-band-pack.ts,
// shared with the 10-12 pack. Applied to Turso 2026-10-21.
import * as pack from "./packs/grade-bands";
import { applyBandPack } from "./lib/apply-band-pack";

applyBandPack(pack, "grade-band pack (item 12)", "2026-10-21-grade-band-pack-before")
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });
