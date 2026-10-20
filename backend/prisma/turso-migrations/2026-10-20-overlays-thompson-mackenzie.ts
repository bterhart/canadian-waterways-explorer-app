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
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { db } from "../../src/db";
import { uploadImageBuffer } from "../../src/lib/image-cdn";
import { APPLY, writeBackup, report } from "./lib/migration";

interface LatModel { kind: "linear" | "mercator"; y1: number; lat1: number; y2: number; lat2: number }
/** x = xRef(y) + (lon - lonRef) * k(y), xRef and k linear in y between the two anchors (trapezoid; cylindrical when equal). */
interface LonModel { lonRef: number; top: { y: number; x: number; k: number }; bottom: { y: number; x: number; k: number } }
/**
 * Conic sheet: parallels are arcs of circles about centre (xc, yc) with radius rho(lat) = r0 + s * (lat0 - lat);
 * meridians are straight rays from an apex (xa, ya) at angle n * (lonC - lon) from the downward vertical
 * (lon in degrees, negative west; the apex and the centre may differ, as they do on Arrowsmith's sheet).
 */
interface ConicModel { xa: number; ya: number; n: number; lonC: number; xc: number; yc: number; r0: number; lat0: number; s: number }
interface Georef {
  lat?: LatModel; lon?: LonModel; conic?: ConicModel;
  out: { west: number; east: number; north: number; south: number; width: number; height: number };
}
interface OverlaySpec { id: string; title: string; width: number; local?: string; georef: Georef }

const SCRATCH = "/tmp/claude-0/-home-user-canadian-waterways-explorer-app/a896fa2c-efe8-5dcc-9bf2-550a37743753/scratchpad/georef";
const PARIS = 2.337; // Paris meridian east of Greenwich
const parisWest = (lonWestOfParis: number) => -(lonWestOfParis - PARIS);
// Prime meridians of the 17th-century sheets. Each sheet counts longitude east of "Ferro", but
// where that meridian lay in practice differs by a dozen degrees from sheet to sheet (Jaillot draws
// Quebec at 317.7, Sanson at 305.4), so each is fixed by placing one well-surveyed anchor where the
// sheet draws it, as Lahontan's was on Michilimackinac. The value is what to subtract from a sheet
// longitude to get a Greenwich longitude; 382.34 would be Ferro at 20 W of Paris.
const PM_JAILLOT = 389.1; // Quebec (71.2 W) drawn at 317.9
const PM_SANSON = 376.6; // Quebec drawn at 305.4
const PM_CORONELLI_1696 = 372.1; // Michilimackinac (84.7 W) drawn at 287.4
const PM_CORONELLI_1688 = 372.7; // Michilimackinac drawn at 288.0
const PM_CHAMPLAIN = 383.7; // Quebec drawn at 312.5

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
  {
    id: "cmveuoedl00117dwphrqyp79s", title: "Pond 1785", width: 2400, local: `${SCRATCH}/pond1785.jpg`,
    // Longitude labels along the top, 130 W at x=408 to 65 W at x=3586 (48.9 px per degree, straight);
    // latitudes on the right, 60 N at y=577 to 40 N at y=2443 (93.4 px per degree, uniform). Full sheet.
    georef: {
      lat: { kind: "linear", y1: 577, lat1: 60, y2: 2443, lat2: 40 },
      lon: { lonRef: -130, top: { y: 0, x: 408, k: 48.9 }, bottom: { y: 2943, x: 408, k: 48.9 } },
      out: { west: -138.3, east: -59.8, north: 66.2, south: 34.7, width: 3840, height: 2943 },
    },
  },
  {
    id: "cmveuoe8f000y7dwp1trjr3hn", title: "Mitchell 1755", width: 2400, local: `${SCRATCH}/mitchell1755.jpg`,
    // Longitudes west of London: 107 W at x=67 to 52 W at x=3730 along the top (66.6 px per degree)
    // but 96 W at x=264 to 60 W at x=3710 along the bottom (95.7 px per degree): meridians converge
    // in the ratio of the cosines of 52 N and 30 N, a trapezoid. Latitudes 52 N at y=30 to 29 N at
    // y=2584, near uniform. Output is the rectangle inscribed in the neatline.
    georef: {
      lat: { kind: "linear", y1: 30, lat1: 52, y2: 2584, lat2: 29 },
      lon: { lonRef: -107, top: { y: 30, x: 67, k: 66.6 }, bottom: { y: 2680, x: 264 + (96 - 107) * 95.7, k: 95.7 } },
      out: { west: -98.4, east: -59.1, north: 52.0, south: 28.1, width: 3840, height: 2650 },
    },
  },
  {
    id: "cmveuodsc000o7dwp4cm3lbq0", title: "Lahontan 1703", width: 2400, local: `${SCRATCH}/lahontan1703.jpg`,
    // Latitudes 37 N at y=1493 to 51 N at y=109 on the left (98.9 px per degree, uniform); longitudes
    // east of Ferro along the bottom, 252 at x=45 to 292 at x=3480 (85.9 px per degree at 37 N); the
    // meridians converge, taken as the cosine ratio to 51 N (67.7 px per degree) about the sheet's
    // central meridian (274.6 Ferro at x=1920). Ferro 22.34 W of Greenwich (20 W of Paris), which
    // puts Michilimackinac where the sheet draws it.
    georef: {
      lat: { kind: "linear", y1: 1493, lat1: 37, y2: 109, lat2: 51 },
      lon: { lonRef: 274.6 - 360 - 22.34, top: { y: 109, x: 1920, k: 67.7 }, bottom: { y: 1493, x: 1920, k: 85.9 } },
      out: { west: 252.7 - 382.34, east: 296.5 - 382.34, north: 51, south: 37, width: 3840, height: 1384 },
    },
  },
  {
    id: "cmveuodxl000s7dwpaxkx5xe3", title: "Delisle 1703", width: 2400, local: `${SCRATCH}/delisle1703.jpg`,
    // Latitudes 40 N at y=2759 to 75 N at y=396 on the left (67.5 px per degree, uniform; the right
    // border agrees, so the parallels are straight). Longitudes east of Ferro along the bottom, 260
    // at x=307 to 320 at x=3437 (52.2 px per degree at 39 N); the top border carries only a tick
    // scale, about 34 px per degree at 78 N, so the meridians converge about a third less than the
    // cosine law. Central meridian 290 Ferro (92.34 W) at x=1872, taken as vertical. Output is the
    // rectangle inscribed in the neatline.
    georef: {
      lat: { kind: "linear", y1: 2759, lat1: 40, y2: 396, lat2: 75 },
      lon: { lonRef: 290 - 382.34, top: { y: 190, x: 1872, k: 34 }, bottom: { y: 2810, x: 1872, k: 52.2 } },
      out: { west: 256.1 - 382.34, east: 326.9 - 382.34, north: 78.06, south: 39.24, width: 3840, height: 2620 },
    },
  },
  {
    id: "cmveuoej000157dwplbnzhn0d", title: "Arrowsmith 1795", width: 2400, local: `${SCRATCH}/arrowsmith1795.jpg`,
    // A conic sheet. The 13 meridians labelled along both the top (y=40) and bottom (y=3160)
    // borders are straight lines that meet at one apex (x=1843, y=-1488 above the sheet; the 78
    // pairwise intersections lie within 30 px of it); the angle from the apex is 0.690 degrees per
    // degree of longitude about a central meridian of 101.9 W. The parallels cross the left (x=60)
    // and right (x=3760) borders as arcs about a different centre (x=1636, y=-1148), with radius
    // 2341 px at 60 N growing 64.9 px per degree southward (residuals within 5 px). Output is a
    // rectangle inscribed in the drawn area.
    georef: {
      conic: { xa: 1842.8, ya: -1487.9, n: 0.6904, lonC: -101.91, xc: 1636.2, yc: -1148.3, r0: 2340.6, lat0: 60, s: 64.93 },
      out: { west: -145, east: -58, north: 66, south: 27, width: 3840, height: 3261 },
    },
  },
  // The 17th-century sheets below (read 2026-10-20, scratchpad/georef/c4) are all trapezoids with
  // uniform latitudes and longitudes counted east of "Ferro" (see the PM_ constants above). Their
  // own errors are degrees wide, so the overlays show where each mapmaker believed the country
  // lay once one anchor is pinned; the tick positions come from darkness profiles of the borders
  // (prof.py), the labels from magnified crops.
  {
    id: "cmveuodc7000f7dwpugkbxmn4", title: "Jaillot 1685", width: 2400, local: `${SCRATCH}/jaillot1685.jpg`,
    // Latitudes 65 N at y=315 to 45 N at y=2396 on both sides (104.05 px per degree). Longitudes
    // along the top (y=40): 305 at x=1676 to 350 at x=3501, 40.56 px per degree; along the bottom
    // (y=2620): 310 at x=1878 to 335 at x=3762, 75.4 px per degree; 310 Ferro is vertical at x=1879.
    // Output is the rectangle inscribed in the neatline (x 62-3775, y 62-2607).
    georef: {
      lat: { kind: "linear", y1: 315, lat1: 65, y2: 2396, lat2: 45 },
      lon: { lonRef: 310 - PM_JAILLOT, top: { y: 40, x: 1879, k: 40.56 }, bottom: { y: 2620, x: 1878, k: 75.4 } },
      out: { west: 285.86 - PM_JAILLOT, east: 335.22 - PM_JAILLOT, north: 67.43, south: 42.97, width: 3840, height: 3475 },
    },
  },
  {
    id: "cmveuod1400097dwp62u7irbp", title: "Sanson 1656", width: 2400, local: `${SCRATCH}/sanson1656.jpg`,
    // Latitudes 65 N at y=124 to 35 N at y=2541 (80.57 px per degree, both sides agree). Longitudes
    // along the top (y=85): 300 at x=1774 to 355 at x=3588, 32.98 px per degree; along the bottom
    // (y=2746): 285 at x=545 to 330 at x=3611, 68.1 px per degree; 305 Ferro at x=1939 (top) and
    // x=1927 (bottom). Output inscribed in the neatline (x 110-3800, y 110-2720).
    georef: {
      lat: { kind: "linear", y1: 124, lat1: 65, y2: 2541, lat2: 35 },
      lon: { lonRef: 305 - PM_SANSON, top: { y: 85, x: 1939, k: 32.98 }, bottom: { y: 2746, x: 1927, k: 68.1 } },
      out: { west: 278.18 - PM_SANSON, east: 332.64 - PM_SANSON, north: 65.17, south: 32.78, width: 3840, height: 3666 },
    },
  },
  {
    id: "cmveuodn6000l7dwpi3s9jyh8", title: "Coronelli 1696", width: 2400, local: `${SCRATCH}/coronelli1696.jpg`,
    // Latitudes 50 N at y=323 to 45 N at y=1238 (183 px per degree). Longitudes along the top
    // (y=90): 270 at x=373 to 300 at x=3417, 101.47 px per degree; along the bottom (y=2270): 270 at
    // x=129 to 295 at x=3207, 123.2 px per degree. Output inscribed in the red border (x 125-3785,
    // y 120-2240).
    georef: {
      lat: { kind: "linear", y1: 323, lat1: 50, y2: 1238, lat2: 45 },
      lon: { lonRef: 270 - PM_CORONELLI_1696, top: { y: 90, x: 373, k: 101.47 }, bottom: { y: 2270, x: 129, k: 123.2 } },
      out: { west: 269.94 - PM_CORONELLI_1696, east: 299.72 - PM_CORONELLI_1696, north: 51.11, south: 39.52, width: 3840, height: 2136 },
    },
  },
  {
    id: "cmveuodhz000i7dwpm1whdmgy", title: "Coronelli 1688", width: 2400, local: `${SCRATCH}/coronelli1688.jpg`,
    // Latitudes 45 N at y=1152 to 40 N at y=1821 (133.8 px per degree). Longitudes along the top
    // (y=180): 265 at x=631 to 295 at x=2682, 68.37 px per degree, 285 at x=2000; along the bottom
    // (y=2690): 275 at x=1031 to 295 at x=3027, 99.8 px per degree, 285 at x=2029. Output inscribed
    // in the neatline (x 250-3600, y 195-2655).
    georef: {
      lat: { kind: "linear", y1: 1152, lat1: 45, y2: 1821, lat2: 40 },
      lon: { lonRef: 285 - PM_CORONELLI_1688, top: { y: 180, x: 2000, k: 68.37 }, bottom: { y: 2690, x: 2029, k: 99.8 } },
      out: { west: 267.10 - PM_CORONELLI_1688, east: 300.82 - PM_CORONELLI_1688, north: 52.15, south: 33.77, width: 3840, height: 2894 },
    },
  },
  {
    id: "cmveuocvy00057dwp5zibvasd", title: "Champlain 1632", width: 2400, local: `${SCRATCH}/champlain1632.jpg`,
    // Degrees of latitude are numbered in cells down both sides, 62 at y=250 to 38 at y=2136
    // (78.58 px per degree). Degrees of longitude are numbered in cells along the top (261 at x=97
    // to 361 at x=3683, 35.86 px per degree) and the bottom (283 at x=115 to 337 at x=3660,
    // 65.65 px per degree): a trapezoid whose meridian 311 runs from x=1875 at the top to x=1960
    // at the bottom. Champlain's prime meridian is not Ferro's: it is fixed by placing Quebec
    // (46.8 N, 71.2 W) where the sheet draws it, which puts it 23.7 degrees west of Greenwich.
    // Output inscribed between the number rows (x 72-3700, y 165-2275).
    georef: {
      lat: { kind: "linear", y1: 250, lat1: 62, y2: 2136, lat2: 38 },
      lon: { lonRef: 311 - PM_CHAMPLAIN, top: { y: 150, x: 1875, k: 35.86 }, bottom: { y: 2290, x: 1960, k: 65.65 } },
      out: { west: 282.16 - PM_CHAMPLAIN, east: 337.6 - PM_CHAMPLAIN, north: 63.08, south: 36.23, width: 3840, height: 2981 },
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

/** Source pixel of (lat, lon) on a conic sheet: the point of the parallel's arc that lies on the meridian's ray. */
function conicSource(lat: number, lon: number, c: ConicModel): { x: number; y: number } {
  const rho = c.r0 + c.s * (c.lat0 - lat);
  const th = ((c.n * (c.lonC - lon)) * Math.PI) / 180; // positive east of the central meridian
  const ux = Math.sin(th), uy = Math.cos(th);
  // |A + t*u - C|^2 = rho^2 with t > 0
  const dx = c.xa - c.xc, dy = c.ya - c.yc;
  const b = 2 * (dx * ux + dy * uy), cc = dx * dx + dy * dy - rho * rho;
  const disc = Math.max(0, b * b - 4 * cc);
  const t = (-b + Math.sqrt(disc)) / 2;
  return { x: c.xa + t * ux, y: c.ya + t * uy };
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
    const rowY = g.conic ? null : clampY(rowOf(lat, g.lat!) - 0.5);
    for (let i = 0; i < W; i++) {
      const lon = west + ((i + 0.5) / W) * (east - west);
      let sx: number, sy: number;
      if (g.conic) {
        const p = conicSource(lat, lon, g.conic);
        sx = clampX(p.x - 0.5); sy = clampY(p.y - 0.5);
      } else {
        sy = rowY!;
        sx = clampX(colOf(lon, sy + 0.5, g.lon!) - 0.5);
      }
      const y0 = Math.floor(sy), y1 = Math.min(sh - 1, y0 + 1), ty = sy - y0;
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
  // --preview <dir> writes each re-projected copy to <dir>/<title>.jpg instead of uploading it, for
  // checking a model against places of known position before anything reaches R2 or Turso.
  const previewIndex = process.argv.indexOf("--preview");
  const previewDir = previewIndex >= 0 ? process.argv[previewIndex + 1] : null;
  if (!APPLY && !previewDir) return;
  const results: Record<string, unknown>[] = [];
  const onlyIndex = process.argv.indexOf("--only");
  const only = onlyIndex >= 0 ? process.argv[onlyIndex + 1] : null;
  for (const spec of SPECS) {
    if (only && !spec.title.toLowerCase().includes(only.toLowerCase())) continue;
    const row = rows.find((r) => r.id === spec.id);
    if (!row) throw new Error(`map not found: ${spec.id}`);
    console.log(`  ${row.title}`);
    const source = await fetchSource(spec, row.imageUrl);
    const { data, info } = await sharp(source).rotate().raw().toBuffer({ resolveWithObject: true });
    const g = spec.georef;
    const pixels = reproject(data, info.width, info.height, info.channels, g);
    // Cap the copy at MAX_WIDTH so the phone never decodes a 3840-pixel sheet for an overlay
    const MAX_WIDTH = 2400;
    let copy = sharp(pixels, { raw: { width: g.out.width, height: g.out.height, channels: info.channels } });
    if (g.out.width > MAX_WIDTH) copy = copy.resize({ width: MAX_WIDTH });
    const jpeg = await copy.jpeg({ quality: 86 }).toBuffer();
    if (previewDir) {
      const file = `${previewDir}/${spec.title.toLowerCase().replace(/\s+/g, "")}.jpg`;
      writeFileSync(file, jpeg);
      results.push({ title: row.title, source: `${info.width}x${info.height}`, output: `${g.out.width}x${g.out.height}`, preview: file });
      continue;
    }
    const url = await uploadImageBuffer(jpeg, `historical-maps/${spec.id}/overlay.jpg`);
    await db.historicalMap.update({ where: { id: spec.id }, data: { boundsSwLat: g.out.south, boundsSwLng: g.out.west, boundsNeLat: g.out.north, boundsNeLng: g.out.east } });
    results.push({ title: row.title, source: `${info.width}x${info.height}`, output: `${g.out.width}x${g.out.height}`, bytes: jpeg.length, url });
  }
  report(previewDir ? "previewed (nothing uploaded or written)" : "applied", { results });
  if (previewDir) return;
  const verify = await db.historicalMap.findMany({ where: { boundsSwLat: { not: null } }, select: { title: true, boundsSwLat: true, boundsSwLng: true, boundsNeLat: true, boundsNeLng: true } });
  report("verify: maps with bounds", { verify });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
