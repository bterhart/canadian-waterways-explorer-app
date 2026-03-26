/**
 * admin-image-health.ts
 *
 * GET /api/admin/image-health
 *   Returns the most recent health check run: a summary and the list of
 *   broken / unresolved URLs for manual review.
 *
 * POST /api/admin/image-health/run
 *   Triggers an immediate health check (runs in background; returns 202).
 *
 * Both routes require admin authentication (requireAdmin middleware).
 */

import { Hono } from "hono";
import { prisma } from "../prisma";
import { requireAdmin } from "../lib/admin-middleware";
import { runImageHealthCheck } from "../jobs/image-health-check";

const adminImageHealthRouter = new Hono();

adminImageHealthRouter.use("*", requireAdmin);

// GET /api/admin/image-health
adminImageHealthRouter.get("/", async (c) => {
  // Find the timestamp of the most recent check run
  const latest = await prisma.imageHealthLog.findFirst({
    orderBy: { checkedAt: "desc" },
    select: { checkedAt: true },
  });

  if (!latest) {
    return c.json({
      data: {
        lastCheckedAt: null,
        summary: null,
        broken: [],
      },
    });
  }

  // Fetch all log entries from that run (within a 10-minute window to
  // account for the run duration)
  const windowStart = new Date(latest.checkedAt.getTime() - 10 * 60 * 1000);

  const entries = await prisma.imageHealthLog.findMany({
    where: { checkedAt: { gte: windowStart } },
    orderBy: { model: "asc" },
  });

  const counts = { healthy: 0, broken: 0, rate_limited: 0, unreachable: 0, repaired: 0 };
  for (const e of entries) {
    const s = e.status as keyof typeof counts;
    if (s in counts) counts[s]++;
  }

  const broken = entries
    .filter((e) => e.status === "broken" || e.status === "unreachable")
    .map((e) => ({
      model: e.model,
      recordId: e.recordId,
      field: e.field,
      url: e.url,
      status: e.status,
    }));

  return c.json({
    data: {
      lastCheckedAt: latest.checkedAt,
      summary: { total: entries.length, ...counts },
      broken,
    },
  });
});

// POST /api/admin/image-health/run — trigger an immediate check
adminImageHealthRouter.post("/run", async (c) => {
  // Fire and forget — does not block the response
  runImageHealthCheck().catch((err) =>
    console.error("[ImageHealthCheck] Manual trigger error:", err)
  );
  return c.json({ data: { message: "Health check started in background." } }, 202);
});

export { adminImageHealthRouter };
