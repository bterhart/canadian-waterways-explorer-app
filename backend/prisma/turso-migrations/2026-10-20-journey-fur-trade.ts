// Roadmap item 6 (2026-10-20): the fur-trade journey over the posts. A North West Company
// brigade of 1808 from Lachine to Fort Chipewyan: seventeen stops, every one on a post or water
// in the app, every choice scored against what the voyageurs actually did and what it cost them.
//   bun run prisma/turso-migrations/2026-10-20-journey-fur-trade.ts [--apply]
//
// Sources, read for this pass: the app's own post and water records (Lachine, Sault Ste. Marie,
// Fort William, Fort Kaministiquia, Fort Lac La Pluie, Fort St. Charles, Bas-de-la-Rivière,
// Cumberland House, Île-à-la-Crosse, Methye Portage, Fort Chipewyan; the fur-trade rows of the
// Ottawa, French River, Lake Superior, the Kaministiquia, the Winnipeg River, Lake Winnipeg, the
// Saskatchewan, the Churchill, the Clearwater, the Athabasca; written from the Canadian
// Encyclopedia, Parks Canada and the DCB); Wikipedia's "Voyageurs" (resting on Nute, The
// Voyageur, 1931/1955; Podruchny, Making the Voyageur World, 2006; Morse, Fur Trade Canoe Routes
// of Canada, 1969) for the canoes, loads, pace, food and hazards; Wikipedia's "Methye Portage"
// (Morse; Keith, North of Athabasca, 2001) for the portage; Wikipedia's "North West Company"
// (Rich; Innis; Campbell) and "Cumberland House, Saskatchewan" for the company and the post.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const JOURNEY_ID = "journey_fur_trade_1808";
const N = (slug: string) => `${JOURNEY_ID}_${slug}`;

const VOY = "Nute, The Voyageur (1931); Podruchny, Making the Voyageur World (2006); Morse, Fur Trade Canoe Routes of Canada (1969), through Wikipedia's \"Voyageurs\"";
const VOY_URL = "https://en.wikipedia.org/wiki/Voyageurs";
const METHYE = "Morse, Fur Trade Canoe Routes of Canada (1969); Keith, North of Athabasca (2001), through Wikipedia's \"Methye Portage\"";
const METHYE_URL = "https://en.wikipedia.org/wiki/Methye_Portage";
const NWC = "Rich, Montreal and the Fur Trade (1966); Innis, The Fur Trade in Canada (1930), through Wikipedia's \"North West Company\"";
const NWC_URL = "https://en.wikipedia.org/wiki/North_West_Company";
const TCE = (slug: string) => `https://www.thecanadianencyclopedia.ca/en/article/${slug}`;

interface Choice { id: string; text: string; nextNodeId: string; consequence: string; pointsChange: number; whatHappened: string; source: string }
interface Node {
  slug: string; nodeType: "story" | "choice" | "ending"; title: string; narrative: string; historicalFact: string;
  latitude: number; longitude: number; locationName: string;
  location?: string; waterway?: string; explorer?: string; document?: string; knowledge?: string; source: string; sourceUrl?: string;
  choices?: Choice[]; isEnding?: boolean; endingType?: "success" | "partial" | "retry";
}

const NODES: Node[] = [
  {
    slug: "lachine", nodeType: "story", title: "Lachine, May 1808",
    narrative: "Above the rapids that stopped every ship, the North West Company's warehouses stand on the river at Lachine, and in the first week of May the brigade is loading. The canot du maître in front of you is thirty-six feet long and carries three tons: sixty-five pièces of ninety pounds each, trade goods for the north, with eight to ten of you to paddle it. You signed your engagement in a notary's office in Montreal this winter, a mangeur de lard, a pork-eater, bound to Lake Superior and back by autumn. The guide is calling the roll.",
    historicalFact: "The canot du maître was about 36 feet long, weighed about 600 pounds and carried about 65 pièces of 90 pounds. Crews were six to twelve, usually eight to ten. The company employed nearly 2,500 people in 1799.",
    latitude: 45.43, longitude: -73.67, locationName: "Lachine, above the rapids",
    location: "Lachine", waterway: "St. Lawrence River", explorer: "William McGillivray",
    source: "The Canadian Encyclopedia, \"Lachine\"; " + VOY, sourceUrl: VOY_URL,
    choices: [
      { id: "embark", text: "Take your place in the canoe", nextNodeId: N("ottawa"), consequence: "The guide sings the first line and the brigade pulls away.", pointsChange: 5, whatHappened: "Brigades left Lachine in May as soon as the ice was out of the Ottawa, to reach Lake Superior for the July rendezvous and be home before the autumn gales.", source: VOY },
    ],
  },
  {
    slug: "ottawa", nodeType: "choice", title: "The portages of the Ottawa",
    narrative: "The Ottawa is a river of rapids, and at every one the canoe is emptied and the cargo goes over the portage on men's backs. The load is set by custom: two pièces at a time, a hundred and eighty pounds, on a tumpline across the forehead, at a trot. Some men carry more to shorten the day. The guide watches who does what. You have three dozen portages between here and Lake Huron.",
    historicalFact: "Voyageurs rose at two or three in the morning, paddled about fourteen hours a day at about 55 strokes a minute, and stopped about every hour for a pipe; distance was reckoned in pipes.",
    latitude: 45.57, longitude: -74.63, locationName: "Long Sault of the Ottawa",
    waterway: "Ottawa River",
    source: VOY, sourceUrl: VOY_URL,
    choices: [
      { id: "two", text: "Two pièces a trip, as the custom is", nextNodeId: N("nipissing"), consequence: "Your back holds and the brigade keeps its pace.", pointsChange: 10, whatHappened: "Two ninety-pound pièces a trip was the standard load; a voyageur was expected to carry it at a trot.", source: VOY },
      { id: "four", text: "Four pièces, to make a name for yourself", nextNodeId: N("nipissing"), consequence: "The men cheer. Something in your groin does not.", pointsChange: -10, whatHappened: "Some carried four or five, and one was reported carrying seven for half a mile. Hernias were common among voyageurs and frequently fatal; drowning was the other great killer.", source: VOY },
      { id: "one", text: "One pièce at a time; there is no hurry", nextNodeId: N("nipissing"), consequence: "The brigade waits for you twice. The guide says nothing, which is worse.", pointsChange: -5, whatHappened: "A brigade moved at the pace of its slowest canoe, and a man who slowed it was not engaged again.", source: VOY },
    ],
  },
  {
    slug: "nipissing", nodeType: "choice", title: "Wind on Lake Nipissing",
    narrative: "From the Mattawa the brigade carries over the height of land to Lake Nipissing, and the lake is white with wind. The French River is on the far side, and beyond it Georgian Bay and the open lakes. A canot du maître loaded to the gunwales does not like a beam sea. The guide looks at the sky. The men look at the guide.",
    historicalFact: "The Ottawa, Mattawa, Nipissing and French River route was the voyageur highway from Montreal to the upper lakes from Champlain's day to 1821.",
    latitude: 46.28, longitude: -79.8, locationName: "Lake Nipissing",
    waterway: "Lake Nipissing",
    source: "The app's French River record; " + VOY, sourceUrl: VOY_URL,
    choices: [
      { id: "wait", text: "Make camp and wait for the wind to drop (dégradé)", nextNodeId: N("sault"), consequence: "A day lost on the beach, mending the canoe and smoking.", pointsChange: 10, whatHappened: "Brigades were wind-bound, dégradés, for days on the big lakes; the guide decided, and a guide who lost a canoe lost his place.", source: VOY },
      { id: "cross", text: "Cross now; the rendezvous will not wait", nextNodeId: N("the-lake"), consequence: "A wave comes over the bow, then another.", pointsChange: -20, whatHappened: "Drowning was common among voyageurs. The crosses on the shores of the big lakes marked where canoes had been lost.", source: VOY },
    ],
  },
  {
    slug: "sault", nodeType: "story", title: "Baawitigong, the Sault",
    narrative: "At the rapids between Lake Huron and Lake Superior the whole cargo is carried again, past the Ojibwe fishery at Baawitigong, 'at the rapids', where the whitefish run and people have gathered for longer than anyone can say. The company keeps a post here, the French had a mission here in 1668, and the Americans across the river have cut a small canal. You buy fish. The guide buys fish. Everyone buys fish.",
    historicalFact: "Baawitigong means 'at the rapids'. The annual whitefish runs made the Sault a gathering place for centuries; the first canal, on the American side, was dug in 1797.",
    latitude: 46.5, longitude: -84.35, locationName: "Sault Ste. Marie",
    location: "Sault Ste. Marie Post", waterway: "Lake Superior",
    source: "The Canadian Encyclopedia, \"Sault Ste. Marie\"; Parks Canada, Sault Ste. Marie Canal National Historic Site", sourceUrl: TCE("sault-ste-marie"),
    choices: [
      { id: "on", text: "Load above the rapids and go on to the big lake", nextNodeId: N("superior"), consequence: "Lake Superior opens in front of you, grey to the horizon.", pointsChange: 5, whatHappened: "Every cargo on the route was carried round the rapids at the Sault until the canals were built.", source: "The Canadian Encyclopedia, \"Sault Ste. Marie\"" },
    ],
  },
  {
    slug: "superior", nodeType: "choice", title: "The north shore of Superior",
    narrative: "Lake Superior is a sea with the temper of one. The brigade follows the north shore, bay after bay, and at every headland the guide decides whether to cut across the open water or follow the shoreline round. Across saves hours. Round saves canoes. Somewhere ahead is the Kaministiquia and the company's new fort.",
    historicalFact: "The brigades from Montreal met the north canoes from the interior at Grand Portage until 1803 and at Fort William after it; the rendezvous was the highlight of the fur-trade year.",
    latitude: 48.0, longitude: -86.0, locationName: "North shore of Lake Superior",
    waterway: "Lake Superior",
    source: "The app's Lake Superior record; " + VOY, sourceUrl: VOY_URL,
    choices: [
      { id: "shore", text: "Round the bays, close to the shore", nextNodeId: N("fort-william"), consequence: "Longer, and every night you sleep on a beach you could reach.", pointsChange: 10, whatHappened: "The brigades hugged the shore and waited out wind; the open-water traverses were where canoes were lost.", source: VOY },
      { id: "traverse", text: "Straight across the bays, to make up the lost day", nextNodeId: N("fort-william"), consequence: "You make it, white-knuckled, and the guide does not thank you for it.", pointsChange: -5, whatHappened: "Traverses were made in calm weather and dreaded in any other; the guide's judgement of the lake was what he was paid for.", source: VOY },
    ],
  },
  {
    slug: "fort-william", nodeType: "choice", title: "The rendezvous at Fort William",
    narrative: "The fort at the mouth of the Kaministiquia is the company's new headquarters, built since 1803 when the Grand Portage fell on the American side; next year they will name it for William McGillivray. In July two thousand people are here: the partners from Montreal and the wintering partners from the interior in the Great Hall, the Montreal brigades and the north men camped at opposite ends of the shore, and a regale of rum for all. The furs go east, the goods go west. And here is your choice. Your engagement ends when you get home to Lachine. Or you can sign for three years in the north.",
    historicalFact: "Up to 2,000 people gathered at Fort William for the rendezvous. About a third of the pork-eaters became north men. The wintering partners held one or two shares and ran the districts; the Montreal agents shipped the furs and earned the commissions.",
    latitude: 48.3808, longitude: -89.2477, locationName: "Fort William, mouth of the Kaministiquia",
    location: "Fort William", waterway: "Kaministiquia River", explorer: "William McGillivray", document: "Harmon's Journal of Voyages and Travels in the Interior of North America, 1820",
    source: "Parks Canada, Fort William National Historic Site; " + NWC + "; " + VOY, sourceUrl: NWC_URL,
    choices: [
      { id: "north", text: "Sign for three years as a north man", nextNodeId: N("kaministiquia"), consequence: "You move your blanket to the north men's camp. They look at you the way you looked at the pork-eaters.", pointsChange: 10, whatHappened: "About one in three pork-eaters signed on as hommes du nord. The north men wintered inland, in canots du nord, and were the company's trade.", source: VOY },
      { id: "home", text: "Take the furs back to Lachine, as you signed to do", nextNodeId: N("pork-eater"), consequence: "A summer's wages and home by September.", pointsChange: 5, whatHappened: "Two-thirds of the pork-eaters went home each autumn; the Montreal brigade carried the year's furs back down the lakes and the Ottawa.", source: VOY },
      { id: "regale", text: "Spend the regale and the week's wages in the canteen", nextNodeId: N("kaministiquia"), consequence: "You wake in the north men's camp, signed for three years, with no memory of the pen.", pointsChange: -10, whatHappened: "The rendezvous was a time of rest and revelry; the company's rum and the men's wages met at the canteen, and many a north man was made there.", source: VOY },
    ],
  },
  {
    slug: "kaministiquia", nodeType: "story", title: "The Kaministiquia and the Great Dog",
    narrative: "The north canoes leave Fort William by the Kaministiquia: twenty-five feet long, five or six men, twenty-five to thirty pièces. The river climbs past the falls at Kakabeka by the Mountain Portage and over the Great Dog Portage to Dog Lake and the Savanne, and so to Lac des Mille Lacs and the border lakes, the company's road since the Pigeon River route fell to the Americans. The north men carry the same two pièces, uphill.",
    historicalFact: "The canot du nord was about 25 feet long, weighed about 300 pounds and carried 25 to 30 pièces with a crew of four to eight, usually five or six. Fort William's route up the Kaministiquia replaced the Grand Portage from 1803.",
    latitude: 48.4, longitude: -89.62, locationName: "Kakabeka Falls, Kaministiquia River",
    location: "Fort Kaministiquia", waterway: "Kaministiquia River",
    source: "The app's Kaministiquia record; " + VOY, sourceUrl: VOY_URL,
    choices: [
      { id: "on", text: "Over the Great Dog and on to the border lakes", nextNodeId: N("rainy-lake"), consequence: "Days of portages, then the lakes string out ahead.", pointsChange: 5, whatHappened: "The Mountain Portage and the Great Dog Portage were the worst of the Kaministiquia road; the north brigades took them in the last days of July.", source: "The app's Kaministiquia record" },
    ],
  },
  {
    slug: "rainy-lake", nodeType: "story", title: "Fort Lac La Pluie",
    narrative: "At the outlet of Rainy Lake stands the company's post on La Vérendrye's ground of 1731, Fort Lac La Pluie, where every canoe on the border-lakes route stops. The Athabasca brigade, which has the farthest to go, picks up its goods here from a depot sent ahead, so that it can turn round before the north freezes. The Anishinaabe of the lake have traded here for three generations of forts.",
    historicalFact: "Fort St. Pierre at the lake's outlet (1731) was La Vérendrye's first western post; the North West Company's fort stood here from the 1790s and was renamed Fort Frances in 1830.",
    latitude: 48.61, longitude: -93.4, locationName: "Fort Lac La Pluie, Rainy River",
    location: "Fort Lac La Pluie (Fort Frances)", waterway: "Rainy River", explorer: "Pierre Gaultier de Varennes, Sieur de La Vérendrye",
    source: "The Canadian Encyclopedia, \"Fort Frances\"; the app's Rainy Lake record", sourceUrl: TCE("fort-frances"),
    choices: [
      { id: "on", text: "Take the Athabasca goods aboard and go on down the Rainy River", nextNodeId: N("bas-de-la-riviere"), consequence: "Lake of the Woods, the Winnipeg River, forty portages.", pointsChange: 5, whatHappened: "The Athabasca brigade met its outfit at Rainy Lake rather than Fort William, because it could not reach the Athabasca and get back before freeze-up otherwise.", source: NWC },
    ],
  },
  {
    slug: "bas-de-la-riviere", nodeType: "choice", title: "Bas-de-la-Rivière",
    narrative: "Where the Winnipeg River meets Lake Winnipeg the company's post at Bas-de-la-Rivière is a provisioning depot, and this is where the north brigades take on pemmican: buffalo meat, dried, pounded and sealed in fat in ninety-pound bags, from the plains to the south. A northern canoe with six men needs about four packs of food for every five hundred miles. There is no hunting on the way to Athabasca; there is no time.",
    historicalFact: "A north canoe with six men and twenty-five packs needed about four packs of food per 500 miles. The diet was pemmican, salt pork, dried peas or corn and biscuit.",
    latitude: 50.62, longitude: -96.34, locationName: "Bas-de-la-Rivière, mouth of the Winnipeg River",
    location: "Bas-de-la-Rivière (Fort Alexander)", waterway: "Winnipeg River",
    source: "The app's Winnipeg River and Bas-de-la-Rivière records; " + VOY, sourceUrl: VOY_URL,
    choices: [
      { id: "pemmican", text: "Load the pemmican, as many bags as the canoe will take", nextNodeId: N("lake-winnipeg"), consequence: "Heavy, and you will eat every bag of it.", pointsChange: 10, whatHappened: "Brigades took on pemmican at Bas-de-la-Rivière for the long haul north and west; it was the fuel of the trade, and the fight over it with Selkirk's colony became the Pemmican War of 1814-16.", source: "The app's Winnipeg River record; " + NWC },
      { id: "goods", text: "Leave some pemmican for more trade goods; furs are what pay", nextNodeId: N("lake-winnipeg"), consequence: "The canoe is lighter and by the Churchill the men are hungry and slow.", pointsChange: -10, whatHappened: "Brigades that ran short of provisions lost days hunting and fishing or went hungry; the company's whole system of depots existed so that they would not.", source: VOY },
    ],
  },
  {
    slug: "lake-winnipeg", nodeType: "choice", title: "The traverse of Lake Winnipeg",
    narrative: "Lake Winnipeg is shallow, long and quick to rise, and the brigade has to cross it to the mouth of the Saskatchewan at Grand Rapids. The guide wants to run up the east shore and cross where it narrows. The wind is fair for once and the young men want to make a straight traverse and save two days.",
    historicalFact: "La Vérendrye reached Lake Winnipeg in 1733; the lake was the crossroads of the western trade, and Norway House at its northern end became the Hudson's Bay Company's headquarters after 1821.",
    latitude: 52.1, longitude: -97.25, locationName: "Lake Winnipeg",
    waterway: "Lake Winnipeg",
    source: "The app's Lake Winnipeg record; " + VOY, sourceUrl: VOY_URL,
    choices: [
      { id: "shore", text: "Up the shore, and cross at the narrows", nextNodeId: N("cumberland-house"), consequence: "Two more days of paddling. Everyone arrives.", pointsChange: 10, whatHappened: "The brigades kept to the shores of the big lakes and crossed where they must; a fair wind on Lake Winnipeg could turn in an hour.", source: VOY },
      { id: "traverse", text: "Straight across while the wind serves", nextNodeId: N("the-lake"), consequence: "The wind turns in the middle of the lake.", pointsChange: -20, whatHappened: "Drowning was the commonest death in the trade, and open water on the big lakes took the most.", source: VOY },
    ],
  },
  {
    slug: "cumberland-house", nodeType: "story", title: "Cumberland House",
    narrative: "Up the Saskatchewan from Grand Rapids the brigade reaches Cumberland House, the post Samuel Hearne built for the Hudson's Bay Company in 1774 to meet the Montreal traders inland, forty days' paddling from York Factory, and beside it since 1793 the North West Company's own post. The two companies watch each other across a strip of ground. From here the Saskatchewan runs west to the mountains; the Sturgeon-Weir runs north to the Churchill, and that is your road.",
    historicalFact: "Cumberland House is Saskatchewan's oldest continuously inhabited community. Peter Fidler and David Thompson both served here. The two companies' posts were merged in 1821.",
    latitude: 53.97, longitude: -102.27, locationName: "Cumberland House, Saskatchewan River",
    location: "Cumberland House", waterway: "Saskatchewan River", explorer: "Samuel Hearne",
    source: "The Canadian Encyclopedia, \"Cumberland House\"; Wikipedia, \"Cumberland House, Saskatchewan\"", sourceUrl: TCE("cumberland-house"),
    choices: [
      { id: "on", text: "Turn north up the Sturgeon-Weir toward the Churchill", nextNodeId: N("ile-a-la-crosse"), consequence: "Rapids all the way: the Sturgeon-Weir is called the Rivière Maligne for a reason.", pointsChange: 5, whatHappened: "The Athabasca brigade left the Saskatchewan at Cumberland House and went north by the Sturgeon-Weir and Frog Portage to the Churchill, the 'English River'.", source: "The app's Churchill River record" },
    ],
  },
  {
    slug: "ile-a-la-crosse", nodeType: "story", title: "Île-à-la-Crosse",
    narrative: "Over Frog Portage into the Churchill and up it for weeks, past the Cree and into the Dene country, to the lake where Thomas Frobisher built his post in 1776 and the roads part: north-east down the Churchill to the Bay, north-west to the Athabasca. Both companies keep posts here through the trade war. The men are thin. The pemmican is holding. It is the end of August.",
    historicalFact: "Île-à-la-Crosse is one of the oldest continuously settled places in Saskatchewan and a Métis community today; the Hudson's Bay Company's post of 1799 became the district headquarters.",
    latitude: 55.45, longitude: -107.88, locationName: "Île-à-la-Crosse, upper Churchill",
    location: "Île-à-la-Crosse", waterway: "Churchill River", explorer: "Thomas Frobisher",
    source: "The app's Île-à-la-Crosse record; the app's Churchill River record", sourceUrl: TCE("ile-a-la-crosse"),
    choices: [
      { id: "on", text: "North-west, up the Churchill to Lac La Loche", nextNodeId: N("methye"), consequence: "The last lakes before the height of land.", pointsChange: 5, whatHappened: "From Île-à-la-Crosse the Athabasca road went up the Churchill through Buffalo Narrows to Lac La Loche and the Methye Portage.", source: METHYE },
    ],
  },
  {
    slug: "methye", nodeType: "choice", title: "The Methye Portage",
    narrative: "Nineteen kilometres of carrying: the longest portage on the whole road from Montreal, over the height of land between the waters that run to Hudson Bay and the waters that run to the Arctic. Peter Pond crossed it for the trade in 1778, and the Dene long before him. Thirteen kilometres in, at Rendezvous Lake, the brigade coming up from Athabasca with the winter's furs is waiting. The custom is to exchange loads there: they take your goods back down to the Clearwater, you take their furs back the way you came, and no one carries the whole portage twice. Beyond the lake the trail comes out above the Clearwater valley, two hundred metres below, the finest sight in the north-west.",
    historicalFact: "The portage is 19 km. The divide at Rendezvous Lake is about 13 km in; the trail then drops about 180 m to the Clearwater in 5 to 6 km. Boats were rarely carried across; loads were exchanged.",
    latitude: 56.5, longitude: -109.4, locationName: "Methye Portage (Portage La Loche)",
    location: "Methye Portage", waterway: "Clearwater River", explorer: "Peter Pond", document: "Peter Pond's Narrative and Map, 1785",
    source: METHYE + "; the app's Methye Portage record", sourceUrl: METHYE_URL,
    choices: [
      { id: "exchange", text: "Exchange loads with the Athabasca brigade at Rendezvous Lake", nextNodeId: N("athabasca"), consequence: "Your goods go on north on other backs; you carry furs south and cross again with the next outfit.", pointsChange: 15, whatHappened: "Crews from north and south exchanged pack loads at Rendezvous Lake; different canoes were used above and below the portage, so canoes were rarely carried across.", source: METHYE },
      { id: "carry", text: "Carry your own outfit all the way over; you do not trust their count", nextNodeId: N("athabasca"), consequence: "Twelve miles out, two hundred metres down, and back for the next two pièces. Days.", pointsChange: -5, whatHappened: "The steep descent to the Clearwater later needed sledges, horses and oxen; the exchange at the lake existed because carrying a full outfit over was ruinous.", source: METHYE },
    ],
  },
  {
    slug: "athabasca", nodeType: "story", title: "Down the Clearwater to Athabasca",
    narrative: "Below the portage the Clearwater runs fast and clean to the Athabasca, and the Athabasca runs north, wide and brown, through the finest beaver country on the continent. The brigade is racing the ice now. Fort Chipewyan on Lake Athabasca was the company's post from 1788, the fort Mackenzie left for the Arctic in 1789 and the Pacific in 1793, with Roderick Mackenzie's library in it. The Chipewyan who brought Pond his first furs trade here still.",
    historicalFact: "Peter Pond's 1778 expedition opened the Athabasca trade; its beaver were the finest in North America, and Fort Chipewyan became the central depot of the company's richest department.",
    latitude: 56.8, longitude: -111.4, locationName: "Athabasca River",
    waterway: "Athabasca River", explorer: "Alexander Mackenzie",
    source: "The app's Clearwater and Athabasca records; " + NWC, sourceUrl: NWC_URL,
    choices: [
      { id: "arrive", text: "Paddle the last miles to Fort Chipewyan", nextNodeId: N("north-man"), consequence: "The fort's flag is up and the lake is still open.", pointsChange: 5, whatHappened: "The Athabasca brigade reached Fort Chipewyan in September or October, weeks before the ice, and its men wintered there and at the outposts.", source: NWC },
    ],
  },
  {
    slug: "north-man", nodeType: "ending", title: "A north man", isEnding: true, endingType: "success",
    narrative: "Fort Chipewyan, late September. You have come three thousand miles from Lachine by paddle and tumpline, over the longest portage and across the biggest lakes, on pemmican and rum, and you are an homme du nord now, with two winters still owed. In the spring you will go back over the Methye with the furs, meet the pork-eaters at Rainy Lake, and do it again. In 1821 the companies will merge, the Montreal road will close in favour of York Factory and the Bay, and the brigade you came with will be history. The posts you passed are on the map.",
    historicalFact: "After the merger of 1821 the trade moved to York Factory and Hudson Bay; Fort William became a minor post and the Montreal brigades ended.",
    latitude: 58.7181, longitude: -111.1519, locationName: "Fort Chipewyan, Lake Athabasca",
    location: "Fort Chipewyan", waterway: "Lake Athabasca", explorer: "Alexander Mackenzie", document: "Turnor's Journal of the Survey to Lake Athabasca, 1790",
    source: "The Canadian Encyclopedia, \"Fort Chipewyan\"; " + NWC, sourceUrl: TCE("fort-chipewyan"),
  },
  {
    slug: "pork-eater", nodeType: "ending", title: "A pork-eater goes home", isEnding: true, endingType: "partial",
    narrative: "You did what you signed for. The Montreal brigade leaves Fort William in late July with the year's furs, down the lakes and the French River and the Ottawa, and you are in Lachine by September with your wages, which the company will have most of back by spring. Two in three did the same. Next May, if you want, there is a canoe.",
    historicalFact: "Pork-eaters, mangeurs de lard, worked the summer run between Montreal and Lake Superior; about a third became north men.",
    latitude: 45.43, longitude: -73.67, locationName: "Lachine",
    location: "Lachine", waterway: "St. Lawrence River", source: VOY, sourceUrl: VOY_URL,
  },
  {
    slug: "the-lake", nodeType: "ending", title: "The lake", isEnding: true, endingType: "retry",
    narrative: "The canoe broaches in the second wave and the lake takes it, the cargo and two of the men. The rest of you are picked off the shore by the next brigade, and the guide is never given a canoe again. The crosses on the headlands of the big lakes are for days like this. Next time, wait for the wind.",
    historicalFact: "Drowning was common among voyageurs; the guide's judgement of wind and water was what he was paid for.",
    latitude: 46.28, longitude: -79.8, locationName: "The big lakes",
    source: VOY, sourceUrl: VOY_URL,
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
  const ids = new Set(NODES.map((n) => N(n.slug)));
  const problems: string[] = [];
  for (const n of NODES) {
    if (n.location && !L.has(n.location)) problems.push(`location not found: ${n.location} (${n.slug})`);
    if (n.waterway && !W.has(n.waterway)) problems.push(`waterway not found: ${n.waterway} (${n.slug})`);
    if (n.explorer && !E.has(n.explorer)) problems.push(`explorer not found: ${n.explorer} (${n.slug})`);
    if (n.document && !D.has(n.document)) problems.push(`document not found: ${n.document} (${n.slug})`);
    for (const c of n.choices ?? []) if (!ids.has(c.nextNodeId)) problems.push(`choice ${n.slug}/${c.id} points at unknown node ${c.nextNodeId}`);
    if (!n.isEnding && !(n.choices && n.choices.length)) problems.push(`no choices: ${n.slug}`);
  }
  const existing = await db.voyageurJourney.findUnique({ where: { id: JOURNEY_ID }, include: { nodes: true } });
  const backupFile = writeBackup("2026-10-20-journey-fur-trade-before", { journey: existing });
  if (problems.length) { report("ABORT", { problems }); process.exitCode = 1; return; }
  report("fur-trade journey", { nodes: NODES.length, choices: NODES.reduce((n, x) => n + (x.choices?.length ?? 0), 0), endings: NODES.filter((n) => n.isEnding).map((n) => `${n.slug}:${n.endingType}`), backupFile });
  if (!APPLY) return;
  const journey = { title: "The Brigade: Lachine to Athabasca, 1808", description: "A North West Company brigade from the warehouses at Lachine to Fort Chipewyan on Lake Athabasca: the Ottawa portages, the big lakes, the rendezvous at Fort William, the pemmican at Bas-de-la-Rivière, Cumberland House, the Churchill and the Methye Portage, with every choice scored against what the voyageurs actually did and what it cost them. Every stop is one of the company's posts or waters in the app.", gradeLevel: "7-9", difficulty: "medium", estimatedMinutes: 35, startingLocation: "Lachine", endingLocation: "Fort Chipewyan", historicalYear: 1808, isPublished: true, source: "Nute, The Voyageur (1931); Podruchny, Making the Voyageur World (2006); Morse, Fur Trade Canoe Routes of Canada (1969); Rich, Montreal and the Fur Trade (1966); the Canadian Encyclopedia, Parks Canada and the DCB on the posts; the app's post and water records.", sourceUrl: VOY_URL };
  await db.voyageurJourney.upsert({ where: { id: JOURNEY_ID }, create: { id: JOURNEY_ID, ...journey }, update: journey });
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
  const verify = await db.voyageurJourney.findUnique({ where: { id: JOURNEY_ID }, include: { nodes: { orderBy: { orderIndex: "asc" }, select: { title: true, locationId: true, waterwayId: true, documentId: true } } } });
  report("verify", { title: verify?.title, nodes: verify?.nodes.length, withPlace: verify?.nodes.filter((n) => n.locationId).length, withWater: verify?.nodes.filter((n) => n.waterwayId).length, withDocument: verify?.nodes.filter((n) => n.documentId).length });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
