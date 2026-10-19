// Structured citations (roadmap item 14, 2026-10-19). Mirrors backend/src/lib/citations.ts.
export type CitationTargetType = 'waterway' | 'location' | 'explorer' | 'notable_figure' | 'document' | 'discovery';

export interface Citation {
  id: string;
  kind: string; // dcb | encyclopedia | edition | archive | place_name_record | parks_canada | book | article | web
  author: string | null;
  title: string;
  container: string | null;
  publisher: string | null;
  year: string | null;
  pages: string | null;
  url: string | null;
  accessed: string | null;
  note: string | null;
  /** The reference formatted as one line by the server. */
  text: string;
}

export interface CitationsResponse {
  citations: Citation[];
  recordCitation: Citation;
  exports: { bibtex: string; ris: string; text: string };
}
