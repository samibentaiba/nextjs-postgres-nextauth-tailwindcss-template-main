// app/api/user/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Adjust based on your actual db.js path
import { Theme } from '@prisma/client';

// Temporary mock auth (Replace this with your auth logic)
const getAuthenticatedUserId = async () => {
  // Return a static user ID for testing (replace with session logic)
  return 1;
};

export async function GET() {
  const userId = await getAuthenticatedUserId();

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        theme: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const userId = await getAuthenticatedUserId();

  const body = await req.json();
  const { email, name, username, password, theme } = body;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        name,
        username,
        password, // In production, hash the password!
        theme // <--- include theme
      }
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      theme: user.theme
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to update user', details: error?.message },
      { status: 500 }
    );
  }
}
