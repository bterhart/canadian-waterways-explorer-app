import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

const TURSO_DATABASE_URL = 'libsql://canadianwaterwaysexplorer-bterhart.aws-us-east-2.turso.io';
const TURSO_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzExMDYzODEsImlkIjoiMTliZDYzMmMtZjNkYy00YzAwLTg0ODItNzU5YjQ3MmIxMGE0IiwicmlkIjoiZTdiMjljMTYtNGJhZi00YzM3LWEyYzQtZjJmYmViYTcyMjA2In0.Mixg_E1goZM8e0_81rnymYLtKVBbsp3DhQgkKZ4eP0ONcm-oBnRDiZ8dPDHdjUAmg023zpBCoB0d832JlVHPDQ';

const adapter = new PrismaLibSQL({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const explorers = await prisma.explorer.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });
  
  explorers.forEach(e => {
    console.log(`${e.id}|${e.name}`);
  });
}

main().catch(console.error).finally(() => process.exit(0));
