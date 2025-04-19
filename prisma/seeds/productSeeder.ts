import { PrismaClient, Status } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

async function productSeeder(prisma: PrismaClient) {
  console.log('📦 Seeding products...');

  const csvFilePath = path.resolve('data/products.csv');
  const imageDirectory = path.resolve('public/images/products');

  const rows: any[] = [];

  // Step 1: Load all CSV rows
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });

  // Step 2: Process each row
  for (const row of rows) {
    const { name, status, price, stock, availableAt, images } = row;
    const imageNames = images.split(',').map((img: string) => {
      // now img is typed
    });

    // Create Product
    const product = await prisma.product.create({
      data: {
        name,
        status: status as Status,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        availableAt: new Date(availableAt)
      }
    });

    for (const imageName of imageNames) {
      const imagePath = path.resolve(imageDirectory, imageName);

      if (!fs.existsSync(imagePath)) {
        console.warn(`⚠️ Image "${imageName}" not found. Skipping.`);
        continue;
      }

      const imageBuffer = fs.readFileSync(imagePath);

      const imageRecord = await prisma.image.create({
        data: {
          name: imageName,
          data: imageBuffer,
          folder: 'productImages'
        }
      });

      await prisma.productImage.create({
        data: {
          productId: product.id,
          imageId: imageRecord.id
        }
      });

      console.log(`✅ Linked image "${imageName}" to product "${name}"`);
    }
  }

  console.log('✅ Finished seeding products.');
}

export default productSeeder;
