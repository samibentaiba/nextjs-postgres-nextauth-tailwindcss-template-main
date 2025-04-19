import { PrismaClient } from '@prisma/client';
import productSeeder from './seeds/productSeeder';
import userSeeder from './seeds/userSeeder';
import blogSeeder from './seeds/blogSeeder';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding started...');

  // Run individual seeders sequentially
  await userSeeder(prisma);  // Seed users
  await productSeeder(prisma);  // Seed products
  await blogSeeder(prisma);  // Seed blogs

  console.log('✅ Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
