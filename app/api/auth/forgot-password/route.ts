import { prisma } from '@/lib/db';
import { sendResetPasswordEmail } from '@/lib/email';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  const { email } = await req.json();

  // 1. Check how many times this email has requested reset in last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentRequests = await prisma.forgotPasswordRequest.count({
    where: {
      email,
      createdAt: {
        gte: sevenDaysAgo
      }
    }
  });

  if (recentRequests >= 2) {
    await new Promise((res) => setTimeout(res, 1000 + Math.random() * 1000)); // 1–2s delay
  }

  if (recentRequests >= 3) {
    return NextResponse.json(null, { status: 204 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    // 2. Delete expired tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        expiresAt: {
          lt: new Date()
        }
      }
    });

    // 3. Generate and hash token
    const rawToken = crypto.randomUUID();
    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    // 4. Store hashed token in DB
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60) // expires in 1 hour
      }
    });

    // 5. Send raw token to user
    await sendResetPasswordEmail(user.email, rawToken);
  }

  // 6. Log request regardless of user existing
  await prisma.forgotPasswordRequest.create({
    data: { email }
  });

  return NextResponse.json({
    success: true,
    message: 'If this email exists in our system, a reset link has been sent.'
  });
}
