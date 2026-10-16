// KML → simplified map geometry. Shared by the river-overview build script and the
// GET /api/waterways/:id/geometry route, so the app never downloads raw KML
// (live rows go up to 12.7 MB; Lake Huron) nor parses it on the device.
//
// Simplification is Douglas–Peucker in degrees with longitude scaled by cos(lat).

export type LngLat = [number, number]; // [lng, lat]
export type GeometryKind = "line" | "area";
/**
 * Zoom tiers. nation/region/local are the three the home-map overview dataset is built
 * with; detail and fine serve the selected waterway when the map is zoomed in, and are
 * meant to be requested with a viewport bbox so only the part in view is sent.
 */
export type TierName = "nation" | "region" | "local" | "detail" | "fine";

export interface TierConfig {
  toleranceDeg: number;
}

/** Simplification tolerance per tier, in degrees (0.0005° ≈ 50 m: effectively the stored points). */
export const TIER_CONFIG: Record<TierName, TierConfig> = {
  nation: { toleranceDeg: 0.12 },
  region: { toleranceDeg: 0.03 },
  local: { toleranceDeg: 0.008 },
  detail: { toleranceDeg: 0.002 },
  fine: { toleranceDeg: 0.0005 },
};

/** [minLng, minLat, maxLng, maxLat] */
export type BBox = [number, number, number, number];

export const AREA_TYPE_NAMES = new Set(["Lake", "Bay", "Gulf", "Sound", "Basin"]);

export function parseKmlCoordinateBlocks(kmlData: string): LngLat[][] {
  const paths: LngLat[][] = [];
  const coordRegex = /<coordinates[^>]*>([\s\S]*?)<\/coordinates>/gi;
  let match: RegExpExecArray | null;

  while ((match = coordRegex.exec(kmlData)) !== null) {
    const block = match[1]?.trim() ?? "";
    if (!block) continue;

    const path: LngLat[] = [];
    const triplets = block.split(/\s+/).map((value) => value.trim()).filter(Boolean);

    for (const triplet of triplets) {
      const [lngRaw, latRaw] = triplet.split(",");
      if (lngRaw === undefined || latRaw === undefined) continue;

      const lng = Number.parseFloat(lngRaw);
      const lat = Number.parseFloat(latRaw);
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue;

      path.push([lng, lat]);
    }

    const normalized = removeSequentialDuplicates(path);
    if (normalized.length > 0) {
      paths.push(normalized);
    }
  }

  return paths;
}

export interface KmlPath {
  kind: GeometryKind;
  path: LngLat[];
  /** true for a Polygon inner ring (an island) drawn as an outline rather than filled */
  ring?: boolean;
}

/**
 * Like parseKmlCoordinateBlocks, but keeps each path's own geometry kind: a <LineString> is
 * a line, a <Polygon> outer ring is an area, and a <Polygon> inner ring (an island) is drawn
 * as an outline so it is not filled over. A river KML may therefore mix a centreline with
 * the river's mapped water surface (the St. Lawrence below Montreal), and each part renders
 * the right way. Coordinates outside any LineString/Polygon fall back to closed = area.
 */
export function parseKmlPaths(kmlData: string): KmlPath[] {
  const out: KmlPath[] = [];
  const pushBlocks = (text: string, kind: GeometryKind | null, ring = false) => {
    for (const path of parseKmlCoordinateBlocks(text)) {
      out.push({ kind: kind ?? (isClosed(path) && path.length >= 4 ? "area" : "line"), path, ...(ring ? { ring: true } : {}) });
    }
  };
  let rest = kmlData;
  rest = rest.replace(/<Polygon\b[\s\S]*?<\/Polygon>/gi, (polygon) => {
    for (const m of polygon.matchAll(/<outerBoundaryIs>[\s\S]*?<\/outerBoundaryIs>/gi)) pushBlocks(m[0], "area");
    for (const m of polygon.matchAll(/<innerBoundaryIs>[\s\S]*?<\/innerBoundaryIs>/gi)) pushBlocks(m[0], "line", true);
    return "";
  });
  rest = rest.replace(/<LineString\b[\s\S]*?<\/LineString>/gi, (line) => {
    pushBlocks(line, "line");
    return "";
  });
  pushBlocks(rest, null);
  return out;
}

export function removeSequentialDuplicates(path: LngLat[]): LngLat[] {
  const result: LngLat[] = [];

  for (const point of path) {
    const prev = result[result.length - 1];
    if (!prev || prev[0] !== point[0] || prev[1] !== point[1]) {
      result.push(point);
    }
  }

  return result;
}

export function isClosed(path: LngLat[]): boolean {
  if (path.length < 3) return false;
  const first = path[0]!;
  const last = path[path.length - 1]!;
  return first[0] === last[0] && first[1] === last[1];
}

export function ensureClosed(path: LngLat[]): LngLat[] {
  if (path.length === 0) return path;
  if (isClosed(path)) return path;
  return [...path, path[0]!];
}

export function inferGeometryKind(typeName: string, paths: LngLat[][]): GeometryKind {
  if (AREA_TYPE_NAMES.has(typeName)) return "area";
  if (paths.some((path) => isClosed(path) && path.length >= 4) && typeName !== "River") {
    return "area";
  }
  return "line";
}

export function simplifyAllPaths(paths: LngLat[][], toleranceDeg: number, kind: GeometryKind): LngLat[][] {
  return paths
    .map((path) => simplifyPath(path, toleranceDeg, kind === "area"))
    .filter((path) => path.length >= (kind === "area" ? 4 : 2));
}

export function simplifyPath(path: LngLat[], toleranceDeg: number, forceClosed: boolean): LngLat[] {
  if (path.length <= (forceClosed ? 4 : 2)) {
    return forceClosed ? ensureClosed(path) : path;
  }

  if (forceClosed) {
    const working = isClosed(path) ? path.slice(0, -1) : [...path];
    if (working.length < 3) {
      return ensureClosed(working);
    }

    const simplified = douglasPeucker(working, toleranceDeg);
    const ring = simplified.length >= 3 ? simplified : working;
    return ensureClosed(ring);
  }

  return douglasPeucker(path, toleranceDeg);
}

export function douglasPeucker(path: LngLat[], toleranceDeg: number): LngLat[] {
  if (path.length <= 2) return [...path];

  const keep = new Array<boolean>(path.length).fill(false);
  keep[0] = true;
  keep[path.length - 1] = true;

  const meanLat = path.reduce((sum, [, lat]) => sum + lat, 0) / path.length;
  const xScale = Math.cos((meanLat * Math.PI) / 180);

  simplifySegment(path, 0, path.length - 1, toleranceDeg, xScale, keep);

  return path.filter((_, index) => keep[index]);
}

function simplifySegment(
  path: LngLat[],
  startIndex: number,
  endIndex: number,
  toleranceDeg: number,
  xScale: number,
  keep: boolean[]
): void {
  if (endIndex <= startIndex + 1) return;

  const start = path[startIndex]!;
  const end = path[endIndex]!;

  let maxDistance = -1;
  let maxIndex = -1;

  for (let i = startIndex + 1; i < endIndex; i += 1) {
    const distance = perpendicularDistance(path[i]!, start, end, xScale);
    if (distance > maxDistance) {
      maxDistance = distance;
      maxIndex = i;
    }
  }

  if (maxIndex !== -1 && maxDistance > toleranceDeg) {
    keep[maxIndex] = true;
    simplifySegment(path, startIndex, maxIndex, toleranceDeg, xScale, keep);
    simplifySegment(path, maxIndex, endIndex, toleranceDeg, xScale, keep);
  }
}

function perpendicularDistance(point: LngLat, start: LngLat, end: LngLat, xScale: number): number {
  const px = point[0] * xScale;
  const py = point[1];
  const sx = start[0] * xScale;
  const sy = start[1];
  const ex = end[0] * xScale;
  const ey = end[1];

  const dx = ex - sx;
  const dy = ey - sy;

  if (dx === 0 && dy === 0) {
    return Math.hypot(px - sx, py - sy);
  }

  const t = ((px - sx) * dx + (py - sy) * dy) / (dx * dx + dy * dy);
  const clamped = Math.max(0, Math.min(1, t));
  const projX = sx + clamped * dx;
  const projY = sy + clamped * dy;
  return Math.hypot(px - projX, py - projY);
}

/** Number of distinct coordinates; a closed ring simplified down to its endpoints has 1. */
export function distinctPointCount(path: LngLat[]): number {
  return new Set(path.map(([lng, lat]) => `${lng},${lat}`)).size;
}

export function countPoints(paths: LngLat[][]): number {
  return paths.reduce((sum, path) => sum + path.length, 0);
}

export interface WaterwayGeometry {
  geometryKind: GeometryKind;
  tier: TierName;
  toleranceDeg: number;
  pathCount: number;
  pointCount: number;
  originalPointCount: number;
  /** [lat, lng] pairs — the order react-native-maps consumes. */
  paths: [number, number][][];
  /** One entry per path; a river's mapped water surface is "area" while its centreline is "line". */
  pathKinds: GeometryKind[];
}

/** Point budget per tier for the map route — keeps the payload around tens of KB. */
export const TIER_POINT_BUDGET: Record<TierName, number> = {
  nation: 800,
  region: 2000,
  local: 5000,
  detail: 12000,
  fine: 25000,
};

const inBBox = ([lng, lat]: LngLat, b: BBox) => lng >= b[0] && lng <= b[2] && lat >= b[1] && lat <= b[3];

/**
 * Restrict paths to a viewport. A line is cut into the runs of consecutive points that lie
 * inside the box, each extended by one neighbouring point so the trace reaches the edge of
 * the screen; a ring (area) is kept whole when its extent touches the box, since a filled
 * polygon cannot be cut without changing its shape. The box the client sends is padded well
 * beyond the screen, so exact edge clipping is unnecessary.
 */
export function clipPathsToBBox(paths: KmlPath[], bbox: BBox): KmlPath[] {
  const out: KmlPath[] = [];
  for (const p of paths) {
    if (p.kind === "area" || p.ring) {
      if (ringExtentTouches(p.path, bbox)) out.push(p);
      continue;
    }
    let run: LngLat[] | null = null;
    for (let i = 0; i < p.path.length; i++) {
      const pt = p.path[i]!;
      if (inBBox(pt, bbox)) {
        if (!run) {
          run = [];
          if (i > 0) run.push(p.path[i - 1]!);
        }
        run.push(pt);
      } else if (run) {
        run.push(pt);
        out.push({ ...p, path: run });
        run = null;
      }
    }
    if (run) out.push({ ...p, path: run });
  }
  return out;
}

function ringExtentTouches(path: LngLat[], b: BBox): boolean {
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  for (const [lng, lat] of path) {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }
  return !(maxLng < b[0] || minLng > b[2] || maxLat < b[1] || minLat > b[3]);
}

/** Largest lat/lng extent of a path, in degrees (longitude scaled by cos(lat)). */
function pathExtentDeg(path: LngLat[]): number {
  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
  for (const [lng, lat] of path) {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }
  const meanLat = (minLat + maxLat) / 2;
  return Math.max((maxLng - minLng) * Math.cos((meanLat * Math.PI) / 180), maxLat - minLat);
}

/**
 * Parse + simplify a waterway's KML for one zoom tier, within the tier's point budget.
 * Some lake KMLs contain thousands of tiny rings (islands, shoreline fragments): rings
 * smaller than the tolerance are dropped, and the tolerance is raised step by step until
 * the budget is met, so the response size is bounded regardless of the source KML.
 */
export function buildGeometry(kmlData: string, typeName: string, tier: TierName, bbox?: BBox): WaterwayGeometry | null {
  const original = parseKmlPaths(kmlData);
  if (original.length === 0) return null;
  const originalPaths = original.map((p) => p.path);
  const geometryKind = inferGeometryKind(typeName, originalPaths);
  // Lakes and bays keep every ring as area (as before) except islands, which are outlines;
  // rivers are lines except where the KML carries the river's mapped water surface.
  const kindOf = (p: KmlPath): GeometryKind => (geometryKind === "area" ? p.kind : p.kind === "area" ? "area" : "line");
  const budget = TIER_POINT_BUDGET[tier];
  const working = bbox ? clipPathsToBBox(original, bbox) : original;

  // Largest paths first so that, when a budget forces pruning, the main body survives.
  const ordered = [...working].sort((a, b) => pathExtentDeg(b.path) - pathExtentDeg(a.path));

  let toleranceDeg = TIER_CONFIG[tier].toleranceDeg;
  let simplified: KmlPath[] = [];
  for (let attempt = 0; attempt < 14; attempt += 1) {
    // Tiny rings (islands) below the tolerance are dropped at the coarse tiers; the two fine
    // tiers keep everything in view and let the budget decide.
    const dropTiny = tier !== "detail" && tier !== "fine";
    const kept = ordered.filter((p, index) => index === 0 || !dropTiny || pathExtentDeg(p.path) >= toleranceDeg * 2);
    simplified = kept
      .map((p) => {
        const kind = kindOf(p);
        return { kind, path: simplifyPath(p.path, toleranceDeg, kind === "area") };
      })
      .filter((p) => p.path.length >= (p.kind === "area" ? 4 : 2) && distinctPointCount(p.path) >= 2);
    if (countPoints(simplified.map((p) => p.path)) <= budget) break;
    toleranceDeg *= 1.6;
  }
  // Last resort: keep the largest paths that fit the budget.
  if (countPoints(simplified.map((p) => p.path)) > budget) {
    const trimmed: KmlPath[] = [];
    let total = 0;
    for (const p of simplified) {
      if (total + p.path.length > budget && trimmed.length > 0) break;
      trimmed.push(p);
      total += p.path.length;
    }
    simplified = trimmed;
  }

  return {
    geometryKind,
    tier,
    toleranceDeg,
    pathCount: simplified.length,
    pointCount: countPoints(simplified.map((p) => p.path)),
    originalPointCount: countPoints(originalPaths),
    paths: simplified.map((p) => p.path.map(([lng, lat]) => [lat, lng] as [number, number])),
    pathKinds: simplified.map((p) => p.kind),
  };
}
