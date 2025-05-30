import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('12345678', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test_user@linkbin.com' },
    update: {},
    create: {
      username: 'test_user',
      email: 'test_user@linkbin.com',
      password: hashedPassword,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
