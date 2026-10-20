/**
 * journeys.ts — what a voyageur journey's stop carries (roadmap item 6, 2026-10-20).
 *
 * A stop (JourneyNode) now rests on the app's own records: the place, water, explorer, document
 * and knowledge-given record it links to (resolved here to names the app can open), the source
 * it was written from, the voices written nearby (item 5), and an image, its own or its place's.
 * Each choice carries `whatHappened` (what people actually did, and what it cost or saved them)
 * and `source`; the points are set from that, not from drama.
 */
import { db } from "../db";
import { withVoices } from "./voices";

export interface JourneyChoice {
  id: string;
  text: string;
  nextNodeId: string;
  consequence?: string;
  pointsChange?: number;
  /** What people actually did at this point, and what came of it (roadmap item 6). */
  whatHappened?: string;
  source?: string;
}

export const parseChoices = (raw: string | null): JourneyChoice[] | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as JourneyChoice[]) : null;
  } catch {
    return null;
  }
};

type NodeRow = Awaited<ReturnType<typeof db.journeyNode.findMany>>[number];

export interface NodeLinks {
  location: { id: string; name: string; locationType: string; imageUrl: string | null } | null;
  waterway: { id: string; name: string } | null;
  explorer: { id: string; name: string } | null;
  document: { id: string; title: string } | null;
  knowledge: { id: string; title: string } | null;
}

/** The stop as the app reads it: parsed choices, resolved links, an image, and the voices near it. */
export async function decorateNode(node: NodeRow) {
  const [location, waterway, explorer, document, knowledge] = await Promise.all([
    node.locationId ? db.location.findUnique({ where: { id: node.locationId }, select: { id: true, name: true, locationType: true, imageUrl: true } }) : null,
    node.waterwayId ? db.waterway.findUnique({ where: { id: node.waterwayId }, select: { id: true, name: true } }) : null,
    node.explorerId ? db.explorer.findUnique({ where: { id: node.explorerId }, select: { id: true, name: true } }) : null,
    node.documentId ? db.primarySourceDocument.findUnique({ where: { id: node.documentId }, select: { id: true, title: true } }) : null,
    node.knowledgeId ? db.knowledgeGiven.findUnique({ where: { id: node.knowledgeId }, select: { id: true, title: true } }) : null,
  ]);
  const links: NodeLinks = { location, waterway, explorer, document, knowledge };
  return withVoices({
    ...node,
    choices: parseChoices(node.choices),
    imageUrl: node.imageUrl ?? location?.imageUrl ?? null,
    links,
  });
}

export const decorateNodes = (nodes: NodeRow[]) => Promise.all(nodes.map(decorateNode));
