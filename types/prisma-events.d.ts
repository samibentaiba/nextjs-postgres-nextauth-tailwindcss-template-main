// types/prisma-events.d.ts
import { PrismaClient } from '@prisma/client';

// Extend the PrismaClient to allow for event listeners
declare module '@prisma/client' {
  interface PrismaClient {
    $on(event: 'query', callback: (e: Prisma.QueryEvent) => void): void;
    $on(event: 'error', callback: (e: Error) => void): void;
  }
}
