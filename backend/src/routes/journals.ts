import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";
import { recordActivity, checkAchievements, POINTS } from "../lib/progress";

const journalsRouter = new Hono();

// Validation schemas
const createJournalSchema = z.object({
  studentIdentifier: z.string().min(1, "Student identifier is required"),
  studentName: z.string().optional(),
  schoolName: z.string().optional(),
  gradeLevel: z.string().optional(),
});

const createEntrySchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  waterwayId: z.string().optional(),
  locationId: z.string().optional(),
  explorerId: z.string().optional(),
  quizId: z.string().optional(),
  lessonPlanId: z.string().optional(),
  fieldTripId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const updateEntrySchema = z.object({
  title: z.string().optional().nullable(),
  content: z.string().min(1).optional(),
  tags: z.array(z.string()).optional().nullable(),
});

const saveLocationSchema = z.object({
  waterwayId: z.string().optional(),
  locationId: z.string().optional(),
  explorerId: z.string().optional(),
  notes: z.string().optional(),
});

// POST / - Create a new journal or get existing by identifier
journalsRouter.post(
  "/",
  zValidator("json", createJournalSchema),
  async (c) => {
    const data = c.req.valid("json");

    // Check if journal already exists for this identifier
    let journal = await db.studentJournal.findFirst({
      where: { studentIdentifier: data.studentIdentifier },
    });

    if (journal) {
      // Update if name/school/grade changed
      journal = await db.studentJournal.update({
        where: { id: journal.id },
        data: {
          studentName: data.studentName ?? journal.studentName,
          schoolName: data.schoolName ?? journal.schoolName,
          gradeLevel: data.gradeLevel ?? journal.gradeLevel,
        },
      });
    } else {
      // Create new journal
      journal = await db.studentJournal.create({
        data: {
          studentIdentifier: data.studentIdentifier,
          studentName: data.studentName,
          schoolName: data.schoolName,
          gradeLevel: data.gradeLevel,
        },
      });
    }

    return c.json({ data: journal }, journal ? 200 : 201);
  }
);

// GET /by-identifier/:identifier - Get journal by student identifier
journalsRouter.get("/by-identifier/:identifier", async (c) => {
  const identifier = c.req.param("identifier");

  const journal = await db.studentJournal.findFirst({
    where: { studentIdentifier: identifier },
    include: {
      entries: {
        orderBy: { createdAt: "desc" },
      },
      savedLocations: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!journal) {
    return c.json(
      { error: { message: "Journal not found", code: "NOT_FOUND" } },
      404
    );
  }

  // Parse tags in entries
  const result = {
    ...journal,
    entries: journal.entries.map((entry) => ({
      ...entry,
      tags: entry.tags ? JSON.parse(entry.tags) : null,
    })),
  };

  return c.json({ data: result });
});

// GET /:id - Get journal by ID
journalsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const journal = await db.studentJournal.findUnique({
    where: { id },
    include: {
      entries: {
        orderBy: { createdAt: "desc" },
      },
      savedLocations: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!journal) {
    return c.json(
      { error: { message: "Journal not found", code: "NOT_FOUND" } },
      404
    );
  }

  // Parse tags in entries
  const result = {
    ...journal,
    entries: journal.entries.map((entry) => ({
      ...entry,
      tags: entry.tags ? JSON.parse(entry.tags) : null,
    })),
  };

  return c.json({ data: result });
});

// POST /:journalId/entries - Add an entry to a journal
journalsRouter.post(
  "/:journalId/entries",
  zValidator("json", createEntrySchema),
  async (c) => {
    const journalId = c.req.param("journalId");
    const data = c.req.valid("json");

    const journal = await db.studentJournal.findUnique({
      where: { id: journalId },
    });

    if (!journal) {
      return c.json(
        { error: { message: "Journal not found", code: "NOT_FOUND" } },
        404
      );
    }

    const entry = await db.journalEntry.create({
      data: {
        journalId,
        title: data.title,
        content: data.content,
        waterwayId: data.waterwayId,
        locationId: data.locationId,
        explorerId: data.explorerId,
        quizId: data.quizId,
        lessonPlanId: data.lessonPlanId,
        fieldTripId: data.fieldTripId,
        tags: data.tags ? JSON.stringify(data.tags) : null,
      },
    });

    // Journals are keyed by the device identity, so an entry earns points for it.
    try {
      await recordActivity(journal.studentIdentifier, "journal_entry", POINTS.journalEntry);
      await checkAchievements(journal.studentIdentifier);
    } catch (error) {
      console.error("[journal entry] progress update failed:", error);
    }

    return c.json({
      data: {
        ...entry,
        tags: entry.tags ? JSON.parse(entry.tags) : null,
      },
    }, 201);
  }
);

// PATCH /:journalId/entries/:entryId - Update an entry
journalsRouter.patch(
  "/:journalId/entries/:entryId",
  zValidator("json", updateEntrySchema),
  async (c) => {
    const journalId = c.req.param("journalId");
    const entryId = c.req.param("entryId");
    const data = c.req.valid("json");

    const existingEntry = await db.journalEntry.findFirst({
      where: { id: entryId, journalId },
    });

    if (!existingEntry) {
      return c.json(
        { error: { message: "Entry not found", code: "NOT_FOUND" } },
        404
      );
    }

    const entry = await db.journalEntry.update({
      where: { id: entryId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.tags !== undefined && {
          tags: data.tags ? JSON.stringify(data.tags) : null,
        }),
      },
    });

    return c.json({
      data: {
        ...entry,
        tags: entry.tags ? JSON.parse(entry.tags) : null,
      },
    });
  }
);

// DELETE /:journalId/entries/:entryId - Delete an entry
journalsRouter.delete("/:journalId/entries/:entryId", async (c) => {
  const journalId = c.req.param("journalId");
  const entryId = c.req.param("entryId");

  const existingEntry = await db.journalEntry.findFirst({
    where: { id: entryId, journalId },
  });

  if (!existingEntry) {
    return c.json(
      { error: { message: "Entry not found", code: "NOT_FOUND" } },
      404
    );
  }

  await db.journalEntry.delete({
    where: { id: entryId },
  });

  return c.json({ data: { success: true, message: "Entry deleted successfully" } });
});

// POST /:journalId/saved-locations - Save a location
journalsRouter.post(
  "/:journalId/saved-locations",
  zValidator("json", saveLocationSchema),
  async (c) => {
    const journalId = c.req.param("journalId");
    const data = c.req.valid("json");

    const journal = await db.studentJournal.findUnique({
      where: { id: journalId },
    });

    if (!journal) {
      return c.json(
        { error: { message: "Journal not found", code: "NOT_FOUND" } },
        404
      );
    }

    // Must have at least one location reference
    if (!data.waterwayId && !data.locationId && !data.explorerId) {
      return c.json(
        { error: { message: "At least one location reference (waterwayId, locationId, or explorerId) is required", code: "BAD_REQUEST" } },
        400
      );
    }

    const savedLocation = await db.savedLocation.create({
      data: {
        journalId,
        waterwayId: data.waterwayId,
        locationId: data.locationId,
        explorerId: data.explorerId,
        notes: data.notes,
      },
    });

    return c.json({ data: savedLocation }, 201);
  }
);

// DELETE /:journalId/saved-locations/:locationId - Remove a saved location
journalsRouter.delete("/:journalId/saved-locations/:locationId", async (c) => {
  const journalId = c.req.param("journalId");
  const locationId = c.req.param("locationId");

  const existingLocation = await db.savedLocation.findFirst({
    where: { id: locationId, journalId },
  });

  if (!existingLocation) {
    return c.json(
      { error: { message: "Saved location not found", code: "NOT_FOUND" } },
      404
    );
  }

  await db.savedLocation.delete({
    where: { id: locationId },
  });

  return c.json({ data: { success: true, message: "Saved location removed successfully" } });
});

export { journalsRouter };
