// Batch lookups for the id columns that point at explorers, waterways and locations
// without a declared relation (TimelineEvent, HistoricalEvent, PrimarySourceDocument,
// FieldTripStop). The app shows the names and navigates to the records (decision 11,
// 2026-10-16); a dangling id resolves to null rather than failing the request.
import { db } from "../db";

export interface RelatedExplorer {
  id: string;
  name: string;
  imageUrl: string | null;
}

export interface RelatedWaterway {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  typeName: string;
}

export interface RelatedLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  locationType: string;
  waterwayId: string;
}

export interface RelatedMaps {
  explorers: Map<string, RelatedExplorer>;
  waterways: Map<string, RelatedWaterway>;
  locations: Map<string, RelatedLocation>;
}

const compact = (ids: Array<string | null | undefined>): string[] =>
  [...new Set(ids.filter((id): id is string => typeof id === "string" && id.length > 0))];

export async function loadRelated(args: {
  explorerIds?: Array<string | null | undefined>;
  waterwayIds?: Array<string | null | undefined>;
  locationIds?: Array<string | null | undefined>;
}): Promise<RelatedMaps> {
  const explorerIds = compact(args.explorerIds ?? []);
  const waterwayIds = compact(args.waterwayIds ?? []);
  const locationIds = compact(args.locationIds ?? []);

  const [explorers, waterways, locations] = await Promise.all([
    explorerIds.length
      ? db.explorer.findMany({
          where: { id: { in: explorerIds } },
          select: { id: true, name: true, imageUrl: true },
        })
      : Promise.resolve([]),
    waterwayIds.length
      ? db.waterway.findMany({
          where: { id: { in: waterwayIds } },
          select: { id: true, name: true, latitude: true, longitude: true, type: { select: { name: true } } },
        })
      : Promise.resolve([]),
    locationIds.length
      ? db.location.findMany({
          where: { id: { in: locationIds } },
          select: { id: true, name: true, latitude: true, longitude: true, locationType: true, waterwayId: true },
        })
      : Promise.resolve([]),
  ]);

  return {
    explorers: new Map(explorers.map((e) => [e.id, e])),
    waterways: new Map(
      waterways.map((w) => [
        w.id,
        { id: w.id, name: w.name, latitude: w.latitude, longitude: w.longitude, typeName: w.type.name },
      ])
    ),
    locations: new Map(locations.map((l) => [l.id, l])),
  };
}

/** Attach `explorer`, `waterway`, `location` objects (or null) to a row that carries the id columns. */
export function attachRelated<T extends { explorerId?: string | null; waterwayId?: string | null; locationId?: string | null }>(
  row: T,
  maps: RelatedMaps
): T & { explorer: RelatedExplorer | null; waterway: RelatedWaterway | null; location: RelatedLocation | null } {
  return {
    ...row,
    explorer: row.explorerId ? maps.explorers.get(row.explorerId) ?? null : null,
    waterway: row.waterwayId ? maps.waterways.get(row.waterwayId) ?? null : null,
    location: row.locationId ? maps.locations.get(row.locationId) ?? null : null,
  };
}
