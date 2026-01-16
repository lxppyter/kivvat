const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Generating Realistic Test Evidence...');

  // 1. Get a control (ISO 27001 A.9.4.1 - Access Control)
  let control = await prisma.control.findFirst({
      where: { code: 'A.9.4.1' }
  });
  
  // Fallback if specific control not found
  if (!control) {
      control = await prisma.control.findFirst();
  }

  if (!control) {
    console.error('No controls found. Run seed first.');
    return;
  }

  // 2. Create Realistic Evidence (AWS Findings)
  const evidence = await prisma.evidence.create({
    data: {
      source: 'AWS CloudWatch / SecurityHub',
      checkName: 'AWS-IAM-ROOT-MFA',
      resourceId: 'arn:aws:iam::123456789012:root',
      result: {
        status: 'NON_COMPLIANT',
        severity: 'CRITICAL',
        region: 'us-east-1',
        description: 'Root account MFA is not enabled.',
        remediation: 'Enable MFA for the root account immediately in IAM console.'
      },
      gaps: {
        create: {
          status: 'NON_COMPLIANT',
          details: 'Root account lacks MFA, violating Control A.9.4.1 (Information Access Restriction).',
          controlId: control.id
        }
      }
    }
  });

  console.log(`Created Realistic Evidence ID: ${evidence.id}`);
  console.log(`Linked to Control: ${control.code} - ${control.name}`);
  console.log(`Test URL: http://localhost:3001/reports/evidence/${evidence.id}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
