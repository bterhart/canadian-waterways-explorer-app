import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! });

async function main() {
  const ids = ['cmliiajbw0004m2u260srsthb', 'cmliiajbo0001m2u2lltp5xgn'];

  for (const id of ids) {
    const r = await client.execute({
      sql: `SELECT title, keyFigures, timeline FROM LessonPlan WHERE id = ?`,
      args: [id]
    });
    const row = r.rows[0];

    console.log(`\n=== ${row?.title} ===`);

    if (row?.keyFigures) {
      const figures = JSON.parse(String(row.keyFigures));
      console.log('\nKey Figures:');
      figures.forEach((f: any) => {
        console.log(`  - ${f.name}: explorerId = ${f.explorerId || 'MISSING'}`);
      });
    }

    if (row?.timeline) {
      const timeline = JSON.parse(String(row.timeline));
      console.log('\nTimeline:');
      timeline.forEach((t: any) => {
        console.log(`  - ${t.year} ${t.title}: waterwayId = ${t.waterwayId || 'NONE'}`);
      });
    }
  }
}

main().catch(console.error);
