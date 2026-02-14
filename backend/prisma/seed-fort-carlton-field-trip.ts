/**
 * Seed file for Fort Carlton Virtual Field Trip
 *
 * Fort Carlton was established by the Hudson's Bay Company in 1810 on the North
 * Saskatchewan River. It became one of the most important posts in the prairies,
 * serving as a provisioning post for pemmican trade and later as a treaty signing
 * site (Treaty 6 in 1876). It was burned during the 1885 North-West Rebellion.
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

const fortCarltonFieldTrip: VirtualFieldTripData = {
  title: "Fort Carlton: Crossroads of the Prairie Fur Trade",
  description:
    "Journey to Fort Carlton, the HBC's most important prairie post. This strategic location on the North Saskatchewan River served as a hub for the pemmican trade, a meeting place for Indigenous nations, and the site where Treaty 6 was signed in 1876.",
  gradeLevel: "4-6",
  estimatedMinutes: 40,
  theme: "fur_trade",
  coverImageUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Fort_Carlton_NHSC.jpg/1280px-Fort_Carlton_NHSC.jpg",
  isPublished: true,
  isCore: true,
  stops: [
    {
      orderIndex: 0,
      title: "Arriving at Fort Carlton",
      description: `As you approach Fort Carlton, you see a wooden palisade rising from the prairie grasslands along the North Saskatchewan River. Established by the Hudson's Bay Company in 1810, this post was strategically located at the crossroads of the prairie fur trade. The Carlton Trail, the main overland route across the prairies, passed right by the fort, making it a natural stopping point for traders, travelers, and Indigenous peoples.

The location was carefully chosen. The North Saskatchewan River provided water access to posts both east and west, while the surrounding prairie was home to vast herds of buffalo. The river's high banks offered protection from spring floods, and the nearby forests provided timber for construction and firewood. For the Plains Cree, Assiniboine, and other nations, this area had been an important gathering place long before Europeans arrived.

Looking around, you can see why Fort Carlton became the HBC's most important prairie post. The flat terrain stretches to the horizon in every direction, dotted with buffalo and the camps of Indigenous peoples who have come to trade. The fort itself is a bustling center of activity, with traders, voyageurs, and Indigenous families all going about their business.`,
      latitude: 52.8667,
      longitude: -106.2,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Fort_Carlton_NHSC.jpg/1280px-Fort_Carlton_NHSC.jpg",
      funFact:
        "Fort Carlton was rebuilt three times between 1810 and 1885, each time in a slightly different location along the river to find better ground for construction and trade.",
      thinkQuestion:
        "Why do you think the location of a trading post was so important? What features would you look for if you were choosing a site?",
    },
    {
      orderIndex: 1,
      title: "The Pemmican Trade",
      description: `Inside the fort's warehouse, you see stacks of leather bags filled with pemmican - the most valuable commodity at Fort Carlton. Pemmican was the fuel that powered the entire fur trade. Made from dried buffalo meat pounded into powder and mixed with melted fat and sometimes berries, pemmican could last for years without spoiling. A single pound of pemmican provided as much nutrition as several pounds of fresh meat.

Fort Carlton was the HBC's main pemmican provisioning post. Each year, Metis and Indigenous hunters brought thousands of pounds of pemmican to the fort. This food was then shipped to posts throughout the HBC network, feeding the brigades of voyageurs who paddled canoes loaded with furs and trade goods across the continent. Without pemmican, the fur trade simply could not function - fresh food was too heavy to transport, and hunting along the way would slow down travel.

The pemmican trade created a unique economy on the prairies. Metis families followed the buffalo herds, hunting the animals and processing the meat into pemmican. Women did much of this skilled work, drying the meat, rendering the fat, and packing the finished product into 90-pound bags called "taureau." A single hunting camp might produce thousands of pounds of pemmican in a season.`,
      latitude: 52.8670,
      longitude: -106.1995,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Pemmican_ball.jpg/1280px-Pemmican_ball.jpg",
      funFact:
        "A single 90-pound bag of pemmican could feed a voyageur for over a month! The HBC bought over 200,000 pounds of pemmican from Fort Carlton some years.",
      thinkQuestion:
        "Why was pemmican so important to the fur trade? What modern foods serve a similar purpose for explorers and travelers today?",
    },
    {
      orderIndex: 2,
      title: "Trading with the Plains Cree and Assiniboine",
      description: `Step into the trading room where the HBC trader stands behind a heavy wooden counter. On one side are European trade goods - metal kettles, steel knives, woolen blankets, glass beads, guns, and ammunition. On the other side, Indigenous traders bring furs and pemmican. The air is filled with the sounds of negotiation in Cree, Assiniboine, and English, often with Metis interpreters helping bridge the language gap.

The Plains Cree and Assiniboine peoples were the HBC's most important trading partners at Fort Carlton. They were not just suppliers of furs and pemmican - they were sophisticated traders who understood the value of their goods and often played the HBC against its rivals. Trading relationships were reinforced through ceremonies, gift exchanges, and intermarriage. Many HBC employees at Fort Carlton had Indigenous wives and Metis children, creating family connections that strengthened trade ties.

For Indigenous peoples, the trade brought valuable new technologies. Metal tools made tasks easier, firearms changed hunting, and cloth supplemented traditional leather clothing. But the trade also brought changes that disrupted traditional ways of life. Growing dependence on European goods, the spread of diseases, and the eventual decline of the buffalo herds would transform Indigenous societies in ways that no one at Fort Carlton could have predicted.`,
      latitude: 52.8665,
      longitude: -106.2005,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Canadian_warmth.jpg/960px-Canadian_warmth.jpg",
      funFact:
        "The 'Made Beaver' was the standard currency at Fort Carlton. One prime beaver pelt equaled one Made Beaver. A gun cost about 14 Made Beaver, while a steel knife was just 1.",
      thinkQuestion:
        "How do you think trade changed the lives of the Plains Cree and Assiniboine peoples? What were the benefits and drawbacks of trading with Europeans?",
    },
    {
      orderIndex: 3,
      title: "Life at a Prairie Post",
      description: `Walk through Fort Carlton and observe the daily rhythms of life at a prairie trading post. The fort is laid out around a central yard, with buildings for trading, storage, accommodation, and workshops arranged along the palisade walls. Unlike the grand stone forts of the east, Fort Carlton is built of wood - squared logs chinked with mud and whitewashed to protect against the weather.

Life here follows the seasons. In summer, the fort is busy with trade as Indigenous peoples arrive with furs from their winter hunts and pemmican from the summer buffalo hunts. Brigades of York boats arrive from Norway House, bringing trade goods from England and departing loaded with furs and pemmican. In autumn, hunters prepare for winter by laying in supplies of meat and firewood. Winter is quieter, but trade continues as trappers bring in furs.

The people of Fort Carlton form a diverse community. The Chief Factor and his officers run the post, but most of the workers are Metis or Indigenous. Blacksmiths repair guns and make ironwork. Coopers build barrels for pemmican. Women - often the Indigenous or Metis wives of HBC employees - do essential work processing furs, making moccasins, and preparing food. Children play in the fort yard while learning the skills they will need as adults.`,
      latitude: 52.8668,
      longitude: -106.2010,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/YorkBoat_FEP.jpg/1280px-YorkBoat_FEP.jpg",
      funFact:
        "Fort Carlton was one of the few prairie posts large enough to have a blacksmith shop. Indigenous peoples would travel great distances to have their guns repaired here.",
      thinkQuestion:
        "What do you think was the hardest part of living at Fort Carlton? How would your life be different if you lived there?",
    },
    {
      orderIndex: 4,
      title: "Treaty 6 Signing",
      description: `It is August 1876, and Fort Carlton is about to witness one of the most important events in Canadian history. Outside the fort walls, thousands of Plains Cree have gathered in their lodges. Government commissioners, led by Alexander Morris, have come to negotiate Treaty 6 - an agreement that will change the lives of Indigenous peoples forever.

The negotiations are intense. Cree leaders like Chiefs Poundmaker and Big Bear have serious concerns about their people's future. The buffalo herds are already declining, and they can see the changes coming to the prairies. They demand provisions for farming, assistance in times of famine, and a "medicine chest" clause providing healthcare. Chief Big Bear is particularly skeptical, asking "What we speak of and do now will last as long as the sun shines and the river runs."

On August 23, 1876, many Cree chiefs touch the pen to sign Treaty 6 at Fort Carlton. In exchange for their traditional lands, they receive reserves, annual payments, farming equipment, and other promises. But Chief Big Bear refuses to sign, warning that the treaty terms are inadequate. His concerns would prove tragically prescient. The treaty's promises were often broken or inadequately fulfilled, and within a decade, the buffalo would be gone, leading to starvation and the resistance of 1885.`,
      latitude: 52.8660,
      longitude: -106.1990,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Poundmaker_with_woman.jpg/500px-Poundmaker_with_woman.jpg",
      funFact:
        "The 'medicine chest' clause in Treaty 6 is still important today. Courts have interpreted it to mean that the government must provide healthcare to Indigenous peoples covered by the treaty.",
      thinkQuestion:
        "Why do you think some chiefs signed Treaty 6 while others like Big Bear refused? What would you have done in their position?",
    },
    {
      orderIndex: 5,
      title: "The 1885 Rebellion and Fort's End",
      description: `Less than ten years after Treaty 6 was signed, Fort Carlton stands at the center of crisis. It is March 1885, and the North-West Rebellion has begun. Louis Riel has established a provisional government at Batoche, just upstream. The Metis and their Indigenous allies are fighting for their lands and rights against the Canadian government.

North-West Mounted Police and soldiers gather at Fort Carlton, using it as a base of operations. But the old wooden fort offers little protection against armed conflict. After the Battle of Duck Lake on March 26, 1885 - a Metis victory that shocked the government - the police decide to abandon Fort Carlton and retreat to Prince Albert. As they leave, fire breaks out. Whether by accident or design, the flames consume the fort that had stood for 75 years.

Today, Fort Carlton has been reconstructed as a Provincial Historic Park. Walking through the rebuilt palisades and buildings, you can imagine the traders, Indigenous peoples, Metis hunters, and government officials who passed through these gates. The story of Fort Carlton reflects the larger story of the prairies - a place where cultures met, traded, negotiated, and ultimately clashed. The treaties signed here still shape the relationship between Indigenous peoples and Canada today.`,
      latitude: 52.8663,
      longitude: -106.2015,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Batoche.jpg/500px-Batoche.jpg",
      funFact:
        "The original Fort Carlton was completely destroyed in 1885. The fort you can visit today is a careful reconstruction based on historical records, photographs, and archaeological research.",
      thinkQuestion:
        "Why do you think it is important to preserve and reconstruct historic sites like Fort Carlton? What can we learn from visiting these places?",
    },
  ],
};

async function seedFortCarltonFieldTrip(): Promise<void> {
  console.log("Starting seed for Fort Carlton Virtual Field Trip...\n");

  try {
    // Check if the field trip already exists
    const existing = await prisma.virtualFieldTrip.findFirst({
      where: { title: fortCarltonFieldTrip.title },
    });

    if (existing) {
      console.log(
        `  Updating existing field trip: ${fortCarltonFieldTrip.title}`
      );

      // Delete existing stops
      await prisma.fieldTripStop.deleteMany({
        where: { tripId: existing.id },
      });

      // Update the trip
      await prisma.virtualFieldTrip.update({
        where: { id: existing.id },
        data: {
          description: fortCarltonFieldTrip.description,
          gradeLevel: fortCarltonFieldTrip.gradeLevel,
          estimatedMinutes: fortCarltonFieldTrip.estimatedMinutes,
          theme: fortCarltonFieldTrip.theme,
          coverImageUrl: fortCarltonFieldTrip.coverImageUrl,
          isPublished: fortCarltonFieldTrip.isPublished,
          isCore: fortCarltonFieldTrip.isCore,
        },
      });

      // Create new stops
      for (const stop of fortCarltonFieldTrip.stops) {
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
        `  Creating new field trip: ${fortCarltonFieldTrip.title}`
      );

      // Create the trip
      const newTrip = await prisma.virtualFieldTrip.create({
        data: {
          title: fortCarltonFieldTrip.title,
          description: fortCarltonFieldTrip.description,
          gradeLevel: fortCarltonFieldTrip.gradeLevel,
          estimatedMinutes: fortCarltonFieldTrip.estimatedMinutes,
          theme: fortCarltonFieldTrip.theme,
          coverImageUrl: fortCarltonFieldTrip.coverImageUrl,
          isPublished: fortCarltonFieldTrip.isPublished,
          isCore: fortCarltonFieldTrip.isCore,
        },
      });

      // Create stops
      for (const stop of fortCarltonFieldTrip.stops) {
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

    console.log(`\n=== Fort Carlton Field Trip Seed Complete ===`);

    // Display summary
    const tripCount = await prisma.virtualFieldTrip.count();
    const stopCount = await prisma.fieldTripStop.count();
    console.log(`\nTotal Virtual Field Trips in database: ${tripCount}`);
    console.log(`Total Field Trip Stops in database: ${stopCount}`);

    // Verify the Fort Carlton trip
    const fortCarlton = await prisma.virtualFieldTrip.findFirst({
      where: { title: fortCarltonFieldTrip.title },
      include: { stops: true },
    });

    if (fortCarlton) {
      console.log(`\nFort Carlton Field Trip Details:`);
      console.log(`  Title: ${fortCarlton.title}`);
      console.log(`  Grade Level: ${fortCarlton.gradeLevel}`);
      console.log(`  Duration: ${fortCarlton.estimatedMinutes} minutes`);
      console.log(`  Theme: ${fortCarlton.theme}`);
      console.log(`  Published: ${fortCarlton.isPublished}`);
      console.log(`  Core Content: ${fortCarlton.isCore}`);
      console.log(`  Number of Stops: ${fortCarlton.stops.length}`);
      console.log(`\n  Stops:`);
      for (const stop of fortCarlton.stops.sort(
        (a, b) => a.orderIndex - b.orderIndex
      )) {
        console.log(`    ${stop.orderIndex + 1}. ${stop.title}`);
      }
    }
  } catch (error) {
    console.error("Error seeding Fort Carlton field trip:", error);
    throw error;
  }
}

// Run if executed directly
const isMainModule =
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith("seed-fort-carlton-field-trip.ts");

if (isMainModule) {
  seedFortCarltonFieldTrip()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export { seedFortCarltonFieldTrip };
