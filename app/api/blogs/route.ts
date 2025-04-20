import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Assuming your Prisma client is initialized in `lib/db.ts`
import { Blog } from '@prisma/client';

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

// POST: Create a new blog
export async function POST(request: Request) {
  try {
    const data: Blog = await request.json();
    
    // You can add validations here if needed
    const newBlog = await prisma.blog.create({
      data: {
        title: data.title,
        content: data.content,
        status: data.status || 'active', // Default to 'active' if not provided
      },
    });
    
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

// DELETE: Delete a blog by ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = parseInt(searchParams.get('id') || '', 10);
    
    if (!blogId) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }
    
    const deletedBlog = await prisma.blog.delete({
      where: { id: blogId },
    });
    
    return NextResponse.json(deletedBlog, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
