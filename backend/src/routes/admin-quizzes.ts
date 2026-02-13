import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAdmin } from "../lib/admin-middleware";

const adminQuizzesRouter = new Hono();

// Require admin authentication for all routes
adminQuizzesRouter.use("*", requireAdmin);

// Validation schemas
const createQuizSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  gradeLevel: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  category: z.string().min(1, "Category is required"),
  isPublished: z.boolean().default(false),
  createdById: z.string().optional(),
});

const updateQuizSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional().nullable(),
  gradeLevel: z.string().optional().nullable(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  category: z.string().min(1, "Category is required").optional(),
  isPublished: z.boolean().optional(),
});

const questionOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
});

const createQuestionSchema = z.object({
  questionText: z.string().min(1, "Question text is required"),
  questionType: z.enum(["multiple_choice", "true_false"]).default("multiple_choice"),
  options: z.array(questionOptionSchema).min(2, "At least 2 options required"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  explanation: z.string().optional(),
  sourceType: z.string().optional(),
  sourceId: z.string().optional(),
  orderIndex: z.number().int().default(0),
  points: z.number().int().positive().default(1),
});

const updateQuestionSchema = z.object({
  questionText: z.string().min(1, "Question text is required").optional(),
  questionType: z.enum(["multiple_choice", "true_false"]).optional(),
  options: z.array(questionOptionSchema).min(2, "At least 2 options required").optional(),
  correctAnswer: z.string().min(1, "Correct answer is required").optional(),
  explanation: z.string().optional().nullable(),
  sourceType: z.string().optional().nullable(),
  sourceId: z.string().optional().nullable(),
  orderIndex: z.number().int().optional(),
  points: z.number().int().positive().optional(),
});

// GET /stats - Get quiz statistics (total attempts, average scores by quiz)
// Note: This must be defined before /:id to avoid route conflicts
adminQuizzesRouter.get("/stats", async (c) => {
  const quizzes = await prisma.quiz.findMany({
    select: {
      id: true,
      title: true,
      category: true,
      difficulty: true,
      isPublished: true,
      _count: {
        select: { attempts: true, questions: true },
      },
      attempts: {
        select: {
          percentageScore: true,
          totalPoints: true,
          maxPoints: true,
        },
      },
    },
    orderBy: { title: "asc" },
  });

  const stats = quizzes.map((quiz) => {
    const totalAttempts = quiz._count.attempts;
    let averageScore = 0;
    let highestScore = 0;
    let lowestScore = 100;

    if (totalAttempts > 0) {
      const totalPercentage = quiz.attempts.reduce(
        (sum, attempt) => sum + attempt.percentageScore,
        0
      );
      averageScore = Math.round((totalPercentage / totalAttempts) * 100) / 100;
      highestScore = Math.max(...quiz.attempts.map((a) => a.percentageScore));
      lowestScore = Math.min(...quiz.attempts.map((a) => a.percentageScore));
    }

    return {
      quizId: quiz.id,
      title: quiz.title,
      category: quiz.category,
      difficulty: quiz.difficulty,
      isPublished: quiz.isPublished,
      questionCount: quiz._count.questions,
      totalAttempts,
      averageScore,
      highestScore: totalAttempts > 0 ? highestScore : null,
      lowestScore: totalAttempts > 0 ? lowestScore : null,
    };
  });

  // Calculate overall statistics
  const totalQuizzes = quizzes.length;
  const publishedQuizzes = quizzes.filter((q) => q.isPublished).length;
  const totalAttempts = stats.reduce((sum, s) => sum + s.totalAttempts, 0);
  const overallAverage =
    totalAttempts > 0
      ? Math.round(
          (stats.reduce((sum, s) => sum + s.averageScore * s.totalAttempts, 0) /
            totalAttempts) *
            100
        ) / 100
      : 0;

  return c.json({
    data: {
      overview: {
        totalQuizzes,
        publishedQuizzes,
        totalAttempts,
        overallAverageScore: overallAverage,
      },
      quizzes: stats,
    },
  });
});

// GET / - List all quizzes (including unpublished)
adminQuizzesRouter.get("/", async (c) => {
  const quizzes = await prisma.quiz.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      gradeLevel: true,
      difficulty: true,
      category: true,
      isPublished: true,
      createdById: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { questions: true, attempts: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const result = quizzes.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    gradeLevel: quiz.gradeLevel,
    difficulty: quiz.difficulty,
    category: quiz.category,
    isPublished: quiz.isPublished,
    createdById: quiz.createdById,
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt,
    questionCount: quiz._count.questions,
    attemptCount: quiz._count.attempts,
  }));

  return c.json({ data: result });
});

// GET /:id - Get quiz with questions for editing
adminQuizzesRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { orderIndex: "asc" },
      },
      _count: {
        select: { attempts: true },
      },
    },
  });

  if (!quiz) {
    return c.json(
      { error: { message: "Quiz not found", code: "NOT_FOUND" } },
      404
    );
  }

  // Parse options JSON for each question
  const quizWithParsedOptions = {
    ...quiz,
    attemptCount: quiz._count.attempts,
    questions: quiz.questions.map((q) => ({
      ...q,
      options: JSON.parse(q.options) as Array<{ id: string; text: string }>,
    })),
  };

  // Remove _count from response since we've extracted attemptCount
  const { _count, ...quizData } = quizWithParsedOptions;

  return c.json({ data: quizData });
});

// POST / - Create a new quiz
adminQuizzesRouter.post(
  "/",
  zValidator("json", createQuizSchema),
  async (c) => {
    const data = c.req.valid("json");

    const quiz = await prisma.quiz.create({
      data: {
        title: data.title,
        description: data.description,
        gradeLevel: data.gradeLevel,
        difficulty: data.difficulty,
        category: data.category,
        isPublished: data.isPublished,
        createdById: data.createdById,
      },
      select: {
        id: true,
        title: true,
        description: true,
        gradeLevel: true,
        difficulty: true,
        category: true,
        isPublished: true,
        createdById: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return c.json({ data: quiz }, 201);
  }
);

// PATCH /:id - Update quiz metadata
adminQuizzesRouter.patch(
  "/:id",
  zValidator("json", updateQuizSchema),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");

    // Check if quiz exists
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id },
    });

    if (!existingQuiz) {
      return c.json(
        { error: { message: "Quiz not found", code: "NOT_FOUND" } },
        404
      );
    }

    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.gradeLevel !== undefined && { gradeLevel: data.gradeLevel }),
        ...(data.difficulty !== undefined && { difficulty: data.difficulty }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
      },
      select: {
        id: true,
        title: true,
        description: true,
        gradeLevel: true,
        difficulty: true,
        category: true,
        isPublished: true,
        createdById: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return c.json({ data: quiz });
  }
);

// DELETE /:id - Delete a quiz
adminQuizzesRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");

  // Check if quiz exists
  const existingQuiz = await prisma.quiz.findUnique({
    where: { id },
  });

  if (!existingQuiz) {
    return c.json(
      { error: { message: "Quiz not found", code: "NOT_FOUND" } },
      404
    );
  }

  // Delete quiz within a transaction to ensure atomicity with cascading deletes
  await prisma.$transaction(async (tx) => {
    await tx.quiz.delete({
      where: { id },
    });
  });

  return c.json({ data: { success: true, message: "Quiz deleted successfully" } });
});

// POST /:quizId/questions - Add a question to a quiz
adminQuizzesRouter.post(
  "/:quizId/questions",
  zValidator("json", createQuestionSchema),
  async (c) => {
    const quizId = c.req.param("quizId");
    const data = c.req.valid("json");

    // Check if quiz exists
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      return c.json(
        { error: { message: "Quiz not found", code: "NOT_FOUND" } },
        404
      );
    }

    // Validate that correctAnswer is one of the option IDs
    const optionIds = data.options.map((opt) => opt.id);
    if (!optionIds.includes(data.correctAnswer)) {
      return c.json(
        {
          error: {
            message: "Correct answer must match one of the option IDs",
            code: "INVALID_ANSWER",
          },
        },
        400
      );
    }

    const question = await prisma.quizQuestion.create({
      data: {
        quizId,
        questionText: data.questionText,
        questionType: data.questionType,
        options: JSON.stringify(data.options),
        correctAnswer: data.correctAnswer,
        explanation: data.explanation,
        sourceType: data.sourceType,
        sourceId: data.sourceId,
        orderIndex: data.orderIndex,
        points: data.points,
      },
    });

    return c.json({
      data: {
        ...question,
        options: JSON.parse(question.options) as Array<{ id: string; text: string }>,
      },
    }, 201);
  }
);

// PATCH /:quizId/questions/:questionId - Update a question
adminQuizzesRouter.patch(
  "/:quizId/questions/:questionId",
  zValidator("json", updateQuestionSchema),
  async (c) => {
    const quizId = c.req.param("quizId");
    const questionId = c.req.param("questionId");
    const data = c.req.valid("json");

    // Check if question exists and belongs to this quiz
    const existingQuestion = await prisma.quizQuestion.findFirst({
      where: { id: questionId, quizId },
    });

    if (!existingQuestion) {
      return c.json(
        { error: { message: "Question not found", code: "NOT_FOUND" } },
        404
      );
    }

    // If updating options, validate correctAnswer
    if (data.options !== undefined && data.correctAnswer !== undefined) {
      const optionIds = data.options.map((opt) => opt.id);
      if (!optionIds.includes(data.correctAnswer)) {
        return c.json(
          {
            error: {
              message: "Correct answer must match one of the option IDs",
              code: "INVALID_ANSWER",
            },
          },
          400
        );
      }
    } else if (data.options !== undefined) {
      // If only updating options, validate existing correctAnswer still works
      const optionIds = data.options.map((opt) => opt.id);
      if (!optionIds.includes(existingQuestion.correctAnswer)) {
        return c.json(
          {
            error: {
              message: "Current correct answer is not in the new options. Please also update correctAnswer.",
              code: "INVALID_ANSWER",
            },
          },
          400
        );
      }
    } else if (data.correctAnswer !== undefined) {
      // If only updating correctAnswer, validate it exists in current options
      const currentOptions = JSON.parse(existingQuestion.options) as Array<{ id: string; text: string }>;
      const optionIds = currentOptions.map((opt) => opt.id);
      if (!optionIds.includes(data.correctAnswer)) {
        return c.json(
          {
            error: {
              message: "Correct answer must match one of the existing option IDs",
              code: "INVALID_ANSWER",
            },
          },
          400
        );
      }
    }

    const question = await prisma.quizQuestion.update({
      where: { id: questionId },
      data: {
        ...(data.questionText !== undefined && { questionText: data.questionText }),
        ...(data.questionType !== undefined && { questionType: data.questionType }),
        ...(data.options !== undefined && { options: JSON.stringify(data.options) }),
        ...(data.correctAnswer !== undefined && { correctAnswer: data.correctAnswer }),
        ...(data.explanation !== undefined && { explanation: data.explanation }),
        ...(data.sourceType !== undefined && { sourceType: data.sourceType }),
        ...(data.sourceId !== undefined && { sourceId: data.sourceId }),
        ...(data.orderIndex !== undefined && { orderIndex: data.orderIndex }),
        ...(data.points !== undefined && { points: data.points }),
      },
    });

    return c.json({
      data: {
        ...question,
        options: JSON.parse(question.options) as Array<{ id: string; text: string }>,
      },
    });
  }
);

// DELETE /:quizId/questions/:questionId - Delete a question
adminQuizzesRouter.delete("/:quizId/questions/:questionId", async (c) => {
  const quizId = c.req.param("quizId");
  const questionId = c.req.param("questionId");

  // Check if question exists and belongs to this quiz
  const existingQuestion = await prisma.quizQuestion.findFirst({
    where: { id: questionId, quizId },
  });

  if (!existingQuestion) {
    return c.json(
      { error: { message: "Question not found", code: "NOT_FOUND" } },
      404
    );
  }

  await prisma.quizQuestion.delete({
    where: { id: questionId },
  });

  return c.json({ data: { success: true, message: "Question deleted successfully" } });
});

export { adminQuizzesRouter };
