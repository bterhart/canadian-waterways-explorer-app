// Historic map overlays: Mercator-ready copies and bounds (2026-10-20).
//   bun run prisma/turso-migrations/2026-10-20-overlays-thompson-mackenzie.ts [--apply]
//
// The app lays a map image over Apple Maps by its south-west and north-east corners, and MapKit
// stretches the image linearly in *Mercator* space. Old sheets are not Mercator: most are plate
// carrée (equal degrees of latitude) and several are trapezoidal (straight meridians converging
// northward). Laid over by their corners alone they land in the wrong place everywhere but at
// the corners; on a 40-70 N sheet a feature at 55 N shows up near 59 N. So each overlay gets its
// own copy on R2 (`historical-maps/<id>/overlay.jpg`), re-projected pixel by pixel from a
// georeferencing model of the sheet into a Mercator rectangle, whose corners are then exact.
//
// The models come from the sheets themselves (scratchpad/georef, 2026-10-20), each checked by
// plotting places of known position on the result:
// - Thompson 1814 (3840x2477 Commons copy): longitude labels along the top and bottom borders
//   read 121 W at x=340 to 84 W at x=3760, 92.5 px per degree and straight, so the sheet is
//   cylindrical. Its latitude labels are lost, so latitude was fitted on places Thompson surveyed
//   himself (Lake Athabasca y=85, Lesser Slave Lake y=790, the south end of Lake Winnipeg y=1690,
//   the west end of Lake Superior y=2170); the spacing grows northward as Mercator's does, so the
//   sheet is used as it is. Edges: 59.44 N, 44.70 N, 124.68 W, 83.16 W.
// - Mackenzie 1801 (1280x733): the title states 40-70 N and 45-180 W, carried by the inner
//   neatline (x 40-1259, y 28-716); plate carrée. Output is the neatline: 40-70 N, 180-45 W.
// - Bellin 1744 (1920x1279): longitudes of Paris along the top (26.8 px per degree, 90 W at
//   x=560) and bottom (43.2 px per degree, 90 W at x=330), so the meridians converge: a
//   trapezoid. Latitudes uniform on the sides, 51 N at y=1075 to 64 N at y=245. Paris is
//   2.337 E of Greenwich. Output is the rectangle inscribed in the neatline: 64.64-49.98 N,
//   89.96-57.76 W.
// - Franklin 1823 (1920x871): longitudes of Greenwich along both borders, 116.6 px per degree,
//   straight; latitude fitted on York Factory (57.0 N at y=20) and Cumberland House (53.95 N
//   at y=640), 203 px per degree. Edges: 57.10-52.81 N, 108.26-91.79 W.
import sharp from "sharp";
import { existsSync, readFileSync } from "node:fs";
import { db } from "../../src/db";
import { uploadImageBuffer } from "../../src/lib/image-cdn";
import { APPLY, writeBackup, report } from "./lib/migration";

interface LatModel { kind: "linear" | "mercator"; y1: number; lat1: number; y2: number; lat2: number }
/** x = xRef(y) + (lon - lonRef) * k(y), xRef and k linear in y between the two anchors (trapezoid; cylindrical when equal). */
interface LonModel { lonRef: number; top: { y: number; x: number; k: number }; bottom: { y: number; x: number; k: number } }
interface Georef { lat: LatModel; lon: LonModel; out: { west: number; east: number; north: number; south: number; width: number; height: number } }
interface OverlaySpec { id: string; title: string; width: number; local?: string; georef: Georef }

const SCRATCH = "/tmp/claude-0/-home-user-canadian-waterways-explorer-app/a896fa2c-efe8-5dcc-9bf2-550a37743753/scratchpad/georef";
const PARIS = 2.337; // Paris meridian east of Greenwich
const parisWest = (lonWestOfParis: number) => -(lonWestOfParis - PARIS);

const SPECS: OverlaySpec[] = [
  {
    id: "cmveuoeu2001d7dwpv140el2r", title: "Thompson 1814", width: 2400, local: `${SCRATCH}/thompson1814.jpg`,
    georef: {
      lat: { kind: "mercator", y1: 85, lat1: 59.0, y2: 2170, lat2: 46.8 },
      lon: { lonRef: -105, top: { y: 0, x: 1820, k: 92.5 }, bottom: { y: 2477, x: 1820, k: 92.5 } },
      out: { west: -124.68, east: -83.16, north: 59.44, south: 44.70, width: 3840, height: 2477 },
    },
  },
  {
    id: "cmveuoeoo00197dwpvg0ilst4", title: "Mackenzie 1801", width: 1280, local: `${SCRATCH}/mackenzie1801.jpg`,
    georef: {
      lat: { kind: "linear", y1: 28, lat1: 70, y2: 716, lat2: 40 },
      lon: { lonRef: -180, top: { y: 28, x: 40, k: 1219 / 135 }, bottom: { y: 716, x: 40, k: 1219 / 135 } },
      out: { west: -180, east: -45, north: 70, south: 40, width: 1219, height: 688 },
    },
  },
  {
    id: "cmveuoe35000v7dwpkzi20b7w", title: "Bellin 1744", width: 1600, local: `${SCRATCH}/bellin1744.jpg`,
    georef: {
      lat: { kind: "linear", y1: 1075, lat1: 51, y2: 245, lat2: 64 },
      lon: { lonRef: parisWest(90), top: { y: 205, x: 560, k: 26.8 }, bottom: { y: 1140, x: 330, k: 43.2 } },
      out: { west: parisWest(92.3), east: parisWest(60.1), north: 64.64, south: 49.98, width: 1920, height: 935 },
    },
  },
  {
    id: "cmveuoez5001h7dwpyr3b2zk7", title: "Franklin 1823", width: 1600, local: `${SCRATCH}/franklin1823.jpg`,
    georef: {
      lat: { kind: "linear", y1: 20, lat1: 57.0, y2: 640, lat2: 53.95 },
      lon: { lonRef: -108, top: { y: 0, x: 30, k: 116.6 }, bottom: { y: 871, x: 30, k: 116.6 } },
      out: { west: -108.26, east: -91.79, north: 57.10, south: 52.81, width: 1920, height: 871 },
    },
  },
];

const merc = (latDeg: number) => Math.log(Math.tan(Math.PI / 4 + (latDeg * Math.PI) / 180 / 2));
const invMerc = (m: number) => ((2 * Math.atan(Math.exp(m)) - Math.PI / 2) * 180) / Math.PI;

async function fetchSource(spec: OverlaySpec, imageUrl: string): Promise<Buffer> {
  if (spec.local && existsSync(spec.local)) return readFileSync(spec.local);
  const url = imageUrl.replace(/\?width=\d+$/, `?width=${spec.width}`);
  for (const delay of [0, 30_000, 60_000, 120_000]) {
    if (delay) await new Promise((r) => setTimeout(r, delay));
    const res = await fetch(url, { headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (overlay copies; bert.terhart@gmail.com)" }, redirect: "follow" });
    if (res.status === 429) { console.log("    rate limited; waiting"); continue; }
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return Buffer.from(await res.arrayBuffer());
  }
  throw new Error(`gave up on ${url}`);
}

/** Source row of a latitude. */
function rowOf(lat: number, m: LatModel): number {
  if (m.kind === "linear") return m.y1 + ((lat - m.lat1) * (m.y2 - m.y1)) / (m.lat2 - m.lat1);
  return m.y1 + ((merc(lat) - merc(m.lat1)) * (m.y2 - m.y1)) / (merc(m.lat2) - merc(m.lat1));
}
/** Source column of a longitude on a given source row. */
function colOf(lon: number, y: number, m: LonModel): number {
  const t = (y - m.top.y) / (m.bottom.y - m.top.y);
  const xRef = m.top.x + t * (m.bottom.x - m.top.x);
  const k = m.top.k + t * (m.bottom.k - m.top.k);
  return xRef + (lon - m.lonRef) * k;
}

/** Re-project the sheet into a Mercator rectangle (bilinear sampling, edges replicated). */
function reproject(raw: Buffer, sw: number, sh: number, ch: number, g: Georef): Buffer {
  const { width: W, height: H, west, east, north, south } = g.out;
  const out = Buffer.alloc(W * H * ch);
  const mN = merc(north), mS = merc(south);
  const clampX = (v: number) => Math.max(0, Math.min(sw - 1, v));
  const clampY = (v: number) => Math.max(0, Math.min(sh - 1, v));
  for (let j = 0; j < H; j++) {
    const lat = invMerc(mN - ((j + 0.5) / H) * (mN - mS));
    const sy = clampY(rowOf(lat, g.lat) - 0.5);
    const y0 = Math.floor(sy), y1 = Math.min(sh - 1, y0 + 1), ty = sy - y0;
    for (let i = 0; i < W; i++) {
      const lon = west + ((i + 0.5) / W) * (east - west);
      const sx = clampX(colOf(lon, sy + 0.5, g.lon) - 0.5);
      const x0 = Math.floor(sx), x1 = Math.min(sw - 1, x0 + 1), tx = sx - x0;
      const a = (y0 * sw + x0) * ch, b = (y0 * sw + x1) * ch, c = (y1 * sw + x0) * ch, d = (y1 * sw + x1) * ch;
      const o = (j * W + i) * ch;
      for (let k = 0; k < ch; k++) {
        const top = raw[a + k]! * (1 - tx) + raw[b + k]! * tx;
        const bot = raw[c + k]! * (1 - tx) + raw[d + k]! * tx;
        out[o + k] = Math.round(top * (1 - ty) + bot * ty);
      }
    }
  }
  return out;
}

async function main() {
  const rows = await db.historicalMap.findMany({ where: { id: { in: SPECS.map((s) => s.id) } }, select: { id: true, title: true, imageUrl: true, boundsSwLat: true, boundsSwLng: true, boundsNeLat: true, boundsNeLng: true } });
  const backupFile = writeBackup("2026-10-20-overlays-before", { maps: rows });
  const plan = SPECS.map((s) => ({ title: s.title, bounds: s.georef.out, source: s.local && existsSync(s.local) ? "local copy" : `Commons at ${s.width}px` }));
  report("overlay copies and bounds", { plan, backupFile });
  if (!APPLY) return;
  const results: Record<string, unknown>[] = [];
  for (const spec of SPECS) {
    const row = rows.find((r) => r.id === spec.id);
    if (!row) throw new Error(`map not found: ${spec.id}`);
    console.log(`  ${row.title}`);
    const source = await fetchSource(spec, row.imageUrl);
    const { data, info } = await sharp(source).rotate().raw().toBuffer({ resolveWithObject: true });
    const g = spec.georef;
    const pixels = reproject(data, info.width, info.height, info.channels, g);
    const jpeg = await sharp(pixels, { raw: { width: g.out.width, height: g.out.height, channels: info.channels } }).jpeg({ quality: 86 }).toBuffer();
    const url = await uploadImageBuffer(jpeg, `historical-maps/${spec.id}/overlay.jpg`);
    await db.historicalMap.update({ where: { id: spec.id }, data: { boundsSwLat: g.out.south, boundsSwLng: g.out.west, boundsNeLat: g.out.north, boundsNeLng: g.out.east } });
    results.push({ title: row.title, source: `${info.width}x${info.height}`, output: `${g.out.width}x${g.out.height}`, bytes: jpeg.length, url });
  }
  report("applied", { results });
  const verify = await db.historicalMap.findMany({ where: { boundsSwLat: { not: null } }, select: { title: true, boundsSwLat: true, boundsSwLng: true, boundsNeLat: true, boundsNeLng: true } });
  report("verify: maps with bounds", { verify });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
