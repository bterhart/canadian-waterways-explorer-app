// Mirrors backend/src/routes/source-pairs.ts (roadmap item 10, 2026-10-21): the passage a document
// first carried in the seed data, never checked, beside the sentences as published.
export type SourcePairKind =
  | 'not_in_source'
  | 'partly_in_source'
  | 'paraphrase'
  | 'number_changed'
  | 'date_or_author'
  | 'abbreviation'
  | 'confirmed'
  | 'unverifiable'
  | 'no_such_document';

export interface SourceEdition {
  title: string;
  year: string | null;
  url: string | null;
}

export interface SourcePairSummary {
  id: string;
  documentId: string;
  kind: SourcePairKind;
  kindLabel: string;
  gradeLevel: string | null;
  sortOrder: number;
  seedTitle: string;
  documentTitle: string;
  author: string | null;
  originalYear: number | null;
  originalDate: string | null;
  imageUrl: string | null;
  hasPublishedText: boolean;
  edition: SourceEdition | null;
}

export interface SourcePairDetail {
  id: string;
  documentId: string;
  kind: SourcePairKind;
  kindLabel: string;
  gradeLevel: string | null;
  sortOrder: number;
  seedTitle: string;
  seedText: string;
  whatChanged: string;
  task: string;
  document: {
    id: string;
    title: string;
    author: string | null;
    originalYear: number | null;
    originalDate: string | null;
    documentType: string;
    imageUrl: string | null;
    gradeLevel: string | null;
    explorerId: string | null;
  } | null;
  publishedText: string | null;
  publishedOriginalText: string | null;
  checkedNote: string | null;
  edition: SourceEdition | null;
}

export interface SourcePairKindInfo {
  kind: SourcePairKind;
  label: string;
}
