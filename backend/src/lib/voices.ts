/**
 * voices.ts — the checked transcriptions as voices on the map (roadmap item 5, 2026-10-20).
 *
 * A "voice" is a published PrimarySourceDocument that carries a transcription checked against a
 * published edition (27 after pass 15) and a spot: the place where its words were written or
 * spoken (spotLatitude/spotLongitude/spotName, set by 2026-10-20-voices-spots.ts). The set is
 * small and changes only through migrations, so it is loaded once and kept for VOICES_TTL_MS,
 * like the search index. `voicesNear` serves the voyageur journeys, which quote the sources at
 * the node nearest to where they were written.
 */
import { db } from "../db";

export interface Voice {
  id: string;
  title: string;
  author: string | null;
  year: number | null;
  dateLabel: string | null;
  documentType: string;
  gradeLevel: string | null;
  spotName: string | null;
  latitude: number;
  longitude: number;
  /** The opening of the transcription, cut at a sentence end near 220 characters. */
  excerpt: string;
  /** The whole checked transcription, for reading aloud. */
  text: string;
  explorerId: string | null;
  waterway: { id: string; name: string } | null;
  location: { id: string; name: string } | null;
}

const VOICES_TTL_MS = 10 * 60 * 1000;
let cache: { builtAt: number; voices: Voice[] } | null = null;

/** The first sentences of a text up to about `max` characters, on a sentence boundary when one is near. */
export function excerptOf(text: string, max = 220): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const window = clean.slice(0, max + 60);
  const end = Math.max(window.lastIndexOf(". "), window.lastIndexOf("! "), window.lastIndexOf("? "));
  if (end >= max * 0.5) return clean.slice(0, end + 1);
  const space = clean.lastIndexOf(" ", max);
  return `${clean.slice(0, space > 0 ? space : max)}…`;
}

export async function listVoices(): Promise<Voice[]> {
  if (cache && Date.now() - cache.builtAt < VOICES_TTL_MS) return cache.voices;
  const docs = await db.primarySourceDocument.findMany({
    where: { isPublished: true, transcription: { not: null }, spotLatitude: { not: null }, spotLongitude: { not: null } },
    select: {
      id: true, title: true, author: true, originalYear: true, originalDate: true, documentType: true, gradeLevel: true,
      spotName: true, spotLatitude: true, spotLongitude: true, transcription: true, explorerId: true, waterwayId: true, locationId: true,
    },
    orderBy: [{ originalYear: "asc" }, { title: "asc" }],
  });
  const waterwayIds = [...new Set(docs.map((d) => d.waterwayId).filter((x): x is string => !!x))];
  const locationIds = [...new Set(docs.map((d) => d.locationId).filter((x): x is string => !!x))];
  const [waterways, locations] = await Promise.all([
    waterwayIds.length ? db.waterway.findMany({ where: { id: { in: waterwayIds } }, select: { id: true, name: true } }) : [],
    locationIds.length ? db.location.findMany({ where: { id: { in: locationIds } }, select: { id: true, name: true } }) : [],
  ]);
  const wById = new Map(waterways.map((w) => [w.id, w]));
  const lById = new Map(locations.map((l) => [l.id, l]));
  const voices: Voice[] = docs.map((d) => ({
    id: d.id,
    title: d.title,
    author: d.author,
    year: d.originalYear,
    dateLabel: d.originalDate,
    documentType: d.documentType,
    gradeLevel: d.gradeLevel,
    spotName: d.spotName,
    latitude: d.spotLatitude!,
    longitude: d.spotLongitude!,
    excerpt: excerptOf(d.transcription!),
    text: d.transcription!,
    explorerId: d.explorerId,
    waterway: d.waterwayId ? wById.get(d.waterwayId) ?? null : null,
    location: d.locationId ? lById.get(d.locationId) ?? null : null,
  }));
  cache = { builtAt: Date.now(), voices };
  return voices;
}

/** Drop the cached list (after content migrations, and in tests). */
export function clearVoicesCache(): void {
  cache = null;
}

const EARTH_KM = 6371;
export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.sqrt(a));
}

export type VoiceNear = Voice & { distanceKm: number };

/** The voices within `radiusKm` of a point, nearest first, at most `limit`. */
export async function voicesNear(latitude: number, longitude: number, radiusKm = 120, limit = 2): Promise<VoiceNear[]> {
  const voices = await listVoices();
  return voices
    .map((v) => ({ ...v, distanceKm: Math.round(distanceKm(latitude, longitude, v.latitude, v.longitude)) }))
    .filter((v) => v.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

/** Attach `voices` to a journey node that has coordinates (an empty list otherwise). */
export async function withVoices<T extends { latitude: number | null; longitude: number | null }>(node: T): Promise<T & { voices: VoiceNear[] }> {
  if (node.latitude === null || node.longitude === null) return { ...node, voices: [] };
  return { ...node, voices: await voicesNear(node.latitude, node.longitude) };
}
