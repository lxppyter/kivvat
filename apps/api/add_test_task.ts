import { PrismaClient, TaskStatus, ComplianceStatus } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not defined');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Adding test task...');

  // 1. Ensure Standard & Control exists
  let standard = await prisma.complianceStandard.findUnique({ where: { name: 'Manuel Test Standardı' } });
  if (!standard) {
      standard = await prisma.complianceStandard.create({
          data: { name: 'Manuel Test Standardı', description: 'UI Testleri için' }
      });
  }

  let control = await prisma.control.findFirst({ where: { code: 'TEST.1.1' } });
  if (!control) {
      control = await prisma.control.create({
          data: {
              name: 'Test Kontrolü',
              code: 'TEST.1.1',
              standardId: standard.id,
              description: 'Bu bir test kontrolüdür.'
          }
      });
  }

  // 2. Create Evidence
  const evidence = await prisma.evidence.create({
      data: {
          source: 'MANUAL',
          checkName: 'UI Verification',
          result: { foo: 'bar' },
          resourceId: 'ui-test-resource-01'
      }
  });

  // 3. Create Gap Analysis
  const gap = await prisma.gapAnalysis.create({
      data: {
          controlId: control.id,
          evidenceId: evidence.id,
          status: ComplianceStatus.NON_COMPLIANT,
          details: 'Manuel test için oluşturulmuş örnek uygunsuzluk.'
      }
  });

  // 4. Create Task
  const task = await prisma.task.create({
      data: {
          title: 'Düzelt: Test Güvenlik Açığı',
          description: 'Çözüldü butonu testi için manuel oluşturulan görev.\n\nBeklenen: Butona basınca statü ÇÖZÜLDÜ olmalı.',
          status: TaskStatus.OPEN,
          gapAnalysisId: gap.id
      }
  });

  console.log(`Created Task: ${task.id} (${task.title})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
