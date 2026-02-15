import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Hero images for all lesson plans - all from Wikimedia Commons public domain
const lessonPlanImages: Record<string, string> = {
  // Already populated by individual scripts
  "The Red River Cart": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Red_River_ox_cart.jpg/1280px-Red_River_ox_cart.jpg",
  "The Voyageur Life": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Frances_Anne_Hopkins_-_Canoes_in_a_Fog%2C_Lake_Superior_-_Google_Art_Project.jpg/1280px-Frances_Anne_Hopkins_-_Canoes_in_a_Fog%2C_Lake_Superior_-_Google_Art_Project.jpg",
  "Mapping Canada: The Work of David Thompson": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/David_Thompson_%28explorer%29.jpg/800px-David_Thompson_%28explorer%29.jpg",
  "Louis Riel and the Metis Nation": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Louis_Riel.jpg/800px-Louis_Riel.jpg",
  "Women of the Fur Trade": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Frances_Anne_Hopkins_-_Voyageurs_at_Dawn.jpg/1280px-Frances_Anne_Hopkins_-_Voyageurs_at_Dawn.jpg",

  // New images for remaining lesson plans
  "Meet the Voyageurs": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Frances_Anne_Hopkins_-_Voyageurs_at_Dawn%2C_1871.jpg/1280px-Frances_Anne_Hopkins_-_Voyageurs_at_Dawn%2C_1871.jpg",
  "Animals of the Fur Trade": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/American_Beaver.jpg/1280px-American_Beaver.jpg",
  "Following the Rivers": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Saskatchewan_River.jpg/1280px-Saskatchewan_River.jpg",
  "First Nations Canoe Builders": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Ojibwe_birchbark_canoe.jpg/1280px-Ojibwe_birchbark_canoe.jpg",
  "A Day at the Trading Post": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Old_Fort_William_-_panoramio.jpg/1280px-Old_Fort_William_-_panoramio.jpg",
  "Explorers and Their Ships": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/HMS_Discovery_Vancouver.jpg/1280px-HMS_Discovery_Vancouver.jpg",
  "The Hudson's Bay Company": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/York_Factory.jpg/1280px-York_Factory.jpg",
  "David Thompson: Master Mapmaker": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/David_Thompson_map.jpg/1280px-David_Thompson_map.jpg",
  "The Pemmican Trail": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Making_Pemmican.jpg/800px-Making_Pemmican.jpg",
  "Forts of the Fur Trade": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Prince_of_Wales_Fort%2C_Manitoba%2C_Canada.jpg/1280px-Prince_of_Wales_Fort%2C_Manitoba%2C_Canada.jpg",
  "The Great Rivalry: HBC vs NWC": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Lower_Fort_Garry_-_Big_House.jpg/1280px-Lower_Fort_Garry_-_Big_House.jpg",
  "Indigenous Perspectives on European Contact": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/First_Nations_gathering.jpg/1280px-First_Nations_gathering.jpg",
  "The Northwest Passage: Dreams and Disasters": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Arctic_expedition_ship.jpg/1280px-Arctic_expedition_ship.jpg",
  "Country Marriages and Metis Identity": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Metis_women_scraping_a_buffalo_hide.jpg/1280px-Metis_women_scraping_a_buffalo_hide.jpg",
  "The Economics of Empire: Mercantilism and the Fur Trade": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Trading_goods_fur_trade.jpg/1280px-Trading_goods_fur_trade.jpg",
  "Historiography of the Fur Trade": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Grand_Portage.jpg/1280px-Grand_Portage.jpg",
  "Indigenous Sovereignty and Treaty Rights": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Treaty_signing_Canada.jpg/1280px-Treaty_signing_Canada.jpg",
  "Environmental Impact of the Fur Trade": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Canadian_wilderness.jpg/1280px-Canadian_wilderness.jpg",
  "The Fall of New France: 1760": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Tadoussac_Quebec.jpg/1280px-Tadoussac_Quebec.jpg",
  "Voyageur Routes of Canada": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Grand_Portage_National_Monument.jpg/1280px-Grand_Portage_National_Monument.jpg",
  "The Hudson's Bay Company: From Fur Trade to Modern Retail": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Lower_Fort_Garry_stone_walls.jpg/1280px-Lower_Fort_Garry_stone_walls.jpg",
};

async function main() {
  console.log("Adding hero images to all lesson plans...\n");

  let updatedCount = 0;
  let skippedCount = 0;
  let alreadyHasImageCount = 0;

  for (const [title, heroImageUrl] of Object.entries(lessonPlanImages)) {
    try {
      const lessonPlan = await prisma.lessonPlan.findFirst({
        where: { title }
      });

      if (!lessonPlan) {
        console.log(`⚠ Lesson plan not found: ${title}`);
        skippedCount++;
        continue;
      }

      if (lessonPlan.heroImageUrl) {
        console.log(`- Already has image: ${title}`);
        alreadyHasImageCount++;
        // Update anyway in case we have a better image
      }

      await prisma.lessonPlan.update({
        where: { id: lessonPlan.id },
        data: { heroImageUrl }
      });

      console.log(`✓ Updated: ${title}`);
      updatedCount++;
    } catch (error) {
      console.error(`✗ Error updating ${title}:`, error);
      skippedCount++;
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Successfully updated: ${updatedCount} lesson plans`);
  console.log(`Already had images: ${alreadyHasImageCount} lesson plans`);
  console.log(`Skipped/Errors: ${skippedCount} lesson plans`);

  // Check if any lesson plans still have NULL hero images
  const nullCount = await prisma.lessonPlan.count({
    where: { heroImageUrl: null }
  });

  const totalCount = await prisma.lessonPlan.count();

  console.log(`\n=== VERIFICATION ===`);
  if (nullCount === 0) {
    console.log(`✓ Success: All ${totalCount} lesson plans now have hero images!`);
  } else {
    console.log(`⚠ Warning: ${nullCount} lesson plans still have NULL hero images`);
    const nullPlans = await prisma.lessonPlan.findMany({
      where: { heroImageUrl: null },
      select: { title: true }
    });
    nullPlans.forEach(plan => console.log(`  - ${plan.title}`));
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
