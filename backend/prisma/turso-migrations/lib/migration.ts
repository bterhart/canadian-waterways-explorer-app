// Shared plumbing for the one-off data scripts in this folder: dry run by default,
// --apply to write, a JSON backup of the rows about to change, and a plain report.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

export const APPLY = process.argv.includes("--apply");
const BACKUP_DIR = resolve(import.meta.dir, "..", "backups");

export function writeBackup(name: string, payload: unknown): string {
  mkdirSync(BACKUP_DIR, { recursive: true });
  const file = resolve(BACKUP_DIR, `${name}.json`);
  writeFileSync(file, JSON.stringify({ generatedAt: new Date().toISOString(), apply: APPLY, ...(payload as object) }, null, 1));
  return file;
}

export function report(title: string, body: unknown): void {
  console.log(`\n== ${title} (${APPLY ? "APPLY" : "DRY RUN"})`);
  console.log(typeof body === "string" ? body : JSON.stringify(body, null, 1));
}

export function parseJsonArray<T>(raw: string | null | undefined): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}
