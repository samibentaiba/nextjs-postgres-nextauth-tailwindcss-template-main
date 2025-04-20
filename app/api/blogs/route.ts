import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Assuming your Prisma client is initialized in `lib/db.ts`

// GET: Fetch all blogs
export async function GET() {
    try {
      const blogs = await prisma.blog.findMany({
        include: {
          blogImages: true, // You can include related data here if needed
        },
      });
      return NextResponse.json(blogs, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
  }