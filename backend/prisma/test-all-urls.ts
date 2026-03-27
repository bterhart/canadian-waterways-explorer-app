import { readFileSync, writeFileSync } from "fs";

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function testUrl(url: string): Promise<{ code: number; finalUrl: string }> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
      signal: AbortSignal.timeout(8000),
    });
    return { code: res.status, finalUrl: res.url };
  } catch (e) {
    return { code: 0, finalUrl: `ERROR: ${e}` };
  }
}

async function main() {
  const raw = readFileSync("prisma/image-export.csv", "utf-8");
  const lines = raw.split("\n");
  const header = lines[0]!;
  const dataLines = lines.slice(1).filter(l => l.trim().length > 0);

  console.log(`Testing ${dataLines.length} URLs from image-export.csv...\n`);

  // CSV columns: table,id,name,field,is_hero,url,caption,credit
  // Parse carefully — some fields are quoted and may contain commas
  function parseCsvRow(line: string): string[] {
    const fields: string[] = [];
    let inQuote = false;
    let current = "";
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]!;
      if (ch === '"' && !inQuote) { inQuote = true; continue; }
      if (ch === '"' && inQuote) {
        if (line[i + 1] === '"') { current += '"'; i++; continue; }
        inQuote = false; continue;
      }
      if (ch === "," && !inQuote) { fields.push(current); current = ""; continue; }
      current += ch;
    }
    fields.push(current);
    return fields;
  }

  // Output CSV: original columns + http_code + status + final_url
  const outRows: string[] = [
    header + ",http_code,status,final_url"
  ];

  const summary: Record<string, number> = {};
  const broken: Array<{ table: string; name: string; field: string; url: string; code: number; status: string }> = [];

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i]!;
    const fields = parseCsvRow(line);
    const table = fields[0] ?? "";
    const id = fields[1] ?? "";
    const name = fields[2] ?? "";
    const field = fields[3] ?? "";
    const is_hero = fields[4] ?? "";
    const url = fields[5] ?? "";
    const caption = fields[6] ?? "";
    const credit = fields[7] ?? "";

    if (!url) continue;

    process.stdout.write(`[${i + 1}/${dataLines.length}] ${table} "${name.substring(0, 30)}"... `);

    const { code, finalUrl } = await testUrl(url);

    const status =
      code === 200 ? "OK" :
      code === 404 ? "NOT_FOUND" :
      code === 429 ? "RATE_LIMITED" :
      code === 0   ? "ERROR" :
                     `HTTP_${code}`;

    console.log(status);

    summary[status] = (summary[status] ?? 0) + 1;

    if (status !== "OK" && status !== "RATE_LIMITED") {
      broken.push({ table, name, field, url, code, status });
    }

    // Escape for CSV
    function esc(v: string) {
      if (v.includes(",") || v.includes('"') || v.includes("\n")) return `"${v.replace(/"/g, '""')}"`;
      return v;
    }

    outRows.push(
      [table, id, name, field, is_hero, url, caption, credit, String(code), status, finalUrl]
        .map(esc).join(",")
    );

    await delay(200);
  }

  // Write results CSV
  writeFileSync("prisma/image-test-results.csv", outRows.join("\n"), "utf8");

  console.log("\n========= SUMMARY =========");
  for (const [s, c] of Object.entries(summary).sort()) {
    console.log(`  ${s}: ${c}`);
  }
  console.log(`  TOTAL: ${dataLines.length}`);

  console.log("\n========= BROKEN URLs =========");
  for (const b of broken) {
    console.log(`  [${b.status}] ${b.table} | ${b.name} | ${b.field}`);
    console.log(`    ${b.url}`);
  }

  console.log(`\nFull results written to: prisma/image-test-results.csv`);
}

main().catch(console.error);
