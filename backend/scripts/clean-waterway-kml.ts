#!/usr/bin/env bun
// Remove detached namesake fragments from waterway KML in Turso.
//
// Background: the KML was exported from OpenStreetMap by *name* inside a bounding box
// that covers Canada and the northern United States, so a file called "Red River"
// holds every feature with that name on the continent. Those far-away fragments make
// the map's fit-to-boundary zoom frame the whole country.
//
// Rule (continuity with the anchor, never a political border):
//   1. Split the KML into its <Placemark> elements, keeping each one's exact text.
//   2. Chain placemarks whose points come within --gap-km of each other (default 100).
//   3. Keep the chain that holds the point nearest the waterway's own marker, whole.
//      Rivers that continue into the United States stay in one chain and are kept.
//   4. If even the nearest chain is farther than --max-anchor-km (default 150) from the
//      marker, the Canadian river is not in the file at all: report and skip.
//
// Fidelity: kept placemarks are copied byte for byte (the new KML is the original with
// dropped spans deleted); nothing is re-encoded or simplified. The script verifies the
// kept point count and that every other column and every related row is unchanged.
// Reversibility: the backup stores every dropped placemark's full text plus the SHA-256
// and length of the original KML, so re-inserting them restores the original exactly.
//
// Usage (from backend/, with TURSO_DATABASE_URL / TURSO_AUTH_TOKEN in the env):
//   bun run scripts/clean-waterway-kml.ts                      # dry run, all waterways
//   bun run scripts/clean-waterway-kml.ts --only=<id>[,<id>]   # dry run, some
//   bun run scripts/clean-waterway-kml.ts --apply              # backup, write, verify
//   options: --gap-km=100 --max-anchor-km=150
import { createClient } from "@libsql/client";
import { createHash } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { parseKmlCoordinateBlocks, type LngLat } from "../src/lib/kml-geometry";

interface Options {
  apply: boolean;
  gapKm: number;
  maxAnchorKm: number;
  only: Set<string> | null;
}

function parseArgs(argv: string[]): Options {
  const o: Options = { apply: false, gapKm: 100, maxAnchorKm: 150, only: null };
  for (const a of argv) {
    if (a === "--apply") o.apply = true;
    else if (a.startsWith("--gap-km=")) o.gapKm = Number(a.slice(9));
    else if (a.startsWith("--max-anchor-km=")) o.maxAnchorKm = Number(a.slice(16));
    else if (a.startsWith("--only=")) o.only = new Set(a.slice(7).split(",").map((s) => s.trim()).filter(Boolean));
    else throw new Error(`Unknown argument ${a}`);
  }
  if (!Number.isFinite(o.gapKm) || o.gapKm <= 0) throw new Error("--gap-km must be > 0");
  if (!Number.isFinite(o.maxAnchorKm) || o.maxAnchorKm <= 0) throw new Error("--max-anchor-km must be > 0");
  return o;
}

// ── geometry helpers ─────────────────────────────────────────────────────────────

const EARTH_KM = 6371;
export function haversineKm(a: LngLat, b: LngLat): number {
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[1] * Math.PI) / 180) * Math.cos((b[1] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export interface Fragment {
  /** exact text of the <Placemark>…</Placemark> element */
  text: string;
  start: number;
  end: number;
  points: LngLat[];
}

/** Every <Placemark> element with its exact character span. */
export function splitPlacemarks(kml: string): Fragment[] {
  const out: Fragment[] = [];
  const re = /<Placemark\b[\s\S]*?<\/Placemark>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(kml)) !== null) {
    out.push({
      text: m[0],
      start: m.index,
      end: m.index + m[0].length,
      points: parseKmlCoordinateBlocks(m[0]).flat(),
    });
  }
  return out;
}

/**
 * Union fragments whose points fall in the same or neighbouring grid cells, with the cell
 * size equal to the gap. Two fragments closer than gapKm are then always chained (they
 * share or neighbour a cell); fragments farther than 2*gapKm never are. Exact enough for
 * telling a river's reaches (tens of km apart at most) from namesakes (hundreds of km).
 */
export function chainFragments(frags: Fragment[], gapKm: number): number[] {
  const parent = frags.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const union = (a: number, b: number) => {
    const ra = find(a), rb = find(b);
    if (ra !== rb) parent[rb] = ra;
  };
  const latStep = gapKm / 111;
  const owner = new Map<string, number>();
  for (let i = 0; i < frags.length; i++) {
    for (const [lng, lat] of frags[i].points) {
      const lngStep = latStep / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
      const cx = Math.floor(lng / lngStep), cy = Math.floor(lat / latStep);
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const key = `${cx + dx}:${cy + dy}`;
          const j = owner.get(key);
          if (j === undefined) {
            if (dx === 0 && dy === 0) owner.set(key, i);
          } else if (j !== i) {
            union(i, j);
          }
        }
      }
      if (!owner.has(`${cx}:${cy}`)) owner.set(`${cx}:${cy}`, i);
    }
  }
  return frags.map((_, i) => find(i));
}

export interface Decision {
  keepIdx: number[];
  dropIdx: number[];
  chains: { idx: number[]; points: number; kmFromMarker: number; bbox: number[] }[];
  anchorKm: number;
  status: "clean" | "cleaned" | "no-canadian-river" | "no-coordinates";
}

export function decide(frags: Fragment[], marker: LngLat, gapKm: number, maxAnchorKm: number): Decision {
  const withPoints = frags.map((f, i) => i).filter((i) => frags[i].points.length > 0);
  if (withPoints.length === 0) return { keepIdx: [], dropIdx: [], chains: [], anchorKm: Infinity, status: "no-coordinates" };
  const roots = chainFragments(frags, gapKm);
  const groups = new Map<number, number[]>();
  for (const i of withPoints) groups.set(roots[i], [...(groups.get(roots[i]) ?? []), i]);
  const chains = [...groups.values()].map((idx) => {
    let best = Infinity;
    const b = [Infinity, Infinity, -Infinity, -Infinity];
    let points = 0;
    for (const i of idx) {
      for (const p of frags[i].points) {
        best = Math.min(best, haversineKm(p, marker));
        b[0] = Math.min(b[0], p[0]); b[1] = Math.min(b[1], p[1]); b[2] = Math.max(b[2], p[0]); b[3] = Math.max(b[3], p[1]);
      }
      points += frags[i].points.length;
    }
    // A marker placed in open water (Hudson Bay, Baffin Bay) can be 200+ km from the nearest
    // shoreline point while sitting squarely inside the outline: count that as distance 0.
    const inside = marker[0] >= b[0] && marker[0] <= b[2] && marker[1] >= b[1] && marker[1] <= b[3];
    return { idx, points, kmFromMarker: inside ? 0 : best, bbox: b.map((v) => +v.toFixed(2)) };
  }).sort((a, c) => a.kmFromMarker - c.kmFromMarker);
  const anchor = chains[0];
  if (anchor.kmFromMarker > maxAnchorKm) {
    return { keepIdx: [], dropIdx: [], chains, anchorKm: anchor.kmFromMarker, status: "no-canadian-river" };
  }
  const keep = new Set(anchor.idx);
  // Placemarks without coordinates (styles, folders' text) are kept so the document stays intact.
  for (let i = 0; i < frags.length; i++) if (frags[i].points.length === 0) keep.add(i);
  const dropIdx = frags.map((_, i) => i).filter((i) => !keep.has(i));
  return { keepIdx: [...keep].sort((a, b) => a - b), dropIdx, chains, anchorKm: anchor.kmFromMarker, status: dropIdx.length ? "cleaned" : "clean" };
}

/** Original text with the dropped spans deleted; kept spans are untouched. */
export function rebuildKml(kml: string, frags: Fragment[], dropIdx: number[]): string {
  const drops = dropIdx.map((i) => frags[i]).sort((a, b) => a.start - b.start);
  let out = "";
  let cursor = 0;
  for (const d of drops) {
    out += kml.slice(cursor, d.start);
    cursor = d.end;
    // swallow the line break that followed the dropped element so no blank lines pile up
    if (kml[cursor] === "\n") cursor += 1;
  }
  return out + kml.slice(cursor);
}

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
const RELATED_TABLES = ["ExplorerWaterway", "Location", "ArchaeologicalDiscovery", "FurTradeInfo", "UserContribution"];

async function main() {
  const opt = parseArgs(process.argv.slice(2));
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) throw new Error("TURSO_DATABASE_URL / TURSO_AUTH_TOKEN not set");
  const turso = createClient({ url, authToken });

  const rows = (await turso.execute(
    "SELECT id, name, latitude, longitude, regionName FROM Waterway WHERE kmlData IS NOT NULL ORDER BY name"
  )).rows as unknown as { id: string; name: string; latitude: number; longitude: number; regionName: string }[];

  const relatedCounts = async (id: string) => {
    const counts: Record<string, number> = {};
    for (const t of RELATED_TABLES) {
      const r = await turso.execute({ sql: `SELECT COUNT(*) AS n FROM ${t} WHERE waterwayId = ?`, args: [id] });
      counts[t] = Number(r.rows[0]!.n);
    }
    return counts;
  };
  const otherColumns = async (id: string) => {
    const r = await turso.execute({ sql: "SELECT * FROM Waterway WHERE id = ?", args: [id] });
    const row = { ...(r.rows[0] as Record<string, unknown>) };
    delete row.kmlData;
    delete row.updatedAt;
    return JSON.stringify(row);
  };

  const plan: {
    id: string; name: string; original: string; newKml: string; decision: Decision; frags: Fragment[];
  }[] = [];
  const skipped: string[] = [];

  for (const w of rows) {
    if (opt.only && !opt.only.has(w.id)) continue;
    const kmlRow = await turso.execute({ sql: "SELECT kmlData FROM Waterway WHERE id = ?", args: [w.id] });
    const original = String(kmlRow.rows[0]!.kmlData);
    const frags = splitPlacemarks(original);
    const decision = decide(frags, [w.longitude, w.latitude], opt.gapKm, opt.maxAnchorKm);
    const head = `${w.name} [${w.regionName}] id=${w.id} marker=(${w.longitude.toFixed(2)}, ${w.latitude.toFixed(2)}) placemarks=${frags.length}`;
    if (decision.status === "clean") { console.log(`OK        ${head} — one chain, nothing to do`); continue; }
    if (decision.status === "no-coordinates") { console.log(`EMPTY     ${head}`); skipped.push(w.name); continue; }
    if (decision.status === "no-canadian-river") {
      console.log(`SKIP      ${head}`);
      console.log(`          nearest chain is ${Math.round(decision.anchorKm)} km from the marker (> ${opt.maxAnchorKm}); the Canadian river is not in this file. Re-export needed.`);
      for (const ch of decision.chains.slice(0, 6)) console.log(`          chain ${ch.points} pts at ${Math.round(ch.kmFromMarker)} km, bbox ${JSON.stringify(ch.bbox)}`);
      skipped.push(w.name);
      continue;
    }
    const newKml = rebuildKml(original, frags, decision.dropIdx);
    // Fidelity check: kept placemark text is byte-identical and the point count adds up
    const keptPoints = decision.keepIdx.reduce((n, i) => n + frags[i].points.length, 0);
    const droppedPoints = decision.dropIdx.reduce((n, i) => n + frags[i].points.length, 0);
    const reparsed = parseKmlCoordinateBlocks(newKml).flat().length;
    const originalPoints = parseKmlCoordinateBlocks(original).flat().length;
    for (const i of decision.keepIdx) {
      if (!newKml.includes(frags[i].text)) throw new Error(`${w.name}: kept placemark ${i} is not present verbatim in the rebuilt KML`);
    }
    if (reparsed !== keptPoints || keptPoints + droppedPoints !== originalPoints) {
      throw new Error(`${w.name}: point count mismatch (original ${originalPoints}, kept ${keptPoints}, dropped ${droppedPoints}, reparsed ${reparsed})`);
    }
    console.log(`CLEAN     ${head}`);
    console.log(`          keep ${decision.chains[0].idx.length} placemarks / ${keptPoints} pts (anchor chain ${Math.round(decision.anchorKm)} km from marker, bbox ${JSON.stringify(decision.chains[0].bbox)})`);
    for (const ch of decision.chains.slice(1)) {
      console.log(`          drop ${ch.idx.length} placemarks / ${ch.points} pts at ${Math.round(ch.kmFromMarker)} km, bbox ${JSON.stringify(ch.bbox)}`);
    }
    console.log(`          KML ${original.length} -> ${newKml.length} bytes`);
    plan.push({ id: w.id, name: w.name, original, newKml, decision, frags });
  }

  console.log(`\n${plan.length} waterways to clean; ${skipped.length} skipped (${skipped.join(", ") || "none"})`);
  if (!opt.apply) { console.log("Dry run only. Re-run with --apply to write."); return; }
  if (plan.length === 0) return;

  // Backup: dropped placemarks verbatim + hash/length of the original, enough to restore exactly.
  const stamp = new Date().toISOString().slice(0, 10);
  const dir = `${import.meta.dir}/../prisma/turso-migrations/backups`;
  await mkdir(dir, { recursive: true });
  const backupPath = `${dir}/${stamp}-waterway-kml-dropped-fragments.json`;
  await Bun.write(backupPath, JSON.stringify(plan.map((p) => ({
    id: p.id, name: p.name,
    originalSha256: sha256(p.original), originalLength: p.original.length,
    cleanedSha256: sha256(p.newKml), cleanedLength: p.newKml.length,
    droppedPlacemarks: p.decision.dropIdx.map((i) => ({ start: p.frags[i].start, text: p.frags[i].text })),
  })), null, 1));
  console.log(`Backup written: ${backupPath}`);

  for (const p of plan) {
    const beforeCounts = await relatedCounts(p.id);
    const beforeCols = await otherColumns(p.id);
    await turso.execute({ sql: "UPDATE Waterway SET kmlData = ? WHERE id = ?", args: [p.newKml, p.id] });
    const after = await turso.execute({ sql: "SELECT kmlData FROM Waterway WHERE id = ?", args: [p.id] });
    const stored = String(after.rows[0]!.kmlData);
    const afterCounts = await relatedCounts(p.id);
    const afterCols = await otherColumns(p.id);
    const ok = sha256(stored) === sha256(p.newKml)
      && JSON.stringify(beforeCounts) === JSON.stringify(afterCounts)
      && beforeCols === afterCols;
    console.log(`${ok ? "applied " : "MISMATCH"} ${p.name}: stored ${stored.length} bytes; related rows ${JSON.stringify(afterCounts)}`);
    if (!ok) process.exit(1);
  }
  console.log("Done. Rebuild generated/river-overview.json and redeploy so the geometry cache clears.");
}

if (import.meta.main) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
