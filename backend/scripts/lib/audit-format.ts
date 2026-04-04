import type { AuditReport } from "./audit-loaders";

export function formatAuditSummary(report: AuditReport): string {
  const lines: string[] = [];

  lines.push(`Entity: ${report.entity}`);
  lines.push(
    `Query: "${report.query.name}" (match=${report.query.match}, caseSensitive=${report.query.caseSensitive})`
  );
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push(`Candidates found: ${report.candidateCount}`);

  if (report.candidateCount === 0) {
    lines.push("\nNo candidates found.");
  }

  report.candidates.forEach((candidate, index) => {
    lines.push("");
    lines.push(`[${index + 1}] id=${candidate.id}`);
    lines.push(`    name=${candidate.name}`);

    for (const [key, value] of Object.entries(candidate.summary)) {
      lines.push(`    ${key}=${stringifyValue(value)}`);
    }

    if (Object.keys(candidate.relatedCounts).length > 0) {
      lines.push(
        `    related=${Object.entries(candidate.relatedCounts)
          .map(([key, value]) => `${key}:${value}`)
          .join(", ")}`
      );
    }

    if (candidate.flags.length > 0) {
      lines.push(`    flags=${candidate.flags.join(", ")}`);
    }
  });

  if (report.overviewMatches && report.overviewMatches.length > 0) {
    lines.push("");
    lines.push("Overview matches:");
    report.overviewMatches.forEach((match, index) => {
      lines.push(
        `  [${index + 1}] id=${match.id}, name=${match.name}, region=${match.regionName ?? "n/a"}, ` +
          `nation=${match.hasNationPaths}, regionTier=${match.hasRegionPaths}, local=${match.hasLocalPaths}, ` +
          `bbox=${stringifyValue(match.bbox)}`
      );
    });
  }

  if (report.findings.length > 0) {
    lines.push("");
    lines.push("Findings:");
    for (const finding of report.findings) {
      lines.push(`- ${finding}`);
    }
  }

  if (report.recommendations.length > 0) {
    lines.push("");
    lines.push("Recommendations:");
    for (const recommendation of report.recommendations) {
      lines.push(`- ${recommendation}`);
    }
  }

  return lines.join("\n");
}

export function formatAuditReport(report: AuditReport): string {
  return JSON.stringify(report, null, 2);
}

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}
