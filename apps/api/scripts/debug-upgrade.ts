
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Debug Upgrade ---');
  
  // 1. Find or Create User
  let user = await prisma.user.findFirst({ where: { email: 'debug@test.com' } });
  if (!user) {
      user = await prisma.user.create({
          data: {
              email: 'debug@test.com',
              password: 'hash',
              name: 'Debug User',
              plan: 'FREE', // Initial
              subscription: {
                  create: { plan: 'FREE', status: 'ACTIVE' }
              }
          }
      });
  }
  
  console.log('Initial User Plan:', user.plan);
  
  // 2. Simulate Upgrade (PaymentService logic)
  const targetPlan = 'PRO';
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await prisma.user.update({
      where: { id: user.id },
      data: {
          plan: targetPlan,
          licenseKey: 'PRO-DEMO-KEY',
          licenseExpiresAt: expiresAt,
          subscriptionStatus: 'active'
      }
  });

  // 3. Simulate GetProfile (AuthService logic)
  const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { subscription: true }
  });

  console.log('Updated User Plan:', updatedUser?.plan);
  console.log('Updated Subscription Plan:', updatedUser?.subscription?.plan);
  
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
