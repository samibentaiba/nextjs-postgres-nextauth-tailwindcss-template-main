import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

async function blogSeeder(prisma: PrismaClient) {
  console.log('📝 Seeding blogs...');

  const csvPath = path.resolve('data/blogs.csv');
  const imageDir = path.resolve('public/images/blogs');
  const rows: any[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csvParser())
      .on('data', (row) => rows.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  for (const row of rows) {
    const { title, content, images } = row;

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        status: 'active',
      },
    });

    if (!images) {
      console.warn(`⚠️ No images for blog "${title}". Skipping images.`);
      continue;
    }

    const imageList = images.split(',').map((i: string) => i.trim());

    for (const imageName of imageList) {
      const imagePath = path.join(imageDir, imageName);

      if (!fs.existsSync(imagePath)) {
        console.warn(`⚠️ Image "${imageName}" not found. Skipping.`);
        continue;
      }

      const imageBuffer = fs.readFileSync(imagePath);

      const imageRecord = await prisma.image.create({
        data: {
          name: imageName,
          data: imageBuffer,
          folder: 'blogImages',
        },
      });

      await prisma.blogImage.create({
        data: {
          blogId: blog.id,
          imageId: imageRecord.id,
        },
      });

      console.log(`✅ Linked "${imageName}" to blog "${title}"`);
    }
  }

  console.log('✅ Finished seeding blogs.');
}

export default blogSeeder;
