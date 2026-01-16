const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Generating Test Evidence...');

  // 1. Get a control
  const control = await prisma.control.findFirst();
  if (!control) {
    console.error('No controls found. Run seed first.');
    return;
  }

  // 2. Create Evidence
  const evidence = await prisma.evidence.create({
    data: {
      source: 'Manual Test Script',
      checkName: 'Manual Verification Check',
      resourceId: 'res-test-js-123',
      result: {
        status: 'NON_COMPLIANT',
        details: 'Public access found on resource (JS generated).',
        severity: 'HIGH'
      },
      gaps: {
        create: {
          status: 'NON_COMPLIANT',
          details: 'Public access enabled violated policy (JS).',
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
