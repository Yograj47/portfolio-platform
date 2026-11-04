import type { PrismaService } from '@/database/prisma/prisma.service';
import { DashboardService } from './dashboard.service';
describe('Dashboard summary', () => {
  function setup(empty = false) {
    const tx = {
      project: {
        groupBy: jest.fn().mockResolvedValue(
          empty
            ? []
            : [
                { status: 'PUBLISHED', _count: { _all: 2 } },
                { status: 'DRAFT', _count: { _all: 1 } },
              ],
        ),
        findMany: jest.fn().mockResolvedValue([]),
      },
      media: {
        aggregate: jest.fn().mockResolvedValue({
          _count: { _all: empty ? 0 : 3 },
          _sum: { size: empty ? null : 4096 },
        }),
      },
      skill: { count: jest.fn().mockResolvedValue(empty ? 0 : 4) },
      category: { count: jest.fn().mockResolvedValue(0) },
      timeline: {
        groupBy: jest.fn().mockResolvedValue(
          empty
            ? []
            : [
                { type: 'TRAINING', _count: { _all: 2 } },
                { type: 'EXPERIENCE', _count: { _all: 1 } },
              ],
        ),
      },
      message: {
        groupBy: jest.fn().mockResolvedValue(
          empty
            ? []
            : [
                { status: 'UNREAD', _count: { _all: 3 } },
                { status: 'REPLIED', _count: { _all: 1 } },
              ],
        ),
        findMany: jest.fn().mockResolvedValue([]),
      },
    };
    const prisma = {
      $transaction: jest.fn((callback: (client: typeof tx) => unknown) =>
        callback(tx),
      ),
    };
    return {
      service: new DashboardService(prisma as unknown as PrismaService),
      tx,
    };
  }
  it('aggregates current records and scopes owned resources', async () => {
    const { service, tx } = setup();
    const result = await service.summary('owner');
    expect(result.projects).toEqual({
      total: 3,
      published: 2,
      draft: 1,
      archived: 0,
    });
    expect(result.messages).toEqual({
      total: 4,
      unread: 3,
      read: 0,
      replied: 1,
    });
    expect(result.media).toEqual({ files: 3, bytes: 4096 });
    expect(result.content).toEqual({
      skills: 4,
      categories: 0,
      timelineEntries: 3,
      credentials: 2,
    });
    expect(tx.project.groupBy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { authorId: 'owner', deletedAt: null },
      }),
    );
    expect(tx.media.aggregate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { uploadedBy: 'owner' } }),
    );
  });
  it('represents an empty database without null usage or invented counts', async () => {
    const { service } = setup(true);
    const result = await service.summary('owner');
    expect(result.projects.total).toBe(0);
    expect(result.messages.total).toBe(0);
    expect(result.media).toEqual({ files: 0, bytes: 0 });
    expect(result.content.credentials).toBe(0);
    expect(result.recentProjects).toEqual([]);
  });
});
