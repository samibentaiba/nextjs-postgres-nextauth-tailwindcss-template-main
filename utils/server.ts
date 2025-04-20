import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import csv from 'csv-parser';
import fs from 'fs';

export const seedFromCsv = async (
  prisma: PrismaClient,
  model: any,
  csvFilePath: string,
  imageDirectory: string,
  processRow: (row: any, imageDirectory: string) => Promise<any>
): Promise<void> => {
  console.log(`📂 Seeding from ${csvFilePath}...`);

  const rows: any[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });

  const processedData = await Promise.all(
    rows.map(row => processRow(row, imageDirectory))
  );

  const validData = processedData.filter(Boolean);

  const chunkSize = 100;
  for (let i = 0; i < validData.length; i += chunkSize) {
    const chunk = validData.slice(i, i + chunkSize);
    await model.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }

  console.log(`✅ Seeding complete for ${csvFilePath}`);
};