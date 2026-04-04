import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { prisma } from "../src/prisma";
import { parseAuditArgs } from "./lib/audit-args";
import { formatAuditReport, formatAuditSummary } from "./lib/audit-format";
import {
  loadExplorerCandidates,
  loadLocationCandidates,
  loadWaterwayCandidates,
  type AuditReport,
  type CandidateContext,
} from "./lib/audit-loaders";
import {
  buildExplorerRecommendations,
  buildLocationRecommendations,
  buildWaterwayRecommendations,
  loadExplorerRelations,
  loadLocationRelations,
  loadWaterwayRelations,
} from "./lib/audit-relations";
import { loadOverviewMatches } from "./lib/audit-overview";

async function main(): Promise<void> {
  const args = parseAuditArgs(Bun.argv.slice(2));

  let report: AuditReport;
  let contexts: CandidateContext[] = [];

  if (args.entity === "waterway") {
    const result = await loadWaterwayCandidates(prisma, args);
    report = result.report;
    contexts = result.contexts;

    if (args.withRelated && contexts.length > 0) {
      const relations = await loadWaterwayRelations(prisma, contexts.map((context) => context.id));
      for (const candidate of report.candidates) {
        const relation = relations[candidate.id];
        if (!relation) continue;
        candidate.relatedCounts = relation.relatedCounts;
        candidate.flags.push(...relation.flags);
      }
    }

    if (args.withOverview) {
      report.overviewMatches = await loadOverviewMatches({
        entity: "waterway",
        name: args.name,
        candidateIds: contexts.map((context) => context.id),
      });

      const overviewIds = new Set(report.overviewMatches.map((match) => match.id));
      for (const candidate of report.candidates) {
        if (overviewIds.has(candidate.id)) {
          candidate.flags.push("present_in_overview_dataset");
        } else {
          candidate.flags.push("missing_from_overview_dataset");
        }
      }
    }

    const summary = buildWaterwayRecommendations(report, contexts);
    report.findings.push(...summary.findings);
    report.recommendations.push(...summary.recommendations);
  } else if (args.entity === "location") {
    const result = await loadLocationCandidates(prisma, args);
    report = result.report;
    contexts = result.contexts;

    if (args.withRelated && contexts.length > 0) {
      const relations = await loadLocationRelations(prisma, contexts.map((context) => context.id));
      for (const candidate of report.candidates) {
        const relation = relations[candidate.id];
        if (!relation) continue;
        candidate.relatedCounts = relation.relatedCounts;
        candidate.flags.push(...relation.flags);
      }
    }

    const summary = buildLocationRecommendations(report, contexts);
    report.findings.push(...summary.findings);
    report.recommendations.push(...summary.recommendations);
  } else {
    const result = await loadExplorerCandidates(prisma, args);
    report = result.report;
    contexts = result.contexts;

    if (args.withRelated && contexts.length > 0) {
      const relations = await loadExplorerRelations(prisma, contexts.map((context) => context.id));
      for (const candidate of report.candidates) {
        const relation = relations[candidate.id];
        if (!relation) continue;
        candidate.relatedCounts = relation.relatedCounts;
        candidate.flags.push(...relation.flags);
      }
    }

    const summary = buildExplorerRecommendations(report, contexts);
    report.findings.push(...summary.findings);
    report.recommendations.push(...summary.recommendations);
  }

  report.findings = uniqueStrings(report.findings);
  report.recommendations = uniqueStrings(report.recommendations);
  for (const candidate of report.candidates) {
    candidate.flags = uniqueStrings(candidate.flags).sort();
  }

  console.log(formatAuditSummary(report));

  if (args.json) {
    console.log("\nJSON\n");
    console.log(formatAuditReport(report));
  }

  if (args.out) {
    const absoluteOutFile = resolve(process.cwd(), args.out);
    await mkdir(dirname(absoluteOutFile), { recursive: true });
    await Bun.write(absoluteOutFile, `${formatAuditReport(report)}\n`);
    console.log(`\nWrote audit report to ${absoluteOutFile}`);
  }
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
