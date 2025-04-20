import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Adjust based on your actual db.js path
import { Product } from '@prisma/client'; // Assuming you're using Prisma client types



// POST: Create a new product
export async function POST(req: Request) {
  try {
    const { name, price, stock, availableAt, status }: Product = await req.json();
    
    // Input validation if needed
    if (!name || !price || !stock || !availableAt || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        stock,
        availableAt,
        status,
      },
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

// DELETE: Delete a product by ID
export async function DELETE(req: Request) {
  const { id } = req.url.match(/\/api\/products\/(\d+)/)?.groups || {}; // Extract ID from the URL

  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    const deletedProduct = await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
