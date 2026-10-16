import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { db } from "../src/db";
import {
  TIER_CONFIG,
  parseKmlPaths,
  inferGeometryKind,
  simplifyAllPaths,
  countPoints,
} from "../src/lib/kml-geometry";
import type { LngLat, GeometryKind, TierName, TierConfig } from "../src/lib/kml-geometry";



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

  const waterways = await db.waterway.findMany({
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

    const allPaths = waterway.kmlData ? parseKmlPaths(waterway.kmlData) : [];
    if (allPaths.length === 0) {
      skippedNoGeometry += 1;
      continue;
    }

    const geometryKind = inferGeometryKind(typeName, allPaths.map((p) => p.path));
    // The home-map layer draws a river as its centreline. A river KML may also carry the
    // river's water surface and hundreds of island rings (the St. Lawrence below Montreal);
    // those became ~420 two-point overlays per tier and crashed the map in eastern Canada,
    // so for line waterways only line paths go into the overview.
    const originalPaths = (geometryKind === "line" ? allPaths.filter((p) => p.kind === "line" && !p.ring) : allPaths).map((p) => p.path);
    if (originalPaths.length === 0) {
      skippedNoGeometry += 1;
      continue;
    }

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
  // A path that collapses to a single distinct point draws nothing and is unsafe as a native overlay.
  const simplified = simplifyAllPaths(paths, toleranceDeg, geometryKind).filter(
    (path) => new Set(path.map(([lng, lat]) => `${lng},${lat}`)).size >= 2
  );
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
    await db.$disconnect();
  });
