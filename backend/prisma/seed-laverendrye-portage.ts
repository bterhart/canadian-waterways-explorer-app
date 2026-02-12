/**
 * Seed file for La Verendrye Family and Great Dog Portage
 *
 * This file adds:
 * - Great Dog Portage (Height of Land Portage) location
 * - Jacques de Noyon explorer (first European over the Great Dog Portage)
 * - Missing La Verendrye sons (Jean-Baptiste, Pierre fils, Francois)
 * - Kaministiquia River waterway
 * - ExplorerWaterway connections linking explorers to the route
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ==================== KAMINISTIQUIA RIVER DATA ====================

const kaministiquiaRiver = {
  name: "Kaministiquia River",
  indigenousName: "Kaministikwia",
  indigenousLanguage: "Ojibwe",
  description: `The Kaministiquia River flows into Lake Superior at Thunder Bay (formerly Fort William). It was the main route used by the North West Company to access the interior, replacing the older Grand Portage route after the US border was established in 1803. The river's name comes from Ojibwe, meaning "river with many islands" or "river with short bends."

Along with the Great Dog Portage, it provided access to the chain of lakes and rivers leading to Lake Winnipeg and beyond. The route was first used by European Jacques de Noyon in 1688, predating La Verendrye's more famous expeditions by over 40 years.

The river was crucial to the fur trade, serving as the gateway from Lake Superior to the western interior. Fort William, established at the river's mouth, became the grand summer rendezvous point for the North West Company, where Montreal canoes met the smaller north canoes bringing furs from the interior.`,
  latitude: 48.38,
  longitude: -89.25,
  regionName: "Ontario",
  historicalSignificance: `The Kaministiquia River route was one of the most important trade routes in the history of the Canadian fur trade. First traversed by European Jacques de Noyon in 1688, it became the preferred route for the North West Company after 1803 when the Grand Portage route fell on the American side of the border.

Fort William at the river's mouth was the grand depot where thousands of voyageurs gathered each summer to exchange furs from the interior for trade goods from Montreal. The route required several challenging portages, including the infamous Great Dog Portage (Height of Land), before reaching the chain of waterways leading to Lake Winnipeg and the western interior.

The river gave its name to Kam House, one of the original North West Company posts, and the entire Kaministiquia route became legendary in voyageur lore.`,
  boundaryCoordinates: JSON.stringify([
    [48.38, -89.25],
    [48.45, -89.35],
    [48.55, -89.50],
    [48.65, -89.65],
    [48.75, -89.85],
  ]),
};

// ==================== GREAT DOG PORTAGE LOCATION ====================

const greatDogPortage = {
  name: "Great Dog Portage",
  indigenousName: "Animikie-wiikwedong", // Ojibwe: "at the Thunder Bay" - approximate traditional name for the area
  indigenousLanguage: "Ojibwe",
  description: `The Great Dog Portage, also known as the Height of Land Portage, was the most challenging portage on the route between Fort William and the western interior. Located between the Kaministiquia River and Dog River, it had the steepest gradient of any portage between Lake Superior and Cumberland House.

This portage marked the continental divide - the height of land separating waters flowing to Lake Superior from those flowing to Hudson Bay. First crossed by European Jacques de Noyon in 1688, it became a crucial link in the fur trade route after La Verendrye established the western posts in 1731.

Voyageurs dreaded this portage for its steep, rocky terrain. The portage was about 3.5 miles (5.6 km) long with a rise of about 500 feet (150 m). Voyageurs often made multiple trips to carry all their goods, each man carrying two 90-pound "pieces" at a time.

The name "Dog" may come from the Ojibwe practice of using dog sleds in winter, from the shape of nearby Dog Lake, or from the howling sounds of wind through the rocky terrain. For the voyageurs, crossing this portage was a rite of passage - those who had crossed it were considered true "hommes du nord" (men of the north).`,
  latitude: 48.75,
  longitude: -89.85,
  locationType: "Portage",
  yearEstablished: 1688,
  historicalNotes: `First European crossing by Jacques de Noyon in 1688, making it one of the earliest European passages into the western interior from Lake Superior. The portage was about 3.5 miles (5.6 km) long with a rise of about 500 feet (150 m), making it the steepest and most demanding portage on the entire route from Fort William to the western posts.

La Verendrye and his party used this portage extensively starting in 1731 when establishing the chain of posts extending to Lake Winnipeg and beyond. The North West Company later improved the trail somewhat, but it remained a grueling challenge.

At the height of the fur trade, hundreds of canoes passed over this portage each summer. Young voyageurs making their first crossing were subjected to a mock baptism ceremony, being splashed with water and swearing never to let another novice pass without similar treatment.

The portage site is now part of the historic Kaministiquia route heritage area, though the wilderness has largely reclaimed the old trail.`,
};

// ==================== JACQUES DE NOYON EXPLORER ====================

const jacquesDeNoyon = {
  name: "Jacques de Noyon",
  birthYear: 1668,
  deathYear: 1745,
  nationality: "French Canadian",
  biography: `Jacques de Noyon was a French Canadian coureur des bois who became the first European to travel beyond Lake Superior into the western interior. In 1688, at approximately 20 years of age, he crossed the Great Dog Portage and reached Rainy Lake, opening the route that La Verendrye would later make famous.

De Noyon spent a winter with the Assiniboine people and learned of lands and waters to the west, including reports of a great western sea. His journey predated La Verendrye's expeditions by over 40 years, yet he remains largely forgotten compared to later explorers who followed his path.

Little is known about de Noyon's early life, but he was likely born in Quebec around 1668 to a family of modest means. Like many young French Canadians of his era, he was drawn to the freedom and opportunity of the pays d'en haut (upper country) rather than the restrictions of the settled St. Lawrence valley.

De Noyon's 1688 expedition was remarkable for its audacity. Traveling with a small party of Indigenous guides, he crossed the height of land at the Great Dog Portage, descended the rivers leading west, and reached Rainy Lake - territory completely unknown to Europeans. He wintered with the Assiniboine, learning their language and gathering information about the lands beyond.

He later served as an interpreter and guide for other expeditions, using his knowledge of Indigenous languages and western geography. His firsthand accounts of the western interior were crucial to planning future French ventures into the region, though official expeditions would not follow his path for decades.

De Noyon lived to approximately 77 years of age, spending his later years in the St. Lawrence valley. His pioneering journey was largely overshadowed by La Verendrye's more extensive and better-documented expeditions, but de Noyon deserves recognition as the true pathfinder of the route to the western interior.`,
  notableAchievements: `First European to cross the Great Dog Portage (1688). First European to reach Rainy Lake. Opened the route to the western interior 43 years before La Verendrye. Spent winter with Assiniboine people, learning of western lands. Served as interpreter and guide for later expeditions. His geographic knowledge informed French planning for western expansion.`,
};

// ==================== LA VERENDRYE SONS ====================

const laVerendryeSons = [
  {
    name: "Jean-Baptiste Gaultier de La Verendrye",
    birthYear: 1713,
    deathYear: 1736,
    nationality: "French Canadian",
    biography: `Jean-Baptiste Gaultier de La Verendrye was the eldest son of the famous explorer Pierre Gaultier de Varennes, sieur de La Verendrye. Born in 1713 in the small village of Three Rivers (Trois-Rivieres), Quebec, he grew up hearing tales of the western wilderness and was determined to follow his father's footsteps into the interior.

Jean-Baptiste accompanied his father on the initial expeditions westward beginning in 1731. He proved himself a capable leader and was entrusted with commanding parties exploring new territory. In 1734, he led an expedition that reached Lake Winnipeg, extending French knowledge of the western waterways.

His promising career was cut tragically short on June 6, 1736, when he and a party of 20 others - including Father Jean-Pierre Aulneau, a Jesuit missionary, and 19 voyageurs - were massacred on an island in Lake of the Woods by a Sioux war party. The party had been traveling to Michilimackinac to obtain supplies for the western posts.

The massacre devastated his father, who never fully recovered from the loss. Jean-Baptiste was only 23 years old when he died. The island where the massacre occurred became known as Massacre Island and was later named Massacre Island in memory of the tragedy.

The exact circumstances of the attack remain unclear, but it appears the Sioux party attacked without warning, possibly in retaliation for the La Verendrye family's alliance with the Cree and Assiniboine nations, traditional enemies of the Sioux. All 21 members of the party were killed, their bodies found beheaded and mutilated.`,
    notableAchievements: `Eldest son of La Verendrye. Led expedition to Lake Winnipeg (1734). Participated in establishing western posts including Fort St. Charles and Fort Maurepas. Massacred with 20 others at Lake of the Woods (1736). His death profoundly affected his father and French western exploration.`,
  },
  {
    name: "Pierre Gaultier de La Verendrye (fils)",
    birthYear: 1714,
    deathYear: 1755,
    nationality: "French Canadian",
    biography: `Pierre Gaultier de La Verendrye (fils), meaning "the son," was the second son of the famous explorer. To distinguish him from his father, he is often referred to as Pierre fils or Pierre Jr. Born in 1714 in Quebec, he followed his father and brothers into the western fur trade and exploration.

Pierre fils accompanied his father and brothers on western expeditions starting in 1731. He was involved in establishing and maintaining the network of posts that extended French influence from Lake Superior to the Saskatchewan River. He helped build and garrison Fort St. Charles, Fort Maurepas, Fort Rouge (at the site of present-day Winnipeg), and Fort La Reine.

After the tragic death of his eldest brother Jean-Baptiste in 1736, Pierre fils took on greater responsibilities in the family's exploration enterprise. He worked closely with his younger brother Louis-Joseph (the Chevalier) and his brother Francois on various expeditions.

Following his father's death in 1749, Pierre fils continued to be involved in the western trade, though French support for western exploration waned in the years leading up to the Seven Years' War. He died in 1755, before the war's conclusion would end French claims to the western interior.

While not as famous as his brother the Chevalier, Pierre fils was essential to the success of the La Verendrye enterprise, providing steady leadership and management of the western posts during difficult years.`,
    notableAchievements: `Second son of La Verendrye. Helped establish Fort Maurepas, Fort Rouge, and other western posts. Continued family's western enterprise after father's death. Managed logistics of western fur trade operations. Participated in expeditions throughout the Lake Winnipeg region.`,
  },
  {
    name: "Francois Gaultier de La Verendrye",
    birthYear: 1715,
    deathYear: 1794,
    nationality: "French Canadian",
    biography: `Francois Gaultier de La Verendrye was the third son of the famous explorer Pierre Gaultier de Varennes, sieur de La Verendrye. Born in 1715, he became one of the La Verendrye brothers who pushed French exploration to its westernmost limits.

Francois is best known for accompanying his brother Louis-Joseph (the Chevalier) on the famous 1742-1743 expedition that reached mountains in the western interior - likely the Black Hills of South Dakota, though some historians argue they may have seen the Big Horn Mountains or even the Rocky Mountains. This expedition represented the farthest west that French explorers would reach in the interior.

On New Year's Day 1743, Francois was one of the brothers who buried a lead plate at the site of present-day Fort Pierre, South Dakota, claiming the territory for France. This plate was discovered in 1913 by a schoolgirl named Hattie May Foster, providing dramatic confirmation of the La Verendrye expedition's western reach.

After his father's death in 1749 and the decline of the French western enterprise, Francois adapted to changing circumstances. Unlike his brothers who died relatively young, Francois lived until 1794, surviving the fall of New France, the American Revolution, and seeing the early days of the new United States and British North America.

His longevity made him a living link to the heroic era of French western exploration. Though little is recorded of his later years, Francois Gaultier de La Verendrye lived to be approximately 79 years old, the longest-lived of all the La Verendrye sons.`,
    notableAchievements: `Third son of La Verendrye. Accompanied Louis-Joseph (the Chevalier) on the 1742-43 expedition to the western mountains. One of the brothers who buried the lead plate found in 1913. Reached farthest west of any French explorer in the interior. Longest-lived of the La Verendrye sons (died 1794 at approximately age 79).`,
  },
];

// ==================== EXPLORER-WATERWAY CONNECTIONS ====================

interface ExplorerWaterwayConnection {
  explorerName: string;
  waterwayName: string;
  yearExplored: number | null;
  expeditionNotes: string;
}

const explorerWaterwayConnections: ExplorerWaterwayConnection[] = [
  {
    explorerName: "Jacques de Noyon",
    waterwayName: "Kaministiquia River",
    yearExplored: 1688,
    expeditionNotes:
      "First European to traverse the Kaministiquia River route to the western interior. Crossed the Great Dog Portage and continued to Rainy Lake.",
  },
  {
    explorerName: "Pierre Gaultier de Varennes, Sieur de La Vérendrye",
    waterwayName: "Kaministiquia River",
    yearExplored: 1731,
    expeditionNotes:
      "Used the Kaministiquia route extensively starting in 1731 when establishing the chain of western posts. The route became the main corridor for French expansion to the interior.",
  },
  {
    explorerName: "Jean-Baptiste Gaultier de La Verendrye",
    waterwayName: "Kaministiquia River",
    yearExplored: 1731,
    expeditionNotes:
      "Accompanied his father on expeditions via the Kaministiquia route. Helped establish and supply the western posts until his death in 1736.",
  },
  {
    explorerName: "Pierre Gaultier de La Verendrye (fils)",
    waterwayName: "Kaministiquia River",
    yearExplored: 1731,
    expeditionNotes:
      "Traveled the Kaministiquia route multiple times as part of the family's western enterprise, helping supply and maintain the chain of posts.",
  },
  {
    explorerName: "Francois Gaultier de La Verendrye",
    waterwayName: "Kaministiquia River",
    yearExplored: 1731,
    expeditionNotes:
      "Used the Kaministiquia route for western expeditions, including the 1742-43 journey that reached the western mountains.",
  },
  {
    explorerName: "Louis-Joseph Gaultier de La Vérendrye",
    waterwayName: "Kaministiquia River",
    yearExplored: 1735,
    expeditionNotes:
      "The Chevalier traveled this route on his way to lead western expeditions, including the famous 1742-43 expedition to the mountains.",
  },
];

// ==================== MAIN SEED FUNCTION ====================

async function seedLaVerendryePortage(): Promise<void> {
  console.log("Starting seed for La Verendrye family and Great Dog Portage...\n");

  try {
    // Get or create River type
    let riverType = await prisma.waterwayType.findUnique({
      where: { name: "River" },
    });

    if (!riverType) {
      console.log("Creating River waterway type...");
      riverType = await prisma.waterwayType.create({
        data: { name: "River" },
      });
    }

    // ==================== SEED KAMINISTIQUIA RIVER ====================
    console.log("\n=== Seeding Kaministiquia River ===");

    let kaministiquiaWaterway = await prisma.waterway.findFirst({
      where: { name: kaministiquiaRiver.name },
    });

    if (kaministiquiaWaterway) {
      console.log(`  Updating: ${kaministiquiaRiver.name}`);
      kaministiquiaWaterway = await prisma.waterway.update({
        where: { id: kaministiquiaWaterway.id },
        data: {
          ...kaministiquiaRiver,
          typeId: riverType.id,
        },
      });
    } else {
      console.log(`  Creating: ${kaministiquiaRiver.name}`);
      kaministiquiaWaterway = await prisma.waterway.create({
        data: {
          ...kaministiquiaRiver,
          typeId: riverType.id,
        },
      });
    }
    console.log("Kaministiquia River seeded successfully.");

    // ==================== SEED GREAT DOG PORTAGE ====================
    console.log("\n=== Seeding Great Dog Portage ===");

    const existingPortage = await prisma.location.findFirst({
      where: { name: greatDogPortage.name },
    });

    if (existingPortage) {
      console.log(`  Updating: ${greatDogPortage.name}`);
      await prisma.location.update({
        where: { id: existingPortage.id },
        data: {
          ...greatDogPortage,
          waterwayId: kaministiquiaWaterway.id,
        },
      });
    } else {
      console.log(`  Creating: ${greatDogPortage.name}`);
      await prisma.location.create({
        data: {
          ...greatDogPortage,
          waterwayId: kaministiquiaWaterway.id,
        },
      });
    }
    console.log("Great Dog Portage seeded successfully.");

    // ==================== SEED JACQUES DE NOYON ====================
    console.log("\n=== Seeding Jacques de Noyon ===");

    const existingNoyon = await prisma.explorer.findFirst({
      where: { name: jacquesDeNoyon.name },
    });

    if (existingNoyon) {
      console.log(`  Updating: ${jacquesDeNoyon.name}`);
      await prisma.explorer.update({
        where: { id: existingNoyon.id },
        data: jacquesDeNoyon,
      });
    } else {
      console.log(`  Creating: ${jacquesDeNoyon.name}`);
      await prisma.explorer.create({
        data: jacquesDeNoyon,
      });
    }
    console.log("Jacques de Noyon seeded successfully.");

    // ==================== SEED LA VERENDRYE SONS ====================
    console.log("\n=== Seeding La Verendrye Sons ===");

    for (const son of laVerendryeSons) {
      const existing = await prisma.explorer.findFirst({
        where: { name: son.name },
      });

      if (existing) {
        console.log(`  Updating: ${son.name}`);
        await prisma.explorer.update({
          where: { id: existing.id },
          data: son,
        });
      } else {
        console.log(`  Creating: ${son.name}`);
        await prisma.explorer.create({
          data: son,
        });
      }
    }
    console.log(`Seeded ${laVerendryeSons.length} La Verendrye sons.`);

    // ==================== SEED EXPLORER-WATERWAY CONNECTIONS ====================
    console.log("\n=== Creating Explorer-Waterway Connections ===");

    for (const connection of explorerWaterwayConnections) {
      // Find the explorer
      const explorer = await prisma.explorer.findFirst({
        where: { name: connection.explorerName },
      });

      if (!explorer) {
        console.log(`  Skipping connection: Explorer "${connection.explorerName}" not found`);
        continue;
      }

      // Find the waterway
      const waterway = await prisma.waterway.findFirst({
        where: { name: connection.waterwayName },
      });

      if (!waterway) {
        console.log(`  Skipping connection: Waterway "${connection.waterwayName}" not found`);
        continue;
      }

      // Check if connection exists
      const existingConnection = await prisma.explorerWaterway.findUnique({
        where: {
          explorerId_waterwayId: {
            explorerId: explorer.id,
            waterwayId: waterway.id,
          },
        },
      });

      if (existingConnection) {
        console.log(`  Updating connection: ${connection.explorerName} <-> ${connection.waterwayName}`);
        await prisma.explorerWaterway.update({
          where: { id: existingConnection.id },
          data: {
            yearExplored: connection.yearExplored,
            expeditionNotes: connection.expeditionNotes,
          },
        });
      } else {
        console.log(`  Creating connection: ${connection.explorerName} <-> ${connection.waterwayName}`);
        await prisma.explorerWaterway.create({
          data: {
            explorerId: explorer.id,
            waterwayId: waterway.id,
            yearExplored: connection.yearExplored,
            expeditionNotes: connection.expeditionNotes,
          },
        });
      }
    }
    console.log("Explorer-Waterway connections created.");

    // ==================== ADD TIMELINE EVENT FOR MASSACRE ====================
    console.log("\n=== Adding Timeline Event for Lake of Woods Massacre ===");

    const massacreEvent = {
      title: "Lake of the Woods Massacre",
      description:
        "Jean-Baptiste de La Verendrye, Father Aulneau, and 19 voyageurs are massacred by Sioux warriors on an island in Lake of the Woods while traveling to Michilimackinac for supplies. This tragedy devastates the elder La Verendrye and sets back French western exploration.",
      year: 1736,
      month: 6,
      day: 6,
      isApproximate: false,
      theme: "exploration",
      importance: "major",
    };

    const existingEvent = await prisma.timelineEvent.findFirst({
      where: {
        title: massacreEvent.title,
        year: massacreEvent.year,
      },
    });

    if (existingEvent) {
      console.log(`  Updating: ${massacreEvent.title}`);
      await prisma.timelineEvent.update({
        where: { id: existingEvent.id },
        data: massacreEvent,
      });
    } else {
      console.log(`  Creating: ${massacreEvent.title}`);
      await prisma.timelineEvent.create({
        data: massacreEvent,
      });
    }

    // Add Jacques de Noyon's crossing as timeline event
    const noyonEvent = {
      title: "Jacques de Noyon Reaches Rainy Lake",
      description:
        "French Canadian coureur des bois Jacques de Noyon becomes the first European to cross the Great Dog Portage and reach Rainy Lake. He spends the winter with the Assiniboine people, opening the route that La Verendrye will make famous 43 years later.",
      year: 1688,
      isApproximate: true,
      theme: "exploration",
      importance: "major",
    };

    const existingNoyonEvent = await prisma.timelineEvent.findFirst({
      where: {
        title: noyonEvent.title,
        year: noyonEvent.year,
      },
    });

    if (existingNoyonEvent) {
      console.log(`  Updating: ${noyonEvent.title}`);
      await prisma.timelineEvent.update({
        where: { id: existingNoyonEvent.id },
        data: noyonEvent,
      });
    } else {
      console.log(`  Creating: ${noyonEvent.title}`);
      await prisma.timelineEvent.create({
        data: noyonEvent,
      });
    }

    // ==================== SUMMARY ====================
    console.log("\n=== Seed Complete ===");

    const explorerCount = await prisma.explorer.count();
    const waterwayCount = await prisma.waterway.count();
    const locationCount = await prisma.location.count();
    const connectionCount = await prisma.explorerWaterway.count();

    console.log(`
Summary:
- Total explorers: ${explorerCount}
- Total waterways: ${waterwayCount}
- Total locations: ${locationCount}
- Total explorer-waterway connections: ${connectionCount}

Added/Updated:
- Kaministiquia River waterway
- Great Dog Portage location
- Jacques de Noyon explorer
- Jean-Baptiste Gaultier de La Verendrye (eldest son, massacred 1736)
- Pierre Gaultier de La Verendrye (fils) (second son)
- Francois Gaultier de La Verendrye (third son, buried lead plate 1743)
- Explorer-waterway connections linking explorers to Kaministiquia River
- Timeline events for Jacques de Noyon's crossing (1688) and the Lake of Woods Massacre (1736)
`);
  } catch (error) {
    console.error("Error during seed:", error);
    throw error;
  }
}

// Run seed
seedLaVerendryePortage()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
