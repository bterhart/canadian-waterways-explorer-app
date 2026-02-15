import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Script to fix ALL Wikimedia image URLs across the database
 *
 * PROBLEM: URLs with /thumb/ pattern return 404
 * WRONG: https://upload.wikimedia.org/wikipedia/commons/thumb/...
 *
 * SOLUTION: Use Special:FilePath format which returns 200
 * CORRECT: https://commons.wikimedia.org/wiki/Special:FilePath/FILENAME.jpg?width=800
 */

/**
 * Extract filename from a Wikimedia URL and convert to Special:FilePath format
 */
function fixWikimediaUrl(url: string | null): string | null {
  if (!url) return null;

  // Already in correct format
  if (url.includes("Special:FilePath")) {
    return url;
  }

  // Extract filename from /thumb/ URLs
  // Pattern: /wikipedia/commons/thumb/X/XX/FILENAME.jpg/WIDTHpx-FILENAME.jpg
  const thumbMatch = url.match(/\/commons\/thumb\/[0-9a-f]\/[0-9a-f]{2}\/([^\/]+)\//);
  if (thumbMatch && thumbMatch[1]) {
    const filename = thumbMatch[1];
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=800`;
  }

  // Extract filename from direct URLs
  // Pattern: /wikipedia/commons/X/XX/FILENAME.jpg
  const directMatch = url.match(/\/commons\/[0-9a-f]\/[0-9a-f]{2}\/([^?]+)/);
  if (directMatch && directMatch[1]) {
    const filename = directMatch[1];
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=800`;
  }

  // If it's a Wikimedia URL but doesn't match known patterns, leave it
  return url;
}

async function fixLessonPlanImages() {
  console.log("\n=== Fixing LessonPlan heroImageUrl ===\n");

  const lessonPlans = await prisma.lessonPlan.findMany({
    where: {
      heroImageUrl: {
        not: null,
        contains: "wikimedia"
      }
    },
    select: { id: true, title: true, heroImageUrl: true }
  });

  console.log(`Found ${lessonPlans.length} lesson plans with Wikimedia images`);

  let updated = 0;
  for (const plan of lessonPlans) {
    const oldUrl = plan.heroImageUrl;
    const newUrl = fixWikimediaUrl(oldUrl);

    if (newUrl && newUrl !== oldUrl) {
      await prisma.lessonPlan.update({
        where: { id: plan.id },
        data: { heroImageUrl: newUrl }
      });
      console.log(`  ✓ ${plan.title}`);
      console.log(`    OLD: ${oldUrl?.substring(0, 80)}...`);
      console.log(`    NEW: ${newUrl.substring(0, 80)}...`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} lesson plan images`);
}

async function fixLocationImages() {
  console.log("\n=== Fixing Location imageUrl ===\n");

  const locations = await prisma.location.findMany({
    where: {
      imageUrl: {
        not: null,
        contains: "wikimedia"
      }
    },
    select: { id: true, name: true, imageUrl: true }
  });

  console.log(`Found ${locations.length} locations with Wikimedia images`);

  let updated = 0;
  for (const location of locations) {
    const oldUrl = location.imageUrl;
    const newUrl = fixWikimediaUrl(oldUrl);

    if (newUrl && newUrl !== oldUrl) {
      await prisma.location.update({
        where: { id: location.id },
        data: { imageUrl: newUrl }
      });
      console.log(`  ✓ ${location.name}`);
      console.log(`    OLD: ${oldUrl?.substring(0, 80)}...`);
      console.log(`    NEW: ${newUrl.substring(0, 80)}...`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} location images`);
}

async function fixExplorerImages() {
  console.log("\n=== Fixing Explorer imageUrl ===\n");

  const explorers = await prisma.explorer.findMany({
    where: {
      imageUrl: {
        not: null,
        contains: "wikimedia"
      }
    },
    select: { id: true, name: true, imageUrl: true }
  });

  console.log(`Found ${explorers.length} explorers with Wikimedia images`);

  let updated = 0;
  for (const explorer of explorers) {
    const oldUrl = explorer.imageUrl;
    const newUrl = fixWikimediaUrl(oldUrl);

    if (newUrl && newUrl !== oldUrl) {
      await prisma.explorer.update({
        where: { id: explorer.id },
        data: { imageUrl: newUrl }
      });
      console.log(`  ✓ ${explorer.name}`);
      console.log(`    OLD: ${oldUrl?.substring(0, 80)}...`);
      console.log(`    NEW: ${newUrl.substring(0, 80)}...`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} explorer images`);
}

async function fixFieldTripCoverImages() {
  console.log("\n=== Fixing VirtualFieldTrip coverImageUrl ===\n");

  const trips = await prisma.virtualFieldTrip.findMany({
    where: {
      coverImageUrl: {
        not: null,
        contains: "wikimedia"
      }
    },
    select: { id: true, title: true, coverImageUrl: true }
  });

  console.log(`Found ${trips.length} field trips with Wikimedia images`);

  let updated = 0;
  for (const trip of trips) {
    const oldUrl = trip.coverImageUrl;
    const newUrl = fixWikimediaUrl(oldUrl);

    if (newUrl && newUrl !== oldUrl) {
      await prisma.virtualFieldTrip.update({
        where: { id: trip.id },
        data: { coverImageUrl: newUrl }
      });
      console.log(`  ✓ ${trip.title}`);
      console.log(`    OLD: ${oldUrl?.substring(0, 80)}...`);
      console.log(`    NEW: ${newUrl.substring(0, 80)}...`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} field trip cover images`);
}

async function fixFieldTripStopImages() {
  console.log("\n=== Fixing FieldTripStop imageUrl ===\n");

  const stops = await prisma.fieldTripStop.findMany({
    where: {
      imageUrl: {
        not: null,
        contains: "wikimedia"
      }
    },
    select: { id: true, title: true, imageUrl: true }
  });

  console.log(`Found ${stops.length} field trip stops with Wikimedia images`);

  let updated = 0;
  for (const stop of stops) {
    const oldUrl = stop.imageUrl;
    const newUrl = fixWikimediaUrl(oldUrl);

    if (newUrl && newUrl !== oldUrl) {
      await prisma.fieldTripStop.update({
        where: { id: stop.id },
        data: { imageUrl: newUrl }
      });
      console.log(`  ✓ ${stop.title}`);
      console.log(`    OLD: ${oldUrl?.substring(0, 80)}...`);
      console.log(`    NEW: ${newUrl.substring(0, 80)}...`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} field trip stop images`);
}

async function fixTimelineEventImages() {
  console.log("\n=== Fixing TimelineEvent imageUrl ===\n");

  const events = await prisma.timelineEvent.findMany({
    where: {
      imageUrl: {
        not: null,
        contains: "wikimedia"
      }
    },
    select: { id: true, title: true, imageUrl: true }
  });

  console.log(`Found ${events.length} timeline events with Wikimedia images`);

  let updated = 0;
  for (const event of events) {
    const oldUrl = event.imageUrl;
    const newUrl = fixWikimediaUrl(oldUrl);

    if (newUrl && newUrl !== oldUrl) {
      await prisma.timelineEvent.update({
        where: { id: event.id },
        data: { imageUrl: newUrl }
      });
      console.log(`  ✓ ${event.title}`);
      console.log(`    OLD: ${oldUrl?.substring(0, 80)}...`);
      console.log(`    NEW: ${newUrl.substring(0, 80)}...`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} timeline event images`);
}

async function fixPrimarySourceDocumentImages() {
  console.log("\n=== Fixing PrimarySourceDocument imageUrl ===\n");

  const docs = await prisma.primarySourceDocument.findMany({
    where: {
      imageUrl: {
        not: null,
        contains: "wikimedia"
      }
    },
    select: { id: true, title: true, imageUrl: true }
  });

  console.log(`Found ${docs.length} primary source documents with Wikimedia images`);

  let updated = 0;
  for (const doc of docs) {
    const oldUrl = doc.imageUrl;
    const newUrl = fixWikimediaUrl(oldUrl);

    if (newUrl && newUrl !== oldUrl) {
      await prisma.primarySourceDocument.update({
        where: { id: doc.id },
        data: { imageUrl: newUrl }
      });
      console.log(`  ✓ ${doc.title}`);
      console.log(`    OLD: ${oldUrl?.substring(0, 80)}...`);
      console.log(`    NEW: ${newUrl.substring(0, 80)}...`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} primary source document images`);
}

async function fixJourneyNodeImages() {
  console.log("\n=== Fixing JourneyNode imageUrl ===\n");

  const nodes = await prisma.journeyNode.findMany({
    where: {
      imageUrl: {
        not: null,
        contains: "wikimedia"
      }
    },
    select: { id: true, title: true, imageUrl: true }
  });

  console.log(`Found ${nodes.length} journey nodes with Wikimedia images`);

  let updated = 0;
  for (const node of nodes) {
    const oldUrl = node.imageUrl;
    const newUrl = fixWikimediaUrl(oldUrl);

    if (newUrl && newUrl !== oldUrl) {
      await prisma.journeyNode.update({
        where: { id: node.id },
        data: { imageUrl: newUrl }
      });
      console.log(`  ✓ ${node.title || "Untitled node"}`);
      console.log(`    OLD: ${oldUrl?.substring(0, 80)}...`);
      console.log(`    NEW: ${newUrl.substring(0, 80)}...`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} journey node images`);
}

async function fixHistoricalEventImages() {
  console.log("\n=== Fixing HistoricalEvent imageUrl ===\n");

  const events = await prisma.historicalEvent.findMany({
    where: {
      imageUrl: {
        not: null,
        contains: "wikimedia"
      }
    },
    select: { id: true, title: true, imageUrl: true }
  });

  console.log(`Found ${events.length} historical events with Wikimedia images`);

  let updated = 0;
  for (const event of events) {
    const oldUrl = event.imageUrl;
    const newUrl = fixWikimediaUrl(oldUrl);

    if (newUrl && newUrl !== oldUrl) {
      await prisma.historicalEvent.update({
        where: { id: event.id },
        data: { imageUrl: newUrl }
      });
      console.log(`  ✓ ${event.title}`);
      console.log(`    OLD: ${oldUrl?.substring(0, 80)}...`);
      console.log(`    NEW: ${newUrl.substring(0, 80)}...`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} historical event images`);
}

async function fixNotableFigureImages() {
  console.log("\n=== Fixing NotableFigure imageUrl ===\n");

  const figures = await prisma.notableFigure.findMany({
    where: {
      imageUrl: {
        not: null,
        contains: "wikimedia"
      }
    },
    select: { id: true, name: true, imageUrl: true }
  });

  console.log(`Found ${figures.length} notable figures with Wikimedia images`);

  let updated = 0;
  for (const figure of figures) {
    const oldUrl = figure.imageUrl;
    const newUrl = fixWikimediaUrl(oldUrl);

    if (newUrl && newUrl !== oldUrl) {
      await prisma.notableFigure.update({
        where: { id: figure.id },
        data: { imageUrl: newUrl }
      });
      console.log(`  ✓ ${figure.name}`);
      console.log(`    OLD: ${oldUrl?.substring(0, 80)}...`);
      console.log(`    NEW: ${newUrl.substring(0, 80)}...`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} notable figure images`);
}

async function fixVoyageurJourneyImages() {
  console.log("\n=== Fixing VoyageurJourney coverImageUrl ===\n");

  const journeys = await prisma.voyageurJourney.findMany({
    where: {
      coverImageUrl: {
        not: null,
        contains: "wikimedia"
      }
    },
    select: { id: true, title: true, coverImageUrl: true }
  });

  console.log(`Found ${journeys.length} voyageur journeys with Wikimedia images`);

  let updated = 0;
  for (const journey of journeys) {
    const oldUrl = journey.coverImageUrl;
    const newUrl = fixWikimediaUrl(oldUrl);

    if (newUrl && newUrl !== oldUrl) {
      await prisma.voyageurJourney.update({
        where: { id: journey.id },
        data: { coverImageUrl: newUrl }
      });
      console.log(`  ✓ ${journey.title}`);
      console.log(`    OLD: ${oldUrl?.substring(0, 80)}...`);
      console.log(`    NEW: ${newUrl.substring(0, 80)}...`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} voyageur journey images`);
}

async function verifyUpdates() {
  console.log("\n=== Verification: Checking for remaining /thumb/ URLs ===\n");

  const tables = [
    { name: "LessonPlan", field: "heroImageUrl" },
    { name: "Location", field: "imageUrl" },
    { name: "Explorer", field: "imageUrl" },
    { name: "VirtualFieldTrip", field: "coverImageUrl" },
    { name: "FieldTripStop", field: "imageUrl" },
    { name: "TimelineEvent", field: "imageUrl" },
    { name: "PrimarySourceDocument", field: "imageUrl" },
    { name: "JourneyNode", field: "imageUrl" },
    { name: "HistoricalEvent", field: "imageUrl" },
    { name: "NotableFigure", field: "imageUrl" },
    { name: "VoyageurJourney", field: "coverImageUrl" }
  ];

  let foundIssues = false;

  for (const table of tables) {
    const count = await prisma.$queryRawUnsafe<Array<{ count: number }>>(
      `SELECT COUNT(*) as count FROM ${table.name} WHERE ${table.field} LIKE '%/thumb/%'`
    );

    const firstResult = count?.[0];
    if (firstResult && firstResult.count > 0) {
      console.log(`  ⚠ ${table.name}: ${firstResult.count} records still have /thumb/ URLs`);
      foundIssues = true;
    } else {
      console.log(`  ✓ ${table.name}: All URLs fixed`);
    }
  }

  if (!foundIssues) {
    console.log("\n✅ All Wikimedia URLs have been successfully updated!");
  } else {
    console.log("\n⚠ Some URLs may need manual review");
  }
}

async function main() {
  console.log("============================================");
  console.log("  Wikimedia URL Fixer                      ");
  console.log("  Converting /thumb/ URLs to Special:FilePath");
  console.log("============================================");

  try {
    await fixLessonPlanImages();
    await fixLocationImages();
    await fixExplorerImages();
    await fixFieldTripCoverImages();
    await fixFieldTripStopImages();
    await fixTimelineEventImages();
    await fixPrimarySourceDocumentImages();
    await fixJourneyNodeImages();
    await fixHistoricalEventImages();
    await fixNotableFigureImages();
    await fixVoyageurJourneyImages();

    await verifyUpdates();

    console.log("\n============================================");
    console.log("  Image URL Fix Complete!                  ");
    console.log("============================================");

  } catch (error) {
    console.error("\n❌ Error fixing image URLs:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
