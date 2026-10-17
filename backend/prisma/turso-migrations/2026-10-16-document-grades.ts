// Decision 5 (2026-10-16): a grade band for the 34 PrimarySourceDocument rows that had
// none, so the Documents grade filter can reach them. The bands were proposed from a
// Flesch-Kincaid estimate of each transcription (≤7 → 4-6, ≤11 → 7-9, else 10-12),
// shown to the owner, and approved before --apply. Edit GRADES to override a row.
//   bun run prisma/turso-migrations/2026-10-16-document-grades.ts [--apply]
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const GRADES: Record<string, string> = {
  cmlmsw8t10000m22sjvnsk785: "4-6",   // Champlain's Account of the Founding of Quebec, July 1608
  cmlmsw8t70001m22svngult6w: "4-6",   // Champlain's Description of Hochelaga and the St. Lawrence, 1611
  cmlmsw8tb0002m22sghuc01i2: "7-9",   // Letter from Champlain to the King of France on New France, 1618
  cmlmsw8te0003m22soy6y49ik: "7-9",   // Cartier's Account of First Contact at Gaspé, July 1534
  cmlmsw8th0004m22s88763sxz: "7-9",   // Cartier's Description of Stadacona and Hochelaga, October 1535
  cmlmsw8tj0005m22s12za2dkq: "4-6",   // Cartier's Report on Scurvy and Indigenous Medicine, Winter 1535-1536
  cmlmsw8ts0006m22sv0gxap7o: "10-12", // La Salle's Claim of Louisiana at the Mississippi Delta, April 1682
  cmlmsw8tw0007m22s7tg7og5z: "7-9",   // Letter from La Salle to Governor Frontenac on Mississippi Exploration, 1681
  cmlmsw8u10008m22su0raiwnt: "4-6",   // Henri Joutel's Account of La Salle's Final Expedition, 1687
  cmlmsw8u50009m22so1t62x1f: "7-9",   // Tyrrell's Journal of the Barren Lands Expedition, July 1893
  cmlmsw8u9000am22s3rtl5v02: "10-12", // Tyrrell's Discovery of the Dinosaur Bone Beds, September 1884
  cmlmsw8ud000bm22sgvfqzwj6: "7-9",   // Letter from Tyrrell on the Geological Survey of the Klondike, 1898
  cmlmsw8uh000cm22swygl2mem: "10-12", // Back's Journal of the Great Fish River Expedition, July 1834
  cmlmsw8ul000dm22s7mbs616g: "10-12", // Back's Account of Wintering at Fort Reliance, 1833-1834
  cmlmsw8us000em22s5zxt7zms: "10-12", // Letter from Back to the Admiralty on Franklin Relief, 1836
  cmlmt06ou0001m2i2o7ofldng: "7-9",   // Fidler's Survey Journal of the Athabasca Country, 1791
  cmlmt06ox0002m2i2rpgvqlzl: "4-6",   // Fidler's Account of Living with the Peigan, 1792-1793
  cmlmt06p00003m2i26pavif2l: "7-9",   // Fidler's Report on the Red River Settlement Survey, 1814
  cmlmt06p20004m2i2j8xlcbn3: "10-12", // Turnor's Instructions to the Hudson's Bay Company, 1778
  cmlmt06p40005m2i2lfcvqccf: "7-9",   // Turnor's Journal of the Survey to Lake Athabasca, 1790
  cmlmt06p70006m2i2fz52qscl: "7-9",   // Turnor's Map and Report on the Churchill River System, 1792
  cmlmt06p90007m2i2zhi1glpb: "7-9",   // Norton's Journal at Prince of Wales Fort, 1762
  cmlmt06pd0008m2i2f1d9y9fl: "10-12", // Norton's Instructions to Samuel Hearne, December 1770
  cmlmt06pi0009m2i2eezgwgfy: "10-12", // Norton's Trade Report to the London Committee, 1768
  cmlmt06pm000am2i2in6jeh1d: "7-9",   // Stuart's Journal of the Journey Inland from York Factory, 1715-1716
  cmlmt06pq000bm2i2p7824a33: "10-12", // Stuart's Report on Thanadelthur's Peace Mission, 1716
  cmlmt06pt000cm2i26a6xzaa5: "7-9",   // Stuart's Account of Trade Customs Among the Northern Indians, 1716
  cmlmt06pw000dm2i2lhpgikha: "7-9",   // Richard Stuart's Account of the Overland Journey, 1715
  cmlmt06q0000em2i2unycnaz1: "7-9",   // Richard Stuart's Observations on the Fur Trade, 1716
  cmlmt06q4000fm2i26nqtbfjl: "7-9",   // Richard Stuart's Letter on Relations with the Cree, 1717
  cmlmt5k2d0000m2wsuy7232zo: "10-12", // La Pérouse's Account of the Attack on Prince of Wales Fort, August 1782
  cmlmt5k2l0001m2ws0zlgxctn: "7-9",   // La Pérouse's Report on the Destruction of York Factory, August 1782
  cmlmt5k2o0002m2ws76aa3o2r: "7-9",   // La Pérouse's Letter to the French Minister of Marine, 1782
  cmlmt5k2q0003m2wso7eebveq: "7-9",   // Samuel Hearne's Account of the French Capture, August 1782
};

async function main() {
  const docs = await db.primarySourceDocument.findMany({ where: { id: { in: Object.keys(GRADES) } }, select: { id: true, title: true, gradeLevel: true } });
  const missing = Object.keys(GRADES).filter((id) => !docs.some((d) => d.id === id));
  const alreadyGraded = docs.filter((d) => d.gradeLevel);
  const backupFile = writeBackup("2026-10-16-document-grades-before", { docs });
  report("document grades", { rows: docs.length, missing, alreadyGraded: alreadyGraded.map((d) => `${d.title}: ${d.gradeLevel}`), plan: docs.map((d) => `${GRADES[d.id]} ← ${d.title}`), backupFile });
  if (missing.length) throw new Error("Unknown document ids in GRADES");
  if (!APPLY) return;
  await db.$transaction(async (tx) => {
    for (const d of docs) await tx.primarySourceDocument.update({ where: { id: d.id }, data: { gradeLevel: GRADES[d.id]! } });
  });
  report("verify", { ungraded: await db.primarySourceDocument.count({ where: { gradeLevel: null } }), byGrade: await db.primarySourceDocument.groupBy({ by: ["gradeLevel"], _count: true }) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
