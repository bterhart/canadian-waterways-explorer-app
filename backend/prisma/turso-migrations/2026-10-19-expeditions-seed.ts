// Expedition route layer seed (2026-10-19, roadmap item 2): eighteen dated journeys with their legs
// in order, each ordered from the Dictionary of Canadian Biography article named on it (read in full
// on 2026-10-19) and, where noted, the explorer's published journal read earlier in this work.
//   bun run prisma/turso-migrations/2026-10-19-expeditions-seed.ts [--apply]
//
// A leg is one waterway in the database on the route, with the year and, where the database has
// the historic place, the place the journey touched there. Legs name only waters the source puts the
// party on, in the order the source gives; a water the party crossed that the database lacks (the
// Carrot River, Chantrey Inlet, Pelly Bay, the Missouri) is left out rather than approximated.
// Idempotent by expedition name; inserts only.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

type Leg = { w: string; l?: string; y?: number; n: string };
type Exp = { explorer: string; name: string; start: number; end?: number; color: string; summary: string; source: string; legs: Leg[] };

const DCB = (slug: string, title: string) => `${title}, Dictionary of Canadian Biography (biographi.ca/en/bio/${slug}.html)`;

const EXPEDITIONS: Exp[] = [
  {
    explorer: "Alexander Mackenzie", name: "To the Arctic Ocean", start: 1789, color: "#1D4ED8",
    summary: "From Fort Chipewyan on 3 June 1789 down the Slave River, across Great Slave Lake and down the great river that now bears his name, 1,075 miles in fourteen days, to Whale Island at its mouth; the river led to the Arctic, not the Pacific.",
    source: DCB("mackenzie_alexander_5E", "W. Kaye Lamb, 'Mackenzie, Sir Alexander'"),
    legs: [
      { w: "Lake Athabasca", l: "Fort Chipewyan", y: 1789, n: "Set out from the new Fort Chipewyan on 3 June 1789 with four voyageurs, English Chief and his people." },
      { w: "Slave River", y: 1789, n: "Travel slow and difficult in the upper Slave River, where rapids were frequent." },
      { w: "Great Slave Lake", y: 1789, n: "Ice delayed the party in Great Slave Lake." },
      { w: "Mackenzie River", y: 1789, n: "The full length of the river, about 1,075 miles, covered in only fourteen days." },
      { w: "Beaufort Sea", y: 1789, n: "Four nights on Whale Island (Garry Island) off the river's mouth; misty weather, but there is no doubt he reached the sea." },
    ],
  },
  {
    explorer: "Alexander Mackenzie", name: "To the Pacific", start: 1793, color: "#B91C1C",
    summary: "From Fort Fork on the Peace on 9 May 1793 up the Peace and the Parsnip, over the divide by the Bad River to the Fraser, back up to the West Road and overland to the Bella Coola and the sea; on 22 July he wrote his memorial on the rock in Dean Channel.",
    source: DCB("mackenzie_alexander_5E", "W. Kaye Lamb, 'Mackenzie, Sir Alexander'") + "; Alexander Mackenzie, Voyages from Montreal (London, 1801)",
    legs: [
      { w: "Peace River", y: 1793, n: "Left Fort Fork, near the junction of the Peace and Smoky rivers, on 9 May 1793 in a 25-foot canoe with nine men." },
      { w: "Parsnip River", y: 1793, n: "At the forks by the end of May; chose the Parsnip on an old man's advice that a carrying place at its head led to a river flowing west." },
      { w: "Fraser River", l: "Fort Alexandria", y: 1793, n: "Down the McGregor to the Fraser on 18 June, taking it for the Columbia; four days later as far as the future site of Fort Alexandria, where the Dakelh advised the overland route." },
      { w: "Bella Coola River", y: 1793, n: "Cached the canoe near the West Road on 4 July and walked west on the grease trail to the Nuxalk villages on the Bella Coola, then by canoe down to tidewater." },
      { w: "Dean Channel", l: "Mackenzie Rock", y: 1793, n: "Down North Bentinck Arm into Dean Channel; the night of 21 July on the rock where he painted his memorial, dated the twenty-second of July." },
    ],
  },
  {
    explorer: "Simon Fraser", name: "Descent of the Fraser", start: 1808, color: "#0F766E",
    summary: "From Fort George on 28 May 1808 with 24 men in four canoes down the river that was still believed to be the Columbia, through the canyon where the party climbed the Nlaka'pamux ladders, to the Musqueam village and the Strait of Georgia on 2 July, and back.",
    source: DCB("fraser_simon_9E", "W. Kaye Lamb, 'Fraser, Simon'") + "; Fraser's journal in Masson, Les Bourgeois de la Compagnie du Nord-Ouest, vol. I (1889)",
    legs: [
      { w: "Fraser River", l: "Fort George (NWC - BC)", y: 1808, n: "The party of 24 left Fort George, near the mouth of the Nechako, in four canoes on 28 May 1808." },
      { w: "Thompson River", y: 1808, n: "Past the mouth of the river he named for David Thompson, where the canyon begins; below Spuzzum the party went by the Nlaka'pamux footpaths and ladders along the cliffs." },
      { w: "Georgia Strait", y: 1808, n: "At the mouth the Cowichan were first suspicious and then hostile; unable to go as far into the Strait of Georgia as he wished, he turned back up the river." },
    ],
  },
  {
    explorer: "Samuel Hearne", name: "Third journey to the Coppermine", start: 1770, end: 1772, color: "#7C2D12",
    summary: "Left Prince of Wales's Fort with Matonabbee on 7 December 1770, travelled west and then north on foot, reached the Coppermine on 14 July 1771 and followed it to the sea past Bloody Falls, crossed Great Slave Lake in midwinter, and was back at the fort on 30 June 1772.",
    source: DCB("hearne_samuel_4E", "C. S. Mackinnon, 'Hearne, Samuel'") + "; Hearne, A Journey from Prince of Wales's Fort (Champlain Society, 1911)",
    legs: [
      { w: "Churchill River", l: "Prince of Wales Fort", y: 1770, n: "The third expedition left Prince of Wales's Fort on 7 December 1770, Hearne attached to Matonabbee's band." },
      { w: "Coppermine River", l: "Bloody Falls", y: 1771, n: "Reached the Coppermine on 14 July 1771; shoals and falls made it useless for navigation; the massacre of the Inuit camp at Bloody Falls on 17 July." },
      { w: "Coronation Gulf", y: 1771, n: "Followed the river to its mouth on the Arctic sea, the first European to reach it overland." },
      { w: "Great Slave Lake", y: 1771, n: "On the return, in midwinter, the first European to see and cross Great Slave Lake." },
      { w: "Churchill River", l: "Prince of Wales Fort", y: 1772, n: "Back at Prince of Wales's Fort on 30 June 1772 after 32 months of travel." },
    ],
  },
  {
    explorer: "Sir John Franklin", name: "First overland expedition", start: 1819, end: 1822, color: "#1E3A8A",
    summary: "From York Factory in 1819 inland to Cumberland House, by snowshoe to Fort Chipewyan, north by Great Slave Lake to winter at Fort Enterprise, down the Coppermine to the sea in 1821 and east along the coast to Point Turnagain on the Kent Peninsula, then the starving return across the Barrens.",
    source: DCB("franklin_john_7E", "Janice Cavell, 'Franklin, Sir John'"),
    legs: [
      { w: "Hayes River", l: "York Factory", y: 1819, n: "Arrived at York Factory on 30 August 1819 with Back, Hood, Richardson and Hepburn." },
      { w: "Saskatchewan River", l: "Cumberland House", y: 1819, n: "To Cumberland House on the Saskatchewan; Franklin, Back and Hepburn left it in mid January 1820 on a nearly 800-mile snowshoe trip to Lake Athabasca." },
      { w: "Lake Athabasca", l: "Fort Chipewyan", y: 1820, n: "Stayed at the North West Company's Fort Chipewyan; left on 18 July 1820 with only a week's food." },
      { w: "Great Slave Lake", l: "Fort Providence", y: 1820, n: "Met Akaitcho and his Yellowknife band near Fort Providence and continued north on 2 August 1820 to winter at Fort Enterprise." },
      { w: "Coppermine River", l: "Fort Enterprise", y: 1821, n: "Began the northern journey in July 1821 with inadequate provisions, down the Coppermine to the sea." },
      { w: "Coronation Gulf", y: 1821, n: "East along the coast in canoes to the Kent Peninsula, where the outward journey ended on 21 August 1821; then the overland trek back to Fort Enterprise." },
    ],
  },
  {
    explorer: "Sir John Franklin", name: "Second overland expedition", start: 1825, end: 1827, color: "#5B21B6",
    summary: "Winter quarters at Fort Franklin on Great Bear Lake in 1825; in 1826 down the Mackenzie in purpose-built boats to its mouth, where Franklin and Back turned west along the coast toward Bering Strait and Richardson and Kendall east to the Coppermine.",
    source: DCB("franklin_john_7E", "Janice Cavell, 'Franklin, Sir John'"),
    legs: [
      { w: "Great Bear Lake", l: "Fort Franklin", y: 1825, n: "Winter quarters established at Fort Franklin on Great Bear Lake in the summer of 1825." },
      { w: "Mackenzie River", y: 1826, n: "In 1826 the expedition descended the Mackenzie in specially constructed boats." },
      { w: "Beaufort Sea", y: 1826, n: "From the mouth, Franklin and Back turned west along the coast; on 16 August he turned back, 160 miles short of the boat sent from HMS Blossom." },
    ],
  },
  {
    explorer: "Sir George Back", name: "Great Fish River expedition", start: 1833, end: 1835, color: "#0369A1",
    summary: "Sent to find John Ross: from Fort Resolution in 1833 Back located the Thlew-ee-choh on 29 August and wintered at Fort Reliance; in 1834 he reached the river on 28 June, descended it in a month to the sea, spent three weeks in Chantrey Inlet and was back at Fort Reliance on 27 September.",
    source: DCB("back_george_10E", "C. Stuart Houston, 'Back, Sir George'") + "; Back, Narrative of the Arctic Land Expedition (London, 1836)",
    legs: [
      { w: "Great Slave Lake", l: "Fort Resolution", y: 1833, n: "From Fort Resolution Back set out to search for the Thlew-ee-choh and located it on 29 August 1833." },
      { w: "Great Slave Lake", l: "Fort Reliance", y: 1833, n: "Wintered at Fort Reliance at the eastern end of Great Slave Lake; the thermometer fell to 70 below zero." },
      { w: "Back River", y: 1834, n: "Left the fort on 7 June 1834 by Artillery, Clinton-Colden and Aylmer lakes, reached the Thlew-ee-choh on 28 June and descended its 83 falls, cascades and rapids in a month to the Polar Sea." },
      { w: "Great Slave Lake", l: "Fort Reliance", y: 1834, n: "Back at Fort Reliance on 27 September 1834 after three weeks in Chantrey Inlet." },
    ],
  },
  {
    explorer: "Dr. John Rae", name: "First Arctic expedition", start: 1846, end: 1847, color: "#065F46",
    summary: "Left York Factory in June 1846 with ten men and two small boats, took on the Inuit interpreters Ooligbuck and his son at Churchill, sailed up the coast and through Roes Welcome to Repulse Bay, crossed the isthmus, wintered on the land at Fort Hope, and in 1847 surveyed Committee Bay and Pelly Bay to show Boothia was a peninsula.",
    source: DCB("rae_john_1813_93_12E", "R. L. Richards, 'Rae, John (1813-93)'"),
    legs: [
      { w: "Hayes River", l: "York Factory", y: 1846, n: "Left York Factory in June 1846 with ten Company men and two small boats." },
      { w: "Hudson Bay", l: "Fort Churchill", y: 1846, n: "At Fort Churchill the interpreters Ooligbuck and his son William joined; then up the west coast of the bay and through Roes Welcome Sound." },
      { w: "Repulse Bay", l: "Fort Hope", y: 1846, n: "Crossed the isthmus at the base of Melville Peninsula, now Rae Isthmus, then built the stone house Fort Hope and wintered, the first exploring party to winter on the Arctic coast." },
      { w: "Repulse Bay", l: "Fort Hope", y: 1847, n: "In spring 1847 surveyed Committee Bay, Simpson Peninsula and Pelly Bay to Lord Mayor Bay, proving Boothia a peninsula; then north up Melville Peninsula to Cape Ellice." },
    ],
  },
  {
    explorer: "Dr. John Rae", name: "Fourth Arctic expedition and the Franklin news", start: 1853, end: 1854, color: "#9A3412",
    summary: "Left York Factory in June 1853 for Chesterfield Inlet and the Quoich, wintered again at Repulse Bay in snow houses, and on 31 March 1854 set out west for Boothia; at Pelly Bay on 21 April an Inuk told him of white men who had died of starvation to the west, and on his return the Inuit gave him the relics and the rest of the story.",
    source: DCB("rae_john_1813_93_12E", "R. L. Richards, 'Rae, John (1813-93)'") + "; Rae's letter to the Admiralty, Repulse Bay, 29 July 1854",
    legs: [
      { w: "Hayes River", l: "York Factory", y: 1853, n: "Left York Factory in June 1853 with two boats and twelve men." },
      { w: "Chesterfield Inlet", y: 1853, n: "Up Chesterfield Inlet, entering a river he named the Quoich; the season too late to go overland to the Back River." },
      { w: "Repulse Bay", l: "Fort Hope", y: 1853, n: "Wintered at Repulse Bay in snow houses, more comfortable than the stone house still standing." },
      { w: "Repulse Bay", l: "Fort Hope", y: 1854, n: "Set out west on 31 March 1854; met the Inuk at Pelly Bay on 21 April; reached the Castor and Pollux River and showed King William Land an island; back at Repulse Bay the Inuit told the rest." },
    ],
  },
  {
    explorer: "Jacques Cartier", name: "First voyage", start: 1534, color: "#B45309",
    summary: "To the Strait of Belle Isle, down the west coast of Newfoundland and across to Prince Edward Island, into the Baie des Chaleurs looking for a passage, to Gaspé where the cross was raised on 24 July, then round Anticosti and home, missing the river.",
    source: DCB("cartier_jacques_1491_1557_1E", "Marcel Trudel, 'Cartier, Jacques'") + "; Biggar, The Voyages of Jacques Cartier (1924)",
    legs: [
      { w: "Strait of Belle Isle", y: 1534, n: "Went directly to the Baie des Châteaux, the Strait of Belle Isle, as to a familiar stopping place." },
      { w: "Baie des Chaleurs", y: 1534, n: "From 4 to 9 July a systematic search of the bay for a strait, 'whereat we were grieved and displeased'; traded furs with the Mi'kmaq on 7 July." },
      { w: "Gaspé Bay", l: "Cartier's Cross at Gaspé", y: 1534, n: "In the Baie de Gaspé from 14 to 25 July among the St. Lawrence Iroquoians down for the fishing; the thirty-foot cross raised on 24 July; Domagaya and Taignoagny taken to France." },
      { w: "Gulf of St. Lawrence", y: 1534, n: "Turned east, taking the forty-mile strait between Gaspé and Anticosti for a bay; along Anticosti until 29 July and round it, then home from the strait." },
    ],
  },
  {
    explorer: "Jacques Cartier", name: "Second voyage", start: 1535, end: 1536, color: "#92400E",
    summary: "Three ships and 110 men: along the north shore to the bay he named Saint-Laurent on 10 August, up the great river past the Saguenay to Stadacona, on to Hochelaga on 2 October, and the scurvy winter in the Sainte-Croix; Donnacona taken when the ships left on 6 May 1536.",
    source: DCB("cartier_jacques_1491_1557_1E", "Marcel Trudel, 'Cartier, Jacques'") + "; Biggar, The Voyages of Jacques Cartier (1924)",
    legs: [
      { w: "Gulf of St. Lawrence", y: 1535, n: "Reached the gulf after a fifty-day crossing; a cross set up west of Natashquan; the bay named Saint-Laurent on 10 August, a name soon extended to the gulf and the river." },
      { w: "Saguenay River", l: "Tadoussac", y: 1535, n: "Passed the 'very deep and rapid' river on the right which the guides said was the route to the kingdom of the Saguenay." },
      { w: "St. Lawrence River", l: "Stadacona", y: 1535, n: "On 7 September at the island of Orleans, 'where Canada begins'; the ships laid up in the Sainte-Croix opposite Donnacona's village of Stadacona." },
      { w: "St. Lawrence River", l: "Hochelaga", y: 1535, n: "On to Hochelaga, reached 2 October, a thousand people and the palisaded town; the rapids beyond blocked the way west; left on 3 October." },
      { w: "St. Lawrence River", l: "Stadacona", y: 1536, n: "The winter of scurvy at Sainte-Croix; the cedar remedy; on 6 May 1536 left with Donnacona and nine others aboard." },
    ],
  },
  {
    explorer: "Pierre Gaultier de Varennes, Sieur de La Vérendrye", name: "The posts of the West", start: 1731, end: 1738, color: "#166534",
    summary: "From Montreal on 8 June 1731 to the Grand Portage, where the engagés balked; the advance party to Rainy Lake that autumn, Fort Saint-Charles on Lake of the Woods in 1732, Fort Maurepas on the Red in 1734, and Fort La Reine on the Assiniboine on 3 October 1738, from which he set out for the Mandan.",
    source: DCB("gaultier_de_varennes_et_de_la_verendrye_pierre_3E", "Yves F. Zoltvany, 'Gaultier de Varennes et de La Vérendrye, Pierre'"),
    legs: [
      { w: "Lake Superior", l: "Grand Portage", y: 1731, n: "Arrived at the Grand Portage at the western end of Lake Superior on 26 August 1731; the worn-out engagés refused to go on; the main party wintered at Kaministiquia." },
      { w: "Rainy Lake", l: "Fort St. Pierre", y: 1731, n: "The advance party under Jean-Baptiste and La Jemerais pushed on that autumn to Rainy Lake, the French limit since Jacques de Noyon in 1688." },
      { w: "Lake of the Woods", l: "Fort St. Charles", y: 1732, n: "Rejoined in spring 1732 and, with some fifty canoes of Cree and Assiniboine, on to Lake of the Woods, where Fort Saint-Charles became his headquarters." },
      { w: "Red River", y: 1734, n: "A site chosen on the Red River a few miles above its mouth; Jean-Baptiste completed Fort Maurepas there by June 1734." },
      { w: "Assiniboine River", y: 1738, n: "On 3 October 1738, on the site of Portage-la-Prairie, built Fort La Reine 'on the road by which the Assiniboin go to the English'; on 16 October left for the Mandan." },
    ],
  },
  {
    explorer: "Henry Kelsey", name: "Journey to the plains", start: 1690, end: 1692, color: "#4D7C0F",
    summary: "From York Fort on 12 June 1690 inland with the Cree to Derings Point on the Saskatchewan, where he set up a cross and wintered; on 15 July 1691 set out again to bring the Naywatame to trade, the first European to describe the buffalo and the grizzly on the Canadian plains.",
    source: DCB("kelsey_henry_2E", "K. G. Davies, 'Kelsey, Henry'"),
    legs: [
      { w: "Hayes River", l: "York Factory", y: 1690, n: "Started from York on 12 June 1690 on the journey for which he is chiefly remembered." },
      { w: "Saskatchewan River", l: "The Pas Portage", y: 1690, n: "At Derings Point, a bend of the Saskatchewan about twelve miles below The Pas, he set up a cross with the date and Sir Edward Dering's name, and wintered." },
      { w: "Saskatchewan River", l: "The Pas Portage", y: 1691, n: "On 15 July 1691 set out from Derings Point for the plains, up the Saskatchewan to the Carrot and then on foot through muskeg to the buffalo country of the Assiniboine." },
    ],
  },
  {
    explorer: "Anthony Henday", name: "Journey to the Blackfoot", start: 1754, end: 1755, color: "#A16207",
    summary: "From York Fort with Attickasish's Cree in June 1754 by the Hayes and the Fox to the Saskatchewan, across the South Saskatchewan north of the future Saskatoon, west along the Battle River country to the great Archithinue camp near the future Red Deer on 14 October, and back down the Saskatchewan in 1755.",
    source: DCB("henday_anthony_3E", "Clifford Wilson, 'Henday, Anthony'"),
    legs: [
      { w: "Hayes River", l: "York Factory", y: 1754, n: "Left the Hayes at the mouth of the Fox and travelled through Utik and Moose lakes to the Paskoya, the Saskatchewan." },
      { w: "Saskatchewan River", y: 1754, n: "Up the Saskatchewan past the French post he dreaded meeting." },
      { w: "South Saskatchewan River", y: 1754, n: "Crossed the South Saskatchewan north of what would become Saskatoon and passed south of the future Battleford." },
      { w: "Red Deer River", y: 1754, n: "On 14 October 1754, some eighteen miles south-east of what would become Red Deer, the great camp of the Archithinues, two hundred tipis in two rows." },
      { w: "Saskatchewan River", y: 1755, n: "Returned down the Saskatchewan to York in 1755 with the Cree brigades." },
    ],
  },
  {
    explorer: "Peter Pond", name: "Into the Athabasca", start: 1778, end: 1779, color: "#7E22CE",
    summary: "With four canoes of pooled goods from Cumberland Lake in 1778, up the English (Churchill) River on Frobisher's route to Île-à-la-Crosse, over the twelve-mile Portage La Loche to the Clearwater, the first trader into the Athabasca; wintered on the Athabasca River forty miles from the lake and came out in 1779 with more furs than his canoes could carry.",
    source: DCB("pond_peter_5E", "Barry M. Gough, 'Pond, Peter'"),
    legs: [
      { w: "Saskatchewan River", l: "Cumberland House", y: 1778, n: "At Pine Island Lake (Cumberland Lake) in spring 1778 the traders pooled their spare goods and gave Pond four canoes for the venture." },
      { w: "Churchill River", l: "Île-à-la-Crosse", y: 1778, n: "Entered the English River, the upper Churchill, following Thomas Frobisher's route to Lac Île-à-la-Crosse." },
      { w: "Clearwater River", l: "Methye Portage", y: 1778, n: "The first white man over Portage La Loche, twelve miles and eight days' work, from Lac La Loche to the Pelican (Clearwater) River in the Athabasca drainage." },
      { w: "Athabasca River", y: 1778, n: "Wintered on the Athabasca River about forty miles from the lake in 1778-79 among a 'vast concourse' of Cree and Chipewyan." },
      { w: "Lake Athabasca", y: 1779, n: "Reached Lake Athabasca; came out heavily laden in spring 1779, at Cumberland House on 2 July, with furs stockpiled behind." },
    ],
  },
  {
    explorer: "Henry Hudson", name: "The Discovery voyage", start: 1610, end: 1611, color: "#374151",
    summary: "The Discovery left London on 17 April 1610, was swept into the ice of Hudson Strait, passed into the bay and spent weeks in the 'labyrinth without end' of James Bay seeking a southern outlet, wintered in its south-east angle, and in June 1611 the crew set Hudson adrift.",
    source: DCB("hudson_henry_1E", "G. M. Thomson, 'Hudson, Henry'"),
    legs: [
      { w: "Hudson Strait", y: 1610, n: "Late in June 1610 off Resolution Island the ship was caught in the tide and swept into the ice-clogged waters of Hudson Strait; once in, Hudson dared not turn back." },
      { w: "Hudson Bay", y: 1610, n: "Into the bay and south along its east side." },
      { w: "James Bay", y: 1610, n: "Weeks in the bay later named for Thomas James seeking a southerly outlet; wintered in its south-east angle, presumably at the mouth of the Rupert." },
      { w: "Hudson Bay", y: 1611, n: "The voyage home begun 12 June 1611; on the night of 23 June the mutineers put Hudson, his son and seven others adrift; Bylot carried the ship to Digges Island." },
    ],
  },
  {
    explorer: "David Thompson", name: "Across the mountains to the Pacific", start: 1807, end: 1811, color: "#0E7490",
    summary: "From Rocky Mountain House over the Howse Pass on 25 June 1807 to the upper Columbia and Kootenae House, three years of trade and survey among the Ktunaxa and Salish, the winter crossing of the Athabasca Pass in 1810-11, the canoe built at Boat Encampment, and from Kettle Falls on 3 July 1811 down the Columbia to Astoria and back, completing the survey of the river from source to sea.",
    source: DCB("thompson_david_1770_1857_8E", "John Nicks, 'Thompson, David'") + "; David Thompson's Narrative (Champlain Society, 1916)",
    legs: [
      { w: "North Saskatchewan River", l: "Rocky Mountain House", y: 1807, n: "Wintered at Rocky Mountain House with his wife and three children, then set out for the mountains in spring 1807." },
      { w: "Columbia River", l: "Howse Pass", y: 1807, n: "Crossed the height of land on 25 June 1807 by the pass later named for Joseph Howse and descended the Blaeberry to a river he named Kootana, the upper Columbia." },
      { w: "Columbia River", l: "Kootenay House", y: 1807, n: "The first two winters at Kootenae House near Lake Windermere, extending trade and surveys through the Kootenay country." },
      { w: "Kootenay River", y: 1808, n: "Through the territory of the Kootenay Indians and south into the Flathead country; the third winter at Saleesh House." },
      { w: "Columbia River", l: "Spokane House", y: 1810, n: "From Saleesh House to Spokane House; left for Montreal in spring 1810 but was turned back by the Peigan blockade of the Howse Pass." },
      { w: "Columbia River", l: "Athabasca Pass", y: 1811, n: "A difficult crossing of the unexplored Athabasca Pass in December and January; waited for spring in a hut on the Columbia near the mouth of the Canoe River and built a canoe of cedar boards." },
      { w: "Columbia River", l: "Fort Colville", y: 1811, n: "North to the Kettle Falls, where he built another canoe and set off down the river on 3 July 1811, treating with the people at every village." },
      { w: "Snake River", y: 1811, n: "Laid claim to a post at the mouth of the Snake on 9 July; on the way back ascended it to the Palouse and rode overland to Spokane House." },
      { w: "Columbia River", l: "Fort Astoria / Fort George", y: 1811, n: "Reached Astoria at the mouth on 15 July 1811, where Duncan McDougall had the Pacific Fur Company's post; then upstream to Kettle Falls and on to the Canoe River, completing the survey of the whole river." },
    ],
  },
  {
    explorer: "Samuel de Champlain", name: "To the Huron country", start: 1615, end: 1616, color: "#1E40AF",
    summary: "Left the Sault-Saint-Louis on 4 July 1615 with two canoes, up the Ottawa as in 1613, by the Mattawa, Lake Nipissing and the French River to the 'gentle sea' of Lake Huron and the Wendat village of Otouacha on 1 August, then with the Wendat war party across Lake Ontario to the Iroquois town, and the winter among the Wendat.",
    source: DCB("champlain_samuel_de_1E", "'Champlain, Samuel de'"),
    legs: [
      { w: "Ottawa River", l: "Allumette Island", y: 1615, n: "Departed on 4 July 1615 with an interpreter, probably Brûlé, a servant and ten Indigenous people in two canoes, up the Rivière du Nord as in 1613." },
      { w: "Mattawa River", y: 1615, n: "Up the Mattawa toward the height of land." },
      { w: "Lake Nipissing", y: 1615, n: "By Lake Nipissing, the northern communication route the Iroquois sought to cut." },
      { w: "French River", y: 1615, n: "Down the French River to the great lake of the Attigouautan." },
      { w: "Georgian Bay", y: 1615, n: "On the 'gentle sea' of Lake Huron, in Wendat territory; at the village of Otouacha near the Midland peninsula on 1 August 1615." },
      { w: "Lake Ontario", y: 1615, n: "With the Wendat warriors across Lake Ontario to attack the Iroquois town; wounded, Champlain was carried back to winter among the Wendat and Pétun." },
    ],
  },
];

async function main() {
  const [ex, ww, locs, existing] = await Promise.all([
    db.explorer.findMany({ select: { id: true, name: true } }),
    db.waterway.findMany({ select: { id: true, name: true } }),
    db.location.findMany({ select: { id: true, name: true } }),
    db.expedition.findMany({ select: { name: true, explorerId: true } }),
  ]);
  const exId = (n: string) => { const e = ex.find((x) => x.name === n); if (!e) throw new Error(`explorer not found: ${n}`); return e.id; };
  const wwId = (n: string) => { const w = ww.find((x) => x.name === n); if (!w) throw new Error(`waterway not found: ${n}`); return w.id; };
  const locId = (n: string) => { const l = locs.find((x) => x.name === n); if (!l) throw new Error(`location not found: ${n}`); return l.id; };
  const plans = EXPEDITIONS.map((e, i) => ({ explorerId: exId(e.explorer), name: e.name, startYear: e.start, endYear: e.end ?? null, summary: e.summary, color: e.color, source: e.source, sortOrder: i, legs: e.legs.map((l, j) => ({ orderIndex: j, waterwayId: wwId(l.w), locationId: l.l ? locId(l.l) : null, year: l.y ?? null, notes: l.n })) }));
  const toInsert = plans.filter((p) => !existing.some((x) => x.name === p.name && x.explorerId === p.explorerId));
  const backupFile = writeBackup("2026-10-19-expeditions-seed-before", { note: "inserts only", existing: existing.length });
  report("expeditions seed", { expeditions: toInsert.map((p) => `${EXPEDITIONS.find((e) => e.name === p.name)!.explorer}: ${p.name} (${p.startYear}${p.endYear ? `-${p.endYear}` : ""}), ${p.legs.length} legs`), legs: toInsert.reduce((n, p) => n + p.legs.length, 0), skippedExisting: plans.length - toInsert.length, backupFile });
  if (!APPLY) return;
  for (const { legs, ...e } of toInsert) await db.expedition.create({ data: { ...e, legs: { create: legs } } });
  report("verify", { expeditions: await db.expedition.count(), legs: await db.expeditionLeg.count(), explorersWithExpeditions: (await db.expedition.groupBy({ by: ["explorerId"] })).length });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
