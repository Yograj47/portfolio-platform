import { PrismaService } from '@/database/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getSafeProfile(id: string) {
    const profile = await this.prisma.user.findUnique({
      where: { id },
      omit: { passwordHash: true, refreshTokenHash: true, authVersion: true },
    });
    if (!profile) throw new NotFoundException('User not found');
    return profile;
  }

  async getPublicProfile() {
    const user = await this.prisma.user.findFirst({
      select: {
        name: true,
        email: true,
        avatar: true,
        role: true,
        summary: true,
        phone: true,
        location: true,
        isAvailable: true,
        openToFullTime: true,
        openToOpenSource: true,
        openToFreelance: true,
        githubUrl: true,
        linkedinUrl: true,
        resumeUrl: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Profile not found');
    }

    return user;
  }

  async update(id: string, data: UpdateProfileDto) {
    await this.prisma.$transaction(async (tx) => {
      const update: Prisma.UserUncheckedUpdateInput = { ...data };
      for (const [idKey, urlKey, type] of [
        ['avatarMediaId', 'avatar', 'IMAGE'],
        ['resumeMediaId', 'resumeUrl', 'DOCUMENT'],
      ] as const) {
        if (data[idKey] === undefined && data[urlKey] === undefined) continue;
        let mediaId = data[idKey] ?? null;
        if (!mediaId && data[urlKey]) {
          const candidate = await tx.media.findFirst({
            where: { url: data[urlKey] },
          });
          if (
            candidate &&
            (candidate.uploadedBy !== id || candidate.type !== type)
          )
            throw new BadRequestException(
              `Choose an owned ${type.toLowerCase()} for ${urlKey}`,
            );
          mediaId = candidate?.id ?? null;
        }
        if (mediaId) {
          await tx.$queryRaw`SELECT "id" FROM "Media" WHERE "id" = ${mediaId} FOR UPDATE`;
          const media = await tx.media.findFirst({
            where: { id: mediaId, uploadedBy: id, type },
          });
          if (!media)
            throw new BadRequestException(
              `Choose an owned ${type.toLowerCase()} for ${urlKey}`,
            );
          update[idKey] = media.id;
          update[urlKey] = media.url;
        } else {
          update[idKey] = null;
          update[urlKey] = data[urlKey] ?? null;
        }
      }
      await tx.user.update({ where: { id }, data: update });
    });
    return this.getSafeProfile(id);
  }

  async rotateRefreshToken(id: string, previous: string, next: string | null) {
    const result = await this.prisma.user.updateMany({
      where: { id, refreshTokenHash: previous },
      data: {
        refreshTokenHash: next,
        ...(next === null ? { authVersion: { increment: 1 } } : {}),
      },
    });
    return result.count === 1;
  }

  async beginSession(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        authVersion: { increment: 1 },
        refreshTokenHash: null,
        lastLoginAt: new Date(),
      },
    });
  }

  async updateRefreshToken(
    id: string,
    refreshTokenHash: string,
    version: number,
  ) {
    const result = await this.prisma.user.updateMany({
      where: { id, authVersion: version },
      data: {
        refreshTokenHash,
        ...(refreshTokenHash ? { lastLoginAt: new Date() } : {}),
      },
    });
    return result.count === 1;
  }
}
