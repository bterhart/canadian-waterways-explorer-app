// Narrations, the Pacific and the Yukon (approved list 10.23, passages 16-19, 22, 28, 29;
// 2026-10-21). Seven checked transcriptions, each read in the full text of a published edition
// (Internet Archive scans) and compared against it by the edition checker before apply. Rules of
// passes 13 and 15: only text read in the edition, nothing added, omissions marked [...], OCR
// line-break hyphens joined and obvious scanner errors corrected, each declared in ocrFixes.
//   bun run prisma/turso-migrations/2026-10-21-voices-pacific-yukon.ts [--apply] [--only <id>] [--dump [path]]
import { seedVoices, type VoiceEntry } from "./lib/voices-seed";

const ENTRIES: VoiceEntry[] = [
  {
    id: "psd_voice_thompson_forks_1808",
    title: "Simon Fraser Names the Thompson River at Camchin (Lytton), June 1808",
    documentType: "journal", author: "Simon Fraser", originalDate: "19-20 June 1808; published 1889", originalYear: 1808, gradeLevel: "7-9",
    explorerId: "cmlhaslq90009m2zhn28km7lg", waterwayId: "ww_thompson-river", locationId: null,
    spot: { latitude: 50.233, longitude: -121.582, name: "Camchin, the forks of the Thompson and the Fraser, now Lytton, 19 June 1808" },
    transcription:
      "These Forks, the Indians call Camchin, and are formed by a large river, which is the same spoken of so often by our friend the Old Chief. From an idea that our friends of the Fort des Prairies department are established upon the source of it, among the mountains, we gave it the name of Thompson River. [...] Our three new guides, the Great Chief, a little fellow from whom we received much attention, and some others embarked to keep us company. Aided by heavy rapids and a strong current we, in a short time, came to a portage. Here the canoes and baggage were carried up a very steep hill; the ascent was dangerous, stones and fragments of rocks were continually giving away from our feet and rolling off in succession. One of our men was much hurt by stumbling on one of these stones, and the kettle he carried bounced into the river and was lost. The Indians informed us that at this place, some years ago, several of their people, having lost their balance from the steps giving away, rolled down to the river in the same way and perished. We saw many graves covered with small stones",
    checked: "Quotation checked against Simon Fraser's journal of 1808 as printed in L. R. Masson, Les Bourgeois de la Compagnie du Nord-Ouest, vol. I (Quebec: Côté, 1889), the entries of 19 and 20 June 1808 at the forks of the Thompson. The scan's OCR is poor; the corrections declared for the checker restore the printed words (the, which, whom, heavy, hill, canoes, chief) and drop the marginal headings the OCR ran into the text (\"Camchin River\", \"Jackass\"). The last sentence is cut where the page turns.",
    historicalContext:
      "Fraser left Fort George at the end of May 1808 to follow the river he believed was the Columbia to the sea. On 19 June he reached the forks where a great river came in from the east at the Nlaka'pamux town of Camchin, now Lytton, and named it for David Thompson, whom he supposed to be at its headwaters; Thompson never saw it. The Nlaka'pamux received the party, fed them, sold them two canoes, and sent three men to guide them on. Below the forks the real canyon began, the trail of ladders and poles above Spuzzum that the Fraser Canyon narration describes. The river Fraser was on was not the Columbia, and when he reached salt water on 2 July he knew it; it has carried his name since.",
    vocabulary: [
      { word: "Camchin", definition: "The Nlaka'pamux town at the forks of the two rivers, now Lytton; Fraser's spelling of its name" },
      { word: "Fort des Prairies department", definition: "The North West Company's Saskatchewan district, where Fraser believed Thompson to be" },
      { word: "the Old Chief", definition: "The Dakelh leader from Fort George who had told Fraser of the great river to the east and travelled with him" },
      { word: "portage", definition: "The carry round a rapid; here up a hill so steep that the footing gave way" },
      { word: "Thompson River", definition: "The river Fraser named on 19 June 1808 for David Thompson; its Nlaka'pamux name is different" },
    ],
    discussionQuestions: [
      "Why did Fraser give the river Thompson's name, and was he right about where Thompson was?",
      "What did the people of Camchin do for Fraser's party, and what did he give in return?",
      "What had happened at the portage before Fraser came, and how did he learn of it?",
      "Fraser believed he was on the Columbia. When did he find out he was not?",
    ],
    citation: { author: "Simon Fraser", title: "Journal of a Voyage from the Rocky Mountains to the Pacific Coast, 1808, in L. R. Masson, Les Bourgeois de la Compagnie du Nord-Ouest, vol. I", publisher: "Quebec: A. Côté, 1889", year: "1889", url: "https://archive.org/details/P000159" },
    edition: "P000159.txt",
    ocrFixes: [
      ["Tbese Forks,'the Indians callThc", "These Forks, the Indians call"],
      ["Rirer. Lamcbin, and are formed", "Camchin, and are formed"],
      ["whicb is tbe samc spoken", "which is the same spoken"],
      ["the Oid Chief. From an idea / that our friends of tbe Fort", "the Old Chief. From an idea that our friends of the Fort"],
      ["established upori -tKfe soiîrçe of it,among the mountairts, we gave it tbe name ol Thompson", "established upon the source of it, among the mountains, we gave it the name of Thompson"],
      ["Our tbreanew guides, tbe Great Cbief, a Httle fellow from wbom", "Our three new guides, the Great Chief, a little fellow from whom"],
      ["Aided by beavy rapids and a strong current Ijve, in", "Aided by heavy rapids and a strong current we, in"],
      ["Here tbe canoës and baggage were carrièd up a very steep bill; tbe ascent", "Here the canoes and baggage were carried up a very steep hill; the ascent"],
      ["on one of tbese Jackass stones, and tbe kettle he carried bounced into tbe river and was lost...", "on one of these stones, and the kettle he carried bounced into the river and was lost."],
      ["some years • • ago,", "some years ago,"],
      ["balance from0 tbe steps", "balance from the steps"],
      ["down to tbe river in the same", "down to the river in the same"],
      ["covered witb small stones", "covered with small stones"],
    ],
  },
  {
    id: "psd_voice_yuquot_whaling_1805",
    title: "Jewitt on the Whale Hunt at Nootka, 1803-1805",
    documentType: "journal", author: "John R. Jewitt", originalDate: "1803-1805, at Yuquot; published 1815", originalYear: 1804, gradeLevel: "7-9",
    explorerId: null, waterwayId: "cmlhci06w000dm2rx3bn9gj7e", locationId: "cmlhci092001fm2rxed77jk9j",
    spot: { latitude: 49.59, longitude: -126.62, name: "Yuquot (Friendly Cove), Maquinna's village on Nootka Sound, 1803-05" },
    transcription:
      "They are likewise little less skilful in taking the whale. This they kill with a kind of javelin or harpoon, thus constructed and fitted—The barbs are formed of bone, which are sharpened on the outer side, and hollowed within; for the purpose of forming a socket for the staff; these are then secured firmly together with a whale sinew, the point being fitted so as to receive a piece of muscle shell, which is ground to a very sharp edge, and secured in its place by means of turpentine. To this head or prong is fastened a strong line of whale sinew, about nine feet in length, to the end of which is tied a bark rope from fifty to sixty fathoms long, having from twenty to thirty seal-skin floats or buoys, attached to it at certain intervals, in order to check the motion of the whale, and obstruct his diving. In the socket of the harpoon a staff or pole of about ten feet long, gradually tapering from the middle to each end, is placed; this the harpooner holds in his hand, in order to strike the whale, and immediately detaches it as soon as the fish is struck. The whale is considered as the king's fish, and no other person, when he is present, is permitted to touch him, until the royal harpoon has first drawn his blood, however near he may approach; and it would be considered almost as sacrilege for any of the common people to strike a whale, before he is killed, particularly if any of the chiefs should be present.",
    checked: "Quotation checked against A Narrative of the Adventures and Sufferings of John R. Jewitt, only Survivor of the Crew of the Ship Boston, during a Captivity of nearly Three Years among the Savages of Nootka Sound (Middletown: Loomis and Richards, 1815), in the Ithaca printing of 1816, the chapter on the fisheries of the Nootka. The OCR's broken letters and stray stops (skilfa¥, coustructed, filty, ob-. stract, is.struck, tlie) are the printed words.",
    historicalContext:
      "John Jewitt, the armourer of the Boston, lived at Yuquot from March 1803 to July 1805 as a prisoner of Maquinna, the Mowachaht chief, after the ship's company was killed; he was kept for his skill at the forge. The journal he kept on the sound and the Narrative written from it after his release are the fullest account there is of the Mowachaht in the years after the sea-otter trade began. This is his description of the whale harpoon and of the rule that the chief struck first. The whale hunt was the privilege of the chiefs of the Nuu-chah-nulth nations, prepared for by months of ritual, and Maquinna's house at Yuquot was the centre of it.",
    vocabulary: [
      { word: "harpoon", definition: "The barbed spear on a detachable head, with a line and floats, used to take the whale" },
      { word: "muscle shell", definition: "Mussel shell, ground to an edge for the harpoon's blade" },
      { word: "fathom", definition: "Six feet; the bark rope ran fifty to sixty fathoms" },
      { word: "Maquinna", definition: "The chief of the Mowachaht at Yuquot, whose harpoon drew first blood" },
      { word: "Yuquot", definition: "Maquinna's summer village on Nootka Sound, called Friendly Cove by Cook's people" },
    ],
    discussionQuestions: [
      "Work through the harpoon from the barb to the floats. What did each part do?",
      "Why was the whale the chief's fish, and what would it mean to strike it before he did?",
      "Jewitt was a prisoner when he watched this. How might that shape what he was allowed to see and told?",
      "What did a whale give a village like Yuquot, beyond food?",
    ],
    citation: { author: "John R. Jewitt", title: "A Narrative of the Adventures and Sufferings of John R. Jewitt, only Survivor of the Crew of the Ship Boston", publisher: "Ithaca, 1816 (first published Middletown, 1815)", year: "1816", url: "https://archive.org/details/ayer_256_J5_1816" },
    edition: "ayer_256_J5_1816.txt",
    ocrFixes: [["little less skilfa¥ in taking", "little less skilful in taking"], ["thus coustructed and fitted—The barbs. are formed", "thus constructed and fitted—The barbs are formed"], ["rope from filty to sixty", "rope from fifty to sixty"], ["seal-skin floats. or buoys", "seal-skin floats or buoys"], ["and ob-. _ stract his diving", "and obstruct his diving"], ["from the middle to. each end", "from the middle to each end"], ["as soon as. the fish is.struck. _ The whale is considered as tlie king's", "as soon as the fish is struck. The whale is considered as the king's"], ["sacrilege for any — of the common", "sacrilege for any of the common"]],
  },
  {
    id: "psd_voice_grand_canyon_yukon_1883",
    title: "Schwatka's Raft at the Grand Cañon of the Yukon, July 1883",
    documentType: "journal", author: "Frederick Schwatka", originalDate: "1 July 1883; published 1885", originalYear: 1883, gradeLevel: "7-9",
    explorerId: "ex_frederick-schwatka", waterwayId: "cmlhbjrq5000bm2mbpbrh6i7v", locationId: "loc_miles-canyon",
    spot: { latitude: 60.67, longitude: -135.03, name: "The head of the Grand Cañon of the Yukon, now Miles Canyon above Whitehorse, 1 July 1883" },
    transcription:
      "On the morning of July 1st, we approached the great rapids of the Grand Cañon of the Yukon. Just as I had expected, our Tahkheesh guide in his cottonwood canoe was non est, until we were within sight of the upper end of the cañon and its boiling waters, and tearing along at six or seven miles an hour, when we caught sight of him frantically gesticulating to us that the rapids were in sight, which was plainly evident, even to us. He probably thought that our ponderous raft was as manageable in the seething current as his own light craft, or he never would have allowed us to get so near. In the twinkling of an eye we got ashore the first line that came to hand, and there was barely time to make both ends fast, one on the raft and the other to a convenient tree on the bank, before the spinning raft came suddenly to the end of her tether with a snappish twang that made the little rope sing like a musical string. Why that little quarter-inch manilla did not part seems a mystery, even yet,—it was a mere government flagstaff lanyard that we had brought along for packing purposes, etc.—but it held on as if it knew the importance of its task, and with the swift water pouring in a sheet of foam over the stern of the shackled raft, she slowly swung into an eddy under the lee of a gravel bar where she was soon securely fastened, whereupon we prepared to make an inspection of our chief impediment. A laborious survey of three or four hours' duration, exposed to heat and mosquitoes, revealed that the rapids were about five miles long and in appearance formidable enough to repel any one who might contemplate making the passage even in a good boat, while such an attempt seemed out of the question with an unmanageable raft like ours. The Yukon River, which had previously been about three hundred or three hundred and fifty yards in width, gradually contracts as it nears the upper gate of the cañon and at the point where the stream enters it in a high white-capped wave of rolling water, I do not believe its width exceeds one-tenth of that distance. The walls of the cañon are perpendicular columns of basalt, not unlike a diminutive Fingal's cave in appearance, and nearly a mile in length, the center of this mile stretch being broken into a huge basin of about twice the usual width of the stream in the cañon, and which is full of seething whirlpools and eddies where nothing but a fish could live for a minute.",
    checked: "Quotation checked against Frederick Schwatka, Along Alaska's Great River (New York: Cassell, 1885), chapter VII, \"The Grand Cañon of the Yukon\", the entry of 1 July 1883. The OCR's \"Cafion\", \"canon\", \"non, es-f\" and \"Fingal' s\" are the printed \"Cañon\", \"cañon\", \"non est\" and \"Fingal's\".",
    historicalContext:
      "Lieutenant Frederick Schwatka of the United States Army crossed the Chilkoot in June 1883 with a small party and Tlingit packers, built a raft at the head of Lake Lindeman, and floated it down the whole Yukon to the sea, the first survey of the river's upper course. This is the raft's arrival at the canyon the stampeders of 1898 would know as Miles Canyon, which Schwatka named for a general, as he named most things he passed; the Tagish and Tlingit names were already there. He ran the raft through it the next day. The canyon's walls are the basalt he describes; the rapids below it, the White Horse, were drowned by a dam in 1958.",
    vocabulary: [
      { word: "Tahkheesh", definition: "Schwatka's spelling of Tagish; his guide was a Tagish man in a cottonwood dugout" },
      { word: "non est", definition: "Latin for 'is not': the guide was nowhere to be seen" },
      { word: "manilla", definition: "Manila rope, made of abacá fibre; the quarter-inch line that held the raft" },
      { word: "Fingal's cave", definition: "The sea cave of basalt columns on the Scottish island of Staffa, which the canyon walls reminded Schwatka of" },
      { word: "Miles Canyon", definition: "Schwatka's name for the Grand Cañon, after General Nelson Miles; it kept the name" },
    ],
    discussionQuestions: [
      "What went wrong as the raft approached the canyon, and what saved it?",
      "Why would a raft be harder to handle than a canoe in fast water?",
      "Schwatka named the canyon for a general. Who had names for it before him?",
      "Fifteen years later thousands of stampeders came to this same place. What did they find, and what did the police make them do?",
    ],
    citation: { author: "Frederick Schwatka", title: "Along Alaska's Great River: a Popular Account of the Travels of the Alaska Exploring Expedition of 1883", publisher: "New York: Cassell, 1885", year: "1885", url: "https://archive.org/details/alongalaskasgrea00schwuoft" },
    edition: "alongalaskasgrea00schwuoft.txt",
    ocrFixes: [["Grand Cafion of the Yukon", "Grand Cañon of the Yukon"], ["was non, es-f, until", "was non est, until"], ["end of the canon and its boiling", "end of the cañon and its boiling"], ["little quartei'- inch manilla", "little quarter-inch manilla"], ["even yet, — it was", "even yet,—it was"], ["etc.— but it held", "etc.—but it held"], ["upper gate of the canon and at", "upper gate of the cañon and at"], ["walls of the canon are", "walls of the cañon are"], ["a diminutive Fingal' s cave", "a diminutive Fingal's cave"], ["stream in the canon, and which", "stream in the cañon, and which"]],
  },
  {
    id: "psd_voice_bonanza_forks_1897",
    title: "Adney at the Forks of Bonanza and Eldorado, Winter 1897",
    documentType: "journal", author: "Tappan Adney", originalDate: "Winter 1897-98; published 1900", originalYear: 1897, gradeLevel: "7-9",
    explorerId: null, waterwayId: "ww_klondike-river", locationId: "loc_bonanza-creek-discovery-claim",
    spot: { latitude: 63.92, longitude: -139.28, name: "Grand Forks, where Eldorado Creek meets Bonanza, winter 1897-98" },
    transcription:
      "We hurried on, clambering over dumps, now shuffling along the smooth, polished sled-trail, hardly comprehending the strange, weird sight. Three hours from camp we stood at the forks of Bonanza and Eldorado. The sight was one never to be forgotten. The sun, like a deep-red ball in a red glow, hung in the notch of Eldorado; the smoke settling down like a fog (for the evening fires were starting); men on the high dumps like spectres in the half-smoke, half mist; faint outlines of scores of cabins; the creaking of windlasses—altogether a scene more suggestive of the infernal regions than any spot on earth. It was hard to believe that this was the spot towards which all the world was looking.",
    checked: "Quotation checked against Tappan Adney, The Klondike Stampede (New York: Harper, 1900), chapter XX, the first walk up Bonanza to the forks. The scan's OCR is broken in this paragraph; the corrections declared for the checker restore the printed words (shuffling along, forks of, sun, like, red glow, settling, men, half-smoke, cabins, of windlasses, hard to), and the passage ends where the OCR becomes unreadable.",
    historicalContext:
      "Tappan Adney came over the Chilkoot in the autumn of 1897 as the correspondent of Harper's Weekly, reached Dawson in October, and spent the winter on the creeks; his book is the best eyewitness account of the Klondike rush. This is his first sight of the richest ground in the world: Grand Forks, where Eldorado came into Bonanza, a mile of claims that produced more gold than any other in the Klondike, with the miners' winter fires thawing the frozen gravel and the windlasses hauling it up to the dumps for the spring wash. Discovery claim, where Carmack, Skookum Jim and Dawson Charlie had found the gold in August 1896, was a little way downstream.",
    vocabulary: [
      { word: "dumps", definition: "The heaps of frozen gravel hauled up from the shafts over the winter, to be washed for gold when the water ran in spring" },
      { word: "windlass", definition: "The hand winch at the top of a shaft, for hauling up the bucket of gravel" },
      { word: "Eldorado", definition: "The creek that joins Bonanza at Grand Forks; its claims were the richest of the rush" },
      { word: "the forks", definition: "Grand Forks, the settlement at the meeting of Bonanza and Eldorado creeks" },
      { word: "Bonanza", definition: "Rabbit Creek until August 1896, when the discovery on it set off the rush" },
    ],
    discussionQuestions: [
      "What was burning, and why, in the scene Adney describes?",
      "Why does he reach for the infernal regions to describe the richest ground on earth?",
      "How was gold got out of frozen ground in winter, from what Adney shows?",
      "Who had found the gold here fifteen months before, and what became of them?",
    ],
    citation: { author: "Tappan Adney", title: "The Klondike Stampede", publisher: "New York: Harper and Brothers, 1900", year: "1900", url: "https://archive.org/details/klondikestamped00adnegoog" },
    edition: "klondikestamped00adnegoog.txt",
    ocrFixes: [["now shutHing ^doQg the smooth", "now shuffling along the smooth"], ["we stood at the forksi o( Bonanza", "we stood at the forks of Bonanza"], ["never lo be forgotten", "never to be forgotten"], ["The sun« like a deep-red ball in a nd glow« hung in the notch of EldoRido;", "The sun, like a deep-red ball in a red glow, hung in the notch of Eldorado;"], ["the smoke setthng down", "the smoke settling down"], ["ni'^n on the high dumps", "men on the high dumps"], ["in the balf<smoke» half mist", "in the half-smoke, half mist"], ["scores of catMns; the creaking o\\ windlasses — altogether", "scores of cabins; the creaking of windlasses—altogether"], ["It was bard t^ believe", "It was hard to believe"]],
  },
  {
    id: "psd_voice_mississippi_marquette_1673",
    title: "Marquette Enters the Mississippi, June 1673",
    documentType: "journal", author: "Jacques Marquette", originalDate: "17 June 1673; printed 1681", originalYear: 1673, gradeLevel: "7-9",
    explorerId: "cmlijaief000im22rw4wpvrxn", waterwayId: "ww_mississippi-river", locationId: "loc_prairie-du-chien",
    spot: { latitude: 43.05, longitude: -91.15, name: "The mouth of the Wisconsin on the Mississippi, at Prairie du Chien, 17 June 1673" },
    transcription:
      "After proceeding 40 leagues on This same route, we arrived at the mouth of our River; and, at 42 and a half degrees Of latitude, We safely entered Missisipi on The 17th of June, with a Joy that I cannot Express. [...] Here we are, then, on this so renowned River, all of whose peculiar features I have endeavored to note carefully. The Missisipi River takes its rise in various lakes in the country of the Northern nations. It is narrow at the place where Miskous empties; its Current, which flows southward, is slow and gentle. To the right is a large Chain of very high Mountains, and to the left are beautiful lands; in various Places, the stream is Divided by Islands. On sounding, we found ten brasses of Water. Its Width is very unequal; sometimes it is three-quarters of a league, and sometimes it narrows to three arpents. We gently followed its Course, which runs toward the south and southeast, as far as the 42nd degree of Latitude. Here we plainly saw that its aspect was completely changed. There are hardly any woods or mountains; The Islands are more beautiful, and are Covered with finer trees. We saw only deer and cattle, bustards, and Swans without wings, because they drop Their plumage in This country. From time to time, we came upon monstrous fish, one of which struck our Canoe with such violence that I Thought that it was a great tree, about to break the Canoe to pieces.",
    checked: "Quotation checked against The Jesuit Relations and Allied Documents, ed. Reuben Gold Thwaites, vol. LIX (Cleveland: Burrows, 1900), Marquette's account of the first voyage, sections 3 and 4, in Thwaites' English with the French facing; Thwaites' capitalisation, which follows the manuscript, is kept. The OCR's \"H=:\" is the printed \"Here\".",
    historicalContext:
      "Louis Jolliet and Father Jacques Marquette left Michilimackinac in May 1673 with five men in two canoes to find the great river the Illinois had told the French about, and whether it ran to the Gulf of Mexico or the Pacific. Two Miami guides took them from the Fox River over the portage to the Wisconsin, and on 17 June they came out on the Mississippi at what is now Prairie du Chien. They went down it to the Arkansas, far enough to be sure it reached the Gulf, and turned back. Jolliet's papers were lost when his canoe overturned in the Lachine Rapids on the way home; Marquette's account, written at the mission, is the record that survived, and this is its first page on the river.",
    vocabulary: [
      { word: "Meskousing", definition: "The Wisconsin River, in Marquette's spelling; the portage from the Fox River led to it" },
      { word: "brasse", definition: "The French fathom, about five and a half feet; ten of them was the depth they sounded" },
      { word: "arpent", definition: "A French measure of about 190 feet; the river narrowed to three of them" },
      { word: "cattle", definition: "Bison, which the French called wild cattle; Marquette describes them a page later" },
      { word: "Jolliet", definition: "Louis Jolliet of Quebec, the expedition's leader, whose own journal was lost in the Lachine Rapids" },
    ],
    discussionQuestions: [
      "Who showed the French the way to the river, and what did the French know about it before they arrived?",
      "What did Marquette measure and record on the first days, and why would those things matter to the next travellers?",
      "What were the \"monstrous fish\" likely to have been?",
      "Jolliet's record was lost and Marquette's survived. How does that shape what we know about the voyage?",
    ],
    citation: { author: "Jacques Marquette", title: "The Jesuit Relations and Allied Documents, vol. LIX, ed. Reuben Gold Thwaites", publisher: "Cleveland: Burrows Brothers, 1900", year: "1900", url: "https://archive.org/details/jesuitrelationsa0059reub" },
    edition: "jesuitrelationsa0059reub.txt",
    ocrFixes: [["H=: we are, then, on this", "Here we are, then, on this"]],
  },
  {
    id: "psd_voice_bennett_1898",
    title: "Steele at Lake Bennett in the Great Rush, Spring 1898",
    documentType: "journal", author: "Sam Steele", originalDate: "Spring 1898; published 1915", originalYear: 1898, gradeLevel: "7-9",
    explorerId: "ex_sam-steele", waterwayId: "ww_bennett-lake", locationId: "loc_bennett",
    spot: { latitude: 59.84, longitude: -134.99, name: "The North-West Mounted Police post at Lake Bennett, at the head of navigation on the Yukon, spring 1898" },
    transcription:
      "The situation was certainly unique, and not likely to be repeated on this earth again. The place was busy but orderly, about 7,000 men were encamped in the immediate vicinity, and across the river the sound of axes, hammers and whipsaws was incessant, making the place seem like one of the large shipyards in the days of wooden walls. East and west of us, from the foot of the Chilkoot and White Passes to Tagish, nearly 60 miles east, every available nook or flat was crowded with tents. The mountains towered to 5,000 feet north and south of these stretches of lake and river. To the west lay Lake Lindeman, several miles in length; to the east Lake Bennett stretched for 11 miles to where it narrows at Caribou Crossing, the channel which connects it with Nares Lake, which at its lower end joins Tagish, a magnificent stretch. The lakes and rivers were all frozen over. The post at Lake Bennett was well situated for our purposes, being at the head of navigation on the Yukon, and where the trails from both passes unite. During the great rush, which was now at its height, strange sights met the eye. An old woman in male attire, breeches, mackinaw coat, moccasins, and whip in hand was driving four goats hauling a sled, which contained part of a stock-in-trade for a laundry which she purposed starting in Dawson. She had lost her husband and children, but, full of pluck, she hoped to do well on the Klondyke. Another common sight was that of active men, for no others need be there, holding the gee pole of their sleds, which had sails set if the wind were fair, and their dog or dogs hitched up beside them, trotting along, their tails wagging with the enjoyment of being in the same team as their masters.",
    checked: "Quotation checked against Samuel B. Steele, Forty Years in Canada: Reminiscences of the Great North-West (London: Herbert Jenkins, 1915), chapter XV, the spring of 1898 at Lake Bennett. The OCR's \"II miles\" and \"imite\" are the printed \"11 miles\" and \"unite\".",
    historicalContext:
      "Superintendent Sam Steele of the North-West Mounted Police took command of the Yukon passes in February 1898 and made his headquarters at Lake Bennett, where the Chilkoot and White Pass trails met at the head of the Yukon's navigable water. Through the spring some thirty thousand stampeders camped along the frozen lakes building boats for the break-up; the police counted and registered every boat, made each carry a year's provisions, and turned back the unprepared at the summits. When the ice went out on 29 May, more than seven thousand boats started for Dawson in a few days. Steele wrote this seventeen years later, from his notes and his memory of the strangest spring of his career.",
    vocabulary: [
      { word: "whipsaw", definition: "The long two-man saw used to cut boat planks from green logs, the sound of Bennett that spring" },
      { word: "wooden walls", definition: "Warships built of timber; Steele compares the lakeshore to a navy shipyard of that age" },
      { word: "gee pole", definition: "The pole fixed to the front of a sled by which a man steered it while running alongside" },
      { word: "Caribou Crossing", definition: "The narrows between Bennett and Nares lakes, now Carcross" },
      { word: "head of navigation", definition: "The farthest point upstream that boats could reach; from Bennett the whole Yukon lay downstream" },
    ],
    discussionQuestions: [
      "What was everyone at Bennett doing while the lakes were still frozen, and why?",
      "What did the police require of each boat before it left, and what difference did that make to the people on them?",
      "What does the woman with the goats tell you about who went to the Klondike?",
      "Why does Steele call Bennett a place not likely to be repeated on this earth again?",
    ],
    citation: { author: "Samuel B. Steele", title: "Forty Years in Canada: Reminiscences of the Great North-West, with some Account of his Service in South Africa", publisher: "London: Herbert Jenkins, 1915", year: "1915", url: "https://archive.org/details/fortyyearsincana00steeuoft" },
    edition: "fortyyearsincana00steeuoft.txt",
    ocrFixes: [["stretched for II miles to where", "stretched for 11 miles to where"], ["from both passes imite.", "from both passes unite."]],
  },
];

seedVoices("2026-10-21-voices-pacific-yukon", ENTRIES);
