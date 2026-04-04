import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { prisma } from "../src/prisma";

type LngLat = [number, number]; // [lng, lat]
type GeometryKind = "line" | "area";

type TierName = "nation" | "region" | "local";

interface TierConfig {
  toleranceDeg: number;
}

interface CliOptions {
  outFile: string;
  typeFilter: Set<string> | null;
  onlyWithKml: boolean;
}

interface SimplifiedTier {
  toleranceDeg: number;
  pathCount: number;
  pointCount: number;
  paths: LngLat[][];
}

interface WaterwayOverviewRecord {
  id: string;
  name: string;
  indigenousName: string | null;
  regionName: string;
  typeName: string;
  labelPoint: {
    lng: number;
    lat: number;
  };
  bbox: [number, number, number, number] | null; // [minLng, minLat, maxLng, maxLat]
  geometryKind: GeometryKind;
  hasKml: boolean;
  original: {
    pathCount: number;
    pointCount: number;
  };
  tiers: Record<TierName, SimplifiedTier>;
}

interface WaterwayOverviewDataset {
  generatedAt: string;
  source: string;
  filters: {
    typeFilter: string[] | null;
    onlyWithKml: boolean;
  };
  tolerancesDeg: Record<TierName, number>;
  stats: {
    totalWaterwaysRead: number;
    totalWaterwaysWritten: number;
    skippedNoKml: number;
    skippedNoGeometry: number;
  };
  waterways: WaterwayOverviewRecord[];
}

const TIER_CONFIG: Record<TierName, TierConfig> = {
  nation: { toleranceDeg: 0.12 },
  region: { toleranceDeg: 0.03 },
  local: { toleranceDeg: 0.008 },
};

const AREA_TYPE_NAMES = new Set(["Lake", "Bay", "Gulf", "Sound", "Basin"]);

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    outFile: "generated/waterway-overview.json",
    typeFilter: null,
    onlyWithKml: true,
  };

  for (const arg of argv) {
    if (arg.startsWith("--out=")) {
      options.outFile = arg.slice("--out=".length);
      continue;
    }

    if (arg.startsWith("--types=")) {
      const raw = arg.slice("--types=".length).trim();
      const values = raw
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

      options.typeFilter = values.length > 0 ? new Set(values) : null;
      continue;
    }

    if (arg === "--include-no-kml") {
      options.onlyWithKml = false;
      continue;
    }
  }

  return options;
}

function parseKmlCoordinateBlocks(kmlData: string): LngLat[][] {
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

function removeSequentialDuplicates(path: LngLat[]): LngLat[] {
  const result: LngLat[] = [];

  for (const point of path) {
    const prev = result[result.length - 1];
    if (!prev || prev[0] !== point[0] || prev[1] !== point[1]) {
      result.push(point);
    }
  }

  if (result.length > 1) {
    const first = result[0];
    const last = result[result.length - 1];
    if (first[0] === last[0] && first[1] === last[1] && result.length > 2) {
      return result;
    }
  }

  return result;
}

function isClosed(path: LngLat[]): boolean {
  if (path.length < 3) return false;
  const first = path[0];
  const last = path[path.length - 1];
  return first[0] === last[0] && first[1] === last[1];
}

function ensureClosed(path: LngLat[]): LngLat[] {
  if (path.length === 0) return path;
  if (isClosed(path)) return path;
  return [...path, path[0]];
}

function inferGeometryKind(typeName: string, paths: LngLat[][]): GeometryKind {
  if (AREA_TYPE_NAMES.has(typeName)) return "area";
  if (paths.some((path) => isClosed(path) && path.length >= 4) && typeName !== "River") {
    return "area";
  }
  return "line";
}

function simplifyAllPaths(paths: LngLat[][], toleranceDeg: number, kind: GeometryKind): LngLat[][] {
  return paths
    .map((path) => simplifyPath(path, toleranceDeg, kind === "area"))
    .filter((path) => path.length >= (kind === "area" ? 4 : 2));
}

function simplifyPath(path: LngLat[], toleranceDeg: number, forceClosed: boolean): LngLat[] {
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

function douglasPeucker(path: LngLat[], toleranceDeg: number): LngLat[] {
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

  const start = path[startIndex];
  const end = path[endIndex];

  let maxDistance = -1;
  let maxIndex = -1;

  for (let i = startIndex + 1; i < endIndex; i += 1) {
    const distance = perpendicularDistance(path[i], start, end, xScale);
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

function countPoints(paths: LngLat[][]): number {
  return paths.reduce((sum, path) => sum + path.length, 0);
}

function computeBBox(paths: LngLat[][]): [number, number, number, number] | null {
  let minLng = Number.POSITIVE_INFINITY;
  let minLat = Number.POSITIVE_INFINITY;
  let maxLng = Number.NEGATIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;
  let found = false;

  for (const path of paths) {
    for (const [lng, lat] of path) {
      found = true;
      if (lng < minLng) minLng = lng;
      if (lat < minLat) minLat = lat;
      if (lng > maxLng) maxLng = lng;
      if (lat > maxLat) maxLat = lat;
    }
  }

  return found ? [minLng, minLat, maxLng, maxLat] : null;
}

async function main(): Promise<void> {
  const options = parseArgs(Bun.argv.slice(2));

  const waterways = await prisma.waterway.findMany({
    select: {
      id: true,
      name: true,
      indigenousName: true,
      latitude: true,
      longitude: true,
      regionName: true,
      kmlData: true,
      type: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  let skippedNoKml = 0;
  let skippedNoGeometry = 0;

  const records: WaterwayOverviewRecord[] = [];

  for (const waterway of waterways) {
    const typeName = waterway.type.name;

    if (options.typeFilter && !options.typeFilter.has(typeName)) {
      continue;
    }

    if (!waterway.kmlData) {
      if (options.onlyWithKml) {
        skippedNoKml += 1;
        continue;
      }
    }

    const originalPaths = waterway.kmlData ? parseKmlCoordinateBlocks(waterway.kmlData) : [];
    if (originalPaths.length === 0) {
      skippedNoGeometry += 1;
      continue;
    }

    const geometryKind = inferGeometryKind(typeName, originalPaths);

    const tiers = {
      nation: buildTier(originalPaths, TIER_CONFIG.nation.toleranceDeg, geometryKind),
      region: buildTier(originalPaths, TIER_CONFIG.region.toleranceDeg, geometryKind),
      local: buildTier(originalPaths, TIER_CONFIG.local.toleranceDeg, geometryKind),
    } satisfies Record<TierName, SimplifiedTier>;

    const bbox = computeBBox(tiers.local.paths);

    records.push({
      id: waterway.id,
      name: waterway.name,
      indigenousName: waterway.indigenousName,
      regionName: waterway.regionName,
      typeName,
      labelPoint: {
        lng: waterway.longitude,
        lat: waterway.latitude,
      },
      bbox,
      geometryKind,
      hasKml: !!waterway.kmlData,
      original: {
        pathCount: originalPaths.length,
        pointCount: countPoints(originalPaths),
      },
      tiers,
    });
  }

  const dataset: WaterwayOverviewDataset = {
    generatedAt: new Date().toISOString(),
    source: "Prisma/Turso waterway.kmlData",
    filters: {
      typeFilter: options.typeFilter ? [...options.typeFilter] : null,
      onlyWithKml: options.onlyWithKml,
    },
    tolerancesDeg: {
      nation: TIER_CONFIG.nation.toleranceDeg,
      region: TIER_CONFIG.region.toleranceDeg,
      local: TIER_CONFIG.local.toleranceDeg,
    },
    stats: {
      totalWaterwaysRead: waterways.length,
      totalWaterwaysWritten: records.length,
      skippedNoKml,
      skippedNoGeometry,
    },
    waterways: records,
  };

  const absoluteOutFile = resolve(process.cwd(), options.outFile);
  await mkdir(dirname(absoluteOutFile), { recursive: true });
  await Bun.write(absoluteOutFile, `${JSON.stringify(dataset, null, 2)}\n`);

  console.log(`Wrote ${records.length} overview records to ${absoluteOutFile}`);
  console.log(JSON.stringify(dataset.stats, null, 2));
}

function buildTier(paths: LngLat[][], toleranceDeg: number, geometryKind: GeometryKind): SimplifiedTier {
  const simplified = simplifyAllPaths(paths, toleranceDeg, geometryKind);
  return {
    toleranceDeg,
    pathCount: simplified.length,
    pointCount: countPoints(simplified),
    paths: simplified,
  };
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
