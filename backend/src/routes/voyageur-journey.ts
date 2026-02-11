import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../prisma";

const voyageurJourneyRouter = new Hono();

// Choice type for parsed choices JSON
interface JourneyChoice {
  id: string;
  text: string;
  nextNodeId: string;
  consequence?: string;
  pointsChange?: number;
}

// GET / - List all published journeys
voyageurJourneyRouter.get("/", async (c) => {
  const gradeLevel = c.req.query("gradeLevel");
  const difficulty = c.req.query("difficulty");

  const whereClause: {
    isPublished: boolean;
    gradeLevel?: string;
    difficulty?: string;
  } = {
    isPublished: true,
  };

  if (gradeLevel) {
    whereClause.gradeLevel = gradeLevel;
  }
  if (difficulty) {
    whereClause.difficulty = difficulty;
  }

  const journeys = await prisma.voyageurJourney.findMany({
    where: whereClause,
    select: {
      id: true,
      title: true,
      description: true,
      gradeLevel: true,
      difficulty: true,
      estimatedMinutes: true,
      coverImageUrl: true,
      startingLocation: true,
      endingLocation: true,
      historicalYear: true,
      createdAt: true,
      _count: {
        select: { nodes: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const result = journeys.map((journey) => ({
    id: journey.id,
    title: journey.title,
    description: journey.description,
    gradeLevel: journey.gradeLevel,
    difficulty: journey.difficulty,
    estimatedMinutes: journey.estimatedMinutes,
    coverImageUrl: journey.coverImageUrl,
    startingLocation: journey.startingLocation,
    endingLocation: journey.endingLocation,
    historicalYear: journey.historicalYear,
    createdAt: journey.createdAt,
    nodeCount: journey._count.nodes,
  }));

  return c.json({ data: result });
});

// GET /:id - Get journey with all nodes
voyageurJourneyRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const journey = await prisma.voyageurJourney.findUnique({
    where: { id, isPublished: true },
    include: {
      nodes: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!journey) {
    return c.json(
      { error: { message: "Journey not found", code: "NOT_FOUND" } },
      404
    );
  }

  // Parse choices JSON for each node
  const journeyWithParsedNodes = {
    ...journey,
    nodes: journey.nodes.map((node) => ({
      ...node,
      choices: node.choices ? (JSON.parse(node.choices) as JourneyChoice[]) : null,
    })),
  };

  return c.json({ data: journeyWithParsedNodes });
});

// GET /:id/start - Start a journey (creates progress record)
voyageurJourneyRouter.get("/:id/start", async (c) => {
  const journeyId = c.req.param("id");
  const userId = c.req.query("userId");

  if (!userId) {
    return c.json(
      { error: { message: "userId is required", code: "BAD_REQUEST" } },
      400
    );
  }

  // Check journey exists
  const journey = await prisma.voyageurJourney.findUnique({
    where: { id: journeyId, isPublished: true },
    include: {
      nodes: {
        orderBy: { orderIndex: "asc" },
        take: 1, // Get the first node
      },
    },
  });

  if (!journey) {
    return c.json(
      { error: { message: "Journey not found", code: "NOT_FOUND" } },
      404
    );
  }

  const firstNode = journey.nodes[0];
  if (!firstNode) {
    return c.json(
      { error: { message: "Journey has no nodes", code: "INVALID_JOURNEY" } },
      400
    );
  }

  // Create or reset progress
  const progress = await prisma.userJourneyProgress.upsert({
    where: {
      userId_journeyId: {
        userId,
        journeyId,
      },
    },
    update: {
      currentNodeId: firstNode.id,
      choicesMade: JSON.stringify([]),
      score: 0,
      status: "in_progress",
      startedAt: new Date(),
      completedAt: null,
    },
    create: {
      userId,
      journeyId,
      currentNodeId: firstNode.id,
      choicesMade: JSON.stringify([]),
      score: 0,
      status: "in_progress",
    },
  });

  // Return the first node with parsed choices
  const nodeWithChoices = {
    ...firstNode,
    choices: firstNode.choices ? (JSON.parse(firstNode.choices) as JourneyChoice[]) : null,
  };

  return c.json({
    data: {
      progress: {
        id: progress.id,
        currentNodeId: progress.currentNodeId,
        choicesMade: JSON.parse(progress.choicesMade) as string[],
        score: progress.score,
        status: progress.status,
        startedAt: progress.startedAt,
      },
      currentNode: nodeWithChoices,
      journey: {
        id: journey.id,
        title: journey.title,
        description: journey.description,
        startingLocation: journey.startingLocation,
        endingLocation: journey.endingLocation,
        historicalYear: journey.historicalYear,
      },
    },
  });
});

// Choice schema for making a choice at a node
const makeChoiceSchema = z.object({
  userId: z.string(),
  nodeId: z.string(),
  choiceId: z.string(),
});

// POST /:id/choice - Make a choice at a node
voyageurJourneyRouter.post(
  "/:id/choice",
  zValidator("json", makeChoiceSchema),
  async (c) => {
    const journeyId = c.req.param("id");
    const { userId, nodeId, choiceId } = c.req.valid("json");

    // Get user's progress
    const progress = await prisma.userJourneyProgress.findUnique({
      where: {
        userId_journeyId: {
          userId,
          journeyId,
        },
      },
    });

    if (!progress) {
      return c.json(
        { error: { message: "Journey not started. Call /start first.", code: "NOT_STARTED" } },
        400
      );
    }

    if (progress.status === "completed") {
      return c.json(
        { error: { message: "Journey already completed", code: "ALREADY_COMPLETED" } },
        400
      );
    }

    // Get current node to validate the choice
    const currentNode = await prisma.journeyNode.findUnique({
      where: { id: nodeId },
    });

    if (!currentNode) {
      return c.json(
        { error: { message: "Node not found", code: "NOT_FOUND" } },
        404
      );
    }

    if (currentNode.journeyId !== journeyId) {
      return c.json(
        { error: { message: "Node does not belong to this journey", code: "INVALID_NODE" } },
        400
      );
    }

    // Parse choices and find the selected one
    const choices = currentNode.choices
      ? (JSON.parse(currentNode.choices) as JourneyChoice[])
      : [];

    const selectedChoice = choices.find((choice) => choice.id === choiceId);

    if (!selectedChoice) {
      return c.json(
        { error: { message: "Invalid choice", code: "INVALID_CHOICE" } },
        400
      );
    }

    // Get the next node
    const nextNode = await prisma.journeyNode.findUnique({
      where: { id: selectedChoice.nextNodeId },
    });

    if (!nextNode) {
      return c.json(
        { error: { message: "Next node not found", code: "INVALID_NEXT_NODE" } },
        400
      );
    }

    // Update progress
    const choicesMade = JSON.parse(progress.choicesMade) as string[];
    choicesMade.push(choiceId);

    const pointsChange = selectedChoice.pointsChange || 0;
    const newScore = Math.max(0, progress.score + pointsChange);

    const isCompleted = nextNode.isEnding;

    const updatedProgress = await prisma.userJourneyProgress.update({
      where: {
        userId_journeyId: {
          userId,
          journeyId,
        },
      },
      data: {
        currentNodeId: nextNode.id,
        choicesMade: JSON.stringify(choicesMade),
        score: newScore,
        status: isCompleted ? "completed" : "in_progress",
        completedAt: isCompleted ? new Date() : null,
      },
    });

    // Return the next node with parsed choices
    const nextNodeWithChoices = {
      ...nextNode,
      choices: nextNode.choices ? (JSON.parse(nextNode.choices) as JourneyChoice[]) : null,
    };

    return c.json({
      data: {
        choiceMade: {
          choiceId,
          text: selectedChoice.text,
          consequence: selectedChoice.consequence,
          pointsChange,
        },
        progress: {
          id: updatedProgress.id,
          currentNodeId: updatedProgress.currentNodeId,
          choicesMade: JSON.parse(updatedProgress.choicesMade) as string[],
          score: updatedProgress.score,
          status: updatedProgress.status,
          completedAt: updatedProgress.completedAt,
        },
        currentNode: nextNodeWithChoices,
        isEnding: nextNode.isEnding,
        endingType: nextNode.endingType,
      },
    });
  }
);

// GET /:id/progress - Get user's current progress
voyageurJourneyRouter.get("/:id/progress", async (c) => {
  const journeyId = c.req.param("id");
  const userId = c.req.query("userId");

  if (!userId) {
    return c.json(
      { error: { message: "userId is required", code: "BAD_REQUEST" } },
      400
    );
  }

  const progress = await prisma.userJourneyProgress.findUnique({
    where: {
      userId_journeyId: {
        userId,
        journeyId,
      },
    },
    include: {
      journey: {
        select: {
          id: true,
          title: true,
          description: true,
          startingLocation: true,
          endingLocation: true,
          historicalYear: true,
        },
      },
    },
  });

  if (!progress) {
    return c.json({
      data: {
        hasProgress: false,
        progress: null,
        currentNode: null,
      },
    });
  }

  // Get current node
  let currentNode = null;
  if (progress.currentNodeId) {
    const node = await prisma.journeyNode.findUnique({
      where: { id: progress.currentNodeId },
    });
    if (node) {
      currentNode = {
        ...node,
        choices: node.choices ? (JSON.parse(node.choices) as JourneyChoice[]) : null,
      };
    }
  }

  return c.json({
    data: {
      hasProgress: true,
      progress: {
        id: progress.id,
        currentNodeId: progress.currentNodeId,
        choicesMade: JSON.parse(progress.choicesMade) as string[],
        score: progress.score,
        status: progress.status,
        startedAt: progress.startedAt,
        completedAt: progress.completedAt,
      },
      currentNode,
      journey: progress.journey,
    },
  });
});

export { voyageurJourneyRouter };
