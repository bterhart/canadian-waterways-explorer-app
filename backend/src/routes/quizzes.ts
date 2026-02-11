import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../prisma";

const quizzesRouter = new Hono();

// GET / - List all published quizzes with question count
quizzesRouter.get("/", async (c) => {
  const category = c.req.query("category");
  const gradeLevel = c.req.query("gradeLevel");
  const difficulty = c.req.query("difficulty");

  const whereClause: {
    isPublished: boolean;
    category?: string;
    gradeLevel?: string;
    difficulty?: string;
  } = {
    isPublished: true,
  };

  if (category) {
    whereClause.category = category;
  }
  if (gradeLevel) {
    whereClause.gradeLevel = gradeLevel;
  }
  if (difficulty) {
    whereClause.difficulty = difficulty;
  }

  const quizzes = await prisma.quiz.findMany({
    where: whereClause,
    select: {
      id: true,
      title: true,
      description: true,
      gradeLevel: true,
      difficulty: true,
      category: true,
      createdAt: true,
      _count: {
        select: { questions: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Transform to include questionCount instead of _count
  const result = quizzes.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    gradeLevel: quiz.gradeLevel,
    difficulty: quiz.difficulty,
    category: quiz.category,
    createdAt: quiz.createdAt,
    questionCount: quiz._count.questions,
  }));

  return c.json({ data: result });
});

// GET /:id - Get a quiz with all its questions (for taking the quiz)
quizzesRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const quiz = await prisma.quiz.findUnique({
    where: { id, isPublished: true },
    select: {
      id: true,
      title: true,
      description: true,
      gradeLevel: true,
      difficulty: true,
      category: true,
      questions: {
        select: {
          id: true,
          questionText: true,
          questionType: true,
          options: true,
          orderIndex: true,
          points: true,
        },
        orderBy: { orderIndex: "asc" },
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
    questions: quiz.questions.map((q) => ({
      ...q,
      options: JSON.parse(q.options) as Array<{ id: string; text: string }>,
    })),
  };

  return c.json({ data: quizWithParsedOptions });
});

// Validation schema for quiz attempt submission
const attemptAnswerSchema = z.object({
  questionId: z.string(),
  selectedAnswer: z.string(),
});

const submitAttemptSchema = z.object({
  studentName: z.string().optional(),
  studentGrade: z.string().optional(),
  schoolName: z.string().optional(),
  answers: z.array(attemptAnswerSchema),
});

// POST /:id/attempt - Submit a quiz attempt with answers, returns results
quizzesRouter.post(
  "/:id/attempt",
  zValidator("json", submitAttemptSchema),
  async (c) => {
    const quizId = c.req.param("id");
    const { studentName, studentGrade, schoolName, answers } =
      c.req.valid("json");

    // Get the quiz with questions to validate and calculate score
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId, isPublished: true },
      include: {
        questions: {
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    if (!quiz) {
      return c.json(
        { error: { message: "Quiz not found", code: "NOT_FOUND" } },
        404
      );
    }

    // Build a map of questionId -> question for quick lookup
    const questionMap = new Map(quiz.questions.map((q) => [q.id, q]));

    // Calculate score and build results
    let correctCount = 0;
    let totalPoints = 0;
    let maxPoints = 0;

    const results: Array<{
      questionId: string;
      selectedAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      explanation: string | null;
      pointsEarned: number;
      pointsPossible: number;
    }> = [];

    const answersRecord: Array<{
      questionId: string;
      selectedAnswer: string;
      isCorrect: boolean;
    }> = [];

    // Calculate max points from all questions
    for (const question of quiz.questions) {
      maxPoints += question.points;
    }

    // Process each submitted answer
    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);

      if (!question) {
        // Skip answers for questions not in this quiz
        continue;
      }

      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      const pointsEarned = isCorrect ? question.points : 0;

      if (isCorrect) {
        correctCount++;
        totalPoints += question.points;
      }

      results.push({
        questionId: question.id,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
        pointsEarned,
        pointsPossible: question.points,
      });

      answersRecord.push({
        questionId: question.id,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
      });
    }

    const totalQuestions = quiz.questions.length;
    const percentageScore = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;

    // Save the attempt to the database
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        studentName,
        studentGrade,
        schoolName,
        score: correctCount,
        totalQuestions,
        totalPoints,
        maxPoints,
        percentageScore,
        answers: JSON.stringify(answersRecord),
        completedAt: new Date(),
      },
    });

    return c.json({
      data: {
        attemptId: attempt.id,
        score: correctCount,
        totalQuestions,
        totalPoints,
        maxPoints,
        percentageScore: Math.round(percentageScore * 100) / 100,
        results,
      },
    });
  }
);

export { quizzesRouter };
