import { PrismaClient } from '@prisma/client';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from 'bcryptjs';
import csv from 'csv-parser';
import fs from 'fs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function bufferToImageSrc(
  buffer: Buffer | Uint8Array,
  mimeType = 'image/jpeg'
): string {
  const actualBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  const base64 = actualBuffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

// Hash the password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // You can adjust the salt rounds for security
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Compare a plain text password with the hashed password in the database
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};


// Function to seed data from CSV
export const seedFromCsv = async (
  prisma: PrismaClient,
  model: any, // Prisma model e.g., prisma.blog, prisma.product
  csvFilePath: string, // Path to the CSV file
  imageDirectory: string, // Path to the image directory
  processRow: (row: any, imageDirectory: string) => any // Function to process each row
) => {
  console.log(`📂 Seeding from ${csvFilePath}...`);

  const data: any[] = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', async (row) => {
      const processedRow = await processRow(row, imageDirectory);
      if (processedRow) {
        data.push(processedRow);
      }
    })
    .on('end', async () => {
      // Insert the data in bulk in batches of 100 (or adjust chunk size as needed)
      const chunkSize = 100;
      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        await model.createMany({
          data: chunk,
        });
      }
      console.log(`✅ Seeding complete for ${csvFilePath}`);
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
    });
};
