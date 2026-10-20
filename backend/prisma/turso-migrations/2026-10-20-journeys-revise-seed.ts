// Roadmap item 6 (2026-10-20): the two seed journeys brought to the same standard as the new
// ones: every stop tied to the app's records and sourced, every choice scored against what
// happened, and the errors of the seed corrected.
//   bun run prisma/turso-migrations/2026-10-20-journeys-revise-seed.ts [--apply]
//
// What was wrong, and is corrected here:
// - The Grand Portage Route was set in 1790 and ended at Fort William, which was not built
//   until 1803; its "Mattawa shortcut" was an invention (the Mattawa was the only road); its
//   "Fort La Cloche" trading scene had a voyageur bargaining gunpowder and muskets, which clerks
//   at posts did, not paddlers; and "shoot the rapids" at the end scored highest because it was
//   exciting. It is now "The Montreal Brigade, 1805": Lachine to Fort William by the only road,
//   with the choices the pork-eaters actually faced, scored from Nute, Podruchny and Morse.
// - Race to the Pacific began at Fort Chipewyan on 9 May 1793; Mackenzie left Fort Fork on the
//   Peace that day (Fort Chipewyan was the previous autumn). Its "Great Divide" was placed at
//   McLeod Lake; the carry was from the Parsnip over to James Creek, the Bad River, where the
//   canoe was wrecked on 13 June. And the Bella Coola Valley stop could not be reached: the
//   Grease Trail led straight to the Dean Channel stop. The order is now Grease Trail → Bella
//   Coola Valley → Dean Channel. Facts rest on Mackenzie's Voyages (1801) as carried in the app's
//   four Mackenzie documents, and on the DCB.
// Node ids are kept, so nothing that points at them breaks.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const VOY = "Nute, The Voyageur (1931); Podruchny, Making the Voyageur World (2006); Morse, Fur Trade Canoe Routes of Canada (1969), through Wikipedia's \"Voyageurs\"";
const VOY_URL = "https://en.wikipedia.org/wiki/Voyageurs";
const MACK = "Mackenzie, Voyages from Montreal (1801), as carried in the app's Mackenzie documents; Dictionary of Canadian Biography, \"Mackenzie, Sir Alexander\"";
const MACK_URL = "https://www.biographi.ca/en/bio/mackenzie_alexander_1764_1820_5E.html";

interface Choice { id: string; text: string; nextNodeId: string; consequence: string; pointsChange: number; whatHappened: string; source: string }
interface NodeRev {
  id: string; title?: string; narrative: string; historicalFact: string; latitude?: number; longitude?: number; locationName?: string;
  location?: string; waterway?: string; explorer?: string; document?: string; source: string; sourceUrl?: string; choices?: Choice[] | null; nodeType?: string;
}

const GP = "cmlhqh7v70000m20bdp3m3ny5";
const GP_NODES: NodeRev[] = [
  {
    id: "gp-node-start", title: "Lachine, May 1805",
    narrative: "It is a cool morning in May 1805 at Lachine, above the rapids west of Montreal, where the North West Company's warehouses stand on the river. You are Jacques, sixteen, and this is your first engagement: a mangeur de lard, a pork-eater, bound for Lake Superior and back by autumn. Your canoe is a canot du maître, thirty-six feet of birch bark that carries three tons of trade goods in ninety-pound packs called pièces, and nine other paddlers who will be your family for three months. The guide, Pierre, calls out: \"En avant!\" The paddles dip together and the men begin to sing.",
    historicalFact: "A canot du maître was about 36 feet long, weighed about 600 pounds and carried about 65 pièces of 90 pounds with a crew of eight to ten. Voyageurs paddled about fourteen hours a day at about 55 strokes a minute, and rested every hour for a pipe.",
    location: "Lachine", waterway: "St. Lawrence River", source: "The Canadian Encyclopedia, \"Lachine\"; " + VOY, sourceUrl: VOY_URL,
    choices: [{ id: "start-paddle", text: "Join in the singing and paddle in time with the rest", nextNodeId: "gp-node-fork", consequence: "The veterans nod. You will do.", pointsChange: 5, whatHappened: "The songs kept the paddles in time; a new man who could not keep the stroke slowed the whole canoe.", source: VOY }],
  },
  {
    id: "gp-node-fork", title: "The portages of the Ottawa and the Mattawa",
    narrative: "Up the Ottawa the river is rapids after rapids, and at each one the canoe is emptied and everything goes over the portage on men's backs: two pièces at a time, a hundred and eighty pounds, held by a tumpline across the forehead, at a trot. At the Mattawa you turn west up the small river toward the height of land and Lake Nipissing, the only road there is. Pierre watches who carries what. Some of the older men carry three to finish sooner.",
    historicalFact: "Two pièces a trip was the custom. Some voyageurs carried four or five, and one was reported carrying seven for half a mile; hernias were common and often fatal.",
    latitude: 46.32, longitude: -78.9, locationName: "The Mattawa River",
    waterway: "Mattawa River", source: VOY, sourceUrl: VOY_URL,
    choices: [
      { id: "fork-shortcut", text: "Two pièces a trip, as the custom is", nextNodeId: "gp-node-storm", consequence: "Your back holds and the brigade keeps its pace.", pointsChange: 10, whatHappened: "The standard load was two ninety-pound pièces; a voyageur was expected to carry it at a trot and go back for the next.", source: VOY },
      { id: "fork-main", text: "Three pièces, to show the old men what you can do", nextNodeId: "gp-node-storm", consequence: "They cheer. Your back and your groin do not.", pointsChange: -5, whatHappened: "Men who carried more than the custom finished faster and were admired; hernias were the price, and they were often fatal in a country without surgeons.", source: VOY },
    ],
  },
  {
    id: "gp-node-storm",
    narrative: "You have reached Lake Nipissing, which stretches ahead like an inland sea. The morning was clear but now dark clouds gather on the horizon. \"A storm is coming,\" says Pierre, squinting at the sky. \"We can try to cross before it hits and make excellent time. If it catches us in the middle of the lake...\" Old Jean-Baptiste shakes his head. \"I have seen canoes swamped in such storms. We could lose everything.\" The other voyageurs look nervous.",
    historicalFact: "Birch bark canoes were light and fast but fragile; a big wave could swamp one. Drowning was the commonest death among voyageurs, and most could not swim.",
    waterway: "Lake Nipissing", source: VOY, sourceUrl: VOY_URL,
    choices: [
      { id: "storm-risk", text: "Risk the crossing; speed is everything", nextNodeId: "gp-node-end-retry", consequence: "The storm catches you midway.", pointsChange: -15, whatHappened: "Canoes caught in open water were swamped; the crosses on the big lakes' shores marked where men were lost.", source: VOY },
      { id: "storm-wait", text: "Wait for the storm to pass", nextNodeId: "gp-node-trade", consequence: "You lose a day and keep the cargo.", pointsChange: 10, whatHappened: "Brigades were wind-bound, dégradés, for days on the big lakes; the guide decided, and a guide who lost a canoe was not given another.", source: VOY },
      { id: "storm-shore", text: "Paddle along the shoreline for shelter", nextNodeId: "gp-node-trade", consequence: "Slower, and safe.", pointsChange: 5, whatHappened: "Following the shore was the brigades' way across the big lakes; traverses were made only in calm weather.", source: VOY },
    ],
  },
  {
    id: "gp-node-trade", title: "La Cloche",
    narrative: "Down the French River and along the north shore of Lake Huron the brigade comes to La Cloche, the company's post below the white hills, where Ojibwe families are camped for the fishing. The brigade's food is corn and grease and salt pork, and a pork-eater is glad of fresh whitefish. The clerk at the post does the company's trading; what you can do is buy fish and corn from the families on the shore with your own small wages. Pierre says the price is the price.",
    historicalFact: "The voyageurs' food was pemmican, salt pork, dried peas or corn and biscuit; a canoe needed about four packs of food for every five hundred miles. Trading for furs was the clerks' work at the posts, not the paddlers'.",
    waterway: "Lake Huron", source: "The app's Lake Huron record; " + VOY, sourceUrl: VOY_URL,
    choices: [
      { id: "trade-fair", text: "Pay the price asked for the fish and the corn", nextNodeId: "gp-node-portage", consequence: "Fresh fish tonight, and the families remember the brigade kindly.", pointsChange: 10, whatHappened: "Brigades bought fish, corn and berries from the Anishinaabe along the lakes; the trade kept men fed and the road open.", source: VOY },
      { id: "trade-more", text: "Haggle hard; wages are small", nextNodeId: "gp-node-portage", consequence: "You get your fish a little cheaper and a colder look.", pointsChange: 0, whatHappened: "A voyageur's wages were small and most of them went back to the company's stores; haggling was understood, and so was ill will.", source: VOY },
      { id: "trade-refuse", text: "Eat the corn and grease and save the money", nextNodeId: "gp-node-portage", consequence: "Nobody is offended. You are hungry.", pointsChange: 5, whatHappened: "Corn and grease, rubaboo, was what the pork-eaters lived on; the name was no compliment.", source: VOY },
    ],
  },
  {
    id: "gp-node-portage", title: "Passing the Grand Portage",
    narrative: "Along the north shore of Superior the brigade passes the Grand Portage, the old depot at the foot of the nine-mile carry over which the north canoes once went. Since 1803 it has stood on the American side of the line and the company has left it; the rendezvous is at the new fort on the Kaministiquia now, fifty miles on. The north men still tell of carrying two pièces nine miles over the Grand Portage. The older men say nothing has changed but the name.",
    historicalFact: "The Grand Portage is 13.7 km. The North West Company's partners voted in July 1802 to move their headquarters to the Kaministiquia, and the posts stood on the Canadian side from 1803.",
    location: "Grand Portage", waterway: "Lake Superior", source: "Grand Portage National Monument (U.S. National Park Service); the app's Grand Portage record; " + VOY, sourceUrl: "https://www.nps.gov/grpo/index.htm",
    choices: [
      { id: "portage-heavy", text: "Ask the north men what the carry was like", nextNodeId: "gp-node-song", consequence: "Two pièces, nine miles, and back for more. They say it with pride.", pointsChange: 5, whatHappened: "North men carried goods over the Grand Portage in loads of two pièces; it was the hardest carry on the road from Montreal until the Methye.", source: VOY },
      { id: "portage-light", text: "Keep paddling; the rendezvous is three days on", nextNodeId: "gp-node-song", consequence: "Pierre approves of men who do not stop to look at things.", pointsChange: 5, whatHappened: "After 1803 the Montreal brigades passed Grand Portage without stopping and made for Fort William.", source: "The app's Grand Portage record" },
    ],
  },
  {
    id: "gp-node-song",
    narrative: "As the brigade pushes on along the shore the relief of the last days shows in the men. Old Jean-Baptiste begins to sing, and the whole brigade joins in: \"En roulant ma boule, roulant, en roulant ma boule...\" The song has dozens of verses about a prince, a duck and magic feathers. It does not make much sense, but it keeps the paddles moving together. Pierre smiles. \"Sing, men. Fort William is three days off.\"",
    historicalFact: "Voyageur songs kept the paddling rhythm and the men's spirits. 'En roulant ma boule' is one of the most famous; the songs were call-and-response, the leader singing the verse and the crew the chorus.",
    waterway: "Lake Superior", source: "The Canadian Encyclopedia, \"Voyageurs\"", sourceUrl: "https://www.thecanadianencyclopedia.ca/en/article/voyageurs",
    choices: [{ id: "song-lead", text: "Take the lead on the next verse", nextNodeId: "gp-node-rapids", consequence: "The men cheer as you belt out the chorus.", pointsChange: 5, whatHappened: "A good singer was valued in a canoe; some were paid more for it.", source: "The Canadian Encyclopedia, \"Voyageurs\"" }],
  },
  {
    id: "gp-node-rapids", title: "The traverse of Thunder Bay",
    narrative: "The last day on Superior. Ahead the Sleeping Giant lies across the mouth of Thunder Bay, and the fort is at the far side of it, at the mouth of the Kaministiquia. Across the open bay saves half a day; round the shore is longer and sure. The men are eager to arrive. Pierre looks at the water and then at you.",
    historicalFact: "The brigades followed the shores of Lake Superior and made open-water traverses only in calm weather; the lake's sudden storms were feared more than any rapid on the road.",
    latitude: 48.33, longitude: -89.0, locationName: "Thunder Bay, Lake Superior",
    waterway: "Lake Superior", source: VOY, sourceUrl: VOY_URL,
    choices: [
      { id: "rapids-shoot", text: "Straight across the bay; it is calm and we are late", nextNodeId: "gp-node-end-partial", consequence: "Halfway over the wind rises, a wave comes aboard and two pièces go over the side. You arrive late and light.", pointsChange: -5, whatHappened: "Traverses were made in calm weather and dreaded in any other; a canoe caught by wind in open water lost cargo if it was lucky and men if it was not.", source: VOY },
      { id: "rapids-line", text: "Round the shore, and arrive tomorrow", nextNodeId: "gp-node-end-success", consequence: "A night more on a beach. Everyone arrives.", pointsChange: 10, whatHappened: "Keeping to the shore was the brigades' way across the big lakes.", source: VOY },
      { id: "rapids-portage", text: "Wait at the point for the wind to settle, then cross", nextNodeId: "gp-node-final", consequence: "Pierre's choice too. The bay goes glassy at dawn.", pointsChange: 10, whatHappened: "Waiting for calm at a point before a traverse was the guides' rule.", source: VOY },
    ],
  },
  {
    id: "gp-node-final",
    narrative: "Round the last point Fort William comes into view: palisades, warehouses and the Great Hall where the partners meet. Smoke rises from the cooking fires. You can hear fiddles. Other brigades are in, and the north men are camped at the far end of the shore. Pierre calls out: \"Clean yourselves up, men. We arrive in style.\" The voyageurs wash their faces, put on their red sashes and prepare for a grand entrance.",
    historicalFact: "The rendezvous at Fort William was the highlight of the fur-trade year: the Montreal brigades met the north men, the partners met in the Great Hall, and up to 2,000 people gathered.",
    location: "Fort William", waterway: "Kaministiquia River", source: "Parks Canada, Fort William National Historic Site; " + VOY, sourceUrl: "https://www.pc.gc.ca/en/lhn-nhs/on/fortwilliam",
    choices: [{ id: "final-enter", text: "Paddle in singing at the top of your lungs", nextNodeId: "gp-node-end-success", consequence: "Fort William turns out to watch.", pointsChange: 5, whatHappened: "Brigades arrived singing, in their best, and were met by the whole fort.", source: VOY }],
  },
  {
    id: "gp-node-end-success", title: "Welcome to Fort William",
    narrative: "Your canoe glides up to the landing as voyageurs, traders and Anishinaabe families watch from the shore. The bourgeois comes down to greet the brigade. \"Well done, men. Your cargo is safe and your time is good.\" That night there is a regale: a dram of rum for each man from the company, fresh bread, and the fiddles. Some of the north men come over and ask if you will sign for the north next year; about one pork-eater in three does. As you sit by the fire listening to the fiddles, you know you are a voyageur now.",
    historicalFact: "Fort William was the North West Company's inland headquarters from 1803 to 1821, named in 1807 for William McGillivray. About a third of the pork-eaters became north men.",
    location: "Fort William", waterway: "Kaministiquia River", explorer: "William McGillivray", source: "Parks Canada, Fort William National Historic Site; " + VOY, sourceUrl: VOY_URL,
  },
  {
    id: "gp-node-end-partial",
    narrative: "You reach Fort William, but later and lighter than you hoped: cargo lost and a brigade behind its time. The bourgeois is not pleased, and notes that you kept paddling. \"Every voyageur has a hard voyage,\" Pierre tells you. \"What matters is the next one.\"",
    historicalFact: "Not every voyage went well: canoes were lost, storms held brigades for days, and a lost cargo was charged against the men's wages.",
    location: "Fort William", source: VOY, sourceUrl: VOY_URL,
  },
  {
    id: "gp-node-end-retry",
    narrative: "The storm hits in the middle of Lake Nipissing. Waves come over the sides and, bailing or not, the canoe begins to swamp. \"Paddle for shore!\" Pierre screams over the wind. You reach it, and much of the cargo is in the lake, and the brigade must turn back to Montreal and report the loss. It is a lesson every voyageur learns: when the lake says wait, you wait.",
    historicalFact: "Many voyageurs died on the water. Lake Superior was the most feared; its storms came without warning.",
    waterway: "Lake Nipissing", source: VOY, sourceUrl: VOY_URL,
  },
];

const RACE = "cmlhqh7vg0001m20bouynw1h0";
const RACE_NODES: NodeRev[] = [
  {
    id: "pac-node-start", title: "Fort Fork, 9 May 1793",
    narrative: "9 May 1793, Fort Fork on the Peace River, where you have wintered since the autumn. You are Alexander Mackenzie, twenty-nine, a partner of the North West Company, and you mean to find a way across the continent to the Pacific. Your journey of 1789 ended at the Arctic Ocean, down a river you called Disappointment. This time you are better prepared: one canoe, twenty-five feet long, carrying three thousand pounds of pemmican, corn, powder, trade goods and instruments; Alexander Mackay as your second; six voyageurs and two Indigenous hunters. The Peace runs west into the mountains. You push off at seven in the evening.",
    historicalFact: "Mackenzie was 29. His Voyages from Montreal (1801) records the party and the canoe; his inscription on the rock at Dean Channel is dated 22 July 1793.",
    latitude: 56.17, longitude: -117.35, locationName: "Fort Fork, Peace River",
    waterway: "Peace River", explorer: "Alexander Mackenzie", document: "Alexander Mackenzie at Fort Fork, 1793", source: MACK, sourceUrl: MACK_URL,
    choices: [{ id: "start-begin", text: "Push off and begin the journey west", nextNodeId: "pac-node-peace", consequence: "The expedition begins.", pointsChange: 5, whatHappened: "Mackenzie left Fort Fork on the evening of 9 May 1793, as his journal records.", source: MACK }],
  },
  {
    id: "pac-node-peace",
    narrative: "The Peace has carried you into the foothills, and now the canyon: walls hundreds of feet high, the water churning through gaps that would break the canoe in seconds. The hunters say it plainly: bad water, many have died here. Mackay thinks a road could be cut over the mountain through the forest, carrying everything, but it would take days. The voyageurs look to you.",
    historicalFact: "Mackenzie's party cut a road over the mountain to pass the Peace River Canyon, hauling the canoe up with a line; it took days. The canyon is now under the Williston reservoir behind the W.A.C. Bennett Dam.",
    waterway: "Peace River", explorer: "Alexander Mackenzie", source: MACK, sourceUrl: MACK_URL,
    choices: [
      { id: "canyon-portage", text: "Cut a road over the mountain and carry everything", nextNodeId: "pac-node-portage", consequence: "Days of cutting and hauling, and the canoe survives.", pointsChange: 10, whatHappened: "This is what Mackenzie did: the party cut a road over the mountain, hauled the canoe up with a line and carried the cargo, and was back on the river above the canyon after days of labour.", source: MACK },
      { id: "canyon-partial", text: "Line the canoe through the calmer stretches", nextNodeId: "pac-node-portage", consequence: "You get partway and lose supplies to the river before giving up.", pointsChange: 0, whatHappened: "Mackenzie tried the river first and was driven to the portage; the Voyages record the canoe being nearly lost.", source: MACK },
      { id: "canyon-run", text: "Run the rapids and trust to skill and luck", nextNodeId: "pac-node-end-retry", consequence: "The canyon claims the canoe.", pointsChange: -15, whatHappened: "No canoe ran the Peace River Canyon; the voyageurs themselves refused it.", source: MACK },
    ],
  },
  {
    id: "pac-node-portage",
    narrative: "Beyond the canyon two rivers meet: the Parsnip from the south and the Finlay from the north. No map shows this country. An old Sekani man at a camp nearby gives you the way: the big river, the Finlay, goes many days north; the small one, the Parsnip, is hard paddling, but the old people say it leads over the mountains to a river that runs to the sunset water. The Finlay looks the easier river.",
    historicalFact: "The Sekani elder's directions at the Finlay forks were the turning point of the journey; the Voyages record them, and the Parsnip led to the height of land.",
    waterway: "Parsnip River", explorer: "Alexander Mackenzie", document: "Mackenzie's Account of the Parsnip, the Fraser and the Bella Coola, 1793", source: MACK, sourceUrl: MACK_URL,
    choices: [
      { id: "river-parsnip", text: "Follow the Parsnip south, as the elder said", nextNodeId: "pac-node-contact", consequence: "Hard paddling against the current, toward the sunset water.", pointsChange: 15, whatHappened: "Mackenzie took the elder's advice and went up the Parsnip; it led to the divide and the Pacific slope.", source: MACK },
      { id: "river-finlay", text: "Follow the larger Finlay north", nextNodeId: "pac-node-end-partial", consequence: "Easier paddling, and the wrong way.", pointsChange: -10, whatHappened: "The Finlay leads north into the Rocky Mountain Trench, away from any road to the Pacific.", source: MACK },
    ],
  },
  {
    id: "pac-node-contact",
    narrative: "Up the Parsnip you come on a Sekani camp. The people have never seen Europeans. Women and children run for the forest; a few men stand with bows and spears. Mackay suggests gifts. One of your hunters knows some of the language and offers to speak.",
    historicalFact: "The Voyages record Mackenzie's meetings with the Sekani on the Parsnip: gifts, an interpreter, and the guides who followed.",
    waterway: "Parsnip River", explorer: "Alexander Mackenzie", source: MACK, sourceUrl: MACK_URL,
    choices: [
      { id: "sekani-gifts", text: "Approach slowly with gifts: beads, knives and cloth", nextHow: "", nextNodeId: "pac-node-mountain", consequence: "The Sekani accept, cautiously, and a guide comes with you.", pointsChange: 15, whatHappened: "This is what Mackenzie did; the Sekani guide he gained showed him the carry over the divide.", source: MACK } as Choice,
      { id: "sekani-distance", text: "Keep your distance and signal peace", nextNodeId: "pac-node-mountain", consequence: "No conflict, and no help.", pointsChange: 5, whatHappened: "Without a guide the party would have had to find the carry itself; Mackenzie depended on the people he met for the way.", source: MACK },
      { id: "sekani-force", text: "Show weapons to prove your strength", nextNodeId: "pac-node-mountain", consequence: "The Sekani vanish into the forest. You have lost your guides.", pointsChange: -10, whatHappened: "Mackenzie's journal is explicit that force would have ended the journey; everything west of the forks depended on guides.", source: MACK },
    ],
  },
  {
    id: "pac-node-mountain", title: "Over the divide: the Bad River",
    narrative: "The Parsnip leads to a small lake, and a carry of a few hundred paces over the height of land to another, whose water runs west. You are over the divide. But the stream below, James Creek, is a torrent of fallen trees and rapids, and on 13 June the canoe is wrecked on it: the party is thrown into the water, the canoe broken, powder wet, and the men ready to turn back. You will call it the Bad River. The Sekani guide says the people to the west walk, on grease trails, and that the great river below is no place for a canoe.",
    historicalFact: "The canoe was wrecked on James Creek on 13 June 1793; the Voyages describe the party's narrow escape and the night Mackenzie spent persuading the men to go on. The app's document on the crossing carries his account.",
    latitude: 54.42, longitude: -121.72, locationName: "James Creek, the Bad River, below the divide",
    waterway: "Parsnip River", explorer: "Alexander Mackenzie", document: "Alexander Mackenzie Crossing the Rocky Mountains, June 1793", source: MACK, sourceUrl: MACK_URL,
    choices: [
      { id: "divide-canoe", text: "Repair the canoe and go on by water", nextNodeId: "pac-node-supply", consequence: "Two days of repairs with bark and gum. The canoe holds, for now.", pointsChange: 10, whatHappened: "Mackenzie repaired the canoe and went on by water down to the great river, the Fraser, before the Dakelh turned him to the land.", source: MACK },
      { id: "divide-overland", text: "Cache the canoe here and walk the grease trails from the divide", nextNodeId: "pac-node-carrier", consequence: "Slower, and far longer on foot than the way Mackenzie found.", pointsChange: 5, whatHappened: "Mackenzie did cache his canoe and walk, but from the Fraser, weeks farther on; the river carried him to the point where walking made sense.", source: MACK },
    ],
  },
  {
    id: "pac-node-supply",
    narrative: "The repaired canoe has carried you down the western slope to a great river the Dakelh call Tacoutche Tesse, which will one day be named the Fraser. It rages through canyons. The Dakelh you meet tell you plainly: no canoe can live in the river below, and their people walk to the sea by a trail to the west. You have perhaps two weeks of food. The Pacific must be near. The river or the guides?",
    historicalFact: "Mackenzie took the Dakelh's advice, cached the canoe and walked. Fifteen years later Simon Fraser ran the river and barely lived to say it should never be attempted again.",
    waterway: "Fraser River", explorer: "Alexander Mackenzie", document: "Mackenzie's Account of the Parsnip, the Fraser and the Bella Coola, 1793", source: MACK, sourceUrl: MACK_URL,
    choices: [
      { id: "fraser-river", text: "Take the Fraser by canoe", nextNodeId: "pac-node-end-retry", consequence: "The river lives up to everything they said.", pointsChange: -20, whatHappened: "Fraser's party of 1808 ran the canyon and nearly died; Mackenzie's 1793 canoe would not have survived it.", source: MACK },
      { id: "fraser-overland", text: "Leave the canoe and follow the Dakelh overland", nextNodeId: "pac-node-carrier", consequence: "The only way, and the right one.", pointsChange: 15, whatHappened: "This is what Mackenzie did: he turned back up the Fraser, cached the canoe and supplies, and set out west on foot with guides.", source: MACK },
    ],
  },
  {
    id: "pac-node-carrier",
    narrative: "You cache the canoe and most of the supplies, take what you can carry, and Dakelh guides lead you west along the grease trail, the road by which eulachon oil comes inland from the coast. You climb passes, ford icy streams and push through forest; the moccasins wear through. Then the forest changes and there is salt on the wind. The guides point west. \"Two days.\"",
    historicalFact: "The Nuxalk-Carrier Grease Trail, now the Alexander Mackenzie Heritage Trail, is about 420 km long; Mackenzie's party walked it in July 1793 in about two weeks.",
    waterway: "Bella Coola River", explorer: "Alexander Mackenzie", source: MACK, sourceUrl: MACK_URL,
    choices: [{ id: "trail-push", text: "Push on with what strength is left", nextNodeId: "pac-node-final", consequence: "The valley opens below you.", pointsChange: 10, whatHappened: "The walk from the Fraser to the Bella Coola valley took the party about two weeks.", source: MACK }],
  },
  {
    id: "pac-node-final",
    narrative: "You come down into the Bella Coola valley, the Nuxalk country, where the river runs to the sea and the salmon weirs stand in every reach. The Nuxalk feed you and are wary: an elder says that weeks ago men from a great canoe were in the channel below, and there was trouble. That was Vancouver's survey. You have nearly crossed paths with a British ship. The Nuxalk offer canoes to take you down to the salt water.",
    historicalFact: "Vancouver's boats had surveyed Dean Channel in June 1793, weeks before Mackenzie arrived; the Voyages record the Nuxalk's account of them and the hostility his own party met at the channel.",
    waterway: "Bella Coola River", explorer: "Alexander Mackenzie", source: MACK, sourceUrl: MACK_URL,
    choices: [
      { id: "nuxalk-accept", text: "Accept the canoes with gifts of thanks", nextNodeId: "pac-node-bella", consequence: "The Nuxalk take you down the river to the sea.", pointsChange: 15, whatHappened: "Nuxalk canoes and guides took Mackenzie down the Bella Coola to Dean Channel.", source: MACK },
      { id: "nuxalk-negotiate", text: "Bargain for the canoes with trade goods", nextNodeId: "pac-node-bella", consequence: "A fair exchange, and the same canoes.", pointsChange: 10, whatHappened: "Mackenzie paid for help with the goods he carried; his journal lists what was given.", source: MACK },
    ],
  },
  {
    id: "pac-node-bella",
    narrative: "The river widens and there it is: salt water to the horizon, sea birds, the tide. You have crossed North America. At the channel the people are hostile, with the memory of Vancouver's men, and you cannot stay. But before you turn back you mix vermilion with bear grease and write on the rock above the tide.",
    historicalFact: "On 22 July 1793 Mackenzie wrote on the rock at Dean Channel: \"Alex Mackenzie from Canada by land 22d July 1793.\" The rock is a national historic site, and the app's document carries the inscription.",
    waterway: "Dean Channel", explorer: "Alexander Mackenzie", document: "Alexander Mackenzie's Rock Inscription at Bella Coola, July 1793", source: MACK, sourceUrl: MACK_URL,
    choices: [{ id: "bella-mark", text: "Write the inscription on the rock", nextNodeId: "pac-node-end-success", consequence: "Your words are on the rock still.", pointsChange: 10, whatHappened: "He wrote it in vermilion and grease; the words were later cut into the rock, where they are today.", source: MACK }],
  },
  {
    id: "pac-node-end-success",
    narrative: "\"ALEX MACKENZIE FROM CANADA BY LAND 22D JULY 1793.\" Simple words for the first recorded crossing of North America north of Mexico: from Fort Fork over the mountains to the sea in ten weeks, by the Peace, the Parsnip, the Bad River, the Fraser and the grease trail, with the Sekani, the Dakelh and the Nuxalk showing the way. The return will be as hard. In 1801 you will publish the Voyages; in 1802 you will be knighted; Jefferson will read the book and send Lewis and Clark west.",
    historicalFact: "Mackenzie was knighted in 1802. His Voyages from Montreal (1801) was read by Thomas Jefferson before he sent Lewis and Clark; the Mackenzie River and Mackenzie Rock bear his name.",
    waterway: "Dean Channel", explorer: "Alexander Mackenzie", document: "Alexander Mackenzie's Rock Inscription at Bella Coola, July 1793", source: MACK, sourceUrl: MACK_URL,
  },
  {
    id: "pac-node-end-partial",
    narrative: "The Finlay leads you north for weeks into the Rocky Mountain Trench, away from the sea, toward the country of your 1789 journey. With the food running out you turn back. You have learned what the elder told you: the Parsnip is the road west, and the people who live here know the country better than any map.",
    historicalFact: "Mackenzie's 1789 journey also missed the Pacific and ended at the Arctic Ocean; he called the river Disappointment. It is the Mackenzie River now.",
    waterway: "Finlay River", explorer: "Alexander Mackenzie", source: MACK, sourceUrl: MACK_URL,
  },
  {
    id: "pac-node-end-retry",
    narrative: "The river wins. In the Peace River Canyon or the Fraser, the canoe is broken and the supplies are in the current. The men reach the shore; without a canoe or food you must go back to Fort Fork and wait for another year. Mackenzie's own success came from listening to the people who knew these rivers, and to his voyageurs when they would not run them.",
    historicalFact: "The Peace River Canyon and the Fraser canyons have taken many lives; Mackenzie passed both by going round, on the advice of the people he met.",
    waterway: "Fraser River", explorer: "Alexander Mackenzie", source: MACK, sourceUrl: MACK_URL,
  },
];

async function main() {
  const [locations, waterways, explorers, documents] = await Promise.all([
    db.location.findMany({ select: { id: true, name: true } }),
    db.waterway.findMany({ select: { id: true, name: true } }),
    db.explorer.findMany({ select: { id: true, name: true } }),
    db.primarySourceDocument.findMany({ select: { id: true, title: true } }),
  ]);
  const L = new Map(locations.map((x) => [x.name, x.id])), W = new Map(waterways.map((x) => [x.name, x.id])), E = new Map(explorers.map((x) => [x.name, x.id])), D = new Map(documents.map((x) => [x.title, x.id]));
  const problems: string[] = [];
  const existing = await db.journeyNode.findMany({ where: { journeyId: { in: [GP, RACE] } } });
  const existingIds = new Set(existing.map((n) => n.id));
  for (const n of [...GP_NODES, ...RACE_NODES]) {
    if (!existingIds.has(n.id)) problems.push(`node not in Turso: ${n.id}`);
    if (n.location && !L.has(n.location)) problems.push(`location not found: ${n.location} (${n.id})`);
    if (n.waterway && !W.has(n.waterway)) problems.push(`waterway not found: ${n.waterway} (${n.id})`);
    if (n.explorer && !E.has(n.explorer)) problems.push(`explorer not found: ${n.explorer} (${n.id})`);
    if (n.document && !D.has(n.document)) problems.push(`document not found: ${n.document} (${n.id})`);
    for (const c of n.choices ?? []) if (!existingIds.has(c.nextNodeId)) problems.push(`choice ${n.id}/${c.id} points at unknown node ${c.nextNodeId}`);
  }
  const reachable = (nodes: NodeRev[], start: string) => { const seen = new Set<string>(); const stack = [start]; while (stack.length) { const id = stack.pop()!; if (seen.has(id)) continue; seen.add(id); for (const c of nodes.find((n) => n.id === id)?.choices ?? []) stack.push(c.nextNodeId); } return nodes.filter((n) => !seen.has(n.id)).map((n) => n.id); };
  const unreachable = [...reachable(GP_NODES, "gp-node-start"), ...reachable(RACE_NODES, "pac-node-start")];
  const backupFile = writeBackup("2026-10-20-journeys-revise-seed-before", { nodes: existing, journeys: await db.voyageurJourney.findMany({ where: { id: { in: [GP, RACE] } } }) });
  if (problems.length) { report("ABORT", { problems }); process.exitCode = 1; return; }
  report("revise the two seed journeys", { grandPortage: GP_NODES.length, race: RACE_NODES.length, unreachable, backupFile });
  if (!APPLY) return;
  await db.voyageurJourney.update({ where: { id: GP }, data: { title: "The Montreal Brigade, 1805", description: "Paddle with a North West Company brigade from Lachine to the rendezvous at Fort William in the summer of 1805: the Ottawa portages, the storm on Nipissing, the north shore of Superior, and the choices a pork-eater actually faced, scored against what the voyageurs did.", historicalYear: 1805, startingLocation: "Lachine", endingLocation: "Fort William", source: "Nute, The Voyageur (1931); Podruchny, Making the Voyageur World (2006); Morse, Fur Trade Canoe Routes of Canada (1969); Parks Canada, Fort William; the app's post and water records.", sourceUrl: VOY_URL } });
  await db.voyageurJourney.update({ where: { id: RACE }, data: { startingLocation: "Fort Fork, Peace River", source: "Mackenzie, Voyages from Montreal (1801), through the app's four Mackenzie documents; Dictionary of Canadian Biography, \"Mackenzie, Sir Alexander\".", sourceUrl: MACK_URL } });
  for (const n of [...GP_NODES, ...RACE_NODES]) {
    const data: Record<string, unknown> = {
      narrative: n.narrative, historicalFact: n.historicalFact, source: n.source, sourceUrl: n.sourceUrl ?? null,
      locationId: n.location ? L.get(n.location)! : null, waterwayId: n.waterway ? W.get(n.waterway)! : null, explorerId: n.explorer ? E.get(n.explorer)! : null, documentId: n.document ? D.get(n.document)! : null,
    };
    if (n.title) data.title = n.title;
    if (n.latitude !== undefined) { data.latitude = n.latitude; data.longitude = n.longitude; data.locationName = n.locationName; }
    if (n.choices !== undefined) data.choices = n.choices ? JSON.stringify(n.choices.map(({ nextHow, ...c }: Choice & { nextHow?: string }) => c)) : null;
    await db.journeyNode.update({ where: { id: n.id }, data });
  }
  const verify = await db.journeyNode.findMany({ where: { journeyId: { in: [GP, RACE] } }, select: { journeyId: true, id: true, title: true, waterwayId: true, source: true } });
  report("verify", { nodes: verify.length, withWater: verify.filter((v) => v.waterwayId).length, withSource: verify.filter((v) => v.source).length, titles: verify.map((v) => v.title) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
