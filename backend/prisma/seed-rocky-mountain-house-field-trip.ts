/**
 * Seed file for Rocky Mountain House Virtual Field Trip
 *
 * Rocky Mountain House was established in 1799 by the North West Company on the
 * North Saskatchewan River, near the Rocky Mountains. The HBC built a competing
 * post nearby. David Thompson used it as a base for his explorations across the
 * Rockies. It was a key location for trade with the Blackfoot Confederacy
 * (Siksika, Kainai, Piikani) and the gateway to crossing the Rocky Mountains.
 *
 * All images are sourced from Wikimedia Commons with appropriate licenses.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface FieldTripStopData {
  orderIndex: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  funFact: string;
  thinkQuestion: string;
}

interface VirtualFieldTripData {
  title: string;
  description: string;
  gradeLevel: string;
  estimatedMinutes: number;
  theme: string;
  coverImageUrl: string;
  isPublished: boolean;
  isCore: boolean;
  stops: FieldTripStopData[];
}

const rockyMountainHouseFieldTrip: VirtualFieldTripData = {
  title: "Rocky Mountain House: Gateway to the Rockies",
  description:
    "Explore Rocky Mountain House, where the fur trade met the Rocky Mountains. This remote outpost served as David Thompson's base for his epic journeys across the Continental Divide and was a crucial trading center with the powerful Blackfoot Confederacy.",
  gradeLevel: "7-9",
  estimatedMinutes: 45,
  theme: "explorer",
  coverImageUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Rocky_Mountain_House_NHS_14.jpg/1280px-Rocky_Mountain_House_NHS_14.jpg",
  isPublished: true,
  isCore: true,
  stops: [
    {
      orderIndex: 0,
      title: "Arrival at the Edge of the Mountains",
      description: `As your canoe rounds the final bend of the North Saskatchewan River, you see Rocky Mountain House rising from the riverbank. Behind it, the dramatic peaks of the Rocky Mountains fill the western horizon - a wall of snow-capped summits that mark the edge of the known world. It is 1800, and you have reached the most westerly fur trading post in British North America.

The North West Company established this post in 1799, choosing this location precisely because of its position at the foot of the Rockies. The HBC quickly followed, building their own post just a short distance away. This competition between the two great fur trading companies was fierce - whoever controlled Rocky Mountain House controlled access to the vast, unexplored territories beyond the mountains. The rival posts sat within sight of each other, each trying to attract Indigenous traders before the other could.

The setting is spectacular but challenging. The mountains create their own weather, and fierce chinook winds can raise temperatures dramatically in winter or bring sudden storms. The post sits at the edge of Blackfoot territory, and relations with these powerful nations require constant diplomatic skill. Yet for explorers like David Thompson, this remote outpost represented the gateway to geographic discovery and the key to finding a route to the Pacific Ocean.`,
      latitude: 52.3756,
      longitude: -114.9217,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Rocky_Mountain_House_NHS_14.jpg/1280px-Rocky_Mountain_House_NHS_14.jpg",
      funFact:
        "Rocky Mountain House was actually a series of posts built and rebuilt over nearly 80 years. At least five different NWC and HBC posts were constructed at various locations along this stretch of the North Saskatchewan River between 1799 and 1875.",
      thinkQuestion:
        "Why do you think the North West Company and Hudson's Bay Company built competing posts so close to each other? What advantages and disadvantages would this create?",
    },
    {
      orderIndex: 1,
      title: "David Thompson's Base Camp",
      description: `Step inside the small room where one of history's greatest mapmakers planned his expeditions. David Thompson arrived at Rocky Mountain House in 1800, using it as his base for exploring the Rocky Mountains and beyond. His goal was nothing less than finding a practical route across the Continental Divide to open trade with Indigenous nations on the Pacific slope.

Thompson was a remarkable figure - a surveyor, astronomer, and cartographer who would eventually map over 4 million square kilometers of North America. Each night at Rocky Mountain House, he took astronomical observations with his sextant and calculated his precise position using the stars. His meticulous journals recorded not just geography but also Indigenous languages, customs, and the natural world. He taught himself the Blackfoot and Kootenay languages to better communicate with the peoples he encountered.

From this post, Thompson made repeated attempts to cross the Rockies. He explored the headwaters of the North Saskatchewan River, traded with the Kootenay people who lived on the western slopes, and gathered information about potential passes through the mountains. His wife Charlotte Small, a Metis woman of Cree heritage, often accompanied him on his journeys, providing essential skills in survival and translation. Their partnership exemplified the crucial role of Indigenous and Metis women in the fur trade.`,
      latitude: 52.3760,
      longitude: -114.9210,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/David_Thompson_%28explorer%29.jpg/800px-David_Thompson_%28explorer%29.jpg",
      funFact:
        "David Thompson's eyesight was severely damaged when he was 18 years old from a winter accident. Despite this, he became the most prolific land geographer in history, using his one good eye to take precise astronomical observations and create maps of astonishing accuracy.",
      thinkQuestion:
        "What qualities would someone need to explore unknown territories in the early 1800s? How would Thompson's scientific training help him as an explorer?",
    },
    {
      orderIndex: 2,
      title: "Trade with the Blackfoot Confederacy",
      description: `The trading room at Rocky Mountain House is busy with activity. Blackfoot traders have arrived with prime beaver pelts, wolf skins, and horses - the magnificent animals that transformed life on the plains. The Blackfoot Confederacy - comprising the Siksika (Blackfoot proper), Kainai (Blood), and Piikani (Peigan) nations - controlled the territory around Rocky Mountain House and were essential trading partners.

The relationship between the fur traders and the Blackfoot was complex. The Blackfoot were skilled warriors who had built their power through control of the horse trade and their strategic position between the plains and the mountains. They welcomed European trade goods, especially guns, ammunition, and metal tools, which strengthened their position against rival nations. But they were also wary of Europeans crossing their territory to trade with their enemies, the Kootenay and other nations beyond the mountains.

This tension shaped everything at Rocky Mountain House. The traders had to maintain good relations with the Blackfoot to survive, yet the NWC also wanted to expand trade westward. Gift-giving ceremonies, pipe ceremonies, and careful diplomacy were essential parts of the trading relationship. Chiefs like Kootenae Appee (Piikani) became important intermediaries, while Blackfoot women sometimes married fur traders, creating family bonds that strengthened trade alliances.`,
      latitude: 52.3752,
      longitude: -114.9225,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Blackfoot_Indians_tipis_-_Edward_S._Curtis.jpg/1280px-Blackfoot_Indians_tipis_-_Edward_S._Curtis.jpg",
      funFact:
        "The Blackfoot Confederacy was one of the most powerful military forces on the northern plains. Their control of the horse trade and their skilled horsemanship made them formidable warriors that even the largest fur trading companies had to treat with respect and diplomacy.",
      thinkQuestion:
        "How did the Blackfoot Confederacy use trade to strengthen their position? Why might they have been concerned about Europeans trading with nations on the other side of the mountains?",
    },
    {
      orderIndex: 3,
      title: "The Search for Athabasca Pass",
      description: `In Thompson's quarters, maps and charts cover every surface. He is planning his most ambitious expedition yet - finding a route across the Rocky Mountains that avoids Blackfoot territory. The problem is urgent: the Piikani have closed Howse Pass, the route Thompson had previously used to cross the Rockies, threatening violence against any traders who attempt the crossing.

Howse Pass, discovered in 1807, had allowed Thompson to cross the Continental Divide and establish posts on the Columbia River. But the Blackfoot saw this western trade as a threat - if their enemies the Kootenay and Flathead received guns from European traders, the balance of power on the plains could shift. By 1810, armed Piikani warriors blocked the pass, making it too dangerous to use.

Thompson had to find an alternative. Working with his Iroquois and Metis voyageurs, and guided by information from Cree traders, he searched for a northern route that would bypass Blackfoot territory entirely. In the brutal winter of 1810-1811, Thompson led an expedition that crossed the Rockies via Athabasca Pass, a higher and more difficult route but one that lay beyond Blackfoot control. This crossing opened a permanent highway across the mountains that the fur trade would use for the next forty years.`,
      latitude: 52.3765,
      longitude: -114.9200,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Athabasca_Pass_BC.jpg/1280px-Athabasca_Pass_BC.jpg",
      funFact:
        "The crossing of Athabasca Pass in January 1811 was incredibly dangerous. Thompson's party traveled through deep snow in temperatures of -30 degrees Celsius, with some men suffering severe frostbite. Yet they succeeded in opening a route that changed the history of western North America.",
      thinkQuestion:
        "Why was finding a route across the Rocky Mountains so important to the fur trade? What risks did Thompson and his men face in their winter crossing?",
    },
    {
      orderIndex: 4,
      title: "Life at a Mountain Post",
      description: `Step outside the palisade and observe the challenging environment of Rocky Mountain House. This was no comfortable posting - it was the frontier of the frontier, where survival required constant effort and adaptation. The winter winds that howled down from the mountains could freeze exposed skin in minutes, while summer brought clouds of mosquitoes and the constant threat of horse raids.

Supplies had to travel thousands of kilometers to reach this remote post. Each year, brigades of canoes and York boats brought trade goods from the east - blankets, kettles, guns, ammunition, cloth, and hundreds of other items. But the posts also depended heavily on local resources. Hunters brought in buffalo, elk, and deer meat. Pemmican, purchased from Indigenous and Metis hunters, was essential for feeding the post through winter and provisioning expeditions into the mountains.

The people who lived here formed a diverse community. French-Canadian voyageurs, Iroquois and Ojibwe canoemen from the east, Orkney Islanders from Scotland, Metis families, and Cree and Blackfoot trading partners all mixed at the post. Many employees took Indigenous wives according to the "custom of the country," creating mixed-heritage families whose children often became skilled traders, interpreters, and guides themselves. Women's work - processing furs, making moccasins and clothing, preparing food - was essential to the post's survival.`,
      latitude: 52.3748,
      longitude: -114.9230,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/York_boat_on_Hayes_River.jpg/1280px-York_boat_on_Hayes_River.jpg",
      funFact:
        "Getting a letter from Rocky Mountain House to Montreal could take six months to a year. News from Europe might be two years old by the time it reached this remote post. Workers often had no contact with the outside world for years at a time.",
      thinkQuestion:
        "What would be the most difficult aspects of living at Rocky Mountain House? How did the diverse community of the post work together to survive?",
    },
    {
      orderIndex: 5,
      title: "Legacy and the National Historic Site",
      description: `Today, Rocky Mountain House National Historic Site preserves the memory of this remarkable place where the fur trade reached the mountains. Walking the grounds, you can see the archaeological remains of the original trading posts - the outlines of buildings, the old chimneys, the refuse pits that tell stories of daily life. Interpretive trails lead through the landscape where Blackfoot traders once rode in on horseback and David Thompson planned his expeditions.

The site commemorates more than just fur trading history. It recognizes the complex relationships between European traders and Indigenous nations, the role of Metis and Indigenous women in the fur trade, and the environmental and cultural transformations that resulted from the trade. The story of Rocky Mountain House is ultimately a story about different cultures meeting, trading, competing, and sometimes clashing at the edge of the Rocky Mountains.

Parks Canada has worked with the Blackfoot Confederacy, Cree, and Metis communities to tell this history from multiple perspectives. Visitors can experience reconstructions of trading activities, learn about Indigenous cultures, and understand how the events at this remote outpost connected to larger patterns of exploration, trade, and colonization across North America. The mountains still dominate the western horizon, just as they did when Thompson first saw them over two hundred years ago.`,
      latitude: 52.3750,
      longitude: -114.9220,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Rocky_Mountain_House_National_Historic_Site.jpg/1280px-Rocky_Mountain_House_National_Historic_Site.jpg",
      funFact:
        "Archaeological excavations at Rocky Mountain House have uncovered thousands of artifacts including trade beads, gun parts, clay pipes, buttons, and animal bones. These objects help historians understand what life was really like at this remote frontier post.",
      thinkQuestion:
        "Why is it important to preserve historic sites like Rocky Mountain House? How can we tell the stories of all the different peoples who lived and traded here?",
    },
  ],
};

async function seedRockyMountainHouseFieldTrip(): Promise<void> {
  console.log("Starting seed for Rocky Mountain House Virtual Field Trip...\n");

  try {
    // Check if the field trip already exists
    const existing = await prisma.virtualFieldTrip.findFirst({
      where: { title: rockyMountainHouseFieldTrip.title },
    });

    if (existing) {
      console.log(
        `  Updating existing field trip: ${rockyMountainHouseFieldTrip.title}`
      );

      // Delete existing stops
      await prisma.fieldTripStop.deleteMany({
        where: { tripId: existing.id },
      });

      // Update the trip
      await prisma.virtualFieldTrip.update({
        where: { id: existing.id },
        data: {
          description: rockyMountainHouseFieldTrip.description,
          gradeLevel: rockyMountainHouseFieldTrip.gradeLevel,
          estimatedMinutes: rockyMountainHouseFieldTrip.estimatedMinutes,
          theme: rockyMountainHouseFieldTrip.theme,
          coverImageUrl: rockyMountainHouseFieldTrip.coverImageUrl,
          isPublished: rockyMountainHouseFieldTrip.isPublished,
          isCore: rockyMountainHouseFieldTrip.isCore,
        },
      });

      // Create new stops
      for (const stop of rockyMountainHouseFieldTrip.stops) {
        await prisma.fieldTripStop.create({
          data: {
            tripId: existing.id,
            orderIndex: stop.orderIndex,
            title: stop.title,
            description: stop.description,
            latitude: stop.latitude,
            longitude: stop.longitude,
            imageUrl: stop.imageUrl,
            funFact: stop.funFact,
            thinkQuestion: stop.thinkQuestion,
          },
        });
        console.log(`    Created stop: ${stop.title}`);
      }
    } else {
      console.log(
        `  Creating new field trip: ${rockyMountainHouseFieldTrip.title}`
      );

      // Create the trip
      const newTrip = await prisma.virtualFieldTrip.create({
        data: {
          title: rockyMountainHouseFieldTrip.title,
          description: rockyMountainHouseFieldTrip.description,
          gradeLevel: rockyMountainHouseFieldTrip.gradeLevel,
          estimatedMinutes: rockyMountainHouseFieldTrip.estimatedMinutes,
          theme: rockyMountainHouseFieldTrip.theme,
          coverImageUrl: rockyMountainHouseFieldTrip.coverImageUrl,
          isPublished: rockyMountainHouseFieldTrip.isPublished,
          isCore: rockyMountainHouseFieldTrip.isCore,
        },
      });

      // Create stops
      for (const stop of rockyMountainHouseFieldTrip.stops) {
        await prisma.fieldTripStop.create({
          data: {
            tripId: newTrip.id,
            orderIndex: stop.orderIndex,
            title: stop.title,
            description: stop.description,
            latitude: stop.latitude,
            longitude: stop.longitude,
            imageUrl: stop.imageUrl,
            funFact: stop.funFact,
            thinkQuestion: stop.thinkQuestion,
          },
        });
        console.log(`    Created stop: ${stop.title}`);
      }
    }

    console.log(`\n=== Rocky Mountain House Field Trip Seed Complete ===`);

    // Display summary
    const tripCount = await prisma.virtualFieldTrip.count();
    const stopCount = await prisma.fieldTripStop.count();
    console.log(`\nTotal Virtual Field Trips in database: ${tripCount}`);
    console.log(`Total Field Trip Stops in database: ${stopCount}`);

    // Verify the Rocky Mountain House trip
    const rockyMountainHouse = await prisma.virtualFieldTrip.findFirst({
      where: { title: rockyMountainHouseFieldTrip.title },
      include: { stops: true },
    });

    if (rockyMountainHouse) {
      console.log(`\nRocky Mountain House Field Trip Details:`);
      console.log(`  Title: ${rockyMountainHouse.title}`);
      console.log(`  Grade Level: ${rockyMountainHouse.gradeLevel}`);
      console.log(`  Duration: ${rockyMountainHouse.estimatedMinutes} minutes`);
      console.log(`  Theme: ${rockyMountainHouse.theme}`);
      console.log(`  Published: ${rockyMountainHouse.isPublished}`);
      console.log(`  Core Content: ${rockyMountainHouse.isCore}`);
      console.log(`  Number of Stops: ${rockyMountainHouse.stops.length}`);
      console.log(`\n  Stops:`);
      for (const stop of rockyMountainHouse.stops.sort(
        (a, b) => a.orderIndex - b.orderIndex
      )) {
        console.log(`    ${stop.orderIndex + 1}. ${stop.title}`);
      }
    }
  } catch (error) {
    console.error("Error seeding Rocky Mountain House field trip:", error);
    throw error;
  }
}

// Run if executed directly
const isMainModule =
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith("seed-rocky-mountain-house-field-trip.ts");

if (isMainModule) {
  seedRockyMountainHouseFieldTrip()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export { seedRockyMountainHouseFieldTrip };
