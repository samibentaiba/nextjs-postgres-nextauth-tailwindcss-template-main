// app/api/seed/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/db';
const prisma = new PrismaClient();
import fs from 'fs';

export async function GET() {
  try {
    // 🧹 Clear existing products (optional)
    await prisma.product.deleteMany();

    // 📥 Read image files from disk
    const img1 = fs.readFileSync('public/images/product1.jpg');
    const img2 = fs.readFileSync('public/images/product1.jpg');

    // 🌱 Insert new products
    await prisma.product.createMany({
      data: [
        {
          image: img1,
          name: 'Solar Panel A',
          status: 'active',
          price: 199.99,
          stock: 10,
          availableAt: new Date()
        },
        {
          image: img2,
          name: 'Inverter B',
          status: 'inactive',
          price: 299.99,
          stock: 5,
          availableAt: new Date()
        }
      ]
    });

    // ✅ Fetch back inserted products
    const result = await prisma.product.findMany();
    return NextResponse.json({ message: 'Seeded successfully!', data: result });
  } catch (error) {
    console.error(error);
    return new Response('Failed to seed data', { status: 500 });
  }
}
