// "Additional Study" entries for a record, read from the ReadingGuide table in Turso
// (decision 12, 2026-10-16; formerly two static files shipped in the app).
import { db } from "../db";

export type ReadingGuideTargetType = "waterway" | "location" | "explorer" | "notable_figure";

export interface ReadingGuideEntry {
  id: string;
  title: string;
  authorSource: string | null;
  publisher: string | null;
  year: string | null;
  url: string | null;
  description: string | null;
  gradeLevel: string | null;
}

export async function getReadingGuide(
  targetType: ReadingGuideTargetType,
  targetId: string
): Promise<ReadingGuideEntry[]> {
  return db.readingGuide.findMany({
    where: { targetType, targetId },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      title: true,
      authorSource: true,
      publisher: true,
      year: true,
      url: true,
      description: true,
      gradeLevel: true,
    },
  });
}
