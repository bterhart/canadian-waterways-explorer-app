// Narrations, Hudson Bay, the interior and the North (approved list 10.23, passages 8-15 and
// 23-27; 2026-10-21). Thirteen checked transcriptions, each read in the full text of a published
// edition (Internet Archive scans, or the Project Gutenberg text of Mackenzie and of Franklin's
// second Narrative) and compared against it by the edition checker before apply. Rules of
// passes 13 and 15: only text read in the edition, nothing added, omissions marked [...],
// OCR line-break hyphens joined and obvious scanner errors corrected, each declared in ocrFixes.
//   bun run prisma/turso-migrations/2026-10-21-voices-bay-interior-north.ts [--apply] [--only <id>] [--dump]
import { seedVoices, type VoiceEntry } from "./lib/voices-seed";

const MACKENZIE = "cmlhaslpq0005m2zhbi5xrrt6";
const FRANKLIN = "cmlhaslq60008m2zhokwxq1v6";
const GUTENBERG_MACKENZIE = { author: "Alexander Mackenzie", title: "Voyages from Montreal Through the Continent of North America to the Frozen and Pacific Oceans in 1789 and 1793, vol. I", publisher: "London, 1801; Project Gutenberg eBook #35658", year: "1801", url: "https://www.gutenberg.org/ebooks/35658" };

const ENTRIES: VoiceEntry[] = [
  {
    id: "psd_voice_grand_portage_1801",
    title: "Mackenzie on the Rendezvous at Grand Portage",
    documentType: "report", author: "Alexander Mackenzie", originalDate: "The trade as Mackenzie knew it, 1785-1799; published 1801", originalYear: 1793, gradeLevel: "7-9",
    explorerId: MACKENZIE, waterwayId: "cmlhaslra000ym2zh4pyu55je", locationId: "cmlhasls40024m2zhk53dsecy",
    spot: { latitude: 47.96, longitude: -89.68, name: "Grand Portage, the North West Company's depot on Lake Superior, at the summer rendezvous" },
    transcription:
      "The North men being arrived at the Grande Portage, are regaled with bread, pork, butter, liquor, and tobacco, and such as have not entered into agreements during the winter, which is customary, are contracted with, to return and perform the voyage for one, two, or three years; their accounts are also settled, and such as choose to send any of their earnings to Canada, receive drafts to transmit to their relations or friends; and as soon as they can be got ready, which requires no more than a fortnight, they are again despatched to their respective departments. It is, indeed, very creditable to them as servants, that though they are sometimes assembled to the number of twelve hundred men, indulging themselves in the free use of liquor, and quarrelling with each other, they always show the greatest respect to their employers, who are comparatively but few in number, and beyond the aid of any legal power to enforce due obedience. [...] The mode of living at the Grande Portage is as follows: The proprietors, clerks, guides, and interpreters, mess together, to the number of sometimes an hundred, at several tables, in one large hall, the provision consisting of bread, salt pork, beef, hams, fish, and venison, butter, peas, Indian corn, potatoes, tea, spirits, wine, etc., and plenty of milk, for which purpose several milch cows are constantly kept. The mechanics have rations of such provision, but the canoe-men, both from the North and Montreal, have no other allowance here, or in the voyage, than Indian corn and melted fat. The corn for this purpose is prepared before it leaves Detroit, by boiling it in a strong alkali, which takes off the outer husk: it is then well washed, and carefully dried upon stages, when it is fit for use. One quart of this is boiled for two hours, over a moderate fire, in a gallon of water; to which, when it has boiled a small time, are added two ounces of melted suet; this causes the corn to split, and in the time mentioned makes a pretty thick pudding. If to this is added a little salt, (but not before it is boiled, as it would interrupt the operation) it makes a wholesome, palatable food, and easy of digestion. This quantity is fully sufficient for a man's subsistence during twenty-four hours; though it is not sufficiently heartening to sustain the strength necessary for a state of active labour. The Americans call this dish hominy.",
    checked: "Quotation checked against Alexander Mackenzie, Voyages from Montreal (London, 1801), the General History of the Fur Trade, the paragraphs on the Grande Portage, read in the Project Gutenberg transcription of vol. I (eBook #35658). The edition's footnote mark after \"hominy\" is omitted.",
    historicalContext:
      "Grand Portage, at the start of the nine-mile carry round the falls of the Pigeon River, was where the North West Company's two halves met every July: the Montreal canoes that had come up the Ottawa and the lakes with trade goods, and the \"North men\" who had wintered in the Athabasca and the Saskatchewan and come down with the furs. Mackenzie describes it as a partner who had sat in the great hall, and he is exact about the two tables: the gentlemen's, with its milk and wine, and the voyageurs', which was a quart of hominy a day. Twelve hundred men, no magistrate within a thousand miles, and order kept, he says, by the men's good opinion of their employers. The post was in the United States after the border was settled, and the Company moved the rendezvous to the Kaministiquia, Fort William, in 1803.",
    vocabulary: [
      { word: "Grande Portage", definition: "The Grand Portage, the carry round the lower Pigeon River and the North West Company's depot at its Lake Superior end until 1803" },
      { word: "North men", definition: "The voyageurs who wintered in the interior and came down to the rendezvous with the furs; the Montreal men were the mangeurs de lard, the pork-eaters" },
      { word: "hominy", definition: "Corn hulled in lye and boiled with fat, the voyageurs' ration on the voyage, a quart a day" },
      { word: "mess", definition: "To take meals together; the partners, clerks, guides and interpreters messed in the great hall" },
      { word: "proprietors", definition: "The partners of the North West Company, who held the shares" },
    ],
    discussionQuestions: [
      "Who ate at which table at Grand Portage, and what does that tell you about the Company?",
      "Mackenzie says twelve hundred men kept order without any law to enforce it. Why does he think so, and do you believe him?",
      "Work out what a voyageur ate in a day. Was it enough for the work?",
      "Why did a depot on the edge of Lake Superior matter so much to a trade that reached the Arctic?",
    ],
    citation: GUTENBERG_MACKENZIE,
    edition: "gut35658.txt",
    ocrFixes: [["call this dish hominy.[5]", "call this dish hominy."]],
  },
  {
    id: "psd_voice_fort_william_1817",
    title: "Ross Cox Arrives at Fort William, August 1817",
    documentType: "journal", author: "Ross Cox", originalDate: "August 1817; published 1831", originalYear: 1817, gradeLevel: "7-9",
    explorerId: null, waterwayId: "cmlizphim0001m2ybbm7btaxk", locationId: "cmlhbjrr2000vm2mb4xb3au6o",
    spot: { latitude: 48.3808, longitude: -89.2477, name: "Fort William, at the mouth of the Kaministiquia, August 1817" },
    transcription:
      "At eight o'clock we arrived at Fort William, as the welcome sound of the breakfast-bell was summoning the inmates to their morning's repast. We instantly repaired to the Salle à manger, and over a bowl of coffee, fresh eggs, excellent hot cakes, and prime cold venison, quickly forgot our late privations. Fort William is the great emporium for the interior. An extensive assortment of merchandise is annually brought hither from Montreal, by large canoes, or the Company's vessels on the lakes, which, in return, bring down the produce of the wintering posts to Canada, from whence it is shipped for England. A number of the partners and clerks, whose turn of rotation has not arrived, for going to Montreal, assemble here every summer, and deposit the furs which they purchase during the winter, when they obtain a fresh supply of trading goods for the ensuing season. Those on their way to Canada also remain some time previous to their final departure. In addition to these, one or two of the principal directors, and several clerks, come up every spring from Montreal to make the necessary changes, and superintend the distribution of the merchandise for the wintering parties. Fort William may therefore be looked upon as the metropolitan post of the interior, and its fashionable season generally continues from the latter end of May to the latter end of August. During this period, good living and festivity predominate; and the luxuries of the dinner-table compensate in some degree for the long fasts and short commons experienced by those who are stationed in the remote posts. The voyageurs too enjoy their Carnival, and between rum and baubles the hard-earned wages of years are often dissipated in a few weeks.",
    checked: "Quotation checked against Ross Cox, The Columbia River; or, Scenes and Adventures during a Residence of Six Years on the Western Side of the Rocky Mountains, vol. II (London: Colburn and Bentley, 1832), the arrival at Fort William on the journey from the Columbia to Montreal in 1817. The OCR's \"Salle h manger\" and \"tl^e\" are the printed \"Salle à manger\" and \"the\".",
    historicalContext:
      "Ross Cox came out to the Columbia with Astor's Pacific Fur Company in 1812, stayed on when the North West Company bought it out, and in 1817 crossed the continent home: up the Columbia, over Athabasca Pass, down the Saskatchewan and across Lake Superior to Fort William, the depot that had replaced Grand Portage in 1803. He reached it at the end of the summer rendezvous, a year after Lord Selkirk had seized it, and his description is of the post as a working capital: the great hall, the breakfast-bell, the furs coming in and the goods going out, the partners' season and the voyageurs' carnival. Fort William Historical Park at Thunder Bay reconstructs the post as it stood in 1816.",
    vocabulary: [
      { word: "emporium", definition: "A centre of trade; Cox's word for the depot through which everything passed" },
      { word: "Salle à manger", definition: "The dining hall of the fort, where the partners and clerks ate together" },
      { word: "short commons", definition: "Short rations; the fare of the remote posts in winter" },
      { word: "Carnival", definition: "Cox's name for the voyageurs' weeks of spending at the rendezvous" },
      { word: "Kaministiquia", definition: "The river at whose mouth Fort William stood, and the canoe route inland after 1803" },
    ],
    discussionQuestions: [
      "What did Fort William do for the fur trade, in Cox's account?",
      "Who came to the rendezvous and why, and who had to stay at the remote posts?",
      "Cox says the voyageurs' wages of years went in a few weeks. Who gained from that?",
      "Cox had just crossed the continent. What does his breakfast tell you about the journey he had made?",
    ],
    citation: { author: "Ross Cox", title: "The Columbia River; or, Scenes and Adventures during a Residence of Six Years on the Western Side of the Rocky Mountains, vol. II", publisher: "London: Colburn and Bentley, 1832", year: "1832", url: "https://archive.org/details/columbiariveror00coxgoog" },
    edition: "columbiariveror00coxgoog.txt",
    ocrFixes: [["repaired to the Salle h manger", "repaired to the Salle à manger"], ["in the remote posts. . The", "in the remote posts. The"], ["between rum and baubles tl^e hard-earned", "between rum and baubles the hard-earned"]],
  },
  {
    id: "psd_voice_james_bay_1611",
    title: "Prickett's Account of Hudson Set Adrift, June 1611",
    documentType: "journal", author: "Abacuk Prickett", originalDate: "22-23 June 1611; printed by Purchas, 1625", originalYear: 1611, gradeLevel: "7-9",
    explorerId: "cmlhc4grp0004m2ogg57dim4b", waterwayId: "cmlhaslrv001em2zheht25x94", locationId: null,
    spot: { latitude: 52.9, longitude: -79.6, name: "James Bay, among the ice, 23 June 1611 (the place is not known; site approximate)" },
    transcription:
      "In the meane time Henrie Greene, and another went to the Carpenter, and held him with a talke, till the Master came out of his Cabbin (which hee soone did) then came John Thomas and Bennet before him, while Wilson bound his armes behind him. He asked them what they meant? they told him, he should know when he was in the Shallop. [...] Then was the Shallop haled up to the Ship side, and the poore, sicke, and lame men were called upon to get them out of their Cabbins into the Shallop. The Master called to me, who came out of my Cabbin as well as I could, to the Hatch way to speake with him: where, on my knees I besought them, for the love of God, to remember themselves, and to doe as they would be done unto. They bad me keepe my selfe well, and get me into my Cabbin; not suffering the Master to speake with me. [...] Now was the Carpenter at libertie, who asked them, if they would bee hanged when they came home: and as for himselfe, hee said, hee would not stay in the Ship unlesse they would force him: they bad him goe then, for they would not stay him: I will (said hee) so I may have my chest with mee, and all that is in it: they said, hee should, and presently they put it into the Shallop. Then hee came downe to mee, to take his leave of mee, who perswaded him to stay, which if he did, he might so worke that all should bee well: hee said, hee did not thinke, but they would be glad to take them in againe. For he was so perswaded by the Master, that there was not one in all the ship, that could tell how to carrie her home; but (saith he) if we must part (which wee will not willingly doe, for they would follow the ship) hee prayed me, if wee came to the Capes before them, that I would leave some token that wee had beene there, neere to the place where the Fowles bred, and hee would doe the like for us: and so (with teares) we parted.",
    checked: "Quotation checked against \"A larger Discourse of the same Voyage, and the successe thereof, written by Abacuk Pricket\", in Hakluytus Posthumus or Purchas His Pilgrimes (1625), vol. XIII of the Glasgow reprint (MacLehose, 1906), the morning of the mutiny. The spelling is Purchas's; the edition's marginal notes, which the OCR runs into the text, are omitted.",
    historicalContext:
      "Henry Hudson had taken the Discovery through the strait that carries his name in 1610, down the east side of the bay into James Bay, and wintered there frozen in, the first Europeans to winter on the bay. By June 1611 the food was nearly gone and the crew believed the Master was hoarding it. Henry Greene and William Wilson led the mutiny; Hudson, his son John and seven others, most of them sick, were put into the shallop and cast off, and the carpenter, Philip Staffe, chose to go with them. They were never seen again. Abacuk Prickett, a Londoner who had come as a servant of one of the backers, wrote this account on the way home, when the leaders of the mutiny were already dead; he and the other survivors were tried and acquitted, and his story is the only one there is.",
    vocabulary: [
      { word: "shallop", definition: "The ship's open boat, into which Hudson and eight others were put" },
      { word: "the Master", definition: "Henry Hudson, master of the Discovery; Prickett never calls him by name here" },
      { word: "Henrie Greene", definition: "The leader of the mutiny, a young man Hudson had taken on in London; killed by Inuit on the way home" },
      { word: "the Carpenter", definition: "Philip Staffe, the ship's carpenter, who chose the shallop over the mutineers' ship" },
      { word: "the Capes", definition: "The capes at the entrance of Hudson Strait, where the ship would pass on the way home" },
    ],
    discussionQuestions: [
      "Why did the mutineers want the carpenter to stay, and why did he go?",
      "Prickett wrote this after the mutiny's leaders were dead. How might that have shaped what he tells, and what he leaves out?",
      "What did the carpenter believe would happen to the shallop, and what does that tell you about the mutineers' plan?",
      "Nothing is known of Hudson after this morning. What would you want to know, and where might the answer be?",
    ],
    citation: { author: "Abacuk Prickett", title: "A larger Discourse of the same Voyage, written by Abacuk Pricket, in Hakluytus Posthumus or Purchas His Pilgrimes, vol. XIII", publisher: "Glasgow: MacLehose, 1906 (from the London edition of 1625)", year: "1906", url: "https://archive.org/details/hakluytusposthum13purc" },
    edition: "hakluytusposthum13purc.txt",
    ocrFixes: [["He asked them xJin bind the what they meant?", "He asked them what they meant?"], ["he should know when Master. he was in the Shallop.", "he should know when he was in the Shallop."], ["and as The Carpen- for himselfe,", "and as for himselfe,"], ["in the Ship ter let gpe. unlesse they would", "in the Ship unlesse they would"]],
  },
  {
    id: "psd_voice_henday_1754",
    title: "Henday in the Camp of the Blackfoot, October 1754",
    documentType: "journal", author: "Anthony Henday", originalDate: "14-15 October 1754; published 1907", originalYear: 1754, gradeLevel: "7-9",
    explorerId: "cmlhc4gt3000am2ogk4wcy5m1", waterwayId: "ww_north-saskatchewan-river", locationId: null,
    spot: { latitude: 52.3, longitude: -113.6, name: "The Blackfoot camp of two hundred tents, between the Red Deer and the Battle, 14 October 1754 (site approximate)" },
    transcription:
      "14. Monday. Travelled 4 Miles S.W.b.W. Then came to us four men on Horse-back; they told us they were sent from the main body to see whether we were Friends or Enemies. We told them we were Friends. Attickasish, Canawappaw, Cokamanakisish, and the other of our Leaders walked in front about 4 Miles farther then we; came to 200 tents of Archithinue Natives, pitched in two rows, and an opening in the middle; where we were conducted to the Leader's tent; which was at one end, large enough to contain fifty persons; where he received us seated on a clear (white) Buffalo skin, attended by 20 elderly men. He made signs for me to sit down on his right hand: which I did. Our Leader set on several grand-pipes, and smoked all round, according to their usual custom: not a word was yet spoke on either side. Smoking being over, Buffalo flesh boiled was served round in baskets of a species of bent, and I was presented with 10 Buffalo tongues. Attickasish my Guide, informed him I was sent by the Great Leader who lives down at the great waters, to invite his young men down to see him and to bring with them Beaver skins, & Wolves skins: & they would get in return Powder, Shot, Guns, Cloth, Beads, &c. He made little answer: only said that it was far off, & they could not paddle. Then they entered upon indifferent subjects until we were ordered to depart to our tents, which were pitched about a full quarter of a Mile without their lines. 15. Tuesday. Froze a little last night. Our women employed dressing Beaver skins for cloathing. About 10 o'clock A.M. I was invited to the Archithinue Leader's tent: when by an interpreter I told him what I was sent for, & desired of him to allow some of his young men to go down to the Fort with me, where they would be kindly received, and get Guns &c. But he answered, it was far off, & they could not live without Buffalo flesh; and that they could not leave their horses &c: and many other obstacles, though all might be got over if they were acquainted with a Canoe, and could eat Fish, which they never do. The Chief further said they never wanted food, as they followed the Buffalo & killed them with the Bows and Arrows; and he was informed the Natives that frequented the Settlements, were oftentimes starved on their journey. Such remarks I thought exceeding true.",
    checked: "Quotation checked against Anthony Hendry's journal as printed in L. J. Burpee, \"York Factory to the Blackfeet Country\", Proceedings and Transactions of the Royal Society of Canada, 3rd series, vol. I, section II (1907), the entries of 14 and 15 October 1754. The edition's footnote marks are omitted.",
    historicalContext:
      "Anthony Henday, a Hudson's Bay Company labourer, went inland from York Factory in June 1754 with a band of Cree led by Attickasish to see where the furs came from and to persuade the people of the plains to come down to the bay. In October, somewhere between the Red Deer and the Battle rivers, he was the first Hudson's Bay man to be received by the Blackfoot (whom he calls Archithinue, the Cree name), in a camp of two hundred tents with horses, which no Company man had seen before. The chief's answer is the heart of the journal: his people did not paddle, did not eat fish, and did not go hungry following the buffalo; why would they make a thousand-mile journey to a fort? The Company sent Henday back inland but did not build on the Saskatchewan for another twenty years. His journal survives in four differing copies at the Company's archives; Burpee printed one of them.",
    vocabulary: [
      { word: "Archithinue", definition: "The Cree name Henday used for the Blackfoot and their allies of the plains" },
      { word: "Attickasish", definition: "Little Deer, the Cree leader who took Henday inland and spoke for him in the Blackfoot camp" },
      { word: "grand-pipes", definition: "The ceremonial pipes smoked round before any talk, in the custom of the plains" },
      { word: "the Great Leader who lives down at the great waters", definition: "The chief factor at York Factory on Hudson Bay, as Henday's message described him" },
      { word: "the Settlements", definition: "The Company's posts on the bay, which the chief knew were a hungry journey away" },
    ],
    discussionQuestions: [
      "What did the Blackfoot chief say when he was invited to send his young men to the bay, and what were his reasons?",
      "Henday writes that the chief's remarks were \"exceeding true\". What had Henday seen that made him agree?",
      "Who is actually negotiating here, and in what language?",
      "Why would a people with horses and buffalo not want guns badly enough to make the journey?",
    ],
    citation: { author: "Anthony Henday", title: "York Factory to the Blackfeet Country: the Journal of Anthony Hendry, 1754-55, ed. Lawrence J. Burpee", publisher: "Proceedings and Transactions of the Royal Society of Canada, 1907", year: "1907", url: "https://archive.org/details/yorkfactorytobla00hend" },
    edition: "yorkfactorytobla00hend.txt",
    ocrFixes: [["(white) Buffalo skin,? attended", "(white) Buffalo skin, attended"], ["on their journey.t. Such remarks", "on their journey. Such remarks"]],
  },
  {
    id: "psd_voice_coppermine_mouth_1821",
    title: "Franklin at the Mouth of the Coppermine: the Polar Sea Reached, July 1821",
    documentType: "journal", author: "Sir John Franklin", originalDate: "18 July 1821; published 1823", originalYear: 1821, gradeLevel: "7-9",
    explorerId: FRANKLIN, waterwayId: "ww_coronation-gulf", locationId: null,
    spot: { latitude: 67.82, longitude: -115.1, name: "The mouth of the Coppermine on Coronation Gulf, 18 July 1821" },
    transcription:
      "We embarked at five A.M. and proceeded towards the sea, which is about nine miles distant from the Bloody Fall. After passing a few rapids, the river became wider, and more navigable for canoes, flowing between banks of alluvial sand. We encamped at ten on the western bank at its junction with the sea. The river is here about a mile wide, but very shallow, being barred nearly across by sand-banks, which run out from the main land on each side to a low alluvial island that lies in the centre, and forms two channels; of these the westermost only is navigable even for canoes, the other being obstructed by a stony bar. The islands to seaward are high and numerous, and fill the horizon in many points of the compass; the only open space, seen from an eminence near the encampment, being from N.bE. to N.E.bN. Towards the east the land was like a chain of islands, the ice surrounded the islands apparently in a compact body, leaving a channel between its edge and the main of about three miles. The water in this channel was of a clear green colour, and decidedly salt. Mr. Hearne could have only tasted it at the mouth of the river, when he pronounced it to be merely brackish. A rise and fall of four inches in the water was observed. [...] We felt a considerable change of temperature on reaching the sea-coast, produced by the winds changing from the southward to the N.W. Our Canadian voyagers complained much of the cold, but they were amused with their first view of the sea, and particularly with the sight of the seals that were swimming about near the entrance of the river, but these sensations gave place to despondency before the evening had elapsed. They were terrified at the idea of a voyage through an icy sea in bark canoes. They speculated on the length of the journey, the roughness of the sea, the uncertainty of provisions, the exposure to cold where we could expect no fuel, and the prospect of having to traverse the barren grounds to get to some establishment. The two interpreters expressed their apprehensions with the least disguise, and again urgently applied to be discharged; but only one of the Canadians made a similar request.",
    checked: "Quotation checked against John Franklin, Narrative of a Journey to the Shores of the Polar Sea, in the Years 1819, 20, 21, and 22 (London: Murray, 1823), chapter X, the entry of 18 July 1821 at the mouth of the Copper-Mine River. The OCR's broken letters (cUstant, Hloody, alhivial, luunerous, llearne, wfere, apphed, bvit, X.bK.) are the printed words.",
    historicalContext:
      "Fifty years after Hearne had stood at the mouth of the Coppermine, Franklin's overland expedition reached it on 18 July 1821 with two birchbark canoes, two Inuit interpreters, Augustus and Junius, and sixteen voyageurs who had never seen salt water. Franklin tasted the sea and corrected Hearne, who had called it brackish. What follows in the same entry is the voyageurs' fear, written down by the officer who would ask them to paddle those canoes along the Arctic coast anyway: six hundred miles east to Point Turnagain, then the walk back across the Barren Lands on which eleven of the twenty men died. Hepburn, the seaman whose calm Franklin praises, survived; so did Augustus, who had carried the message to the Inuit at Bloody Falls a few days before.",
    vocabulary: [
      { word: "Bloody Fall", definition: "The rapid on the Coppermine where Hearne's Dene companions killed the Inuit in 1771; Franklin's party had camped above it" },
      { word: "voyagers", definition: "Franklin's spelling for the voyageurs, the Canadian canoemen of the expedition" },
      { word: "N.bE. to N.E.bN.", definition: "North by east to north-east by north: the compass points of the only open water Franklin could see" },
      { word: "Augustus and Junius", definition: "Tattannoeuck and Hoeootoerock, the Inuit interpreters from Churchill who travelled with Franklin" },
      { word: "Hepburn", definition: "John Hepburn, the one British seaman of the expedition, whose ease on salt water shamed the voyageurs' fears" },
    ],
    discussionQuestions: [
      "How did Franklin know he had reached the sea, and what did he check against Hearne?",
      "Why were the voyageurs afraid, and were their fears reasonable?",
      "The officers \"endeavoured to ridicule their fears\". What happened to this party in the months that followed?",
      "What is the difference between the way Franklin describes the river and the way he describes his men?",
    ],
    citation: { author: "John Franklin", title: "Narrative of a Journey to the Shores of the Polar Sea, in the Years 1819, 20, 21, and 22", publisher: "London: John Murray, 1823", year: "1823", url: "https://archive.org/details/narrativeofjourn00fran" },
    edition: "narrativeofjourn00fran.txt",
    ocrFixes: [["nine miles cUstant i'rom the Hloody Fall", "nine miles distant from the Bloody Fall"], ["banks of alhivial sand", "banks of alluvial sand"], ["high and luunerous", "high and numerous"], ["near the encamj)- ment, being", "near the encampment, being"], ["being from X.bK. to N.E.bX.", "being from N.bE. to N.E.bN."], ["Mr. llearne could", "Mr. Hearne could"], ["seals that wfere swimming", "seals that were swimming"], ["urgently apphed to be discharged ; bvit only", "urgently applied to be discharged; but only"]],
  },
  {
    id: "psd_voice_mackenzie_delta_1789",
    title: "Mackenzie Among the Whales at the Mouth of the River, July 1789",
    documentType: "journal", author: "Alexander Mackenzie", originalDate: "14 July 1789; published 1801", originalYear: 1789, gradeLevel: "4-6",
    explorerId: MACKENZIE, waterwayId: "cmlhaslqp000mm2zh1z4uc8lw", locationId: null,
    spot: { latitude: 69.45, longitude: -135.7, name: "Whale Island (Garry Island) in the Mackenzie delta, 14 July 1789" },
    transcription:
      "Tuesday, 14.--It blew very hard from the North-West since the preceding evening. Having sat up till three in the morning, I slept longer than usual; but about eight one of my men saw a great many animals in the water, which he at first supposed to be pieces of ice. About nine, however, I was awakened to resolve the doubts which had taken place respecting this extraordinary appearance. I immediately perceived that they were whales; and having ordered the canoe to be prepared, we embarked in pursuit of them. It was, indeed, a very wild and unreflecting enterprise, and it was a very fortunate circumstance that we failed in our attempt to overtake them, as a stroke from the tail of one of these enormous fish would have dashed the canoe to pieces. We may, perhaps, have been indebted to the foggy weather for our safety, as it prevented us from continuing our pursuit. Our guide informed us that they are the same kind of fish which are the principal food of the Esquimaux, and they were frequently seen as large as our canoe. The part of them which appeared above the water was altogether white, and they were much larger than the largest porpoise. [...] At eight we encamped on the Eastern end of the island, which I had named the Whale Island. It is about seven leagues in length, East and West by compass; but not more than half a mile in breadth. We saw several red foxes, one of which was killed. There were also five or six very old huts on the point where we had taken our station. The nets were now set, and one of them in five fathom water, the current setting North-East by compass.",
    checked: "Quotation checked against Alexander Mackenzie, Voyages from Montreal (London, 1801), the Journal of a Voyage through the North-West Continent of America in 1789, the entry of Tuesday 14 July 1789, read in the Project Gutenberg transcription of vol. I (eBook #35658). The Gutenberg italic marks round the date are omitted.",
    historicalContext:
      "Mackenzie left Fort Chipewyan on 3 June 1789 hoping the great river running out of Great Slave Lake would carry him to the Pacific. It carried him north instead, and on 14 July, among the islands of the delta, the white whales told him where he was: these are belugas, and the Inuvialuit of the delta hunted them, as his Dene guide said. He had reached the Arctic Ocean, not the Pacific, and he later called the river Disappointment. The post he set up on Whale Island the next morning, with his name and the latitude, is the only monument he left; the island is now Garry Island, and the river has carried his name since the Voyages were printed in 1801. He went back the way he came, 102 days there and back.",
    vocabulary: [
      { word: "whales", definition: "Belugas, the white whales of the Arctic; the Inuvialuit of the delta hunted them for food, as the guide said" },
      { word: "Esquimaux", definition: "The French and English spelling of the time for the Inuit; here the Inuvialuit of the Mackenzie delta" },
      { word: "Whale Island", definition: "Mackenzie's name for the island where he camped on 14 July 1789, now Garry Island" },
      { word: "fathom", definition: "Six feet of water; the nets were set in five" },
      { word: "the Disappointment", definition: "Mackenzie's later name for the river that had taken him to the Arctic instead of the Pacific" },
    ],
    discussionQuestions: [
      "What told Mackenzie that he had reached the sea?",
      "Why does he call the chase after the whales \"wild and unreflecting\", and what saved the canoe?",
      "Who knew what these whales were, and how did Mackenzie find out?",
      "Mackenzie wanted the Pacific and found the Arctic. Was the voyage a failure?",
    ],
    citation: GUTENBERG_MACKENZIE,
    edition: "gut35658.txt",
    ocrFixes: [["_Tuesday, 14._--It blew", "Tuesday, 14.--It blew"]],
  },
  {
    id: "psd_voice_victory_point_1848",
    title: "The Victory Point Record, May 1847 and April 1848",
    documentType: "record", author: "Lieutenant Graham Gore; Captains F. R. M. Crozier and James Fitzjames", originalDate: "28 May 1847 and 25 April 1848; found 6 May 1859", originalYear: 1848, gradeLevel: "7-9",
    explorerId: FRANKLIN, waterwayId: "ww_victoria-strait", locationId: "loc_victory-point",
    spot: { latitude: 69.63, longitude: -98.6, name: "Victory Point, on the north-west coast of King William Island, where the cairn stood" },
    transcription:
      "28th of May, 1847. H. M. ships 'Erebus' and 'Terror' wintered in the ice in lat. 70° 05' N., long. 98° 23' W. Having wintered in 1846-7 at Beechey Island, in lat. 74° 43' 28\" N., long. 91° 39' 15\" W., after having ascended Wellington Channel to lat. 77°, and returned by the west side of Cornwallis Island. Sir John Franklin commanding the expedition. All well. Party consisting of 2 officers and 6 men left the ships on Monday, 24th May, 1847. Gm. Gore, Lieut. Chas. F. Des Voeux, Mate. [...] April 25, 1848.—H. M. ships 'Terror' and 'Erebus' were deserted on the 22nd April, 5 leagues N.N.W. of this, having been beset since 12th September, 1846. The officers and crews, consisting of 105 souls, under the command of Captain F. R. M. Crozier, landed here in lat. 69° 37' 42\" N., long. 98° 41' W. Sir John Franklin died on the 11th June, 1847; and the total loss by deaths in the expedition has been to this date 9 officers and 15 men. (Signed) F. R. M. Crozier, Captain and Senior Officer. (Signed) James Fitzjames, Captain H. M. S. 'Erebus.' and start (on) to-morrow, 26th, for Back's Fish River.",
    checked: "Quotation checked against the record as printed by F. L. McClintock, The Voyage of the 'Fox' in the Arctic Seas (London, 1859), in the fourth edition titled The Fate of Sir John Franklin (London: Murray, 1869), chapter XV, the 1847 record and the 1848 words written round its margin. McClintock's quotation marks, the printer's brace, and the two-column setting of the signatures are reduced to running text; the OCR's \"700 05'\", \"nth June\" and \"Des Vceux\" are the printed degrees, \"11th June\" and \"Des Voeux\". The record itself notes the wintering at Beechey Island as 1846-7; it was 1845-6.",
    historicalContext:
      "This is the only written word that ever came back from Franklin's last expedition. Lieutenant Gore wrote the first part on an Admiralty form in May 1847 and left it in a cairn on King William Island: two winters passed, Wellington Channel explored, \"All well\". Eleven months later Fitzjames wrote round its edges that Franklin was dead, that the ships had been abandoned in the ice, and that 105 men were walking south for the Back River; Crozier added the date they would start. None of them reached it. Lieutenant Hobson of McClintock's Fox found the paper under the cairn in May 1859, and McClintock printed it in his book that year, in the form transcribed here. The Inuit of King William Island had told John Rae in 1854 what had happened to the men; the paper told when.",
    vocabulary: [
      { word: "Beechey Island", definition: "Where the Erebus and Terror spent their first winter, 1845-46, and where three graves were found in 1850" },
      { word: "beset", definition: "Held fast in the ice; the ships were beset off King William Island from September 1846 and never moved again" },
      { word: "Back's Fish River", definition: "The Back River, which runs to the Arctic coast south-east of King William Island; the crews hoped to ascend it to the Hudson's Bay Company's posts" },
      { word: "105 souls", definition: "The men still alive in April 1848, of the 129 who had sailed" },
      { word: "cairn", definition: "A pile of stones built as a mark, with the record in a tin cylinder under it" },
    ],
    discussionQuestions: [
      "Read the two parts of the record as if a year apart. What changed, and what is not said?",
      "Why would an expedition leave a paper in a pile of stones, and who was it for?",
      "Franklin died a month after the first note. What does the record tell about how the ships were commanded after that?",
      "The Inuit knew what happened to these men five years before the paper was found. Why was the paper still treated as the proof?",
    ],
    citation: { author: "F. L. McClintock", title: "The Fate of Sir John Franklin: the Voyage of the 'Fox' in the Arctic Seas, fourth edition", publisher: "London: John Murray, 1869", year: "1869", url: "https://archive.org/details/fateofsirjohnfra00mcli" },
    edition: "fateofsirjohnfra00mcli.txt",
    ocrFixes: [
      ["\"28th of May, ( H. M. ships 'Erebus' and 'Terror' wintered in the 1847. \\ ice in lat. 700 05' N., long. 980 23' W.", "28th of May, 1847. H. M. ships 'Erebus' and 'Terror' wintered in the ice in lat. 70° 05' N., long. 98° 23' W."],
      ["in lat. 740 43' 28\" N., long. 910 39' 15\" W.,", "in lat. 74° 43' 28\" N., long. 91° 39' 15\" W.,"],
      ["Cornwallis Island. \" Sir John Franklin commanding the expedition. \" All well. \" Party consisting", "Cornwallis Island. Sir John Franklin commanding the expedition. All well. Party consisting"],
      ["24th May, 1847. \"Gm. Gore, Lieut. \" Chas. F. Des Vceux, Mate.\"", "24th May, 1847. Gm. Gore, Lieut. Chas. F. Des Voeux, Mate."],
      ["\"April 25, 1848.— H. M. ships", "April 25, 1848.—H. M. ships"],
      ["long. 980 41' W. Sir John Franklin died on the nth June, 1847;", "long. 98° 41' W. Sir John Franklin died on the 11th June, 1847;"],
      ["(Signed) (Signed) \" F. R. M. Crozier, \"James Fitzjames, \" Captain and. Senior Officer. \"Captain H. M. S. 'Erebus.' \"and start (on) to-morrow, 26th, for Back's Fish River.\"", "(Signed) F. R. M. Crozier, Captain and Senior Officer. (Signed) James Fitzjames, Captain H. M. S. 'Erebus.' and start (on) to-morrow, 26th, for Back's Fish River."],
    ],
  },
  {
    id: "psd_voice_frobisher_bay_1578",
    title: "George Best on the People of Frobisher's Bay and their Boats, 1578",
    documentType: "report", author: "George Best", originalDate: "The voyages of 1576-1578; published 1578", originalYear: 1578, gradeLevel: "7-9",
    explorerId: "cmlnewexp002frobisher", waterwayId: "frobisher-bay-waterway", locationId: "loc_kodlunarn-island",
    spot: { latitude: 62.8, longitude: -65.42, name: "Countess of Warwick's Sound (Kodlunarn Island), Frobisher's base in 1577 and 1578" },
    transcription:
      "For their weapons, to offende their enimies, or kill their pray withall, they have dartes, slings, bowes, and arrows headed with sharp stones, bones, and some with yron. They are exceedingly friendly and kinde harted, one to the other, and mourne greatly at the losse or harme of their fellowes, and expresse their griefe of minde, when they part one from an other, with a mournefull song, and Dirges. [...] They have boates made of leather, and covered cleane over, saving one place in the middle to sit in, plancked within with timber, and they use to rowe therein with one ore, more swiftly a great deale, than we in our boates can doe with twentie. They have one sort of greater boates wherin they can carrie above twentie persons, and have a mast wyth a sayle thereon, whiche sayle is made of thinne skinnes or bladders, sowed together with the sinewes of fishes. They are good fishermen, and in their small boates, beeing disguised with their coates of ceales skinnes, they deceyve the fishe, who take them rather for their fellowe ceales, than for deceyving men. They are good marke men. With their darte or arrowe they will commonly kill ducke or any other foule in the head and commonly in the eye.",
    checked: "Quotation checked against George Best, A True Discourse of the late Voyages of Discoverie (London, 1578), as reprinted in The Three Voyages of Martin Frobisher, ed. Richard Collinson (London: Hakluyt Society, 1867), the general description of the country and people that follows the third voyage. The spelling is Best's; the OCR's stray quotation mark before \"They are exceedingly\" is omitted. The approved list dated this 1577; Best's description stands at the end of his account of 1578.",
    historicalContext:
      "Martin Frobisher sailed three times, in 1576, 1577 and 1578, into the bay on Baffin Island that carries his name, looking for a passage to China and then for gold; the ore he brought home, fifteen hundred tons of it, proved worthless. George Best, who sailed on the second and third voyages as a lieutenant and captain, published the account the same year. His description of the Inuit of the bay is one of the earliest in English: their kayaks and umiaks, their seal-skin disguise on the water, their marksmanship. It stands beside the other side of these voyages, which Best also tells: the Inuit captured and carried to England in 1576 and 1577, who all died there, and the fights at Bloody Point. The Inuit of Frobisher Bay kept their own account of the strangers for three centuries, and told it to Charles Francis Hall in 1861.",
    vocabulary: [
      { word: "boates made of leather", definition: "Kayaks, the sealskin-covered boats Best saw rowed with one oar faster than his own with twenty" },
      { word: "greater boates", definition: "Umiaks, the large open skin boats with a sail that carried twenty people" },
      { word: "ceales skinnes", definition: "Seal skins: the coats in which hunters lay on the water to look like seals" },
      { word: "dartes", definition: "Throwing spears; with slings, bows and arrows the weapons Best lists" },
      { word: "Countess of Warwick's Sound", definition: "Frobisher's name for the inlet where his base and mine stood, now Kodlunarn Island" },
    ],
    discussionQuestions: [
      "What impressed Best about the boats, and how does he measure them against his own?",
      "What does the seal-skin disguise tell you about how well these hunters knew the animals they hunted?",
      "Best calls the people friendly and kind-hearted to one another. What else happened between his people and theirs?",
      "The Inuit remembered these voyages for three hundred years. What might their account have said that Best's does not?",
    ],
    citation: { author: "George Best", title: "A True Discourse of the late Voyages of Discoverie (1578), in The Three Voyages of Martin Frobisher, ed. Richard Collinson", publisher: "London: Hakluyt Society, 1867", year: "1867", url: "https://archive.org/details/cihm_03952" },
    edition: "cihm_03952.txt",
    ocrFixes: [["some with yron. ‘They are exceedingly friendly", "some with yron. They are exceedingly friendly"]],
  },
  {
    id: "psd_voice_lake_winnipeg_1775",
    title: "Alexander Henry the Elder Reaches Lake Winnipeg, 1775",
    documentType: "journal", author: "Alexander Henry the Elder", originalDate: "August 1775; published 1809", originalYear: 1775, gradeLevel: "7-9",
    explorerId: "cmlijaid00007m22rzrs1u1i7", waterwayId: "cmlhaslri0014m2zhlrrx8pqe", locationId: null,
    spot: { latitude: 50.62, longitude: -96.3, name: "The mouth of the Winnipeg River on Lake Winnipeg, at the Cree village, August 1775" },
    transcription:
      "From the Portage du Rat, we descended the great river Winipegon, which is there from one mile to two in breadth, and at every league grows broader. The channel is deep, but obstructed by many islands, of which some are large. For several miles, the stream is confined between perpendicular rocks. The current is strong, and the navigation singularly difficult. Within the space of fifteen leagues, there are seven falls, of from fifty feet to a hundred in height. [...] On the sixteenth, we reached Lake Winipegon, at the entrance of which is a large village of Christinaux, a nation which I had not previously seen. The name is variously written; as, Cristinaux, Kinistineaux, Killistinoes and Killistinaux. Lake Winipegon is sometimes called the Lake of the Killistinons, or Cristinaux. The dress and other exterior appearances of the Cristinaux are very distinguishable from those of the Chipeways and the Wood Indians. The men were almost entirely naked, and their bodies painted with a red ochre, procured in the mountains, and often called vermilion. Every man and boy had his bow strung and in his hand, and his arrow ready, to attack in case of need. Their heads were shaved, or the hair plucked out, all over, except a spot on the crown, of the diameter of a dollar. On this spot, the hair grew long, and was rolled and gathered into a tuft; and the tuft, which is an object of the greatest care was covered with a piece of skin. The ears were pierced, and filled with the bones of fish and of land animals. — Such was the costume of the young men; but, among the old, some let their hair grow on all parts of their head, without any seeming regard.",
    checked: "Quotation checked against Alexander Henry, Travels and Adventures in Canada and the Indian Territories between the Years 1760 and 1776 (New York, 1809), in the edition of James Bain (Toronto: Morang, 1901), part II, chapter V, the descent of the Winnipeg River and the arrival at Lake Winnipeg in August 1775. The edition's footnote marks are omitted; the OCR's \"KiLlistinaux\" and \"Winipeeon\" are the printed \"Killistinaux\" and \"Winipegon\".",
    historicalContext:
      "Alexander Henry, who had survived the taking of Michilimackinac in 1763, went west in 1775 with the Frobishers and Peter Pond into the country the French had left, the first of the Montreal traders to reach the Saskatchewan. His route was La Vérendrye's: Lake of the Woods, the Winnipeg River with its falls and portages, and the great lake at the river's mouth, where the Cree, whom he calls Christinaux, had a village. Henry wrote his book thirty years later from his journals, and his descriptions of the people he met, their dress, their hair, their readiness to fight, are the kind a trader made for other traders: careful, outside, and the record we have. The village site is near Fort Alexander, where the North West Company later built, and the Sagkeeng First Nation lives there now.",
    vocabulary: [
      { word: "Winipegon", definition: "Henry's spelling, his alone, of the Cree name for the river and the lake: muddy water" },
      { word: "Christinaux", definition: "The Cree, in one of the many French spellings of the name; Henry lists four" },
      { word: "Portage du Rat", definition: "Rat Portage, where the Winnipeg River leaves Lake of the Woods; Kenora stands there now" },
      { word: "vermilion", definition: "Red ochre paint; Henry says it came from the mountains" },
      { word: "Chipeways", definition: "The Ojibwe (Anishinaabe), among whom Henry had lived for a year after 1763" },
    ],
    discussionQuestions: [
      "What made the Winnipeg River hard to travel, and why did traders use it anyway?",
      "Why did every man and boy in the village have his bow strung when the traders arrived?",
      "Henry describes people he has never met as if for a reader who never will. What does he notice, and what does he not ask?",
      "Henry followed a French route of forty years before. What had happened to the French posts in between?",
    ],
    citation: { author: "Alexander Henry", title: "Travels and Adventures in Canada and the Indian Territories between the Years 1760 and 1776, ed. James Bain", publisher: "Toronto: George N. Morang, 1901 (from the New York edition of 1809)", year: "1901", url: "https://archive.org/details/travelsadventur00henr" },
    edition: "travelsadventur00henr.txt",
    ocrFixes: [["a hundred in height.^^ At sixty", "a hundred in height. At sixty"], ["village of Christinaux,^^ a nation", "village of Christinaux, a nation"], ["Killistinoes and KiLlistinaux. Lake Winipeeon is", "Killistinoes and Killistinaux. Lake Winipegon is"]],
  },
  {
    id: "psd_voice_fort_st_charles_1733",
    title: "La Vérendrye's Letter from Fort St. Charles, Lake of the Woods, May 1733",
    documentType: "letter", author: "Pierre Gaultier de Varennes, Sieur de La Vérendrye", originalDate: "21 May 1733, to Governor Beauharnois", originalYear: 1733, gradeLevel: "7-9",
    explorerId: "cmlhc4gt00009m2ogntt9le4v", waterwayId: "cmlk2w3jm0002m2636jrqvptl", locationId: "fort_st_charles_location",
    spot: { latitude: 49.3667, longitude: -95.15, name: "Fort St. Charles, on the west side of Lake of the Woods, 21 May 1733" },
    transcription:
      "I have the honour to send you my nephew La Jemeraye to inform you of all I have done and discovered since my arrival in this region. I was not able to establish the fort at Winnipeg last year owing to the difficulty the savages made about the road and also owing to the impossibility of getting men on account of their fear of dying of starvation in those parts. Moreover, canoes coming from Montreal would not have been able to get to us the same year. They did not arrive here till the ice was beginning to form. I have established myself, by the advice of the Reverend Father Mesaiger, on the west side of the Lake of the Woods, nearly two hundred leagues from Kaministikwia, at the mouth of a river. There is good fishing and hunting, quantities of wild oats, and excellent land cleared by fire which I am now putting in seed. We are with the Cree and near the Assiniboin. None of them have yet come to the fort as they have in some way been made afraid of us, as my nephew will explain to you. All the savages around here are very fond of war. I stopped them all last year, but this year I had to let them go on with it, forbidding them, however, to go to the river Sioux, which they promised not to do; they are all going in the direction of the prairies. I have sent my nephew and my son to Ouinipigon to put up a fort there and to invite the savages of that place to come here. I expect that they will have it finished by the month of August next on the return of our canoes.",
    checked: "Quotation checked against Journals and Letters of Pierre Gaultier de Varennes de La Vérendrye and his Sons, ed. Lawrence J. Burpee (Toronto: Champlain Society, 1927), the letter to Beauharnois dated at Fort Saint Charles on the Lake of the Woods, 21 May 1733, in Burpee's English with the French facing. The edition's footnote marks are omitted; the OCR gave French accents to a number of English words (hâve, corne, Ail, Créé, canoës, région, arrivai), which are the printed have, come, All, Cree, canoes, region, arrival.",
    historicalContext:
      "La Vérendrye, commandant of the post at Kaministiquia, had been told of a western sea by the Cree and in 1731 set out to find it with three of his sons and his nephew La Jemeraye, on credit from Montreal merchants who wanted furs. Fort St. Pierre on Rainy Lake came first; in the summer of 1732 he built Fort St. Charles on the west side of Lake of the Woods, in the Cree and Assiniboine country, and this letter is his first report from it: no men would come for fear of starving, the Cree were at war with the Sioux, and the fort on Lake Winnipeg would have to wait a year. It did not wait well. In 1736, on an island in this lake, the Sioux killed his eldest son Jean-Baptiste, the Jesuit Aulneau and nineteen voyageurs; La Jemeraye died the same year. La Vérendrye went on to the Assiniboine, the Red and the Mandan villages on the Missouri, and his sons to the foot of the Rockies, and never found a western sea.",
    vocabulary: [
      { word: "La Jemeraye", definition: "Christophe Dufrost de La Jemeraye, La Vérendrye's nephew and second in command, who carried this letter to Quebec; he died in 1736" },
      { word: "wild oats", definition: "Wild rice, the staple of the Lake of the Woods country, which the French called folle avoine" },
      { word: "Ouinipigon", definition: "Lake Winnipeg, where Fort Maurepas was built at the mouth of the Red River the following year" },
      { word: "Beauharnois", definition: "Charles de Beauharnois, governor of New France, to whom La Vérendrye reported" },
      { word: "the river Sioux", definition: "The Dakota of the Mississippi, with whom the Cree and Assiniboine were at war" },
    ],
    discussionQuestions: [
      "What stopped La Vérendrye from building where he wanted to, and whose decisions were they?",
      "What did Fort St. Charles have that made it a good place to winter?",
      "He says he \"stopped\" the Cree from going to war one year and could not the next. How much control did he really have?",
      "What happened at Lake of the Woods three years after this letter, and why?",
    ],
    citation: { author: "Pierre Gaultier de Varennes de La Vérendrye", title: "Journals and Letters of Pierre Gaultier de Varennes de La Vérendrye and his Sons, ed. Lawrence J. Burpee", publisher: "Toronto: Champlain Society, 1927", year: "1927", url: "https://archive.org/details/P000027" },
    edition: "P000027.txt",
    ocrFixes: [["hâve", "have"], ["canoës", "canoes"], ["this région", "this region"], ["my arrivai in", "my arrival in"], ["you of ail I have done", "you of all I have done"], ["of a river.1 There is", "of a river. There is"], ["with the Créé and", "with the Cree and"], ["yet corne to the fort", "yet come to the fort"], ["Ail the savages", "All the savages"], ["stopped them ail last year", "stopped them all last year"], ["the river Sioux,2 which", "the river Sioux, which"], ["they are ail going", "they are all going"], ["up a fort there 1 and to invite", "up a fort there and to invite"], ["to corne here.", "to come here."]],
  },
  {
    id: "psd_voice_slave_river_1789",
    title: "Mackenzie at the Rapids of the Slave River, June 1789",
    documentType: "journal", author: "Alexander Mackenzie", originalDate: "5 June 1789; published 1801", originalYear: 1789, gradeLevel: "7-9",
    explorerId: MACKENZIE, waterwayId: "ww_slave-river", locationId: "loc_fort-smith",
    spot: { latitude: 60.0, longitude: -111.89, name: "The rapids and portages of the Slave River at the Alberta boundary, now Fort Smith, 5 June 1789" },
    transcription:
      "At three o'clock in the morning we embarked, but unloaded our canoes at the first rapid. When we had reloaded, we entered a small channel, which is formed by the islands, and, in about half an hour, we came to the carrying-place It is three hundred and eighty paces in length, and very commodious, except at the further end of it. [...] That called the Mountain is three hundred and thirty-five paces in length; from thence to the next, named the Pelican, there is about a mile of dangerous rapids. The landing is very steep, and close to the fall. The length of this carrying-place is eight hundred and twenty paces. The whole of the party were now employed in taking the baggage and the canoe up the hill. One of the Indian canoes went down the fall, and was dashed to pieces. The woman who had the management of it, by quitting it in time, preserved her life, though she lost the little property it contained. The course from the place we quitted in the morning is about North-West, and comprehends a distance of fifteen miles. From hence to the next and last carrying-place, is about nine miles; in which distance there are three rapids: course North-West by West. The carrying path is very bad, and five hundred and thirty-five paces in length. Our canoes being lightened, passed on the outside of the opposite island, which rendered the carrying of the baggage very short indeed, being not more than the length of a canoe. In the year 1786, five men were drowned, and two canoes and some packages lost, in the rapids on the other side of the river, which occasioned this place to be called the Portage des Noyes. They were proceeding to the Slave Lake, in the fall of that year, under the direction of Mr. Cuthbert Grant. We proceeded from hence six miles, and encamped on Point de Roche, at half past five in the afternoon. The men and Indians were very much fatigued; but the hunters had provided seven geese, a beaver, and four ducks.",
    checked: "Quotation checked against Alexander Mackenzie, Voyages from Montreal (London, 1801), the Journal of a Voyage through the North-West Continent of America in 1789, the entry of Friday 5 June 1789, read in the Project Gutenberg transcription of vol. I (eBook #35658), whose \"carrying-place It is\" is kept as the transcription prints it. The Gutenberg italic marks round the portage's name are omitted.",
    historicalContext:
      "Two days out from Fort Chipewyan, Mackenzie's party came to the sixteen miles of rapids where the Slave River drops off the Shield, the one serious obstacle between Lake Athabasca and the Arctic. Four portages in a day: the Mountain, the Pelican, and the Portage des Noyés, the drowned men's portage, named for the five North West Company men lost there in 1786 under Cuthbert Grant. Mackenzie's own party lost a canoe that day, and he records the Dene woman who saved herself from it, one of several women travelling with the expedition whose names he never gives. Fort Smith stands at the foot of these rapids now, and the portage road round them was the route north for a century and a half.",
    vocabulary: [
      { word: "carrying-place", definition: "A portage: the path round a rapid along which canoe and cargo are carried, measured by Mackenzie in paces" },
      { word: "Portage des Noyés", definition: "The drowned men's portage, named for the five men lost in the rapids in 1786" },
      { word: "Cuthbert Grant", definition: "The North West Company trader whose brigade lost the canoes in 1786; his son of the same name led the Métis at Seven Oaks in 1816" },
      { word: "Slave Lake", definition: "Great Slave Lake, which the river enters below the rapids; the Dene of its shores gave the river and the lake their English name" },
      { word: "Point de Roche", definition: "Rock Point, the camp below the last rapid" },
    ],
    discussionQuestions: [
      "How many times did the party carry everything in one day, and how far?",
      "What happened to the woman's canoe, and what does Mackenzie tell us about her?",
      "Why did a place get a name like the Portage des Noyés, and what did the name do for the next brigade?",
      "The hunters brought in seven geese, a beaver and four ducks. How many people was that for?",
    ],
    citation: GUTENBERG_MACKENZIE,
    edition: "gut35658.txt",
    ocrFixes: [["called the _Portage des Noyes_.", "called the Portage des Noyes."]],
  },
  {
    id: "psd_voice_fort_franklin_1825",
    title: "The Opening of Fort Franklin on Great Bear Lake, September 1825",
    documentType: "journal", author: "Sir John Franklin", originalDate: "23 September 1825; published 1828", originalYear: 1825, gradeLevel: "4-6",
    explorerId: FRANKLIN, waterwayId: "cmlhaslro0018m2zh54ssf898", locationId: "loc_fort-franklin",
    spot: { latitude: 65.19, longitude: -123.43, name: "Fort Franklin, at the outlet of Great Bear Lake, now Délı̨nę, 23 September 1825" },
    transcription:
      "The chimney of the last of the buildings being completed this morning, the flag-staff erected, and all the men assembled, we commemorated these events by the festivities usual on the opening of a new establishment in this country. The first part of the ceremony was to salute the flag; the men having drawn themselves up in line, and the women and children, and all the Indians resident at the fort, being disposed in groups by their side, a deputation came to solicit the presence of the officers. When we appeared, we found our guns ornamented with blue ribbons, and we were requested to advance and fire at a piece of money which was fastened to the flag-staff. The men then fired two volleys and gave three hearty cheers, after which Wilson the piper struck up a lively tune, and placing himself at the head of his companions, marched with them round to the entrance of the hall, where they drank to His Majesty's health, and to the success of the Expedition. In the evening the hall was opened for a dance, which was attended by the whole party, dressed in their gayest attire. The dancing was kept up with spirit to the music of the violin and bagpipes, until daylight.",
    checked: "Quotation checked against John Franklin, Narrative of a Second Expedition to the Shores of the Polar Sea, in the Years 1825, 1826, and 1827 (London: Murray, 1828), chapter II, the entry of Friday 23 September 1825 at Fort Franklin, read in the Project Gutenberg transcription (eBook #33467). The edition's sidenote date is omitted.",
    historicalContext:
      "Franklin's second expedition was everything the first had not been: planned two years ahead, supplied by the Hudson's Bay Company, carried in proper boats, and wintered in a house of its own. Fort Franklin was built in the autumn of 1825 on the site of an old North West Company post at the outlet of Great Bear Lake, in the country of the Sahtú Dene, who fished the lake and hunted for the fort all winter. This is its opening day: fifty people, British seamen, Canadian voyageurs, Dene families, a piper and a fiddler, and a dance till daylight at sixty-five degrees north. From here in 1826 Franklin went down the Mackenzie to the Arctic coast and west to Alaska while Richardson mapped the coast east to the Coppermine, and no one died. The Dene community of Délı̨nę stands on the site.",
    vocabulary: [
      { word: "establishment", definition: "A trading post or fort; the word Franklin and the Company used" },
      { word: "Wilson the piper", definition: "One of the party; the fort had a bagpiper and a fiddler for the winter" },
      { word: "volley", definition: "Guns fired together as a salute" },
      { word: "Great Bear Lake", definition: "The largest lake wholly in Canada, whose fish fed the fort; the Sahtú Dene's lake" },
      { word: "Délı̨nę", definition: "The Dene community on the site of Fort Franklin, whose name means where the water flows" },
    ],
    discussionQuestions: [
      "Who was at the ceremony, and who stood where?",
      "Why would an expedition on the edge of the Arctic bring a piper and a fiddler?",
      "Compare this winter with the one Franklin's first expedition spent at Fort Enterprise. What had changed?",
      "The fort was built where a community lives today. What does that tell you about why the site was chosen?",
    ],
    citation: { author: "John Franklin", title: "Narrative of a Second Expedition to the Shores of the Polar Sea, in the Years 1825, 1826, and 1827", publisher: "London: John Murray, 1828; Project Gutenberg eBook #33467", year: "1828", url: "https://www.gutenberg.org/ebooks/33467" },
    edition: "gut33467.txt",
  },
  {
    id: "psd_voice_rensselaer_harbor_1854",
    title: "Kane at Rensselaer Harbor: the Winter Coming, September 1854",
    documentType: "journal", author: "Elisha Kent Kane", originalDate: "10 September 1854; published 1856", originalYear: 1854, gradeLevel: "7-9",
    explorerId: "ex_elisha-kent-kane", waterwayId: "ww_smith-sound", locationId: null,
    spot: { latitude: 78.62, longitude: -70.9, name: "Rensselaer Harbor, on the Greenland side of Smith Sound, where the Advance wintered, 1853-55" },
    transcription:
      "The winter was now approaching rapidly. The thermometer had fallen by the 10th of September to 14°, and the young ice had cemented the floes so that we could walk and sledge round the brig. About sixty paces north of us an iceberg had been caught, and was frozen in: it was our neighbor while we remained in Rensselaer Harbor. The rocky islets around us were fringed with hummocks; and, as the tide fell, their sides were coated with opaque crystals of bright white. The birds had gone. The sea-swallows, which abounded when we first reached here, and even the young burgomasters that lingered after them, had all taken their departure for the south. Except the snow-birds, these are the last to migrate of all the Arctic birds. \"September 10, Saturday.—We have plenty of responsible work before us. The long 'night in which no man can work' is close at hand: in another month we shall lose the sun. Astronomically, he should disappear on the 24th of October if our horizon were free; but it is obstructed by a mountain ridge, and, making all allowance for refraction, we cannot count on seeing him after the 10th. \"First and foremost, we have to unstow the hold, and deposit its contents in the storehouse on Butler Island. Brooks and a party are now briskly engaged in this double labor, running loaded boats along a canal that has to be recut every morning. \"Next comes the catering for winter diet. We have little or no game as yet in Smith's Sound; and, though the traces of deer that we have observed may be followed by the animals themselves, I cannot calculate upon them as a resource.",
    checked: "Quotation checked against Elisha Kent Kane, Arctic Explorations: the Second Grinnell Expedition in Search of Sir John Franklin, 1853, '54, '55, vol. I (Philadelphia: Childs and Peterson, 1856), chapter X, the opening of the second winter and the journal entry of 10 September 1854. Kane's quotation marks round the journal entries are kept; the OCR's \"w^e\" is the printed \"we\".",
    historicalContext:
      "Kane took the brig Advance north through Smith Sound in 1853, farther than any ship had gone, in search of Franklin and of an open polar sea, and froze in at Rensselaer Harbor on the Greenland shore. The ice never let the ship go. This is the second September, with the sun about to leave for four months, the birds gone, and a crew already weakened by scurvy; the Inughuit of Etah, forty miles south, kept them alive that winter with walrus meat. In May 1855 Kane abandoned the brig and led his men eighty-three days south by sledge and boat to the Danish settlements. His book was the most read Arctic narrative of its day, and it is written, as this page is, as a journal kept in the dark.",
    vocabulary: [
      { word: "brig", definition: "A two-masted square-rigged ship; Kane's Advance was one, of 144 tons" },
      { word: "floes", definition: "Sheets of floating ice; the young ice cemented them round the ship in September" },
      { word: "burgomasters", definition: "Glaucous gulls, the big pale gulls of the High Arctic, in the sailors' name" },
      { word: "Butler Island", definition: "The islet near the ship where Kane built his storehouse" },
      { word: "Smith's Sound", definition: "The strait between Ellesmere Island and Greenland, Kane's farthest north" },
    ],
    discussionQuestions: [
      "What signs of the coming winter does Kane list, and in what order?",
      "Why did the hold have to be unloaded before the dark came?",
      "Kane had no game. Who fed his crew that winter, and what did the Inughuit get in return?",
      "What is the \"night in which no man can work\", and where does the phrase come from?",
    ],
    citation: { author: "Elisha Kent Kane", title: "Arctic Explorations: the Second Grinnell Expedition in Search of Sir John Franklin, 1853, '54, '55, vol. I", publisher: "Philadelphia: Childs and Peterson, 1856", year: "1856", url: "https://archive.org/details/arcticexploratio01kane" },
    edition: "arcticexploratio01kane.txt",
    ocrFixes: [["abounded when w^e first reached here", "abounded when we first reached here"], ["September 10, Saturday. — We have plenty", "September 10, Saturday.—We have plenty"]],
  },
];

seedVoices("2026-10-21-voices-bay-interior-north", ENTRIES);
