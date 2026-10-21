/**
 * open-data.ts — read-only open data (roadmap item 17, 2026-10-22).
 *
 * GET /api/open-data                      → index: licence, scope, every dataset with counts, fields and URLs
 * GET /api/open-data/:key.csv|json|geojson → one dataset; Content-Disposition names the file
 * GET /open-data                           → the human page (mounted separately in index.ts)
 * Public, no auth, cached ten minutes in memory, Cache-Control to match.
 */
import { Hono } from "hono";
import { datasetByKey, formatsFor, index, landingHtml, MIME, OPEN_DATA, render, type Format } from "../lib/open-data";

const baseOf = (url: string) => { const u = new URL(url); return `${u.protocol}//${u.host}`; };

const openDataRouter = new Hono();

openDataRouter.get("/", async (c) => {
  c.header("Cache-Control", `public, max-age=${OPEN_DATA.cacheSeconds}`);
  return c.json(await index(baseOf(c.req.url)));
});

openDataRouter.get("/:file", async (c) => {
  const file = c.req.param("file");
  const m = /^([a-z0-9-]+)\.(csv|json|geojson)$/.exec(file);
  if (!m) return c.json({ error: { message: "Expected <dataset>.<csv|json|geojson>; see /api/open-data for the list", code: "BAD_REQUEST" } }, 400);
  const d = datasetByKey(m[1]!);
  const format = m[2] as Format;
  if (!d) return c.json({ error: { message: `No dataset "${m[1]}"; see /api/open-data`, code: "NOT_FOUND" } }, 404);
  if (!formatsFor(d).includes(format)) return c.json({ error: { message: `${d.key} is not available as ${format}`, code: "BAD_REQUEST" } }, 400);
  const body = await render(d, format);
  c.header("Content-Type", MIME[format]);
  c.header("Content-Disposition", `attachment; filename="${d.key}.${format}"`);
  c.header("Cache-Control", `public, max-age=${OPEN_DATA.cacheSeconds}`);
  c.header("X-Licence", OPEN_DATA.licence.url);
  return c.body(body);
});

const openDataPageRouter = new Hono();
openDataPageRouter.get("/", async (c) => {
  c.header("Cache-Control", `public, max-age=${OPEN_DATA.cacheSeconds}`);
  return c.html(await landingHtml(baseOf(c.req.url)));
});

export { openDataRouter, openDataPageRouter };
