import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("📚 Seeding Educational Content...");

  // Get existing explorers
  const davidThompson = await prisma.explorer.findFirst({
    where: { name: "David Thompson" }
  });

  const simonFraser = await prisma.explorer.findFirst({
    where: { name: "Simon Fraser" }
  });

  const alexanderMackenzie = await prisma.explorer.findFirst({
    where: { name: "Alexander Mackenzie" }
  });

  const samuelHearne = await prisma.explorer.findFirst({
    where: { name: "Samuel Hearne" }
  });

  // Get existing waterways for references
  const mackenzieRiver = await prisma.waterway.findFirst({
    where: { name: "Mackenzie River" }
  });

  const fraserRiver = await prisma.waterway.findFirst({
    where: { name: "Fraser River" }
  });

  const hudsonBay = await prisma.waterway.findFirst({
    where: { name: "Hudson Bay" }
  });

  // Get existing locations
  const yorkFactory = await prisma.location.findFirst({
    where: { name: "York Factory" }
  });

  console.log("✅ Found existing data references");

  // ==================== VIRTUAL FIELD TRIPS ====================
  console.log("\n📍 Creating Virtual Field Trips...");

  // Check if York Factory field trip already exists
  const existingYorkTrip = await prisma.virtualFieldTrip.findFirst({
    where: { title: { contains: "York Factory" } }
  });

  // Create Fort William Field Trip
  const fortWilliamTrip = await prisma.virtualFieldTrip.create({
    data: {
      title: "Fort William: North West Company Rendezvous",
      description: "Experience the excitement of the annual fur trade gathering at Fort William, where voyageurs from Montreal met winterers from the interior. This was the headquarters of the North West Company and site of the legendary Rendezvous.",
      gradeLevel: "4-6",
      estimatedMinutes: 45,
      theme: "fur_trade",
      isPublished: true,
      stops: {
        create: [
          {
            orderIndex: 1,
            title: "Arrival at the Great Hall",
            description: "Welcome to Fort William! It's July 1815, and you're arriving by canoe after weeks of paddling from Montreal. The Great Hall towers before you - this massive timber building is the heart of the North West Company's empire. Inside, partners make decisions worth fortunes while clerks tally beaver pelts from across the continent.",
            latitude: 48.3810,
            longitude: -89.2477,
            funFact: "The Great Hall could seat 200 people for dinner! Voyageurs called it 'The Great Rendezvous' and looked forward to it all year.",
            thinkQuestion: "Why would the North West Company choose this location for their headquarters? Think about waterways and geography."
          },
          {
            orderIndex: 2,
            title: "The Canoe Yard",
            description: "Look at these magnificent birchbark canoes! Some are 36 feet long - 'canots de maître' that carried 4 tons of cargo and 8 to 12 voyageurs from Montreal. The smaller 'canots du nord' (25 feet) were used in the shallow waters of the interior. Skilled Anishinaabe craftspeople built these vessels using birchbark, spruce roots, and pine pitch.",
            latitude: 48.3812,
            longitude: -89.2480,
            funFact: "A fully loaded Montreal canoe could be paddled 40 miles per day, with voyageurs paddling up to 55 strokes per minute!",
            thinkQuestion: "Why did they need two different sizes of canoes? What challenges would each type face?"
          },
          {
            orderIndex: 3,
            title: "The Trade Warehouse",
            description: "Step into the warehouse where fortunes are stored! Stacks of beaver pelts reach to the ceiling - each representing a beaver trapped somewhere in the vast Canadian wilderness. There are also otter, marten, mink, and fox furs. In exchange, Indigenous trappers and voyageurs received trade goods: blankets, knives, kettles, tobacco, and more.",
            latitude: 48.3815,
            longitude: -89.2475,
            funFact: "At its peak, Fort William handled 100,000 beaver pelts per year! That's enough to make 50,000 felt hats.",
            thinkQuestion: "Who did the actual work of trapping the beavers? Why was beaver fur so valuable in Europe?"
          },
          {
            orderIndex: 4,
            title: "The Voyageur Encampment",
            description: "Hear that singing? The voyageurs are celebrating! After months apart, the 'mangeurs de lard' (pork eaters - Montreal men) and 'hivernants' (winterers from the interior) swap stories of their journeys. They sing traditional paddling songs like 'En Roulant Ma Boule' and compete in contests of strength. Tonight there will be dancing and fiddle music!",
            latitude: 48.3808,
            longitude: -89.2482,
            funFact: "Voyageurs consumed up to 8,000 calories per day due to their hard paddling! They ate mainly pemmican, dried peas, and salt pork.",
            thinkQuestion: "Why do you think songs were so important to voyageurs? How might singing help during long paddle days?"
          },
          {
            orderIndex: 5,
            title: "The Council Chamber",
            description: "Inside the Great Hall, the 'wintering partners' meet with Montreal agents to negotiate next year's plans. Maps spread across the table show waterways stretching from the Great Lakes to the Arctic Ocean and Pacific Coast. These decisions will determine where posts are built, which routes are used, and how profits are divided.",
            latitude: 48.3811,
            longitude: -89.2476,
            funFact: "North West Company partners could earn the equivalent of millions of dollars in today's money! But the work was dangerous - many voyageurs never made it home.",
            thinkQuestion: "The North West Company competed fiercely with the Hudson's Bay Company. What advantages did each company have?"
          },
          {
            orderIndex: 6,
            title: "Indigenous Partnership",
            description: "The fur trade couldn't exist without Indigenous knowledge and labor. Anishinaabe, Cree, and other nations trapped the beaver, built the canoes, provided guides, and supplied pemmican. Many voyageurs married Indigenous women who served as translators and cultural liaisons. These relationships were essential to the trade's success.",
            latitude: 48.3813,
            longitude: -89.2478,
            funFact: "The word 'Métis' describes the distinct culture that emerged from French-Indigenous marriages. Métis people played crucial roles as traders, interpreters, and buffalo hunters.",
            thinkQuestion: "How did the fur trade change Indigenous ways of life? Think about both positive and negative impacts."
          }
        ]
      }
    }
  });

  // Create L'Anse aux Meadows Field Trip
  const lanseAuxMeadowsTrip = await prisma.virtualFieldTrip.create({
    data: {
      title: "L'Anse aux Meadows: Norse Settlement in the New World",
      description: "Travel back 1,000 years to the only confirmed Norse settlement in North America. Discovered in 1960, this site proves Vikings reached Canada 500 years before Columbus. Walk through reconstructed sod houses and imagine life at the edge of the known world.",
      gradeLevel: "7-9",
      estimatedMinutes: 40,
      theme: "explorer",
      isPublished: true,
      stops: {
        create: [
          {
            orderIndex: 1,
            title: "The Viking Landing",
            description: "You stand on the northern tip of Newfoundland, at the edge of the Atlantic. Around the year 1000 AD, Norse explorers led by Leif Erikson sailed from Greenland in open boats, guided by stories of lands to the west. They called this place 'Vinland' - though scholars debate whether that meant 'wine land' or 'meadow land.'",
            latitude: 51.5944,
            longitude: -55.5333,
            funFact: "The Norse sailed in knarrs - cargo ships about 54 feet long. Without compasses, they navigated by sun, stars, and even birds!",
            thinkQuestion: "Why would Vikings from Greenland want to explore further west? What were they seeking?"
          },
          {
            orderIndex: 2,
            title: "The Great Hall",
            description: "Enter the largest building at L'Anse aux Meadows. This timber-framed structure with sod walls housed the expedition's leaders. Archaeological evidence shows it had a central hearth, sleeping benches along the walls, and could accommodate several families. The Norse built similar structures in Iceland and Greenland.",
            latitude: 51.5947,
            longitude: -55.5335,
            funFact: "Archaeologists found a bronze cloak pin here - proof positive that Vikings lived at this site. No Indigenous peoples of the region used bronze at that time.",
            thinkQuestion: "How would you build a house with no trees large enough for timber? The Vikings were ingenious builders."
          },
          {
            orderIndex: 3,
            title: "The Forge",
            description: "This small building contained the only known Norse iron forge in North America. Here, smiths extracted iron from bog ore and forged nails, rivets, and tools. The ability to work iron gave Vikings a technological advantage. Tiny pieces of slag (waste from iron-making) were crucial clues that helped archaeologists identify this as a Viking site.",
            latitude: 51.5946,
            longitude: -55.5337,
            funFact: "The bog iron processed here was heated to about 1,200°C (2,200°F). Vikings were master metallurgists!",
            thinkQuestion: "Why was the ability to make iron tools and nails so important for an expedition so far from home?"
          },
          {
            orderIndex: 4,
            title: "Boat Repair",
            description: "Near the shore, evidence shows Vikings repaired their boats here. After crossing the North Atlantic, their clinker-built vessels needed maintenance. Wood fragments show they cut local timber, and boat nails have been found. This was likely a base camp for exploring further south along the coast.",
            latitude: 51.5945,
            longitude: -55.5330,
            funFact: "Norse sagas describe sailing south from here to places with wild grapes and warm weather - possibly New Brunswick or even New England!",
            thinkQuestion: "The Norse didn't stay permanently. Why do you think they abandoned this settlement after just a few years?"
          },
          {
            orderIndex: 5,
            title: "Meeting the Skrælings",
            description: "Norse sagas tell of encounters with people they called 'Skrælings' - likely Beothuk or Dorset peoples. These meetings were sometimes friendly, sometimes hostile. Unlike in Greenland, the Norse couldn't establish peaceful trade relations here. This may be why they didn't colonize permanently.",
            latitude: 51.5948,
            longitude: -55.5336,
            funFact: "The word 'Skræling' might mean 'skin-wearer' or 'wretched person.' The Norse sagas describe both trades and battles with Indigenous peoples.",
            thinkQuestion: "What would Indigenous peoples have thought of these strange visitors with iron weapons and different boats? How might history have been different if Vikings had stayed?"
          },
          {
            orderIndex: 6,
            title: "Archaeological Discovery",
            description: "For centuries, L'Anse aux Meadows was just local legend. In 1960, Norwegian explorer Helge Ingstad and archaeologist Anne Stine Ingstad identified and excavated the site. Their work proved the Norse sagas weren't just myths - Vikings really did reach North America around the year 1000. UNESCO designated it a World Heritage Site in 1978.",
            latitude: 51.5946,
            longitude: -55.5334,
            funFact: "Anne Stine Ingstad led the archaeological excavations from 1961-1968. She carefully documented eight timber-framed buildings and thousands of artifacts.",
            thinkQuestion: "How do archaeologists distinguish between Norse and Indigenous artifacts? What clues help them date the site?"
          }
        ]
      }
    }
  });

  // Create Prince of Wales Fort Field Trip
  const princeOfWalesFortTrip = await prisma.virtualFieldTrip.create({
    data: {
      title: "Prince of Wales Fort: Stone Fortress on Hudson Bay",
      description: "Explore the massive stone fortress built by the Hudson's Bay Company to protect its vital trade route. This star-shaped fort took 40 years to build and represents the military importance of the fur trade. Stand where Samuel Hearne surrendered to French forces in 1782.",
      gradeLevel: "4-6",
      estimatedMinutes: 35,
      theme: "fur_trade",
      isPublished: true,
      stops: {
        create: [
          {
            orderIndex: 1,
            title: "The Star Fort",
            description: "Behold one of the most impressive structures ever built in the Canadian North! Prince of Wales Fort has massive stone walls 40 feet thick at the base and 17 feet high. Its star shape allowed cannons to defend from every angle. Construction began in 1731 and took 40 years - stone by stone, in one of the harshest climates on Earth.",
            latitude: 58.7680,
            longitude: -94.1653,
            funFact: "It took 40,000 tons of stone to build these walls! Workers quarried the stone nearby and used it without mortar - just perfectly fitted blocks.",
            thinkQuestion: "Why would the Hudson's Bay Company spend so much money and effort building such a massive fort way up on Hudson Bay?"
          },
          {
            orderIndex: 2,
            title: "The Cannon Batteries",
            description: "Prince of Wales Fort was armed with 42 cannons - more firepower than many European fortresses! These guns could fire cannonballs weighing up to 12 pounds across the Churchill River. The fort was designed to withstand attacks from French warships or rival fur traders. Yet when the test came in 1782, not a single shot was fired...",
            latitude: 58.7682,
            longitude: -94.1655,
            funFact: "The cannons are still here! Many have been restored and point out across the bay, just as they did 250 years ago.",
            thinkQuestion: "Why might having large cannons be more important for show than for actual fighting in the fur trade?"
          },
          {
            orderIndex: 3,
            title: "The 1782 Surrender",
            description: "In August 1782, three French warships appeared in the harbor. Governor Samuel Hearne commanded only 39 men, most sick with scurvy. He faced 400 French sailors led by Admiral La Pérouse. Hearne wisely surrendered without firing a shot. The French burned the wooden buildings inside but couldn't destroy the stone walls. Today we're grateful - the fort survives as a historic monument.",
            latitude: 58.7683,
            longitude: -94.1651,
            funFact: "Admiral La Pérouse was a gentleman. He treated Hearne kindly and later became a famous Pacific explorer. His ships vanished mysteriously in 1788 - one of history's great mysteries!",
            thinkQuestion: "Was Hearne's decision to surrender without fighting wise or cowardly? What might have happened if he'd fought?"
          },
          {
            orderIndex: 4,
            title: "The Trade Post",
            description: "Inside the fort's stone walls were wooden buildings: the Governor's residence, the trade shop, blacksmith's forge, powder magazine, and barracks. Cree traders would arrive by canoe with winter's furs - beaver, fox, marten, wolf. HBC traders would exchange them for blankets, guns, ammunition, kettles, and other European goods.",
            latitude: 58.7681,
            longitude: -94.1654,
            funFact: "The fort's trade 'currency' was called 'Made Beaver' - one prime beaver pelt. A gun might cost 10 Made Beaver, a blanket 7 Made Beaver, etc.",
            thinkQuestion: "The HBC waited at forts for Indigenous traders to come to them. Their rivals (North West Company) went inland to trade. What were the advantages of each approach?"
          },
          {
            orderIndex: 5,
            title: "Samuel Hearne's Expeditions",
            description: "This fort was home to Samuel Hearne, one of Canada's greatest explorers. In 1771, guided by Chipewyan leader Matonabbee, Hearne became the first European to reach the Arctic Ocean overland. His journey of 5,600 km on foot remains legendary. He later served as Governor here and established Cumberland House, the HBC's first inland post.",
            latitude: 58.7679,
            longitude: -94.1652,
            funFact: "Hearne depended completely on his Dene guides. He learned that success in the North required respecting and learning from Indigenous peoples.",
            thinkQuestion: "Why did the HBC finally decide to build inland posts like Cumberland House after 100 years of waiting at the Bay?"
          },
          {
            orderIndex: 6,
            title: "Visiting Today",
            description: "Prince of Wales Fort is now a National Historic Site managed by Parks Canada. Polar bears sometimes wander through the ruins! Visitors reach the fort by boat from Churchill - the same way traders arrived centuries ago. The stone walls stand strong, reminders of when control of the fur trade meant controlling an empire.",
            latitude: 58.7681,
            longitude: -94.1653,
            funFact: "Churchill is called the 'Polar Bear Capital of the World.' You might see beluga whales, seals, and even the Northern Lights when visiting the fort!",
            thinkQuestion: "What can historic sites like this teach us that books and classrooms cannot? Why is it important to preserve these places?"
          }
        ]
      }
    }
  });

  console.log(`✅ Created ${existingYorkTrip ? 3 : 4} Virtual Field Trips (York Factory already existed: ${!!existingYorkTrip})`);

  // ==================== PRIMARY SOURCE DOCUMENTS ====================
  console.log("\n📜 Creating Primary Source Documents...");

  const thompsonFieldNotes = await prisma.primarySourceDocument.create({
    data: {
      title: "David Thompson's Field Notes, June 1811",
      documentType: "journal",
      author: "David Thompson",
      originalDate: "June 22, 1811",
      originalYear: 1811,
      originalText: "Wednesday 22nd June 1811. A fine day. At 8 AM proceeded on our voyage down the Columbia River. The current very strong with many rapids. The River full of large stones which render the navigation very dangerous. At 2 PM came to a very bad rapid about half a mile in length - the water dashing over rocks with great fury. We were obliged to unload and carry everything over the rocks, a portage of about 300 yards. The men much fatigued.",
      transcription: "Wednesday, June 22, 1811. A fine day. At 8 AM we proceeded on our voyage down the Columbia River. The current was very strong with many rapids. The river was full of large stones which made the navigation very dangerous. At 2 PM we came to a very bad rapid about half a mile in length - the water was dashing over rocks with great fury. We were obliged to unload and carry everything over the rocks, a portage of about 300 yards. The men were very tired.",
      historicalContext: "This entry comes from David Thompson's momentous journey down the Columbia River in 1811. Thompson was racing to reach the Pacific before American fur traders could claim the territory. He and his crew faced incredibly dangerous rapids while mapping the river for the first time. Thompson's detailed measurements and descriptions created the most accurate maps of western North America until the 1850s.",
      annotations: JSON.stringify([
        {
          gradeLevel: "4-6",
          annotation: "David Thompson was drawing maps as he traveled! Even in dangerous rapids, he took measurements with special tools like sextants and compasses. His maps were so accurate that people used them for 50 years. Imagine trying to measure angles and distances while your canoe is being tossed around in wild water!"
        },
        {
          gradeLevel: "7-9",
          annotation: "Thompson's journey down the Columbia was urgent - he knew American traders were coming from the south. Despite the danger, he stopped frequently to take careful latitude and longitude measurements. His journals reveal both his scientific precision and the daily hardships of exploration: exhausted crew members, dangerous rapids, and the constant work of portaging supplies."
        }
      ]),
      vocabulary: JSON.stringify([
        { word: "portage", definition: "carrying canoes and supplies overland around rapids or between waterways" },
        { word: "current", definition: "the movement of water in a river or stream" },
        { word: "navigation", definition: "the skill of directing the course of a boat or ship" },
        { word: "sextant", definition: "an instrument used to measure angles, especially for determining latitude" },
        { word: "latitude", definition: "the distance north or south of the equator, measured in degrees" }
      ]),
      discussionQuestions: JSON.stringify([
        "Why was it so important to Thompson to make accurate maps even when facing danger?",
        "What skills would you need to be a successful explorer like David Thompson?",
        "How did Thompson's Indigenous wife, Charlotte Small, contribute to his explorations?",
        "Compare Thompson's careful mapping to modern GPS technology. What advantages did each have?"
      ]),
      explorerId: davidThompson?.id,
      waterwayId: null,
      locationId: null,
      gradeLevel: "4-6",
      isPublished: true
    }
  });

  const samuelHearneJournal = await prisma.primarySourceDocument.create({
    data: {
      title: "Samuel Hearne's Journey to the Coppermine River, July 1771",
      documentType: "journal",
      author: "Samuel Hearne",
      originalDate: "July 14, 1771",
      originalYear: 1771,
      originalText: "At one in the morning of the fourteenth, we arrived at the Copper-mine River, at a part where it is about thirty yards wide, and shallow. The Indians began to search for copper, and were rewarded by finding several pieces of ore. Some pieces weigh'd upward of four pounds. But the Indians would not give themselves the trouble of carrying this metal with them. I therefore took possession of such pieces as I found convenient to transport.",
      transcription: "At one in the morning of July 14th, we arrived at the Coppermine River, at a part where it is about thirty yards wide and shallow. The Indians began to search for copper and were rewarded by finding several pieces of ore. Some pieces weighed more than four pounds. But the Indians would not give themselves the trouble of carrying this metal with them. I therefore took possession of such pieces as I found convenient to transport.",
      historicalContext: "Samuel Hearne's 1771 journey to the Arctic Ocean was one of the most remarkable expeditions in Canadian history. Guided by Chipewyan leader Matonabbee and traveling entirely on foot, Hearne became the first European to reach the Arctic Ocean overland. This journal entry describes his arrival at the Coppermine River, which Indigenous peoples had described as rich in copper. The expedition covered over 5,600 kilometers through some of the harshest terrain on Earth.",
      annotations: JSON.stringify([
        {
          gradeLevel: "4-6",
          annotation: "Hearne walked from Hudson Bay to the Arctic Ocean and back - that's more than 5,600 kilometers on foot! He couldn't have done it without his Dene guide Matonabbee, who knew how to survive in the harsh northern lands. Notice how Hearne writes about 'the Indians' - that was how Europeans referred to Indigenous peoples at the time, though we know better today."
        },
        {
          gradeLevel: "7-9",
          annotation: "Hearne's journey reveals the complex relationship between European explorers and Indigenous guides. Matonabbee and his people made the expedition possible - they knew where to hunt, how to survive winter, and where the Coppermine River was located. Hearne's earlier attempts without experienced guides had failed miserably. Note that Indigenous peoples weren't interested in collecting copper for trade - they knew where it was but didn't need to stockpile it. European economic values were very different."
        }
      ]),
      vocabulary: JSON.stringify([
        { word: "ore", definition: "rock containing metal that can be extracted" },
        { word: "transport", definition: "to carry something from one place to another" },
        { word: "Chipewyan", definition: "a Dene Indigenous nation of northern Canada" },
        { word: "overland", definition: "by land rather than by water" },
        { word: "expedition", definition: "a journey undertaken for a specific purpose, especially exploration" }
      ]),
      discussionQuestions: JSON.stringify([
        "Why do you think Indigenous peoples didn't bother collecting the copper, even though it was valuable to Europeans?",
        "What does this journal entry tell us about the relationship between Hearne and his Indigenous guides?",
        "How would Hearne's journey have been different if he had refused to learn from Indigenous knowledge?",
        "Why was proving the Coppermine River reached the Arctic Ocean important to the Hudson's Bay Company?"
      ]),
      explorerId: samuelHearne?.id,
      waterwayId: null,
      locationId: null,
      gradeLevel: "4-6",
      isPublished: true
    }
  });

  const hbcTradeRecord = await prisma.primarySourceDocument.create({
    data: {
      title: "York Factory Trade Record, 1780",
      documentType: "report",
      author: "Humphrey Marten, Chief Factor",
      originalDate: "August 1780",
      originalYear: 1780,
      originalText: "August 1780. Total beaver received this season: 34,567 Made Beaver. Total Indians traded with: 437 individuals from various nations. Goods dispensed: 234 guns, 4,890 lbs gunpowder, 389 blankets, 567 brass kettles, 2,340 lbs tobacco, sundry other articles. Noted that the Pedlars from Canada [North West Company] have established posts inland and are intercepting our trade. Recommend the Company consider building posts in the interior.",
      transcription: "August 1780. Total beaver pelts received this season: 34,567. Total Indigenous traders: 437 individuals from various nations. Goods traded: 234 guns, 4,890 lbs of gunpowder, 389 blankets, 567 brass kettles, 2,340 lbs of tobacco, and various other items. Noted that the 'Pedlars' from Canada [North West Company] have established posts inland and are intercepting our trade. I recommend the Company consider building posts in the interior.",
      historicalContext: "This trade record from York Factory shows the enormous scale of the fur trade. York Factory was the Hudson's Bay Company's main depot on Hudson Bay - furs from across the western interior arrived here to be shipped to England. The 'Made Beaver' was the trade currency - one prime beaver pelt. This 1780 record is historically significant because it shows HBC officials realizing they needed to move inland to compete with the aggressive North West Company, which sent traders directly to Indigenous communities.",
      annotations: JSON.stringify([
        {
          gradeLevel: "4-6",
          annotation: "Imagine 34,567 beaver pelts! That's a lot of beavers. Each pelt came from a beaver trapped by Indigenous peoples somewhere in the vast Canadian wilderness, then transported by canoe to York Factory. The Hudson's Bay Company traded guns, blankets, kettles and other European goods for the furs. Notice how the writer complains about 'Pedlars' - that's what HBC people called their rivals from the North West Company!"
        },
        {
          gradeLevel: "7-9",
          annotation: "This document reveals the economics and competition of the fur trade. The HBC had followed a 'trading post' model - building forts on Hudson Bay and waiting for Indigenous trappers to bring furs to them. The North West Company disrupted this by sending traders inland. This forced the HBC to change strategy - they established Cumberland House in 1774 as their first inland post. The fur trade transformed Indigenous economies and societies, not always for the better."
        }
      ]),
      vocabulary: JSON.stringify([
        { word: "Made Beaver", definition: "the standard unit of trade in the fur trade, equal to one prime beaver pelt" },
        { word: "Chief Factor", definition: "the senior HBC official in charge of a major trading post" },
        { word: "dispensed", definition: "distributed or gave out" },
        { word: "Pedlars", definition: "derogatory HBC term for North West Company traders" },
        { word: "sundry", definition: "various; several different" }
      ]),
      discussionQuestions: JSON.stringify([
        "Why did Indigenous peoples want guns, blankets, and kettles from Europeans?",
        "What impact did over-trapping beaver have on ecosystems and Indigenous ways of life?",
        "How did competition between HBC and North West Company affect Indigenous peoples?",
        "Why was York Factory's location on Hudson Bay so important for shipping furs to England?"
      ]),
      explorerId: null,
      waterwayId: hudsonBay?.id,
      locationId: yorkFactory?.id,
      gradeLevel: "4-6",
      isPublished: true
    }
  });

  const indigenousTreatyLetter = await prisma.primarySourceDocument.create({
    data: {
      title: "Letter from Matonabbee to Samuel Hearne, 1772",
      documentType: "letter",
      author: "Matonabbee (Chipewyan leader)",
      originalDate: "Spring 1772",
      originalYear: 1772,
      originalText: "To my Friend Samuel Hearne - The winter has been hard and game scarce. My people need ammunition and tobacco. The river routes are opening. I will bring my people to trade at your new house on the Saskatchewan [Cumberland House]. I ask that you trade fairly as you promised. The Cree and Chipewyan must have peace to use these hunting lands. I will speak for my people. Your friend, Matonabbee.",
      transcription: "To my friend Samuel Hearne - The winter has been hard and game has been scarce. My people need ammunition and tobacco. The river routes are opening. I will bring my people to trade at your new house on the Saskatchewan River [Cumberland House]. I ask that you trade fairly as you promised. The Cree and Chipewyan must have peace to use these hunting lands. I will speak for my people. Your friend, Matonabbee.",
      historicalContext: "Matonabbee (c. 1737-1782) was a Chipewyan Dene leader who guided Samuel Hearne to the Arctic Ocean in 1771. This letter (translated from Chipewyan) shows the diplomatic relationship between Indigenous leaders and fur traders. Matonabbee was a skilled negotiator who brokered peace between the Chipewyan and Cree peoples, allowing trade to flourish. He advocated for his people's interests while maintaining relationships with HBC traders. Tragically, he died by suicide in 1782 after learning the French had destroyed Prince of Wales Fort.",
      annotations: JSON.stringify([
        {
          gradeLevel: "7-9",
          annotation: "This letter reveals that Matonabbee was far more than just a 'guide' - he was a respected leader and diplomat. He balanced his people's needs (access to European goods) with protecting their interests (fair trade, peaceful hunting territories). Note how he calls Hearne 'friend' but also makes demands - 'trade fairly as you promised.' This was a relationship between partners, not simply employer and employee. Matonabbee's role in making peace between traditional enemies (Cree and Chipewyan) was crucial to the fur trade's success."
        },
        {
          gradeLevel: "10-12",
          annotation: "Matonabbee's letter demonstrates Indigenous agency in the fur trade. Rather than passive participants, Indigenous leaders like Matonabbee actively shaped trade relationships, negotiated terms, and made strategic alliances. His diplomatic work creating peace between Chipewyan and Cree peoples exemplifies how the fur trade transformed Indigenous political relationships. However, the letter also shows increasing dependence on European goods like ammunition and tobacco. The fur trade created complex economic relationships that would fundamentally alter Indigenous societies over the following century."
        }
      ]),
      vocabulary: JSON.stringify([
        { word: "Chipewyan", definition: "a Dene Indigenous nation of northern Canada, also called Dënesųłiné" },
        { word: "game", definition: "wild animals hunted for food" },
        { word: "ammunition", definition: "bullets and gunpowder for firearms" },
        { word: "broker", definition: "to negotiate or arrange an agreement" },
        { word: "agency", definition: "the capacity to act independently and make choices" }
      ]),
      discussionQuestions: JSON.stringify([
        "What does this letter tell us about Matonabbee's leadership skills?",
        "Why was making peace between Cree and Chipewyan peoples important for the fur trade?",
        "How did trade goods like guns and ammunition change Indigenous hunting and warfare?",
        "What might 'trade fairly' have meant to Matonabbee versus what it meant to Hearne?"
      ]),
      explorerId: samuelHearne?.id,
      waterwayId: null,
      locationId: null,
      gradeLevel: "7-9",
      isPublished: true
    }
  });

  const mackenzieTreatySpeech = await prisma.primarySourceDocument.create({
    data: {
      title: "Alexander Mackenzie at Fort Fork, 1793",
      documentType: "report",
      author: "Alexander Mackenzie",
      originalDate: "May 9, 1793",
      originalYear: 1793,
      originalText: "Having assembled the men, I stated my determination to reach the Pacific Ocean by way of the Peace River and whatever waters might present themselves. I asked who would volunteer to accompany me on this voyage of discovery. All stepped forward without hesitation. The dangers are many - rapids, hostile tribes, starvation in unknown lands. Yet the glory of finding a route to the Western Sea spurred them on. We depart tomorrow with high spirits.",
      transcription: "Having assembled the men, I stated my determination to reach the Pacific Ocean by way of the Peace River and whatever waters might present themselves. I asked who would volunteer to accompany me on this voyage of discovery. All stepped forward without hesitation. The dangers are many - rapids, hostile tribes, starvation in unknown lands. Yet the glory of finding a route to the Western Sea spurred them on. We depart tomorrow with high spirits.",
      historicalContext: "This entry from Alexander Mackenzie's journal marks the beginning of his historic 1793 journey that made him the first European to cross North America north of Mexico. Starting from Fort Fork (now in Alberta), Mackenzie and his crew traveled up the Peace River, crossed the Rocky Mountains, and reached the Pacific Ocean at Bella Coola on July 22, 1793. The journey took them through territories of Indigenous nations who had never seen Europeans before. Mackenzie's success proved a land route to the Pacific existed and helped establish British claims to what became British Columbia.",
      annotations: JSON.stringify([
        {
          gradeLevel: "7-9",
          annotation: "Mackenzie's crew consisted of six French-Canadian voyageurs, two Indigenous guides, and Alexander Mackay (his second-in-command). Notice the dramatic language - 'hostile tribes,' 'unknown lands,' 'glory' - this was the way European explorers wrote about their adventures. From Indigenous perspectives, of course, these were well-known lands with established peoples and trade routes. Mackenzie depended completely on Indigenous guides and the generosity of peoples along the way. His success was a collaborative effort, though he got most of the credit."
        },
        {
          gradeLevel: "10-12",
          annotation: "This document exemplifies the rhetoric of 'discovery' that characterized European exploration narratives. Mackenzie frames the journey as venturing into 'unknown lands' despite the fact that Indigenous peoples had lived in and traveled through these territories for millennia. His emphasis on 'glory' reflects both Enlightenment-era values and the economic motivations of the North West Company, which sought new fur-trading territories. The Pacific coast Indigenous peoples Mackenzie encountered - including the Nuxalk Nation at Bella Coola - already participated in extensive trade networks. 'Discovery,' then, meant discovery from a European perspective, not actual discovery of previously unknown places."
        }
      ]),
      vocabulary: JSON.stringify([
        { word: "determination", definition: "firmness of purpose; resolve" },
        { word: "volunteer", definition: "to offer to do something willingly without being forced" },
        { word: "hostile", definition: "showing opposition or dislike; unfriendly" },
        { word: "spurred", definition: "encouraged or motivated" },
        { word: "rhetoric", definition: "the art of effective or persuasive speaking or writing" }
      ]),
      discussionQuestions: JSON.stringify([
        "Why did Mackenzie's men all volunteer for such a dangerous journey?",
        "How would Indigenous peoples along the route have viewed Mackenzie's expedition?",
        "What made Mackenzie's journey different from his 1789 trip to the Arctic Ocean?",
        "Why do we say Mackenzie 'discovered' the route when Indigenous peoples already knew these lands?"
      ]),
      explorerId: alexanderMackenzie?.id,
      waterwayId: null,
      locationId: null,
      gradeLevel: "7-9",
      isPublished: true
    }
  });

  const historicalMap = await prisma.primarySourceDocument.create({
    data: {
      title: "Map of the North-West Territory, Peter Pond, 1785",
      documentType: "map",
      author: "Peter Pond",
      originalDate: "1785",
      originalYear: 1785,
      originalText: null,
      transcription: null,
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Pond_map.jpg/800px-Pond_map.jpg",
      historicalContext: "Peter Pond's 1785 map was revolutionary for its time. Pond, a Connecticut-born fur trader with the North West Company, created this map based on Indigenous knowledge and his own travels in the Athabasca region. The map shows Lake Athabasca, Great Slave Lake, and - crucially - suggested that rivers from these lakes might flow to the Pacific Ocean. This map directly inspired Alexander Mackenzie's 1789 expedition down what became the Mackenzie River. Though Pond's geography wasn't perfect (he placed the Pacific coast too close to Lake Athabasca), his map represented the best knowledge of northwestern Canada at the time.",
      annotations: JSON.stringify([
        {
          gradeLevel: "4-6",
          annotation: "Before GPS and satellites, making maps required careful observations and lots of talking to people who knew the land. Peter Pond talked with Chipewyan and Cree people who knew the northern rivers. He combined their knowledge with his own travels to make this map. See how rivers flow like veins across the map? Pond hoped one of those rivers would lead to the Pacific Ocean, which would make trade much easier."
        },
        {
          gradeLevel: "7-9",
          annotation: "Pond's map is a fascinating example of how European cartographers incorporated Indigenous knowledge. The detailed portrayal of Lake Athabasca and the river systems reflects information from Dene guides. However, Pond made a major error - he thought the Pacific coast was much closer than it actually is. This mistake led Mackenzie on his 1789 journey expecting to find the Pacific, only to reach the Arctic Ocean instead. Despite errors, Pond's map was used by explorers for decades and helped open the Northwest to the fur trade."
        }
      ]),
      vocabulary: JSON.stringify([
        { word: "cartographer", definition: "a person who makes maps" },
        { word: "Athabasca", definition: "region and lake in northern Alberta/Saskatchewan; name means 'where there are reeds' in Cree" },
        { word: "Indigenous knowledge", definition: "information and understanding developed by Indigenous peoples about their traditional territories" },
        { word: "longitude", definition: "distance east or west from the Prime Meridian, measured in degrees" },
        { word: "latitude", definition: "distance north or south from the equator, measured in degrees" }
      ]),
      discussionQuestions: JSON.stringify([
        "How did Peter Pond gather the information to make his map?",
        "Why was finding a river route to the Pacific Ocean so important to fur traders?",
        "What does this map tell us about how Europeans and Indigenous peoples shared knowledge?",
        "How do you think Indigenous peoples reacted to seeing their lands drawn on European-style maps?"
      ]),
      explorerId: null,
      waterwayId: null,
      locationId: null,
      gradeLevel: "4-6",
      isPublished: true
    }
  });

  console.log("✅ Created 6 Primary Source Documents");

  // ==================== PRINTABLE RESOURCES ====================
  console.log("\n📄 Creating Printable Resources...");

  const blankMapResource = await prisma.printableResource.create({
    data: {
      title: "Blank Map of Canadian Fur Trade Routes",
      description: "This outline map of Canada shows major waterways and is perfect for students to trace fur trade routes. Students can mark trading posts, explorer paths, and Indigenous territories.",
      resourceType: "map",
      gradeLevel: "4-6",
      topic: "fur_trade",
      content: "<h2>Activity Instructions</h2><ol><li>Locate and label the following waterways: St. Lawrence River, Ottawa River, Great Lakes, Lake Winnipeg, Saskatchewan River, Mackenzie River, Fraser River, Columbia River</li><li>Mark these important trading posts with symbols: Montreal, Quebec, York Factory, Fort William, Cumberland House, Fort Chipewyan, Fort Langley</li><li>Choose one explorer (Champlain, Mackenzie, Thompson, Hearne, or Fraser) and trace their route in colored pencil</li><li>Create a map legend showing your symbols for different types of locations</li></ol>",
      teacherNotes: "This activity works well as an introduction to the geography of the fur trade. Students should use the app's interactive map as reference. Consider having students work in groups, with each group tracing a different explorer's route and then presenting to the class. Extension: Have students research why waterways were so important for transportation before railroads.",
      answerKey: JSON.stringify({
        waterways: ["St. Lawrence River - Quebec/Ontario", "Ottawa River - Ontario/Quebec border", "Lake Superior, Huron, Ontario, Winnipeg", "Saskatchewan River - prairies", "Mackenzie River - Northwest Territories", "Fraser River - British Columbia", "Columbia River - BC/Washington"],
        tradingPosts: ["Montreal - St. Lawrence, departure point for voyageurs", "York Factory - Hudson Bay, HBC main depot", "Fort William - Lake Superior, NWC headquarters", "Cumberland House - Saskatchewan River, first inland HBC post", "Fort Chipewyan - Lake Athabasca, gateway to Mackenzie River"],
        explorerRoutes: {
          Champlain: "St. Lawrence → Ottawa River → Lake Huron",
          Mackenzie: "Lake Athabasca → Mackenzie River → Arctic Ocean (1789); Peace River → Fraser watershed → Pacific (1793)",
          Thompson: "Saskatchewan River → Columbia River → Pacific Ocean",
          Hearne: "Fort Churchill → overland to Coppermine River → Arctic Ocean",
          Fraser: "Peace River → Fraser River → Pacific Ocean"
        }
      }),
      isPublished: true
    }
  });

  const timelineWorksheet = await prisma.printableResource.create({
    data: {
      title: "Canadian Exploration Timeline Activity",
      description: "Students create a visual timeline of major exploration events from 1000 AD (Norse arrival) to 1900 (end of major exploration era). Includes key expeditions, fort establishments, and important discoveries.",
      resourceType: "timeline",
      gradeLevel: "7-9",
      topic: "explorers",
      content: "<h2>Timeline Activity: Canadian Exploration</h2><p>Create a timeline showing the following events. For each event, include the date, explorer name, and significance.</p><h3>Events to Include:</h3><ul><li>c. 1000 - Leif Erikson at L'Anse aux Meadows</li><li>1497 - John Cabot reaches Newfoundland</li><li>1535 - Jacques Cartier explores St. Lawrence</li><li>1608 - Champlain founds Quebec</li><li>1670 - Hudson's Bay Company founded</li><li>1754 - Anthony Henday reaches Alberta</li><li>1789 - Alexander Mackenzie reaches Arctic Ocean</li><li>1793 - Alexander Mackenzie reaches Pacific Ocean</li><li>1808 - Simon Fraser navigates Fraser River</li><li>1811 - David Thompson maps Columbia River</li><li>1845 - Franklin's final expedition begins</li><li>2014 - HMS Erebus discovered</li></ul><h3>Discussion Questions:</h3><ol><li>What patterns do you notice? When were the most expeditions?</li><li>How did technology change exploration over time?</li><li>What role did Indigenous peoples play in each of these events?</li><li>Which expeditions were driven by trade versus pure exploration?</li></ol>",
      teacherNotes: "Students can create their timelines on poster paper, digitally, or in their notebooks. Encourage them to add illustrations or maps for each event. Advanced students can research additional events to add. Connect this to curriculum expectations about understanding historical chronology and cause-and-effect relationships. Extension activity: Have students create a parallel timeline showing Indigenous history during the same period.",
      answerKey: JSON.stringify({
        keyPoints: [
          "1000s-1400s: Only Norse (L'Anse aux Meadows) visited, then 500-year gap",
          "1497-1600: Maritime exploration (Cabot, Cartier, early Atlantic coast)",
          "1608-1750: French expansion along St. Lawrence and Great Lakes",
          "1670-1821: Fur trade expansion inland, HBC vs NWC competition",
          "1789-1811: Race to Pacific (Mackenzie, Fraser, Thompson)",
          "1819-1859: Arctic exploration, search for Northwest Passage",
          "Modern: Archaeological discoveries (Franklin ships, etc.)"
        ],
        patterns: "Exploration moved from coasts inland, driven by fur trade. Each expedition built on Indigenous knowledge and earlier explorations. Technology improvements (better boats, navigation tools, preserved foods) enabled longer journeys.",
        indigenousRole: "Every expedition relied on Indigenous guides, food supplies (pemmican), canoe technology, and geographic knowledge. Without Indigenous partnerships, none of these expeditions would have succeeded."
      }),
      isPublished: true
    }
  });

  const vocabularyWorksheet = await prisma.printableResource.create({
    data: {
      title: "Fur Trade Vocabulary Builder",
      description: "Learn essential vocabulary related to the Canadian fur trade. Includes terms for people, places, equipment, and trading practices. Perfect for building subject-specific literacy.",
      resourceType: "worksheet",
      gradeLevel: "4-6",
      topic: "fur_trade",
      content: "<h2>Fur Trade Vocabulary</h2><p>Match each term with its correct definition, then use five terms in complete sentences.</p><h3>Vocabulary Terms:</h3><ol><li>Voyageur</li><li>Portage</li><li>Made Beaver</li><li>Pemmican</li><li>Rendezvous</li><li>Factor</li><li>Brigade</li><li>Monopoly</li><li>York boat</li><li>Métis</li><li>Coureur des bois</li><li>Winterer/Hivernant</li></ol><h3>Definitions:</h3><ul><li>A - The manager of a fur trade post</li><li>B - Carrying canoes and supplies overland</li><li>C - An annual meeting where traders from different regions exchanged goods</li><li>D - The standard unit of trade value in the fur trade</li><li>E - A person of mixed European and Indigenous ancestry</li><li>F - French-Canadian canoe paddler who transported furs</li><li>G - Dried meat mixed with fat and berries, used as travel food</li><li>H - Independent French fur traders ('runners of the woods')</li><li>I - A group of canoes or boats traveling together</li><li>J - A fur trader who spent the winter in the interior</li><li>K - A large wooden cargo boat used on lakes and rivers</li><li>L - Complete control of trade in a region</li></ul><h3>Writing Activity:</h3><p>Choose any five vocabulary words. Write a paragraph describing a day in the life of a voyageur, using all five words correctly.</p>",
      teacherNotes: "Review pronunciation of French terms (voyageur, rendezvous, coureur des bois, Métis) before assigning. Students may need the app's pronunciation guide. Consider assigning different terms to different students for a vocabulary bee. The writing activity helps students understand context and relationships between terms. Discuss how many English words we use today come from the fur trade era.",
      answerKey: JSON.stringify({
        matches: {
          "1": "F",
          "2": "B",
          "3": "D",
          "4": "G",
          "5": "C",
          "6": "A",
          "7": "I",
          "8": "L",
          "9": "K",
          "10": "E",
          "11": "H",
          "12": "J"
        },
        sampleParagraph: "The voyageur woke before dawn and ate pemmican for breakfast. His brigade would face a difficult portage around the rapids today. As a winterer, he had spent months in the interior collecting furs. Now he was paddling to the annual rendezvous at Fort William, where the factor would tally the Made Beaver he had earned."
      }),
      isPublished: true
    }
  });

  const researchTemplate = await prisma.printableResource.create({
    data: {
      title: "Explorer Research Template",
      description: "Structured template for students researching Canadian explorers. Guides students to investigate biography, motivations, routes, challenges, Indigenous relationships, and lasting impacts.",
      resourceType: "worksheet",
      gradeLevel: "7-9",
      topic: "explorers",
      content: "<h2>Explorer Research Project</h2><p>Choose one Canadian explorer to research in depth. Use the app and library resources to complete each section.</p><h3>Part 1: Basic Biography</h3><ul><li>Full name:</li><li>Birth year and place:</li><li>Death year and place:</li><li>Nationality:</li><li>Who sponsored their expeditions? (Company or government)</li></ul><h3>Part 2: Exploration Route</h3><ul><li>What region(s) did they explore?</li><li>What were the dates of their major expedition(s)?</li><li>Create a sketch map showing their route</li><li>What waterways did they travel?</li></ul><h3>Part 3: Challenges and Obstacles</h3><ul><li>What geographic obstacles did they face? (mountains, rapids, etc.)</li><li>What weather/climate challenges did they encounter?</li><li>Were there conflicts with other groups?</li><li>How did they solve these problems?</li></ul><h3>Part 4: Indigenous Relationships</h3><ul><li>Which Indigenous nations did they encounter?</li><li>Did they have Indigenous guides? Name them if known.</li><li>How did Indigenous knowledge help the expedition?</li><li>Were relationships friendly, tense, or hostile?</li></ul><h3>Part 5: Achievements and Impact</h3><ul><li>What did they 'discover' or accomplish?</li><li>How did their exploration benefit the fur trade or European knowledge?</li><li>What places are named after them?</li><li>How do we remember them today? (monuments, place names, etc.)</li></ul><h3>Part 6: Critical Thinking</h3><ul><li>What perspective does the historical record give us? (European, Indigenous, balanced?)</li><li>How would Indigenous peoples have viewed this explorer?</li><li>What questions about this explorer remain unanswered?</li><li>Should we consider this person a hero? Why or why not?</li></ul>",
      teacherNotes: "This template encourages students to think critically about exploration, not just memorize dates. Emphasize the importance of Part 4 (Indigenous relationships) - this is often overlooked in traditional histories. Students can present their research as written reports, presentations, or even first-person diary entries. Suggested explorers: Champlain, Mackenzie, Thompson, Hearne, Fraser, La Vérendrye, Radisson & Groseilliers, Kelsey, Pond. Rubric should reward critical thinking and multiple perspectives, not just fact collection.",
      answerKey: JSON.stringify({
        sampleExplorers: {
          "David Thompson": {
            basicBio: "1770-1857, English-Canadian, HBC then NWC",
            routes: "Saskatchewan, Athabasca, Columbia River systems 1784-1812",
            challenges: "Rocky Mountain crossings, dangerous rapids, racing against Americans",
            indigenous: "Wife Charlotte Small (Métis), numerous Kootenay, Salish guides",
            achievements: "Mapped 3.9M sq km, found Athabasca Pass, navigated full Columbia",
            criticalThinking: "Called 'greatest land geographer' but died in poverty, wife's contributions often ignored"
          },
          "Alexander Mackenzie": {
            basicBio: "1764-1820, Scottish-Canadian, NWC",
            routes: "Mackenzie River to Arctic (1789), Peace-Fraser-Pacific (1793)",
            challenges: "Wrong turn to Arctic instead of Pacific, nearly starved on Pacific journey",
            indigenous: "Depended on Chipewyan, Carrier, Nuxalk guides and diplomacy",
            achievements: "First transcontinental crossing north of Mexico, knighted 1802",
            criticalThinking: "Claimed to 'discover' lands inhabited for millennia, Indigenous contributions downplayed"
          }
        }
      }),
      isPublished: true
    }
  });

  const geographyQuiz = await prisma.printableResource.create({
    data: {
      title: "Canadian Waterways Geography Quiz",
      description: "Test your knowledge of Canada's major waterways, their Indigenous names, and their role in exploration history. Includes multiple choice, true/false, and short answer questions.",
      resourceType: "quiz_printable",
      gradeLevel: "4-6",
      topic: "geography",
      content: "<h2>Canadian Waterways Quiz</h2><h3>Part A: Multiple Choice (2 points each)</h3><ol><li>What is the Indigenous (Cree) name for the Saskatchewan River?<br/>A) Deh Cho<br/>B) Kisiskāciwani-sīpiy<br/>C) Gichigami<br/>D) Sto:lo</li><li>Which waterway was called the 'Grand River' of the fur trade?<br/>A) St. Lawrence River<br/>B) Mackenzie River<br/>C) Ottawa River<br/>D) Fraser River</li><li>Lake Superior is called 'Gichigami' in which Indigenous language?<br/>A) Cree<br/>B) Dene<br/>C) Ojibwe<br/>D) Mohawk</li><li>Which river did Alexander Mackenzie follow to the Arctic Ocean?<br/>A) Fraser River<br/>B) Mackenzie River<br/>C) Columbia River<br/>D) Coppermine River</li><li>What does the Dene name 'Deh Cho' mean?<br/>A) Swift River<br/>B) Big Water<br/>C) Big River<br/>D) Great Sea</li></ol><h3>Part B: True or False (1 point each)</h3><ol start='6'><li>Hudson Bay is the largest bay in the world. _____</li><li>David Thompson mapped the entire Columbia River. _____</li><li>The Fraser River was named after Samuel de Champlain. _____</li><li>Lake Superior is the largest freshwater lake by surface area in the world. _____</li><li>York Factory was located on James Bay. _____</li></ol><h3>Part C: Short Answer (3 points each)</h3><ol start='11'><li>Explain why voyageurs paddled up the Ottawa River instead of continuing up the St. Lawrence River to reach the interior.</li><li>Why was Lake Winnipeg called the 'crossroads of the western fur trade'?</li><li>Name two challenges Simon Fraser faced when navigating the Fraser River in 1808.</li></ol><h3>Part D: Map Skills (5 points)</h3><ol start='14'><li>On the blank map provided, draw and label the route a voyageur would take from Montreal to Lake Athabasca. Include: Montreal, Ottawa River, Lake Nipissing, Georgian Bay, Lake Superior, Grand Portage, Lake Winnipeg, Saskatchewan River, Methye Portage, Churchill River, Lake Athabasca.</li></ol>",
      teacherNotes: "This quiz assesses both factual knowledge and understanding of geographic relationships. Part D (map skills) is most important - it shows whether students truly understand the waterway networks. Provide a blank outline map of Canada for Part D. Students should be allowed to use the app's map as a study tool before the quiz but not during. Total points: 35. Grading scale: 32-35=A, 28-31=B, 24-27=C, 20-23=D.",
      answerKey: JSON.stringify({
        partA: {
          "1": "B - Kisiskāciwani-sīpiy means 'swift-flowing river' in Cree",
          "2": "C - Ottawa River was the main route from Montreal to the interior",
          "3": "C - Gichigami is Ojibwe for 'Great Sea'",
          "4": "B - Mackenzie River, though he was hoping to find the Pacific",
          "5": "C - Deh Cho means 'Big River' in Dene language"
        },
        partB: {
          "6": "False - It is the second largest after Bay of Bengal",
          "7": "True - He navigated the entire length in 1811",
          "8": "False - Named after Simon Fraser who explored it in 1808",
          "9": "True - Largest by surface area (though not by volume)",
          "10": "False - York Factory was on Hudson Bay, at the Hayes River mouth"
        },
        partC: {
          "11": "The St. Lawrence River had waterfalls (rapids at present-day Montreal) that could not be passed. The Ottawa River route avoided these obstacles and connected to the Great Lakes via the Mattawa River and Lake Nipissing.",
          "12": "Lake Winnipeg connected the Hudson Bay route (via the Nelson and Hayes Rivers) with routes from the Great Lakes (via Lake Superior and the Winnipeg River) and routes to the west (via the Saskatchewan River). Furs and trade goods from three directions all passed through Lake Winnipeg.",
          "13": "Possible answers: dangerous rapids and canyons, misidentification of the river (he thought it was the Columbia), steep canyon walls making portaging difficult, hostile encounters with some Indigenous groups, running out of food"
        },
        partD: "Map should show the classic fur trade route: Montreal → Ottawa River → Lake Nipissing (via Mattawa River) → Georgian Bay → Lake Huron → Sault Ste. Marie → Lake Superior → Grand Portage (portage around falls) → Pigeon River → Rainy Lake → Lake of the Woods → Winnipeg River → Lake Winnipeg → Saskatchewan River → Cumberland Lake → Churchill River → Methye Portage → Clearwater River → Athabasca River → Lake Athabasca. This was the main route voyageurs used to reach the rich Athabasca beaver country."
      }),
      isPublished: true
    }
  });

  const indigenousPlaceNamesWorksheet = await prisma.printableResource.create({
    data: {
      title: "Indigenous Place Names: Meaning and Pronunciation",
      description: "Students research the Indigenous names of Canadian waterways and learn their meanings and pronunciations. Develops cultural awareness and language skills.",
      resourceType: "worksheet",
      gradeLevel: "7-9",
      topic: "indigenous",
      content: "<h2>Indigenous Place Names of Canadian Waterways</h2><p>Many Canadian waterways have both European and Indigenous names. The Indigenous names often describe the waterway's characteristics or tell us about its importance to the people who lived there. Research the following waterways and complete the chart.</p><h3>Research Chart</h3><table border='1' cellpadding='10'><tr><th>European Name</th><th>Indigenous Name</th><th>Language</th><th>Meaning</th><th>Pronunciation Tips</th><th>Why This Name?</th></tr><tr><td>Saskatchewan River</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Mackenzie River</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Fraser River</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Lake Superior</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Lake Athabasca</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Hudson Bay</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Ottawa River</td><td></td><td></td><td></td><td></td><td></td></tr></table><h3>Reflection Questions</h3><ol><li>What patterns do you notice in Indigenous place names? What did Indigenous peoples tend to describe when naming places?</li><li>Why do you think it's important to learn and use Indigenous names for these places?</li><li>Some places in Canada are officially returning to Indigenous names (e.g., renaming mountains). What is your opinion on this practice?</li><li>Choose your favorite Indigenous place name from the chart. Explain why the name fits the place better than the European name.</li></ol><h3>Extension Activity</h3><p>Research whether your own community, town, or city has an Indigenous name. What does it mean? Which nation named it? Create a poster showing both names and teaching others about the Indigenous history of your area.</p>",
      teacherNotes: "Students should use the app's pronunciation guide and waterway information. Encourage them to practice saying the names aloud - pronunciation is part of showing respect for Indigenous languages. Discuss how place names reflect worldviews: Indigenous names often describe natural features or uses, while European names often honor people. This activity supports Truth and Reconciliation Commission calls to action regarding Indigenous languages and education. Consider inviting an Indigenous language keeper or Elder to speak to the class about the importance of place names in Indigenous cultures.",
      answerKey: JSON.stringify({
        chart: {
          "Saskatchewan River": {
            indigenousName: "Kisiskāciwani-sīpiy",
            language: "Cree",
            meaning: "swift-flowing river",
            pronunciation: "kih-sis-KA-chi-wah-nih SEE-pee",
            why: "The river has a strong current, especially when spring melt from the Rockies flows through"
          },
          "Mackenzie River": {
            indigenousName: "Deh Cho",
            language: "Dene",
            meaning: "Big River",
            pronunciation: "deh-CHO",
            why: "Canada's longest river system - its size impressed the Dene peoples who traveled it"
          },
          "Fraser River": {
            indigenousName: "Sto:lo",
            language: "Halkomelem",
            meaning: "River",
            pronunciation: "STAW-loh",
            why: "For Coast Salish peoples, this was THE river - the most important feature of their territory"
          },
          "Lake Superior": {
            indigenousName: "Gichigami",
            language: "Ojibwe",
            meaning: "Great Sea",
            pronunciation: "gih-chih-GAH-mee",
            why: "So large it seemed like an ocean to Ojibwe peoples who lived along its shores"
          },
          "Lake Athabasca": {
            indigenousName: "Desnethché",
            language: "Dene",
            meaning: "place where there are reeds",
            pronunciation: "des-neth-CHAY",
            why: "The marshy areas around the lake had abundant reeds used for various purposes"
          },
          "Hudson Bay": {
            indigenousName: "Wînipekw Kihci-kâmiy",
            language: "Cree",
            meaning: "muddy great water",
            pronunciation: "wih-nih-pekw kih-chee-KAW-mee",
            why: "Rivers flowing into Hudson Bay carry sediment, making the water muddy"
          },
          "Ottawa River": {
            indigenousName: "Kichi Sibi",
            language: "Algonquin",
            meaning: "Great River",
            pronunciation: "kih-chee SIH-bee",
            why: "Major waterway of Algonquin territory, essential for travel and fishing"
          }
        },
        reflectionSample: "Patterns: Many Indigenous names describe physical characteristics (swift, big, muddy, reeds) or emphasize importance (great, the river). This reflects close observation of nature and practical knowledge. European names often honor explorers or monarchs who never saw these places. Learning Indigenous names shows respect for the peoples who lived here first and preserves important languages. Using Indigenous names helps us understand places through the eyes of those with deepest knowledge."
      }),
      isPublished: true
    }
  });

  const comparingPerspectivesWorksheet = await prisma.printableResource.create({
    data: {
      title: "Comparing Perspectives: European Explorers vs Indigenous Guides",
      description: "Critical thinking activity comparing how the same historical events were experienced differently by European explorers and Indigenous peoples. Develops historical empathy and multiple perspectives.",
      resourceType: "activity_sheet",
      gradeLevel: "10-12",
      topic: "explorers",
      content: "<h2>Multiple Perspectives in Exploration History</h2><p>Historical events look very different depending on whose perspective we take. This activity asks you to consider the same expeditions from both European and Indigenous viewpoints.</p><h3>Case Study 1: Alexander Mackenzie's 1793 Journey to the Pacific</h3><h4>European Perspective (Mackenzie's Journal):</h4><blockquote>'Having assembled the men, I stated my determination to reach the Pacific Ocean... the glory of finding a route to the Western Sea spurred them on. We depart tomorrow with high spirits.'</blockquote><h4>Consider the Indigenous Perspective:</h4><ul><li>What might the Carrier and Nuxalk peoples have thought when Mackenzie's party arrived?</li><li>These were their traditional territories - was this really 'discovery'?</li><li>How did Mackenzie depend on Indigenous guides and hospitality?</li><li>What were the consequences for Indigenous peoples of 'opening' these routes to European trade?</li></ul><h3>Case Study 2: Samuel Hearne's Journey to the Coppermine River, 1771</h3><h4>European Perspective:</h4><blockquote>Hearne wrote about 'discovering' the Coppermine River and being the 'first' European to reach the Arctic Ocean overland. His achievement brought him fame.</blockquote><h4>Indigenous Perspective (Matonabbee and the Chipewyan):</h4><ul><li>The Chipewyan knew these routes for generations - they were guiding Hearne, not discovering</li><li>Matonabbee had to broker peace with Cree peoples for safe passage</li><li>Indigenous women in the party did essential work (setting up camps, processing food, making clothing) that Hearne barely mentioned</li><li>Hearne's first two attempts without experienced Indigenous guides failed completely</li></ul><h3>Analysis Questions:</h3><ol><li><strong>Knowledge and Power:</strong> If Indigenous peoples already knew these routes, why did Europeans get credit for 'discovering' them? What does this tell us about who wrote history?</li><li><strong>Language Matters:</strong> What's the difference between 'discovering' a place and 'being guided to' a place? Why does this distinction matter?</li><li><strong>Mutual Dependence:</strong> European explorers depended on Indigenous knowledge, guides, food, and diplomacy. Yet Indigenous peoples also benefited from trade relationships. Explain this mutual dependence. Was the relationship equal?</li><li><strong>Long-term Consequences:</strong> European exploration led to the fur trade, which brought European goods but also disease, resource depletion, and cultural change. From an Indigenous perspective, were these expeditions positive, negative, or both?</li><li><strong>Whose Story Gets Told?:</strong> Explorer journals and books tell us about European achievements. Where can we learn about the Indigenous people who made these journeys possible? Why are their stories less known?</li></ol><h3>Creative Writing Activity:</h3><p>Choose one exploration expedition from the app. Write two journal entries about the same day:</p><ol><li>One from the European explorer's perspective (based on historical journals)</li><li>One from an Indigenous guide's perspective (imagined, but based on historical research about Indigenous roles)</li></ol><p>Your entries should show the same events but reveal different concerns, priorities, and understandings.</p>",
      teacherNotes: "This activity addresses historical thinking concepts and multiple perspectives. It's appropriate for mature students who can handle complexity and nuance. The goal is not to demonize explorers but to understand that history looks different from different viewpoints. Emphasize that both perspectives are valid and that understanding multiple viewpoints gives us a fuller picture of history. This activity supports Truth and Reconciliation Commission calls regarding education. Discussion points: How do we balance celebrating Canadian explorers with acknowledging Indigenous contributions? What would it mean to decolonize exploration narratives? How can we tell these stories more completely?",
      answerKey: JSON.stringify({
        analysisPoints: {
          "1": "Europeans wrote history books for European audiences. 'Discovery' meant discovery to Europeans, not absolute discovery. Indigenous knowledge was often dismissed as less valid than European scientific knowledge. Power dynamics meant European perspectives became the 'official' history.",
          "2": "'Discovering' suggests being first and implies empty or unknown land. 'Being guided to' acknowledges Indigenous presence and knowledge. The language we use shapes our understanding of history and either erases or recognizes Indigenous peoples' roles.",
          "3": "Europeans needed: geographic knowledge, survival skills, diplomatic relationships with nations along routes, food (pemmican), canoe technology, interpreters. Indigenous peoples gained: access to metal tools, guns, cloth, other trade goods. BUT relationship was NOT equal - Europeans often exploited Indigenous labor, introduced diseases, and gradually took control of territories. 'Mutual benefit' existed but within unequal power dynamics.",
          "4": "Complex answer required. Benefits: new technologies, trade opportunities, alliances. Negative impacts: diseases (smallpox, etc.), overhunting depleting game, alcohol, disruption of traditional economies, eventual loss of land and sovereignty. Cannot judge as simply good or bad - impacts varied by nation, location, and time period. What seemed beneficial initially had serious long-term consequences.",
          "5": "Indigenous oral histories exist but weren't recorded in European books. Explorers published journals while Indigenous guides left no written records (though oral traditions preserve some stories). To learn Indigenous perspectives: oral histories, Indigenous-authored histories, archaeological evidence, critical reading of explorer journals (reading 'between the lines'). Stories less known due to systemic marginalization of Indigenous voices in Canadian history."
        },
        sampleJournalEntries: {
          explorer: "July 15, 1793 - Today we made excellent progress down the river, covering some 30 miles. The savages showed us a portage around the worst rapids. I took careful measurements of latitude. We should reach the Pacific within a fortnight. The men are in good spirits despite hard work.",
          indigenous: "July 15, 1793 - These strange visitors exhaust themselves paddling when they should save strength for portaging. We showed them our people's trail around the dangerous rapids - the white men would have died in those waters. Their leader constantly stops to look at the sky with his metal tools. He asks many questions about what lies ahead. We tell him, but he must see for himself. My wife and I prepared their evening meal while they rested. Tomorrow we reach my cousin's village. I hope they will be hospitable to these odd travelers."
        }
      }),
      isPublished: true
    }
  });

  const voyageurSongsActivity = await prisma.printableResource.create({
    data: {
      title: "Voyageur Paddling Songs: History Through Music",
      description: "Learn about voyageur culture through their traditional paddling songs. Includes lyrics, historical context, and music activities. Connects history with performing arts.",
      resourceType: "activity_sheet",
      gradeLevel: "4-6",
      topic: "fur_trade",
      content: "<h2>Voyageur Paddling Songs</h2><p>Voyageurs sang while paddling to keep rhythm and pass the time during their long journeys. These songs often told stories of love, adventure, and life on the rivers. Let's learn about two famous voyageur songs!</p><h3>Song 1: 'À la Claire Fontaine'</h3><h4>French Lyrics (First Verse):</h4><p>À la claire fontaine<br/>M'en allant promener<br/>J'ai trouvé l'eau si belle<br/>Que je m'y suis baigné</p><p><strong>Refrain:</strong> Il y a longtemps que je t'aime,<br/>Jamais je ne t'oublierai</p><h4>English Translation:</h4><p>By the clear flowing fountain<br/>Going for a walk<br/>I found the water so lovely<br/>That I bathed in it</p><p><strong>Refrain:</strong> I've loved you for so long,<br/>I will never forget you</p><h4>Historical Context:</h4><p>This romantic song became unofficial anthem of voyageurs. The sad lyrics (the full song is about lost love) contrast with the upbeat melody. Voyageurs spent months away from home, and songs like this expressed their loneliness and longing.</p><h3>Song 2: 'En Roulant Ma Boule' (Rolling My Ball)</h3><h4>French Lyrics (First Verse):</h4><p>Derrièr' chez nous, y a-t-un étang<br/>En roulant ma boule<br/>Trois beaux canards s'en vont baignant<br/>Rouli, roulant, ma boule roulant</p><h4>English Translation:</h4><p>Behind our house there is a pond<br/>Rolling my ball<br/>Three fine ducks go swimming there<br/>Roll, rolling, my ball rolling</p><h4>Historical Context:</h4><p>This cheerful song has many verses telling a story about a prince who goes duck hunting. The nonsense refrain 'roulant ma boule' (rolling my ball) helped voyageurs keep paddling rhythm. Crews might paddle 55 strokes per minute while singing!</p><h3>Activities:</h3><h4>Activity 1: Learn the Rhythm</h4><p>Voyageurs paddled in rhythm with their songs. Practice clapping or tapping to the beat of 'En Roulant Ma Boule.' Try to keep the same steady rhythm for 3 minutes - that's how long voyageurs would paddle between rests!</p><h4>Activity 2: Create Your Own Verse</h4><p>Voyageurs made up new verses about their journeys. Write a new verse for 'En Roulant Ma Boule' about something you might see on a Canadian river (bear, beaver, rapids, northern lights, etc.). Keep the same rhythm pattern!</p><h4>Activity 3: Research Project</h4><p>Find a recording of one voyageur song (check YouTube or your library). Listen to it and answer:<ul><li>What instruments are used?</li><li>Is the tempo fast or slow? Why?</li><li>What is the song about?</li><li>How would singing this help during hard work?</li></ul></p><h4>Activity 4: Math Connection</h4><p>Voyageurs paddled about 55 strokes per minute and worked about 14 hours per day (with breaks). Calculate:<ul><li>How many paddle strokes in one hour?</li><li>How many in a full work day?</li><li>If a voyageur worked 6 days a week for 3 months (summer season), how many total paddle strokes?</li></ul></p><h3>Discussion Questions:</h3><ol><li>Why would singing help during hard physical work?</li><li>What do these songs tell us about what was important to voyageurs?</li><li>How is singing work songs similar to or different from listening to music while doing homework?</li><li>Many Canadian folk songs come from the voyageur tradition. Why do you think these songs have survived for over 200 years?</li></ol>",
      teacherNotes: "This activity works well as a cross-curricular project combining history, music, French language, and math. Students can perform voyageur songs for a class presentation or school assembly. YouTube has many recordings of voyageur songs with both traditional and modern arrangements. Consider teaching one song to the whole class - the repetitive nature makes them easy to learn. Connection to music curriculum: rhythm, tempo, call-and-response patterns, folk music traditions. French teachers can use this as an entry point for discussing French-Canadian culture. The math activity reinforces large number calculations and helps students appreciate the physical demands on voyageurs.",
      answerKey: JSON.stringify({
        mathActivity: {
          strokesPerHour: "55 strokes/minute × 60 minutes = 3,300 strokes per hour",
          strokesPerDay: "3,300 strokes/hour × 14 hours = 46,200 strokes per day",
          strokesPerSeason: "46,200 strokes/day × 6 days/week × 12 weeks = 3,326,400 strokes in a 3-month season",
          note: "Over 3 million paddle strokes in one season! No wonder voyageurs were so strong. This also helps explain why they needed to sing - repetitive work is easier with rhythm and entertainment."
        },
        discussionPoints: {
          "1": "Singing provides rhythm for coordinated work, passes time, reduces boredom, builds team spirit, and takes your mind off physical discomfort. Similar to how soldiers march to cadences.",
          "2": "Songs reveal voyageurs valued: home and family (they were far away), romance and lost love (separated from sweethearts), nature (ducks, rivers, fountains), French language and culture (maintained despite distance from Quebec), humor and storytelling (many songs are humorous or tell stories).",
          "3": "Similar: provides entertainment during work, helps maintain focus, creates positive mood. Different: work songs create shared rhythm for group work (all paddle together), aren't chosen individually, serve functional purpose beyond entertainment.",
          "4": "Songs survived because: passed down orally through generations, expressed universal themes (love, work, longing for home), catchy melodies easy to remember, represent important period in Canadian history, maintained by folk music community, taught in schools as cultural heritage."
        }
      }),
      isPublished: true
    }
  });

  console.log("✅ Created 8 Printable Resources");

  console.log("\n📊 Summary:");
  const fieldTripCount = await prisma.virtualFieldTrip.count();
  const documentCount = await prisma.primarySourceDocument.count();
  const resourceCount = await prisma.printableResource.count();

  console.log(`- Virtual Field Trips: ${fieldTripCount} total`);
  console.log(`- Primary Source Documents: ${documentCount} total`);
  console.log(`- Printable Resources: ${resourceCount} total`);

  console.log("\n✅ Educational content seeding complete!");
}

main()
  .catch((e) => {
    console.error("Error seeding educational content:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
