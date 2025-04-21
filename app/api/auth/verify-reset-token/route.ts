import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required.' }, { status: 400 });
  }

  // 1. Hash the token the same way it was hashed before storing
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // 2. Cleanup expired tokens in the database (e.g., every time a request comes in)
  await prisma.passwordResetToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  // 3. Find token entry using hashed value
  const tokenEntry = await prisma.passwordResetToken.findUnique({
    where: { token: hashedToken },
    include: { user: true },
  });

  if (!tokenEntry || tokenEntry.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Token is invalid or expired.' }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    userId: tokenEntry.userId, // You may need this for the reset form
  });
}
