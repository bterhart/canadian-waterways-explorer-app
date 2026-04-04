#!/usr/bin/env bun
import { mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { prisma } from "../src/prisma";

type Mode = "dry-run" | "write-kml" | "apply" | "clear";
type FilterName = "none" | "churchill-west";

interface CliOptions {
  mode: Mode;
  waterwayId: string;
  name?: string;
  input?: string;
  out?: string;
  filter: FilterName;
}

interface Placemark {
  raw: string;
  name: string | null;
  coordinateBlocks: string[];
  bbox: [number, number, number, number] | null; // [minLng, minLat, maxLng, maxLat]
  pointCount: number;
}

function parseArgs(argv: string[]): CliOptions {
  const values = new Map<string, string>();
  for (const arg of argv) {
    if (!arg.startsWith("--")) continue;
    const eq = arg.indexOf("=");
    if (eq === -1) {
      values.set(arg.slice(2), "true");
    } else {
      values.set(arg.slice(2, eq), arg.slice(eq + 1));
    }
  }

  const mode = (values.get("mode") || "dry-run") as Mode;
  const waterwayId = values.get("waterway-id") || "";
  const name = values.get("name") || undefined;
  const input = values.get("input") || undefined;
  const out = values.get("out") || undefined;
  const filter = (values.get("filter") || "none") as FilterName;

  if (!waterwayId) {
    throw new Error("Missing required --waterway-id=<id>");
  }

  if ((mode === "dry-run" || mode === "write-kml" || mode === "apply") && !input) {
    throw new Error(`Mode ${mode} requires --input=<path-to-kml>`);
  }

  if (mode === "write-kml" && !out) {
    throw new Error("Mode write-kml requires --out=<path>");
  }

  if (!["dry-run", "write-kml", "apply", "clear"].includes(mode)) {
    throw new Error(`Invalid --mode=${mode}`);
  }

  if (!["none", "churchill-west"].includes(filter)) {
    throw new Error(`Invalid --filter=${filter}`);
  }

  return { mode, waterwayId, name, input, out, filter };
}

function parseCoordinateTriplets(block: string): Array<[number, number]> {
  const coords: Array<[number, number]> = [];
  const triplets = block
    .trim()
    .split(/\s+/)
    .map((v) => v.trim())
    .filter(Boolean);

  for (const triplet of triplets) {
    const [lngRaw, latRaw] = triplet.split(",");
    if (lngRaw === undefined || latRaw === undefined) continue;
    const lng = Number.parseFloat(lngRaw);
    const lat = Number.parseFloat(latRaw);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue;
    coords.push([lng, lat]);
  }

  return coords;
}

function computeBBoxFromCoordinateBlocks(blocks: string[]): [number, number, number, number] | null {
  let minLng = Number.POSITIVE_INFINITY;
  let minLat = Number.POSITIVE_INFINITY;
  let maxLng = Number.NEGATIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;
  let found = false;

  for (const block of blocks) {
    for (const [lng, lat] of parseCoordinateTriplets(block)) {
      found = true;
      if (lng < minLng) minLng = lng;
      if (lat < minLat) minLat = lat;
      if (lng > maxLng) maxLng = lng;
      if (lat > maxLat) maxLat = lat;
    }
  }

  return found ? [minLng, minLat, maxLng, maxLat] : null;
}

function countPoints(blocks: string[]): number {
  let total = 0;
  for (const block of blocks) total += parseCoordinateTriplets(block).length;
  return total;
}

function extractPlacemarkName(rawPlacemark: string): string | null {
  const match = rawPlacemark.match(/<name>([\s\S]*?)<\/name>/i);
  return match?.[1]?.trim() || null;
}

function extractCoordinateBlocks(rawPlacemark: string): string[] {
  const blocks: string[] = [];
  const regex = /<coordinates[^>]*>([\s\S]*?)<\/coordinates>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(rawPlacemark)) !== null) {
    const block = match[1]?.trim();
    if (block) blocks.push(block);
  }
  return blocks;
}

function extractPlacemarks(kml: string): Placemark[] {
  const placemarks: Placemark[] = [];
  const regex = /<Placemark\b[\s\S]*?<\/Placemark>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(kml)) !== null) {
    const raw = match[0];
    const coordinateBlocks = extractCoordinateBlocks(raw);
    const bbox = computeBBoxFromCoordinateBlocks(coordinateBlocks);
    const pointCount = countPoints(coordinateBlocks);
    placemarks.push({
      raw,
      name: extractPlacemarkName(raw),
      coordinateBlocks,
      bbox,
      pointCount,
    });
  }

  return placemarks;
}

function aggregateBBox(placemarks: Placemark[]): [number, number, number, number] | null {
  let minLng = Number.POSITIVE_INFINITY;
  let minLat = Number.POSITIVE_INFINITY;
  let maxLng = Number.NEGATIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;
  let found = false;

  for (const p of placemarks) {
    if (!p.bbox) continue;
    found = true;
    minLng = Math.min(minLng, p.bbox[0]);
    minLat = Math.min(minLat, p.bbox[1]);
    maxLng = Math.max(maxLng, p.bbox[2]);
    maxLat = Math.max(maxLat, p.bbox[3]);
  }

  return found ? [minLng, minLat, maxLng, maxLat] : null;
}

function filterChurchillWest(placemarks: Placemark[]): Placemark[] {
  // Keep only the western Churchill system. The uploaded mixed file separates
  // western placemarks (~ -108 to -95 lng) from Labrador placemarks (~ -65 to -60 lng).
  // A conservative cutoff of maxLng <= -85 safely keeps the western system.
  return placemarks.filter((placemark) => {
    if (!placemark.bbox) return false;
    const [minLng, , maxLng] = placemark.bbox;
    return maxLng <= -85 && minLng <= -85;
  });
}

function applyFilter(placemarks: Placemark[], filter: FilterName): Placemark[] {
  switch (filter) {
    case "churchill-west":
      return filterChurchillWest(placemarks);
    case "none":
    default:
      return placemarks;
  }
}

function rebuildKmlWithPlacemarks(originalKml: string, keptPlacemarks: Placemark[]): string {
  const placemarksXml = keptPlacemarks.map((p) => p.raw).join("\n");

  if (/<Document\b[\s\S]*?<\/Document>/i.test(originalKml)) {
    return originalKml.replace(
      /<Document\b[^>]*>[\s\S]*?<\/Document>/i,
      (doc) => {
        const openMatch = doc.match(/<Document\b[^>]*>/i);
        const closeMatch = doc.match(/<\/Document>/i);
        const open = openMatch?.[0] || "<Document>";
        const close = closeMatch?.[0] || "</Document>";

        const documentName = doc.match(/<name>[\s\S]*?<\/name>/i)?.[0] || "";
        const documentDescription = doc.match(/<description>[\s\S]*?<\/description>/i)?.[0] || "";

        return `${open}
  ${documentName}
  ${documentDescription}
  ${placemarksXml}
${close}`;
      }
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    ${placemarksXml}
  </Document>
</kml>
`;
}

function fmtBBox(bbox: [number, number, number, number] | null): string {
  if (!bbox) return "null";
  return `[${bbox[0]}, ${bbox[1]}, ${bbox[2]}, ${bbox[3]}]`;
}

async function main(): Promise<void> {
  const options = parseArgs(Bun.argv.slice(2));

  if (options.mode === "clear") {
    const existing = await prisma.waterway.findUnique({
      where: { id: options.waterwayId },
      select: { id: true, name: true, regionName: true, kmlData: true },
    });

    if (!existing) {
      throw new Error(`Waterway not found: ${options.waterwayId}`);
    }

    await prisma.waterway.update({
      where: { id: options.waterwayId },
      data: { kmlData: null },
    });

    console.log(JSON.stringify({
      mode: "clear",
      waterwayId: existing.id,
      name: existing.name,
      regionName: existing.regionName,
      clearedPreviousKml: !!existing.kmlData,
    }, null, 2));

    return;
  }

  const absoluteInput = resolve(process.cwd(), options.input!);
  const originalKml = await readFile(absoluteInput, "utf-8");
  const allPlacemarks = extractPlacemarks(originalKml);
  const keptPlacemarks = applyFilter(allPlacemarks, options.filter);
  const filteredKml = rebuildKmlWithPlacemarks(originalKml, keptPlacemarks);

  const summary = {
    mode: options.mode,
    waterwayId: options.waterwayId,
    name: options.name || null,
    input: absoluteInput,
    filter: options.filter,
    placemarkCountOriginal: allPlacemarks.length,
    placemarkCountKept: keptPlacemarks.length,
    pointCountOriginal: allPlacemarks.reduce((sum, p) => sum + p.pointCount, 0),
    pointCountKept: keptPlacemarks.reduce((sum, p) => sum + p.pointCount, 0),
    bboxOriginal: aggregateBBox(allPlacemarks),
    bboxKept: aggregateBBox(keptPlacemarks),
    placemarksKept: keptPlacemarks.map((p, index) => ({
      index,
      name: p.name,
      bbox: p.bbox,
      pointCount: p.pointCount,
    })),
  };

  if (options.mode === "dry-run") {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  if (options.mode === "write-kml") {
    const absoluteOut = resolve(process.cwd(), options.out!);
    await mkdir(dirname(absoluteOut), { recursive: true });
    await Bun.write(absoluteOut, filteredKml);
    console.log(JSON.stringify({ ...summary, out: absoluteOut }, null, 2));
    return;
  }

  if (options.mode === "apply") {
    const existing = await prisma.waterway.findUnique({
      where: { id: options.waterwayId },
      select: { id: true, name: true, regionName: true, kmlData: true },
    });

    if (!existing) {
      throw new Error(`Waterway not found: ${options.waterwayId}`);
    }

    if (keptPlacemarks.length === 0) {
      throw new Error("Filtered KML contains zero placemarks; refusing to apply empty KML.");
    }

    await prisma.waterway.update({
      where: { id: options.waterwayId },
      data: { kmlData: filteredKml },
    });

    console.log(JSON.stringify({
      ...summary,
      appliedTo: {
        id: existing.id,
        name: existing.name,
        regionName: existing.regionName,
        hadPreviousKml: !!existing.kmlData,
      },
    }, null, 2));
    return;
  }

  throw new Error(`Unhandled mode: ${options.mode}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
