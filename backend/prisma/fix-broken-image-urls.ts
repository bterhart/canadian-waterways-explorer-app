/**
 * Script to fix broken image URLs in Deep Dive topics (LessonPlan table)
 *
 * The issue is that some Wikimedia Commons file names are incorrect
 * (files don't exist with those names). This script replaces them with
 * verified working URLs.
 *
 * Run with: bunx tsx prisma/fix-broken-image-urls.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

// Create Prisma adapter with Turso configuration
const adapter = new PrismaLibSQL({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Create Prisma client with Turso adapter
const prisma = new PrismaClient({ adapter });

// Map of broken URLs to their working replacements
// All URLs verified to return HTTP 200
const heroImageUrlFixes: Record<string, string> = {
  // Treaty No. 6 medallion -> Using Numbered Treaties Map SVG
  "https://commons.wikimedia.org/wiki/Special:FilePath/Treaty_No._6_medallion.jpg?width=800":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Numbered-Treaties-Map.svg?width=800",

  // Harold Innis -> Using Harold Innis book cover image (fur trade historiography)
  "https://commons.wikimedia.org/wiki/Special:FilePath/Harold_Innis.jpg?width=800":
    "https://commons.wikimedia.org/wiki/Special:FilePath/The_Fur_Trade_in_Canada,_by_Harold_A._Innis_1930,_edition_1973.jpg?width=800",

  // Also fix the broken Canadian_Fur_Trade.png that was incorrectly used
  "https://commons.wikimedia.org/wiki/Special:FilePath/Canadian_Fur_Trade.png?width=800":
    "https://commons.wikimedia.org/wiki/Special:FilePath/The_Fur_Trade_in_Canada,_by_Harold_A._Innis_1930,_edition_1973.jpg?width=800",

  // HBC Made Beaver Token -> Using HBC Flag SVG
  "https://commons.wikimedia.org/wiki/Special:FilePath/Hudson%27s_Bay_Company_Made_Beaver_Token_1854.png?width=800":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Hudson%27s_Bay_Company_Flag.svg?width=800",

  // Metis buffalo hunt -> Using Kane's buffalo hunt painting
  "https://commons.wikimedia.org/wiki/Special:FilePath/Metis_buffalo_hunt.jpg?width=800":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Kane_Assiniboine_hunting_buffalo.jpg?width=800",

  // Battle of Seven Oaks -> Using correct filename
  "https://commons.wikimedia.org/wiki/Special:FilePath/Battle_of_seven_oaks.jpg?width=800":
    "https://commons.wikimedia.org/wiki/Special:FilePath/The_Battle_of_Seven_Oaks.jpg?width=800",

  // Red River ox cart (upload.wikimedia.org) -> Using Red River cart Pembina Hall image
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Red_River_ox_cart.jpg/1280px-Red_River_ox_cart.jpg":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Red_River_cart_Pembina_Hall.jpg?width=800",

  // Also fix if it was already converted to Special:FilePath but with wrong filename
  "https://commons.wikimedia.org/wiki/Special:FilePath/Red_River_ox_cart.jpg?width=800":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Red_River_cart_Pembina_Hall.jpg?width=800",

  // Fort William Historical Park -> Using correct filename
  "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_William_Historical_Park.jpg?width=800":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Fort_William_Ontario.JPG?width=800",

  // Paul Kane Half-Breeds Running Buffalo -> Using Kane's Assiniboine buffalo hunt
  "https://commons.wikimedia.org/wiki/Special:FilePath/Paul_Kane_-_Half-Breeds_Running_Buffalo.jpg?width=800":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Kane_Assiniboine_hunting_buffalo.jpg?width=800",

  // David Thompson -> Verified working, keep as is
  // "https://commons.wikimedia.org/wiki/Special:FilePath/David_Thompson_(explorer).jpg?width=800"

  // HBC Coat of Arms -> Using HBC Flag
  "https://commons.wikimedia.org/wiki/Special:FilePath/Coat_of_arms_of_the_Hudson%27s_Bay_Company.svg?width=800":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Hudson%27s_Bay_Company_Flag.svg?width=800",

  // The Matthew ship -> Using Bristol MMB The Matthew image
  "https://commons.wikimedia.org/wiki/Special:FilePath/The_Matthew_-_geograph.org.uk_-_277751.jpg?width=800":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Bristol_MMB_69_The_Matthew.jpg?width=800",

  // Also fix if it was already converted with wrong filename
  "https://commons.wikimedia.org/wiki/Special:FilePath/Matthew_of_Bristol.jpg?width=800":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Bristol_MMB_69_The_Matthew.jpg?width=800",

  // Birch bark canoe -> Using verified birchbark canoe image
  "https://commons.wikimedia.org/wiki/Special:FilePath/Birch_bark_canoe_at_Pimisi_Bay_on_the_Ottawa_River.jpg?width=800":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Birchbark_canoe,_Abbe_Museum,_Bar_Harbor,_ME_IMG_2301.JPG?width=800",

  // Frances Anne Hopkins Canoes in Fog (Google Art Project) -> Using correct filename
  "https://commons.wikimedia.org/wiki/Special:FilePath/Frances_Anne_Hopkins_-_Canoes_in_a_Fog%2C_Lake_Superior_-_Google_Art_Project.jpg?width=800":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Canoes_in_a_Fog,_Lake_Superior.jpg?width=800",

  // HBC Point Blanket -> Using HBC Flag as alternative
  "https://commons.wikimedia.org/wiki/Special:FilePath/HBC_point_blanket.jpg?width=800":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Hudson%27s_Bay_Company_Flag.svg?width=800",

  // Frances Anne Hopkins Waterfall painting -> Using correct filename
  "https://commons.wikimedia.org/wiki/Special:FilePath/Frances_Anne_Hopkins_-_Canoe_Manned_by_Voyageurs_Passing_a_Waterfall.jpg?width=800":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Canoe_Manned_by_Voyageurs_Passing_a_Waterfall.jpg?width=800",

  // Canot de maitre -> Using Charles Deas Voyageurs painting
  "https://commons.wikimedia.org/wiki/Special:FilePath/Canot_de_ma%C3%AEtre.png?width=800":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Charles_Deas_-_Voyageurs.jpg?width=800",
};

// Gallery images that need fixing (inside the JSON 'images' field)
const galleryImageUrlFixes: Record<string, string> = {
  // Similar patterns - images inside the JSON array
  "https://commons.wikimedia.org/wiki/Special:FilePath/Frances_Anne_Hopkins_-_Canoes_in_a_Fog%2C_Lake_Superior_-_Google_Art_Project.jpg?width=800":
    "https://commons.wikimedia.org/wiki/Special:FilePath/Canoes_in_a_Fog,_Lake_Superior.jpg?width=800",
};

async function fixHeroImageUrls() {
  console.log("\n=== Fixing LessonPlan heroImageUrl ===\n");

  const lessonPlans = await prisma.lessonPlan.findMany({
    where: {
      heroImageUrl: { not: null },
    },
    select: { id: true, title: true, heroImageUrl: true },
  });

  console.log(`Found ${lessonPlans.length} lesson plans with hero images`);

  let updated = 0;
  for (const plan of lessonPlans) {
    const oldUrl = plan.heroImageUrl;
    if (!oldUrl) continue;

    const newUrl = heroImageUrlFixes[oldUrl];
    if (newUrl && newUrl !== oldUrl) {
      await prisma.lessonPlan.update({
        where: { id: plan.id },
        data: { heroImageUrl: newUrl },
      });
      console.log(`  Fixed: ${plan.title}`);
      console.log(`    OLD: ${oldUrl}`);
      console.log(`    NEW: ${newUrl}`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} hero images`);
  return updated;
}

async function fixGalleryImages() {
  console.log("\n=== Fixing LessonPlan gallery images (JSON field) ===\n");

  const lessonPlans = await prisma.lessonPlan.findMany({
    where: {
      images: { not: null },
    },
    select: { id: true, title: true, images: true },
  });

  console.log(`Found ${lessonPlans.length} lesson plans with gallery images`);

  let updated = 0;
  for (const plan of lessonPlans) {
    if (!plan.images) continue;

    let imagesJson: Array<{ url: string; caption?: string; credit?: string }>;
    try {
      imagesJson = JSON.parse(plan.images);
    } catch {
      console.log(`  Warning: Could not parse images JSON for ${plan.title}`);
      continue;
    }

    let changed = false;
    for (const img of imagesJson) {
      // Check heroImageUrlFixes first (more comprehensive)
      const heroFix = heroImageUrlFixes[img.url];
      if (heroFix) {
        const oldUrl = img.url;
        img.url = heroFix;
        console.log(`  Fixed gallery image in: ${plan.title}`);
        console.log(`    OLD: ${oldUrl}`);
        console.log(`    NEW: ${img.url}`);
        changed = true;
      }
      // Then check galleryImageUrlFixes
      else {
        const galleryFix = galleryImageUrlFixes[img.url];
        if (galleryFix) {
          const oldUrl = img.url;
          img.url = galleryFix;
          console.log(`  Fixed gallery image in: ${plan.title}`);
          console.log(`    OLD: ${oldUrl}`);
          console.log(`    NEW: ${img.url}`);
          changed = true;
        }
      }
    }

    if (changed) {
      await prisma.lessonPlan.update({
        where: { id: plan.id },
        data: { images: JSON.stringify(imagesJson) },
      });
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} lesson plans with gallery image fixes`);
  return updated;
}

async function verifyUrls() {
  console.log("\n=== Verifying Fixed URLs ===\n");

  const lessonPlans = await prisma.lessonPlan.findMany({
    where: {
      heroImageUrl: { not: null },
    },
    select: { id: true, title: true, heroImageUrl: true, images: true },
  });

  console.log(`Checking ${lessonPlans.length} lesson plans...`);

  // Show sample of hero images
  console.log("\nSample Hero Images:");
  for (const plan of lessonPlans.slice(0, 5)) {
    const heroUrl = plan.heroImageUrl ?? "";
    console.log(`  - ${plan.title}: ${heroUrl.substring(0, 80)}...`);
  }
}

async function main() {
  console.log("============================================");
  console.log("  Fixing Broken Deep Dive Image URLs       ");
  console.log("============================================");

  try {
    const heroUpdates = await fixHeroImageUrls();
    const galleryUpdates = await fixGalleryImages();
    await verifyUrls();

    console.log("\n============================================");
    console.log(`  Total hero images fixed: ${heroUpdates}`);
    console.log(`  Total gallery fixes: ${galleryUpdates}`);
    console.log("============================================");

  } catch (error) {
    console.error("\nError fixing image URLs:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
