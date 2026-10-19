/**
 * search.ts — GET /api/search?q=&types=&limit= (roadmap item 3, 2026-10-19).
 *
 * → { data: { query, hits: [{ type, id, title, subtitle, snippet, score, target }], total, counts } }
 * `types` is a comma-separated subset of SEARCH_TYPES; `limit` defaults to 60 (max 200).
 * See lib/search.ts for what is indexed and how hits are ranked.
 */
import { Hono } from "hono";
import { search, SEARCH_TYPES, type SearchType } from "../lib/search";

const searchRouter = new Hono();

searchRouter.get("/", async (c) => {
  const q = c.req.query("q") ?? "";
  if (q.trim().length < 2) {
    return c.json({ error: { message: "q must be at least 2 characters", code: "BAD_REQUEST" } }, 400);
  }
  const typesParam = c.req.query("types");
  const types = typesParam
    ? (typesParam.split(",").map((t) => t.trim()).filter((t): t is SearchType => (SEARCH_TYPES as string[]).includes(t)))
    : null;
  const limitParam = Number(c.req.query("limit") ?? 60);
  const limit = Number.isFinite(limitParam) ? Math.min(200, Math.max(1, Math.floor(limitParam))) : 60;
  const result = await search(q, types && types.length > 0 ? types : null, limit);
  return c.json({ data: { query: q, ...result } });
});

searchRouter.get("/types", (c) => c.json({ data: SEARCH_TYPES }));

export { searchRouter };
