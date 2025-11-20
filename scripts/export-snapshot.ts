// scripts/export-snapshot.ts
import { PrismaClient } from 'prisma/generated/client';
import fs from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();

// Keys on `prisma` that we don't want to treat as models
const INTERNAL_KEYS = new Set([
  '$connect',
  '$disconnect',
  '$executeRaw',
  '$executeRawUnsafe',
  '$queryRaw',
  '$queryRawUnsafe',
  '$on',
  '$transaction',
  '$use',
]);

async function main() {
  const snapshot: Record<string, unknown[]> = {};

  // Dynamically discover model delegates
  const modelNames = Object.keys(prisma).filter((key) => {
    if (INTERNAL_KEYS.has(key)) return false;
    const delegate = (prisma as any)[key];
    return delegate && typeof delegate.findMany === 'function';
  });

  for (const modelName of modelNames) {
    const delegate = (prisma as any)[modelName];
    const records = await delegate.findMany();
    snapshot[modelName] = records;
    console.log(`Exported ${records.length} records from ${modelName}`);
  }

  const filePath = path.join(__dirname, '..', 'prisma', 'snapshot.json');
  fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2), 'utf-8');
  console.log(`\n✅ Snapshot written to: ${filePath}`);
}

main()
  .catch((e) => {
    console.error('Export failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
