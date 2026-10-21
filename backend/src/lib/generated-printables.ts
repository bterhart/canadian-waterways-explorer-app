/**
 * generated-printables.ts — printables made from the live data (roadmap item 13, 2026-10-21).
 *
 * Three kinds, each a complete HTML document with inline SVG, sized for Letter paper:
 *   blankMap(waterwayId, labels)            the river system drawn from the waterways' KML geometry,
 *                                           with numbers to label (and a key), a word bank, or the names
 *   timelineStrip(filter, blank)            the timeline events of a waterway, an explorer, a theme or a
 *                                           span of years on one dated strip, titles shown or left to fill
 *   pronunciationCards(filter)              the pronunciation guide as cut-out cards
 * Nothing is stored: the app previews the HTML and prints or shares it on the device.
 */
import { db } from "../db";
import { getWaterwaySystem } from "./connections";

const esc = (s: string | null | undefined) => (s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const PAGE_CSS = `@page { size: letter; margin: 14mm; }
body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #1F2937; margin: 0; padding: 16px 20px; font-size: 11pt; }
h1 { font-size: 18pt; margin: 0 0 2px; color: #1A3A24; } .sub { color: #6B7280; font-size: 9.5pt; margin: 0 0 10px; }
.foot { color: #9CA3AF; font-size: 8pt; margin-top: 10px; } .name { border-bottom: 1px solid #9CA3AF; display: inline-block; min-width: 180px; }
table { border-collapse: collapse; } th, td { border: 1px solid #D1D5DB; padding: 4px 8px; font-size: 10pt; vertical-align: top; } th { background: #F3F4F6; text-align: left; }
.pagebreak { page-break-before: always; }`;

const document = (title: string, subtitle: string, body: string, extraCss = ""): string =>
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><style>${PAGE_CSS}${extraCss}</style></head><body><h1>${esc(title)}</h1><p class="sub">${esc(subtitle)}</p>${body}<p class="foot">Canadian Waterways Explorer · made from the app's records on ${new Date().toISOString().slice(0, 10)}</p></body></html>`;

// ---------------------------------------------------------------- blank map

type Pt = [number, number]; // [lon, lat]

/** Every <coordinates> block of a KML document as a polyline, downsampled so the whole document keeps at most `budget` points. */
export function kmlLines(kml: string, budget = 1500): Pt[][] {
  const raw: Pt[][] = [];
  for (const m of kml.matchAll(/<coordinates>([\s\S]*?)<\/coordinates>/g)) {
    const pts: Pt[] = [];
    for (const tok of m[1]!.trim().split(/\s+/)) {
      const [lon, lat] = tok.split(",").map(Number);
      if (Number.isFinite(lon) && Number.isFinite(lat)) pts.push([lon!, lat!]);
    }
    if (pts.length >= 2) raw.push(pts);
  }
  const total = raw.reduce((n, l) => n + l.length, 0);
  const step = Math.max(1, Math.ceil(total / budget));
  return raw.map((pts) => {
    const out = pts.filter((_, i) => i % step === 0);
    if (out[out.length - 1] !== pts[pts.length - 1]) out.push(pts[pts.length - 1]!);
    return out;
  }).filter((l) => l.length >= 2);
}

export type MapLabels = "blank" | "numbered" | "named";

export async function blankMap(waterwayId: string, labels: MapLabels = "numbered", maxWaters = 24): Promise<{ title: string; html: string } | null> {
  const system = await getWaterwaySystem(waterwayId);
  if (!system) return null;
  // The viewed water first, then the connected waters nearest first; cap for legibility
  const ordered = [system.waterway.id, ...system.upstream.sort((a, b) => a.depth - b.depth || b.explorerCount - a.explorerCount).map((s) => s.id), ...system.downstream.map((s) => s.id), ...system.parts.map((s) => s.id), ...system.joins.map((s) => s.id), ...system.partOf.map((s) => s.id)];
  const ids = [...new Set(ordered)].slice(0, maxWaters);
  const waters = await db.waterway.findMany({ where: { id: { in: ids } }, select: { id: true, name: true, latitude: true, longitude: true, kmlData: true, regionName: true, type: { select: { name: true } } } });
  const byId = new Map(waters.map((w) => [w.id, w]));
  const drawn = ids.map((id) => byId.get(id)).filter((w): w is NonNullable<typeof w> => !!w && !!w.kmlData);
  if (drawn.length === 0) return null;

  const lines = drawn.map((w, i) => ({ w, lines: kmlLines(w.kmlData!, i === 0 ? 2500 : 900) }));
  const all = lines.flatMap((l) => l.lines.flat());
  let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
  for (const [lon, lat] of all) { minLon = Math.min(minLon, lon); maxLon = Math.max(maxLon, lon); minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat); }
  const padDeg = 0.04 * Math.max(maxLon - minLon, maxLat - minLat, 0.5);
  minLon -= padDeg; maxLon += padDeg; minLat -= padDeg; maxLat += padDeg;
  const W = 740, H = 540, P = 20;
  const cosLat = Math.cos(((minLat + maxLat) / 2) * Math.PI / 180);
  const scale = Math.min((W - 2 * P) / ((maxLon - minLon) * cosLat), (H - 2 * P) / (maxLat - minLat));
  const drawW = (maxLon - minLon) * cosLat * scale, drawH = (maxLat - minLat) * scale;
  const ox = P + ((W - 2 * P) - drawW) / 2, oy = P + ((H - 2 * P) - drawH) / 2;
  const X = (lon: number) => ox + (lon - minLon) * cosLat * scale;
  const Y = (lat: number) => oy + (maxLat - lat) * scale;
  const f = (n: number) => n.toFixed(1);

  const paths = lines.map(({ lines: ls }, i) => {
    const d = ls.map((pts) => pts.map(([lon, lat], k) => `${k === 0 ? "M" : "L"}${f(X(lon))} ${f(Y(lat))}`).join("")).join("");
    return `<path d="${d}" fill="none" stroke="${i === 0 ? "#1D4ED8" : "#3B82A3"}" stroke-width="${i === 0 ? 2.6 : 1.6}" stroke-linejoin="round" stroke-linecap="round"/>`;
  }).join("");
  // Label anchors: the water's own point if it falls on the map, else the midpoint of its first line
  const anchors = lines.map(({ w, lines: ls }) => {
    const inside = w.longitude >= minLon && w.longitude <= maxLon && w.latitude >= minLat && w.latitude <= maxLat;
    const mid = ls[0]![Math.floor(ls[0]!.length / 2)]!;
    return inside ? [X(w.longitude), Y(w.latitude)] : [X(mid[0]), Y(mid[1])];
  });
  const markers = labels === "blank" ? "" : anchors.map(([x, y], i) => {
    const w = drawn[i]!;
    if (labels === "named") return `<text x="${f(x! + 6)}" y="${f(y! - 6)}" font-size="11" font-weight="700" fill="#111827" stroke="#ffffff" stroke-width="3" paint-order="stroke">${esc(w.name)}</text>`;
    return `<circle cx="${f(x!)}" cy="${f(y!)}" r="9" fill="#ffffff" stroke="#111827" stroke-width="1.2"/><text x="${f(x!)}" y="${f(y! + 3.8)}" font-size="10.5" font-weight="700" text-anchor="middle" fill="#111827">${i + 1}</text>`;
  }).join("");
  // Scale bar: 50, 100 or 200 km, whichever fits a tenth of the width
  const pxPerKm = scale / 111.2;
  const km = [500, 200, 100, 50, 20].find((k) => k * pxPerKm <= W * 0.22) ?? 10;
  const barPx = km * pxPerKm;
  const scaleBar = `<g transform="translate(${P + 4},${H - 14})"><line x1="0" y1="0" x2="${f(barPx)}" y2="0" stroke="#111827" stroke-width="2"/><line x1="0" y1="-4" x2="0" y2="4" stroke="#111827" stroke-width="2"/><line x1="${f(barPx)}" y1="-4" x2="${f(barPx)}" y2="4" stroke="#111827" stroke-width="2"/><text x="${f(barPx / 2)}" y="-6" font-size="9.5" text-anchor="middle" fill="#111827">${km} km</text></g>`;
  const north = `<g transform="translate(${W - 26},${P + 24})"><polygon points="0,-14 5,6 0,2 -5,6" fill="#111827"/><text x="0" y="18" font-size="9.5" text-anchor="middle" fill="#111827">N</text></g>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" style="border:1px solid #D1D5DB;border-radius:6px;background:#FBFDFF">${paths}${markers}${scaleBar}${north}</svg>`;

  const main = drawn[0]!;
  const names = drawn.map((w) => w.name);
  let side = "";
  if (labels === "numbered") {
    const rows = drawn.map((_, i) => `<tr><td style="width:28px;text-align:center;font-weight:700">${i + 1}</td><td><span class="name">&nbsp;</span></td></tr>`).join("");
    const bank = [...names].sort((a, b) => a.localeCompare(b)).map((n) => `<span class="bank">${esc(n)}</span>`).join("");
    side = `<h3>Label the waters</h3><p class="hint">Write each number's name. The word bank has every name once.</p><table style="width:100%">${rows}</table><p class="bankWrap">${bank}</p><div class="pagebreak"></div><h3>Answer key</h3><table style="width:100%">${drawn.map((w, i) => `<tr><td style="width:28px;text-align:center;font-weight:700">${i + 1}</td><td>${esc(w.name)}</td><td style="color:#6B7280">${esc(w.type.name)}${w.regionName ? ` · ${esc(w.regionName)}` : ""}</td></tr>`).join("")}</table>`;
  } else if (labels === "blank") {
    side = `<h3>Name the waters</h3><p class="hint">Draw a line from each water to its name, or write the names on the map. The word bank has every drawn water once.</p><p class="bankWrap">${[...names].sort((a, b) => a.localeCompare(b)).map((n) => `<span class="bank">${esc(n)}</span>`).join("")}</p>`;
  } else {
    side = `<h3>The waters shown</h3><table style="width:100%">${drawn.map((w) => `<tr><td>${esc(w.name)}</td><td style="color:#6B7280">${esc(w.type.name)}${w.regionName ? ` · ${esc(w.regionName)}` : ""}</td></tr>`).join("")}</table>`;
  }
  const notDrawn = ids.length - drawn.length;
  const title = `${main.name}: the river system`;
  const subtitle = `${drawn.length} connected waters drawn from the app's geometry${notDrawn ? `; ${notDrawn} connected water${notDrawn === 1 ? " has" : "s have"} no drawn geometry and ${notDrawn === 1 ? "is" : "are"} left off` : ""}. Thicker line: ${main.name}.`;
  const css = `.hint{color:#6B7280;font-size:9.5pt;margin:0 0 6px}.bankWrap{line-height:2}.bank{display:inline-block;border:1px solid #D1D5DB;border-radius:12px;padding:1px 9px;margin:0 6px 4px 0;font-size:9.5pt}h3{font-size:12pt;margin:12px 0 4px;color:#2D5A3D}`;
  return { title, html: document(title, subtitle, svg + side, css) };
}

// ---------------------------------------------------------------- timeline strip

export interface TimelineFilter { waterwayId?: string; explorerId?: string; theme?: string; startYear?: number; endYear?: number }

export async function timelineStrip(filter: TimelineFilter, blank = false, maxEvents = 22): Promise<{ title: string; html: string } | null> {
  const where: Record<string, unknown> = {};
  if (filter.waterwayId) where.waterwayId = filter.waterwayId;
  if (filter.explorerId) where.explorerId = filter.explorerId;
  if (filter.theme) where.theme = filter.theme;
  if (filter.startYear || filter.endYear) where.year = { ...(filter.startYear ? { gte: filter.startYear } : {}), ...(filter.endYear ? { lte: filter.endYear } : {}) };
  if (Object.keys(where).length === 0) return null;
  const events = await db.timelineEvent.findMany({ where, orderBy: [{ year: "asc" }, { month: "asc" }, { day: "asc" }], take: maxEvents, select: { id: true, title: true, description: true, year: true, month: true, day: true, endYear: true, theme: true, isApproximate: true } });
  if (events.length === 0) return null;
  const [water, explorer] = await Promise.all([
    filter.waterwayId ? db.waterway.findUnique({ where: { id: filter.waterwayId }, select: { name: true } }) : null,
    filter.explorerId ? db.explorer.findUnique({ where: { id: filter.explorerId }, select: { name: true } }) : null,
  ]);
  const subject = water?.name ?? explorer?.name ?? (filter.theme ? filter.theme.replace(/_/g, " ") : `${filter.startYear ?? ""}–${filter.endYear ?? ""}`);
  const y0 = events[0]!.year, y1 = Math.max(events[events.length - 1]!.year, y0 + 1);
  const W = 1040, H = 360, L = 40, R = 40, axisY = 185;
  const X = (y: number) => L + ((y - y0) / (y1 - y0)) * (W - L - R);
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateOf = (e: typeof events[number]) => `${e.isApproximate ? "c. " : ""}${e.day && e.month ? `${e.day} ${MONTHS[e.month - 1]} ` : e.month ? `${MONTHS[e.month - 1]} ` : ""}${e.year}${e.endYear && e.endYear !== e.year ? `–${e.endYear}` : ""}`;
  const wrap = (s: string, n: number) => { const words = s.split(" "); const out: string[] = []; let cur = ""; for (const w of words) { if ((cur + " " + w).trim().length > n && cur) { out.push(cur); cur = w; } else cur = (cur + " " + w).trim(); } if (cur) out.push(cur); return out.slice(0, 3); };
  // Alternate above and below; nudge crowded neighbours apart
  const xs = events.map((e) => X(e.year));
  for (let i = 1; i < xs.length; i++) if (xs[i]! - xs[i - 1]! < 14) xs[i] = xs[i - 1]! + 14;
  const items = events.map((e, i) => {
    const x = xs[i]!, up = i % 2 === 0, dir = up ? -1 : 1;
    const tx = Math.min(W - 70, Math.max(70, x)); // keep the wrapped title inside the strip at either end
    const ly = axisY + dir * (up ? 34 : 34), textY = axisY + dir * (up ? 52 : 46);
    const lines = blank ? [] : wrap(e.title, 24);
    const label = blank
      ? `<line x1="${tx - 28}" y1="${textY}" x2="${tx + 28}" y2="${textY}" stroke="#9CA3AF" stroke-width="1"/><line x1="${tx - 28}" y1="${textY + dir * 14}" x2="${tx + 28}" y2="${textY + dir * 14}" stroke="#9CA3AF" stroke-width="1"/>`
      : lines.map((t, k) => `<text x="${tx}" y="${textY + (up ? -(lines.length - 1 - k) * 12 : k * 12)}" font-size="9" text-anchor="middle" fill="#111827">${esc(t)}</text>`).join("");
    return `<line x1="${x}" y1="${axisY}" x2="${x}" y2="${ly}" stroke="#6B7280" stroke-width="1"/><circle cx="${x}" cy="${axisY}" r="4" fill="#2D5A3D"/><text x="${x}" y="${axisY + dir * (up ? 10 : 16) + (up ? -2 : 0)}" font-size="8.5" font-weight="700" text-anchor="middle" fill="#2D5A3D">${esc(dateOf(e))}</text>${label}`;
  }).join("");
  const axis = `<line x1="${L - 10}" y1="${axisY}" x2="${W - R + 10}" y2="${axisY}" stroke="#111827" stroke-width="1.5"/><polygon points="${W - R + 10},${axisY - 4} ${W - R + 18},${axisY} ${W - R + 10},${axisY + 4}" fill="#111827"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" style="border:1px solid #D1D5DB;border-radius:6px;background:#FFFFFF">${axis}${items}</svg>`;
  const list = blank
    ? `<h3>Place these on the strip</h3><p class="hint">Each event belongs at one date. Write it on the lines at that date.</p><p class="bankWrap">${[...events].sort((a, b) => a.title.localeCompare(b.title)).map((e) => `<span class="bank">${esc(e.title)}</span>`).join("")}</p>`
    : `<h3>The events</h3><table style="width:100%">${events.map((e) => `<tr><td style="white-space:nowrap;font-weight:700;color:#2D5A3D">${esc(dateOf(e))}</td><td><strong>${esc(e.title)}</strong><br><span style="color:#4B5563">${esc(e.description)}</span></td></tr>`).join("")}</table>`;
  const title = `${subject}: a timeline`;
  const subtitle = `${events.length} dated events from the app's timeline, ${y0} to ${events[events.length - 1]!.year}${events.length === maxEvents ? ` (the first ${maxEvents})` : ""}.`;
  const css = `.hint{color:#6B7280;font-size:9.5pt;margin:0 0 6px}.bankWrap{line-height:2}.bank{display:inline-block;border:1px solid #D1D5DB;border-radius:12px;padding:1px 9px;margin:0 6px 4px 0;font-size:9.5pt}h3{font-size:12pt;margin:12px 0 4px;color:#2D5A3D}`;
  return { title, html: document(title, subtitle, svg + list, css) };
}

// ---------------------------------------------------------------- pronunciation cards

export interface CardsFilter { language?: string; termType?: string; waterwayId?: string }

export async function pronunciationCards(filter: CardsFilter, maxCards = 32): Promise<{ title: string; html: string } | null> {
  const where: Record<string, unknown> = {};
  if (filter.language) where.language = filter.language;
  if (filter.termType) where.termType = filter.termType;
  if (filter.waterwayId) where.waterwayId = filter.waterwayId;
  const rows = await db.pronunciationGuide.findMany({ where, orderBy: { term: "asc" }, take: maxCards, select: { term: true, termType: true, language: true, phonetic: true, meaning: true, notes: true } });
  if (rows.length === 0) return null;
  const cards = rows.map((r) => `<div class="card"><div class="term">${esc(r.term)}</div><div class="phon">${esc(r.phonetic)}</div><div class="lang">${esc(r.language)}${r.termType ? ` · ${esc(r.termType.replace(/_/g, " "))}` : ""}</div>${r.meaning ? `<div class="meaning">${esc(r.meaning)}</div>` : ""}${r.notes ? `<div class="notes">${esc(r.notes)}</div>` : ""}</div>`).join("");
  const subject = filter.language ?? (filter.termType ? filter.termType.replace(/_/g, " ") : "the guide");
  const title = `Pronunciation cards: ${subject}`;
  const subtitle = `${rows.length} terms from the app's pronunciation guide, cut along the lines. The phonetic spelling is the one recorded on each term; where a nation has recorded the word, their recording is the authority.`;
  const css = `.grid{display:grid;grid-template-columns:1fr 1fr;gap:0}.card{border:1px dashed #9CA3AF;padding:12px 14px;min-height:118px;page-break-inside:avoid}.term{font-size:16pt;font-weight:800;color:#1A3A24}.phon{font-size:12pt;color:#2D5A3D;margin:2px 0 4px;font-family:Georgia,serif}.lang{font-size:9pt;color:#6B7280;text-transform:uppercase;letter-spacing:.5px}.meaning{font-size:10.5pt;margin-top:6px}.notes{font-size:9pt;color:#4B5563;margin-top:4px}`;
  return { title, html: document(title, subtitle, `<div class="grid">${cards}</div>`, css) };
}

// ---------------------------------------------------------------- options for the pickers

export async function printableOptions() {
  const [waters, themes, explorers, languages, termTypes] = await Promise.all([
    db.waterway.findMany({ where: { kmlData: { not: null } }, select: { id: true, name: true, regionName: true }, orderBy: { name: "asc" } }),
    db.timelineEvent.groupBy({ by: ["theme"], _count: { _all: true }, orderBy: { theme: "asc" } }),
    db.timelineEvent.groupBy({ by: ["explorerId"], _count: { _all: true }, where: { explorerId: { not: null } } }),
    db.pronunciationGuide.groupBy({ by: ["language"], _count: { _all: true }, where: { language: { not: null } }, orderBy: { language: "asc" } }),
    db.pronunciationGuide.groupBy({ by: ["termType"], _count: { _all: true }, orderBy: { termType: "asc" } }),
  ]);
  const explorerRows = await db.explorer.findMany({ where: { id: { in: explorers.map((e) => e.explorerId!).filter(Boolean) } }, select: { id: true, name: true }, orderBy: { name: "asc" } });
  const eventCount = new Map(explorers.map((e) => [e.explorerId, e._count._all]));
  const timelineWaters = await db.timelineEvent.groupBy({ by: ["waterwayId"], _count: { _all: true }, where: { waterwayId: { not: null } } });
  const twCount = new Map(timelineWaters.map((t) => [t.waterwayId, t._count._all]));
  return {
    waterways: waters.map((w) => ({ id: w.id, name: w.name, regionName: w.regionName, timelineEvents: twCount.get(w.id) ?? 0 })),
    themes: themes.map((t) => ({ theme: t.theme, events: t._count._all })),
    explorers: explorerRows.map((e) => ({ id: e.id, name: e.name, events: eventCount.get(e.id) ?? 0 })).filter((e) => e.events > 0),
    languages: languages.map((l) => ({ language: l.language!, terms: l._count._all })),
    termTypes: termTypes.map((t) => ({ termType: t.termType, terms: t._count._all })),
  };
}
