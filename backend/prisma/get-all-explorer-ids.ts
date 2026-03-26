import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const libsql = createClient({
  url: 'libsql://canadian-waterways-weston-r.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const explorers = await prisma.explorer.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });
  
  console.log('ALL EXPLORER IDs:');
  explorers.forEach(e => {
    console.log(`"${e.id}" // ${e.name}`);
  });
}

main().catch(console.error).finally(() => process.exit(0));
