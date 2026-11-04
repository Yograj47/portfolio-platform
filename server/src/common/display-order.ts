import { Prisma } from '@prisma/client';
import { PrismaService } from '@/database/prisma/prisma.service';

export function firstAvailableOrder(items: { displayOrder: number }[]) {
  const occupied = new Set(items.map((item) => item.displayOrder));
  let order = 1;
  while (occupied.has(order)) order++;
  return order;
}

export function orderedWrite<T>(
  prisma: PrismaService,
  scope: string,
  work: (tx: Prisma.TransactionClient) => Promise<T>,
) {
  return prisma.$transaction(
    async (tx) => {
      await tx.$queryRaw`SELECT 1 AS locked FROM pg_advisory_xact_lock(hashtext(${scope}))`;
      return work(tx);
    },
    { timeout: 15000 },
  );
}
