import { hashPassword } from '@/lib/utils'; // Import hashPassword utility
import { seedFromCsv } from 'utils/server';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

async function userSeeder(prisma: PrismaClient) {
  console.log('🧑‍💻 Seeding users...');

  const csvFilePath = path.resolve('data/users.csv');

  // Define the row processing logic for users
  const processRow = async (row: any, imageDirectory: string) => {
    const { email, name, username, password } = row;

    // Hash the password before storing it
    const hashedPassword = await hashPassword(password);

    return {
      email,
      name,
      username,
      password: hashedPassword // Store the hashed password
    };
  };

  // Use the utility function to seed the data
  await seedFromCsv(prisma, prisma.user, csvFilePath, '', processRow);
}

export default userSeeder;
