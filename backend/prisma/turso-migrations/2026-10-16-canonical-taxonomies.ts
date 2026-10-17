// Decision 4 (2026-10-16): canonical taxonomy values.
//   bun run prisma/turso-migrations/2026-10-16-canonical-taxonomies.ts [--apply]
//   - Location.locationType: fort → Fort, historic_site → Cultural Site
//   - WaterwayType "lake" folded into "Lake" (the one waterway repointed, the type row deleted)
//   - Explorer.nationality: controlled list; the parenthetical detail becomes one sentence
//     appended to the biography when the biography does not already say it
//   - FurTradeInfo.tradingCompany: full company names joined by " / "
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const LOCATION_TYPE: Record<string, string> = { fort: "Fort", historic_site: "Cultural Site" };

// nationality → [canonical, sentence to add to the biography if its keyword is absent, keyword]
const NATIONALITY: Record<string, [string, string | null, string | null]> = {
  "American (Connecticut)": ["American", "He was born in Connecticut.", "Connecticut"],
  "American (New Jersey)": ["American", "He was born in New Jersey.", "New Jersey"],
  "American (Vermont)": ["American", "He was born in Vermont.", "Vermont"],
  "American (Vermont), Loyalist": ["American", "Born in Vermont, he came north as a Loyalist.", "Loyalist"],
  "British (born British Guiana)": ["British", "He was born in British Guiana.", "Guiana"],
  "Canadian (Icelandic descent)": ["Canadian", "He was of Icelandic descent.", "Iceland"],
  "Canadian (Quebec)": ["Canadian", "He was born in Quebec.", "Quebec"],
  "Danish (sailing for Russia)": ["Danish", "He sailed in the service of Russia.", "Russia"],
  "English (Welsh heritage)": ["English", "His family was of Welsh heritage.", "Welsh"],
  "French Canadian (Quebec)": ["French Canadian", null, null],
  "Irish-English": ["Irish", "He was of Irish and English parentage.", "Irish"],
  "Metis": ["Métis", null, null],
  "Metis (Cree-Scottish)": ["Métis", "She was of Cree and Scottish parentage.", "Cree"],
  "Mixed (English-Chipewyan)": ["English and Chipewyan (Dene)", null, null],
  "Norse/Icelandic": ["Norse", "He was Icelandic by birth.", "Iceland"],
  "Scottish (Orkney)": ["Scottish", "He came from the Orkney Islands.", "Orkney"],
  "Scottish/Canadian": ["Scottish", "He made his career in Canada.", "Canada"],
  "Spanish (born in Peru)": ["Spanish", "He was born in Peru.", "Peru"],
  "Venetian/Italian (sailing for England)": ["Italian (Venetian)", "He sailed under the English flag.", "England"],
};

const COMPANY: Record<string, string> = {
  "British maritime traders": "British maritime traders",
  "French / North West Company": "French traders / North West Company",
  "French Crown / Multiple Companies": "French Crown / French trading companies",
  "French Crown / North West Company": "French Crown / North West Company",
  "Hudson's Bay Company": "Hudson's Bay Company",
  "Hudson's Bay Company / North West Company": "Hudson's Bay Company / North West Company",
  "North West Company": "North West Company",
  "North West Company / HBC": "North West Company / Hudson's Bay Company",
  "North West Company / Hudson's Bay Company": "North West Company / Hudson's Bay Company",
  "North West Company / Hudson's Bay Company / Pacific Fur Company": "North West Company / Hudson's Bay Company / Pacific Fur Company",
  "North West Company / Hudson's Bay Company / XY Company": "North West Company / Hudson's Bay Company / XY Company",
};

async function main() {
  const locations = await db.location.findMany({ where: { locationType: { in: Object.keys(LOCATION_TYPE) } }, select: { id: true, name: true, locationType: true } });
  const types = await db.waterwayType.findMany({ include: { waterways: { select: { id: true, name: true } } } });
  const lakeLower = types.find((t) => t.name === "lake");
  const lakeUpper = types.find((t) => t.name === "Lake");
  const explorers = await db.explorer.findMany({ where: { nationality: { in: Object.keys(NATIONALITY) } }, select: { id: true, name: true, nationality: true, biography: true } });
  const fur = await db.furTradeInfo.findMany({ select: { id: true, tradingCompany: true, waterway: { select: { name: true } } } });

  const explorerPlan = explorers.map((e) => {
    const [canonical, sentence, keyword] = NATIONALITY[e.nationality!]!;
    const addSentence = sentence && keyword && !e.biography.toLowerCase().includes(keyword.toLowerCase()) ? sentence : null;
    return { id: e.id, name: e.name, from: e.nationality, to: canonical, addSentence };
  });
  const furPlan = fur
    .map((f) => ({ id: f.id, waterway: f.waterway.name, from: f.tradingCompany, to: f.tradingCompany ? COMPANY[f.tradingCompany] ?? null : null }))
    .filter((f) => f.to && f.to !== f.from);
  const unknownCompanies = fur.filter((f) => f.tradingCompany && !(f.tradingCompany in COMPANY)).map((f) => f.tradingCompany);

  const backupFile = writeBackup("2026-10-16-canonical-taxonomies-before", { locations, waterwayTypes: types.map((t) => ({ id: t.id, name: t.name, waterways: t.waterways })), explorers, furTradeInfo: fur });
  report("canonical taxonomies", {
    locationTypes: locations.map((l) => `${l.name}: ${l.locationType} → ${LOCATION_TYPE[l.locationType]}`),
    waterwayType: lakeLower ? { fold: `lake (${lakeLower.id}) → Lake (${lakeUpper?.id})`, waterways: lakeLower.waterways } : "no lower-case lake type",
    nationality: explorerPlan,
    tradingCompany: furPlan,
    unknownCompanies,
    backupFile,
  });
  if (unknownCompanies.length) throw new Error("Unmapped tradingCompany values");
  if (!APPLY) return;

  await db.$transaction(async (tx) => {
    for (const l of locations) await tx.location.update({ where: { id: l.id }, data: { locationType: LOCATION_TYPE[l.locationType]! } });
    if (lakeLower && lakeUpper) {
      await tx.waterway.updateMany({ where: { typeId: lakeLower.id }, data: { typeId: lakeUpper.id } });
      await tx.waterwayType.delete({ where: { id: lakeLower.id } });
    }
    for (const e of explorerPlan) {
      const bio = explorers.find((x) => x.id === e.id)!.biography;
      await tx.explorer.update({ where: { id: e.id }, data: { nationality: e.to, ...(e.addSentence ? { biography: `${bio.trim()} ${e.addSentence}` } : {}) } });
    }
    for (const f of furPlan) await tx.furTradeInfo.update({ where: { id: f.id }, data: { tradingCompany: f.to! } });
  });

  report("verify", {
    locationTypes: await db.location.groupBy({ by: ["locationType"], _count: true }),
    waterwayTypes: (await db.waterwayType.findMany({ include: { _count: { select: { waterways: true } } } })).map((t) => `${t.name}: ${t._count.waterways}`),
    nationalities: (await db.explorer.groupBy({ by: ["nationality"], _count: true })).map((n) => `${n.nationality}: ${n._count}`),
    companies: (await db.furTradeInfo.groupBy({ by: ["tradingCompany"], _count: true })).map((c) => `${c.tradingCompany}: ${c._count}`),
  });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
