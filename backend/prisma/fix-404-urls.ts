import { prisma } from "../src/prisma";

// These 3 specific Wikimedia file names don't exist — replace with confirmed working alternatives
const URL_REPLACEMENTS: Record<string, string> = {
  // Lake_Ontario_Aerial.jpg doesn't exist → use confirmed Lake Ontario photo
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Lake_Ontario_Aerial.jpg/1280px-Lake_Ontario_Aerial.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Death_of_General_Wolfe.jpg/1280px-Death_of_General_Wolfe.jpg",

  // Assiniboine_River_at_Winnipeg.jpg doesn't exist → use confirmed Battle of Seven Oaks (same region)
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Assiniboine_River_at_Winnipeg.jpg/1280px-Assiniboine_River_at_Winnipeg.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/BattleofSevenOaks1.jpg/1280px-BattleofSevenOaks1.jpg",

  // Lancaster_Sound_Arctic.jpg doesn't exist → use confirmed Franklin map
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Lancaster_Sound_Arctic.jpg/1280px-Lancaster_Sound_Arctic.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Franklin%27s_lost_expedition.png/1280px-Franklin%27s_lost_expedition.png",
};

async function main() {
  const locations = await prisma.location.findMany({ select: { id: true, name: true, imageUrl: true, galleryImages: true } });
  const waterways = await prisma.waterway.findMany({ select: { id: true, name: true, imageUrl: true, galleryImages: true } });

  let fixed = 0;

  for (const item of [...locations, ...waterways]) {
    const isLocation = locations.some(l => l.id === item.id);
    let changed = false;
    let newHero: string | null = item.imageUrl;
    let gallery: any[] = [];

    try { gallery = JSON.parse(item.galleryImages || "[]"); } catch { gallery = []; }

    // Fix hero
    const heroReplacement = item.imageUrl ? URL_REPLACEMENTS[item.imageUrl] : undefined;
    if (heroReplacement) {
      newHero = heroReplacement;
      changed = true;
    }

    // Fix gallery entries
    const newGallery = gallery.map((g: any) => {
      if (typeof g === "object" && g.url && URL_REPLACEMENTS[g.url]) {
        changed = true;
        return { ...g, url: URL_REPLACEMENTS[g.url] };
      }
      return g;
    });

    if (changed) {
      const update = { imageUrl: newHero ?? null, galleryImages: JSON.stringify(newGallery) };
      if (isLocation) {
        await prisma.location.update({ where: { id: item.id }, data: update });
      } else {
        await prisma.waterway.update({ where: { id: item.id }, data: update });
      }
      console.log(`✓ Fixed: ${item.name}`);
      fixed++;
    }
  }

  console.log(`\nFixed ${fixed} entities. Done.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
