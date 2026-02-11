import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Voyageur Journey Simulator data...");

  // ==================== JOURNEY 1: The Grand Portage Route ====================
  // Grade 4-6, follows the historic voyageur route from Montreal to Fort William

  const grandPortageJourney = await prisma.voyageurJourney.create({
    data: {
      title: "The Grand Portage Route",
      description:
        "Experience life as a voyageur in 1790! You are part of a brigade of French-Canadian voyageurs paddling the famous Grand Portage route from Montreal to Fort William. Navigate rapids, trade with Indigenous peoples, and sing traditional songs to keep your spirits high on this epic journey through the Canadian wilderness.",
      gradeLevel: "4-6",
      difficulty: "medium",
      estimatedMinutes: 25,
      startingLocation: "Lachine, near Montreal",
      endingLocation: "Fort William (Thunder Bay)",
      historicalYear: 1790,
      isPublished: true,
    },
  });

  // Node IDs for reference
  const gpNodeIds = {
    start: "gp-node-start",
    riverFork: "gp-node-fork",
    stormChoice: "gp-node-storm",
    tradingPost: "gp-node-trade",
    portageChoice: "gp-node-portage",
    songTime: "gp-node-song",
    rapidsFork: "gp-node-rapids",
    finalStretch: "gp-node-final",
    endingSuccess: "gp-node-end-success",
    endingPartial: "gp-node-end-partial",
    endingRetry: "gp-node-end-retry",
  };

  // Create all nodes for Grand Portage Journey
  await prisma.journeyNode.createMany({
    data: [
      // START NODE
      {
        id: gpNodeIds.start,
        journeyId: grandPortageJourney.id,
        nodeType: "story",
        orderIndex: 0,
        title: "The Journey Begins",
        narrative: `It is a cool spring morning in May 1790 at Lachine, just west of Montreal. You are Jacques, a young voyageur about to embark on your first journey to the pays d'en haut (the upper country).

Your canoe - a magnificent birch bark canot du maitre - is loaded with trade goods: blankets, kettles, guns, and beads. Alongside you are 11 other paddlers, all experienced voyageurs who will become your family for the next three months.

The brigade guide, Pierre, calls out: "En avant, mes amis!" (Forward, my friends!)

As you push off from shore, the other voyageurs begin to sing. The paddles dip in rhythm with the song, and your adventure begins.`,
        imageUrl: null,
        latitude: 45.4281,
        longitude: -73.6844,
        locationName: "Lachine, Quebec",
        choices: JSON.stringify([
          {
            id: "start-paddle",
            text: "Join in the singing and paddle with all your might!",
            nextNodeId: gpNodeIds.riverFork,
            consequence: "Your enthusiasm impresses the veterans",
            pointsChange: 5,
          },
        ]),
        historicalFact:
          "Voyageurs paddled up to 16 hours a day, covering 50-80 kilometers. They would take a 5-minute break every hour, called a 'pipe' because they would smoke their pipes during the rest.",
        isEnding: false,
      },

      // RIVER FORK NODE
      {
        id: gpNodeIds.riverFork,
        journeyId: grandPortageJourney.id,
        nodeType: "choice",
        orderIndex: 1,
        title: "The Ottawa River Fork",
        narrative: `After several days of paddling up the St. Lawrence, you reach the mouth of the Ottawa River. The brigade has made good time, but now Pierre faces a decision.

"There are two routes from here," Pierre explains. "The main Ottawa River route is well-traveled but longer. The Mattawa River shortcut is faster but has more portages and can be dangerous if the water is high."

An Algonquin guide named Makwa approaches Pierre. "The waters are high this spring," he warns. "But I know the Mattawa well. I can guide you safely."

Pierre turns to the brigade. "What say you, men?"`,
        latitude: 45.4485,
        longitude: -75.2432,
        locationName: "Ottawa River Junction",
        choices: JSON.stringify([
          {
            id: "fork-shortcut",
            text: "Take the Mattawa shortcut with Makwa as guide",
            nextNodeId: gpNodeIds.stormChoice,
            consequence: "Faster but riskier - trust in Makwa's knowledge",
            pointsChange: 5,
          },
          {
            id: "fork-main",
            text: "Stay on the main Ottawa River route",
            nextNodeId: gpNodeIds.stormChoice,
            consequence: "Safer but adds two days to your journey",
            pointsChange: 0,
          },
        ]),
        historicalFact:
          "Indigenous guides were essential to the fur trade. They knew every rapid, portage, and camping spot. Voyageurs depended on this knowledge and often formed lasting friendships with Indigenous peoples.",
        isEnding: false,
      },

      // STORM CHOICE NODE
      {
        id: gpNodeIds.stormChoice,
        journeyId: grandPortageJourney.id,
        nodeType: "choice",
        orderIndex: 2,
        title: "Storm on Lake Nipissing",
        narrative: `You've reached Lake Nipissing, a large lake that stretches before you like an inland sea. The morning started clear, but now dark clouds are gathering on the horizon.

"A storm is coming," says Pierre, squinting at the sky. "We can try to paddle across quickly before it hits - if the wind takes us, we could make excellent time. But if the storm catches us in the middle of the lake..."

Old Jean-Baptiste, the most experienced paddler, shakes his head. "I've seen canoes swamped in such storms. We could lose everything."

The other voyageurs look nervous. What do you suggest?`,
        latitude: 46.3167,
        longitude: -79.9167,
        locationName: "Lake Nipissing",
        choices: JSON.stringify([
          {
            id: "storm-risk",
            text: "Risk the crossing - speed is essential!",
            nextNodeId: gpNodeIds.endingRetry,
            consequence: "The storm catches you midway...",
            pointsChange: -10,
          },
          {
            id: "storm-wait",
            text: "Wait for the storm to pass - safety first",
            nextNodeId: gpNodeIds.tradingPost,
            consequence: "A wise choice. You lose a day but keep your cargo safe.",
            pointsChange: 10,
          },
          {
            id: "storm-shore",
            text: "Paddle along the shoreline for shelter",
            nextNodeId: gpNodeIds.tradingPost,
            consequence: "Slower but safe - good thinking!",
            pointsChange: 5,
          },
        ]),
        historicalFact:
          "Birch bark canoes were light and fast but fragile. A large wave could easily swamp or overturn them. Many voyageurs could not swim, making storms extremely dangerous.",
        isEnding: false,
      },

      // TRADING POST NODE
      {
        id: gpNodeIds.tradingPost,
        journeyId: grandPortageJourney.id,
        nodeType: "choice",
        orderIndex: 3,
        title: "Trading at Fort La Cloche",
        narrative: `Your brigade arrives at a small trading post called Fort La Cloche. A group of Ojibwe families is camped nearby, and their chief, Animikii (Thunder), approaches to trade.

He offers beautiful beaver pelts - the best quality you've seen - in exchange for your trade goods. But he wants gunpowder and muskets, which are valuable and in short supply.

Pierre whispers to you: "The Company wants us to bring back as many furs as possible. These pelts would make the bourgeois very happy. But we need to keep some gunpowder for protection."

Chief Animikii waits patiently for your decision.`,
        latitude: 46.2833,
        longitude: -81.9333,
        locationName: "Fort La Cloche",
        choices: JSON.stringify([
          {
            id: "trade-fair",
            text: "Trade fairly - some gunpowder for some pelts",
            nextNodeId: gpNodeIds.portageChoice,
            consequence: "Animikii is pleased with the fair exchange",
            pointsChange: 10,
          },
          {
            id: "trade-more",
            text: "Offer extra blankets instead of gunpowder",
            nextNodeId: gpNodeIds.portageChoice,
            consequence: "Animikii accepts but seems disappointed",
            pointsChange: 5,
          },
          {
            id: "trade-refuse",
            text: "Decline to trade - keep all supplies",
            nextNodeId: gpNodeIds.portageChoice,
            consequence: "Animikii is offended. Future trading relations may suffer.",
            pointsChange: -5,
          },
        ]),
        historicalFact:
          "The fur trade depended on good relationships between voyageurs and Indigenous peoples. Fair trading built trust and ensured a steady supply of furs. The Ojibwe word 'Animikii' means thunder.",
        isEnding: false,
      },

      // PORTAGE CHOICE NODE
      {
        id: gpNodeIds.portageChoice,
        journeyId: grandPortageJourney.id,
        nodeType: "choice",
        orderIndex: 4,
        title: "The Great Portage",
        narrative: `You've reached the famous Grand Portage - a 14-kilometer trail that bypasses dangerous waterfalls. This is the hardest part of the journey.

Each voyageur must carry two 40-kilogram packs of trade goods on their back using a tumpline (a leather strap across the forehead). The canoe itself weighs over 270 kilograms and requires six men to carry.

Pierre announces: "We can make this portage in two trips if we carry heavy loads, or three trips if we carry lighter loads. Two trips means we arrive sooner, but the strain could injure someone."

Your back is already sore from weeks of paddling. What do you choose?`,
        latitude: 47.9997,
        longitude: -89.6856,
        locationName: "Grand Portage",
        choices: JSON.stringify([
          {
            id: "portage-heavy",
            text: "Carry heavy loads - two trips only",
            nextNodeId: gpNodeIds.songTime,
            consequence: "Your muscles ache, but you save precious time",
            pointsChange: 5,
          },
          {
            id: "portage-light",
            text: "Carry lighter loads - three trips for safety",
            nextNodeId: gpNodeIds.songTime,
            consequence: "Slower but everyone stays healthy",
            pointsChange: 10,
          },
        ]),
        historicalFact:
          "Voyageurs were incredibly strong. They would carry two or even three packs at once, each weighing about 40 kg. The record was supposedly eight packs (320 kg!) though this may be legend. Many voyageurs developed hernias from the strain.",
        isEnding: false,
      },

      // SONG TIME NODE
      {
        id: gpNodeIds.songTime,
        journeyId: grandPortageJourney.id,
        nodeType: "story",
        orderIndex: 5,
        title: "Singing on the Water",
        narrative: `The portage is complete! As you push your canoe back into the water, the relief is overwhelming. The men are exhausted but in good spirits.

Old Jean-Baptiste begins to sing, and soon the whole brigade joins in:

"En roulant ma boule, roulant,
En roulant ma boule..."

(Rolling my ball, rolling along, rolling my ball...)

The song has dozens of verses about a prince, a duck, and magical feathers. It doesn't make much sense, but the rhythm keeps your paddles moving in perfect unison.

Pierre smiles. "Sing, men! Fort William is only three days away!"`,
        latitude: 48.3809,
        longitude: -89.2477,
        locationName: "Approaching Fort William",
        choices: JSON.stringify([
          {
            id: "song-lead",
            text: "Take the lead on the next verse",
            nextNodeId: gpNodeIds.rapidsFork,
            consequence: "The men cheer as you belt out the chorus!",
            pointsChange: 5,
          },
        ]),
        songLyrics: `En Roulant Ma Boule (Traditional Voyageur Song)

Derriere chez nous, y'a-t-un etang,
En roulant ma boule,
Trois beaux canards s'en vont baignant,
Rouli, roulant, ma boule roulant,
En roulant ma boule roulant,
En roulant ma boule.

(Behind our house there is a pond,
Rolling my ball along,
Three fine ducks go swimming there,
Rolling, rolling, my ball rolling,
Rolling my ball along,
Rolling my ball.)`,
        historicalFact:
          "Voyageur songs, called 'chansons', were essential for keeping paddling rhythm and morale. 'En Roulant Ma Boule' is one of the most famous. The songs were often call-and-response, with a leader singing verses and the crew joining on the chorus.",
        isEnding: false,
      },

      // RAPIDS FORK NODE
      {
        id: gpNodeIds.rapidsFork,
        journeyId: grandPortageJourney.id,
        nodeType: "choice",
        orderIndex: 6,
        title: "The Kaministiquia Rapids",
        narrative: `You're so close to Fort William you can almost taste the celebration feast! But one last challenge remains: the Kaministiquia River rapids.

The guide examines the churning water. "We have three choices," he explains:

"We can shoot the rapids - ride right through them. It's dangerous but exciting, and we'd arrive heroes."

"We can line the canoe - walk along the shore and use ropes to guide the canoe through."

"Or we can portage around - the safest but slowest option."

The men are eager to arrive. What do you recommend?`,
        latitude: 48.4097,
        longitude: -89.2856,
        locationName: "Kaministiquia River Rapids",
        choices: JSON.stringify([
          {
            id: "rapids-shoot",
            text: "Shoot the rapids! What an ending to our journey!",
            nextNodeId: gpNodeIds.endingSuccess,
            consequence: "Heart-pounding excitement! The canoe rides the waves perfectly.",
            pointsChange: 15,
          },
          {
            id: "rapids-line",
            text: "Line the canoe through carefully",
            nextNodeId: gpNodeIds.endingSuccess,
            consequence: "Slower but skilled - the cargo stays dry",
            pointsChange: 10,
          },
          {
            id: "rapids-portage",
            text: "Portage around - no risks this close to the end",
            nextNodeId: gpNodeIds.finalStretch,
            consequence: "Safe and steady - almost there!",
            pointsChange: 5,
          },
        ]),
        historicalFact:
          "Running rapids required incredible skill. The bowman would call directions while the steersman in the back controlled the canoe. One wrong move could destroy the canoe and scatter the cargo.",
        isEnding: false,
      },

      // FINAL STRETCH NODE
      {
        id: gpNodeIds.finalStretch,
        journeyId: grandPortageJourney.id,
        nodeType: "story",
        orderIndex: 7,
        title: "The Final Stretch",
        narrative: `After the portage, you're back on calm water. Fort William comes into view around the bend - wooden palisades, warehouses, and the great hall where the bourgeois (company bosses) await.

Smoke rises from cooking fires. You can hear fiddle music and laughter. Other brigades have already arrived, and the annual Rendezvous - the great trading gathering - is in full swing.

Pierre calls out: "Clean yourselves up, men! We arrive in style!"

The voyageurs wash their faces, put on their best red sashes, and prepare for a grand entrance.`,
        latitude: 48.4019,
        longitude: -89.2756,
        locationName: "Approaching Fort William",
        choices: JSON.stringify([
          {
            id: "final-enter",
            text: "Paddle in singing at the top of your lungs!",
            nextNodeId: gpNodeIds.endingSuccess,
            consequence: "Fort William welcomes you as heroes!",
            pointsChange: 5,
          },
        ]),
        historicalFact:
          "The annual Rendezvous at Fort William was the highlight of the fur trade year. Voyageurs from Montreal would meet 'winterers' (men who spent the winter in the interior) to exchange goods and furs. There would be feasting, music, and competitions.",
        isEnding: false,
      },

      // SUCCESS ENDING
      {
        id: gpNodeIds.endingSuccess,
        journeyId: grandPortageJourney.id,
        nodeType: "ending",
        orderIndex: 8,
        title: "Welcome to Fort William!",
        narrative: `You've made it! Your canoe glides up to the dock at Fort William as hundreds of voyageurs, traders, and Indigenous allies cheer your arrival.

The bourgeois himself comes to greet your brigade. "Well done, men! Your cargo is safe, your time is excellent, and I hear you made friends along the way."

That night, there is a great feast. Roast venison, fresh bread, and even a sip of rum (strictly regulated by the Company). The voyageurs share stories and compete in paddling and portaging contests.

As you sit by the fire, listening to fiddle music and watching sparks rise into the starry sky, you know: you are truly a voyageur now.

CONGRATULATIONS! You have successfully completed the Grand Portage Route!`,
        latitude: 48.3809,
        longitude: -89.2477,
        locationName: "Fort William",
        isEnding: true,
        endingType: "success",
        historicalFact:
          "Fort William (now Thunder Bay, Ontario) was the inland headquarters of the North West Company from 1803-1821. At its peak, over 2,000 people gathered here each summer for the Rendezvous.",
      },

      // PARTIAL ENDING
      {
        id: gpNodeIds.endingPartial,
        journeyId: grandPortageJourney.id,
        nodeType: "ending",
        orderIndex: 9,
        title: "A Difficult Journey",
        narrative: `You reach Fort William, but the journey has been harder than expected. Some cargo was lost, and the brigade arrived later than hoped.

Still, you made it. The bourgeois is disappointed but notes that you showed courage and learned valuable lessons.

"Every voyageur has difficult journeys," Pierre tells you. "What matters is that you kept paddling. Next year, you'll know better."

You have completed the journey, but there is room to improve. Would you like to try again?`,
        latitude: 48.3809,
        longitude: -89.2477,
        locationName: "Fort William",
        isEnding: true,
        endingType: "partial",
        historicalFact:
          "Not every voyage was successful. Canoes sank, storms delayed brigades, and sometimes voyageurs had to winter in the wilderness. But the experienced ones always tried again.",
      },

      // RETRY ENDING
      {
        id: gpNodeIds.endingRetry,
        journeyId: grandPortageJourney.id,
        nodeType: "ending",
        orderIndex: 10,
        title: "The Storm Wins",
        narrative: `The storm hits your canoe in the middle of Lake Nipissing. Waves crash over the sides, and despite everyone bailing water, the canoe begins to swamp.

"Paddle for shore!" Pierre screams over the wind.

You make it to shore, but much of the cargo is lost to the lake. The brigade must return to Montreal and report the loss to the Company.

It's a hard lesson, but one every voyageur learns: the wilderness demands respect. When nature says wait, you wait.

Would you like to try the journey again?`,
        latitude: 46.3167,
        longitude: -79.9167,
        locationName: "Lake Nipissing",
        isEnding: true,
        endingType: "retry",
        historicalFact:
          "Many voyageurs died on the water routes. Lake Superior was especially feared - its sudden storms could appear without warning. The voyageurs had a saying: 'The Lake is hungry.'",
      },
    ],
  });

  console.log(`Created Journey 1: ${grandPortageJourney.title} with ${Object.keys(gpNodeIds).length} nodes`);

  // ==================== JOURNEY 2: Race to the Pacific ====================
  // Grade 7-9, following Alexander Mackenzie's 1793 route

  const pacificJourney = await prisma.voyageurJourney.create({
    data: {
      title: "Race to the Pacific",
      description:
        "Follow in the footsteps of Alexander Mackenzie on his historic 1793 expedition to become the first European to cross North America north of Mexico. Navigate treacherous rivers, make critical decisions about supplies and routes, and work with Indigenous guides to reach the Pacific Ocean.",
      gradeLevel: "7-9",
      difficulty: "hard",
      estimatedMinutes: 30,
      startingLocation: "Fort Chipewyan, Lake Athabasca",
      endingLocation: "Dean Channel, Pacific Ocean",
      historicalYear: 1793,
      isPublished: true,
    },
  });

  // Node IDs for Pacific Journey
  const pacNodeIds = {
    start: "pac-node-start",
    peaceRiver: "pac-node-peace",
    portageDecision: "pac-node-portage",
    indigenousContact: "pac-node-contact",
    mountainPass: "pac-node-mountain",
    supplyChoice: "pac-node-supply",
    carrierGuides: "pac-node-carrier",
    finalPush: "pac-node-final",
    bellaCoola: "pac-node-bella",
    endingSuccess: "pac-node-end-success",
    endingPartial: "pac-node-end-partial",
    endingRetry: "pac-node-end-retry",
  };

  // Create all nodes for Pacific Journey
  await prisma.journeyNode.createMany({
    data: [
      // START NODE
      {
        id: pacNodeIds.start,
        journeyId: pacificJourney.id,
        nodeType: "story",
        orderIndex: 0,
        title: "The Great Unknown",
        narrative: `May 9, 1793. Fort Chipewyan, on the shores of Lake Athabasca.

You are Alexander Mackenzie, a Scottish-born fur trader with an audacious dream: to find a route across the continent to the Pacific Ocean. No European has ever accomplished this feat north of Mexico.

Your previous attempt in 1789 ended at the Arctic Ocean - a magnificent river now bears your name, but it was not the route west you sought.

This time, you're better prepared. Your expedition includes:
- One large canoe (25 feet long)
- Alexander Mackay (your second-in-command)
- Six voyageurs and two Indigenous hunters
- 3,000 pounds of supplies: pemmican, corn, gunpowder, trade goods, and scientific instruments

The Peace River flows west from here. Beyond it lies the unknown.

"Gentlemen," you announce, "we paddle into history."`,
        latitude: 58.7108,
        longitude: -111.2456,
        locationName: "Fort Chipewyan, Lake Athabasca",
        choices: JSON.stringify([
          {
            id: "start-begin",
            text: "Push off and begin the journey west",
            nextNodeId: pacNodeIds.peaceRiver,
            consequence: "The expedition begins!",
            pointsChange: 5,
          },
        ]),
        historicalFact:
          "Alexander Mackenzie was only 29 years old during this expedition. He was a partner in the North West Company and determined to find a trade route to the Pacific to compete with maritime fur traders.",
        isEnding: false,
      },

      // PEACE RIVER NODE
      {
        id: pacNodeIds.peaceRiver,
        journeyId: pacificJourney.id,
        nodeType: "choice",
        orderIndex: 1,
        title: "The Peace River Canyon",
        narrative: `The Peace River has carried you deep into the Rocky Mountain foothills. But now you face a terrifying obstacle: the Peace River Canyon.

The canyon walls rise hundreds of feet on either side. The water churns through narrow gaps, creating rapids that could destroy your canoe in seconds. You can hear the roar of water echoing off the cliffs.

Your Indigenous hunters warn: "Bad water. Very bad. Many have died here."

Mackay studies the canyon walls. "We might be able to portage along the cliff edge, but it would take days and we'd have to cut a trail through the forest. Some of the men might have to go ahead and scout the path."

The voyageurs look to you for guidance.`,
        latitude: 56.2372,
        longitude: -120.8459,
        locationName: "Peace River Canyon",
        choices: JSON.stringify([
          {
            id: "canyon-portage",
            text: "Portage through the forest - slow but safe",
            nextNodeId: pacNodeIds.portageDecision,
            consequence: "Four exhausting days, but the canoe survives",
            pointsChange: 10,
          },
          {
            id: "canyon-partial",
            text: "Try to line the canoe through calmer sections",
            nextNodeId: pacNodeIds.portageDecision,
            consequence: "Risky but faster - you lose some supplies to the river",
            pointsChange: 0,
          },
          {
            id: "canyon-run",
            text: "Run the rapids - trust in skill and luck",
            nextNodeId: pacNodeIds.endingRetry,
            consequence: "The canyon claims another canoe...",
            pointsChange: -15,
          },
        ]),
        historicalFact:
          "The actual portage around Peace River Canyon took Mackenzie's party four days. They had to cut a 9-mile trail through dense forest, carrying everything on their backs. The canyon is now flooded by the W.A.C. Bennett Dam.",
        isEnding: false,
      },

      // PORTAGE DECISION NODE
      {
        id: pacNodeIds.portageDecision,
        journeyId: pacificJourney.id,
        nodeType: "choice",
        orderIndex: 2,
        title: "Parsnip or Finlay?",
        narrative: `Beyond the canyon, you reach a crucial junction where two rivers meet: the Parsnip flowing from the south, and the Finlay flowing from the north.

Your maps are useless here - no European has ever been this far. But an elderly Sekani man at a nearby camp offers guidance.

"The big river," he says, pointing north to the Finlay, "goes many days to big lake. Much beaver."

He then points south. "That river," he gestures to the Parsnip, "small, hard paddling. But old ones say it leads over mountains to sunset water."

The Finlay looks easier to navigate. The Parsnip is smaller and will mean harder paddling against the current. But the old man's words about "sunset water" - could that mean the Pacific?`,
        latitude: 55.8667,
        longitude: -122.6333,
        locationName: "Finlay/Parsnip Junction",
        choices: JSON.stringify([
          {
            id: "river-parsnip",
            text: "Follow the Parsnip south toward the 'sunset water'",
            nextNodeId: pacNodeIds.indigenousContact,
            consequence: "Trust the elder's knowledge - the Pacific lies this way",
            pointsChange: 15,
          },
          {
            id: "river-finlay",
            text: "Follow the larger Finlay River north",
            nextNodeId: pacNodeIds.endingPartial,
            consequence: "Easier paddling, but this route leads away from the Pacific",
            pointsChange: -10,
          },
        ]),
        historicalFact:
          "This was one of the most critical decisions of Mackenzie's expedition. The Sekani elder's advice proved correct - the Parsnip River led to a height of land from which rivers flowed to the Pacific.",
        isEnding: false,
      },

      // INDIGENOUS CONTACT NODE
      {
        id: pacNodeIds.indigenousContact,
        journeyId: pacificJourney.id,
        nodeType: "choice",
        orderIndex: 3,
        title: "Meeting the Sekani",
        narrative: `As you paddle up the Parsnip River, you spot a Sekani camp on the riverbank. The people seem frightened - they've likely never seen Europeans before.

Some women and children flee into the forest. A few men stand their ground, clutching spears and bows. The tension is palpable.

Mackay suggests: "We should show we come in peace. Perhaps offer gifts?"

One of your hunters, who knows some of the Sekani language, offers to speak with them.

How do you approach?`,
        latitude: 55.4,
        longitude: -122.8,
        locationName: "Sekani Territory, Parsnip River",
        choices: JSON.stringify([
          {
            id: "sekani-gifts",
            text: "Approach slowly with gifts - beads, knives, and cloth",
            nextNodeId: pacNodeIds.mountainPass,
            consequence: "The Sekani cautiously accept. Trust begins to build.",
            pointsChange: 15,
          },
          {
            id: "sekani-distance",
            text: "Keep distance but signal peaceful intentions",
            nextNodeId: pacNodeIds.mountainPass,
            consequence: "No conflict, but no help either",
            pointsChange: 5,
          },
          {
            id: "sekani-force",
            text: "Show weapons to demonstrate strength",
            nextNodeId: pacNodeIds.mountainPass,
            consequence: "The Sekani vanish into the forest. You've lost potential guides.",
            pointsChange: -10,
          },
        ]),
        historicalFact:
          "Mackenzie's expedition depended on peaceful relations with Indigenous peoples. They provided essential geographic knowledge, food, and guidance. Without their help, the expedition would have failed.",
        isEnding: false,
      },

      // MOUNTAIN PASS NODE
      {
        id: pacNodeIds.mountainPass,
        journeyId: pacificJourney.id,
        nodeType: "choice",
        orderIndex: 4,
        title: "The Great Divide",
        narrative: `The Parsnip River has led you to a remarkable place: a small lake where water flows in both directions. To the east, streams feed the rivers flowing to the Arctic. To the west, streams flow toward the Pacific.

You have reached the Continental Divide!

But your canoe is battered from weeks of rough water. The birch bark is patched in a dozen places, and the frame is cracked. Ahead lies the descent to the Pacific - rivers you know nothing about.

Mackay examines the canoe. "We can patch it again, but one more bad rapid and it's finished. We might need to build a new one or find another way forward."

A Sekani guide suggests: "The Carrier people to the west use grease trails - overland paths. Slower than water, but safer."`,
        latitude: 54.3833,
        longitude: -122.7667,
        locationName: "Arctic/Pacific Divide (McLeod Lake)",
        choices: JSON.stringify([
          {
            id: "divide-canoe",
            text: "Repair the canoe and continue by water",
            nextNodeId: pacNodeIds.supplyChoice,
            consequence: "You spend two days on repairs. The canoe holds... for now.",
            pointsChange: 5,
          },
          {
            id: "divide-overland",
            text: "Cache the canoe and travel overland on grease trails",
            nextNodeId: pacNodeIds.carrierGuides,
            consequence: "Slower but your equipment will last",
            pointsChange: 10,
          },
        ]),
        historicalFact:
          "Mackenzie did ultimately cache his canoe and travel the grease trails - Indigenous trade routes used for centuries. These trails were called 'grease trails' because they were used to transport eulachon oil, a valuable trade item.",
        isEnding: false,
      },

      // SUPPLY CHOICE NODE
      {
        id: pacNodeIds.supplyChoice,
        journeyId: pacificJourney.id,
        nodeType: "choice",
        orderIndex: 5,
        title: "The Fraser River Decision",
        narrative: `Your repaired canoe has carried you down the western slopes to a massive river the Carrier people call "Tacoutche Tesse" (what will later be named the Fraser River).

But this river is terrifying. It rages through narrow canyons, dropping in elevation rapidly. Your Indigenous guides refuse to continue by water.

"Bad river," they warn. "No canoe can live there. Our people walk."

You've traveled so far. The Pacific must be close. But your supplies are running low - you have perhaps two weeks of food remaining.

Do you trust the river or the guides?`,
        latitude: 53.9171,
        longitude: -122.7497,
        locationName: "Fraser River, near present-day Prince George",
        choices: JSON.stringify([
          {
            id: "fraser-river",
            text: "Attempt the Fraser River by canoe",
            nextNodeId: pacNodeIds.endingRetry,
            consequence: "The Fraser lives up to its terrifying reputation...",
            pointsChange: -20,
          },
          {
            id: "fraser-overland",
            text: "Leave the canoe and follow the guides overland",
            nextNodeId: pacNodeIds.carrierGuides,
            consequence: "Wise choice - the overland route is the only way",
            pointsChange: 15,
          },
        ]),
        historicalFact:
          "Mackenzie made the wise choice to abandon river travel. Years later, Simon Fraser would attempt to navigate the river that now bears his name - and barely survived. Fraser himself said the journey was so dangerous he would never attempt it again.",
        isEnding: false,
      },

      // CARRIER GUIDES NODE
      {
        id: pacNodeIds.carrierGuides,
        journeyId: pacificJourney.id,
        nodeType: "story",
        orderIndex: 6,
        title: "The Grease Trail",
        narrative: `You cache your canoe and most of your supplies, taking only what you can carry on your backs. Carrier guides lead you west along ancient trails.

The journey is exhausting. You climb mountain passes, ford icy streams, and push through dense forests. Your moccasins wear through and your feet bleed.

But gradually, the forest changes. You smell salt on the wind. The Carrier guides smile and point west.

"Sunset water," they say. "Two days."

Your heart races. After two months of travel, crossing a continent no European has ever crossed, you're almost there.`,
        latitude: 52.8,
        longitude: -126.0,
        locationName: "Grease Trail, Carrier Territory",
        choices: JSON.stringify([
          {
            id: "trail-push",
            text: "Push forward with renewed energy!",
            nextNodeId: pacNodeIds.bellaCoola,
            consequence: "The Pacific awaits!",
            pointsChange: 10,
          },
        ]),
        historicalFact:
          "The Grease Trail (now called the Nuxalk-Carrier Grease Trail) is a 420 km Indigenous trade route. Today it's a designated Heritage Trail and can still be hiked. Mackenzie's party traveled it in July 1793.",
        isEnding: false,
      },

      // FINAL PUSH NODE
      {
        id: pacNodeIds.finalPush,
        journeyId: pacificJourney.id,
        nodeType: "choice",
        orderIndex: 7,
        title: "The Bella Coola Valley",
        narrative: `You've descended into the Bella Coola Valley, home of the Nuxalk people. The river here flows toward the sea, and you can see evidence of salmon fishing everywhere.

The Nuxalk are cautious but not hostile. They've traded with coastal peoples who have met European ships. An elder mentions that just weeks ago, "men from the big canoes" visited Dean Channel.

You realize these must have been the ships of Captain George Vancouver, exploring the coast! You've nearly crossed paths with a British naval expedition.

The Nuxalk offer to lend you canoes to reach the ocean. But some warriors seem suspicious of your intentions.`,
        latitude: 52.3769,
        longitude: -126.7542,
        locationName: "Bella Coola Valley",
        choices: JSON.stringify([
          {
            id: "nuxalk-accept",
            text: "Accept the canoes gratefully with gifts of thanks",
            nextNodeId: pacNodeIds.endingSuccess,
            consequence: "The Nuxalk guide you to the coast!",
            pointsChange: 15,
          },
          {
            id: "nuxalk-negotiate",
            text: "Negotiate carefully, offering valuable trade goods",
            nextNodeId: pacNodeIds.endingSuccess,
            consequence: "A fair exchange that honors both peoples",
            pointsChange: 10,
          },
        ]),
        historicalFact:
          "The Nuxalk (Bella Coola) people had recent contact with Vancouver's expedition. Some Nuxalk were initially suspicious of Mackenzie's party due to a conflict with Vancouver's men just weeks before.",
        isEnding: false,
      },

      // BELLA COOLA NODE
      {
        id: pacNodeIds.bellaCoola,
        journeyId: pacificJourney.id,
        nodeType: "story",
        orderIndex: 8,
        title: "Approaching the Ocean",
        narrative: `The Nuxalk provide you with canoes and guides. You paddle down the Bella Coola River, which widens as it approaches the sea.

And then - there it is.

The Pacific Ocean.

Salt water stretches to the horizon, glittering under the July sun. Sea birds wheel overhead. You can hardly believe your eyes.

You've done it. You've crossed North America.

But your journey isn't complete until you mark this spot for history. You mix vermilion paint with bear grease and prepare to write on a large rock face.`,
        latitude: 52.3667,
        longitude: -127.4833,
        locationName: "Dean Channel, Pacific Ocean",
        choices: JSON.stringify([
          {
            id: "bella-mark",
            text: "Paint your inscription on the rock",
            nextNodeId: pacNodeIds.endingSuccess,
            consequence: "Your words will echo through history",
            pointsChange: 10,
          },
        ]),
        historicalFact:
          "On July 22, 1793, Mackenzie painted his famous inscription on a rock at Dean Channel: 'Alex Mackenzie from Canada by land 22d July 1793.' The rock, now called Mackenzie Rock, is a National Historic Site.",
        isEnding: false,
      },

      // SUCCESS ENDING
      {
        id: pacNodeIds.endingSuccess,
        journeyId: pacificJourney.id,
        nodeType: "ending",
        orderIndex: 9,
        title: "From Canada, by Land",
        narrative: `You mix vermilion (red paint) with bear grease and write on a large rock facing the sea:

"ALEX MACKENZIE FROM CANADA BY LAND 22D JULY 1793"

You stand back and look at your work. Simple words, but they represent something extraordinary: the first recorded crossing of North America north of Mexico.

Your expedition covered over 2,300 kilometers from Fort Chipewyan. You navigated unknown rivers, crossed the Rocky Mountains, and built relationships with Indigenous peoples who showed you the way.

The return journey will be difficult, but you've achieved something that will inspire generations of explorers, mapmakers, and adventurers.

CONGRATULATIONS! You have completed Alexander Mackenzie's historic expedition to the Pacific Ocean!

When you return to civilization, you will be knighted by King George III and remembered forever as one of history's greatest explorers.`,
        latitude: 52.3667,
        longitude: -127.4833,
        locationName: "Dean Channel, Pacific Ocean",
        isEnding: true,
        endingType: "success",
        historicalFact:
          "Mackenzie was knighted in 1802 for his explorations. His book 'Voyages from Montreal' (1801) inspired Thomas Jefferson to commission the Lewis and Clark Expedition. The Mackenzie River, Mackenzie Rock, and many other places bear his name.",
      },

      // PARTIAL ENDING
      {
        id: pacNodeIds.endingPartial,
        journeyId: pacificJourney.id,
        nodeType: "ending",
        orderIndex: 10,
        title: "A Northern Detour",
        narrative: `Following the Finlay River leads you far to the north. After weeks of travel, you realize you've been heading away from the Pacific, toward the lands you explored on your 1789 expedition.

With supplies running low, you're forced to turn back. The crossing will have to wait for another year.

But you've learned valuable lessons. The Parsnip River is the true route west. Indigenous knowledge is more valuable than any European map. And the Pacific can be reached - just not this time.

You've completed an incredible journey, even if it wasn't the one you planned. Would you like to try again with what you've learned?`,
        latitude: 57.0,
        longitude: -125.0,
        locationName: "Upper Finlay River",
        isEnding: true,
        endingType: "partial",
        historicalFact:
          "Mackenzie's first expedition in 1789 also missed the Pacific, ending at the Arctic Ocean instead. He called the river he discovered the 'River Disappointment,' though it's now named the Mackenzie River in his honor.",
      },

      // RETRY ENDING
      {
        id: pacNodeIds.endingRetry,
        journeyId: pacificJourney.id,
        nodeType: "ending",
        orderIndex: 11,
        title: "The River Wins",
        narrative: `The river proves too powerful. Whether in the Peace River Canyon or the raging Fraser, your canoe is destroyed by the churning water.

Your men manage to reach shore, but the canoe is shattered and much of your supplies lost to the current. Without the means to continue, you must return to Fort Chipewyan and try again another year.

It's a bitter disappointment, but every explorer faces setbacks. The knowledge you've gained about these rivers will prove valuable on future expeditions.

The Pacific awaits. Would you like to attempt the journey again?`,
        latitude: 54.0,
        longitude: -122.5,
        locationName: "Western Rivers",
        isEnding: true,
        endingType: "retry",
        historicalFact:
          "The rivers Mackenzie navigated were extremely dangerous. The Peace River Canyon and Fraser River have claimed many lives. Mackenzie's success was due partly to his willingness to listen to Indigenous guides who knew these waters.",
      },
    ],
  });

  console.log(`Created Journey 2: ${pacificJourney.title} with ${Object.keys(pacNodeIds).length} nodes`);

  console.log("Voyageur Journey Simulator seed data complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
