import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
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
      omit: { passwordHash: true, refreshTokenHash: true },
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
    await this.prisma.user.update({ where: { id }, data });
    return this.getSafeProfile(id);
  }

  async rotateRefreshToken(id: string, previous: string, next: string | null) {
    const result = await this.prisma.user.updateMany({
      where: { id, refreshTokenHash: previous },
      data: { refreshTokenHash: next },
    });
    return result.count === 1;
  }

  async updateRefreshToken(id: string, refreshTokenHash: string | null) {
    return this.prisma.user.update({
      where: { id },
      data: {
        refreshTokenHash,
        ...(refreshTokenHash ? { lastLoginAt: new Date() } : {}),
      },
    });
  }
}
