import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db' // Adjust based on your actual db.js path

// GET: Fetch all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true, // Include images if needed
      },
    })

    // Serialize date fields to avoid hydration issues
    const serializedProducts = products.map((product) => ({
      ...product,
      availableAt: product.availableAt.toISOString(),
    }))

    return NextResponse.json(serializedProducts)
  } catch (error) {
    console.error(error)
    return NextResponse.error()
  }
}
