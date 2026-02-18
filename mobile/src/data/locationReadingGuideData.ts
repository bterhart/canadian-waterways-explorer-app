// Location Reading Guide Entry type (same as Explorer reading guide)
export interface LocationReadingGuideEntry {
  authorSource?: string;
  title: string;
  publisher?: string;
  year?: string;
  url?: string;
  description?: string;
}

// Reading guide data mapped by location ID
export const locationReadingGuideData: Record<string, LocationReadingGuideEntry[]> = {
  // Bas-de-la-Rivière (Fort Alexander)
  'cmlhcpxp60023m2a3nk6v0ile': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Fort Alexander (Bas-de-la-Rivière) Post Journals',
      publisher: 'HBCA B.4/a series',
      description: 'Primary daily records of operations at Bas-de-la-Rivière / Fort Alexander on Lake Winnipeg during the HBC-NWC rivalry and Red River Settlement era.',
    },
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade: Their Role as Trappers Hunters Middlemen and Military Allies 1660–1870',
      publisher: 'University of Toronto Press',
      year: '1974',
      description: "Ethnohistorical context for Indigenous trade networks at Lake Winnipeg posts including Bas-de-la-Rivière.",
    },
    {
      authorSource: 'Ens Jean Peterson',
      title: "The Geography of the Hudson's Bay Company Fort Alexander Trade 1786–1821",
      publisher: 'MA thesis University of Manitoba',
      year: '1989',
      description: 'Spatial analysis of trade flows and Indigenous interactions at the post.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Alexander',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-alexander',
      description: "Overview of the post's role in Lake Winnipeg fur trade and Métis history.",
    },
    {
      authorSource: 'Wikipedia',
      title: 'Bas-de-la-Rivière',
      url: 'https://en.wikipedia.org/wiki/Bas-de-la-Rivière',
      description: "Entry on the fort's history location and significance in Manitoba waterways.",
    },
  ],
};
