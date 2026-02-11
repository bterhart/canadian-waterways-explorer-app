import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../prisma";

const indigenousLanguageRouter = new Hono();

// ==================== VOCABULARY WORDS ====================

// Get all Indigenous words with optional filters
indigenousLanguageRouter.get("/words", async (c) => {
  const language = c.req.query("language");
  const category = c.req.query("category");

  const where: Record<string, unknown> = {};
  if (language) where.language = language;
  if (category) where.category = category;

  const words = await prisma.indigenousWord.findMany({
    where,
    orderBy: { word: "asc" },
  });

  return c.json({ data: words });
});

// Get single word details
indigenousLanguageRouter.get("/words/:id", async (c) => {
  const id = c.req.param("id");

  const word = await prisma.indigenousWord.findUnique({
    where: { id },
  });

  if (!word) {
    return c.json(
      { error: { message: "Word not found", code: "NOT_FOUND" } },
      404
    );
  }

  return c.json({ data: word });
});

// ==================== WORD OF THE DAY ====================

// Get today's word
indigenousLanguageRouter.get("/word-of-day", async (c) => {
  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Try to find word of the day for today
  let wordOfDay = await prisma.wordOfTheDay.findFirst({
    where: {
      date: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    },
    include: {
      word: true,
    },
  });

  // If no word for today, get a random word and create word of the day
  if (!wordOfDay) {
    const words = await prisma.indigenousWord.findMany();
    if (words.length > 0) {
      const randomIndex = Math.floor(Math.random() * words.length);
      const randomWord = words[randomIndex];
      if (randomWord) {
        wordOfDay = await prisma.wordOfTheDay.create({
          data: {
            date: today,
            wordId: randomWord.id,
          },
          include: {
            word: true,
          },
        });
      }
    }
  }

  if (!wordOfDay) {
    return c.json(
      { error: { message: "No words available", code: "NOT_FOUND" } },
      404
    );
  }

  return c.json({ data: wordOfDay });
});

// ==================== VOCABULARY QUIZZES ====================

// Get all vocabulary quizzes
indigenousLanguageRouter.get("/vocabulary-quizzes", async (c) => {
  const language = c.req.query("language");
  const difficulty = c.req.query("difficulty");

  const where: Record<string, unknown> = { isPublished: true };
  if (language) where.language = language;
  if (difficulty) where.difficulty = difficulty;

  const quizzes = await prisma.vocabularyQuiz.findMany({
    where,
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      language: true,
      difficulty: true,
      description: true,
      createdAt: true,
    },
  });

  return c.json({ data: quizzes });
});

// Get single quiz with questions
indigenousLanguageRouter.get("/vocabulary-quizzes/:id", async (c) => {
  const id = c.req.param("id");

  const quiz = await prisma.vocabularyQuiz.findUnique({
    where: { id },
  });

  if (!quiz || !quiz.isPublished) {
    return c.json(
      { error: { message: "Quiz not found", code: "NOT_FOUND" } },
      404
    );
  }

  // Parse questions JSON
  const questions = JSON.parse(quiz.questions);

  return c.json({
    data: {
      ...quiz,
      questions,
    },
  });
});

// Submit quiz answers
const submitQuizSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedAnswer: z.string(),
    })
  ),
});

indigenousLanguageRouter.post(
  "/vocabulary-quizzes/:id/submit",
  zValidator("json", submitQuizSchema),
  async (c) => {
    const id = c.req.param("id");
    const { answers } = c.req.valid("json");

    const quiz = await prisma.vocabularyQuiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      return c.json(
        { error: { message: "Quiz not found", code: "NOT_FOUND" } },
        404
      );
    }

    // Parse questions and grade answers
    const questions = JSON.parse(quiz.questions) as Array<{
      id: string;
      word: string;
      correctAnswer: string;
      options: string[];
    }>;

    let correctCount = 0;
    const results = answers.map((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      const isCorrect = question?.correctAnswer === answer.selectedAnswer;
      if (isCorrect) correctCount++;
      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question?.correctAnswer || "",
        isCorrect,
        word: question?.word || "",
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);

    return c.json({
      data: {
        score,
        correctCount,
        totalQuestions: questions.length,
        results,
      },
    });
  }
);

// ==================== INDIGENOUS STORIES ====================

// Get all Indigenous stories
indigenousLanguageRouter.get("/stories", async (c) => {
  const nation = c.req.query("nation");
  const theme = c.req.query("theme");
  const gradeLevel = c.req.query("gradeLevel");

  const where: Record<string, unknown> = { isPublished: true };
  if (nation) where.nation = nation;
  if (theme) where.theme = theme;
  if (gradeLevel) where.gradeLevel = gradeLevel;

  const stories = await prisma.indigenousStory.findMany({
    where,
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      nation: true,
      language: true,
      theme: true,
      gradeLevel: true,
      summary: true,
      relatedWaterwayId: true,
      createdAt: true,
    },
  });

  return c.json({ data: stories });
});

// Get single story details
indigenousLanguageRouter.get("/stories/:id", async (c) => {
  const id = c.req.param("id");

  const story = await prisma.indigenousStory.findUnique({
    where: { id },
  });

  if (!story || !story.isPublished) {
    return c.json(
      { error: { message: "Story not found", code: "NOT_FOUND" } },
      404
    );
  }

  return c.json({ data: story });
});

// ==================== LANGUAGES LIST ====================

// Get list of available languages
indigenousLanguageRouter.get("/languages", async (c) => {
  const words = await prisma.indigenousWord.groupBy({
    by: ["language"],
    _count: {
      language: true,
    },
    orderBy: {
      language: "asc",
    },
  });

  const languages = words.map((w) => ({
    name: w.language,
    wordCount: w._count.language,
  }));

  return c.json({ data: languages });
});

// Get categories for a language
indigenousLanguageRouter.get("/categories", async (c) => {
  const language = c.req.query("language");

  const where: Record<string, unknown> = {};
  if (language) where.language = language;

  const words = await prisma.indigenousWord.groupBy({
    by: ["category"],
    where,
    _count: {
      category: true,
    },
  });

  const categories = words
    .filter((w) => w.category)
    .map((w) => ({
      name: w.category,
      wordCount: w._count.category,
    }));

  return c.json({ data: categories });
});

export { indigenousLanguageRouter };
