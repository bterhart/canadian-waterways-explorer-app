import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../prisma";

const adminDocumentsRouter = new Hono();

// Validation schemas
const annotationSchema = z.object({
  gradeLevel: z.string(),
  annotation: z.string(),
});

const vocabularySchema = z.object({
  word: z.string(),
  definition: z.string(),
});

const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  documentType: z.string().min(1, "Document type is required"),
  author: z.string().optional(),
  originalDate: z.string().optional(),
  originalYear: z.number().int().optional(),
  originalText: z.string().optional(),
  transcription: z.string().optional(),
  imageUrl: z.string().url().optional(),
  annotations: z.array(annotationSchema).optional(),
  historicalContext: z.string().optional(),
  vocabulary: z.array(vocabularySchema).optional(),
  discussionQuestions: z.array(z.string()).optional(),
  explorerId: z.string().optional(),
  waterwayId: z.string().optional(),
  locationId: z.string().optional(),
  gradeLevel: z.string().optional(),
  isPublished: z.boolean().default(false),
});

const updateDocumentSchema = z.object({
  title: z.string().min(1).optional(),
  documentType: z.string().min(1).optional(),
  author: z.string().optional().nullable(),
  originalDate: z.string().optional().nullable(),
  originalYear: z.number().int().optional().nullable(),
  originalText: z.string().optional().nullable(),
  transcription: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  annotations: z.array(annotationSchema).optional().nullable(),
  historicalContext: z.string().optional().nullable(),
  vocabulary: z.array(vocabularySchema).optional().nullable(),
  discussionQuestions: z.array(z.string()).optional().nullable(),
  explorerId: z.string().optional().nullable(),
  waterwayId: z.string().optional().nullable(),
  locationId: z.string().optional().nullable(),
  gradeLevel: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
});

// GET / - List all documents (including unpublished)
adminDocumentsRouter.get("/", async (c) => {
  const documents = await prisma.primarySourceDocument.findMany({
    select: {
      id: true,
      title: true,
      documentType: true,
      author: true,
      originalDate: true,
      originalYear: true,
      imageUrl: true,
      gradeLevel: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ data: documents });
});

// GET /:id - Get a single document for editing
adminDocumentsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const document = await prisma.primarySourceDocument.findUnique({
    where: { id },
  });

  if (!document) {
    return c.json(
      { error: { message: "Document not found", code: "NOT_FOUND" } },
      404
    );
  }

  // Parse JSON fields
  const result = {
    ...document,
    annotations: document.annotations ? JSON.parse(document.annotations) : null,
    vocabulary: document.vocabulary ? JSON.parse(document.vocabulary) : null,
    discussionQuestions: document.discussionQuestions
      ? JSON.parse(document.discussionQuestions)
      : null,
  };

  return c.json({ data: result });
});

// POST / - Create a new document
adminDocumentsRouter.post(
  "/",
  zValidator("json", createDocumentSchema),
  async (c) => {
    const data = c.req.valid("json");

    const document = await prisma.primarySourceDocument.create({
      data: {
        title: data.title,
        documentType: data.documentType,
        author: data.author,
        originalDate: data.originalDate,
        originalYear: data.originalYear,
        originalText: data.originalText,
        transcription: data.transcription,
        imageUrl: data.imageUrl,
        annotations: data.annotations ? JSON.stringify(data.annotations) : null,
        historicalContext: data.historicalContext,
        vocabulary: data.vocabulary ? JSON.stringify(data.vocabulary) : null,
        discussionQuestions: data.discussionQuestions
          ? JSON.stringify(data.discussionQuestions)
          : null,
        explorerId: data.explorerId,
        waterwayId: data.waterwayId,
        locationId: data.locationId,
        gradeLevel: data.gradeLevel,
        isPublished: data.isPublished,
      },
    });

    return c.json({ data: document }, 201);
  }
);

// PATCH /:id - Update a document
adminDocumentsRouter.patch(
  "/:id",
  zValidator("json", updateDocumentSchema),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");

    const existingDocument = await prisma.primarySourceDocument.findUnique({
      where: { id },
    });

    if (!existingDocument) {
      return c.json(
        { error: { message: "Document not found", code: "NOT_FOUND" } },
        404
      );
    }

    const document = await prisma.primarySourceDocument.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.documentType !== undefined && { documentType: data.documentType }),
        ...(data.author !== undefined && { author: data.author }),
        ...(data.originalDate !== undefined && { originalDate: data.originalDate }),
        ...(data.originalYear !== undefined && { originalYear: data.originalYear }),
        ...(data.originalText !== undefined && { originalText: data.originalText }),
        ...(data.transcription !== undefined && { transcription: data.transcription }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.annotations !== undefined && {
          annotations: data.annotations ? JSON.stringify(data.annotations) : null,
        }),
        ...(data.historicalContext !== undefined && {
          historicalContext: data.historicalContext,
        }),
        ...(data.vocabulary !== undefined && {
          vocabulary: data.vocabulary ? JSON.stringify(data.vocabulary) : null,
        }),
        ...(data.discussionQuestions !== undefined && {
          discussionQuestions: data.discussionQuestions
            ? JSON.stringify(data.discussionQuestions)
            : null,
        }),
        ...(data.explorerId !== undefined && { explorerId: data.explorerId }),
        ...(data.waterwayId !== undefined && { waterwayId: data.waterwayId }),
        ...(data.locationId !== undefined && { locationId: data.locationId }),
        ...(data.gradeLevel !== undefined && { gradeLevel: data.gradeLevel }),
        ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
      },
    });

    return c.json({ data: document });
  }
);

// DELETE /:id - Delete a document
adminDocumentsRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const existingDocument = await prisma.primarySourceDocument.findUnique({
    where: { id },
  });

  if (!existingDocument) {
    return c.json(
      { error: { message: "Document not found", code: "NOT_FOUND" } },
      404
    );
  }

  await prisma.primarySourceDocument.delete({
    where: { id },
  });

  return c.json({ data: { success: true, message: "Document deleted successfully" } });
});

export { adminDocumentsRouter };
