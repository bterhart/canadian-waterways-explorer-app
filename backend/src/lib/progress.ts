// Server-side progress: points, streaks, ranks, achievements and class-assignment
// completion, keyed by the anonymous device identity (mobile lib/identity.ts).
//
// Everything here is awarded by the server when something actually happens
// (quiz submitted, journal entry written, lesson/field trip marked complete),
// so no client ever decides how many points it gets.
import { db } from "../db";

export type ActivityType =
  | "waterway_explored"
  | "location_visited"
  | "quiz_completed"
  | "lesson_completed"
  | "field_trip_completed"
  | "journal_entry"
  | "pronunciation_learned"
  | "document_read";

// Point values. The shipped user guide states: quiz 10–20, waterway 5,
// lesson plan 15, field trip 20, daily challenge 10.
export const POINTS = {
  quizBase: 10,       // + up to 10 bonus by percentage score (see quizPoints)
  lessonCompleted: 15,
  fieldTripCompleted: 20,
  journalEntry: 5,
  waterwayExplored: 5,
  // Exploration awarded once per record per device via POST /api/gamification/explore
  // (decision 9, 2026-10-16); UserExploration rows make the award idempotent.
  locationVisited: 3,
  documentRead: 5,
  pronunciationLearned: 2,
} as const;

/** The four activities a device earns by opening or marking a record, once each. */
export const EXPLORATION_ACTIVITIES = {
  waterway_explored: POINTS.waterwayExplored,
  location_visited: POINTS.locationVisited,
  document_read: POINTS.documentRead,
  pronunciation_learned: POINTS.pronunciationLearned,
} as const;
export type ExplorationActivity = keyof typeof EXPLORATION_ACTIVITIES;

/** 10–20 points: base plus a bonus proportional to the percentage score. */
export const quizPoints = (percentageScore: number): number =>
  POINTS.quizBase + Math.round(Math.min(100, Math.max(0, percentageScore)) / 10);

// Explorer ranks (same thresholds as routes/gamification.ts)
export const RANKS = [
  { name: "Apprentice Voyageur", minPoints: 0, maxPoints: 100 },
  { name: "Junior Explorer", minPoints: 101, maxPoints: 300 },
  { name: "Fur Trade Clerk", minPoints: 301, maxPoints: 600 },
  { name: "Seasoned Voyageur", minPoints: 601, maxPoints: 1000 },
  { name: "Fort Factor", minPoints: 1001, maxPoints: 1500 },
  { name: "Chief Trader", minPoints: 1501, maxPoints: 2500 },
  { name: "Master Explorer", minPoints: 2501, maxPoints: Infinity },
];

export function getRankForPoints(points: number): string {
  const rank = RANKS.find((r) => points >= r.minPoints && points <= r.maxPoints);
  return rank?.name || "Apprentice Voyageur";
}

export interface ActivityResult {
  pointsAdded: number;
  newTotalPoints: number;
  explorerRank: string;
  rankedUp: boolean;
  previousRank: string | null;
}

/**
 * Add points for an activity, bump the matching counter, maintain the daily streak
 * and rank. Creates the UserProgress row on first activity.
 */
export async function recordActivity(
  userId: string,
  activityType: ActivityType,
  points: number,
  activityData?: { quizPoints?: number }
): Promise<ActivityResult> {
  let progress = await db.userProgress.findUnique({ where: { userId } });
  if (!progress) {
    progress = await db.userProgress.create({ data: { userId } });
  }

  const updateData: Record<string, unknown> = {
    totalPoints: progress.totalPoints + points,
  };

  switch (activityType) {
    case "waterway_explored":
      updateData.waterwaysExplored = progress.waterwaysExplored + 1;
      break;
    case "location_visited":
      updateData.locationsVisited = progress.locationsVisited + 1;
      break;
    case "quiz_completed":
      updateData.quizzesTaken = progress.quizzesTaken + 1;
      updateData.quizPointsEarned = progress.quizPointsEarned + (activityData?.quizPoints ?? 0);
      break;
    case "field_trip_completed":
      updateData.fieldTripsCompleted = progress.fieldTripsCompleted + 1;
      break;
    case "journal_entry":
      updateData.journalEntriesWritten = progress.journalEntriesWritten + 1;
      break;
    case "pronunciation_learned":
      updateData.pronunciationsLearned = progress.pronunciationsLearned + 1;
      break;
    case "document_read":
      updateData.documentsRead = progress.documentsRead + 1;
      break;
    case "lesson_completed":
      // No dedicated counter on UserProgress; points and streak still apply.
      break;
  }

  // Daily streak (UTC day boundaries, consistent with the daily challenge)
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (progress.lastActiveDate) {
    const lastActive = new Date(progress.lastActiveDate);
    lastActive.setUTCHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / 86_400_000);
    if (daysDiff === 1) {
      updateData.dailyStreak = progress.dailyStreak + 1;
      updateData.longestStreak = Math.max(progress.longestStreak, progress.dailyStreak + 1);
    } else if (daysDiff > 1) {
      updateData.dailyStreak = 1;
    }
  } else {
    updateData.dailyStreak = 1;
    updateData.longestStreak = 1;
  }
  updateData.lastActiveDate = today;

  const newTotalPoints = progress.totalPoints + points;
  const newRank = getRankForPoints(newTotalPoints);
  const rankedUp = newRank !== progress.explorerRank;
  if (rankedUp) updateData.explorerRank = newRank;

  const updated = await db.userProgress.update({ where: { userId }, data: updateData });

  return {
    pointsAdded: points,
    newTotalPoints: updated.totalPoints,
    explorerRank: updated.explorerRank,
    rankedUp,
    previousRank: rankedUp ? progress.explorerRank : null,
  };
}

export interface EarnedAchievement {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: string;
}

/** Award every achievement whose criteria the user's progress now meets. */
export async function checkAchievements(userId: string): Promise<EarnedAchievement[]> {
  const progress = await db.userProgress.findUnique({ where: { userId } });
  if (!progress) return [];

  const earned = await db.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  });
  const earnedIds = new Set(earned.map((a) => a.achievementId));
  const candidates = (await db.achievement.findMany()).filter((a) => !earnedIds.has(a.id));

  const newlyEarned: EarnedAchievement[] = [];
  for (const achievement of candidates) {
    let criteria: { type: string; count?: number; points?: number };
    try {
      criteria = JSON.parse(achievement.criteria);
    } catch {
      continue; // malformed criteria never blocks the rest
    }
    let met = false;
    switch (criteria.type) {
      case "waterways_explored": met = progress.waterwaysExplored >= (criteria.count ?? 0); break;
      case "locations_visited": met = progress.locationsVisited >= (criteria.count ?? 0); break;
      case "quizzes_completed": met = progress.quizzesTaken >= (criteria.count ?? 0); break;
      case "field_trips_completed": met = progress.fieldTripsCompleted >= (criteria.count ?? 0); break;
      case "journal_entries": met = progress.journalEntriesWritten >= (criteria.count ?? 0); break;
      case "pronunciations_learned": met = progress.pronunciationsLearned >= (criteria.count ?? 0); break;
      case "documents_read": met = progress.documentsRead >= (criteria.count ?? 0); break;
      case "total_points": met = progress.totalPoints >= (criteria.points ?? 0); break;
      case "daily_streak": met = progress.dailyStreak >= (criteria.count ?? 0); break;
    }
    if (!met) continue;
    await db.userAchievement.create({ data: { userId, achievementId: achievement.id } });
    newlyEarned.push({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      iconName: achievement.iconName,
      category: achievement.category,
    });
  }
  return newlyEarned;
}

export type AssignmentKind = "quiz" | "lesson_plan" | "field_trip";

/**
 * Mark matching class assignments complete for every class the device belongs to.
 * Returns the number of StudentProgress rows written.
 */
export async function recordAssignmentCompletion(args: {
  userId: string;
  kind: AssignmentKind;
  resourceId: string;
  score?: number | null;
  maxScore?: number | null;
}): Promise<number> {
  const memberships = await db.classStudent.findMany({
    where: { userId: args.userId },
    select: { id: true, classId: true },
  });
  if (memberships.length === 0) return 0;

  const resourceWhere =
    args.kind === "quiz"
      ? { quizId: args.resourceId }
      : args.kind === "lesson_plan"
        ? { lessonPlanId: args.resourceId }
        : { fieldTripId: args.resourceId };

  const assignments = await db.classAssignment.findMany({
    where: {
      isActive: true,
      assignmentType: args.kind,
      classId: { in: memberships.map((m) => m.classId) },
      ...resourceWhere,
    },
    select: { id: true, classId: true },
  });

  let written = 0;
  const now = new Date();
  for (const assignment of assignments) {
    const member = memberships.find((m) => m.classId === assignment.classId);
    if (!member) continue;
    await db.studentProgress.upsert({
      where: { studentId_assignmentId: { studentId: member.id, assignmentId: assignment.id } },
      update: {
        status: "completed",
        ...(args.score !== undefined && { score: args.score }),
        ...(args.maxScore !== undefined && { maxScore: args.maxScore }),
        completedAt: now,
      },
      create: {
        studentId: member.id,
        assignmentId: assignment.id,
        status: "completed",
        score: args.score ?? null,
        maxScore: args.maxScore ?? null,
        startedAt: now,
        completedAt: now,
      },
    });
    written++;
  }
  return written;
}

/** Convenience: points + achievements + assignment completion in one call. */
export async function completeResource(args: {
  userId: string;
  kind: AssignmentKind;
  resourceId: string;
  points: number;
  activityType: ActivityType;
  activityData?: { quizPoints?: number };
  score?: number | null;
  maxScore?: number | null;
}): Promise<{ activity: ActivityResult; newAchievements: EarnedAchievement[]; assignmentsCompleted: number }> {
  const activity = await recordActivity(args.userId, args.activityType, args.points, args.activityData);
  const newAchievements = await checkAchievements(args.userId);
  const assignmentsCompleted = await recordAssignmentCompletion({
    userId: args.userId,
    kind: args.kind,
    resourceId: args.resourceId,
    score: args.score,
    maxScore: args.maxScore,
  });
  return { activity, newAchievements, assignmentsCompleted };
}
