import type { PrismaClient } from "@prisma/client";
import type { AuditArgs, AuditEntityType, AuditMatchMode } from "./audit-args";

export interface AuditCandidate {
  id: string;
  name: string;
  summary: Record<string, unknown>;
  relatedCounts: Record<string, number>;
  flags: string[];
}

export interface OverviewMatch {
  id: string;
  name: string;
  regionName?: string | null;
  hasNationPaths: boolean;
  hasRegionPaths: boolean;
  hasLocalPaths: boolean;
  bbox: [number, number, number, number] | null;
}

export interface AuditReport {
  entity: AuditEntityType;
  query: {
    name: string;
    match: AuditMatchMode;
    caseSensitive: boolean;
  };
  generatedAt: string;
  candidateCount: number;
  candidates: AuditCandidate[];
  overviewMatches?: OverviewMatch[];
  findings: string[];
  recommendations: string[];
}

export interface CandidateContext {
  id: string;
  name: string;
  latitude?: number | null;
  longitude?: number | null;
  regionName?: string | null;
  linkedWaterwayName?: string | null;
  raw: Record<string, unknown>;
}

interface LoaderResult {
  report: AuditReport;
  contexts: CandidateContext[];
}

export async function loadWaterwayCandidates(
  prisma: PrismaClient,
  args: AuditArgs
): Promise<LoaderResult> {
  const rows = await prisma.waterway.findMany({
    select: {
      id: true,
      name: true,
      indigenousName: true,
      indigenousLanguage: true,
      latitude: true,
      longitude: true,
      regionName: true,
      description: true,
      historicalSignificance: true,
      kmlData: true,
      type: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          locations: true,
          explorers: true,
          discoveries: true,
          contributions: true,
        },
      },
      furTradeInfo: {
        select: {
          id: true,
        },
      },
    },
    orderBy: [{ name: "asc" }, { regionName: "asc" }],
  });

  const matches = rows.filter((row) => matchesName(row.name, args));
  const report: AuditReport = {
    entity: "waterway",
    query: {
      name: args.name,
      match: args.match,
      caseSensitive: args.caseSensitive,
    },
    generatedAt: new Date().toISOString(),
    candidateCount: matches.length,
    candidates: matches.map((row) => ({
      id: row.id,
      name: row.name,
      summary: {
        regionName: row.regionName,
        latitude: row.latitude,
        longitude: row.longitude,
        typeName: row.type.name,
        indigenousName: row.indigenousName,
        indigenousLanguage: row.indigenousLanguage,
        hasKml: !!row.kmlData,
        hasHistoricalSignificance: !!row.historicalSignificance,
      },
      relatedCounts: {
        locations: row._count.locations,
        explorerLinks: row._count.explorers,
        discoveries: row._count.discoveries,
        contributions: row._count.contributions,
        furTradeInfo: row.furTradeInfo ? 1 : 0,
      },
      flags: [],
    })),
    findings: [],
    recommendations: [],
  };

  const contexts: CandidateContext[] = matches.map((row) => ({
    id: row.id,
    name: row.name,
    latitude: row.latitude,
    longitude: row.longitude,
    regionName: row.regionName,
    raw: {
      typeName: row.type.name,
      hasKml: !!row.kmlData,
      indigenousName: row.indigenousName,
      indigenousLanguage: row.indigenousLanguage,
      descriptionLength: row.description.length,
      hasHistoricalSignificance: !!row.historicalSignificance,
      baseRelatedCounts: {
        locations: row._count.locations,
        explorerLinks: row._count.explorers,
        discoveries: row._count.discoveries,
        contributions: row._count.contributions,
        furTradeInfo: row.furTradeInfo ? 1 : 0,
      },
    },
  }));

  addDuplicateAndGeoFindings(report, contexts, "regionName");

  for (const candidate of report.candidates) {
    const hasKml = candidate.summary.hasKml === true;
    if (!hasKml) {
      candidate.flags.push("missing_kml");
    }
    if ((candidate.relatedCounts.locations ?? 0) === 0) {
      candidate.flags.push("no_related_locations");
    }
    if ((candidate.relatedCounts.explorerLinks ?? 0) === 0) {
      candidate.flags.push("no_explorer_links");
    }
  }

  return { report, contexts };
}

export async function loadLocationCandidates(
  prisma: PrismaClient,
  args: AuditArgs
): Promise<LoaderResult> {
  const rows = await prisma.location.findMany({
    select: {
      id: true,
      name: true,
      indigenousName: true,
      latitude: true,
      longitude: true,
      locationType: true,
      yearEstablished: true,
      waterwayId: true,
      waterway: {
        select: {
          name: true,
          regionName: true,
        },
      },
      cartographer: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          contributions: true,
        },
      },
    },
    orderBy: [{ name: "asc" }, { locationType: "asc" }],
  });

  const matches = rows.filter((row) => matchesName(row.name, args));
  const report: AuditReport = {
    entity: "location",
    query: {
      name: args.name,
      match: args.match,
      caseSensitive: args.caseSensitive,
    },
    generatedAt: new Date().toISOString(),
    candidateCount: matches.length,
    candidates: matches.map((row) => ({
      id: row.id,
      name: row.name,
      summary: {
        locationType: row.locationType,
        latitude: row.latitude,
        longitude: row.longitude,
        yearEstablished: row.yearEstablished,
        indigenousName: row.indigenousName,
        waterwayId: row.waterwayId,
        waterwayName: row.waterway.name,
        waterwayRegionName: row.waterway.regionName,
        hasCartographer: !!row.cartographer,
      },
      relatedCounts: {
        contributions: row._count.contributions,
      },
      flags: [],
    })),
    findings: [],
    recommendations: [],
  };

  const contexts: CandidateContext[] = matches.map((row) => ({
    id: row.id,
    name: row.name,
    latitude: row.latitude,
    longitude: row.longitude,
    linkedWaterwayName: row.waterway.name,
    raw: {
      locationType: row.locationType,
      yearEstablished: row.yearEstablished,
      waterwayId: row.waterwayId,
      waterwayName: row.waterway.name,
      waterwayRegionName: row.waterway.regionName,
      hasCartographer: !!row.cartographer,
      contributionCount: row._count.contributions,
    },
  }));

  addDuplicateAndGeoFindings(report, contexts, "linkedWaterwayName");

  for (const candidate of report.candidates) {
    if ((candidate.relatedCounts.contributions ?? 0) === 0) {
      candidate.flags.push("no_contributions");
    }
  }

  return { report, contexts };
}

export async function loadExplorerCandidates(
  prisma: PrismaClient,
  args: AuditArgs
): Promise<LoaderResult> {
  const rows = await prisma.explorer.findMany({
    select: {
      id: true,
      name: true,
      birthYear: true,
      deathYear: true,
      nationality: true,
      _count: {
        select: {
          waterways: true,
        },
      },
    },
    orderBy: [{ name: "asc" }],
  });

  const matches = rows.filter((row) => matchesName(row.name, args));
  const report: AuditReport = {
    entity: "explorer",
    query: {
      name: args.name,
      match: args.match,
      caseSensitive: args.caseSensitive,
    },
    generatedAt: new Date().toISOString(),
    candidateCount: matches.length,
    candidates: matches.map((row) => ({
      id: row.id,
      name: row.name,
      summary: {
        birthYear: row.birthYear,
        deathYear: row.deathYear,
        nationality: row.nationality,
      },
      relatedCounts: {
        waterways: row._count.waterways,
      },
      flags: [],
    })),
    findings: [],
    recommendations: [],
  };

  const contexts: CandidateContext[] = matches.map((row) => ({
    id: row.id,
    name: row.name,
    raw: {
      birthYear: row.birthYear,
      deathYear: row.deathYear,
      nationality: row.nationality,
      waterwayCount: row._count.waterways,
    },
  }));

  if (matches.length > 1) {
    report.findings.push("multiple explorer rows share the same matched name");
  }

  return { report, contexts };
}

function addDuplicateAndGeoFindings(
  report: AuditReport,
  contexts: CandidateContext[],
  groupField: "regionName" | "linkedWaterwayName"
): void {
  if (contexts.length > 1) {
    report.findings.push("multiple rows share the same matched name");
  }

  const distinctGroups = new Set(
    contexts
      .map((context) => context[groupField] ?? null)
      .filter((value): value is string => !!value)
  );

  if (distinctGroups.size > 1) {
    report.findings.push(`matched rows span multiple ${groupField} values`);
  }

  const coords = contexts.filter(
    (context): context is CandidateContext & { latitude: number; longitude: number } =>
      typeof context.latitude === "number" && typeof context.longitude === "number"
  );

  if (coords.length > 1) {
    let maxKm = 0;
    for (let i = 0; i < coords.length; i += 1) {
      for (let j = i + 1; j < coords.length; j += 1) {
        const km = haversineKm(
          coords[i].latitude,
          coords[i].longitude,
          coords[j].latitude,
          coords[j].longitude
        );
        if (km > maxKm) maxKm = km;
      }
    }

    if (maxKm >= 50) {
      report.findings.push(`matched rows are geographically distinct (max separation ${maxKm.toFixed(1)} km)`);
    }
  }
}

export function matchesName(name: string, args: AuditArgs): boolean {
  const left = args.caseSensitive ? name : name.toLowerCase();
  const right = args.caseSensitive ? args.name : args.name.toLowerCase();

  if (args.match === "exact") {
    return left === right;
  }
  if (args.match === "startsWith") {
    return left.startsWith(right);
  }
  return left.includes(right);
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
