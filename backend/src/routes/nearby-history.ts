import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../prisma";

const nearbyHistoryRouter = new Hono();

/**
 * Haversine formula to calculate distance between two points on Earth
 * Returns distance in kilometers
 */
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Query validation schema
const nearbyQuerySchema = z.object({
  lat: z.string().transform((val) => parseFloat(val)),
  lng: z.string().transform((val) => parseFloat(val)),
  radius: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : 50)), // Default 50km
});

// GET /api/nearby-history/categories - Get all available categories
// MUST be defined BEFORE the /:id route to avoid matching "categories" as an id
nearbyHistoryRouter.get("/categories", async (c) => {
  const categories = [
    { id: "exploration", label: "Exploration", icon: "compass" },
    { id: "fur_trade", label: "Fur Trade", icon: "package" },
    { id: "indigenous", label: "Indigenous History", icon: "users" },
    { id: "settlement", label: "Settlement", icon: "home" },
    { id: "battle", label: "Battle", icon: "shield" },
    { id: "treaty", label: "Treaty", icon: "file-text" },
    { id: "maritime", label: "Maritime", icon: "anchor" },
  ];

  return c.json({ data: categories });
});

// GET /api/nearby-history/waterways - Get waterways near location
nearbyHistoryRouter.get(
  "/waterways",
  zValidator("query", nearbyQuerySchema),
  async (c) => {
    const { lat, lng, radius } = c.req.valid("query");

    if (isNaN(lat) || isNaN(lng)) {
      return c.json(
        { error: { message: "Invalid coordinates", code: "INVALID_COORDS" } },
        400
      );
    }

    const allWaterways = await prisma.waterway.findMany({
      select: {
        id: true,
        name: true,
        indigenousName: true,
        latitude: true,
        longitude: true,
        regionName: true,
        historicalSignificance: true,
        type: { select: { name: true } },
      },
    });

    const nearbyWaterways = allWaterways
      .map((waterway) => ({
        ...waterway,
        distance: haversineDistance(
          lat,
          lng,
          waterway.latitude,
          waterway.longitude
        ),
      }))
      .filter((waterway) => waterway.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    return c.json({
      data: {
        waterways: nearbyWaterways,
        searchLocation: { latitude: lat, longitude: lng },
        radiusKm: radius,
        totalFound: nearbyWaterways.length,
      },
    });
  }
);

// GET /api/nearby-history/locations - Get historic locations nearby
nearbyHistoryRouter.get(
  "/locations",
  zValidator("query", nearbyQuerySchema),
  async (c) => {
    const { lat, lng, radius } = c.req.valid("query");

    if (isNaN(lat) || isNaN(lng)) {
      return c.json(
        { error: { message: "Invalid coordinates", code: "INVALID_COORDS" } },
        400
      );
    }

    const allLocations = await prisma.location.findMany({
      select: {
        id: true,
        name: true,
        indigenousName: true,
        latitude: true,
        longitude: true,
        locationType: true,
        yearEstablished: true,
        historicalNotes: true,
        waterway: { select: { id: true, name: true } },
      },
    });

    const nearbyLocations = allLocations
      .map((location) => ({
        ...location,
        distance: haversineDistance(
          lat,
          lng,
          location.latitude,
          location.longitude
        ),
      }))
      .filter((location) => location.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    return c.json({
      data: {
        locations: nearbyLocations,
        searchLocation: { latitude: lat, longitude: lng },
        radiusKm: radius,
        totalFound: nearbyLocations.length,
      },
    });
  }
);

// GET /api/nearby-history/by-category - Get events filtered by category
nearbyHistoryRouter.get(
  "/by-category",
  zValidator(
    "query",
    nearbyQuerySchema.extend({
      category: z.string().optional(),
    })
  ),
  async (c) => {
    const { lat, lng, radius, category } = c.req.valid("query");

    if (isNaN(lat) || isNaN(lng)) {
      return c.json(
        { error: { message: "Invalid coordinates", code: "INVALID_COORDS" } },
        400
      );
    }

    const whereClause = category ? { category } : {};

    const allEvents = await prisma.historicalEvent.findMany({
      where: whereClause,
      orderBy: { year: "asc" },
    });

    const nearbyEvents = allEvents
      .map((event) => ({
        ...event,
        distance: haversineDistance(lat, lng, event.latitude, event.longitude),
      }))
      .filter((event) => event.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    return c.json({
      data: {
        events: nearbyEvents,
        searchLocation: { latitude: lat, longitude: lng },
        radiusKm: radius,
        totalFound: nearbyEvents.length,
        category: category || "all",
      },
    });
  }
);

// GET /api/nearby-history - Get historical events within radius
nearbyHistoryRouter.get(
  "/",
  zValidator("query", nearbyQuerySchema),
  async (c) => {
    const { lat, lng, radius } = c.req.valid("query");

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng)) {
      return c.json(
        { error: { message: "Invalid coordinates", code: "INVALID_COORDS" } },
        400
      );
    }

    // Fetch all historical events
    const allEvents = await prisma.historicalEvent.findMany({
      orderBy: { year: "asc" },
    });

    // Filter events within radius and calculate distance
    const nearbyEvents = allEvents
      .map((event) => ({
        ...event,
        distance: haversineDistance(lat, lng, event.latitude, event.longitude),
      }))
      .filter((event) => event.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    return c.json({
      data: {
        events: nearbyEvents,
        searchLocation: { latitude: lat, longitude: lng },
        radiusKm: radius,
        totalFound: nearbyEvents.length,
      },
    });
  }
);

// GET /api/nearby-history/:id - Get single event details
// MUST be defined LAST to avoid catching other routes
nearbyHistoryRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const event = await prisma.historicalEvent.findUnique({
    where: { id },
  });

  if (!event) {
    return c.json(
      { error: { message: "Historical event not found", code: "NOT_FOUND" } },
      404
    );
  }

  // Fetch related data if IDs exist
  let relatedExplorer = null;
  let relatedWaterway = null;
  let relatedLocation = null;

  if (event.explorerId) {
    relatedExplorer = await prisma.explorer.findUnique({
      where: { id: event.explorerId },
      select: { id: true, name: true, birthYear: true, deathYear: true },
    });
  }

  if (event.waterwayId) {
    relatedWaterway = await prisma.waterway.findUnique({
      where: { id: event.waterwayId },
      select: {
        id: true,
        name: true,
        indigenousName: true,
        latitude: true,
        longitude: true,
      },
    });
  }

  if (event.locationId) {
    relatedLocation = await prisma.location.findUnique({
      where: { id: event.locationId },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        locationType: true,
      },
    });
  }

  return c.json({
    data: {
      ...event,
      relatedExplorer,
      relatedWaterway,
      relatedLocation,
    },
  });
});

export { nearbyHistoryRouter };
