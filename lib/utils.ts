import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from 'bcryptjs';


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



