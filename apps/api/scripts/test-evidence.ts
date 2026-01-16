import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Generating Test Evidence...');

  // 1. Get a control (e.g., specific one or first one)
  const control = await prisma.control.findFirst();
  if (!control) {
    console.error('No controls found. Run seed first.');
    return;
  }

  // 2. Create Evidence linked to this control
  const evidence = await prisma.evidence.create({
    data: {
      source: 'Manual Test Script',
      checkName: 'Manual Verification Check',
      resourceId: 'res-test-123',
      result: {
        status: 'NON_COMPLIANT',
        details: 'Public access found on resource.',
        severity: 'HIGH'
      },
      gaps: {
        create: {
          status: 'NON_COMPLIANT',
          details: 'Public access enabled violated policy.',
          controlId: control.id
        }
      }
    }
  });

  console.log(`Created Evidence ID: ${evidence.id}`);
  console.log(`Linked to Control: ${control.code} - ${control.name}`);
  console.log(`Test URL: http://localhost:3001/reports/evidence/${evidence.id}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
