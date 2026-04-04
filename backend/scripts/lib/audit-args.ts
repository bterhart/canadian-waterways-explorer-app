export type AuditEntityType = "waterway" | "location" | "explorer";
export type AuditMatchMode = "exact" | "contains" | "startsWith";

export interface AuditArgs {
  entity: AuditEntityType;
  name: string;
  match: AuditMatchMode;
  caseSensitive: boolean;
  json: boolean;
  out?: string;
  withOverview: boolean;
  withKmlSummary: boolean;
  withRelated: boolean;
}

const HELP_TEXT = `
Usage:
  bun run scripts/audit-entity-duplicates.ts --entity=<waterway|location|explorer> --name="<name>"

Options:
  --entity=waterway|location|explorer
  --name="<entity name>"
  --match=exact|contains|startsWith   (default: exact)
  --case-sensitive=true|false         (default: false)
  --json                              Print full JSON report
  --out=<path>                        Write JSON report to a file
  --with-overview                     Inspect generated overview dataset (waterway only)
  --with-kml-summary                  Reserved for future KML-specific summaries
  --with-related                      Load related-table counts and flags
  --help                              Show this help
`.trim();

export function parseAuditArgs(argv: string[]): AuditArgs {
  const args: AuditArgs = {
    entity: "waterway",
    name: "",
    match: "exact",
    caseSensitive: false,
    json: false,
    withOverview: false,
    withKmlSummary: false,
    withRelated: false,
  };

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      console.log(HELP_TEXT);
      process.exit(0);
    }

    if (arg === "--json") {
      args.json = true;
      continue;
    }

    if (arg === "--with-overview") {
      args.withOverview = true;
      continue;
    }

    if (arg === "--with-kml-summary") {
      args.withKmlSummary = true;
      continue;
    }

    if (arg === "--with-related") {
      args.withRelated = true;
      continue;
    }

    if (arg.startsWith("--entity=")) {
      const value = arg.slice("--entity=".length).trim();
      if (value !== "waterway" && value !== "location" && value !== "explorer") {
        throw new Error(`Invalid --entity value: ${value}`);
      }
      args.entity = value;
      continue;
    }

    if (arg.startsWith("--name=")) {
      args.name = stripWrappingQuotes(arg.slice("--name=".length).trim());
      continue;
    }

    if (arg.startsWith("--match=")) {
      const value = arg.slice("--match=".length).trim();
      if (value !== "exact" && value !== "contains" && value !== "startsWith") {
        throw new Error(`Invalid --match value: ${value}`);
      }
      args.match = value;
      continue;
    }

    if (arg.startsWith("--case-sensitive=")) {
      const value = arg.slice("--case-sensitive=".length).trim().toLowerCase();
      if (value !== "true" && value !== "false") {
        throw new Error(`Invalid --case-sensitive value: ${value}`);
      }
      args.caseSensitive = value === "true";
      continue;
    }

    if (arg.startsWith("--out=")) {
      args.out = stripWrappingQuotes(arg.slice("--out=".length).trim());
      continue;
    }
  }

  if (!args.name) {
    throw new Error(`Missing required --name argument.\n\n${HELP_TEXT}`);
  }

  if (args.withOverview && args.entity !== "waterway") {
    throw new Error("--with-overview is only valid for --entity=waterway");
  }

  return args;
}

function stripWrappingQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}
