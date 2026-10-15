import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";

const gamificationRouter = new Hono();

// ==================== EXPLORER RANKS ====================
// Ranks, points, streaks and achievements live in ../lib/progress so that the
// server can award them itself (quiz attempts, journal entries, completions).
import {
  RANKS,
  getRankForPoints,
  recordActivity,
  checkAchievements,
} from "../lib/progress";

function getNextRankInfo(points: number): { nextRank: string | null; pointsNeeded: number; progress: number } {
  const currentRankIndex = RANKS.findIndex(
    (r) => points >= r.minPoints && points <= r.maxPoints
  );

  // Handle case where points don't match any rank (shouldn't happen, but be safe)
  if (currentRankIndex === -1) {
    const firstRank = RANKS[0];
    const secondRank = RANKS[1];
    if (firstRank && secondRank) {
      return { nextRank: secondRank.name, pointsNeeded: secondRank.minPoints - points, progress: 0 };
    }
    return { nextRank: null, pointsNeeded: 0, progress: 0 };
  }

  if (currentRankIndex === RANKS.length - 1) {
    // Already at max rank
    return { nextRank: null, pointsNeeded: 0, progress: 100 };
  }

  const currentRank = RANKS[currentRankIndex]!;
  const nextRank = RANKS[currentRankIndex + 1]!;
  const pointsIntoCurrentRank = points - currentRank.minPoints;
  const pointsNeededForRank = currentRank.maxPoints - currentRank.minPoints + 1;
  const progress = Math.min(100, Math.round((pointsIntoCurrentRank / pointsNeededForRank) * 100));

  return {
    nextRank: nextRank.name,
    pointsNeeded: nextRank.minPoints - points,
    progress,
  };
}

// ==================== USER PROGRESS ====================

// GET /progress - Get user's progress and rank
gamificationRouter.get(
  "/progress",
  zValidator("query", z.object({ userId: z.string() })),
  async (c) => {
    const { userId } = c.req.valid("query");

    // Get or create user progress
    let progress = await db.userProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      // Create new progress record
      progress = await db.userProgress.create({
        data: {
          userId,
          explorerRank: "Apprentice Voyageur",
        },
      });
    }

    // Calculate rank info
    const rankInfo = getNextRankInfo(progress.totalPoints);

    return c.json({
      data: {
        userId: progress.userId,
        totalPoints: progress.totalPoints,
        explorerRank: progress.explorerRank,
        nextRank: rankInfo.nextRank,
        pointsToNextRank: rankInfo.pointsNeeded,
        progressToNextRank: rankInfo.progress,
        stats: {
          waterwaysExplored: progress.waterwaysExplored,
          locationsVisited: progress.locationsVisited,
          quizzesTaken: progress.quizzesTaken,
          quizPointsEarned: progress.quizPointsEarned,
          fieldTripsCompleted: progress.fieldTripsCompleted,
          journalEntriesWritten: progress.journalEntriesWritten,
          pronunciationsLearned: progress.pronunciationsLearned,
          documentsRead: progress.documentsRead,
        },
        streaks: {
          dailyStreak: progress.dailyStreak,
          longestStreak: progress.longestStreak,
          lastActiveDate: progress.lastActiveDate,
        },
      },
    });
  }
);

// POST /progress/add-points - Add points and update stats for a user
const addPointsSchema = z.object({
  userId: z.string(),
  points: z.number().int().min(0),
  activityType: z.enum([
    "waterway_explored",
    "location_visited",
    "quiz_completed",
    "field_trip_completed",
    "journal_entry",
    "pronunciation_learned",
    "document_read",
    "daily_challenge",
  ]),
  activityData: z.record(z.string(), z.unknown()).optional(),
});

gamificationRouter.post(
  "/progress/add-points",
  zValidator("json", addPointsSchema),
  async (c) => {
    const { userId, points, activityType, activityData } = c.req.valid("json");

    // Same bookkeeping the server applies on its own events (see ../lib/progress).
    const result = await recordActivity(
      userId,
      activityType as Parameters<typeof recordActivity>[1],
      points,
      { quizPoints: activityData?.quizPoints as number | undefined }
    );

    return c.json({ data: result });
  }
);

// ==================== ACHIEVEMENTS ====================

// GET /achievements - List all achievements
gamificationRouter.get("/achievements", async (c) => {
  const category = c.req.query("category");

  const whereClause: { category?: string } = {};
  if (category) {
    whereClause.category = category;
  }

  const achievements = await db.achievement.findMany({
    where: whereClause,
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  // Parse criteria JSON for each achievement
  const result = achievements.map((a) => ({
    ...a,
    criteria: JSON.parse(a.criteria) as Record<string, unknown>,
  }));

  return c.json({ data: result });
});

// GET /achievements/user - Get user's earned achievements
gamificationRouter.get(
  "/achievements/user",
  zValidator("query", z.object({ userId: z.string() })),
  async (c) => {
    const { userId } = c.req.valid("query");

    const userAchievements = await db.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { earnedAt: "desc" },
    });

    const result = userAchievements.map((ua) => ({
      id: ua.achievement.id,
      name: ua.achievement.name,
      description: ua.achievement.description,
      iconName: ua.achievement.iconName,
      category: ua.achievement.category,
      earnedAt: ua.earnedAt,
      criteria: JSON.parse(ua.achievement.criteria) as Record<string, unknown>,
    }));

    return c.json({ data: result });
  }
);

// POST /achievements/check - Check and award new achievements for a user
const checkAchievementsSchema = z.object({
  userId: z.string(),
});

gamificationRouter.post(
  "/achievements/check",
  zValidator("json", checkAchievementsSchema),
  async (c) => {
    const { userId } = c.req.valid("json");

    const newAchievements = await checkAchievements(userId);

    return c.json({ data: { newAchievements } });
  }
);

// ==================== DAILY CHALLENGE ====================

// GET /daily-challenge - Get today's challenge
gamificationRouter.get(
  "/daily-challenge",
  zValidator("query", z.object({ userId: z.string().optional() })),
  async (c) => {
    const userId = c.req.query("userId");

    // Get today's date at midnight UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const challenge = await db.dailyChallenge.findUnique({
      where: { date: today },
    });

    if (!challenge) {
      return c.json(
        { error: { message: "No daily challenge available for today", code: "NOT_FOUND" } },
        404
      );
    }

    // Check if user has already attempted
    let hasAttempted = false;
    let userAttempt = null;

    if (userId) {
      const attempt = await db.dailyChallengeAttempt.findUnique({
        where: {
          userId_challengeId: {
            userId,
            challengeId: challenge.id,
          },
        },
      });

      if (attempt) {
        hasAttempted = true;
        userAttempt = {
          answer: attempt.answer,
          isCorrect: attempt.isCorrect,
          completedAt: attempt.completedAt,
        };
      }
    }

    // Parse options
    const options = JSON.parse(challenge.options) as Array<{ id: string; text: string }>;

    return c.json({
      data: {
        id: challenge.id,
        date: challenge.date,
        question: challenge.question,
        options,
        category: challenge.category,
        pointsReward: challenge.pointsReward,
        hasAttempted,
        userAttempt,
        // Only include answer info if already attempted
        ...(hasAttempted
          ? {
              correctAnswer: challenge.correctAnswer,
              explanation: challenge.explanation,
            }
          : {}),
      },
    });
  }
);

// POST /daily-challenge/submit - Submit answer to daily challenge
const submitChallengeSchema = z.object({
  userId: z.string(),
  challengeId: z.string(),
  answer: z.string(),
});

gamificationRouter.post(
  "/daily-challenge/submit",
  zValidator("json", submitChallengeSchema),
  async (c) => {
    const { userId, challengeId, answer } = c.req.valid("json");

    // Get the challenge
    const challenge = await db.dailyChallenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return c.json(
        { error: { message: "Challenge not found", code: "NOT_FOUND" } },
        404
      );
    }

    // Check if already attempted
    const existingAttempt = await db.dailyChallengeAttempt.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        },
      },
    });

    if (existingAttempt) {
      return c.json(
        {
          error: {
            message: "You have already attempted this challenge",
            code: "ALREADY_ATTEMPTED",
          },
        },
        400
      );
    }

    // Check if answer is correct
    const isCorrect = answer === challenge.correctAnswer;

    // Create attempt record
    const attempt = await db.dailyChallengeAttempt.create({
      data: {
        userId,
        challengeId,
        answer,
        isCorrect,
      },
    });

    // If correct, add points to user progress
    let pointsEarned = 0;
    if (isCorrect) {
      pointsEarned = challenge.pointsReward;

      // Update user progress
      await db.userProgress.upsert({
        where: { userId },
        create: {
          userId,
          totalPoints: pointsEarned,
          explorerRank: getRankForPoints(pointsEarned),
          dailyStreak: 1,
          longestStreak: 1,
          lastActiveDate: new Date(),
        },
        update: {
          totalPoints: { increment: pointsEarned },
        },
      });

      // Update rank if needed
      const progress = await db.userProgress.findUnique({
        where: { userId },
      });

      if (progress) {
        const newRank = getRankForPoints(progress.totalPoints);
        if (newRank !== progress.explorerRank) {
          await db.userProgress.update({
            where: { userId },
            data: { explorerRank: newRank },
          });
        }
      }
    }

    return c.json({
      data: {
        isCorrect,
        correctAnswer: challenge.correctAnswer,
        explanation: challenge.explanation,
        pointsEarned,
        completedAt: attempt.completedAt,
      },
    });
  }
);

// ==================== LEADERBOARD ====================

// GET /leaderboard - Get class or global leaderboard
gamificationRouter.get("/leaderboard", async (c) => {
  const limit = parseInt(c.req.query("limit") || "10");
  const classId = c.req.query("classId");

  if (classId) {
    // Class leaderboard - get students from that class with their progress
    const classStudents = await db.classStudent.findMany({
      where: { classId },
      select: {
        id: true,
        displayName: true,
      },
    });

    // Get progress for each student (using displayName as userId for simplicity)
    const leaderboardData = await Promise.all(
      classStudents.map(async (student) => {
        const progress = await db.userProgress.findUnique({
          where: { userId: student.displayName },
        });

        return {
          userId: student.displayName,
          displayName: student.displayName,
          totalPoints: progress?.totalPoints || 0,
          explorerRank: progress?.explorerRank || "Apprentice Voyageur",
          quizzesTaken: progress?.quizzesTaken || 0,
          fieldTripsCompleted: progress?.fieldTripsCompleted || 0,
          dailyStreak: progress?.dailyStreak || 0,
        };
      })
    );

    // Sort by total points
    leaderboardData.sort((a, b) => b.totalPoints - a.totalPoints);

    // Add rank numbers
    const rankedData = leaderboardData.slice(0, limit).map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));

    return c.json({ data: rankedData });
  }

  // Global leaderboard
  const topUsers = await db.userProgress.findMany({
    orderBy: { totalPoints: "desc" },
    take: limit,
    select: {
      userId: true,
      totalPoints: true,
      explorerRank: true,
      quizzesTaken: true,
      fieldTripsCompleted: true,
      dailyStreak: true,
    },
  });

  const rankedData = topUsers.map((user, index) => ({
    rank: index + 1,
    userId: user.userId,
    displayName: user.userId, // Could be enhanced to get actual display name
    totalPoints: user.totalPoints,
    explorerRank: user.explorerRank,
    quizzesTaken: user.quizzesTaken,
    fieldTripsCompleted: user.fieldTripsCompleted,
    dailyStreak: user.dailyStreak,
  }));

  return c.json({ data: rankedData });
});

// ==================== RANKS INFO ====================

// GET /ranks - Get all rank information
gamificationRouter.get("/ranks", (c) => {
  const ranksWithInfo = RANKS.map((rank, index) => ({
    name: rank.name,
    minPoints: rank.minPoints,
    maxPoints: rank.maxPoints === Infinity ? null : rank.maxPoints,
    level: index + 1,
  }));

  return c.json({ data: ranksWithInfo });
});

export { gamificationRouter };
