/**
 * then-and-now.ts — then-and-now imagery (roadmap item 7, 2026-10-20): a period image of a spot
 * paired with a modern photograph of the same spot. Small set, resolved against the place and
 * water it sits on.
 */
import { db } from "../db";

export interface ThenAndNowPair {
  id: string;
  title: string;
  location: { id: string; name: string } | null;
  waterway: { id: string; name: string } | null;
  latitude: number;
  longitude: number;
  then: { url: string; year: number | null; yearLabel: string | null; caption: string; credit: string; sourceUrl: string | null };
  now: { url: string; year: number | null; caption: string; credit: string; sourceUrl: string | null };
  note: string | null;
  sortOrder: number;
}

export async function listThenAndNow(filter: { locationId?: string; waterwayId?: string } = {}): Promise<ThenAndNowPair[]> {
  const rows = await db.thenAndNow.findMany({
    where: {
      ...(filter.locationId ? { locationId: filter.locationId } : {}),
      ...(filter.waterwayId ? { waterwayId: filter.waterwayId } : {}),
    },
    orderBy: [{ thenYear: "asc" }, { sortOrder: "asc" }],
  });
  const locationIds = [...new Set(rows.map((r) => r.locationId).filter((x): x is string => !!x))];
  const waterwayIds = [...new Set(rows.map((r) => r.waterwayId).filter((x): x is string => !!x))];
  const [locations, waterways] = await Promise.all([
    locationIds.length ? db.location.findMany({ where: { id: { in: locationIds } }, select: { id: true, name: true } }) : [],
    waterwayIds.length ? db.waterway.findMany({ where: { id: { in: waterwayIds } }, select: { id: true, name: true } }) : [],
  ]);
  const L = new Map(locations.map((x) => [x.id, x])), W = new Map(waterways.map((x) => [x.id, x]));
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    location: r.locationId ? L.get(r.locationId) ?? null : null,
    waterway: r.waterwayId ? W.get(r.waterwayId) ?? null : null,
    latitude: r.latitude,
    longitude: r.longitude,
    then: { url: r.thenUrl, year: r.thenYear, yearLabel: r.thenYearLabel, caption: r.thenCaption, credit: r.thenCredit, sourceUrl: r.thenSourceUrl },
    now: { url: r.nowUrl, year: r.nowYear, caption: r.nowCaption, credit: r.nowCredit, sourceUrl: r.nowSourceUrl },
    note: r.note,
    sortOrder: r.sortOrder,
  }));
}

export async function getThenAndNow(id: string): Promise<ThenAndNowPair | null> {
  const all = await listThenAndNow();
  return all.find((p) => p.id === id) ?? null;
}
