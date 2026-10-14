import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! });
async function main() {
  const r = await client.execute({ sql: `SELECT narrativeContent FROM LessonPlan WHERE id = ?`, args: ['cmliiajbw0004m2u260srsthb'] });
  console.log(r.rows[0]?.narrativeContent);
}
main().catch(console.error);
