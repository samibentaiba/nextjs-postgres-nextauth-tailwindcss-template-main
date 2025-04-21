// lib/db.ts
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Handle Prisma Client logging in development for easier debugging
if (process.env.NODE_ENV === 'development') {
  // Query event: Log query details (with correct typing)
  prisma.$on('query', (e: Prisma.QueryEvent) => {
    console.log(`${e.query} - ${e.params} - ${e.duration}ms`);
  });

  // Error event: Log errors
  prisma.$on('error', (e: Error) => {
    console.error('Prisma Client Error:', e.message);
  });
}

// Optional: Production error handling (for example, logging to a service)
if (process.env.NODE_ENV === 'production') {
  prisma.$on('error', (e: Error) => {
    // You can integrate with an error tracking service like Sentry here
    console.error('Prisma Client Error in Production:', e.message);
  });
}

export { prisma };
