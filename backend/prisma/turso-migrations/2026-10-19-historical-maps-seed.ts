// Cartography gallery seed (2026-10-19, roadmap item 15): sixteen maps that made the country.
//   bun run prisma/turso-migrations/2026-10-19-historical-maps-seed.ts [--apply]
//
// Every image was found on Wikimedia Commons on 2026-10-19 (search manifest in the scratchpad), its
// licence and author taken from the file record, and the 1600-pixel rendering of each was examined
// before its description was written: `whatItShows` and `whatItGotWrong` name only features read on
// the sheet itself or stated in the Dictionary of Canadian Biography article cited. Where the
// Commons file is a later facsimile (Champlain's 1632 map in the 1850 Albany lithograph, Pond's 1785
// map in Kohl's nineteenth-century copy, Bressani's 1657 map in a halftone reproduction) the record
// says so. Overlay bounds are given only for the two maps with a printed graticule that can be read
// against Greenwich (Franklin 1823) or converted from the Paris meridian (Bellin 1744), and are
// marked approximate. Idempotent by title; inserts only.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const commons = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1280`;
const commonsPage = (file: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, "_"))}`;
const DCB = (slug: string, title: string) => `${title}, Dictionary of Canadian Biography (biographi.ca/en/bio/${slug}.html)`;

type M = {
  title: string; mapmaker: string; mapmakerNation?: string; cartographer?: string; year: number; yearLabel?: string;
  description: string; whatItShows: string; whatItGotWrong?: string; region: string;
  file: string; imageCredit: string; imageLicense: string; sourceNote: string;
  bounds?: { sw: [number, number]; ne: [number, number] };
  waterways: string[]; explorers: string[]; citations: Array<{ kind: string; author?: string; title: string; container?: string; url?: string; year?: string }>;
};

const MAPS: M[] = [
  {
    title: "The Harleian mappemonde", mapmaker: "Dieppe school, unknown hand", mapmakerNation: "French (Dieppe)", year: 1544, yearLabel: "c. 1544",
    description: "A manuscript world map of the Dieppe school, painted on vellum a decade after Cartier's voyages, with 'Canada' written across the land north of the St. Lawrence and the river opening into the continent from the Gulf. The copy shown is the National Library of Australia's reproduction of the British Library original (Add. MS 5413).",
    whatItShows: "Across the top left, the coast of 'Canada' with the great river running inland; Newfoundland and the Gulf; the whole known world around it, with Europe, Africa, 'Asie la Grande' and 'La Terre du Brésil', compass roses and rhumb lines in the portolan manner, and figures and animals painted on the land.",
    whatItGotWrong: "Below the East Indies the map paints 'Jave la Grande', a vast southern continent that does not exist, and the interior of North America is filled with invented scenery; the St. Lawrence is drawn from Cartier's reports but nothing beyond Hochelaga was known.",
    region: "World; St. Lawrence and Gulf",
    file: "Harleian.jpg", imageCredit: "Wikimedia Commons / Kattigara, photograph of the National Library of Australia copy of British Library Add. MS 5413", imageLicense: "CC BY-SA 3.0",
    sourceNote: "The original is in the British Library (Add. MS 5413); this image is a photograph of the copy held by the National Library of Australia, uploaded to Wikimedia Commons under CC BY-SA 3.0.",
    waterways: ["St. Lawrence River", "Gulf of St. Lawrence"], explorers: ["Jacques Cartier"],
    citations: [{ kind: "archive", author: "British Library", title: "The Harleian Mappemonde, Add. MS 5413" }, { kind: "dcb", title: DCB("cartier_jacques_1491_1557_1E", "Marcel Trudel, 'Cartier, Jacques'"), url: "https://www.biographi.ca/en/bio/cartier_jacques_1491_1557_1E.html" }],
  },
  {
    title: "Carte de la Nouvelle France (1632)", mapmaker: "Samuel de Champlain", mapmakerNation: "French", cartographer: "Samuel de Champlain", year: 1632, yearLabel: "1632 (1850 facsimile)",
    description: "Champlain's last and largest map, published with his Voyages of 1632, summing up thirty years of French knowledge of the St. Lawrence, the Great Lakes and the lands to the north. The copy shown is the reduced lithograph made at Albany in 1850 for the Documentary History of New York from the original in the New York State Library.",
    whatItShows: "'Nouvelle France' spread across the continent from 'Mer du Nort glacialle' to 'Virginia'; the 'Mer douce' (Lake Huron) with the 'Grand lac' beyond it, 'Lac St. Louis' (Lake Ontario), the St. Lawrence with Quebec, Trois-Rivières and the Saguenay, 'Le Golphe St. Laurens', Newfoundland and 'Terres de la Brador', the nations named along the rivers, and the cartouche 'Faicte l'an 1632 par le sieur de Champlain'.",
    whatItGotWrong: "The Great Lakes are compressed: Lake Superior is only a 'Grand lac' at the western edge, Lake Michigan is barely suggested, and the bay to the north is drawn from report; none of it had been surveyed.",
    region: "Eastern North America",
    file: "Champlain's map of New France 1632 (NYPL b20643233-5476419).jpg", imageCredit: "Wikimedia Commons / New York Public Library; original by Samuel de Champlain, 1632; lithograph by R. H. Pease, Albany, 1850", imageLicense: "Public domain",
    sourceNote: "New York Public Library, Map Division (b20643233). The sheet is an 1850 reduction 'from the original in the State Library', not the 1632 engraving itself.",
    waterways: ["St. Lawrence River", "Lake Huron", "Lake Ontario", "Ottawa River", "Gulf of St. Lawrence", "Saguenay River", "Lake Champlain"], explorers: ["Samuel de Champlain"],
    citations: [{ kind: "dcb", title: DCB("champlain_samuel_de_1E", "'Champlain, Samuel de'"), url: "https://www.biographi.ca/en/bio/champlain_samuel_de_1E.html" }, { kind: "archive", author: "New York Public Library", title: "Champlain's map of New France 1632 (Map Division, b20643233)" }],
  },
  {
    title: "Le Canada, ou Nouvelle France (1656)", mapmaker: "Nicolas Sanson d'Abbeville", mapmakerNation: "French", year: 1656,
    description: "The first printed map to show all five Great Lakes, by the king's geographer Nicolas Sanson, drawn as its cartouche says from the English, Danish and Dutch accounts for the north and from the French relations for the St. Lawrence. Printed in Paris by Pierre Mariette.",
    whatItShows: "'Mer Christiane' and 'Golfe de Hudson ou Hudson Bay' with 'New South Walles' and 'Buttons Bay'; 'Estotilande ou Terre de Laborador ou Nouvelle Bretagne'; the St. Lawrence from 'Golfe de Canada' past Tadoussac and Quebec to 'Ontario ou Lac de St. Louys', 'Lac Erié ou du Chat', 'Lac des Hurons', 'Lac de Puans' and 'Lac Superieur'; Acadia, New England, New Netherland and Virginia; and Florida in the south-west corner.",
    whatItGotWrong: "Lake Superior and 'Lac de Puans' (Michigan) are left open at their western ends, their far shores unknown; Hudson Bay is pieced together from the English voyages and the coast between it and the St. Lawrence is a blank.",
    region: "Eastern North America",
    file: "Le Canada ou Nouvelle France & c. - par N. Sanson d'Abbeville ; I. Somer sculpsit - btv1b8595870r.jpg", imageCredit: "Wikimedia Commons / Bibliothèque nationale de France, Gallica (btv1b8595870r); Nicolas Sanson, engraved by J. Somer, 1656", imageLicense: "Public domain",
    sourceNote: "Bibliothèque nationale de France, département Cartes et plans, via Gallica (btv1b8595870r).",
    waterways: ["Hudson Bay", "St. Lawrence River", "Saguenay River", "Lake Ontario", "Lake Erie", "Lake Huron", "Lake Michigan", "Lake Superior", "Gulf of St. Lawrence"], explorers: [],
    citations: [{ kind: "archive", author: "Bibliothèque nationale de France", title: "Le Canada ou Nouvelle France, par N. Sanson d'Abbeville, 1656 (Gallica btv1b8595870r)", url: "https://gallica.bnf.fr/ark:/12148/btv1b8595870r" }],
  },
  {
    title: "Novae Franciae accurata delineatio (1657)", mapmaker: "François-Joseph Bressani", mapmakerNation: "Italian Jesuit", year: 1657, yearLabel: "1657 (reproduction)",
    description: "The Jesuit map of New France, drawn by the missionary Bressani after his years in the Huron country and printed in 1657, with an inset 'Huronum explicata tabula' of the Wendat villages and scenes of the missions, including the deaths of Brébeuf and Lalemant. The image is a halftone reproduction of the engraving.",
    whatItShows: "The St. Lawrence ('Fluvius S. Laurentii') from the Gulf and 'Insula Terrae Novae' past Acadia and 'Nova Picardia' to 'Ontario Lacus seu Sancti Ludovici'; 'Mare Dulce' (Lake Huron) with 'Lacus Superior' at the edge; the Ottawa route of the 'Algonquini'; the inset of the Huron country with Tionontate; Indigenous figures, canoes and a palisaded village in the margins.",
    whatItGotWrong: "Lake Erie is missing and Lake Ontario is a long oval; the country west of Huronia is filled with figures rather than geography.",
    region: "St. Lawrence and Huron country",
    file: "Jesuit map NF.jpg", imageCredit: "Wikimedia Commons; François-Joseph Bressani, 1657, reproduced from a printed facsimile", imageLicense: "Public domain",
    sourceNote: "A halftone reproduction of the 1657 engraving uploaded to Wikimedia Commons; the Dictionary of Canadian Biography article on Bressani reproduces the same map.",
    waterways: ["St. Lawrence River", "Lake Ontario", "Lake Huron", "Georgian Bay", "Ottawa River", "Gulf of St. Lawrence"], explorers: [],
    citations: [{ kind: "dcb", title: DCB("bressani_francois_joseph_1E", "'Bressani, François-Joseph'"), url: "https://www.biographi.ca/en/bio/bressani_francois_joseph_1E.html" }],
  },
  {
    title: "Partie de la Nouvelle France (1685)", mapmaker: "Hubert Jaillot", mapmakerNation: "French", year: 1685,
    description: "Jaillot's map of the north of New France at the moment of the struggle for Hudson Bay, dedicated to the minister Seignelay, showing the French posts planted to stop the northern nations from carrying their furs to the English on the bay.",
    whatItShows: "'Baye de Hudson' with Port Nelson and the 'Poste François découvert et occupé par la Compagnie qui s'est formée en Canada pour la Baye de Hudson'; 'Poste du Sr Duluth pour empêcher les Assinipoels et autres Sauvages de descendre à la Baye de Hudson' north of Lake Superior; the Ottawa, Timiskaming, Abitibi and Saguenay routes with the post 'pour couper les Sauvages par le haut de la traite de Tadoussac'; the Gulf, Anticosti, Newfoundland and Acadia.",
    whatItGotWrong: "West of the posts the lakes are guesses ('Lac des Poux', 'Lac Piscoutagamy' drawn as shapes), and Hudson Bay's west shore runs almost straight south from the Arctic.",
    region: "Hudson Bay and the north of New France",
    file: "Partie de la Nouvelle France (Hubert Jaillot 1685).jpg", imageCredit: "Wikimedia Commons / Manitoba Historical Maps (Flickr), photograph of Jaillot's 1685 engraving", imageLicense: "CC BY 2.0",
    sourceNote: "Photograph of the 1685 engraving shared by Manitoba Historical Maps on Flickr under CC BY 2.0.",
    waterways: ["Hudson Bay", "Lake Superior", "Ottawa River", "Saguenay River", "St. Lawrence River", "Gulf of St. Lawrence", "Lake Timiskaming", "Lake Abitibi", "Nelson River"], explorers: ["Daniel Greysolon Dulhut"],
    citations: [{ kind: "web", author: "Manitoba Historical Maps", title: "Partie de la Nouvelle France (Hubert Jaillot 1685)", url: commonsPage("Partie de la Nouvelle France (Hubert Jaillot 1685).jpg") }],
  },
  {
    title: "Partie occidentale du Canada ou de la Nouvelle France (1688)", mapmaker: "Vincenzo Coronelli", mapmakerNation: "Venetian", year: 1688,
    description: "The Venetian cosmographer's map of the western half of New France, 'où sont les Nations des Ilinois, de Tracy, les Iroquois et plusieurs autres peuples, avec la Louisiane nouvellement découverte', printed in Paris by Nolin in 1688 from the reports of the Jesuits, Jolliet, La Salle and Dulhut.",
    whatItShows: "'Lac de Tracy ou Superieur', 'Lac des Ilinois ou Michigami ou Lac Dauphin', 'Lac des Hurons', 'Lac Erié ou de Conty', 'Lac Frontenac ou Ontario'; the Mississippi running south off the sheet with notes on Marquette and Jolliet's entry of 17 June 1673 and La Salle's descent of 1682; 'Fort de Crèvecoeur basti par Monsieur de la Salle 1679'; 'Lac Buade' discovered by Dulhut in 1680; the 'Baye de Hudson' at the top; and the Nadouessioux and other nations named across the plains.",
    whatItGotWrong: "The Mississippi's course south of the Ohio is drawn from report and the rivers of the west end in blank mountains; the shape of Lake Superior is stretched to the north-west.",
    region: "Great Lakes and the Mississippi",
    file: "Partie occidentale du Canada ou de la Nouvelle France ou sont les Nations des Ilinois, Coronelli, 1688.jpg", imageCredit: "Wikimedia Commons / John Carter Brown Library; Vincenzo Coronelli, published by J. B. Nolin, Paris, 1688", imageLicense: "Public domain",
    sourceNote: "Original in the John Carter Brown Library at Brown University.",
    waterways: ["Lake Superior", "Lake Michigan", "Lake Huron", "Lake Erie", "Lake Ontario", "Mississippi River", "Illinois River", "Hudson Bay"], explorers: ["Jacques Marquette", "Louis Jolliet", "Rene-Robert Cavelier, Sieur de La Salle", "Daniel Greysolon Dulhut", "Louis Hennepin"],
    citations: [{ kind: "dcb", title: DCB("jolliet_louis_1E", "'Jolliet, Louis'"), url: "https://www.biographi.ca/en/bio/jolliet_louis_1E.html" }],
  },
  {
    title: "La Louisiana, parte settentrionale (1696)", mapmaker: "Vincenzo Coronelli", mapmakerNation: "Venetian", year: 1696, yearLabel: "1696 (dated 1695 on some copies)",
    description: "Coronelli's Italian map of the upper Louisiana and the Great Lakes, 'scoperta sotto la protettione di Luigi XIV', one of the most accurate renderings of the five lakes to appear in the seventeenth century, with the first entry of Europeans into the Mississippi recorded in its margin.",
    whatItShows: "'L. Tracy o Superiore', 'L. degli Ilinoi o Michigami', 'L. degli Huroni', 'Lago Erie', 'L. Frontenac' with the 'Sault de Niagara'; the Mississippi ('F. Colbert o Mechissipi') and the Wisconsin; the note that on 17 June 1673 Marquette and Jolliet were the first Europeans to enter the Mississippi by the Wisconsin, having left Mascoutens on 10 June with two Miami guides; Issati, Nadouessi and Kilistinons named in the north.",
    whatItGotWrong: "The lakes' proportions are still uneven (Michigan too long, Superior's north shore squared), and the country north of Superior toward Hudson Bay is a blank with 'Gens des Terres' written across it.",
    region: "Great Lakes and the Mississippi",
    file: "1696 Coronelli Map of the Great Lakes (Most Accurate Map of the Great Lakes in the 17th Century) - Geographicus - LaLouisiana-coronelli-1695.jpg", imageCredit: "Wikimedia Commons / Geographicus Rare Antique Maps; Vincenzo Coronelli, 1696", imageLicense: "Public domain",
    sourceNote: "From the Geographicus Rare Antique Maps collection released on Wikimedia Commons.",
    waterways: ["Lake Superior", "Lake Michigan", "Lake Huron", "Lake Erie", "Lake Ontario", "Mississippi River", "Wisconsin River", "Fox River (Wisconsin)", "Niagara River"], explorers: ["Jacques Marquette", "Louis Jolliet"],
    citations: [{ kind: "dcb", title: DCB("jolliet_louis_1E", "'Jolliet, Louis'"), url: "https://www.biographi.ca/en/bio/jolliet_louis_1E.html" }],
  },
  {
    title: "Carte de la Rivière Longue (1703)", mapmaker: "Louis-Armand de Lom d'Arce, baron de Lahontan", mapmakerNation: "French", year: 1703,
    description: "The map Lahontan published with his Nouveaux voyages in 1703 of the 'Rivière Longue' he claimed to have ascended westward from the Mississippi in 1688-89, with the second half of the sheet a map 'que les Gnacsitares ont dessiné sur des peaux de cerfs', drawn, he said, by the people he met. The river does not exist.",
    whatItShows: "Lake Superior, Michilimackinac, 'Lac des Ilinois', the 'Fleuve de Mississipi', Fort de Crèvecoeur and the Wisconsin; west of the Mississippi the 'Rivière Longue' or 'Rivière Morte' through the 'Pais des Eokoros', 'Essanapes' and 'Gnacsitares' to a range of mountains; beyond, the Gnacsitares' map of the 'Mozeemlek' country, their boats of two hundred rowers, their houses and a medal.",
    whatItGotWrong: "The whole Long River. Most historians have concluded that Lahontan's 4,000-mile winter journey is fiction, yet Delisle and other mapmakers carried the river on their maps for half a century.",
    region: "Upper Mississippi and the imagined West",
    file: "Carte de la riviere Longue - et de quelques autres, qui se dechargent dans le grand fleuve de Missisipi (sic) ... ; Carte que les Gnacsitares - ont dessine sur des paux de cerfs ... LOC 96687322.jpg", imageCredit: "Wikimedia Commons / Library of Congress, Geography and Map Division (96687322); Lahontan, 1703", imageLicense: "Public domain",
    sourceNote: "Library of Congress, Geography and Map Division, call number G4050 1703 .L3 Vault.",
    waterways: ["Mississippi River", "Lake Superior", "Lake Michigan", "Illinois River", "Wisconsin River"], explorers: [],
    citations: [{ kind: "dcb", title: DCB("lom_d_arce_de_lahontan_louis_armand_de_2E", "'Lom d'Arce de Lahontan, Louis-Armand de'"), url: "https://www.biographi.ca/en/bio/lom_d_arce_de_lahontan_louis_armand_de_2E.html" }, { kind: "archive", author: "Library of Congress", title: "Carte de la rivière Longue... (G4050 1703 .L3 Vault)", url: "https://www.loc.gov/item/96687322/" }],
  },
  {
    title: "Carte du Canada ou de la Nouvelle France (1703)", mapmaker: "Guillaume Delisle", mapmakerNation: "French", year: 1703,
    description: "The map of Canada by the first geographer of the king and member of the Académie royale des sciences, 'dressée sur plusieurs observations et sur un grand nombre de relations imprimées ou manuscrites', the most authoritative French map of the continent's north-east for a generation.",
    whatItShows: "'Baye de Baffin découverte par Guillaume Baffin anglois 1622 et 1624', 'Mer Christiane ainsi nommée par Jean Munck danois en 1619', 'Baye d'Hudson' with 'Nouveau Danemarc', the straits of Davis and Hudson, 'Terre de Labrador ou des Eskimaux', the Gulf and Newfoundland, the St. Lawrence, all five Great Lakes, the Mississippi and the Illinois country, Acadia, New England and New York, and Greenland 'nommée Secanunga par ceux du pays'.",
    whatItGotWrong: "West of the Mississippi it draws Lahontan's 'Rivière Longue ou Rivière Morte' and the 'Pays des Gnacsitares', with a note admitting that the baron 'est le seul qui a pénétré dans ces vastes contrées'; nothing of the Prairies or Lake Winnipeg is yet known.",
    region: "Eastern North America and the Arctic approaches",
    file: "Carte du Canada ou de la Nouvelle France et des Decouvertes qui y ont été faites... - Par Guillaume de l'Isle... à Paris, 1703 - btv1b84933987.jpg", imageCredit: "Wikimedia Commons / Bibliothèque nationale de France, Gallica (btv1b84933987); Guillaume Delisle, Paris, 1703", imageLicense: "Public domain",
    sourceNote: "Bibliothèque nationale de France, département Cartes et plans, via Gallica (btv1b84933987).",
    waterways: ["Hudson Bay", "Hudson Strait", "Baffin Bay", "Lake Superior", "Lake Michigan", "Lake Huron", "Lake Erie", "Lake Ontario", "Mississippi River", "St. Lawrence River", "Gulf of St. Lawrence"], explorers: ["Henry Hudson", "William Baffin", "Jens Munk"],
    citations: [{ kind: "archive", author: "Bibliothèque nationale de France", title: "Carte du Canada ou de la Nouvelle France, par Guillaume Delisle, 1703 (Gallica btv1b84933987)", url: "https://gallica.bnf.fr/ark:/12148/btv1b84933987" }],
  },
  {
    title: "Carte de la Baye de Hudson (1744)", mapmaker: "Jacques-Nicolas Bellin", mapmakerNation: "French", cartographer: "Jacques-Nicolas Bellin", year: 1744,
    description: "Bellin's chart of Hudson Bay for Charlevoix's Histoire de la Nouvelle France, drawn in 1744 by the engineer of the Marine from the English voyages, with the Company's posts named and the gaps in knowledge written on the sheet.",
    whatItShows: "'Baye de Buttons' and 'Cap Churchil autrefois Cap Brigges'; 'Port Nelson' with 'F. Bourbon aujourd'hui Fort d'York'; the rivers de Bourbon (Nelson) and Ste Thérèse (Hayes); 'Fort de Nieuvesavane' (Severn); 'Rivière Ste Anne aujourd'hui R. Albani' and 'Fort St Germain'; 'F. Rupert' and 'F. Monsipi' on James Bay; the 'Nouveau Détroit découvert en 1742 par Midleton' (Wager); 'Labrador appelée aujourd'hui par les Anglois Nouvelle Bretagne'; and longitude 'du Méridien de Paris'.",
    whatItGotWrong: "The whole east coast of the bay is marked 'cette partie n'est pas connue', and the interior rivers are sketched only a little way inland.",
    region: "Hudson Bay",
    file: "Carte de la baye de Hudson - par Nicolas Bellin... ; Desbruslins sculpsit. Lieues marines de France et d'Angleterre de 20 au degré 140 - btv1b8491548d.jpg", imageCredit: "Wikimedia Commons / Bibliothèque nationale de France, Gallica (btv1b8491548d); Jacques-Nicolas Bellin, engraved by Desbruslins, 1744", imageLicense: "Public domain",
    sourceNote: "Bibliothèque nationale de France, département Cartes et plans, via Gallica (btv1b8491548d). Overlay bounds are approximate, read from the printed graticule (latitude 51 to 65 N; longitude 55 to 96 west of Paris, converted to Greenwich).",
    bounds: { sw: [50.5, -99.0], ne: [65.4, -56.5] },
    waterways: ["Hudson Bay", "James Bay", "Hudson Strait", "Nelson River", "Hayes River", "Churchill River", "Albany River", "Rupert River", "Moose River", "Severn River", "Wager Bay"], explorers: ["Christopher Middleton", "Thomas Button"],
    citations: [{ kind: "archive", author: "Bibliothèque nationale de France", title: "Carte de la Baye de Hudson, par N. Bellin, 1744 (Gallica btv1b8491548d)", url: "https://gallica.bnf.fr/ark:/12148/btv1b8491548d" }],
  },
  {
    title: "A Map of the British and French Dominions in North America (1755)", mapmaker: "John Mitchell", mapmakerNation: "British (Virginia-born)", year: 1755, yearLabel: "1755 (1757 state shown)",
    description: "The eight-sheet map made for the Board of Trade on the eve of the Seven Years' War, 'with the roads, distances, limits and extent of the settlements', the standard map of the continent's east for the rest of the century.",
    whatItShows: "The Great Lakes with 'Canada' and 'New France' across them; the St. Lawrence, Nova Scotia, the 'Island of New Found Land' and the 'Gulf of St. Laurence'; an inset 'A New Map of Hudson's Bay and Labrador'; the colonies from Massachusetts to Georgia, 'Louisiana' and the Mississippi, the Gulf of Mexico; the nations named across the interior, from the 'Sioux or Nadouessians' to the Cherokee.",
    whatItGotWrong: "West of the Mississippi the sheet is nearly empty, and the 'Country of the Padoucas' and 'Western Sioux' stand in for everything up to the unknown mountains.",
    region: "Eastern North America",
    file: "Mitchell Map-06full2.jpg", imageCredit: "Wikimedia Commons; John Mitchell, London, 1755 (1757 state)", imageLicense: "Public domain",
    sourceNote: "A full-sheet scan uploaded to Wikimedia Commons; the Bibliothèque nationale de France and the Library of Congress hold other states of the map.",
    waterways: ["Lake Superior", "Lake Huron", "Lake Michigan", "Lake Erie", "Lake Ontario", "St. Lawrence River", "Hudson Bay", "Mississippi River", "Gulf of St. Lawrence"], explorers: [],
    citations: [{ kind: "web", title: "Mitchell Map (Wikimedia Commons file record)", url: commonsPage("Mitchell Map-06full2.jpg") }],
  },
  {
    title: "Hudson's Bay's Country (1785)", mapmaker: "Peter Pond", mapmakerNation: "American, in the Montreal trade", year: 1785, yearLabel: "1785 (nineteenth-century copy)",
    description: "The map Pond drew in the winter of 1784-85 of the rivers and lakes from the Great Lakes and Hudson Bay west to the Rocky Mountains and north to the Arctic, the first map of the Athabasca country by anyone who had been there. The copy shown is J. G. Kohl's nineteenth-century tracing in the Library of Congress of the manuscript in the Hudson's Bay Company Archives.",
    whatItShows: "'Arabosca L.' (Lake Athabasca) with 'Fort Pond 1782, 1783' and 'Extraordinary Banks of Salt'; the 'Arabosca River' and Portage La Loche; 'Slave Lac' and a river running from it north-west to a 'Mer du Nord West' at the top of the sheet; 'English River', 'Cumberland House', 'Churchill Fort' and 'Fort York'; the Winnipeg lakes, the 'Assabena River', Lac Superieur, Lac Huron and Lac Michigan; the Missouri, 'Sta Fé' and 'New Mexico' in the south; 'Stony Mountains' and the 'South Sea' in the west.",
    whatItGotWrong: "Pond believed the river out of Great Slave Lake ran to the Pacific. The Dictionary of Canadian Biography records that his 1785 map carried the river to 'Supposed, the Ice Sea' and that the 1787 version turned it westward toward Cook's River; on this sheet it ends in a 'Mer du Nord West'. He also put the mountains and the sea far too close to Athabasca, the miscalculation that sent Mackenzie north in 1789.",
    region: "Hudson Bay to the Rockies",
    file: "Hudson's Bay's country LOC 2002622133.jpg", imageCredit: "Wikimedia Commons / Library of Congress, Geography and Map Division (2002622133); copy by J. G. Kohl of Peter Pond's 1785 manuscript", imageLicense: "Public domain",
    sourceNote: "Library of Congress, Geography and Map Division: 'Copy of a manuscript map from the Archives of the Hudson's Bay Company', pen-and-ink and watercolour, by Johann Georg Kohl.",
    waterways: ["Lake Athabasca", "Athabasca River", "Great Slave Lake", "Churchill River", "Saskatchewan River", "Lake Winnipeg", "Lake Superior", "Hudson Bay", "Mississippi River"], explorers: ["Peter Pond", "Alexander Mackenzie"],
    citations: [{ kind: "dcb", title: DCB("pond_peter_5E", "Barry M. Gough, 'Pond, Peter'"), url: "https://www.biographi.ca/en/bio/pond_peter_5E.html" }, { kind: "archive", author: "Library of Congress", title: "Hudson's Bay's country, by P. Pond, 1785 (copy by J. G. Kohl)", url: "https://www.loc.gov/item/2002622133/" }],
  },
  {
    title: "A Map Exhibiting all the New Discoveries in the Interior Parts of North America (1795)", mapmaker: "Aaron Arrowsmith", mapmakerNation: "English", cartographer: "Aaron Arrowsmith", year: 1795, yearLabel: "1795, later edition with additions",
    description: "Arrowsmith's great map of the continent, 'inscribed by permission to the Honorable Governor and Company of Adventurers of England trading into Hudson's Bay, in testimony of their liberal communications', first issued on 1 January 1795 and reissued for twenty years as the Company's surveyors and the Nor'Westers sent in new work. The Library of Congress copy shown is a later edition with additions.",
    whatItShows: "Hudson Bay, Davis Strait, Labrador and the Gulf; the river systems of the interior with Slave Lake and the Mackenzie's river running to the Arctic; the Saskatchewan, Lake Winnipeg and the Red River country; the North West Coast from Vancouver's survey with Queen Charlotte's Islands; the Missouri rising in the Rocky Mountains, drawn as a single chain; Spanish Louisiana and New Spain in green.",
    whatItGotWrong: "Between the Rocky Mountains and the coast the sheet is almost empty, and the upper Missouri and the mountains' breadth were drawn from report (the Blackfoot chief Ac ko mok ki's map, through Fidler, reached Arrowsmith's 1802 edition).",
    region: "North America",
    file: "A map exhibiting all the new discoveries in the interior parts of North America LOC 2001620920.jpg", imageCredit: "Wikimedia Commons / Library of Congress, Geography and Map Division (2001620920); Aaron Arrowsmith, London", imageLicense: "Public domain",
    sourceNote: "Library of Congress, Geography and Map Division; the record notes 'rivers added east of the Rocky Mountains' in this state.",
    waterways: ["Mackenzie River", "Great Slave Lake", "Hudson Bay", "Lake Winnipeg", "Saskatchewan River", "Red River", "Lake Athabasca"], explorers: ["Alexander Mackenzie", "Samuel Hearne", "Philip Turnor", "Peter Fidler", "Captain George Vancouver"],
    citations: [{ kind: "archive", author: "Library of Congress", title: "A map exhibiting all the new discoveries in the interior parts of North America, A. Arrowsmith", url: "https://www.loc.gov/item/2001620920/" }, { kind: "dcb", title: DCB("a_ca_oo_mah_ca_ye_8E", "Hugh A. Dempsey, 'A-ca-oo-mah-ca-ye (Ac ko mok ki, Old Swan)'"), url: "https://www.biographi.ca/en/bio/a_ca_oo_mah_ca_ye_8E.html" }],
  },
  {
    title: "A Map of America Exhibiting Mackenzie's Track (1801)", mapmaker: "Alexander Mackenzie (published with his Voyages)", mapmakerNation: "Scottish, in the Montreal trade", year: 1801,
    description: "The map folded into Mackenzie's Voyages from Montreal (London, 1801), 'between latitudes 40 and 70 North and longitudes 45 and 180 West, exhibiting Mackenzie's track from Montreal to Fort Chipewyan and from thence to the North Sea in 1789 and to the West Pacific Ocean in 1793'.",
    whatItShows: "The canoe route from Montreal up the Ottawa and across the Great Lakes to Grand Portage, Lake Winnipeg and the Saskatchewan to Fort Chipewyan; the river to the 'North Sea' with 'Whale Island' at its mouth; the Peace, the Parsnip and the 'Tacoutche Tesse' (the Fraser, taken for the Columbia) to the Pacific; Hudson's Bay, James Bay and the coast from Vancouver's charts.",
    whatItGotWrong: "The 'Tacoutche Tesse' is carried south to the sea as the Columbia; Fraser proved in 1808 that it was a different river.",
    region: "Northern North America",
    file: "McKenzie, A. - Map of America - Travel 1789.png", imageCredit: "Wikimedia Commons; from Alexander Mackenzie, Voyages from Montreal (London, 1801)", imageLicense: "Public domain",
    sourceNote: "Scanned from the 1801 edition of the Voyages.",
    waterways: ["Mackenzie River", "Peace River", "Parsnip River", "Fraser River", "Lake Athabasca", "Great Slave Lake", "Dean Channel", "Lake Superior", "Lake Winnipeg", "Hudson Bay"], explorers: ["Alexander Mackenzie"],
    citations: [{ kind: "edition", author: "Alexander Mackenzie", title: "Voyages from Montreal, on the River St. Laurence, through the Continent of North America (London, 1801)", url: "https://archive.org/details/voyagesfrommontr00mack", year: "1801" }, { kind: "dcb", title: DCB("mackenzie_alexander_5E", "W. Kaye Lamb, 'Mackenzie, Sir Alexander'"), url: "https://www.biographi.ca/en/bio/mackenzie_alexander_5E.html" }],
  },
  {
    title: "Map of the North-West Territory of the Province of Canada (1814)", mapmaker: "David Thompson", mapmakerNation: "English-born, North West Company", cartographer: "David Thompson", year: 1814,
    description: "Thompson's great map, completed in 1814 for the North West Company from twenty-eight years of his own surveys, from Lake Superior to the Pacific; it hung for many years in the great hall at Fort William. The Archives of Ontario sheet shown is faded and foxed but legible in its labels.",
    whatItShows: "'Peace River' across the top left, the Athabasca and the Rocky Mountains drawn as ranges of linked hills, the Saskatchewan's branches, 'Churchill River', the Columbia and Kootenay country at the bottom left, the Winnipeg lakes and 'Lake Superior' at the bottom right, with the title cartouche at the right: 'Map of the North-West Territory of the Province of Canada'.",
    whatItGotWrong: "Little: the Dictionary of Canadian Biography notes that portions of Thompson's Columbia survey were never resurveyed and still appear on modern maps. The mountains are drawn as decorative chains rather than measured relief.",
    region: "Lake Superior to the Pacific",
    file: "1814ThompsonMap.jpg", imageCredit: "Wikimedia Commons / Archives of Ontario (I0012850); David Thompson, 1814", imageLicense: "Public domain",
    sourceNote: "Archives of Ontario, I0012850. The DCB records that the 1813-14 map made for the Company hung at Fort William; the Archives of Ontario holds this sheet.",
    waterways: ["Peace River", "Athabasca River", "Saskatchewan River", "North Saskatchewan River", "Churchill River", "Lake Superior", "Columbia River", "Kootenay River", "Lake Winnipeg"], explorers: ["David Thompson"],
    citations: [{ kind: "dcb", title: DCB("thompson_david_1770_1857_8E", "John Nicks, 'Thompson, David'"), url: "https://www.biographi.ca/en/bio/thompson_david_1770_1857_8E.html" }, { kind: "archive", author: "Archives of Ontario", title: "Map of the North-West Territory of the Province of Canada, David Thompson, 1814 (I0012850)" }],
  },
  {
    title: "Route of the Expedition from York Factory to Cumberland House and Isle à la Crosse, 1819 and 1820 (1823)", mapmaker: "Sir John Franklin (published with his Narrative)", mapmakerNation: "English, Royal Navy", year: 1823,
    description: "The route map from Franklin's Narrative of a Journey to the Shores of the Polar Sea (London, 1823), showing the first overland expedition's way inland from York Factory in 1819 and the summer and winter tracks from Cumberland House to Île-à-la-Crosse in 1820, with the dates of each camp and the places where observations for latitude, longitude, variation and dip were taken.",
    whatItShows: "York Factory and the Hayes with its portages dated September 1819; Knee Lake, Holey Lake, Norway House and Lake Winnipeg; the Saskatchewan to Cumberland House; Carlton House and the 'Buffalo Plains'; the Churchill route by Frog Portage and Pelican Lake to Isle à la Crosse; longitude west from Greenwich.",
    whatItGotWrong: "Only the line of march is surveyed; the country to either side is noted ('primitive country', 'alluvial flats') rather than mapped.",
    region: "Hayes River to Île-à-la-Crosse",
    file: "Route of the Expedition from York Factory to Cumberland House and the Summer & Winter Tracks from thence to Isle A La Crosse in 1819 & 1820 (1823).jpg", imageCredit: "Wikimedia Commons / Manitoba Historical Maps (Flickr); John Franklin, Narrative of a Journey to the Shores of the Polar Sea, 1823", imageLicense: "CC BY 2.0",
    sourceNote: "Photograph of the 1823 plate shared by Manitoba Historical Maps on Flickr under CC BY 2.0. Overlay bounds are approximate, read from the printed graticule (longitude 92 to 109 west of Greenwich; latitude about 52.5 to 57.5 N).",
    bounds: { sw: [52.4, -109.6], ne: [57.6, -91.9] },
    waterways: ["Hayes River", "Lake Winnipeg", "Saskatchewan River", "Churchill River", "Nelson River", "North Saskatchewan River"], explorers: ["Sir John Franklin", "Sir George Back", "Sir John Richardson"],
    citations: [{ kind: "edition", author: "John Franklin", title: "Narrative of a Journey to the Shores of the Polar Sea, in the Years 1819, 20, 21, and 22 (London, 1823)", year: "1823" }, { kind: "dcb", title: DCB("franklin_john_7E", "Janice Cavell, 'Franklin, Sir John'"), url: "https://www.biographi.ca/en/bio/franklin_john_7E.html" }],
  },
];

async function main() {
  const [ww, ex, cartos, existing] = await Promise.all([
    db.waterway.findMany({ select: { id: true, name: true } }), db.explorer.findMany({ select: { id: true, name: true } }),
    db.cartographer.findMany({ select: { id: true, name: true } }), db.historicalMap.findMany({ select: { title: true } }),
  ]);
  const wwId = (n: string) => { const w = ww.find((x) => x.name === n); if (!w) throw new Error(`waterway not found: ${n}`); return w.id; };
  const exId = (n: string) => { const e = ex.find((x) => x.name === n); if (!e) throw new Error(`explorer not found: ${n}`); return e.id; };
  const cartoId = (n?: string) => { if (!n) return null; const c = cartos.find((x) => x.name === n); if (!c) throw new Error(`cartographer not found: ${n}`); return c.id; };
  const rows = MAPS.filter((m) => !existing.some((e) => e.title === m.title)).map((m, i) => ({
    data: {
      title: m.title, mapmaker: m.mapmaker, mapmakerNation: m.mapmakerNation ?? null, cartographerId: cartoId(m.cartographer), year: m.year, yearLabel: m.yearLabel ?? null,
      description: m.description, whatItShows: m.whatItShows, whatItGotWrong: m.whatItGotWrong ?? null, region: m.region,
      imageUrl: commons(m.file), imageCredit: m.imageCredit, imageLicense: m.imageLicense, sourceUrl: commonsPage(m.file), sourceNote: m.sourceNote,
      boundsSwLat: m.bounds?.sw[0] ?? null, boundsSwLng: m.bounds?.sw[1] ?? null, boundsNeLat: m.bounds?.ne[0] ?? null, boundsNeLng: m.bounds?.ne[1] ?? null,
      relatedWaterwayIds: JSON.stringify(m.waterways.map(wwId)), relatedExplorerIds: JSON.stringify(m.explorers.map(exId)), sortOrder: i,
    },
    citations: m.citations,
  }));
  const backupFile = writeBackup("2026-10-19-historical-maps-seed-before", { note: "inserts only", existing: existing.length });
  report("historical maps seed", { toInsert: rows.map((r) => `${r.data.year} ${r.data.title}${r.data.boundsSwLat !== null ? " [overlay]" : ""}`), skippedExisting: MAPS.length - rows.length, backupFile });
  if (!APPLY) return;
  for (const r of rows) {
    const created = await db.historicalMap.create({ data: r.data });
    await db.citation.createMany({ data: r.citations.map((c, j) => ({ targetType: "historical_map", targetId: created.id, sortOrder: j, kind: c.kind, author: c.author ?? null, title: c.title, container: c.container ?? null, url: c.url ?? null, year: c.year ?? null, accessed: "2026-10-19", updatedAt: new Date() })) });
  }
  report("verify", { maps: await db.historicalMap.count(), withOverlay: await db.historicalMap.count({ where: { boundsSwLat: { not: null } } }), mapCitations: await db.citation.count({ where: { targetType: "historical_map" } }) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
