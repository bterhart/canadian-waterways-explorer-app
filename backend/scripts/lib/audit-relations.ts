import type { PrismaClient } from "@prisma/client";
import type { AuditReport, CandidateContext } from "./audit-loaders";

interface RelationAuditResult {
  relatedCounts: Record<string, number>;
  flags: string[];
}

export async function loadWaterwayRelations(
  prisma: PrismaClient,
  ids: string[]
): Promise<Record<string, RelationAuditResult>> {
  const result: Record<string, RelationAuditResult> = {};

  await Promise.all(
    ids.map(async (id) => {
      const [
        locationCount,
        explorerLinkCount,
        furTradeCount,
        discoveryCount,
        contributionCount,
        historicalEventCount,
        pronunciationGuideCount,
      ] = await Promise.all([
        prisma.location.count({ where: { waterwayId: id } }),
        prisma.explorerWaterway.count({ where: { waterwayId: id } }),
        prisma.furTradeInfo.count({ where: { waterwayId: id } }),
        prisma.archaeologicalDiscovery.count({ where: { waterwayId: id } }),
        prisma.userContribution.count({ where: { waterwayId: id } }),
        prisma.historicalEvent.count({ where: { waterwayId: id } }),
        prisma.pronunciationGuide.count({ where: { waterwayId: id } }),
      ]);

      const flags: string[] = [];
      if (locationCount === 0) flags.push("no_related_locations");
      if (explorerLinkCount === 0) flags.push("no_explorer_links");
      if (furTradeCount === 0) flags.push("no_fur_trade_record");
      if (discoveryCount === 0) flags.push("no_discovery_rows");
      if (historicalEventCount === 0) flags.push("no_historical_events");
      if (pronunciationGuideCount === 0) flags.push("no_pronunciation_guides");

      result[id] = {
        relatedCounts: {
          locations: locationCount,
          explorerLinks: explorerLinkCount,
          furTradeInfo: furTradeCount,
          discoveries: discoveryCount,
          contributions: contributionCount,
          historicalEvents: historicalEventCount,
          pronunciationGuides: pronunciationGuideCount,
        },
        flags,
      };
    })
  );

  return result;
}

export async function loadLocationRelations(
  prisma: PrismaClient,
  ids: string[]
): Promise<Record<string, RelationAuditResult>> {
  const result: Record<string, RelationAuditResult> = {};

  await Promise.all(
    ids.map(async (id) => {
      const [contributionCount, historicalEventCount, mapPinCount, pronunciationGuideCount] =
        await Promise.all([
          prisma.userContribution.count({ where: { locationId: id } }),
          prisma.historicalEvent.count({ where: { locationId: id } }),
          prisma.mapPin.count({ where: { linkedLocationId: id } }),
          prisma.pronunciationGuide.count({ where: { locationId: id } }),
        ]);

      const flags: string[] = [];
      if (contributionCount === 0) flags.push("no_contributions");
      if (historicalEventCount === 0) flags.push("no_historical_events");
      if (mapPinCount > 0) flags.push("has_user_map_pins");
      if (pronunciationGuideCount === 0) flags.push("no_pronunciation_guides");

      result[id] = {
        relatedCounts: {
          contributions: contributionCount,
          historicalEvents: historicalEventCount,
          userMapPins: mapPinCount,
          pronunciationGuides: pronunciationGuideCount,
        },
        flags,
      };
    })
  );

  return result;
}

export async function loadExplorerRelations(
  prisma: PrismaClient,
  ids: string[]
): Promise<Record<string, RelationAuditResult>> {
  const result: Record<string, RelationAuditResult> = {};

  await Promise.all(
    ids.map(async (id) => {
      const [explorerWaterwayCount, historicalEventCount, mapPinCount] = await Promise.all([
        prisma.explorerWaterway.count({ where: { explorerId: id } }),
        prisma.historicalEvent.count({ where: { explorerId: id } }),
        prisma.mapPin.count({ where: { linkedExplorerId: id } }),
      ]);

      const flags: string[] = [];
      if (explorerWaterwayCount === 0) flags.push("no_linked_waterways");
      if (historicalEventCount === 0) flags.push("no_historical_events");
      if (mapPinCount > 0) flags.push("has_user_map_pins");

      result[id] = {
        relatedCounts: {
          waterways: explorerWaterwayCount,
          historicalEvents: historicalEventCount,
          userMapPins: mapPinCount,
        },
        flags,
      };
    })
  );

  return result;
}

export function buildWaterwayRecommendations(
  report: AuditReport,
  contexts: CandidateContext[]
): { findings: string[]; recommendations: string[] } {
  const findings: string[] = [];
  const recommendations: string[] = [];

  if (report.candidateCount > 1) {
    findings.push("duplicate-name waterway rows require canonical row review");
    recommendations.push("Compare all matched waterway IDs and choose the intended canonical educational row.");
  }

  const overviewMissing = report.candidates.some((candidate) =>
    candidate.flags.includes("missing_from_overview_dataset")
  );
  if (overviewMissing) {
    findings.push("one or more matched waterways are absent from the generated overview dataset");
    recommendations.push("Inspect backend/generated/river-overview.json and regenerate it after correcting source rows.");
  }

  const noKml = report.candidates.some((candidate) => candidate.flags.includes("missing_kml"));
  if (noKml) {
    recommendations.push("Verify kmlData on the intended canonical waterway row before regenerating overview data.");
  }

  const regionNames = new Set(
    contexts.map((context) => context.regionName).filter((value): value is string => !!value)
  );
  if (regionNames.size > 1) {
    recommendations.push("Disambiguate duplicate waterway names in the UI by appending region labels.");
  }

  recommendations.push("Audit related Location, ExplorerWaterway, FurTradeInfo, and ArchaeologicalDiscovery rows for waterwayId mislinks.");
  recommendations.push("After any reassignment, regenerate the overview JSON and retest the affected rivers in preview.");

  return { findings, recommendations };
}

export function buildLocationRecommendations(
  report: AuditReport,
  contexts: CandidateContext[]
): { findings: string[]; recommendations: string[] } {
  const findings: string[] = [];
  const recommendations: string[] = [];

  if (report.candidateCount > 1) {
    findings.push("duplicate-name location rows require waterway-link review");
    recommendations.push("Compare matched location rows and confirm each linked waterwayId is correct.");
  }

  const waterwayNames = new Set(
    contexts.map((context) => context.linkedWaterwayName).filter((value): value is string => !!value)
  );

  if (waterwayNames.size > 1) {
    findings.push("matched locations belong to different waterways");
    recommendations.push("Disambiguate duplicate location names in UI lists by appending waterway names or regions.");
  }

  recommendations.push("Audit user contributions and historical event links for the intended location row.");

  return { findings, recommendations };
}

export function buildExplorerRecommendations(
  report: AuditReport,
  contexts: CandidateContext[]
): { findings: string[]; recommendations: string[] } {
  const findings: string[] = [];
  const recommendations: string[] = [];

  if (report.candidateCount > 1) {
    findings.push("duplicate-name explorer rows require biography and date review");
    recommendations.push("Compare birthYear, deathYear, nationality, and linked waterways to identify the canonical row.");
  }

  const distinctNationalities = new Set(
    contexts
      .map((context) => context.raw.nationality)
      .filter((value): value is string => typeof value === "string" && value.length > 0)
  );

  if (distinctNationalities.size > 1) {
    findings.push("matched explorers have differing nationalities");
  }

  recommendations.push("Audit ExplorerWaterway join rows before merging or relinking duplicate explorers.");

  return { findings, recommendations };
}
