import {
  Injectable,
  NotFoundException,
  BadGatewayException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { ImageKitService } from './imagekit.service';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageKitService: ImageKitService,
  ) {}

  async create(userId: string, data: CreateMediaDto) {
    const existing = await this.prisma.media.findUnique({
      where: { publicId: data.publicId },
    });
    if (existing) {
      if (existing.uploadedBy !== userId)
        throw new ConflictException('File is already registered');
      return existing;
    }
    const allowed =
      data.type === 'DOCUMENT'
        ? ['application/pdf']
        : ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'];
    if (!allowed.includes(data.mimeType))
      throw new BadRequestException(
        'Media MIME type does not match an allowed image or PDF document',
      );
    const file = await this.imageKitService.getFile(data.publicId).catch(() => {
      throw new BadGatewayException(
        'Uploaded file could not be verified. Retry saving it to the library.',
      );
    });
    if (
      !file.mime ||
      !allowed.includes(file.mime) ||
      !file.size ||
      file.size > 10485760 ||
      !file.url ||
      !file.name ||
      file.isPrivateFile ||
      file.isPublished === false
    )
      throw new BadRequestException(
        'Choose a public image or PDF up to 10 MB from the configured media provider',
      );
    return this.prisma.media.create({
      data: {
        ...data,
        url: file.url,
        fileName: file.name,
        mimeType: file.mime,
        size: file.size,
        width: file.width ?? null,
        height: file.height ?? null,
        uploadedBy: userId,
      },
    });
  }

  async findAll(userId: string) {
    const media = await this.prisma.media.findMany({
      where: {
        uploadedBy: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        projects: {
          where: {
            isActive: true,
            project: { deletedAt: null, authorId: userId },
          },
          orderBy: {
            displayOrder: 'asc',
          },
          include: {
            project: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
        avatarUsers: { select: { id: true, name: true } },
        resumeUsers: { select: { id: true, name: true } },
      },
    });

    const projectMedia = media.filter((item) => item.projects.length > 0);

    const generalMedia = media.filter((item) => item.projects.length === 0);

    return {
      projectMedia,
      generalMedia,
      total: media.length,
    };
  }

  async findOne(id: string, userId: string) {
    const media = await this.prisma.media.findFirst({
      where: {
        id,
        uploadedBy: userId,
      },
      include: {
        projects: {
          where: {
            isActive: true,
            project: { deletedAt: null, authorId: userId },
          },
          orderBy: {
            displayOrder: 'asc',
          },
          include: {
            project: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
        avatarUsers: { select: { id: true, name: true } },
        resumeUsers: { select: { id: true, name: true } },
      },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return media;
  }

  async update(id: string, userId: string, data: UpdateMediaDto) {
    await this.findOne(id, userId);

    return this.prisma.media.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.$transaction(
      async (tx) => {
        await tx.$queryRaw`SELECT "id" FROM "Media" WHERE "id" = ${id} AND "uploadedBy" = ${userId} FOR UPDATE`;
        const media = await tx.media.findFirst({
          where: { id, uploadedBy: userId },
        });
        if (!media) throw new NotFoundException('Media not found');
        const [projects, profiles] = await Promise.all([
          tx.projectMedia.count({
            where: {
              mediaId: id,
              isActive: true,
              project: { deletedAt: null },
            },
          }),
          tx.user.count({
            where: {
              OR: [
                { avatarMediaId: id },
                { resumeMediaId: id },
                { avatar: media.url },
                { resumeUrl: media.url },
              ],
            },
          }),
        ]);
        if (projects || profiles)
          throw new ConflictException(
            'This file is in use. Detach it from projects and clear its profile usage before deleting.',
          );
        try {
          await this.imageKitService.deleteFile(media.publicId);
        } catch (error: unknown) {
          // A provider file already removed can safely have its stale record cleaned up.
          if (
            !(
              error &&
              typeof error === 'object' &&
              'status' in error &&
              error.status === 404
            )
          )
            throw new BadGatewayException(
              'Media provider deletion failed; the record was kept. Please retry.',
            );
        }
        return tx.media.delete({ where: { id } });
      },
      { timeout: 20000 },
    );
  }
}
