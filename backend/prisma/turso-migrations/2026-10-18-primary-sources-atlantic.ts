// Primary-source pointers for The Atlantic (2026-10-18).
//   bun run prisma/turso-migrations/2026-10-18-primary-sources-atlantic.ts [--apply]
//
// Same rules as the earlier sets. Run after the atlantic pack, which creates several of
// the names used here. Idempotent by title.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const IA = (id: string) => `https://archive.org/details/${id}`;
const JR = (vol: number) => `https://moses.creighton.edu/kripke/jesuitrelations/relations_${String(vol).padStart(2, "0")}.html`;

interface Doc {
  title: string; documentType: "journal" | "report" | "letter" | "map" | "treaty";
  author: string; originalDate: string; originalYear: number;
  whatItIs: string; whereToReadIt: string[];
  vocabulary: { word: string; definition: string }[]; discussionQuestions: string[];
  gradeLevel: "4-6" | "7-9" | "10-12"; explorer?: string; waterway?: string; location?: string;
}

const DOCS: Doc[] = [
  {
    title: "The Cabot and Corte-Real Documents, 1497-1502", documentType: "letter", author: "John Day, Raimondo de Soncino, Pietro Pasqualigo and others", originalDate: "1497-1502, collected 1911", originalYear: 1497,
    whatItIs: "Almost everything known about John Cabot's voyages and Gaspar Corte-Real's comes from a handful of letters written by diplomats and merchants in London and Lisbon: the Bristol merchant John Day's letter to the 'Grand Admiral' (probably Columbus) describing the 1497 landfall, the Milanese envoy Soncino's report of the cod so thick they could be taken in baskets, and the Venetian Pasqualigo's letter of October 1501 describing the fifty-seven captives Corte-Real's ships brought to Lisbon. H. P. Biggar collected and translated them in 1911.",
    whereToReadIt: [
      `H. P. Biggar, The Precursors of Jacques Cartier, 1497-1534: A Collection of Documents (Ottawa, 1911) — ${IA("precursorsofjacq00bigguoft")}`,
      "The John Day letter is in the Archivo General de Simancas, Spain; it was found in 1955 and is not in Biggar. It is printed in J. A. Williamson, The Cabot Voyages and Bristol Discovery under Henry VII (Hakluyt Society, 1962).",
      "David B. Quinn, 'Cabot, John', Dictionary of Canadian Biography, vol. 1 — https://www.biographi.ca/en/bio/cabot_john_1E.html",
    ],
    vocabulary: [{ word: "landfall", definition: "The first sight of land after a sea voyage" }, { word: "letters patent", definition: "A royal licence, open for all to read, giving a person rights such as to discover and hold new lands" }, { word: "caravel", definition: "A small, fast Portuguese sailing ship of the age of discovery" }],
    discussionQuestions: ["Why do we know Cabot's voyage only from other people's letters?", "What did the writers of these letters care about most, and what did they leave out?", "What happened to the fifty-seven people Corte-Real's ships carried to Lisbon, and why does the record say so little about them?"],
    gradeLevel: "10-12", explorer: "John Cabot (Giovanni Caboto)", waterway: "Cabot Strait",
  },
  {
    title: "Hayes's Report of Gilbert's Voyage, 1583", documentType: "report", author: "Edward Hayes", originalDate: "1583, printed 1589", originalYear: 1583,
    whatItIs: "The narrative of Sir Humphrey Gilbert's voyage of 1583 by the captain of the Golden Hind, the only one of the five ships to come home: the fishing fleet of many nations in St. John's harbour, the reading of the patent and the taking of possession on 5 August, the wreck of the Delight on Sable Island, and Gilbert's last hours in the Squirrel, sitting abaft with a book, calling across the water that they were as near to heaven by sea as by land. Hakluyt printed it in his Principal Navigations.",
    whereToReadIt: [
      `Richard Hakluyt, The Principal Navigations, Voyages, Traffiques and Discoveries of the English Nation (Glasgow, 1903-05), vol. 8 — ${IA("in.ernet.dli.2015.106884")}`,
      "David B. Quinn, ed., The Voyages and Colonising Enterprises of Sir Humphrey Gilbert (Hakluyt Society, 1940), the full documentary record.",
      "David B. Quinn, 'Hayes, Edward', Dictionary of Canadian Biography, vol. 1 — https://www.biographi.ca/en/bio/hayes_edward_1E.html",
    ],
    vocabulary: [{ word: "possession", definition: "The ceremony of claiming land for a monarch, here by reading the patent and cutting a turf" }, { word: "frigate", definition: "In Gilbert's day a small, light vessel; the Squirrel was ten tons" }, { word: "bark", definition: "A small sailing ship; Hayes's Golden Hind was a bark of forty tons" }],
    discussionQuestions: ["What did Gilbert actually do at St. John's, and what did it mean to the fishermen already there?", "Hayes wrote as a promoter of colonies: how does that show in his account?", "Why has the story of Gilbert's death been retold so often?"],
    gradeLevel: "10-12", explorer: "Sir Humphrey Gilbert", waterway: "Conception Bay",
  },
  {
    title: "John Guy's Letters and Journal from Cupers Cove, 1610-1612", documentType: "journal", author: "John Guy", originalDate: "1610-1612, printed 1625", originalYear: 1612,
    whatItIs: "Guy's letters to the London and Bristol Company on the founding of the colony at Cuper's Cove and the first winters, and his journal of the voyage into Trinity Bay in October and November 1612 in which his party met the Beothuk at Bull Arm, exchanged gifts and shared a meal, the fullest account of a friendly meeting between the English and the island's people. Samuel Purchas printed parts in 1625.",
    whereToReadIt: [
      "Samuel Purchas, Hakluytus Posthumus, or Purchas his Pilgrimes (1625; Glasgow reprint 1905-07), vol. 19, for the Newfoundland letters.",
      "Gillian T. Cell, ed., Newfoundland Discovered: English Attempts at Colonisation, 1610-1630 (Hakluyt Society, 1982), the standard edition of Guy's letters and journal.",
      "Gillian T. Cell, 'Guy, John', Dictionary of Canadian Biography, vol. 1 — https://www.biographi.ca/en/bio/guy_john_1E.html",
    ],
    vocabulary: [{ word: "plantation", definition: "A colony planted by a company; Cuper's Cove was the London and Bristol Company's plantation" }, { word: "Cuper's Cove", definition: "Guy's name for the site, now Cupids" }, { word: "truck", definition: "Barter; the trade in goods that Guy began with the Beothuk" }],
    discussionQuestions: ["What did the Beothuk and the English each bring to the meeting at Bull Arm, and what did each want?", "Why did the colony's first winters go badly, by Guy's account?", "Why was Bull Arm never repeated?"],
    gradeLevel: "7-9", explorer: "John Guy", waterway: "Trinity Bay", location: "Cupids (Cuper's Cove)",
  },
  {
    title: "Mason's Briefe Discourse of the New-found-land, 1620", documentType: "report", author: "John Mason", originalDate: "1620", originalYear: 1620,
    whatItIs: "The first English book about Newfoundland, a short tract by the second governor of the Cupids colony describing the island's coasts, climate, fish, timber and prospects for settlers, written to recruit planters for the London and Bristol Company. His map, the first English map of the island from survey, was not printed until 1625.",
    whereToReadIt: [
      `A Briefe Discourse of the New-found-land (Edinburgh, 1620) — ${IA("abriefediscours00masogoog")}`,
      "Gillian T. Cell, 'Mason, John', Dictionary of Canadian Biography, vol. 1 — https://www.biographi.ca/en/bio/mason_john_1E.html",
    ],
    vocabulary: [{ word: "discourse", definition: "In the seventeenth century, a written account or treatise" }, { word: "planter", definition: "A settler in a plantation or colony" }, { word: "fishing admiral", definition: "The master of the first fishing ship to reach a harbour each season, who governed it for the summer" }],
    discussionQuestions: ["What did Mason think would make people move to Newfoundland?", "How does a recruiting tract differ from a report?", "Why did the settlers' interests clash with the fishing ships'?"],
    gradeLevel: "10-12", explorer: "John Mason", waterway: "Conception Bay",
  },
  {
    title: "Whitbourne's Discourse and Discovery of New-found-land, 1620-1622", documentType: "report", author: "Sir Richard Whitbourne", originalDate: "1620, enlarged 1622", originalYear: 1620,
    whatItIs: "The old fishing captain's argument for settling Newfoundland, drawn from thirty years in the trade: the fishery and its abuses, the pirates Easton and Mainwaring, his vice-admiralty court at Trinity in 1615, the land and its creatures, and a strange creature he saw in St. John's harbour. The Privy Council had it distributed to the parishes of England.",
    whereToReadIt: [
      `A Discourse and Discovery of New-found-land (London, 1622) — ${IA("discoursediscoue00whit_0")}`,
      "Gillian T. Cell, ed., Newfoundland Discovered (Hakluyt Society, 1982), with the 1620 text.",
      "Gillian T. Cell, 'Whitbourne, Sir Richard', Dictionary of Canadian Biography, vol. 1 — https://www.biographi.ca/en/bio/whitbourne_richard_1E.html",
    ],
    vocabulary: [{ word: "vice-admiralty court", definition: "A court with the Admiralty's authority over seamen and shipping, which Whitbourne held at Trinity in 1615" }, { word: "stage", definition: "The wharf and shed where cod were split and salted" }, { word: "pirate", definition: "Easton and Mainwaring, who took men, ships and supplies from the fishing fleet" }],
    discussionQuestions: ["What were the 'abuses' Whitbourne's court was meant to curb?", "Why did he think settlement would help the fishery when the merchants thought it would hurt?", "What does the 'strange creature' tell us about how people read the new world?"],
    gradeLevel: "10-12", explorer: "Sir Richard Whitbourne", waterway: "Trinity Bay", location: "Trinity",
  },
  {
    title: "Champlain's Voyages: Acadia, 1604-1607", documentType: "journal", author: "Samuel de Champlain", originalDate: "1604-1607, published 1613", originalYear: 1604,
    whatItIs: "Champlain's own account of the first French colony in Acadia: the voyage of 1604 with de Monts, the naming of the Saint John on the saint's day, the terrible winter at Île Sainte-Croix where scurvy killed almost half the men, the move to Port-Royal in 1605, the explorations of the coast to Cape Cod, the Order of Good Cheer in the winter of 1606-07 and the plan of the Habitation that allowed its rebuilding in 1939-41.",
    whereToReadIt: [
      `Voyages of Samuel de Champlain, vol. 2, 1604-1610, trans. C. P. Otis (Prince Society, Boston, 1878) — ${IA("champlain-voyage-1604-1608")}`,
      "The Works of Samuel de Champlain, ed. H. P. Biggar (Champlain Society, 1922-36), vol. 1, the standard edition with the French text.",
      "Marcel Trudel, 'Champlain, Samuel de', Dictionary of Canadian Biography, vol. 1 — https://www.biographi.ca/en/bio/champlain_samuel_de_1E.html",
    ],
    vocabulary: [{ word: "Habitation", definition: "The name Champlain gave the group of buildings around a courtyard at Port-Royal" }, { word: "scurvy", definition: "The disease of want of fresh food that killed the men at Sainte-Croix; Champlain called it mal de la terre" }, { word: "Ordre de Bon Temps", definition: "The Order of Good Cheer, Champlain's rota of stewards who provided the table through the winter of 1606-07" }],
    discussionQuestions: ["Why did the second winter at Port-Royal go so much better than the first at Sainte-Croix?", "What does Champlain say about the Mi'kmaq, and what does he not say?", "How did Champlain's drawing make it possible to rebuild the Habitation three centuries later?"],
    gradeLevel: "7-9", explorer: "Samuel de Champlain", waterway: "Annapolis Basin", location: "Port-Royal (Habitation)",
  },
  {
    title: "Lescarbot's History of New France, 1609", documentType: "journal", author: "Marc Lescarbot", originalDate: "1609, enlarged 1611 and 1617", originalYear: 1609,
    whatItIs: "The first history of French America, by the lawyer who spent the winter of 1606-07 at Port-Royal. Its later books are his own eyewitness account of Acadia: the voyage out, the Habitation, the Théâtre de Neptune he wrote and staged in November 1606, the Order of Good Cheer, Membertou and the Mi'kmaq, whose customs, language and war against the Armouchiquois he described at length and with sympathy. The Champlain Society's translation runs to three volumes.",
    whereToReadIt: [
      `The History of New France, trans. W. L. Grant, vol. 1 (Champlain Society, Toronto, 1907) — ${IA("historyofnewfran07lesc")}; the Acadian voyages are in volumes 2 (1911) and 3 (1914).`,
      "Les Muses de la Nouvelle-France (Paris, 1609), bound with the Histoire, contains the Théâtre de Neptune.",
      "René Baudry, 'Lescarbot, Marc', Dictionary of Canadian Biography, vol. 1 — https://www.biographi.ca/en/bio/lescarbot_marc_1E.html",
    ],
    vocabulary: [{ word: "Théâtre de Neptune", definition: "Lescarbot's masque performed on the water of the Annapolis Basin in November 1606, the first play in New France" }, { word: "sagamore", definition: "The French spelling of the Mi'kmaq word for chief, sakamow; Membertou was the grand sagamore" }, { word: "Souriquois", definition: "The French name for the Mi'kmaq in Lescarbot's day" }],
    discussionQuestions: ["Why did a lawyer go to Acadia, and what did he do there?", "How does Lescarbot describe Membertou, and how does that compare with the Jesuit Biard's description?", "What makes the Histoire a history rather than a travel journal?"],
    gradeLevel: "10-12", explorer: "Marc Lescarbot", waterway: "Annapolis Basin", location: "Port-Royal (Habitation)",
  },
  {
    title: "Biard's Relation of New France, 1616", documentType: "report", author: "Pierre Biard, S.J.", originalDate: "1616", originalYear: 1616,
    whatItIs: "The Jesuit Pierre Biard's account of Acadia and its people, written after Argall's raid of 1613 had ended the mission at Saint-Sauveur and carried Biard off to Virginia and England. It describes the Mi'kmaq, their seasons, food, government and beliefs, Membertou's baptism and death, the quarrel with Poutrincourt and his son at Port-Royal, and the attack of 1613 from the French side. It opens the series called the Jesuit Relations.",
    whereToReadIt: [
      `The Jesuit Relations and Allied Documents, ed. R. G. Thwaites, vols. 3-4 (Cleveland, 1896-1901), English and French — vol. 3: ${JR(3)}`,
      "Lucien Campeau, 'Biard, Pierre', Dictionary of Canadian Biography, vol. 1 — https://www.biographi.ca/en/bio/biard_pierre_1E.html",
    ],
    vocabulary: [{ word: "Relation", definition: "The annual report a Jesuit missionary sent to his superiors in France, printed for the public" }, { word: "Saint-Sauveur", definition: "The Jesuit settlement of 1613 on Mount Desert Island that Argall destroyed" }, { word: "sagamo", definition: "Biard's spelling of the Mi'kmaq word for chief" }],
    discussionQuestions: ["What did Biard admire in the Mi'kmaq and what did he want to change?", "How does his account of Port-Royal differ from Lescarbot's?", "Why did the French colonists and the Jesuits quarrel?"],
    gradeLevel: "10-12", waterway: "Bay of Fundy", location: "Port-Royal (Habitation)",
  },
  {
    title: "Denys's Description of the Coasts of North America, 1672", documentType: "report", author: "Nicolas Denys", originalDate: "1672", originalYear: 1672,
    whatItIs: "Two volumes by the old seigneur of the Gulf coast after forty years in Acadia: the first a description of the coasts from the Penobscot to the Gaspé, harbour by harbour, with his own posts at Saint-Pierre, Sainte-Anne and Nipisiguit and his quarrels with d'Aulnay and Le Borgne; the second a natural history of the fishery and of the Mi'kmaq, their hunting, customs and the changes trade had brought, the fullest account of Acadia in its century. W. F. Ganong's 1908 edition translates and annotates it.",
    whereToReadIt: [
      `The Description and Natural History of the Coasts of North America (Acadia), trans. W. F. Ganong (Champlain Society, Toronto, 1908) — ${IA("descriptionnatur00deny")}`,
      "George MacBeath, 'Denys, Nicolas', Dictionary of Canadian Biography, vol. 1 — https://www.biographi.ca/en/bio/denys_nicolas_1E.html",
    ],
    vocabulary: [{ word: "seigneur", definition: "The holder of a grant of land and rights from the Crown or company; Denys held the Gulf coast from Canso to the Gaspé" }, { word: "sedentary fishery", definition: "A cod fishery worked from a permanent shore station, as Denys practised, rather than from ships that went home each autumn" }, { word: "Nipisiguit", definition: "Denys's post of 1652 on Chaleur Bay, now Bathurst" }],
    discussionQuestions: ["What did Denys think the fur trade had done to the Mi'kmaq, and how did he know?", "Why did he keep losing his posts, and to whom?", "What would a historian of fishing learn from the second volume?"],
    gradeLevel: "10-12", explorer: "Nicolas Denys", waterway: "Bras d'Or Lake", location: "Saint-Pierre (St. Peter's)",
  },
  {
    title: "Fornel's Relation of the Voyage to the Baie des Esquimaux, 1743", documentType: "journal", author: "Louis Fornel", originalDate: "1743", originalYear: 1743,
    whatItIs: "The Quebec merchant's record of his voyage in the Expérience from Quebec on 16 May 1743 along the Labrador coast to the Baie des Esquimaux, which he entered in July, named Baie Saint-Louis and claimed for France: the coast and its harbours, the Inuit he met and his experiment to show they did not live on raw meat and salt water, and the men he left to winter at the site of North West River. The French text was printed in the Quebec archivist's report of 1920-21.",
    whereToReadIt: [
      "'Relation de la découverte qu'a faite le sieur Louis Fornel en 1743 de la baie des Eskimaux', Rapport de l'Archiviste de la Province de Québec, 1920-21.",
      `W. G. Gosling, Labrador: Its Discovery, Exploration and Development (London, 1910), for the context of the French sealing concessions — ${IA("labradoritsdisco00gosl")}`,
      "Dale Miquelon, 'Fornel, Louis', Dictionary of Canadian Biography, vol. 3 — https://www.biographi.ca/en/bio/fornel_louis_3E.html",
    ],
    vocabulary: [{ word: "concession", definition: "A grant from the Crown of the exclusive right to fish, seal or trade in a stretch of coast" }, { word: "Baie des Esquimaux", definition: "The French name for Hamilton Inlet; Fornel renamed it Baie Saint-Louis" }, { word: "sealing station", definition: "A post where seals were netted and their oil rendered, the business that drew Quebec merchants to Labrador" }],
    discussionQuestions: ["Why did Quebec merchants want Hamilton Inlet, and what did they expect to find there?", "What does Fornel's experiment tell us about European ideas of the Inuit?", "What became of his claim after his death?"],
    gradeLevel: "10-12", explorer: "Louis Fornel", waterway: "Hamilton Inlet", location: "North West River",
  },
  {
    title: "Cartwright's Journal of Sixteen Years on the Coast of Labrador, 1770-1786", documentType: "journal", author: "George Cartwright", originalDate: "1770-1786, published 1792", originalYear: 1792,
    whatItIs: "The daily journal of an English officer turned trader on the southern Labrador coast, in three large volumes: the salmon, cod and seal fisheries and the fur trade, the Inuit who traded and worked with him and the five he took to England in 1772, four of whom died of smallpox, the settlement at Sandwich Bay from 1775, the American privateer's raid of 1778, the weather, the birds and animals he shot, and the daily business of living on the coast. The most detailed record of eighteenth-century Labrador.",
    whereToReadIt: [
      `A Journal of Transactions and Events, during a Residence of nearly Sixteen Years on the Coast of Labrador, vol. 1 (Newark, 1792) — ${IA("journaloftransac01cart")}`,
      "Marianne P. Stopp, ed., The New Labrador Papers of Captain George Cartwright (McGill-Queen's, 2008), with his unpublished writings.",
      "G. M. Story, 'Cartwright, George', Dictionary of Canadian Biography, vol. 5 — https://www.biographi.ca/en/bio/cartwright_george_5E.html",
    ],
    vocabulary: [{ word: "sealing post", definition: "A station where nets were set across a tickle to take seals in autumn" }, { word: "tickle", definition: "A narrow salt-water channel, in Newfoundland and Labrador speech" }, { word: "Attuiock", definition: "The Inuk angakok who went with Cartwright to England in 1772 and died of smallpox on the way home" }],
    discussionQuestions: ["What did Cartwright want from Labrador, and why did his businesses fail?", "How did he describe the Inuit he knew, and what happened to those he took to England?", "What can a diary tell us that a history cannot?"],
    gradeLevel: "10-12", explorer: "George Cartwright", waterway: "Sandwich Bay", location: "Cartwright",
  },
  {
    title: "Cormack's Narrative of a Journey across Newfoundland, 1822", documentType: "journal", author: "William Eppes Cormack", originalDate: "1822, published 1824 and 1856", originalYear: 1822,
    whatItIs: "Cormack's account of the first crossing of the island by a European, from Trinity Bay on 30 August 1822 to St. George's Bay on 4 November with the Mi'kmaq hunter Joseph Sylvester as his only companion: the barrens and lakes of the interior, the plants and rocks he collected, the Mi'kmaq he met and the Beothuk he hoped to meet and did not. The 1856 edition adds his reports on the Beothuk Institution and on Shawnadithit.",
    whereToReadIt: [
      `Narrative of a Journey across the Island of Newfoundland in 1822 (St. John's, 1856) — ${IA("narrativeofjourn00corm")}`,
      "The 1824 text was printed in the Edinburgh Philosophical Journal, vol. 10.",
      "Leslie Harris, 'Cormack, William Eppes', Dictionary of Canadian Biography, vol. 9 — https://www.biographi.ca/en/bio/cormack_william_eppes_9E.html",
    ],
    vocabulary: [{ word: "barrens", definition: "The open, boggy, treeless uplands of the Newfoundland interior" }, { word: "Beothuk Institution", definition: "The society Cormack founded in 1827 to find and protect the surviving Beothuk" }, { word: "Joseph Sylvester", definition: "The young Mi'kmaq hunter from Bay d'Espoir who guided Cormack across the island" }],
    discussionQuestions: ["Why had no European crossed Newfoundland in three centuries of fishing its coasts?", "What part did Joseph Sylvester play, and how much credit does the Narrative give him?", "What did Cormack hope to find, and what did he find instead?"],
    gradeLevel: "10-12", explorer: "William Eppes Cormack", waterway: "Trinity Bay",
  },
  {
    title: "Shawnadithit's Drawings and the Beothuk Record, 1811-1829", documentType: "map", author: "Shawnadithit, with David Buchan, John Peyton Jr. and William Cormack", originalDate: "1811-1829, collected 1915", originalYear: 1829,
    whatItIs: "In 1828-29 Shawnadithit, the last known Beothuk, drew in pencil for William Cormack maps of Red Indian Lake and the Exploits showing Buchan's march of 1811 and the taking of her aunt Demasduit in 1819, with the camps, the dead and the routes marked, and sketches of Beothuk dwellings, canoes, tools, food stores and ceremonial objects, with Cormack's notes from her explanations. James Howley's book of 1915 reproduces the drawings with Buchan's official report of 1811, the accounts of Demasduit's capture and the vocabularies taken from Demasduit and Shawnadithit, and is still the gathering place of the written record of the Beothuk.",
    whereToReadIt: [
      `J. P. Howley, The Beothucks or Red Indians: The Aboriginal Inhabitants of Newfoundland (Cambridge, 1915) — ${IA("beothucksorredin00howl")}`,
      "The drawings are in The Rooms Provincial Archives, St. John's.",
      "Ingeborg Marshall, A History and Ethnography of the Beothuk (McGill-Queen's, 1996), the standard study.",
      "Ingeborg Marshall, 'Shawnadithit', Dictionary of Canadian Biography, vol. 6 — https://www.biographi.ca/en/bio/shawnadithit_6E.html",
    ],
    vocabulary: [{ word: "mamateek", definition: "The Beothuk word, recorded from Shawnadithit, for their conical dwelling" }, { word: "red ochre", definition: "The iron-oxide pigment the Beothuk mixed with grease and wore on skin, clothing and belongings, the reason the English called them Red Indians" }, { word: "vocabulary", definition: "The lists of Beothuk words taken down from Demasduit by John Leigh and from Shawnadithit by Cormack, almost all that survives of the language" }],
    discussionQuestions: ["What do Shawnadithit's maps show that Buchan's and Peyton's written accounts do not?", "Who annotated the drawings, and how does that affect what we can read from them?", "How should a record made by the last member of a people be read and used?"],
    gradeLevel: "7-9", explorer: "William Eppes Cormack", waterway: "Beothuk Lake",
  },
  {
    title: "Jukes's Excursions in and about Newfoundland, 1839-1840", documentType: "report", author: "Joseph Beete Jukes", originalDate: "1839-1840, published 1842", originalYear: 1842,
    whatItIs: "The young geologist's two volumes on his survey of Newfoundland for the colonial government: the rocks and minerals, the coasts by boat and the Exploits by canoe, the fishery and the sealing voyage he joined in the spring of 1840, the Mi'kmaq of the south coast, and the settlers' life, told with the eye of a naturalist and the good humour of a traveller. His formal Report on the Geology of Newfoundland (1839) is the first geological survey of the island.",
    whereToReadIt: [
      `Excursions in and about Newfoundland, during the Years 1839 and 1840, vol. 1 (London, 1842) — ${IA("excursionsinand01jukegoog")}`,
      "Report on the Geology of Newfoundland (St. John's, 1839).",
      "Frederic F. Thompson, 'Jukes, Joseph Beete', Dictionary of Canadian Biography, vol. 9 — https://www.biographi.ca/en/bio/jukes_joseph_beete_9E.html",
    ],
    vocabulary: [{ word: "geological survey", definition: "A systematic mapping of a country's rocks and minerals; Newfoundland's was among the first in British North America" }, { word: "sealing voyage", definition: "The spring hunt for harp seals on the ice off the northeast coast, which Jukes joined in 1840" }, { word: "Bell Island", definition: "The island in Conception Bay whose iron ore Jukes mapped as 'reddish stone'" }],
    discussionQuestions: ["What was Jukes sent to find, and what did he find instead?", "What does his sealing chapter tell us about the fishery of 1840?", "Why did he miss the iron of Bell Island, and what does that say about surveys?"],
    gradeLevel: "10-12", explorer: "Joseph Beete Jukes", waterway: "Exploits River",
  },
  {
    title: "Bayfield's Sailing Directions for the Gulf and River of St. Lawrence, 1837", documentType: "report", author: "Henry Wolsey Bayfield", originalDate: "1837, revised to 1860", originalYear: 1837,
    whatItIs: "The pilot book that accompanied Bayfield's charts: harbour by harbour, the coasts of the Gulf and the river from the Strait of Belle Isle and Cabot Strait to Quebec, with soundings, anchorages, tides, currents, ice, landmarks and dangers, written from the survey Bayfield had led since 1827. Ships' masters carried it for a century, and its later editions became the St. Lawrence Pilot.",
    whereToReadIt: [
      `Sailing Directions for the Gulf and River of St. Lawrence (London, 1837) — ${IA("sailingdirectio00bayfgoog")}`,
      "Ruth McKenzie, ed., The St. Lawrence Survey Journals of Captain Henry Wolsey Bayfield, 1829-1853 (Champlain Society, 1984-86).",
      "Ruth McKenzie, 'Bayfield, Henry Wolsey', Dictionary of Canadian Biography, vol. 11 — https://www.biographi.ca/en/bio/bayfield_henry_wolsey_11E.html",
    ],
    vocabulary: [{ word: "sailing directions", definition: "A written guide for navigators describing coasts, harbours and hazards, used with the charts" }, { word: "sounding", definition: "A measurement of water depth, taken with a weighted line" }, { word: "hydrographic survey", definition: "The measuring and charting of seas, coasts and rivers for navigation" }],
    discussionQuestions: ["Why did the Admiralty need a new survey of the Gulf in 1827, two generations after Cook and DesBarres?", "What kinds of knowledge are in a pilot book that are not on a chart?", "How did Bayfield's work change the risk of the voyage to Quebec?"],
    gradeLevel: "10-12", explorer: "Henry Wolsey Bayfield", waterway: "Gulf of St. Lawrence",
  },
  {
    title: "Mina Hubbard's A Woman's Way through Unknown Labrador, 1908", documentType: "journal", author: "Mina Benson Hubbard", originalDate: "1905, published 1908", originalYear: 1908,
    whatItIs: "Mina Hubbard's account of her expedition of 1905 from North West River up the Naskaupi to Lake Michikamau and down the George to Ungava Bay, with George Elson, Joseph Iserhoff, Job Chapies and Gilbert Blake: the rivers and portages, the caribou crossing, the Innu and Naskapi camps she met and photographed, and her race against Dillon Wallace's party. It includes her maps, the first accurate ones of the two rivers, and is written against the account that had blamed her husband for his death in 1903.",
    whereToReadIt: [
      `A Woman's Way through Unknown Labrador (London and New York, 1908) — ${IA("womanswaythrough00hubbuoft")}`,
      `Dillon Wallace, The Lure of the Labrador Wild (1905), the account of the 1903 expedition she set out to answer — ${IA("lurelabradorwil00hubbgoog")}`,
      "Roberta Buchanan, Anne Hart and Bryan Greene, The Woman Who Mapped Labrador (McGill-Queen's, 2005), with her diary.",
    ],
    vocabulary: [{ word: "portage", definition: "Carrying canoes and loads overland between waters" }, { word: "height of land", definition: "The watershed between rivers flowing to Lake Melville and those flowing north to Ungava Bay" }, { word: "Michikamau", definition: "The great lake of the Labrador plateau, since drowned in the Smallwood Reservoir" }],
    discussionQuestions: ["Why did Mina Hubbard go to Labrador, and what did she set out to prove?", "What part did George Elson and the other guides play, and how does the book present them?", "How do her photographs and maps differ from the written account as evidence?"],
    gradeLevel: "7-9", explorer: "Mina Benson Hubbard", waterway: "Naskaupi River", location: "North West River",
  },
];

async function checkUrl(url: string, problems: string[]) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (url.startsWith("https://www.biographi.ca/")) {
        const html = await (await fetch(url, { headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (content pack check)" } })).text();
        if (/<title>Biography not found/.test(html)) problems.push(`DCB biography not found ${url}`);
        return;
      }
      const res = await fetch(url, { method: "HEAD", redirect: "follow", headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (content pack check)" } });
      if (res.status === 429) { await new Promise((r) => setTimeout(r, 3000 * (attempt + 1))); continue; }
      if (res.status >= 400) problems.push(`${res.status} ${url}`);
      return;
    } catch (e) { if (attempt === 2) problems.push(`unreachable ${url}: ${e}`); }
  }
}

async function main() {
  const [explorers, waterways, locations, existing] = await Promise.all([
    db.explorer.findMany({ select: { id: true, name: true } }), db.waterway.findMany({ select: { id: true, name: true } }), db.location.findMany({ select: { id: true, name: true } }), db.primarySourceDocument.findMany({ select: { title: true } }),
  ]);
  const ex = new Map(explorers.map((e) => [e.name, e.id])); const ww = new Map(waterways.map((w) => [w.name, w.id])); const loc = new Map(locations.map((l) => [l.name, l.id]));
  const need = (m: Map<string, string>, k: string, what: string) => { const v = m.get(k); if (!v) throw new Error(`${what} not found: ${k}`); return v; };
  const problems: string[] = []; const urls = new Set<string>();
  for (const d of DOCS) for (const w of d.whereToReadIt) { const m = w.match(/https?:\/\/\S+/); if (m) urls.add(m[0].replace(/[;,.]$/, "")); }
  for (const u of urls) await checkUrl(u, problems);
  const rows = DOCS.filter((d) => !existing.some((e) => e.title === d.title)).map((d, i) => ({
    id: `psd_atl_${String(i + 1).padStart(2, "0")}`, title: d.title, documentType: d.documentType, author: d.author, originalDate: d.originalDate, originalYear: d.originalYear,
    originalText: null, transcription: null, imageUrl: null,
    historicalContext: `${d.whatItIs}\n\nWhere to read it:\n${d.whereToReadIt.map((w) => `• ${w}`).join("\n")}`,
    annotations: null, vocabulary: JSON.stringify(d.vocabulary), discussionQuestions: JSON.stringify(d.discussionQuestions),
    explorerId: d.explorer ? need(ex, d.explorer, "explorer") : null, waterwayId: d.waterway ? need(ww, d.waterway, "waterway") : null, locationId: d.location ? need(loc, d.location, "location") : null,
    gradeLevel: d.gradeLevel, isPublished: true,
  }));
  const backupFile = writeBackup("2026-10-18-primary-sources-atlantic-plan", { rows });
  report("primary sources: The Atlantic", { toInsert: rows.map((r) => `${r.gradeLevel} | ${r.documentType} | ${r.title}`), skippedExisting: DOCS.length - rows.length, urlsChecked: urls.size, problems, backupFile });
  if (problems.length) throw new Error("Fix the URLs above before applying.");
  if (!APPLY) return;
  await db.$transaction(async (tx) => { for (const r of rows) await tx.primarySourceDocument.create({ data: r }); });
  report("verify", { documents: await db.primarySourceDocument.count(), byGrade: await db.primarySourceDocument.groupBy({ by: ["gradeLevel"], _count: true }) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
