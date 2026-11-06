import type { PrismaService } from '@/database/prisma/prisma.service';
import { TimelineService } from './timeline.service';
import { BadRequestException } from '@nestjs/common';
describe('Timeline dates', () => {
  const tx = {
    $queryRaw: jest.fn(),
    timeline: { findUnique: jest.fn(), update: jest.fn() },
  };
  const prisma = {
    $transaction: (work: (client: typeof tx) => unknown) => work(tx),
  };
  const service = new TimelineService(prisma as unknown as PrismaService);
  beforeEach(() => {
    jest.clearAllMocks();
    tx.timeline.findUnique.mockResolvedValue({
      startDate: new Date('2025-01-01'),
      endDate: null,
      current: false,
    });
  });
  it('rejects an invalid partial update against the stored start date', async () => {
    await expect(
      service.update('id', { endDate: '2024-01-01' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(tx.timeline.update).not.toHaveBeenCalled();
  });
  it('clears endDate when switching to current', async () => {
    await service.update('id', { current: true });
    expect(tx.timeline.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ endDate: null }) as unknown,
      }),
    );
  });
  it('allows clearing the start date when a completed entry has an end date', async () => {
    await service.update('id', { startDate: null, endDate: '2025-02-01' });
    expect(tx.timeline.update).toHaveBeenCalledWith({
      where: { id: 'id' },
      data: {
        startDate: null,
        endDate: new Date('2025-02-01'),
        expiresAt: undefined,
      },
    });
  });

  it('requires a start date when making an end-only entry ongoing', async () => {
    tx.timeline.findUnique.mockResolvedValue({
      startDate: null,
      endDate: new Date('2025-02-01'),
      current: false,
    });
    await expect(service.update('id', { current: true })).rejects.toThrow(
      'Start date is required for ongoing entries',
    );
  });
});
