/**
 * knowledge.ts — Indigenous contributions as records (roadmap item 16, 2026-10-20).
 *
 * GET /api/knowledge?kind&figureId&explorerId&waterwayId&locationId → { data: KnowledgeRecord[] } oldest first
 * GET /api/knowledge/kinds                                           → { data: [{ kind, label, count }] }
 * GET /api/knowledge/:id                                             → { data: { ...record, citations } }
 */
import { Hono } from "hono";
import { formatText, getCitations } from "../lib/citations";
import { getKnowledge, KNOWLEDGE_KIND_LABELS, KNOWLEDGE_KINDS, listKnowledge } from "../lib/knowledge";

const knowledgeRouter = new Hono();

knowledgeRouter.get("/", async (c) => {
  const q = c.req.query();
  return c.json({ data: await listKnowledge({ kind: q.kind, figureId: q.figureId, explorerId: q.explorerId, waterwayId: q.waterwayId, locationId: q.locationId }) });
});

knowledgeRouter.get("/kinds", async (c) => {
  const all = await listKnowledge();
  return c.json({ data: KNOWLEDGE_KINDS.map((kind) => ({ kind, label: KNOWLEDGE_KIND_LABELS[kind], count: all.filter((r) => r.kind === kind).length })) });
});

knowledgeRouter.get("/:id", async (c) => {
  const record = await getKnowledge(c.req.param("id"));
  if (!record) return c.json({ error: { message: "Record not found", code: "NOT_FOUND" } }, 404);
  const citations = await getCitations("knowledge_given", record.id);
  return c.json({ data: { ...record, citations: citations.map((r) => ({ ...r, text: formatText(r) })) } });
});

export { knowledgeRouter };
