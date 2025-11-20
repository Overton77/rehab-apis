// prisma/seed.ts
import { PrismaClient } from './generated/client';
import fs from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();

type Snapshot = Record<string, any[]>;

// Order matters for foreign keys.
// You can adjust this list as your schema grows.
// Base tables:
const BASE_MODEL_ORDER = [
  'ProspectiveRehabs',
  'InsuranceProvider',

  'Rehab',
  'InsurancePayer',
  'PaymentOption',
  'LevelOfCare',
  'Service',
  'DetoxService',
  'Population',
  'Accreditation',
  'Language',
  'Amenity',
  'Environment',
  'SettingStyle',
  'LuxuryTier',
  'ProgramFeature',
];

// Junction / join tables (FKs into the above):
const JUNCTION_MODEL_ORDER = [
  'RehabInsurancePayer',
  'RehabPaymentOption',
  'RehabLevelOfCare',
  'RehabService',
  'RehabDetoxService',
  'RehabPopulation',
  'RehabAccreditation',
  'RehabLanguage',
  'RehabAmenity',
  'RehabEnvironment',
  'RehabSettingStyle',
  'RehabLuxuryTier',
  'RehabProgramFeature',
];

// Remove keys with null values and optionally some system fields
function stripNullsAndSystemFields(
  record: Record<string, any>,
): Record<string, any> {
  const SYSTEM_FIELDS = new Set(['createdAt', 'updatedAt']);
  return Object.fromEntries(
    Object.entries(record).filter(([key, value]) => {
      if (SYSTEM_FIELDS.has(key)) return false;
      return value !== null;
    }),
  );
}

async function main() {
  const snapshotPath = path.join(__dirname, 'snapshot.json');

  if (!fs.existsSync(snapshotPath)) {
    console.warn(`No snapshot file found at ${snapshotPath}. Nothing to seed.`);
    return;
  }

  const raw = fs.readFileSync(snapshotPath, 'utf-8');
  const snapshot: Snapshot = JSON.parse(raw);

  // Discover model names actually present on the Prisma client
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

  const availableModelNames = Object.keys(prisma).filter((key) => {
    if (INTERNAL_KEYS.has(key)) return false;
    const delegate = (prisma as any)[key];
    return delegate && typeof delegate.findMany === 'function';
  });

  // Ensure we only seed models that exist both in Prisma and in snapshot
  const modelsInSnapshot = Object.keys(snapshot).filter((name) =>
    availableModelNames.includes(name),
  );

  // Build ordered list: base -> junction -> everything else as fallback
  const orderedModels: string[] = [
    ...BASE_MODEL_ORDER.filter((m) => modelsInSnapshot.includes(m)),
    ...JUNCTION_MODEL_ORDER.filter((m) => modelsInSnapshot.includes(m)),
    ...modelsInSnapshot.filter(
      (m) => !BASE_MODEL_ORDER.includes(m) && !JUNCTION_MODEL_ORDER.includes(m),
    ),
  ];

  console.log('Seeding models in order:');
  console.log(orderedModels.join(', '), '\n');

  // Optional: clear data first (useful after a full reset)
  for (const modelName of orderedModels.slice().reverse()) {
    const delegate = (prisma as any)[modelName];
    if (!delegate || typeof delegate.deleteMany !== 'function') continue;
    await delegate.deleteMany();
    console.log(`Cleared ${modelName}`);
  }
  console.log('');

  // Reseed
  for (const modelName of orderedModels) {
    const delegate = (prisma as any)[modelName];
    const rows = snapshot[modelName];

    if (!delegate || !rows || rows.length === 0) {
      console.log(`Skipping ${modelName}: no data`);
      continue;
    }

    // Clean records: drop nulls and system fields
    const cleaned = rows.map(stripNullsAndSystemFields);

    try {
      await delegate.createMany({
        data: cleaned,
        skipDuplicates: true,
      });

      console.log(`Seeded ${cleaned.length} records into ${modelName}`);
    } catch (err) {
      console.error(`❌ Error seeding ${modelName}:`, err);
      // You can choose to `throw` here if you want to fail hard
    }
  }

  console.log('\n✅ Seeding complete');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
