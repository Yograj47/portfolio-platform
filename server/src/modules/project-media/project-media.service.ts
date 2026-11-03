import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateProjectMediaDto } from './dto/create-project-media.dto';
import { UpdateProjectMediaDto } from './dto/update-project-media.dto';
@Injectable()
export class ProjectMediaService {
  constructor(private readonly prisma: PrismaService) {}
  private async locked<T>(
    projectId: string,
    userId: string,
    work: (tx: Prisma.TransactionClient) => Promise<T>,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const rows = await tx.$queryRaw<
        { id: string }[]
      >`SELECT "id" FROM "Project" WHERE "id" = ${projectId} AND "authorId" = ${userId} AND "deletedAt" IS NULL FOR UPDATE`;
      if (!rows.length) throw new NotFoundException('Project not found');
      return work(tx);
    });
  }
  private async relation(id: string, userId: string, active = true) {
    const item = await this.prisma.projectMedia.findFirst({
      where: {
        id,
        ...(active ? { isActive: true } : {}),
        project: { authorId: userId, deletedAt: null },
      },
      include: { media: true },
    });
    if (!item) throw new NotFoundException('Project media not found');
    return item;
  }
  async create(userId: string, dto: CreateProjectMediaDto) {
    return this.locked(dto.projectId, userId, async (tx) => {
      if (
        !(await tx.media.findFirst({
          where: { id: dto.mediaId, uploadedBy: userId },
        }))
      )
        throw new NotFoundException('Media not found');
      const where = {
        projectId_mediaId: { projectId: dto.projectId, mediaId: dto.mediaId },
      };
      const existing = await tx.projectMedia.findUnique({ where });
      if (existing?.isActive)
        throw new ConflictException(
          'Media is already attached to this project',
        );
      if (dto.isCover)
        await tx.projectMedia.updateMany({
          where: { projectId: dto.projectId },
          data: { isCover: false },
        });
      const data = {
        isActive: true,
        isCover: dto.isCover ?? false,
        displayOrder: dto.displayOrder ?? 0,
      };
      return tx.projectMedia.upsert({
        where,
        create: { ...data, projectId: dto.projectId, mediaId: dto.mediaId },
        update: data,
        include: { media: true },
      });
    });
  }
  async findAll(projectId: string, userId: string) {
    if (
      !(await this.prisma.project.findFirst({
        where: { id: projectId, authorId: userId, deletedAt: null },
      }))
    )
      throw new NotFoundException('Project not found');
    return this.prisma.projectMedia.findMany({
      where: { projectId, isActive: true },
      include: { media: true },
      orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
    });
  }
  findOne(id: string, userId: string) {
    return this.relation(id, userId);
  }
  async update(id: string, userId: string, dto: UpdateProjectMediaDto) {
    const item = await this.relation(id, userId);
    return this.locked(item.projectId, userId, async (tx) => {
      if (!(await tx.projectMedia.findFirst({ where: { id, isActive: true } })))
        throw new NotFoundException('Project media not found');
      if (dto.isCover)
        await tx.projectMedia.updateMany({
          where: { projectId: item.projectId },
          data: { isCover: false },
        });
      return tx.projectMedia.update({
        where: { id },
        data: { isCover: dto.isCover, displayOrder: dto.displayOrder },
        include: { media: true },
      });
    });
  }
  async restore(id: string, userId: string) {
    const item = await this.relation(id, userId, false);
    return this.locked(item.projectId, userId, async (tx) => {
      const current = await tx.projectMedia.findUnique({ where: { id } });
      if (current?.isActive)
        throw new ConflictException('Project media is already active');
      return tx.projectMedia.update({
        where: { id },
        data: { isActive: true, isCover: false },
        include: { media: true },
      });
    });
  }
  async remove(id: string, userId: string) {
    const item = await this.relation(id, userId);
    return this.locked(item.projectId, userId, (tx) =>
      tx.projectMedia.update({
        where: { id },
        data: { isActive: false, isCover: false },
        include: { media: true },
      }),
    );
  }
}
