// Structured citations for a record (roadmap item 14, 2026-10-19): read from the Citation table
// and formatted as text, BibTeX, RIS or CSV. Also builds the citation for the app's own record.
import { db } from "../db";

export const CITATION_TARGET_TYPES = ["waterway", "location", "explorer", "notable_figure", "document", "discovery"] as const;
export type CitationTargetType = (typeof CITATION_TARGET_TYPES)[number];
export const CITATION_KINDS = ["dcb", "encyclopedia", "edition", "archive", "place_name_record", "parks_canada", "book", "article", "web"] as const;
export type CitationKind = (typeof CITATION_KINDS)[number];

export interface CitationRow {
  id: string;
  kind: string;
  author: string | null;
  title: string;
  container: string | null;
  publisher: string | null;
  year: string | null;
  pages: string | null;
  url: string | null;
  accessed: string | null;
  note: string | null;
}

export function isCitationTargetType(value: string): value is CitationTargetType {
  return (CITATION_TARGET_TYPES as readonly string[]).includes(value);
}

export async function getCitations(targetType: CitationTargetType, targetId: string): Promise<CitationRow[]> {
  return db.citation.findMany({
    where: { targetType, targetId },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true, kind: true, author: true, title: true, container: true, publisher: true, year: true, pages: true, url: true, accessed: true, note: true },
  });
}

const APP_NAME = "Canadian Interactive Waterways Initiative";
const RECORD_LABEL: Record<CitationTargetType, string> = {
  waterway: "waterway record", location: "historic place record", explorer: "explorer record",
  notable_figure: "notable figure record", document: "primary-source document record", discovery: "archaeological discovery record",
};

/** The citation for the app's own record, so a reader can cite what they read here. */
export function recordCitation(targetType: CitationTargetType, title: string, today = new Date()): CitationRow {
  return {
    id: `record-${targetType}`, kind: "web", author: APP_NAME, title, container: `${APP_NAME}, ${RECORD_LABEL[targetType]}`,
    publisher: null, year: String(today.getUTCFullYear()), pages: null, url: null, accessed: today.toISOString().slice(0, 10), note: null,
  };
}

/** One-line reference in a Chicago-like order: Author. Title. Container. Publisher, Year. Pages. URL. */
export function formatText(c: CitationRow): string {
  const parts: string[] = [];
  if (c.author) parts.push(endStop(c.author));
  parts.push(endStop(c.title));
  if (c.container) parts.push(endStop(c.container));
  const pubYear = [c.publisher, c.year].filter(Boolean).join(", ");
  if (pubYear) parts.push(endStop(pubYear));
  if (c.pages) parts.push(endStop(c.pages));
  if (c.url) parts.push(c.url + (c.accessed ? ` (accessed ${c.accessed})` : ""));
  return parts.join(" ");
}
const endStop = (s: string) => (/[.!?]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);

const bibtexType: Record<string, string> = { edition: "book", book: "book", article: "article", dcb: "misc", encyclopedia: "misc", archive: "misc", place_name_record: "misc", parks_canada: "misc", web: "misc" };
const bibEscape = (s: string) => s.replace(/[{}]/g, "").replace(/&/g, "\\&").replace(/%/g, "\\%");
export function formatBibtex(rows: CitationRow[]): string {
  const used = new Set<string>();
  return rows.map((c) => {
    const firstWord = (c.author ?? c.title).split(/[\s,]+/)[0] ?? "";
    const base = `${firstWord.toLowerCase().replace(/[^a-z]/g, "") || "ref"}${c.year ?? ""}`;
    let key = base; let n = 2; while (used.has(key)) key = `${base}${n++}`; used.add(key);
    const f: Array<[string, string | null]> = [["author", c.author], ["title", c.title]];
    if (bibtexType[c.kind] === "article") f.push(["journal", c.container]); else if (c.container) f.push(["howpublished", c.container]);
    f.push(["publisher", c.publisher], ["year", c.year], ["pages", c.pages], ["url", c.url], ["urldate", c.accessed], ["note", c.note]);
    const body = f.filter((x): x is [string, string] => !!x[1]).map(([k, v]) => `  ${k} = {${bibEscape(v)}}`).join(",\n");
    return `@${bibtexType[c.kind] ?? "misc"}{${key},\n${body}\n}`;
  }).join("\n\n");
}

const risType: Record<string, string> = { edition: "BOOK", book: "BOOK", article: "JOUR", dcb: "ENCYC", encyclopedia: "ENCYC", archive: "ELEC", place_name_record: "ELEC", parks_canada: "ELEC", web: "ELEC" };
export function formatRis(rows: CitationRow[]): string {
  return rows.map((c) => {
    const lines = [`TY  - ${risType[c.kind] ?? "ELEC"}`];
    if (c.author) lines.push(`AU  - ${c.author}`);
    lines.push(`TI  - ${c.title}`);
    if (c.container) lines.push(`T2  - ${c.container}`);
    if (c.publisher) lines.push(`PB  - ${c.publisher}`);
    if (c.year) lines.push(`PY  - ${c.year}`);
    if (c.pages) lines.push(`SP  - ${c.pages}`);
    if (c.url) lines.push(`UR  - ${c.url}`);
    if (c.accessed) lines.push(`Y2  - ${c.accessed}`);
    if (c.note) lines.push(`N1  - ${c.note}`);
    lines.push("ER  - ");
    return lines.join("\n");
  }).join("\n\n");
}

const csvCell = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;
export function formatCsv(rows: CitationRow[]): string {
  const header = ["kind", "author", "title", "container", "publisher", "year", "pages", "url", "accessed", "note"];
  return [header.join(","), ...rows.map((c) => [c.kind, c.author, c.title, c.container, c.publisher, c.year, c.pages, c.url, c.accessed, c.note].map(csvCell).join(","))].join("\n");
}

export const EXPORT_FORMATS = { bibtex: { fn: formatBibtex, mime: "application/x-bibtex", ext: "bib" }, ris: { fn: formatRis, mime: "application/x-research-info-systems", ext: "ris" }, csv: { fn: formatCsv, mime: "text/csv", ext: "csv" }, text: { fn: (rows: CitationRow[]) => rows.map(formatText).join("\n\n"), mime: "text/plain", ext: "txt" } } as const;
export type ExportFormat = keyof typeof EXPORT_FORMATS;
