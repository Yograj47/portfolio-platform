import type { PrismaService } from '@/database/prisma/prisma.service';
import type { CategoryService } from '../category/category.service';
import { ProjectService } from './project.service';
import { NotFoundException } from '@nestjs/common';

describe('Project visibility and ownership', () => {
  const prisma = {
    project: { findMany: jest.fn(), findFirst: jest.fn(), update: jest.fn() },
  };
  const service = new ProjectService(
    prisma as unknown as PrismaService,
    {} as CategoryService,
  );
  beforeEach(() => jest.clearAllMocks());
  it('restricts anonymous lists to published projects and safe author fields', async () => {
    await service.findAll();
    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { deletedAt: null, status: 'PUBLISHED' },
        include: expect.objectContaining({
          author: { select: { name: true } },
        }) as unknown,
      }),
    );
  });
  it('restricts direct public lookup to published projects', async () => {
    prisma.project.findFirst.mockResolvedValue(null);
    await expect(service.findOne('draft')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(prisma.project.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'draft', deletedAt: null, status: 'PUBLISHED' },
      }),
    );
  });
  it('limits admin lists to the authenticated author including drafts', async () => {
    await service.findAll('owner');
    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { deletedAt: null, authorId: 'owner' },
      }),
    );
  });
  it('refuses mutation of another author project', async () => {
    prisma.project.findFirst.mockResolvedValue(null);
    await expect(
      service.update('other-project', {}, 'owner'),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.project.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'other-project', deletedAt: null, authorId: 'owner' },
      }),
    );
    expect(prisma.project.update).not.toHaveBeenCalled();
  });
});
