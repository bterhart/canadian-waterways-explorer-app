import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { OverviewMatch } from "./audit-loaders";

interface OverviewTier {
  pathCount: number;
  pointCount: number;
  paths: Array<Array<[number, number]>>;
}

interface OverviewRecord {
  id: string;
  name: string;
  regionName?: string | null;
  bbox: [number, number, number, number] | null;
  tiers: {
    nation?: OverviewTier;
    region?: OverviewTier;
    local?: OverviewTier;
  };
}

interface OverviewDataset {
  waterways?: OverviewRecord[];
}

interface OverviewLookupArgs {
  entity: "waterway";
  name: string;
  candidateIds: string[];
}

const CANDIDATE_OVERVIEW_FILES = [
  "generated/river-overview.json",
  "generated/waterway-overview.json",
];

export async function loadOverviewMatches(args: OverviewLookupArgs): Promise<OverviewMatch[]> {
  const dataset = await readOverviewDataset();
  const rows = dataset?.waterways ?? [];

  const candidateIdSet = new Set(args.candidateIds);
  const nameLower = args.name.toLowerCase();

  return rows
    .filter((row) => candidateIdSet.has(row.id) || row.name.toLowerCase() === nameLower)
    .map((row) => ({
      id: row.id,
      name: row.name,
      regionName: row.regionName ?? null,
      hasNationPaths: !!row.tiers?.nation?.paths?.length,
      hasRegionPaths: !!row.tiers?.region?.paths?.length,
      hasLocalPaths: !!row.tiers?.local?.paths?.length,
      bbox: row.bbox ?? null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function readOverviewDataset(): Promise<OverviewDataset | null> {
  for (const relativePath of CANDIDATE_OVERVIEW_FILES) {
    const absolutePath = resolve(process.cwd(), relativePath);
    try {
      const raw = await readFile(absolutePath, "utf-8");
      return JSON.parse(raw) as OverviewDataset;
    } catch {
      // Try the next candidate file.
    }
  }

  return null;
}
