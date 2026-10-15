#!/usr/bin/env bun
// Export waterway geometry from OpenStreetMap as KML, keyed to the waterway's own marker.
//
// Replaces the standalone water_body_kml tool (bterhart/Canadian_Waterways_Explorer), which
// exported every feature with a given name inside one Canada-wide box and so mixed the
// Manitoba Red River with every other Red River on the continent. This exporter:
//   - queries by name, name:en and name:fr (many Canadian rivers carry a French `name`,
//     e.g. the Ottawa River is "Rivière des Outaouais" with name:en "Ottawa River"), or by
//     explicit OSM ids (--osm=relation/123,way/456) when the identity is known;
//   - keeps every OSM node (no simplification) and chains way segments end to end;
//   - applies the continuity guard from clean-waterway-kml.ts: fragments are chained when
//     within --gap-km (100) of each other and only the chain holding the point nearest the
//     marker is kept, so a river that continues into the United States stays whole while
//     namesakes elsewhere are dropped; if the nearest chain is > --max-anchor-km (150) away
//     the export is refused rather than guessed;
//   - writes the KML to generated/kml-exports/<slug>.kml plus a report, and with --apply
//     stores it in Turso (kmlData column only) after backing up the previous KML in full.
//
// Usage (from backend/; TURSO_DATABASE_URL / TURSO_AUTH_TOKEN needed for --waterway-id, --csv rows
// with an id, and --apply):
//   bun run scripts/export-waterway-kml.ts --waterway-id=<id> [--osm-name="Rivière des Outaouais"]
//   bun run scripts/export-waterway-kml.ts --name="Rainy River" --lat=48.6 --lng=-93.4 --type=river
//   bun run scripts/export-waterway-kml.ts --osm=relation/1234567 --waterway-id=<id>
//   bun run scripts/export-waterway-kml.ts --csv=rivers.csv          # displayName,osmName,latitude,longitude,type,waterwayId
//   add --apply to write to Turso; --out-dir=... to change the output folder;
//   --mirror=https://overpass.kumi.systems/api/interpreter to pin a server.
import { createClient, type Client } from "@libsql/client";
import { createHash } from "node:crypto";
import { mkdir, readFile } from "node:fs/promises";
import { parseKmlCoordinateBlocks, type LngLat } from "../src/lib/kml-geometry";
import { decide, rebuildKml, splitPlacemarks } from "./clean-waterway-kml";

// ── options ──────────────────────────────────────────────────────────────────────

type FeatureType = "river" | "lake";

interface Job {
  displayName: string;
  osmName: string | null;
  osmIds: string[]; // e.g. "relation/123", "way/456"
  lat: number;
  lng: number;
  type: FeatureType;
  /** true when --type was not given and the type should come from the Waterway row */
  typeFromDb?: boolean;
  waterwayId: string | null;
}

interface Options {
  jobs: Job[];
  apply: boolean;
  gapKm: number;
  maxAnchorKm: number;
  outDir: string;
  mirror: string | null;
  needsDb: boolean;
}

const MIRRORS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];
// Query extent: North America. This is a cost limit on the query, not a selection rule; the
// continuity guard decides what is kept.
const QUERY_BBOX = "24,-170,84,-50";
const OVERPASS_TIMEOUT_S = 180;

function arg(argv: string[], key: string): string | undefined {
  const hit = argv.find((a) => a.startsWith(`--${key}=`));
  return hit ? hit.slice(key.length + 3) : undefined;
}

export function guessType(name: string): FeatureType {
  return /\b(lake|lac|reservoir|pond|étang|lagoon|bay|baie|gulf|golfe|sound|strait|détroit|inlet|basin|channel)\b/i.test(name) ? "lake" : "river";
}

/** Display names may carry a disambiguating suffix the map data does not: "Red Deer River (Alberta)". */
export function osmNameFromDisplay(name: string): string {
  return name.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

async function parseOptions(argv: string[]): Promise<Options> {
  const apply = argv.includes("--apply");
  const gapKm = Number(arg(argv, "gap-km") ?? 100);
  const maxAnchorKm = Number(arg(argv, "max-anchor-km") ?? 150);
  const outDir = arg(argv, "out-dir") ?? `${import.meta.dir}/../generated/kml-exports`;
  const mirror = arg(argv, "mirror") ?? null;
  const jobs: Job[] = [];
  let needsDb = apply;

  const csvPath = arg(argv, "csv");
  const waterwayId = arg(argv, "waterway-id") ?? null;
  const osmIds = (arg(argv, "osm") ?? "").split(",").map((s) => s.trim()).filter(Boolean);

  if (csvPath) {
    needsDb = true;
    const text = await readFile(csvPath, "utf8");
    for (const row of parseCsv(text)) {
      const get = (k: string) => row[k]?.trim() ?? "";
      if (!get("displayName")) continue;
      const lat = Number(get("latitude")), lng = Number(get("longitude"));
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new Error(`CSV row "${get("displayName")}" needs numeric latitude and longitude`);
      jobs.push({
        displayName: get("displayName"),
        osmName: get("osmName") || osmNameFromDisplay(get("displayName")),
        osmIds: get("osmIds").split(/[;|]/).map((s) => s.trim()).filter(Boolean),
        lat, lng,
        type: (get("type") as FeatureType) || guessType(get("displayName")),
        waterwayId: get("waterwayId") || null,
      });
    }
  } else if (waterwayId) {
    needsDb = true;
    // name/lat/lng come from Turso; filled in main()
    jobs.push({
      displayName: "", osmName: arg(argv, "osm-name") ?? null, osmIds,
      lat: NaN, lng: NaN, type: (arg(argv, "type") as FeatureType) ?? "river", typeFromDb: !arg(argv, "type"), waterwayId,
    });
  } else {
    const name = arg(argv, "name");
    const lat = Number(arg(argv, "lat")), lng = Number(arg(argv, "lng"));
    if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new Error("Give --waterway-id=<id>, or --name=... --lat=... --lng=..., or --csv=<path>");
    }
    jobs.push({
      displayName: name, osmName: arg(argv, "osm-name") ?? osmNameFromDisplay(name), osmIds,
      lat, lng, type: (arg(argv, "type") as FeatureType) ?? guessType(name), waterwayId: null,
    });
  }
  for (const j of jobs) if (j.type !== "river" && j.type !== "lake") throw new Error(`type must be river or lake (got ${j.type})`);
  return { jobs, apply, gapKm, maxAnchorKm, outDir, mirror, needsDb };
}

export function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const split = (line: string) => {
    const out: string[] = [];
    let cur = "", quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { if (quoted && line[i + 1] === '"') { cur += '"'; i++; } else quoted = !quoted; }
      else if (ch === "," && !quoted) { out.push(cur); cur = ""; }
      else cur += ch;
    }
    out.push(cur);
    return out;
  };
  const header = split(lines[0]!).map((h) => h.trim());
  return lines.slice(1).map((l) => Object.fromEntries(split(l).map((v, i) => [header[i] ?? `col${i}`, v])));
}

// ── Overpass ─────────────────────────────────────────────────────────────────────

interface OsmElement {
  type: "node" | "way" | "relation";
  id: number;
  tags?: Record<string, string>;
  geometry?: { lat: number; lon: number }[];
  members?: { type: string; ref: number; role: string; geometry?: { lat: number; lon: number }[] }[];
}

export function buildQuery(job: Job): string {
  if (job.osmIds.length) {
    const parts = job.osmIds.map((s) => {
      const [t, id] = s.split("/");
      if (!/^(relation|way)$/.test(t ?? "") || !/^\d+$/.test(id ?? "")) throw new Error(`--osm entries look like relation/123 or way/456 (got ${s})`);
      return `  ${t}(${id});`;
    });
    return `[out:json][timeout:${OVERPASS_TIMEOUT_S}];\n(\n${parts.join("\n")}\n);\nout geom;`;
  }
  const escaped = (job.osmName ?? job.displayName).replace(/"/g, '\\"');
  const tags = job.type === "river"
    ? ['["waterway"="river"]', '["waterway"="stream"]', '["waterway"="canal"]']
    : ['["natural"="water"]', '["landuse"="reservoir"]', '["natural"="bay"]', '["natural"="strait"]', '["place"="sea"]', '["place"="ocean"]'];
  const clauses: string[] = [];
  for (const nameKey of ["name", "name:en", "name:fr"]) {
    for (const tag of tags) {
      clauses.push(`  relation["${nameKey}"="${escaped}"]${tag}(${QUERY_BBOX});`);
      clauses.push(`  way["${nameKey}"="${escaped}"]${tag}(${QUERY_BBOX});`);
    }
  }
  return `[out:json][timeout:${OVERPASS_TIMEOUT_S}];\n(\n${clauses.join("\n")}\n);\nout geom;`;
}

async function overpass(query: string, mirror: string | null): Promise<OsmElement[]> {
  const servers = mirror ? [mirror] : MIRRORS;
  const delays = [3000, 8000, 15000];
  let lastError = "";
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    for (const url of servers) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded", "user-agent": "canadian-waterways-explorer/export-waterway-kml (educational)" },
          body: `data=${encodeURIComponent(query)}`,
          signal: AbortSignal.timeout((OVERPASS_TIMEOUT_S + 30) * 1000),
        });
        const text = await res.text();
        if (!res.ok) { lastError = `${url} -> HTTP ${res.status}`; continue; }
        const json = JSON.parse(text);
        if (json.remark && /timed out|runtime error/i.test(json.remark)) { lastError = `${url} -> ${json.remark}`; continue; }
        return json.elements as OsmElement[];
      } catch (e) {
        lastError = `${url} -> ${(e as Error).message}`;
      }
    }
    if (attempt < delays.length) {
      console.log(`    overpass: ${lastError}; retrying in ${delays[attempt]! / 1000}s`);
      await Bun.sleep(delays[attempt]!);
    }
  }
  throw new Error(`Overpass failed on every mirror: ${lastError}`);
}

// ── geometry → KML ───────────────────────────────────────────────────────────────

type Seg = LngLat[];
const key = (p: LngLat) => `${p[0]},${p[1]}`;

/** Chain way segments end to end into the fewest polylines (segments may be reversed). */
export function chainSegments(segments: Seg[]): Seg[] {
  const segs = segments.filter((s) => s.length >= 2).map((s) => [...s]);
  const used = new Array<boolean>(segs.length).fill(false);
  const byEnd = new Map<string, number[]>();
  segs.forEach((s, i) => {
    for (const k of [key(s[0]!), key(s[s.length - 1]!)]) byEnd.set(k, [...(byEnd.get(k) ?? []), i]);
  });
  const take = (k: string): number | null => {
    for (const i of byEnd.get(k) ?? []) if (!used[i]) return i;
    return null;
  };
  const chains: Seg[] = [];
  for (let start = 0; start < segs.length; start++) {
    if (used[start]) continue;
    used[start] = true;
    let chain = segs[start]!;
    // extend forward
    for (;;) {
      const j = take(key(chain[chain.length - 1]!));
      if (j === null) break;
      used[j] = true;
      const s = segs[j]!;
      chain = key(s[0]!) === key(chain[chain.length - 1]!) ? chain.concat(s.slice(1)) : chain.concat([...s].reverse().slice(1));
    }
    // extend backward
    for (;;) {
      const j = take(key(chain[0]!));
      if (j === null) break;
      used[j] = true;
      const s = segs[j]!;
      chain = key(s[s.length - 1]!) === key(chain[0]!) ? s.slice(0, -1).concat(chain) : [...s].reverse().slice(0, -1).concat(chain);
    }
    chains.push(chain);
  }
  return chains;
}

const coordsOf = (g: { lat: number; lon: number }[] | undefined): Seg => (g ?? []).map((p) => [p.lon, p.lat] as LngLat);
const fmt = (seg: Seg) => seg.map(([lng, lat]) => `${lng},${lat},0`).join(" ");
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const closeRing = (s: Seg): Seg => (s.length && key(s[0]!) !== key(s[s.length - 1]!) ? [...s, s[0]!] : s);

export function buildKml(displayName: string, type: FeatureType, elements: OsmElement[]): { kml: string; placemarks: number; sourceIds: string[] } {
  const sourceIds = elements.map((e) => `${e.type}/${e.id}`);
  const pm: string[] = [];
  if (type === "river") {
    const segs: Seg[] = [];
    for (const el of elements) {
      if (el.type === "way") segs.push(coordsOf(el.geometry));
      else if (el.type === "relation") for (const m of el.members ?? []) if (m.type === "way") segs.push(coordsOf(m.geometry));
    }
    chainSegments(segs).forEach((chain, i) => {
      pm.push(`    <Placemark>\n      <name>${esc(i === 0 ? displayName : `${displayName} (${i + 1})`)}</name>\n      <styleUrl>#riverStyle</styleUrl>\n      <LineString>\n        <tessellate>1</tessellate>\n        <coordinates>${fmt(chain)}</coordinates>\n      </LineString>\n    </Placemark>`);
    });
  } else {
    let i = 0;
    const polygon = (outer: Seg, inners: Seg[]) => {
      const innerXml = inners.map((r) => `\n        <innerBoundaryIs><LinearRing><coordinates>${fmt(closeRing(r))}</coordinates></LinearRing></innerBoundaryIs>`).join("");
      pm.push(`    <Placemark>\n      <name>${esc(i === 0 ? displayName : `${displayName} (${i + 1})`)}</name>\n      <styleUrl>#lakeStyle</styleUrl>\n      <Polygon>\n        <tessellate>1</tessellate>\n        <outerBoundaryIs><LinearRing><coordinates>${fmt(closeRing(outer))}</coordinates></LinearRing></outerBoundaryIs>${innerXml}\n      </Polygon>\n    </Placemark>`);
      i += 1;
    };
    for (const el of elements) {
      if (el.type === "way") {
        const c = coordsOf(el.geometry);
        if (c.length >= 3) polygon(c, []);
      } else if (el.type === "relation") {
        const outers = chainSegments((el.members ?? []).filter((m) => m.type === "way" && m.role === "outer").map((m) => coordsOf(m.geometry)));
        const inners = chainSegments((el.members ?? []).filter((m) => m.type === "way" && m.role === "inner").map((m) => coordsOf(m.geometry)));
        outers.forEach((o, idx) => polygon(o, idx === 0 ? inners : []));
      }
    }
  }
  const style = type === "river"
    ? `    <Style id="riverStyle">\n      <LineStyle><color>ffE99B3D</color><width>3</width></LineStyle>\n      <PolyStyle><fill>0</fill></PolyStyle>\n    </Style>`
    : `    <Style id="lakeStyle">\n      <LineStyle><color>ffE99B3D</color><width>2</width></LineStyle>\n      <PolyStyle><color>60E99B3D</color><fill>1</fill></PolyStyle>\n    </Style>`;
  const kml = `<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2">\n  <Document>\n    <name>${esc(displayName)}</name>\n    <description>Source: OpenStreetMap (ODbL) via Overpass, ${new Date().toISOString().slice(0, 10)}; elements ${esc(sourceIds.join(" "))}</description>\n${style}\n${pm.join("\n")}\n  </Document>\n</kml>\n`;
  return { kml, placemarks: pm.length, sourceIds };
}

export const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
const RELATED_TABLES = ["ExplorerWaterway", "Location", "ArchaeologicalDiscovery", "FurTradeInfo", "UserContribution"];

// ── main ─────────────────────────────────────────────────────────────────────────

async function main() {
  const opt = await parseOptions(process.argv.slice(2));
  let turso: Client | null = null;
  if (opt.needsDb) {
    const url = process.env.TURSO_DATABASE_URL, authToken = process.env.TURSO_AUTH_TOKEN;
    if (!url || !authToken) throw new Error("TURSO_DATABASE_URL / TURSO_AUTH_TOKEN not set");
    turso = createClient({ url, authToken });
  }
  await mkdir(opt.outDir, { recursive: true });

  const results: Record<string, unknown>[] = [];
  const pending: { job: Job; kml: string; previous: string | null }[] = [];

  for (const job of opt.jobs) {
    if (job.waterwayId && turso) {
      const r = await turso.execute({
        sql: "SELECT w.name, w.latitude, w.longitude, w.kmlData, t.name AS typeName FROM Waterway w JOIN WaterwayType t ON t.id = w.typeId WHERE w.id = ?",
        args: [job.waterwayId],
      });
      if (!r.rows.length) throw new Error(`No waterway with id ${job.waterwayId}`);
      const row = r.rows[0] as Record<string, unknown>;
      if (!job.displayName) job.displayName = String(row.name);
      // Lakes, bays, gulfs, sounds, straits and inlets are polygons in OSM; rivers are lines
      if (job.typeFromDb) job.type = guessType(`${String(row.typeName)} ${job.displayName}`);
      if (!Number.isFinite(job.lat)) { job.lat = Number(row.latitude); job.lng = Number(row.longitude); }
      if (!job.osmName) job.osmName = osmNameFromDisplay(job.displayName);
      (job as Job & { previous?: string | null }).previous = row.kmlData === null ? null : String(row.kmlData);
    }
    console.log(`\n### ${job.displayName}  (${job.type}; query ${job.osmIds.length ? job.osmIds.join(",") : `"${job.osmName}"`}; anchor ${job.lng.toFixed(2)}, ${job.lat.toFixed(2)})`);

    const elements = await overpass(buildQuery(job), opt.mirror);
    const drawable = elements.filter((e) => e.type !== "node");
    console.log(`    overpass returned ${drawable.length} elements (${drawable.filter((e) => e.type === "relation").length} relations, ${drawable.filter((e) => e.type === "way").length} ways)`);
    if (!drawable.length) { results.push({ name: job.displayName, status: "no-osm-match" }); console.log("    nothing found — check the OSM spelling (name, name:en, name:fr) or pass --osm=relation/<id>"); continue; }

    const built = buildKml(job.displayName, job.type, drawable);
    const frags = splitPlacemarks(built.kml);
    const decision = decide(frags, [job.lng, job.lat], opt.gapKm, opt.maxAnchorKm);
    if (decision.status === "no-canadian-river" || decision.status === "no-coordinates") {
      console.log(`    REFUSED: nearest chain is ${Math.round(decision.anchorKm)} km from the anchor (> ${opt.maxAnchorKm})`);
      for (const ch of decision.chains.slice(0, 6)) console.log(`      chain ${ch.points} pts at ${Math.round(ch.kmFromMarker)} km, bbox ${JSON.stringify(ch.bbox)}`);
      results.push({ name: job.displayName, status: "refused", anchorKm: decision.anchorKm });
      continue;
    }
    const kml = decision.dropIdx.length ? rebuildKml(built.kml, frags, decision.dropIdx) : built.kml;
    const points = parseKmlCoordinateBlocks(kml).flat().length;
    const kept = decision.chains[0]!;
    console.log(`    keep ${kept.idx.length} placemarks / ${points} pts, bbox ${JSON.stringify(kept.bbox)}, ${Math.round(decision.anchorKm)} km from anchor`);
    for (const ch of decision.chains.slice(1)) console.log(`    drop ${ch.idx.length} placemarks / ${ch.points} pts at ${Math.round(ch.kmFromMarker)} km, bbox ${JSON.stringify(ch.bbox)}`);

    const file = `${opt.outDir}/${slug(job.displayName)}.kml`;
    await Bun.write(file, kml);
    const previous = (job as Job & { previous?: string | null }).previous ?? null;
    if (previous !== null) {
      const prevPts = parseKmlCoordinateBlocks(previous).flat().length;
      console.log(`    current KML in Turso: ${previous.length} bytes / ${prevPts} pts -> new ${kml.length} bytes / ${points} pts`);
    }
    console.log(`    written ${file}`);
    results.push({ name: job.displayName, status: "exported", file, points, placemarks: kept.idx.length, bbox: kept.bbox, sourceIds: built.sourceIds, waterwayId: job.waterwayId });
    if (job.waterwayId) pending.push({ job, kml, previous });
  }

  await Bun.write(`${opt.outDir}/export-report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 1));
  console.log(`\nReport: ${opt.outDir}/export-report.json`);

  if (!opt.apply) { if (pending.length) console.log(`Dry run: ${pending.length} waterway(s) would be updated in Turso. Re-run with --apply to write.`); return; }
  if (!turso || !pending.length) return;

  const stamp = new Date().toISOString().slice(0, 10);
  const backupDir = `${import.meta.dir}/../prisma/turso-migrations/backups`;
  await mkdir(backupDir, { recursive: true });
  const backupPath = `${backupDir}/${stamp}-waterway-kml-replaced.json`;
  let existing: unknown[] = [];
  try { existing = JSON.parse(await readFile(backupPath, "utf8")); } catch { /* first write today */ }
  await Bun.write(backupPath, JSON.stringify([
    ...existing,
    ...pending.map((p) => ({ id: p.job.waterwayId, name: p.job.displayName, replacedAt: new Date().toISOString(), previousSha256: p.previous === null ? null : sha256(p.previous), previousKml: p.previous, newSha256: sha256(p.kml) })),
  ], null, 1));
  console.log(`Backup written: ${backupPath}`);

  for (const p of pending) {
    const id = p.job.waterwayId!;
    const counts = async () => { const c: Record<string, number> = {}; for (const t of RELATED_TABLES) c[t] = Number((await turso!.execute({ sql: `SELECT COUNT(*) AS n FROM ${t} WHERE waterwayId = ?`, args: [id] })).rows[0]!.n); return JSON.stringify(c); };
    const cols = async () => { const r = (await turso!.execute({ sql: "SELECT * FROM Waterway WHERE id = ?", args: [id] })).rows[0] as Record<string, unknown>; const { kmlData: _k, updatedAt: _u, ...rest } = r; return JSON.stringify(rest); };
    const [c0, k0] = [await counts(), await cols()];
    await turso.execute({ sql: "UPDATE Waterway SET kmlData = ? WHERE id = ?", args: [p.kml, id] });
    const stored = String((await turso.execute({ sql: "SELECT kmlData FROM Waterway WHERE id = ?", args: [id] })).rows[0]!.kmlData);
    const ok = sha256(stored) === sha256(p.kml) && (await counts()) === c0 && (await cols()) === k0;
    console.log(`${ok ? "applied " : "MISMATCH"} ${p.job.displayName}: ${stored.length} bytes; related rows ${c0}`);
    if (!ok) process.exit(1);
  }
  console.log("Done. Rebuild generated/river-overview.json (--types=River) and redeploy so the geometry cache clears.");
}

if (import.meta.main) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
