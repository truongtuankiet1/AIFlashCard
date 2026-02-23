import { PrismaClient } from '@prisma/client';

const dbUrl = process.env.DATABASE_URL;
console.log('DATABASE_URL prefix:', dbUrl?.substring(0, 70) + '...');
console.log('DIRECT_URL prefix:', process.env.DIRECT_URL?.substring(0, 70) + '...');

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
