import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

async function blogSeeder(prisma: PrismaClient) {
  console.log('📝 Seeding blogs...');

  const csvFilePath = path.resolve('data/blogs.csv');
  const imageDirectory = path.resolve('public/images/blogs');

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
    const { title, content, image } = row;
    const imagePath = path.join(imageDirectory, image);

    if (!fs.existsSync(imagePath)) {
      console.warn(`⚠️ Image "${image}" not found. Skipping blog "${title}".`);
      continue;
    }

    const imageBuffer = fs.readFileSync(imagePath);

    // 2a: Create Image record
    const imageRecord = await prisma.image.create({
      data: {
        name: image,
        data: imageBuffer,
        folder: 'blogImages',
      },
    });

    // 2b: Create Blog record and link the image
    await prisma.blog.create({
      data: {
        title,
        content,
        imageId: imageRecord.id,
        status: 'active',
      },
    });

    console.log(`✅ Blog "${title}" seeded with image "${image}"`);
  }

  console.log('✅ Finished seeding blogs.');
}

export default blogSeeder;
