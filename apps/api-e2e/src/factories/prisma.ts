import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@my-lex/prisma-generated';

const adapter = new PrismaPg({
  connectionString: process.env.POSTGRES_URL,
});

export const prisma: PrismaClient = new PrismaClient({
  adapter,
});
