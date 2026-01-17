import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file from the same directory
dotenv.config({ path: path.join(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not defined in .env file');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting operational data cleanup...');

  // Delete dependencies in correct order (Child -> Parent)
  
  // 1. Tasks (depends on GapAnalysis)
  await prisma.task.deleteMany({});
  console.log('Deleted Tasks');

  // 2. GapAnalysis (depends on Evidence & Control)
  await prisma.gapAnalysis.deleteMany({});
  console.log('Deleted GapAnalysis');
  
  // 3. Evidence (depends on nothing operational)
  await prisma.evidence.deleteMany({});
  console.log('Deleted Evidence');

  // Delete main operational tables
  await prisma.scanReport.deleteMany({});
  console.log('Deleted ScanReports');

  await prisma.asset.deleteMany({});
  console.log('Deleted Assets');

  // Optional: Reset Policy Assignments if needed
  // await prisma.policyAssignment.deleteMany({}); 

  console.log('Cleanup complete! System is fresh.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
