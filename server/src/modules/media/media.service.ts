import {
    Injectable,
    NotFoundException,
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
    ) { }

    async create(
        userId: string,
        data: CreateMediaDto,
    ) {
        return this.prisma.media.create({
            data: {
                ...data,
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
            },
        });

        const projectMedia = media.filter(
            (item) => item.projects.length > 0,
        );

        const generalMedia = media.filter(
            (item) => item.projects.length === 0,
        );

        return {
            projectMedia,
            generalMedia,
            total: media.length,
        };
    }

    async findOne(
        id: string,
        userId: string,
    ) {
        const media = await this.prisma.media.findFirst({
            where: {
                id,
                uploadedBy: userId,
            },
            include: {
                projects: {
                    where: {
                        isActive: true,
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
            },
        });

        if (!media) {
            throw new NotFoundException(
                'Media not found',
            );
        }

        return media;
    }

    async update(
        id: string,
        userId: string,
        data: UpdateMediaDto,
    ) {
        await this.findOne(id, userId);

        return this.prisma.media.update({
            where: {
                id,
            },
            data,
        });
    }

    async remove(
        id: string,
        userId: string,
    ) {
        const media = await this.findOne(
            id,
            userId,
        );

        // Permanent deletion:
        // remove the actual file from ImageKit first.
        await this.imageKitService.deleteFile(
            media.publicId,
        );

        // Then remove the database record.
        return this.prisma.media.delete({
            where: {
                id,
            },
        });
    }
}