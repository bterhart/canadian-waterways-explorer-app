import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../prisma";

const contributionsRouter = new Hono();

// Validation schema for creating a contribution
const createContributionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  contributionType: z.enum(["photo", "description", "historical_fact", "story"]),
  contributorName: z.string().optional(),
  contributorEmail: z.string().email().optional(),
  waterwayId: z.string().optional(),
  locationId: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

// POST / - Submit a new contribution
contributionsRouter.post(
  "/",
  zValidator("json", createContributionSchema),
  async (c) => {
    const data = c.req.valid("json");

    // Validate that at least one of waterwayId or locationId is provided
    if (!data.waterwayId && !data.locationId) {
      return c.json(
        { error: { message: "Either waterwayId or locationId must be provided", code: "VALIDATION_ERROR" } },
        400
      );
    }

    // Verify the waterway exists if waterwayId is provided
    if (data.waterwayId) {
      const waterway = await prisma.waterway.findUnique({
        where: { id: data.waterwayId },
      });
      if (!waterway) {
        return c.json(
          { error: { message: "Waterway not found", code: "NOT_FOUND" } },
          404
        );
      }
    }

    // Verify the location exists if locationId is provided
    if (data.locationId) {
      const location = await prisma.location.findUnique({
        where: { id: data.locationId },
      });
      if (!location) {
        return c.json(
          { error: { message: "Location not found", code: "NOT_FOUND" } },
          404
        );
      }
    }

    const contribution = await prisma.userContribution.create({
      data: {
        title: data.title,
        content: data.content,
        contributionType: data.contributionType,
        contributorName: data.contributorName,
        contributorEmail: data.contributorEmail,
        waterwayId: data.waterwayId,
        locationId: data.locationId,
        imageUrl: data.imageUrl,
        status: "pending",
      },
    });

    return c.json({ data: contribution }, 201);
  }
);

// GET / - Get all approved contributions (for public display)
contributionsRouter.get("/", async (c) => {
  const contributions = await prisma.userContribution.findMany({
    where: { status: "approved" },
    select: {
      id: true,
      title: true,
      content: true,
      contributionType: true,
      contributorName: true,
      imageUrl: true,
      waterwayId: true,
      locationId: true,
      createdAt: true,
      waterway: {
        select: {
          id: true,
          name: true,
        },
      },
      location: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ data: contributions });
});

// GET /waterway/:waterwayId - Get approved contributions for a specific waterway
contributionsRouter.get("/waterway/:waterwayId", async (c) => {
  const waterwayId = c.req.param("waterwayId");

  // Verify the waterway exists
  const waterway = await prisma.waterway.findUnique({
    where: { id: waterwayId },
  });

  if (!waterway) {
    return c.json(
      { error: { message: "Waterway not found", code: "NOT_FOUND" } },
      404
    );
  }

  const contributions = await prisma.userContribution.findMany({
    where: {
      waterwayId: waterwayId,
      status: "approved",
    },
    select: {
      id: true,
      title: true,
      content: true,
      contributionType: true,
      contributorName: true,
      imageUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ data: contributions });
});

// GET /location/:locationId - Get approved contributions for a specific location
contributionsRouter.get("/location/:locationId", async (c) => {
  const locationId = c.req.param("locationId");

  // Verify the location exists
  const location = await prisma.location.findUnique({
    where: { id: locationId },
  });

  if (!location) {
    return c.json(
      { error: { message: "Location not found", code: "NOT_FOUND" } },
      404
    );
  }

  const contributions = await prisma.userContribution.findMany({
    where: {
      locationId: locationId,
      status: "approved",
    },
    select: {
      id: true,
      title: true,
      content: true,
      contributionType: true,
      contributorName: true,
      imageUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ data: contributions });
});

export { contributionsRouter };
