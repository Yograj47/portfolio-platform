import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/database/prisma/prisma.service';
@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}
  async summary(ownerId: string) {
    return this.prisma.$transaction(
      async (tx) => {
        const [
          projectGroups,
          media,
          skills,
          categories,
          timelineGroups,
          messageGroups,
          recentProjects,
          recentMessages,
        ] = await Promise.all([
          tx.project.groupBy({
            by: ['status'],
            where: { authorId: ownerId, deletedAt: null },
            _count: { _all: true },
          }),
          tx.media.aggregate({
            where: { uploadedBy: ownerId },
            _count: { _all: true },
            _sum: { size: true },
          }),
          tx.skill.count(),
          tx.category.count(),
          tx.timeline.groupBy({ by: ['type'], _count: { _all: true } }),
          tx.message.groupBy({ by: ['status'], _count: { _all: true } }),
          tx.project.findMany({
            where: { authorId: ownerId, deletedAt: null },
            orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
            take: 5,
            select: {
              id: true,
              title: true,
              slug: true,
              status: true,
              updatedAt: true,
              category: { select: { name: true } },
            },
          }),
          tx.message.findMany({
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: 5,
            select: {
              id: true,
              name: true,
              email: true,
              subject: true,
              status: true,
              createdAt: true,
            },
          }),
        ]);
        const projects = { total: 0, published: 0, draft: 0, archived: 0 };
        for (const group of projectGroups) {
          projects.total += group._count._all;
          projects[
            group.status.toLowerCase() as 'published' | 'draft' | 'archived'
          ] = group._count._all;
        }
        const messages = { total: 0, unread: 0, read: 0, replied: 0 };
        for (const group of messageGroups) {
          messages.total += group._count._all;
          messages[
            group.status.toLowerCase() as 'unread' | 'read' | 'replied'
          ] = group._count._all;
        }
        return {
          generatedAt: new Date().toISOString(),
          projects,
          messages,
          media: { files: media._count._all, bytes: media._sum.size ?? 0 },
          content: {
            skills,
            categories,
            timelineEntries: timelineGroups.reduce(
              (sum, item) => sum + item._count._all,
              0,
            ),
            credentials: timelineGroups
              .filter(
                (item) =>
                  item.type === 'TRAINING' || item.type === 'CERTIFICATION',
              )
              .reduce((sum, item) => sum + item._count._all, 0),
          },
          recentProjects,
          recentMessages,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
        timeout: 15000,
      },
    );
  }
}
