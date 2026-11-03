import type { PrismaService } from '@/database/prisma/prisma.service';
import { TimelineService } from './timeline.service';
import { BadRequestException } from '@nestjs/common';
describe('Timeline dates', () => {
  const prisma = { timeline: { findUnique: jest.fn(), update: jest.fn() } };
  const service = new TimelineService(prisma as unknown as PrismaService);
  beforeEach(() => {
    jest.clearAllMocks();
    prisma.timeline.findUnique.mockResolvedValue({
      startDate: new Date('2025-01-01'),
      endDate: null,
      current: false,
    });
  });
  it('rejects an invalid partial update against the stored start date', async () => {
    await expect(
      service.update('id', { endDate: '2024-01-01' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.timeline.update).not.toHaveBeenCalled();
  });
  it('clears endDate when switching to current', async () => {
    await service.update('id', { current: true });
    expect(prisma.timeline.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ endDate: null }) as unknown,
      }),
    );
  });
});
