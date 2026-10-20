// Roadmap item 6 (2026-10-20): the Klondike 1898 journey. Sixteen stops from the Seattle
// waterfront to Dawson, every stop tied to the app's own records (the Yukon pack of 2026-10-17)
// and every choice scored against what people actually did, with the source on the choice.
//   bun run prisma/turso-migrations/2026-10-20-journey-klondike.ts [--apply]
//
// Sources, all read for this pass: the app's own Yukon records (Chilkoot Pass, Bennett, Miles
// Canyon, Five Finger Rapids, Fort Selkirk, Dawson City, Tr'ochëk, Moosehide, Bonanza Creek,
// the Hän events; written from the Canadian Encyclopedia and the DCB); the documents of the Yukon
// pack (Ogilvie 1897, Adney 1900, Steele 1915, Haskell 1898, Angela Sidney 1990); and for the
// numbers of the stampede, Wikipedia's "Klondike Gold Rush" (a featured article resting on
// Berton's Klondike, 2001, and Winslow's Big Pan-Out, 1952), read 2026-10-20: 100,000 set out,
// 30,000-40,000 reached Dawson, no more than 4,000 found gold; 22,000 used the Chilkoot; the
// year's food (about 1,150 lb) required by the Canadian authorities; the avalanche of 3 April
// 1898 (more than 60 dead); 7,124 boats left Bennett in May 1898; several hundred drowned in
// Miles Canyon and the White Horse Rapids before Steele's rules; the Edmonton routes (1,660 set
// out, 685 arrived); Dawson at 17,000 in summer 1898, eggs at $3, typhoid in July.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const JOURNEY_ID = "journey_klondike_1898";
const N = (slug: string) => `${JOURNEY_ID}_${slug}`;

const WIKI = "Wikipedia, \"Klondike Gold Rush\" (after Berton, Klondike, 2001)";
const WIKI_URL = "https://en.wikipedia.org/wiki/Klondike_Gold_Rush";
const TCE_CHILKOOT = "https://www.thecanadianencyclopedia.ca/en/article/chilkoot-pass";
const STEELE = "Steele, Forty Years in Canada (1915), the Yukon chapters";
const ADNEY = "Adney, The Klondike Stampede (1900)";

interface Choice { id: string; text: string; nextNodeId: string; consequence: string; pointsChange: number; whatHappened: string; source: string }
interface Node {
  slug: string; nodeType: "story" | "choice" | "ending"; title: string; narrative: string; historicalFact: string;
  latitude: number; longitude: number; locationName: string;
  location?: string; waterway?: string; explorer?: string; document?: string; knowledge?: string; source: string; sourceUrl?: string;
  choices?: Choice[]; isEnding?: boolean; endingType?: "success" | "partial" | "retry";
}

const NODES: Node[] = [
  {
    slug: "seattle", nodeType: "story", title: "Seattle, 17 July 1897",
    narrative: "The steamer Portland is tied up at Schwabacher's wharf and the whole city has come down to see the gold come off her: a ton of it, the papers say, and more than that in fact. Three days ago the Excelsior did the same in San Francisco. You have a little money, a strong back and no idea where the Klondike is, except that it is north, in Canada, up a river called the Yukon. By tonight every berth on every ship north is sold. A hundred thousand people will set out this year. Thirty or forty thousand will get there.",
    historicalFact: "The press reported $1,139,000 of gold aboard the Portland, which was an underestimate. The stampede began in San Francisco on 14 July 1897 and in Seattle three days later.",
    latitude: 47.603, longitude: -122.338, locationName: "Seattle waterfront",
    document: "Ogilvie's Information Respecting the Yukon District, 1897, and Early Days on the Yukon, 1913",
    source: WIKI, sourceUrl: WIKI_URL,
    choices: [
      { id: "go", text: "Buy a ticket north and an outfit from the first outfitter on the street", nextNodeId: N("which-way"), consequence: "You are a stampeder. Seattle's outfitters sell everything twice over.", pointsChange: 5, whatHappened: "Seattle's merchants made more from the rush than most miners did. Ogilvie's government pamphlet of 1897 told stampeders what they would need; few read it before they bought.", source: "Ogilvie, Information Respecting the Yukon District (1897)" },
    ],
  },
  {
    slug: "which-way", nodeType: "choice", title: "Which way in?",
    narrative: "The ship lands you at the head of Lynn Canal. Two trails climb the Coast Mountains to the lakes where the Yukon begins. From Skagway, the White Pass: lower, and a horse can walk it. From Dyea, a few miles on, the Chilkoot: higher and steeper, the Tlingit trade road, too steep at the top for any animal. There is talk of an all-Canadian route from Edmonton that avoids the passes and the American customs altogether.",
    historicalFact: "Skagway was one log cabin before the rush; by the summer of 1898 it held 15,000 to 20,000 people, and Sam Steele called it 'little better than a hell on earth'.",
    latitude: 59.455, longitude: -135.313, locationName: "Skagway and Dyea, Lynn Canal",
    source: WIKI, sourceUrl: WIKI_URL,
    choices: [
      { id: "chilkoot", text: "The Chilkoot from Dyea, with the Tlingit packers", nextNodeId: N("dyea"), consequence: "Steep, but it is open all winter and everyone who climbs it gets over.", pointsChange: 10, whatHappened: "About 22,000 people crossed the Chilkoot. Its last pitch was too steep for animals, so it was climbed on foot in relays, but it stayed open through the winter of 1897-98 when the White Pass was closed.", source: WIKI },
      { id: "white", text: "The White Pass from Skagway, with pack horses", nextNodeId: N("dead-horse"), consequence: "Lower and longer, and the horses will pay for it.", pointsChange: 0, whatHappened: "The narrow trail killed horses in their thousands and was called the Dead Horse Trail. Wet weather closed it in late 1897, stranding about 5,000 people in Skagway until the ground froze and a toll road was built.", source: WIKI },
      { id: "edmonton", text: "The all-Canadian route overland from Edmonton", nextNodeId: N("long-way"), consequence: "No passes, no customs, and no trail either.", pointsChange: -10, whatHappened: "The three routes from Edmonton were barely trails. About 1,660 people took them; 685 arrived, some after eighteen months.", source: WIKI },
    ],
  },
  {
    slug: "dead-horse", nodeType: "story", title: "The Dead Horse Trail",
    narrative: "The White Pass trail is two feet wide in places, a ledge of mud and rock above the Skagway River, and the horses go over the edge or lie down in the mud and die where they fall. The smell is on you for days. Your own horse lasts a week. After that you carry what you can, 65 pounds at a time, back and forth, until the whole outfit is at the summit. Then the rain comes and the trail closes behind you.",
    historicalFact: "Carrying an outfit over the White Pass in 65-pound packs took about thirty round trips, some 2,500 miles of walking. A strong man with a heavy sled needed about 90 days to reach Lake Bennett.",
    latitude: 59.62, longitude: -135.14, locationName: "White Pass trail",
    source: WIKI, sourceUrl: WIKI_URL,
    choices: [
      { id: "on", text: "Push on to the lakes before the snow", nextNodeId: N("bennett"), consequence: "You reach Bennett with your outfit and without your horse.", pointsChange: 0, whatHappened: "Those who got over the White Pass before it closed joined the Chilkoot crowd at the head of Bennett Lake for the winter.", source: WIKI },
    ],
  },
  {
    slug: "dyea", nodeType: "story", title: "Dyea and the packers",
    narrative: "Dyea was a handful of Tlingit houses and a store a year ago. The Chilkoot Tlingit have carried trade over this pass for generations and held it against all comers until the 1880s; now they are packers for hire, men and women both, and on the upper stages they charge a dollar a pound. Your outfit weighs close to a ton. There are tramways going up too, horse-powered, and an aerial one promised for spring.",
    historicalFact: "The Chilkoot Tlingit controlled the pass as their trade road to the interior until the 1880s. Keish and Káa Goox, who found the Klondike gold, packed over it in those years, and Schwatka crossed it in 1883.",
    latitude: 59.505, longitude: -135.353, locationName: "Dyea, Taiya Inlet",
    location: "Chilkoot Pass", knowledge: "kg_keish_kaa_goox_klondike",
    source: "The Canadian Encyclopedia, \"Chilkoot Pass\"; " + WIKI, sourceUrl: TCE_CHILKOOT,
    choices: [
      { id: "packers", text: "Hire Tlingit packers for the worst of it", nextNodeId: N("sheep-camp"), consequence: "Expensive, and worth it: they know the pass and the weather.", pointsChange: 10, whatHappened: "Packers were mostly Tlingit, some Tagish, and charged up to $1 a pound on the later stages. Tlingit women packed too, some with their babies.", source: WIKI },
      { id: "relay", text: "Carry it yourself, in relays", nextNodeId: N("sheep-camp"), consequence: "Weeks of climbing the same miles. Cheap, and slow.", pointsChange: 5, whatHappened: "Most stampeders carried their own outfits in relays through the winter, caching each load above and going back for the next.", source: WIKI },
      { id: "tram", text: "Pay the tramway by the pound", nextNodeId: N("sheep-camp"), consequence: "Your goods ride up on a cable. Your money does not come back.", pointsChange: 5, whatHappened: "Archie Burns's horse-powered tramway was running by December 1897 and five more followed; a steam one charged 8 to 30 cents a pound, and an aerial tramway opened in spring 1898 moving nine tonnes an hour.", source: WIKI },
    ],
  },
  {
    slug: "sheep-camp", nodeType: "choice", title: "Sheep Camp, 3 April 1898",
    narrative: "A warm wind has blown up the valley from the south for days and the snow on the slopes above Sheep Camp is heavy and wet. This morning the Tlingit packers will not go up. They say the mountain will slide. The older prospectors are staying in camp with them. But there are hundreds of people on the trail above you, and you have loads cached at the Scales that you want to see again.",
    historicalFact: "Alaska Natives refused to pack above Sheep Camp that morning, and the more experienced prospectors followed their lead.",
    latitude: 59.625, longitude: -135.30, locationName: "Sheep Camp, Chilkoot Trail",
    location: "Chilkoot Pass",
    source: "U.S. National Park Service, \"Palm Sunday Avalanche\"; " + WIKI, sourceUrl: "https://home.nps.gov/articles/palm-sunday-avalanche.htm",
    choices: [
      { id: "wait", text: "Stay in camp with the packers", nextNodeId: N("summit"), consequence: "A day lost. Nothing else.", pointsChange: 15, whatHappened: "The slopes let go that day in a series of slides. The people who had waited at Sheep Camp lived.", source: "U.S. National Park Service, \"Palm Sunday Avalanche\"" },
      { id: "climb", text: "Climb anyway; the loads will not wait", nextNodeId: N("the-slide"), consequence: "The mountain comes down on the trail.", pointsChange: -20, whatHappened: "More than sixty people died in the Palm Sunday avalanche of 3 April 1898 between Sheep Camp and the Scales. They are buried in the Slide Cemetery at Dyea.", source: WIKI },
    ],
  },
  {
    slug: "summit", nodeType: "choice", title: "The Scales and the summit",
    narrative: "At the Scales the packers weigh their loads for the last climb, and above you the Golden Stairs go up: fifteen hundred steps cut in the ice, a chain of people on them from dawn to dark, a step every few seconds and no stopping. At the top, a flag and a hut: the North-West Mounted Police, and the Canadian border. They let no one through without a year's food, about 1,150 pounds, which with your tools and tent is close to a ton. They weigh it.",
    historicalFact: "The 'Golden Steps' were cut by entrepreneurs who charged a daily fee for their use. Canadian authorities required each traveller to bring a year's food so that Dawson would not starve.",
    latitude: 59.69, longitude: -135.24, locationName: "Chilkoot Pass summit",
    location: "Chilkoot Pass", explorer: "Sam Steele",
    source: STEELE + "; " + WIKI, sourceUrl: WIKI_URL,
    choices: [
      { id: "outfit", text: "Show the police the full outfit", nextNodeId: N("bennett"), consequence: "Stamped and passed. You are in Canada, with a year's food on the Canadian side.", pointsChange: 10, whatHappened: "The police posts at the summits, set up in the winter of 1898 under Steele, turned back anyone without a year's provisions. The rule is why Dawson, with 17,000 people and no road, did not starve in 1898.", source: STEELE },
      { id: "light", text: "Travel light and buy what you need in Dawson", nextNodeId: N("bennett"), consequence: "The police send you back down the Stairs to buy the rest. Weeks lost.", pointsChange: -10, whatHappened: "Those who arrived at the summit short of the year's food were turned back to Dyea to make it up, however many trips it took.", source: STEELE },
    ],
  },
  {
    slug: "bennett", nodeType: "story", title: "Bennett, winter 1897-98",
    narrative: "Thirty thousand people are camped in tents at the head of Bennett Lake, and all of them are building boats. The sound of the camp is the whipsaw: two people to a saw, one on a trestle and one under it, cutting green spruce into planks, and partnerships break up over who stands where. The forests around the lake are going down for lumber. The police have a post here and a man with a notebook walks the shore writing down every boat and everyone in it.",
    historicalFact: "7,124 boats of every size and quality left the lakes in May 1898. By then the forests around Bennett and Lindeman had largely been cut.",
    latitude: 59.84, longitude: -134.99, locationName: "Bennett, head of Bennett Lake",
    location: "Bennett", waterway: "Bennett Lake", explorer: "Sam Steele", document: "Steele's Forty Years in Canada: the Yukon Chapters, 1898-1899",
    source: STEELE + "; " + WIKI, sourceUrl: WIKI_URL,
    choices: [
      { id: "build", text: "Build a proper boat with a partner, however long it takes", nextNodeId: N("break-up"), consequence: "A sound boat, and a partner you have come to hate.", pointsChange: 10, whatHappened: "Most stampeders built their own boats through the winter from whipsawed lumber; the boats that were built well survived the river.", source: WIKI },
      { id: "buy", text: "Buy a boat from a man who has given up", nextNodeId: N("break-up"), consequence: "Quicker, and you did not see how it was built.", pointsChange: 5, whatHappened: "Many turned back at Bennett and sold their outfits and boats to those still going.", source: WIKI },
      { id: "raft", text: "Lash a raft; it is only a river", nextNodeId: N("break-up"), consequence: "It floats. The river below has rapids.", pointsChange: -5, whatHappened: "Rafts and badly built boats were the ones the canyon broke up.", source: WIKI },
    ],
  },
  {
    slug: "break-up", nodeType: "story", title: "29 May 1898: the ice goes out",
    narrative: "The ice on the lake goes out on 29 May, and the whole camp goes with it. Superintendent Steele has made his rules: every boat is numbered and registered, the police know who is in each, and no one runs Miles Canyon without obeying what the police there say. Seven thousand boats are on the water in a day, rafts and scows and skiffs, a flotilla five hundred miles from Dawson.",
    historicalFact: "The police recorded who was in each boat so that families outside could be told what became of them. In 1897 the all-water route had been caught by the October freeze: only 43 reached the Klondike before winter, and 35 of those had to turn back.",
    latitude: 59.95, longitude: -134.9, locationName: "Bennett Lake",
    location: "Bennett", waterway: "Bennett Lake", explorer: "Sam Steele",
    source: STEELE + "; the app's event \"Steele's Rules at Bennett\"", sourceUrl: WIKI_URL,
    choices: [
      { id: "off", text: "Shove off with the rest", nextNodeId: N("miles-canyon"), consequence: "The lakes first: Bennett, Tagish, Marsh. Then the river.", pointsChange: 5, whatHappened: "The flotilla left in order under the police's eye, and the river below the lakes carried it toward Miles Canyon.", source: STEELE },
    ],
  },
  {
    slug: "miles-canyon", nodeType: "choice", title: "Miles Canyon and the White Horse Rapids",
    narrative: "Below Marsh Lake the river narrows into a basalt canyon, Kwanlin, 'running water through canyon', and then drops into the White Horse Rapids. Boats went into it in the first days of the rush and did not come out; the police counted the drowned and made rules. A licensed pilot takes a boat through for twenty-five dollars. Women and children walk round. Macaulay has built a tramway to carry boats and goods past the canyon on rails, also for twenty-five dollars. Or you can unload, let the empty boat drift through, and hope to catch it below.",
    historicalFact: "Schwatka named Miles Canyon in 1883. The Kwanlin Dün take their name from it. The Whitehorse dam later drowned the rapids.",
    latitude: 60.67, longitude: -135.03, locationName: "Miles Canyon, above Whitehorse",
    location: "Miles Canyon", waterway: "Yukon River", explorer: "Sam Steele",
    source: STEELE + "; " + WIKI, sourceUrl: WIKI_URL,
    choices: [
      { id: "pilot", text: "Pay a licensed pilot the twenty-five dollars", nextNodeId: N("five-fingers"), consequence: "Through in minutes, wet to the waist and alive.", pointsChange: 15, whatHappened: "After the first wrecks Steele's police vetted every boat, kept women and children off the rapids and required a licensed pilot, typically $25, on any boat carrying passengers. The drownings stopped.", source: STEELE },
      { id: "drift", text: "Unload, carry the goods round, and let the empty boat drift through", nextNodeId: N("five-fingers"), consequence: "A long carry. The boat comes through bruised and you catch it in the eddy.", pointsChange: 10, whatHappened: "Some stampeders let unmanned boats drift through the canyon and collected them below; it worked when the boat was sound.", source: WIKI },
      { id: "tram", text: "Put the boat on Macaulay's tramway", nextNodeId: N("five-fingers"), consequence: "Twenty-five dollars, and the boat never touches the canyon.", pointsChange: 5, whatHappened: "Norman Macaulay's horse-powered tramway carried boats and outfits past the canyon for $25 a time until the railway reached Whitehorse in 1900.", source: WIKI },
      { id: "run", text: "Run it yourself; you built the boat, you can steer it", nextNodeId: N("the-canyon"), consequence: "The canyon takes the boat and the river takes the rest.", pointsChange: -20, whatHappened: "Several hundred people drowned in Miles Canyon and the White Horse Rapids before the police rules, most of them in boats run by their own builders.", source: WIKI },
    ],
  },
  {
    slug: "five-fingers", nodeType: "choice", title: "Lake Laberge and the Five Fingers",
    narrative: "Below the rapids the river widens into Lake Laberge, fifty kilometres of cold water quick to storm, and then the Thirty Mile, fast and clear. Days later four pillars of rock stand up in the river and split it into five channels: Tthi-cho Nadezhe, 'big rocks standing up', the Five Finger Rapids. Everyone ahead of you has had to pick a channel. The eastern one, on the right, is the one the boats take.",
    historicalFact: "Only the eastern channel of the Five Fingers is passable; the sternwheelers later hauled themselves up through it on a cable until the river traffic ended in the 1950s.",
    latitude: 62.27, longitude: -136.36, locationName: "Five Finger Rapids, below Carmacks",
    location: "Five Finger Rapids", waterway: "Yukon River",
    source: "The Canadian Encyclopedia, \"Yukon River\"; the app's Five Finger Rapids record", sourceUrl: "https://www.thecanadianencyclopedia.ca/en/article/yukon-river",
    choices: [
      { id: "right", text: "Hold to the right-hand channel", nextNodeId: N("fort-selkirk"), consequence: "A drop, a wave over the bow, and open river.", pointsChange: 10, whatHappened: "The right-hand, eastern channel was the stampeders' channel and the only one the steamers could use.", source: "The Canadian Encyclopedia, \"Yukon River\"" },
      { id: "left", text: "Take the wide-looking channel on the left", nextNodeId: N("fort-selkirk"), consequence: "Rocks. The boat spins and ships water; you lose a day on the bank drying flour.", pointsChange: -10, whatHappened: "The other four channels are blocked by rock; boats that tried them were holed or swamped.", source: "The Canadian Encyclopedia, \"Yukon River\"" },
    ],
  },
  {
    slug: "fort-selkirk", nodeType: "story", title: "Fort Selkirk",
    narrative: "Where the Pelly comes in from the east stands what is left of Robert Campbell's Hudson's Bay Company post of 1848, in the country of the Northern Tutchone, who have lived at this meeting of rivers for eight thousand years. The Chilkat Tlingit sacked the post in 1852 because it cut into their trade with the interior, and the Company never came back. Traders and a mission have returned for the rush. The Tutchone sell you dried salmon. You are two hundred miles from Dawson.",
    historicalFact: "The Chilkat Tlingit, whose trade with the interior the post undercut, sacked Fort Selkirk in 1852. The village lasted until the sternwheelers stopped running in the 1950s and is now a territorial historic site reached by river.",
    latitude: 62.77, longitude: -137.39, locationName: "Fort Selkirk, mouth of the Pelly",
    location: "Fort Selkirk", waterway: "Yukon River",
    source: "The Canadian Encyclopedia, \"Fort Selkirk\"; Dictionary of Canadian Biography, \"Campbell, Robert\"", sourceUrl: "https://www.thecanadianencyclopedia.ca/en/article/fort-selkirk",
    choices: [
      { id: "on", text: "Buy salmon, sleep dry, go on in the morning", nextNodeId: N("dawson"), consequence: "The river is wide and fast now and does the work.", pointsChange: 5, whatHappened: "From Fort Selkirk the river carried the boats to the Klondike's mouth in days.", source: "The Canadian Encyclopedia, \"Fort Selkirk\"" },
    ],
  },
  {
    slug: "dawson", nodeType: "choice", title: "Dawson, June 1898",
    narrative: "Dawson is seventeen thousand people on a mud flat at the Klondike's mouth: tents, log saloons, a hospital, a police barracks, and boats tied three deep along the waterfront, yours among them. Every creek that pays was staked in the first weeks after the discovery, two summers ago; the men who own them need workers and pay in gold. Eggs are three dollars each. In July the typhoid will come. You have a year's food, a boat and a choice.",
    historicalFact: "Dawson grew from about 500 people in 1896 to about 17,000 by the summer of 1898. Of the thirty to forty thousand who reached it, 15,000 to 20,000 looked for gold, no more than 4,000 found any, and a few hundred became rich.",
    latitude: 64.06, longitude: -139.43, locationName: "Dawson City",
    location: "Dawson City", waterway: "Klondike River", document: "Haskell's Two Years in the Klondike and Alaskan Gold-Fields, 1898",
    source: "The Canadian Encyclopedia, \"Dawson\"; " + WIKI, sourceUrl: WIKI_URL,
    choices: [
      { id: "wages", text: "Hire on to a claim on Bonanza or Eldorado for wages", nextNodeId: N("moosehide"), consequence: "Shovelling frozen gravel for a dollar an hour and your food. You go home with something.", pointsChange: 10, whatHappened: "Most of those who stayed worked for the men who had staked in 1896-97; the creeks that paid were all taken before the stampeders arrived.", source: WIKI },
      { id: "stake", text: "Go out past the staked ground and stake a creek of your own", nextNodeId: N("moosehide"), consequence: "Weeks in the hills. The creek you stake has colour and no pay.", pointsChange: 5, whatHappened: "No more than 4,000 of the people who reached Dawson struck gold at all, and only a few hundred became rich, nearly all on ground staked before the rush.", source: WIKI },
      { id: "sell", text: "Sell the outfit while flour is worth its weight, and go home", nextNodeId: N("moosehide"), consequence: "Your year's food sells for more than it cost to bring. You have seen the Klondike.", pointsChange: 5, whatHappened: "Thousands sold their outfits on the Dawson waterfront in the summer of 1898 and left; the rush was over for them the day they arrived.", source: WIKI },
      { id: "halls", text: "See what the dance halls and the gambling tables are like", nextNodeId: N("moosehide"), consequence: "A month later the outfit is gone and so is the boat.", pointsChange: -10, whatHappened: "Dawson's saloons and dance halls took the gold off miners and stampeders alike; Steele closed them on Sundays and expelled the worst with a 'blue ticket'.", source: STEELE },
    ],
  },
  {
    slug: "moosehide", nodeType: "story", title: "Tr'ochëk and Moosehide",
    narrative: "Across the Klondike's mouth from the town is Tr'ochëk, the Hän fishing camp whose hammerstones, tr'ondëk, drove the salmon-net stakes and gave the river its name before the miners' tongues made it Klondike. The stampeders overran it in the first winter. Chief Isaac bargained with the bishop, the police and the surveyor, and in the summer of 1897 led his people three miles down the Yukon to a village of their own at Moosehide. Adney, the Harper's Weekly correspondent, hunted with Isaac up the Klondike in January and wrote it down; almost no one else noticed.",
    historicalFact: "The Hän name Tr'ondëk, 'hammerstone', is for the stones used to drive the salmon-net stakes at Tr'ochëk. The Tr'ondëk-Klondike landscape became a World Heritage Site in 2023.",
    latitude: 64.09, longitude: -139.45, locationName: "Moosehide, below Dawson",
    location: "Moosehide", waterway: "Klondike River", document: "Adney's The Klondike Stampede, 1900",
    source: ADNEY + "; the app's event \"The Hän Leave Tr'ochëk\"", sourceUrl: "https://www.thecanadianencyclopedia.ca/en/article/dawson",
    choices: [
      { id: "end", text: "Walk back to Dawson along the river", nextNodeId: N("klondiker"), consequence: "Your year in the Klondike is what you made of it.", pointsChange: 5, whatHappened: "By 1904 the Hän needed police aid to prevent famine. The rush had taken their river.", source: WIKI },
    ],
  },
  {
    slug: "klondiker", nodeType: "ending", title: "A Klondiker", isEnding: true, endingType: "success",
    narrative: "You crossed the pass, built the boat, ran the river and reached Dawson, which is more than most of the hundred thousand who set out can say. Whether you dug, worked, sold or watched, you were there in the summer of 1898, when the town held seventeen thousand people and the creeks had been taken for two years. In the summer of 1899 gold was found at Nome, and in August and September twenty-five hundred people left Dawson for it. The railway reached Whitehorse in 1900 and the Chilkoot Trail and Bennett were abandoned. The Hän are still on the river.",
    historicalFact: "About 2,500 people left Dawson for Nome in August and September 1899. The White Pass and Yukon Route railway reached Bennett in 1899 and Whitehorse in 1900.",
    latitude: 64.06, longitude: -139.43, locationName: "Dawson City",
    location: "Dawson City", source: WIKI, sourceUrl: WIKI_URL,
  },
  {
    slug: "long-way", nodeType: "ending", title: "The long way round", isEnding: true, endingType: "partial",
    narrative: "The Edmonton route is a rumour with a trail attached. You follow the Athabasca and the Peace into country no stampeder knows, through mud in summer and slush ice in winter, and the horses die as they died on the White Pass. Of the sixteen hundred and sixty who took the Edmonton routes, six hundred and eighty-five reached the Klondike, some of them after eighteen months. You are one of them, in the autumn of 1899, when the people you set out with are already leaving for Nome.",
    historicalFact: "About 1,660 travellers took the three routes from Edmonton; 685 arrived.",
    latitude: 53.54, longitude: -113.49, locationName: "Edmonton",
    source: WIKI, sourceUrl: WIKI_URL,
  },
  {
    slug: "the-slide", nodeType: "ending", title: "The slide", isEnding: true, endingType: "retry",
    narrative: "The slope above the trail lets go without a sound you can remember. Thirty feet of wet snow over ten acres of trail. The packers who stayed below dig for days, and the people they find are buried in a new cemetery at Dyea. More than sixty died on 3 April 1898. The Tlingit had said the mountain would slide. Next time, listen.",
    historicalFact: "Five slides caught stampeders that day and three took lives; one more the next day killed two others. The Slide Cemetery at Dyea holds the dead.",
    latitude: 59.65, longitude: -135.28, locationName: "Chilkoot Trail, above Sheep Camp",
    location: "Chilkoot Pass", source: "U.S. National Park Service, \"Palm Sunday Avalanche\"", sourceUrl: "https://home.nps.gov/articles/palm-sunday-avalanche.htm",
  },
  {
    slug: "the-canyon", nodeType: "ending", title: "The canyon", isEnding: true, endingType: "retry",
    narrative: "The boat goes into the canyon straight and comes out of it in pieces. You are on the bank, alive, with the clothes you stand in; the year's food, the tools and the boat are in the Yukon. The police at the foot of the rapids write your name in the book, and when the next boat with a licensed pilot comes through, the pilot takes you down to Dawson, where you will work for wages or go home. Several hundred people drowned here before the rules. Next time, pay the pilot.",
    historicalFact: "After the first drownings the police vetted every boat and required a licensed pilot on boats carrying passengers. A tramway carried goods round the canyon until the railway reached Whitehorse in 1900.",
    latitude: 60.67, longitude: -135.03, locationName: "Miles Canyon",
    location: "Miles Canyon", waterway: "Yukon River", source: STEELE + "; " + WIKI, sourceUrl: WIKI_URL,
  },
];

async function main() {
  const [locations, waterways, explorers, documents, knowledge] = await Promise.all([
    db.location.findMany({ select: { id: true, name: true } }),
    db.waterway.findMany({ select: { id: true, name: true } }),
    db.explorer.findMany({ select: { id: true, name: true } }),
    db.primarySourceDocument.findMany({ select: { id: true, title: true } }),
    db.knowledgeGiven.findMany({ select: { id: true } }),
  ]);
  const L = new Map(locations.map((x) => [x.name, x.id])), W = new Map(waterways.map((x) => [x.name, x.id])), E = new Map(explorers.map((x) => [x.name, x.id])), D = new Map(documents.map((x) => [x.title, x.id])), K = new Set(knowledge.map((x) => x.id));
  const ids = new Set(NODES.map((n) => N(n.slug)));
  const problems: string[] = [];
  for (const n of NODES) {
    if (n.location && !L.has(n.location)) problems.push(`location not found: ${n.location} (${n.slug})`);
    if (n.waterway && !W.has(n.waterway)) problems.push(`waterway not found: ${n.waterway} (${n.slug})`);
    if (n.explorer && !E.has(n.explorer)) problems.push(`explorer not found: ${n.explorer} (${n.slug})`);
    if (n.document && !D.has(n.document)) problems.push(`document not found: ${n.document} (${n.slug})`);
    if (n.knowledge && !K.has(n.knowledge)) problems.push(`knowledge not found: ${n.knowledge} (${n.slug})`);
    for (const c of n.choices ?? []) if (!ids.has(c.nextNodeId)) problems.push(`choice ${n.slug}/${c.id} points at unknown node ${c.nextNodeId}`);
    if (!n.isEnding && !(n.choices && n.choices.length)) problems.push(`no choices: ${n.slug}`);
  }
  const existing = await db.voyageurJourney.findUnique({ where: { id: JOURNEY_ID }, include: { nodes: true } });
  const backupFile = writeBackup("2026-10-20-journey-klondike-before", { journey: existing });
  if (problems.length) { report("ABORT", { problems }); process.exitCode = 1; return; }
  report("Klondike 1898 journey", { nodes: NODES.length, choices: NODES.reduce((n, x) => n + (x.choices?.length ?? 0), 0), endings: NODES.filter((n) => n.isEnding).map((n) => `${n.slug}:${n.endingType}`), backupFile });
  if (!APPLY) return;
  await db.voyageurJourney.upsert({
    where: { id: JOURNEY_ID },
    create: { id: JOURNEY_ID, title: "Klondike, 1898", description: "From the Seattle waterfront in July 1897 to Dawson in the summer of 1898: the passes, the boats, the river and the town, with every choice scored against what the stampeders actually did and what it cost them. A hundred thousand set out; this is the road the thirty thousand who arrived travelled.", gradeLevel: "7-9", difficulty: "hard", estimatedMinutes: 35, startingLocation: "Seattle", endingLocation: "Dawson City", historicalYear: 1898, isPublished: true, source: "Berton, Klondike (2001) through Wikipedia's featured article; Steele, Forty Years in Canada (1915); Adney, The Klondike Stampede (1900); Ogilvie (1897); the Canadian Encyclopedia and the Dictionary of Canadian Biography on the places and people; the app's Yukon records of 2026-10-17.", sourceUrl: WIKI_URL },
    update: { title: "Klondike, 1898", gradeLevel: "7-9", difficulty: "hard", estimatedMinutes: 35, startingLocation: "Seattle", endingLocation: "Dawson City", historicalYear: 1898, isPublished: true, source: "Berton, Klondike (2001) through Wikipedia's featured article; Steele, Forty Years in Canada (1915); Adney, The Klondike Stampede (1900); Ogilvie (1897); the Canadian Encyclopedia and the Dictionary of Canadian Biography on the places and people; the app's Yukon records of 2026-10-17.", sourceUrl: WIKI_URL },
  });
  // Stale nodes from an earlier run of this script are removed before the set is written
  await db.journeyNode.deleteMany({ where: { journeyId: JOURNEY_ID, id: { notIn: [...ids] } } });
  let i = 0;
  for (const n of NODES) {
    const data = {
      journeyId: JOURNEY_ID, nodeType: n.nodeType, orderIndex: i++, title: n.title, narrative: n.narrative, historicalFact: n.historicalFact,
      latitude: n.latitude, longitude: n.longitude, locationName: n.locationName,
      choices: n.choices ? JSON.stringify(n.choices) : null, isEnding: !!n.isEnding, endingType: n.endingType ?? null,
      locationId: n.location ? L.get(n.location)! : null, waterwayId: n.waterway ? W.get(n.waterway)! : null, explorerId: n.explorer ? E.get(n.explorer)! : null,
      documentId: n.document ? D.get(n.document)! : null, knowledgeId: n.knowledge ?? null, source: n.source, sourceUrl: n.sourceUrl ?? null,
    };
    await db.journeyNode.upsert({ where: { id: N(n.slug) }, create: { id: N(n.slug), ...data }, update: data });
  }
  const verify = await db.voyageurJourney.findUnique({ where: { id: JOURNEY_ID }, include: { nodes: { orderBy: { orderIndex: "asc" }, select: { title: true, nodeType: true, locationId: true, documentId: true } } } });
  report("verify", { title: verify?.title, nodes: verify?.nodes.length, linked: verify?.nodes.filter((n) => n.locationId).length, withDocument: verify?.nodes.filter((n) => n.documentId).length });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
