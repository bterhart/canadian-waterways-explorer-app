import { prisma } from "../src/prisma";

const fixes: Record<string, string> = {
  "Bas-de-la-Rivière (Fort Alexander)": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Red_River_Valley.jpg/1280px-Red_River_Valley.jpg",
  "Batoche": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Fort_Battleford_NHS.jpg/1280px-Fort_Battleford_NHS.jpg",
  "Bligh Island (Nootka Sound)": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Vancouver_Island_coast.jpg/1280px-Vancouver_Island_coast.jpg",
  "Friendly Cove Landing (Cook's Landing)": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Vancouver_Island_coast.jpg/1280px-Vancouver_Island_coast.jpg",
};

async function main() {
  for (const [name, url] of Object.entries(fixes)) {
    const loc = await prisma.location.findFirst({ where: { name } });
    if (loc) {
      await prisma.location.update({ where: { id: loc.id }, data: { imageUrl: url } });
      console.log(`✓ Fixed 404: ${name}`);
    } else {
      console.log(`  Not found: ${name}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
