import { Hono } from "hono";
import { db } from "../db";
import { applyScope, scopeForUser } from "../lib/content-scope";
import { loadRelated, attachRelated } from "../lib/related";

const documentsRouter = new Hono();

// GET / - List all published primary source documents
documentsRouter.get("/", async (c) => {
  // Class content scope (spec 10.27): a student device sends its id; the list is cut to what its classes allow.
  const scopeUserId = c.req.query("userId");
  const documentType = c.req.query("type");
  const gradeLevel = c.req.query("gradeLevel");

  const whereClause: {
    isPublished: boolean;
    documentType?: string;
    gradeLevel?: string;
  } = {
    isPublished: true,
  };

  if (documentType) {
    whereClause.documentType = documentType;
  }
  if (gradeLevel) {
    whereClause.gradeLevel = gradeLevel;
  }

  const documents = await db.primarySourceDocument.findMany({
    where: whereClause,
    select: {
      id: true,
      title: true,
      documentType: true,
      author: true,
      originalDate: true,
      originalYear: true,
      imageUrl: true,
      gradeLevel: true,
      createdAt: true,
    },
    orderBy: [{ originalYear: "asc" }, { createdAt: "desc" }],
  });

  return c.json({ data: applyScope(await scopeForUser(scopeUserId), documents) });
});

// GET /types - Get all unique document types
documentsRouter.get("/types", async (c) => {
  const documents = await db.primarySourceDocument.findMany({
    where: { isPublished: true },
    select: { documentType: true },
    distinct: ["documentType"],
  });

  const types = documents.map((d) => d.documentType);

  return c.json({ data: types });
});

// GET /:id - Get a single document with full details
documentsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const document = await db.primarySourceDocument.findUnique({
    where: { id, isPublished: true },
  });

  if (!document) {
    return c.json(
      { error: { message: "Document not found", code: "NOT_FOUND" } },
      404
    );
  }

  // Related explorer / waterway / location by name, so the app can open them
  const maps = await loadRelated({
    explorerIds: [document.explorerId],
    waterwayIds: [document.waterwayId],
    locationIds: [document.locationId],
  });

  // Parse JSON fields
  const result = {
    ...attachRelated(document, maps),
    annotations: document.annotations ? JSON.parse(document.annotations) : null,
    vocabulary: document.vocabulary ? JSON.parse(document.vocabulary) : null,
    discussionQuestions: document.discussionQuestions
      ? JSON.parse(document.discussionQuestions)
      : null,
  };

  return c.json({ data: result });
});

export { documentsRouter };
