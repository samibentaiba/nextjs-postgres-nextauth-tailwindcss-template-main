import { PrismaClient, Status } from '@prisma/client';
import { seedFromCsv } from '@/lib/utils'; // Import the utility function
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

async function productSeeder(prisma: PrismaClient) {
  console.log('📦 Seeding products...');

  const csvFilePath = path.resolve('data/products.csv');
  const imageDirectory = path.resolve('public/images');

  // Define the row processing logic for products
  const processRow = (row: any, imageDirectory: string) => {
    const { name, status, price, stock, availableAt, image } = row;
    const imagePath = path.resolve(imageDirectory, image);

    if (fs.existsSync(imagePath)) {
      return {
        name,
        status: status as Status,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        availableAt: new Date(availableAt),
        image: fs.readFileSync(imagePath), // Read image as Buffer
      };
    } else {
      console.warn(`Image ${image} not found in the images folder.`);
      return null;
    }
  };

  // Use the utility function to seed the data
  await seedFromCsv(prisma, prisma.product, csvFilePath, imageDirectory, processRow);
}

export default productSeeder;
