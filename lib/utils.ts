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

export const seedFromCsv = async (
  prisma: PrismaClient,
  model: any,
  csvFilePath: string,
  imageDirectory: string,
  processRow: (row: any, imageDirectory: string) => Promise<any>
): Promise<void> => {
  console.log(`📂 Seeding from ${csvFilePath}...`);

  const rows: any[] = [];

  // Step 1: Load CSV rows
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });

  // Step 2: Process rows in parallel (wait for all async hashes, etc.)
  const processedData = await Promise.all(
    rows.map(row => processRow(row, imageDirectory))
  );

  const validData = processedData.filter(Boolean); // remove undefined/null

  // Step 3: Insert in batches
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

