import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const TURSO_URL = 'libsql://canadian-waterways-weston-r.turso.io';
const TURSO_AUTH = process.env.TURSO_AUTH_TOKEN || '';

const libsql = createClient({ url: TURSO_URL, authToken: TURSO_AUTH });
const adapter = new PrismaLibSQL({ url: TURSO_URL, authToken: TURSO_AUTH });
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
