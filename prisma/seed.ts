import { prisma } from '@/app/lib/db';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const demoEmail = 'demo@example.com';
  const demoPassword = 'demo123456';
  const hashedPassword = await bcrypt.hash(demoPassword, 10);

  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      email: demoEmail,
      password: hashedPassword,
      name: 'Demo User',
    },
  });

  console.log(`✅ Demo user created: ${user.email}`);
  console.log('   Email: demo@example.com');
  console.log('   Password: demo123456');
}

seed()
  .then(() => {
    console.log('✨ Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
