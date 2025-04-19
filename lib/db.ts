import { PrismaClient, Product } from '@prisma/client';
export type { Product } from '@prisma/client'; 
export { PrismaClient } from "@prisma/client"

// Initialize Prisma Client
const prisma = new PrismaClient();



// Function to get products with pagination and search
export async function getProducts(
  search: string,
  offset: number
): Promise<{
  products: Product[];
  newOffset: number | null;
  totalProducts: number;
}> {
  try {
    // If a search term is provided, filter products by name
    if (search) {
      const products = await prisma.product.findMany({
        where: {
          name: {
            contains: search, // Use contains for partial match (equivalent to ilike in Drizzle)
            mode: 'insensitive' // Case-insensitive search
          }
        },
        take: 1000 // Limit to 1000 results
      });

      return {
        products,
        newOffset: null,
        totalProducts: products.length // Total count from the result
      };
    }

    // If there's no search term, fetch paginated results
    if (offset === null) {
      return { products: [], newOffset: null, totalProducts: 0 };
    }

    // Count the total number of products
    const totalProducts = await prisma.product.count();

    // Fetch products with pagination
    const products = await prisma.product.findMany({
      skip: offset,
      take: 5 // Limit to 5 products per page
    });

    // Calculate the new offset
    const newOffset = products.length >= 5 ? offset + 5 : null;

    return {
      products,
      newOffset,
      totalProducts
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch products');
  }
}

// Function to delete a product by its ID
export async function deleteProductById(id: number) {
  try {
    await prisma.product.delete({
      where: {
        id
      }
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete product');
  }
}
