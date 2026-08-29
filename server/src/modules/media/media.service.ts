import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { ImageKitService } from './imagekit.service';
import { UpdateMediaDto } from './dto/update-media.dto';

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
        return this.prisma.media.findMany({
            where: {
                uploadedBy: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: string, userId: string) {
        const media = await this.prisma.media.findFirst({
            where: {
                id,
                uploadedBy: userId,
            },
        });

        if (!media) {
            throw new NotFoundException('Media not found');
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
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        const media =
            await this.prisma.media.findUnique({
                where: { id },
            });

        if (!media) {
            throw new NotFoundException(
                'Media not found',
            );
        }

        // Delete the actual file from ImageKit
        await this.imageKitService.deleteFile(
            media.publicId,
        );

        // Delete our database record
        return this.prisma.media.delete({
            where: { id },
        });
    }
}