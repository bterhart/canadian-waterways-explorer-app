/**
 * Database Cleanup Script: Fix Duplicate Explorers and Orphaned Records
 *
 * Issues being fixed:
 * 1. Remove duplicate explorers (keep older entries, delete newer duplicates)
 * 2. Delete orphaned ExplorerWaterway records (pointing to non-existent waterways)
 *
 * Run with: bun run scripts/fix-database-duplicates.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Duplicate explorer mappings: keep -> delete
const duplicateExplorers = [
  {
    name: "David Thompson",
    keep: "cmlhaslpx0006m2zhsckolb5o",
    delete: "cmliyqo0l0006m2qt8plpjhkc",
  },
  {
    name: "Samuel de Champlain",
    keep: "cmlhaslpl0004m2zhpjklxgyn",
    delete: "cmliyqo0d0004m2qtll9eob6r",
  },
  {
    name: "Samuel Hearne",
    keep: "cmlhaslq40007m2zhtmgblh1t",
    delete: "cmliyqo0n0007m2qtceeq96cz",
  },
  {
    name: "Sir John Franklin",
    keep: "cmlhaslq60008m2zhokwxq1v6",
    delete: "cmliyqo0q0008m2qt5ghxirk7",
  },
  {
    name: "Simon Fraser",
    keep: "cmlhaslq90009m2zhn28km7lg",
    delete: "cmliyqo0s0009m2qte37soflb",
  },
];

// Additional orphaned explorer (Alexander Mackenzie duplicate that also needs cleanup)
const orphanedExplorerIds = [
  "cmliyqo0h0005m2qt38pvg360", // Orphaned explorer entry
];

// Orphaned waterway IDs (these don't exist in Waterway table)
const orphanedWaterwayIds = [
  "cmliyqo11000km2qthch4qwur",
  "cmliyqo18000qm2qtcsm8r3er",
  "cmliyqo1w0010m2qti8lbhjfy",
  "cmliyqo13000mm2qth99mkwzp",
  "cmliyqo2i001am2qtfk3cy4d0",
  "cmliyqo1k000wm2qtmx8s4xko",
  "cmliyqo1c000sm2qtn3b2kxey",
  "cmliyqo1h000um2qt3bsc0vuw",
  "cmliyqo280016m2qtq015j1wh",
  "cmliyqo2e0018m2qtafcd89i4",
  "cmliyqo15000om2qt4iu3hxfj",
];

async function main() {
  console.log("=".repeat(60));
  console.log("Database Cleanup Script - Fixing Duplicates and Orphans");
  console.log("=".repeat(60));
  console.log("");

  // Step 1: Show current state
  console.log("STEP 1: Analyzing current database state...\n");

  const initialExplorerCount = await prisma.explorer.count();
  const initialExplorerWaterwayCount = await prisma.explorerWaterway.count();

  console.log(`  Current explorers: ${initialExplorerCount}`);
  console.log(`  Current ExplorerWaterway records: ${initialExplorerWaterwayCount}`);
  console.log("");

  // Step 2: Delete orphaned ExplorerWaterway records (pointing to non-existent waterways)
  console.log("STEP 2: Deleting orphaned ExplorerWaterway records...\n");

  // First, find all orphaned records
  const orphanedRecords = await prisma.$queryRaw<{ id: string; explorerId: string; waterwayId: string }[]>`
    SELECT ew.id, ew.explorerId, ew.waterwayId
    FROM ExplorerWaterway ew
    LEFT JOIN Waterway w ON ew.waterwayId = w.id
    WHERE w.id IS NULL
  `;

  console.log(`  Found ${orphanedRecords.length} orphaned ExplorerWaterway records:`);
  for (const record of orphanedRecords) {
    console.log(`    - ID: ${record.id}, waterwayId: ${record.waterwayId}`);
  }

  if (orphanedRecords.length > 0) {
    // Delete orphaned records
    const orphanedIds = orphanedRecords.map(r => r.id);
    const deleteResult = await prisma.explorerWaterway.deleteMany({
      where: {
        id: { in: orphanedIds }
      }
    });
    console.log(`  Deleted ${deleteResult.count} orphaned ExplorerWaterway records.`);
  }
  console.log("");

  // Step 3: Handle duplicate explorers
  console.log("STEP 3: Processing duplicate explorers...\n");

  for (const dup of duplicateExplorers) {
    console.log(`  Processing: ${dup.name}`);
    console.log(`    Keep ID: ${dup.keep}`);
    console.log(`    Delete ID: ${dup.delete}`);

    // Check if the duplicate explorer exists
    const duplicateExplorer = await prisma.explorer.findUnique({
      where: { id: dup.delete },
      include: { waterways: true }
    });

    if (!duplicateExplorer) {
      console.log(`    -> Duplicate explorer not found (already deleted?). Skipping.`);
      continue;
    }

    // Check if the keeper explorer exists
    const keeperExplorer = await prisma.explorer.findUnique({
      where: { id: dup.keep }
    });

    if (!keeperExplorer) {
      console.log(`    -> Keeper explorer not found! This is unexpected. Skipping.`);
      continue;
    }

    // Get any remaining waterway relationships from the duplicate
    // (most should be orphaned and already deleted, but check anyway)
    const duplicateWaterways = await prisma.explorerWaterway.findMany({
      where: { explorerId: dup.delete }
    });

    console.log(`    Found ${duplicateWaterways.length} waterway relationships on duplicate.`);

    // For each waterway relationship on the duplicate, check if the keeper already has it
    for (const ew of duplicateWaterways) {
      const existingRelation = await prisma.explorerWaterway.findFirst({
        where: {
          explorerId: dup.keep,
          waterwayId: ew.waterwayId
        }
      });

      if (existingRelation) {
        console.log(`      -> Waterway ${ew.waterwayId} already linked to keeper. Will delete duplicate relation.`);
      } else {
        // Transfer the relationship to the keeper
        console.log(`      -> Transferring waterway ${ew.waterwayId} to keeper.`);
        await prisma.explorerWaterway.update({
          where: { id: ew.id },
          data: { explorerId: dup.keep }
        });
      }
    }

    // Delete the duplicate explorer (cascade will handle any remaining relationships)
    await prisma.explorer.delete({
      where: { id: dup.delete }
    });
    console.log(`    -> Deleted duplicate explorer: ${dup.name}`);
    console.log("");
  }

  // Step 4: Clean up any additional orphaned explorer entries
  console.log("STEP 4: Cleaning up additional orphaned explorer entries...\n");

  for (const orphanedId of orphanedExplorerIds) {
    const orphanedExplorer = await prisma.explorer.findUnique({
      where: { id: orphanedId }
    });

    if (orphanedExplorer) {
      console.log(`  Found orphaned explorer: ${orphanedExplorer.name} (ID: ${orphanedId})`);
      await prisma.explorer.delete({ where: { id: orphanedId } });
      console.log(`  -> Deleted orphaned explorer.`);
    } else {
      console.log(`  Orphaned explorer ${orphanedId} not found (already deleted?).`);
    }
  }
  console.log("");

  // Step 5: Final verification
  console.log("STEP 5: Final database verification...\n");

  const finalExplorerCount = await prisma.explorer.count();
  const finalExplorerWaterwayCount = await prisma.explorerWaterway.count();

  // Check for any remaining orphaned ExplorerWaterway records
  const remainingOrphans = await prisma.$queryRaw<{ count: number }[]>`
    SELECT COUNT(*) as count
    FROM ExplorerWaterway ew
    LEFT JOIN Waterway w ON ew.waterwayId = w.id
    WHERE w.id IS NULL
  `;

  // Check for any duplicate explorer names
  const duplicateNames = await prisma.$queryRaw<{ name: string; count: number }[]>`
    SELECT name, COUNT(*) as count
    FROM Explorer
    GROUP BY name
    HAVING COUNT(*) > 1
  `;

  console.log("  Summary:");
  console.log(`    Explorers: ${initialExplorerCount} -> ${finalExplorerCount}`);
  console.log(`    ExplorerWaterway records: ${initialExplorerWaterwayCount} -> ${finalExplorerWaterwayCount}`);
  console.log(`    Remaining orphaned ExplorerWaterway records: ${remainingOrphans[0]?.count ?? 0}`);
  console.log(`    Duplicate explorer names remaining: ${duplicateNames.length}`);

  if (duplicateNames.length > 0) {
    console.log("\n  WARNING: Duplicate explorer names still exist:");
    for (const dup of duplicateNames) {
      console.log(`    - ${dup.name} (${dup.count} entries)`);
    }
  }

  // List all explorers for verification
  console.log("\n  All explorers after cleanup:");
  const allExplorers = await prisma.explorer.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  });
  for (const exp of allExplorers) {
    console.log(`    - ${exp.name} (${exp.id})`);
  }

  console.log("");
  console.log("=".repeat(60));
  console.log("Database cleanup completed successfully!");
  console.log("=".repeat(60));
}

main()
  .catch((error) => {
    console.error("Error during database cleanup:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
