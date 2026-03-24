// Fix 2 genuine 404 URLs for Quebec City in Turso
// Uses API-confirmed Wikimedia URLs — verified to exist via Wikimedia Commons API
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;
if (!tursoUrl) throw new Error("TURSO_DATABASE_URL not set");

const adapter = new PrismaLibSql({ url: tursoUrl, authToken: tursoToken });
const prisma = new PrismaClient({ adapter } as any);

interface GalleryImage { url: string; caption?: string; credit?: string; }

async function main() {
  const loc = await prisma.location.findFirst({
    where: { name: { contains: "Quebec" } },
    select: { id: true, name: true, imageUrl: true, galleryImages: true },
  });

  if (!loc) { console.log("Quebec City not found"); return; }
  console.log("Found:", loc.name, loc.id);

  // Verified via Wikimedia Commons API (imageinfo)
  const NEW_HERO = "https://upload.wikimedia.org/wikipedia/commons/f/f0/Ch%C3%A2teau_Frontenac%2C_Quebec_city%2C_Canada.jpg";
  const NEW_GALLERY_URL = "https://upload.wikimedia.org/wikipedia/commons/1/18/Panorama_of_Quebec_City.jpg";

  const updateData: Record<string, string> = {};
  updateData.imageUrl = NEW_HERO;

  if (loc.galleryImages) {
    try {
      const imgs: GalleryImage[] = JSON.parse(loc.galleryImages);
      const patched = imgs.map(img =>
        img.url.includes("Old_Quebec_City_Chatea")
          ? { ...img, url: NEW_GALLERY_URL, caption: img.caption || "Panorama of Old Quebec City", credit: "Wikimedia Commons" }
          : img
      );
      updateData.galleryImages = JSON.stringify(patched);
    } catch { console.log("Could not parse galleryImages"); }
  }

  await prisma.location.update({ where: { id: loc.id }, data: updateData });
  console.log("Updated Quebec City:");
  console.log("  imageUrl →", NEW_HERO);
  console.log("  gallery 404 → fixed");

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
