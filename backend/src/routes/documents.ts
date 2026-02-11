import { Hono } from "hono";
import { prisma } from "../prisma";

const documentsRouter = new Hono();

// GET / - List all published primary source documents
documentsRouter.get("/", async (c) => {
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

  const documents = await prisma.primarySourceDocument.findMany({
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

  return c.json({ data: documents });
});

// GET /types - Get all unique document types
documentsRouter.get("/types", async (c) => {
  const documents = await prisma.primarySourceDocument.findMany({
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

  const document = await prisma.primarySourceDocument.findUnique({
    where: { id, isPublished: true },
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

export { documentsRouter };
