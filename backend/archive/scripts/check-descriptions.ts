import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! });
async function main() {
  const ids = ['cmliiajbw0004m2u260srsthb', 'cmliiajbo0001m2u2lltp5xgn'];
  for (const id of ids) {
    const r = await client.execute({ sql: `SELECT title, description, gradeLevel FROM LessonPlan WHERE id = ?`, args: [id] });
    const row = r.rows[0];
    console.log(`${row?.title}:`);
    console.log(`  gradeLevel: ${row?.gradeLevel}`);
    console.log(`  description: ${row?.description}`);
    console.log('');
  }
}
main().catch(console.error);
