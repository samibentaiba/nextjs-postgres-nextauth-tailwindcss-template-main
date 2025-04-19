import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { seedFromCsv } from '@/lib/utils'; // Import the utility function

const prisma = new PrismaClient();

async function blogSeeder(prisma: PrismaClient) {
  console.log('📝 Seeding blogs...');

  const csvFilePath = path.resolve('data/blogs.csv');
  const imageDirectory = path.resolve('public/images');

  // Define the row processing logic for blogs
  const processRow = (row: any, imageDirectory: string) => {
    const { title, content, image, authorId } = row;
    const imagePath = path.resolve(imageDirectory, image);

    if (fs.existsSync(imagePath)) {
      return {
        title,
        content,
        image: fs.readFileSync(imagePath), // Read image as Buffer
        authorId: parseInt(authorId, 10),
      };
    } else {
      console.warn(`Image ${image} not found in the images folder.`);
      return null;
    }
  };

  // Use the utility function to seed the data
  await seedFromCsv(prisma, prisma.blog, csvFilePath, imageDirectory, processRow);
}

export default blogSeeder;
