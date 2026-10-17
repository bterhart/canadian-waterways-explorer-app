// Primary-source pointers for The Pacific and the Russians (2026-10-17).
//   bun run prisma/turso-migrations/2026-10-17-primary-sources-pacific.ts [--apply]
//
// Same rules as the New France set: each PrimarySourceDocument row says what the source is,
// who made it and when, what it covers, and exactly where it can be read today, with URLs
// only where this session confirmed the page answers. No transcription is quoted. Rows link
// to the explorer, waterway and location they belong to and carry a grade band. Run after
// the pack itself, which creates several of the names used here. Idempotent by title.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const IA = (id: string) => `https://archive.org/details/${id}`;

interface Doc {
  title: string; documentType: "journal" | "report" | "letter" | "map" | "treaty";
  author: string; originalDate: string; originalYear: number;
  whatItIs: string; whereToReadIt: string[];
  vocabulary: { word: string; definition: string }[]; discussionQuestions: string[];
  gradeLevel: "4-6" | "7-9" | "10-12"; explorer?: string; waterway?: string; location?: string;
}

const DOCS: Doc[] = [
  {
    title: "Cook's Journal at Nootka Sound, March-April 1778", documentType: "journal", author: "James Cook", originalDate: "29 March - 26 April 1778", originalYear: 1778,
    whatItIs: "Cook's own daily record of the month his ships Resolution and Discovery lay in Nootka Sound on the third voyage. He describes the Mowachaht canoes that met him, the trade in sea-otter skins for iron, the long houses and carved posts at Yuquot, the songs and speeches, the repairs to the ships, and the people's insistence that the wood, water and grass the sailors took were theirs to sell. It is the first detailed European description of the Northwest Coast and its people, written by a careful observer who did not know he had a year to live.",
    whereToReadIt: [
      "Manuscript journals: The National Archives, Kew, and the British Library, London.",
      `First printing, with Cook's text edited by John Douglas: A Voyage to the Pacific Ocean (London, 1784), vol. 2, book 4, chapters 1-3 — ${IA("cihm_42435")}`,
      "Standard scholarly edition: J. C. Beaglehole, ed., The Journals of Captain James Cook, vol. 3, The Voyage of the Resolution and Discovery 1776-1780 (Hakluyt Society, 1967), in university libraries.",
    ],
    vocabulary: [{ word: "sea otter", definition: "The marine mammal whose dense fur, worth a fortune in China, drew four empires to the coast" }, { word: "Yuquot", definition: "The Mowachaht village at the mouth of Nootka Sound, called Friendly Cove by Cook's men" }, { word: "third voyage", definition: "Cook's 1776-1780 expedition to find a Northwest Passage from the Pacific side, on which he died in Hawaii" }],
    discussionQuestions: ["What did the Mowachaht want from Cook's ships, and what did they refuse to give away free?", "How does Cook describe the houses and the people, and what does he admit he does not understand?", "Why did a month of ship repairs change the history of the whole coast?"],
    gradeLevel: "10-12", explorer: "Captain James Cook", waterway: "Nootka Sound", location: "Friendly Cove Landing (Cook's Landing)",
  },
  {
    title: "Meares's Memorial to Parliament, 30 April 1790", documentType: "report", author: "John Meares", originalDate: "30 April 1790", originalYear: 1790,
    whatItIs: "The petition Meares laid before the British government and Parliament describing the seizure of his company's ships at Nootka by the Spanish commander Martínez in 1789, with fourteen enclosed statements from his officers. It claimed he had bought land from Maquinna, built a settlement and been robbed of it; the sum demanded in damages was enormous. The Memorial, printed and sold in London, was the document that moved Britain to mobilize its fleet. Historians treat it as exaggerated in almost every particular, which is exactly what makes it worth reading beside the Spanish account.",
    whereToReadIt: [
      `Authentic Copy of the Memorial to the Right Honourable William Wyndham Grenville (London, 1790) — ${IA("cihm_36828")}`,
      `Mr. Mears's Memorial, dated 30th April 1790, with 14 Inclosures, as printed for Parliament — ${IA("cihm_18264")}`,
      `Reprinted as an appendix to Meares's Voyages (1790) — ${IA("voyagesmadeinyea00mear")}`,
    ],
    vocabulary: [{ word: "memorial", definition: "A formal written statement of facts and claims presented to a government" }, { word: "Nootka Crisis", definition: "The 1789-1790 confrontation between Britain and Spain over the seizure of ships at Nootka Sound" }, { word: "damages", definition: "Money claimed as compensation for a loss" }],
    discussionQuestions: ["What does Meares say he owned at Nootka, and what proof does he give?", "Why would a trader exaggerate his losses to Parliament?", "How might Maquinna have described the same events?"],
    gradeLevel: "10-12", explorer: "John Meares", waterway: "Nootka Sound",
  },
  {
    title: "Meares's Voyages Made in the Years 1788 and 1789", documentType: "journal", author: "John Meares", originalDate: "1790", originalYear: 1790,
    whatItIs: "Meares's published narrative of his trading voyages from China to the Northwest Coast: wintering in Prince William Sound in 1786-87 and losing most of his crew to scurvy, trading at Nootka and Clayoquot in 1788, building the North West America at Yuquot, and the dealings with Maquinna and Wickaninnish. It is lively, full of detail about the coast and its people, and unreliable wherever Meares's own claims are concerned; read it with Mozino and Jewitt as correctives.",
    whereToReadIt: [
      `First edition (London, 1790), with the engraved plates — ${IA("voyagesmadeinyea00mear")}`,
      `Second edition, 1791 — ${IA("cihm_37636")}`,
    ],
    vocabulary: [{ word: "Portuguese colours", definition: "Meares sailed under the Portuguese flag to avoid British trading monopolies" }, { word: "scurvy", definition: "The vitamin deficiency that killed sailors on long voyages without fresh food" }, { word: "North West America", definition: "The schooner Meares's men launched at Yuquot in 1788, the first vessel built on the coast" }],
    discussionQuestions: ["How does Meares describe Wickaninnish's village at Clayoquot?", "Which parts of the book are eyewitness and which are hearsay or self-promotion?", "What does the book tell us about the sea-otter trade's prices and methods?"],
    gradeLevel: "7-9", explorer: "John Meares", waterway: "Clayoquot Sound",
  },
  {
    title: "The Nootka Convention and the Official Papers of 1790", documentType: "treaty", author: "The courts of Great Britain and Spain", originalDate: "28 October 1790", originalYear: 1790,
    whatItIs: "The treaty signed at the Escorial by which Spain agreed to restore the buildings and land taken from British subjects at Nootka, to pay for the seized ships, and to let British subjects trade and settle on the coast north of Spain's existing settlements. With it belong the papers the British government printed during the crisis: the Spanish ambassador's notes, the British replies and the declarations of 24 July 1790. The convention did not give the coast to anyone; it ended Spain's claim to own it by right and left possession to whoever occupied it.",
    whereToReadIt: [
      `Official Papers relative to the Dispute between the Courts of Great Britain and Spain on the Subject of the Ships Captured in Nootka Sound (London, 1790) — ${IA("bim_eighteenth-century_official-papers-relative_great-britain_1790_0")}`,
      `The convention and the related documents are printed in William R. Manning, The Nootka Sound Controversy (American Historical Association, 1905) — ${IA("nootkasoundcontr00mann")}`,
      "Martínez's own diary of 1789 survives in Spanish manuscript in the naval archives in Madrid; it has not been published in full in English.",
    ],
    vocabulary: [{ word: "convention", definition: "A treaty on a particular dispute, short of a full peace treaty" }, { word: "restitution", definition: "Giving back what was taken" }, { word: "Escorial", definition: "The royal palace near Madrid where the convention was signed" }],
    discussionQuestions: ["What did Spain actually agree to give up, and what did it keep?", "Why did the convention leave the ownership of the coast open?", "How did the convention matter to the fur posts built over the next fifty years?"],
    gradeLevel: "10-12", explorer: "Esteban José Martínez", waterway: "Nootka Sound", location: "Fort San Miguel (Spanish Fort at Nootka)",
  },
  {
    title: "Mozino's Noticias de Nutka, 1792", documentType: "report", author: "José Mariano Moziño", originalDate: "1792-1793", originalYear: 1792,
    whatItIs: "The report of the Mexican-born naturalist who spent the summer of 1792 at Nootka with Bodega y Quadra's expedition. Mozino learned enough of the Mowachaht language to compile a vocabulary, and wrote the fullest account of Nuu-chah-nulth life from the eighteenth century: government, religion, houses, food, whaling, war, the ranks of chiefs, Maquinna's household, and the history of the Spanish occupation and the seizures of 1789 told from the Spanish side. His companion Atanasio Echeverría drew the people and plants.",
    whereToReadIt: [
      `English translation: Iris H. Wilson Engstrand, ed., Noticias de Nutka: An Account of Nootka Sound in 1792 (University of Washington Press, 1970; reissued 1991), borrowable at the Internet Archive — ${IA("noticiasdenutkaa0000mozi")}`,
      "Spanish manuscript copies are held in Madrid and Mexico City; the Spanish text was first printed in Mexico in 1913.",
      "Echeverría's drawings and the portrait of Maquinna by Tomás de Suría are in the Museo de América and the Museo Naval, Madrid.",
    ],
    vocabulary: [{ word: "naturalist", definition: "A scientist who studies plants, animals and peoples in the field" }, { word: "Nutka", definition: "The Spanish spelling of Nootka" }, { word: "tais", definition: "Mozino's word for the ranking chiefs of the Mowachaht" }],
    discussionQuestions: ["What does Mozino record about how the Mowachaht governed themselves?", "How does his account of 1789 differ from Meares's Memorial?", "Why is a Spanish scientist's report one of the best sources on a Canadian First Nation?"],
    gradeLevel: "10-12", explorer: "Juan Francisco de la Bodega y Quadra", waterway: "Nootka Sound", location: "Fort San Miguel (Spanish Fort at Nootka)",
  },
  {
    title: "Vancouver's Voyage of Discovery to the North Pacific Ocean, 1798", documentType: "journal", author: "George Vancouver", originalDate: "1791-1795, published 1798", originalYear: 1798,
    whatItIs: "The official narrative of Vancouver's three summers of survey from California to Alaska, published after his death from his journals. It records the boat surveys of the Strait of Juan de Fuca, Puget Sound and the Strait of Georgia in 1792, the meeting with Galiano and Valdés off Point Grey, the negotiations with Bodega y Quadra at Nootka, the coasts of the Alaska panhandle in 1793 and 1794, and the villages and chiefs met on the way. The charts bound with it fixed the shape of the coast for a century.",
    whereToReadIt: [
      `First edition, vol. 1 (London, 1798) — ${IA("voyageofdiscover01vanc_1")}`,
      `First edition, vol. 2 (London, 1798) — ${IA("voyageofdiscover02vanc_1")}`,
      "Scholarly edition: W. Kaye Lamb, ed., The Voyage of George Vancouver 1791-1795, 4 vols. (Hakluyt Society, 1984), in university libraries.",
      "Manuscript logs of the Discovery and Chatham: The National Archives, Kew. Archibald Menzies's journal of the voyage: British Library.",
    ],
    vocabulary: [{ word: "running survey", definition: "Charting a coast from small boats rowed along the shore while the ship waited" }, { word: "Strait of Georgia", definition: "The inland sea between Vancouver Island and the mainland, which Vancouver named in June 1792" }, { word: "Point Grey", definition: "Where Vancouver met the Spanish ships Sutil and Mexicana on 22 June 1792" }],
    discussionQuestions: ["What did Vancouver's boats find in Puget Sound, and who did they meet?", "Why did Vancouver and Quadra part friends without agreeing on anything?", "What does Vancouver miss or misjudge, and why?"],
    gradeLevel: "7-9", explorer: "Captain George Vancouver", waterway: "Puget Sound",
  },
  {
    title: "John Jewitt's Narrative of his Captivity at Nootka, 1815", documentType: "journal", author: "John Rodgers Jewitt", originalDate: "1803-1805, published 1807 and 1815", originalYear: 1815,
    whatItIs: "Jewitt was the armourer of the Boston when Maquinna's people seized the ship in March 1803 and killed the rest of the crew. He lived as Maquinna's captive and blacksmith at Yuquot for two years, kept a diary on scraps of paper, and after his rescue published first the bare Journal (1807) and then the full Narrative (1815), written with Richard Alsop. The Narrative is the most detailed inside account of Nuu-chah-nulth daily life, seasons, ceremonies and politics from the period, told by a young man who understood he owed his life to the chief who owned him.",
    whereToReadIt: [
      `A Narrative of the Adventures and Sufferings of John R. Jewitt (Middletown, 1815) — ${IA("narrativeofadven00jewi")}`,
      `Another copy, 1816 edition — ${IA("cihm_29581")}`,
      "The original Journal Kept at Nootka Sound (Boston, 1807) is rare; a facsimile was published in 1976 and is borrowable at the Internet Archive.",
    ],
    vocabulary: [{ word: "armourer", definition: "The ship's metalworker, who repaired muskets and made tools" }, { word: "captive", definition: "A person held against their will; Jewitt was also a slave in Mowachaht terms" }, { word: "Boston", definition: "The American trading ship seized at Nootka in 1803" }],
    discussionQuestions: ["Why did Maquinna keep Jewitt alive?", "What does Jewitt describe about the year's cycle of fishing, whaling and ceremony?", "How might the seizure of the Boston look from the Mowachaht side, after twenty-five years of traders?"],
    gradeLevel: "7-9", waterway: "Nootka Sound", location: "Friendly Cove Landing (Cook's Landing)",
  },
  {
    title: "The Journals of the Lewis and Clark Expedition, 1804-1806", documentType: "journal", author: "Meriwether Lewis, William Clark and members of the Corps of Discovery", originalDate: "1804-1806", originalYear: 1805,
    whatItIs: "The daily journals kept by the two captains and several of their men on the journey from St. Louis up the Missouri, over the Rockies, and down the Clearwater, Snake and Columbia to the Pacific, and back. For the Pacific Northwest they record the Nez Perce who fed the starving party, the portages at Celilo Falls and The Dalles, the Chinook and Clatsop villages at the river's mouth, the wet winter at Fort Clatsop, and Clark's maps of the rivers. They are the first American description of the country Thompson and the fur companies were entering from the north.",
    whereToReadIt: [
      `The complete journals, searchable, from the Moulton edition: Journals of the Lewis and Clark Expedition Online, University of Nebraska — ${"https://lewisandclarkjournals.unl.edu/"}`,
      "Printed edition: Gary E. Moulton, ed., The Journals of the Lewis and Clark Expedition, 13 vols. (University of Nebraska Press, 1983-2001).",
      "Manuscript journals: American Philosophical Society, Philadelphia; Missouri Historical Society, St. Louis.",
    ],
    vocabulary: [{ word: "Corps of Discovery", definition: "The name of the Lewis and Clark expedition's company" }, { word: "Celilo Falls", definition: "The great falls of the Columbia, the trading centre of the Plateau nations" }, { word: "Fort Clatsop", definition: "The expedition's winter quarters of 1805-06 near the Columbia's mouth" }],
    discussionQuestions: ["How did the expedition get food, canoes and directions on the Columbia, and from whom?", "What did Clark record about the villages at Celilo Falls?", "Why did the journals matter to the United States' claim to the Columbia forty years later?"],
    gradeLevel: "7-9", explorer: "Meriwether Lewis", waterway: "Columbia River", location: "Fort Clatsop",
  },
  {
    title: "Franchère's Narrative of a Voyage to the Northwest Coast, 1811-1814", documentType: "journal", author: "Gabriel Franchère", originalDate: "1811-1814, published 1820", originalYear: 1820,
    whatItIs: "The first published account of Astor's Pacific Fur Company, by a Montreal clerk who sailed on the Tonquin round Cape Horn, helped build Fort Astoria, watched the Northwesters take it over in 1813, and went home overland in 1814 by the Columbia, Athabasca Pass and the Saskatchewan. Franchère describes the Chinook and their chief Comcomly, the loss of the Tonquin as the Astorians heard of it, the sale of the post, and the first crossing of Athabasca Pass by a man who wrote it down for publication. The French original of 1820 was translated in 1854.",
    whereToReadIt: [
      `English translation by J. V. Huntington (New York, 1854) — ${IA("narrativeofvoyag00fra")}`,
      `Reprint in Thwaites, Early Western Travels, vol. 6 (1904) — ${IA("franchresnarra00franrich")}`,
      "French original: Relation d'un voyage à la côte du Nord-Ouest de l'Amérique septentrionale (Montreal, 1820), rare; a modern edition appeared in 1969.",
    ],
    vocabulary: [{ word: "clerk", definition: "A junior salaried employee of a fur company who kept accounts and traded" }, { word: "Tonquin", definition: "Astor's ship, destroyed at Clayoquot Sound in June 1811" }, { word: "Athabasca Pass", definition: "The high pass over the Rockies between the Columbia and the Athabasca, used by the brigades after 1811" }],
    discussionQuestions: ["How does Franchère describe Comcomly and the Chinook?", "What did the Astorians know about the loss of the Tonquin, and how?", "What was it like to cross Athabasca Pass in 1814?"],
    gradeLevel: "7-9", explorer: "Gabriel Franchère", waterway: "Columbia River", location: "Fort Astoria / Fort George",
  },
  {
    title: "Alexander Ross's Adventures of the First Settlers on the Oregon or Columbia River, 1849", documentType: "journal", author: "Alexander Ross", originalDate: "1810-1813, published 1849", originalYear: 1849,
    whatItIs: "Ross's account of the Astoria venture from the Tonquin's departure in 1810 to the sale of 1813, written at Red River forty years later from his journals. It is the fullest record of the founding of Fort Okanogan in 1811, of his winter alone there trading with the Syilx, of David Stuart's journey up the Okanagan valley to Kamloops, and of the posts and peoples of the interior Columbia. His second book, The Fur Hunters of the Far West (1855), continues the story through the North West Company years and his own Snake Country brigade of 1824.",
    whereToReadIt: [
      `Adventures of the First Settlers (London, 1849), in Thwaites's Early Western Travels reprint, vol. 7 — ${IA("rosssadventureso07ross")}`,
      `The Fur Hunters of the Far West (London, 1855) — ${IA("furhuntersfarwe00rossgoog")}`,
      "Ross's papers are at the Archives of Manitoba, Winnipeg.",
    ],
    vocabulary: [{ word: "Okanogan", definition: "The American spelling of the river and the post at its mouth; Okanagan in Canada" }, { word: "Syilx", definition: "The Okanagan people, with whom Ross traded alone in the winter of 1811-12" }, { word: "brigade", definition: "A fur company's annual party of men, horses or canoes moving furs and goods" }],
    discussionQuestions: ["How did Ross survive his first winter at Fort Okanogan, and who helped him?", "What does he say about the route Stuart took to Kamloops?", "How reliable is a memoir written forty years after the events?"],
    gradeLevel: "7-9", explorer: "Alexander Ross", waterway: "Okanagan Lake", location: "Fort Okanogan",
  },
  {
    title: "Ross Cox's Adventures on the Columbia River, 1831", documentType: "journal", author: "Ross Cox", originalDate: "1812-1817, published 1831", originalYear: 1831,
    whatItIs: "Cox came to Astoria on the Beaver in 1812 as a Pacific Fur Company clerk, stayed on under the North West Company at Spokane House and Fort George, and went home overland in 1817. His book is the most readable of the Astorian memoirs: the Chinook and Comcomly at the river's mouth, the interior posts, the Columbia brigades, and a famous fortnight lost alone in the Spokane country. It also records, from the company's side, the violence of the trade with the Plateau nations.",
    whereToReadIt: [
      `Adventures on the Columbia River (London, 1831), vol. 1 — ${IA("adventuresoncol01coxgoog")}`,
      `New York edition, 1832 — ${IA("adventuresoncolu00coxr_0")}`,
    ],
    vocabulary: [{ word: "Fort George", definition: "The North West Company's name for Astoria after 1813" }, { word: "Spokane House", definition: "The North West Company post near the present city of Spokane, built in 1810" }, { word: "express", definition: "The fast canoe that carried letters across the continent each spring and autumn" }],
    discussionQuestions: ["How does Cox describe the Chinook trade at the Columbia's mouth?", "What does his story of being lost tell about the country and its people?", "Where does Cox's account agree with Franchère and Ross, and where not?"],
    gradeLevel: "7-9", waterway: "Columbia River", location: "Fort Astoria / Fort George",
  },
  {
    title: "David Thompson's Narrative of his Explorations in Western America, 1784-1812", documentType: "journal", author: "David Thompson", originalDate: "written 1845-1850, published 1916", originalYear: 1916,
    whatItIs: "The book Thompson wrote in old age from his field journals, covering his years with both companies from Hudson Bay to the Pacific: the Piikani and Saukamappee, the crossing of Howse Pass in 1807, Kootenay House, the Kootenay and Flathead country, the closing of the pass, the winter crossing of Athabasca Pass in 1811, and the descent of the Columbia to the sea. Unpublished in his lifetime, it was edited by J. B. Tyrrell for the Champlain Society in 1916. His original journals, the raw material, are in Toronto.",
    whereToReadIt: [
      `J. B. Tyrrell, ed., David Thompson's Narrative of his Explorations in Western America, 1784-1812 (Champlain Society, 1916) — ${IA("davidthompsonsna12thom")}`,
      "Modern edition: William E. Moreau, ed., The Writings of David Thompson, 2 vols. (Champlain Society / McGill-Queen's, 2009-2015).",
      "Thompson's field journals and his great map of 1814: Archives of Ontario, Toronto.",
    ],
    vocabulary: [{ word: "Howse Pass", definition: "The pass from the North Saskatchewan to the Columbia's source that Thompson crossed in 1807" }, { word: "Kootenay House", definition: "Thompson's first post west of the Rockies, built in 1807 near Lake Windermere" }, { word: "Piikani", definition: "The Peigan, who closed Howse Pass to the traders in 1810" }],
    discussionQuestions: ["Why did the Piikani close Howse Pass, and what did Thompson do?", "How does Thompson describe the Ktunaxa and the Flathead?", "How does a narrative written forty years later differ from the journals it was based on?"],
    gradeLevel: "10-12", explorer: "David Thompson", waterway: "Kootenay River", location: "Howse Pass",
  },
  {
    title: "Harmon's Journal of Voyages and Travels in the Interior of North America, 1820", documentType: "journal", author: "Daniel Williams Harmon", originalDate: "1800-1819, published 1820", originalYear: 1820,
    whatItIs: "The journal of a Vermont-born North West Company clerk and partner who served nineteen years in the trade, the last nine of them in New Caledonia at Fort St. James and Stuart Lake. It is the fullest record of the first years of the posts west of the Rockies: the Dakelh (Carrier) people and their chiefs, the salmon economy, winter travel, and the arrival of John Stuart's brigades. Harmon's account of his marriage to Lisette Duval and his decision to keep his family is one of the most honest statements of a fur trader's life.",
    whereToReadIt: [
      `A Journal of Voyages and Travels in the Interior of North America (Andover, 1820) — ${IA("journalofvoyages00harm")}`,
      "Modern edition: W. Kaye Lamb, ed., Sixteen Years in the Indian Country: The Journal of Daniel Williams Harmon (Macmillan, 1957).",
    ],
    vocabulary: [{ word: "New Caledonia", definition: "The North West Company's name for the central interior of British Columbia" }, { word: "Dakelh", definition: "The Carrier people of the Stuart Lake and Fraser Lake country" }, { word: "country marriage", definition: "A marriage between a trader and an Indigenous or Métis woman by the custom of the fur country" }],
    discussionQuestions: ["What does Harmon record about Dakelh life at Stuart Lake?", "How did the New Caledonia posts feed themselves?", "What did Harmon decide about his family when he left the country, and why does it matter?"],
    gradeLevel: "7-9", explorer: "Daniel Williams Harmon", waterway: "Fraser River", location: "Fort St. James",
  },
  {
    title: "Lisiansky's Voyage Round the World and the Battle of Sitka, 1804", documentType: "journal", author: "Yuri Lisiansky (Urey Lisiansky)", originalDate: "1803-1806, published 1814", originalYear: 1814,
    whatItIs: "Lisiansky commanded the Neva on Russia's first voyage round the world and brought her to Sitka in September 1804, where her guns decided the siege of the Kiks.ádi Tlingit fort. His narrative, published in English in 1814, is the eyewitness account from the Russian side: the bombardment, the Tlingit withdrawal by night, the founding of New Archangel, Baranov and the Aleut hunters, and a long description of the Tlingit and of Kodiak. The Tlingit account survives in the Kiks.ádi oral tradition, recorded in the twentieth century.",
    whereToReadIt: [
      `A Voyage Round the World in the Years 1803, 4, 5 and 6, performed in the ship Neva (London, 1814) — ${IA("india.history.resource.18198")}`,
      "The Tlingit side: Nora Marks Dauenhauer, Richard Dauenhauer and Lydia T. Black, eds., Anóoshi Lingít Aaní Ká: Russians in Tlingit America, the Battles of Sitka 1802 and 1804 (University of Washington Press, 2008).",
    ],
    vocabulary: [{ word: "Neva", definition: "The Russian naval ship whose cannon decided the Battle of Sitka" }, { word: "Kiks.ádi", definition: "The Tlingit clan whose fort Shís'gi Noow stood where Sitka is now" }, { word: "baidarka", definition: "The Aleut skin kayak in which the Russians' hunters travelled and fought" }],
    discussionQuestions: ["How does Lisiansky describe the fort and the fighting?", "What does he admit about the Russians' dependence on Aleut hunters?", "How does the Kiks.ádi account change the story?"],
    gradeLevel: "10-12", waterway: "Sitka Sound", location: "Novo-Arkhangelsk (Sitka)",
  },
  {
    title: "Steller's Journal of Bering's Voyage, 1741", documentType: "journal", author: "Georg Wilhelm Steller", originalDate: "1741-1742", originalYear: 1741,
    whatItIs: "The journal of the German naturalist on Bering's St. Peter: the sighting of Mount St. Elias, the ten hours he was allowed ashore at Kayak Island on 20 July 1741, where he found a Chugach camp with its fire still warm and collected the first plants and birds from Alaska, the meeting with Aleuts in the Shumagin Islands, the wreck on Bering Island, Bering's death and the winter that followed. Steller's is the only full account of the first Russian voyage to America by someone who went ashore.",
    whereToReadIt: [
      "English translation: O. W. Frost, ed., and Margritt A. Engel, trans., Journal of a Voyage with Bering, 1741-1742 (Stanford University Press, 1988).",
      "Earlier translation in F. A. Golder, Bering's Voyages, vol. 2 (American Geographical Society, 1925), in university libraries.",
      "Manuscript copies: Russian State Archive of Ancient Acts, Moscow, and the Russian Academy of Sciences, St. Petersburg.",
    ],
    vocabulary: [{ word: "Kayak Island", definition: "The island east of Prince William Sound where Steller landed on 20 July 1741" }, { word: "Chugach", definition: "The Sugpiaq (Alutiiq) people of Prince William Sound" }, { word: "Bering Island", definition: "The uninhabited island where the St. Peter was wrecked and Bering died in December 1741" }],
    discussionQuestions: ["What did Steller find at the Chugach camp, and what did he leave there?", "Why was he given only ten hours ashore?", "How did the sea-otter pelts from this voyage change the history of Alaska?"],
    gradeLevel: "10-12", explorer: "Vitus Bering", waterway: "Prince William Sound",
  },
  {
    title: "George Simpson's Journal of his Journey to the Columbia, 1824-1825", documentType: "journal", author: "George Simpson", originalDate: "1824-1825", originalYear: 1824,
    whatItIs: "The governor's own journal of his first crossing of the continent, from York Factory over Athabasca Pass to the Columbia and back, with his 'Remarks' on every post, officer and tribe he met. It records the choice of the site of Fort Vancouver, his orders to John McLoughlin, his plan to trap the Snake Country bare, and his blunt judgements of the men of the Columbia Department. It was first published by Frederick Merk in 1931 under the title Fur Trade and Empire.",
    whereToReadIt: [
      `Frederick Merk, ed., Fur Trade and Empire: George Simpson's Journal, revised edition (Harvard University Press, 1968), borrowable at the Internet Archive — ${IA("furtradeempirege00simp")}`,
      "Original: Hudson's Bay Company Archives, Archives of Manitoba, Winnipeg.",
    ],
    vocabulary: [{ word: "Columbia Department", definition: "The Hudson's Bay Company's district west of the Rockies after 1821" }, { word: "chief factor", definition: "The senior rank of officer in the Hudson's Bay Company after the merger" }, { word: "fur desert", definition: "Simpson's policy of trapping the Snake Country bare to keep American trappers east of the mountains" }],
    discussionQuestions: ["Why did Simpson move the department's headquarters from Fort George to Fort Vancouver?", "What was the point of trapping the Snake Country bare?", "What do Simpson's judgements of his officers tell us about him?"],
    gradeLevel: "10-12", explorer: "George Simpson", waterway: "Columbia River", location: "Fort Vancouver (HBC)",
  },
  {
    title: "Peter Skene Ogden's Snake Country Journals, 1824-1830", documentType: "journal", author: "Peter Skene Ogden", originalDate: "1824-1830", originalYear: 1826,
    whatItIs: "The daily journals Ogden kept on the Hudson's Bay Company's Snake Country expeditions: the routes across the Blue Mountains and the Snake plain to the Great Salt Lake and the Humboldt River, the beaver taken, the meetings with American trappers who lured his freemen away in 1825, the Shoshone and Bannock, and the hunger and horse thefts of six winters. They were published by the Hudson's Bay Record Society in three volumes between 1950 and 1971.",
    whereToReadIt: [
      `Peter Skene Ogden's Snake Country Journals, 1827-28 and 1828-29 (Hudson's Bay Record Society, vol. 28, 1971), borrowable at the Internet Archive — ${IA("ogdensnake")}`,
      "The 1824-26 journals: Hudson's Bay Record Society, vol. 13 (1950); the 1826-27 journal: vol. 23 (1961), in university libraries.",
      "Originals: Hudson's Bay Company Archives, Archives of Manitoba, Winnipeg.",
    ],
    vocabulary: [{ word: "freemen", definition: "Trappers who worked for themselves and sold to the company, not under contract" }, { word: "Snake Country", definition: "The fur traders' name for the Snake River basin and the Great Basin beyond" }, { word: "Humboldt River", definition: "The Nevada river Ogden found in 1828, named by Frémont later" }],
    discussionQuestions: ["What happened when Ogden's brigade met the Americans in 1825?", "How did the brigade live through a winter on the Snake plain?", "Did the fur desert policy work, judging from the journals?"],
    gradeLevel: "10-12", explorer: "Peter Skene Ogden", waterway: "Snake River",
  },
  {
    title: "The Letters of John McLoughlin from Fort Vancouver, 1825-1846", documentType: "letter", author: "John McLoughlin", originalDate: "1825-1846", originalYear: 1830,
    whatItIs: "The official letters of the chief factor of the Columbia Department to the Hudson's Bay Company's governor and committee in London: the trade of every post from Fort Simpson to the Snake, the farms, the salmon and timber business, the Russian lease, the arrival of American missionaries and settlers in the Willamette, and McLoughlin's growing quarrel with Simpson. They are the company's own record of its Pacific empire at its height.",
    whereToReadIt: [
      `E. E. Rich, ed., The Letters of John McLoughlin from Fort Vancouver to the Governor and Committee, 3 vols. (Hudson's Bay Record Society, 1941-1944), borrowable at the Internet Archive — ${IA("31221012781873")}`,
      `Burt Brown Barker, ed., Letters of Dr. John McLoughlin, Written at Fort Vancouver 1829-1832 (1948) — ${IA("lettersofdrjohnm0000mclo")}`,
      "Originals: Hudson's Bay Company Archives, Archives of Manitoba, Winnipeg.",
    ],
    vocabulary: [{ word: "governor and committee", definition: "The Hudson's Bay Company's board in London, to whom every post reported" }, { word: "Willamette", definition: "The Oregon valley where American settlers arrived in the 1830s and 1840s" }, { word: "Puget's Sound Agricultural Company", definition: "The HBC's farming subsidiary at Nisqually and Cowlitz" }],
    discussionQuestions: ["What did McLoughlin report about the first American settlers, and how did he treat them?", "How did the company make money on the Columbia besides furs?", "Why did McLoughlin and Simpson fall out?"],
    gradeLevel: "10-12", explorer: "John McLoughlin", waterway: "Columbia River", location: "Fort Vancouver (HBC)",
  },
  {
    title: "Frances Barkley's Reminiscences of the Imperial Eagle, 1786-1789", documentType: "journal", author: "Frances Hornby Barkley", originalDate: "written 1836 from a diary of 1786-1789", originalYear: 1787,
    whatItIs: "Frances Barkley sailed with her husband Charles on the Imperial Eagle at seventeen and was the first European woman to see the Northwest Coast, in June 1787. Her husband's journals were lost; her diary and the reminiscences she wrote from it in old age are the main surviving record of the voyage, including the trade at Nootka, Clayoquot and Barkley Sound and the rediscovery of the Strait of Juan de Fuca. They are also the only woman's account of the maritime fur trade's first years.",
    whereToReadIt: [
      "Manuscript reminiscences: BC Archives, Royal BC Museum, Victoria. The original diary was lost in the twentieth century; extracts survive in copies made from it.",
      "Published with commentary: Beth Hill, The Remarkable World of Frances Barkley, 1769-1845 (Gray's Publishing, 1978; reissued 2003).",
    ],
    vocabulary: [{ word: "Imperial Eagle", definition: "Barkley's ship, sailed under Austrian colours to avoid the East India Company's monopoly" }, { word: "Barkley Sound", definition: "The sound on the west coast of Vancouver Island that Barkley named for himself" }, { word: "reminiscence", definition: "A memoir written from memory, long after the events" }],
    discussionQuestions: ["What did Frances Barkley notice that the ships' officers did not write down?", "Why has a woman's account of this voyage survived when the captain's has not?", "What was it like to be seventeen on the Northwest Coast in 1787?"],
    gradeLevel: "7-9", explorer: "Charles William Barkley", waterway: "Juan de Fuca Strait",
  },
  {
    title: "Juan Pérez's Diary of the Santiago, 1774", documentType: "journal", author: "Juan Pérez and Fray Juan Crespí", originalDate: "June-August 1774", originalYear: 1774,
    whatItIs: "The diaries of the commander and of the Franciscan chaplain on the first Spanish voyage to the Northwest Coast. They describe the Haida canoes that came out to the ship off the north end of Haida Gwaii on 19-21 July 1774, the trading of blankets and iron, the Haida's songs and hats, the sighting of Mount Olympus, and the anchorage off Nootka Sound on 8 August, where Mowachaht canoes traded with the ship but no Spaniard went ashore. They are the earliest written record of the peoples of British Columbia's coast.",
    whereToReadIt: [
      "English translation with commentary: Herbert K. Beals, ed., Juan Pérez on the Northwest Coast: Six Documents of his Expedition in 1774 (Oregon Historical Society Press, 1989).",
      "Crespí's diary is also in Herbert E. Bolton, Fray Juan Crespí, Missionary Explorer on the Pacific Coast, 1769-1774 (1927).",
      "Spanish originals: Archivo General de Indias, Seville, and Archivo General de la Nación, Mexico City.",
    ],
    vocabulary: [{ word: "Santiago", definition: "The frigate Pérez commanded north from San Blas in 1774" }, { word: "Haida Gwaii", definition: "The islands Pérez reached in July 1774, called the Queen Charlotte Islands until 2010" }, { word: "San Blas", definition: "The Spanish naval base on the west coast of Mexico from which the northern voyages sailed" }],
    discussionQuestions: ["How did the Haida approach the ship, and what did the two sides trade?", "Why did Pérez not land, and what did that cost Spain's claim later?", "What does the chaplain notice that the commander does not?"],
    gradeLevel: "10-12", explorer: "Juan Pérez", waterway: "Dixon Entrance",
  },
  {
    title: "Washington Irving's Astoria, 1836", documentType: "report", author: "Washington Irving", originalDate: "1836", originalYear: 1836,
    whatItIs: "The history of the Pacific Fur Company that John Jacob Astor commissioned from America's most famous writer and opened his papers for. Irving used the company's letters and the journals of the partners, including Wilson Price Hunt's overland journey of 1811-12 and Robert Stuart's return east through South Pass, to tell the story from Astor's point of view. It is a secondary work built directly on primary papers, some of which no longer survive, and it fixed the Astoria story in American memory.",
    whereToReadIt: [
      `First edition, Philadelphia, 1836 — ${IA("cihm_36048")}`,
      `Author's revised edition, 1850 — ${IA("cihm_38157")}`,
    ],
    vocabulary: [{ word: "Pacific Fur Company", definition: "Astor's company, founded in 1810 to plant a post at the mouth of the Columbia" }, { word: "South Pass", definition: "The pass over the Rockies in Wyoming that Robert Stuart's Astorians crossed in 1812, later the Oregon Trail's route" }, { word: "commissioned", definition: "Ordered and paid for" }],
    discussionQuestions: ["Whose side of the Astoria story does Irving tell, and how can you tell?", "Why would Astor want a famous writer to tell it?", "Where does Irving agree with Franchère and Ross, and where does he differ?"],
    gradeLevel: "7-9", waterway: "Columbia River", location: "Fort Astoria / Fort George",
  },
  {
    title: "The Oregon Treaty, 15 June 1846", documentType: "treaty", author: "Great Britain and the United States of America", originalDate: "15 June 1846", originalYear: 1846,
    whatItIs: "The Treaty of Washington that ended the joint occupation of the Oregon Country by extending the boundary along the 49th parallel from the Rockies to the middle of the Strait of Georgia and then south and west down the Strait of Juan de Fuca to the Pacific, leaving all of Vancouver Island British. It guaranteed the Hudson's Bay Company's navigation of the Columbia and its property south of the line, which the United States later bought out. Five articles long, it drew the border that runs through the Salish Sea today.",
    whereToReadIt: [
      `Full text, Avalon Project, Yale Law School — ${"https://avalon.law.yale.edu/19th_century/br-1846.asp"}`,
      "Original: The National Archives, Kew, and the U.S. National Archives, Washington.",
    ],
    vocabulary: [{ word: "joint occupation", definition: "The 1818 agreement by which Britain and the United States shared the Oregon Country without a border" }, { word: "49th parallel", definition: "The line of latitude that forms most of the Canada-United States border west of Lake of the Woods" }, { word: "54°40'", definition: "The latitude of the Russian boundary, which American expansionists demanded as the border" }],
    discussionQuestions: ["Why does the line bend south around Vancouver Island?", "What did the treaty promise the Hudson's Bay Company, and did it get it?", "Who was not asked about this treaty, and what did it mean for them?"],
    gradeLevel: "7-9", waterway: "Juan de Fuca Strait",
  },
  {
    title: "The Treaty Ceding Alaska to the United States, 30 March 1867", documentType: "treaty", author: "Russia and the United States of America", originalDate: "30 March 1867", originalYear: 1867,
    whatItIs: "The treaty by which the Emperor of Russia sold Russian America to the United States for 7,200,000 dollars. It defines the boundary with British territory along the line of the 1825 Anglo-Russian convention, transfers the Russian-American Company's public property, lets Russian subjects return home or stay as citizens, and says of the Indigenous peoples of Alaska only that they will be subject to such laws as the United States may adopt. The flags were exchanged at Sitka on 18 October 1867.",
    whereToReadIt: [
      `Full text, Avalon Project, Yale Law School — ${"https://avalon.law.yale.edu/19th_century/treatywi.asp"}`,
      "Original: U.S. National Archives, Washington; Russian copy in the Archive of Foreign Policy of the Russian Empire, Moscow.",
    ],
    vocabulary: [{ word: "cession", definition: "The formal giving up of territory by one state to another" }, { word: "Russian-American Company", definition: "The chartered company that governed Russian America from 1799 to 1867" }, { word: "Seward's Folly", definition: "The nickname critics gave the purchase, after Secretary of State William Seward" }],
    discussionQuestions: ["What does the treaty say about the Tlingit, Aleut and other peoples of Alaska?", "Why did Russia sell, and why did the United States buy?", "How did the 1825 boundary in the treaty create the Alaska panhandle dispute with Canada?"],
    gradeLevel: "7-9", waterway: "Sitka Sound", location: "Novo-Arkhangelsk (Sitka)",
  },
];

async function checkUrl(url: string, problems: string[]) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { method: "HEAD", redirect: "follow", headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (content check)" } });
      if (res.ok) return;
      if (res.status === 429) { await new Promise((r) => setTimeout(r, 15_000 * (attempt + 1))); continue; }
      if (res.status === 405 || res.status === 403) { const g = await fetch(url, { headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (content check)" } }); if (g.ok) return; problems.push(`${g.status} ${url}`); return; }
      problems.push(`${res.status} ${url}`); return;
    } catch (e) { problems.push(`${String(e).slice(0, 60)} ${url}`); return; }
  }
  problems.push(`rate-limited ${url}`);
}

async function main() {
  const [explorers, waterways, locations, existing] = await Promise.all([
    db.explorer.findMany({ select: { id: true, name: true } }),
    db.waterway.findMany({ select: { id: true, name: true } }),
    db.location.findMany({ select: { id: true, name: true } }),
    db.primarySourceDocument.findMany({ select: { title: true } }),
  ]);
  const ex = new Map(explorers.map((e) => [e.name, e.id])); const ww = new Map(waterways.map((w) => [w.name, w.id])); const loc = new Map(locations.map((l) => [l.name, l.id]));
  const need = (m: Map<string, string>, k: string, what: string) => { const v = m.get(k); if (!v) throw new Error(`${what} not found: ${k}`); return v; };
  const problems: string[] = [];
  const urls = new Set<string>();
  for (const d of DOCS) for (const w of d.whereToReadIt) { const m = w.match(/https?:\/\/\S+/); if (m) urls.add(m[0]); }
  for (const u of urls) await checkUrl(u, problems);

  const rows = DOCS.filter((d) => !existing.some((e) => e.title === d.title)).map((d, i) => ({
    id: `psd_pac_${String(i + 1).padStart(2, "0")}`, title: d.title, documentType: d.documentType, author: d.author, originalDate: d.originalDate, originalYear: d.originalYear,
    originalText: null, transcription: null, imageUrl: null,
    historicalContext: `${d.whatItIs}\n\nWhere to read it:\n${d.whereToReadIt.map((w) => `• ${w}`).join("\n")}`,
    annotations: null, vocabulary: JSON.stringify(d.vocabulary), discussionQuestions: JSON.stringify(d.discussionQuestions),
    explorerId: d.explorer ? need(ex, d.explorer, "explorer") : null, waterwayId: d.waterway ? need(ww, d.waterway, "waterway") : null, locationId: d.location ? need(loc, d.location, "location") : null,
    gradeLevel: d.gradeLevel, isPublished: true,
  }));

  const backupFile = writeBackup("2026-10-17-primary-sources-pacific-plan", { rows });
  report("primary sources: The Pacific and the Russians", { toInsert: rows.map((r) => `${r.gradeLevel} | ${r.documentType} | ${r.title}`), skippedExisting: DOCS.length - rows.length, urlsChecked: urls.size, problems, backupFile });
  if (problems.length) throw new Error("Fix the URLs above before applying.");
  if (!APPLY) return;
  await db.$transaction(async (tx) => { for (const r of rows) await tx.primarySourceDocument.create({ data: r }); });
  report("verify", { documents: await db.primarySourceDocument.count(), byGrade: await db.primarySourceDocument.groupBy({ by: ["gradeLevel"], _count: true }), withExplorer: await db.primarySourceDocument.count({ where: { explorerId: { not: null } } }), withWaterway: await db.primarySourceDocument.count({ where: { waterwayId: { not: null } } }), withLocation: await db.primarySourceDocument.count({ where: { locationId: { not: null } } }) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
