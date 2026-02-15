import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! });

const updates = [
  {
    id: "cmliiajbw0004m2u260srsthb",
    title: "A Day at the Trading Post",

    keyFigures: JSON.stringify([
      { name: "George Simpson", role: "Governor, HBC", years: "1787-1860", description: "Transformed HBC operations across North America for four decades", explorerId: "cmlijai0q0003m22r2hk84pe9" },
      { name: "Thanadelthur", role: "Chipewyan Diplomat", years: "c.1697-1717", description: "Brokered peace between Chipewyan and Cree, opening HBC trade", explorerId: "cmlijaiex000mm22rseuv61do" },
      { name: "Matonabbee", role: "Chipewyan Leader", years: "c.1737-1782", description: "Guided Samuel Hearne to the Arctic Ocean", explorerId: "cmlijaiez000nm22r1ou598s9" },
      { name: "James Douglas", role: "Chief Factor/Governor", years: "1803-1877", description: "Shaped HBC operations and early British Columbia", explorerId: "cmlijaicv0005m22r4caohonp" }
    ]),

    timeline: JSON.stringify([
      { year: 1670, title: "HBC Charter", description: "Monopoly granted over all lands draining into Hudson Bay", waterwayId: "cmlhaslrt001cm2zh9tknhhbe" },
      { year: 1774, title: "Cumberland House", description: "First HBC inland post, strategic shift from coastal operations" },
      { year: 1821, title: "HBC-NWC Merger", description: "HBC absorbs North West Company, creating continental monopoly" },
      { year: 1870, title: "Rupert's Land Transfer", description: "HBC surrenders territorial claims to Canada" }
    ])
  },

  {
    id: "cmliiajbo0001m2u2lltp5xgn",
    title: "Animals of the Fur Trade",

    keyFigures: JSON.stringify([
      { name: "Alexander Mackenzie", role: "Explorer", years: "1764-1820", description: "Pursued beaver trade routes to Arctic and Pacific oceans", explorerId: "cmlhaslpq0005m2zhbi5xrrt6" },
      { name: "Peter Pond", role: "Trader and Explorer", years: "1740-1807", description: "Opened the rich Athabasca beaver country in 1778", explorerId: "cmlhc4gt7000bm2ogmjjkr2c4" },
      { name: "Henry Kelsey", role: "Explorer", years: "1667-1724", description: "First European to observe inland wildlife and trade patterns", explorerId: "cmlhc4gsr0007m2ogrr0m8vqf" }
    ]),

    timeline: JSON.stringify([
      { year: 1600, title: "European Beaver Depletion", description: "European beaver exhausted, driving North American demand" },
      { year: 1670, title: "HBC Charter", description: "Beaver trade formalized under Hudson's Bay Company", waterwayId: "cmlhaslrt001cm2zh9tknhhbe" },
      { year: 1778, title: "Athabasca Opened", description: "Peter Pond reaches richest beaver country", waterwayId: "cmlhaslrq001am2zhud0snm8t" },
      { year: 1840, title: "End of Beaver Hat Fashion", description: "Silk hats replace beaver felt, collapsing demand" }
    ])
  }
];

async function main() {
  console.log("=== ADDING EXPLORER AND WATERWAY LINKS ===\n");

  for (const u of updates) {
    console.log(`Updating: ${u.title}`);
    const result = await client.execute({
      sql: `UPDATE LessonPlan SET keyFigures = ?, timeline = ? WHERE id = ?`,
      args: [u.keyFigures, u.timeline, u.id]
    });
    console.log(`  Rows affected: ${result.rowsAffected}`);
  }

  console.log("\n=== VERIFYING ===\n");

  for (const u of updates) {
    const r = await client.execute({
      sql: `SELECT title, keyFigures, timeline FROM LessonPlan WHERE id = ?`,
      args: [u.id]
    });
    const row = r.rows[0];

    console.log(`${row?.title}:`);

    if (row?.keyFigures) {
      const figures = JSON.parse(String(row.keyFigures));
      figures.forEach((f: any) => {
        console.log(`  ${f.name}: explorerId=${f.explorerId ? 'YES' : 'NO'}`);
      });
    }

    if (row?.timeline) {
      const timeline = JSON.parse(String(row.timeline));
      timeline.forEach((t: any) => {
        console.log(`  ${t.year}: waterwayId=${t.waterwayId ? 'YES' : 'NO'}`);
      });
    }
    console.log('');
  }

  console.log("Done.");
}

main().catch(console.error);
