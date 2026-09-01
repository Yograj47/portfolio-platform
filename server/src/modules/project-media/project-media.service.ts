import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/database/prisma/prisma.service';

import { CreateProjectMediaDto } from './dto/create-project-media.dto';
import { UpdateProjectMediaDto } from './dto/update-project-media.dto';

@Injectable()
export class ProjectMediaService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(userId: string, data: CreateProjectMediaDto) {
        const { projectId, mediaId } = data;

        const project = await this.prisma.project.findFirst({
            where: {
                id: projectId,
                authorId: userId,
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        const media = await this.prisma.media.findFirst({
            where: {
                id: mediaId,
                uploadedBy: userId,
            },
        });

        if (!media) {
            throw new NotFoundException('Media not found');
        }

        const existing = await this.prisma.projectMedia.findUnique({
            where: {
                projectId_mediaId: {
                    projectId,
                    mediaId,
                },
            },
        });

        // Already attached and active
        if (existing?.isActive) {
            throw new ConflictException(
                'Media is already attached to this project',
            );
        }

        // Previously detached → restore the relationship
        if (existing) {
            if (data.isCover) {
                await this.prisma.projectMedia.updateMany({
                    where: {
                        projectId,
                        id: { not: existing.id },
                    },
                    data: {
                        isCover: false,
                    },
                });
            }

            return this.prisma.projectMedia.update({
                where: {
                    id: existing.id,
                },
                data: {
                    isActive: true,
                    displayOrder: data.displayOrder ?? 0,
                    isCover: data.isCover ?? false,
                },
                include: {
                    media: true,
                },
            });
        }

        if (data.isCover) {
            await this.prisma.projectMedia.updateMany({
                where: { projectId },
                data: { isCover: false },
            });
        }

        return this.prisma.projectMedia.create({
            data: {
                projectId,
                mediaId,
                displayOrder: data.displayOrder ?? 0,
                isCover: data.isCover ?? false,
                isActive: true,
            },
            include: {
                media: true,
            },
        });
    }

    async findAll(
        projectId: string,
        userId: string,
    ) {
        const project =
            await this.prisma.project.findFirst({
                where: {
                    id: projectId,
                    authorId: userId,
                },
            });

        if (!project) {
            throw new NotFoundException(
                'Project not found',
            );
        }

        return this.prisma.projectMedia.findMany({
            where: {
                projectId,
                isActive: true,
            },
            include: {
                media: true,
            },
            orderBy: {
                displayOrder: 'asc',
            },
        });
    }

    async findOne(
        id: string,
        userId: string,
    ) {
        const projectMedia = await this.prisma.projectMedia.findFirst({
            where: {
                id,
                isActive: true,
                project: {
                    authorId: userId,
                },
            },
            include: {
                media: true,
            },
        });

        if (!projectMedia) {
            throw new NotFoundException(
                'Project media not found',
            );
        }

        return projectMedia;
    }

    async update(
        id: string,
        userId: string,
        data: UpdateProjectMediaDto,
    ) {
        const existing = await this.findOne(
            id,
            userId,
        );

        if (data.isCover) {
            await this.prisma.projectMedia.updateMany({
                where: {
                    projectId: existing.projectId,
                    id: { not: id },
                },
                data: {
                    isCover: false,
                },
            });
        }

        return this.prisma.projectMedia.update({
            where: { id },
            data: {
                displayOrder: data.displayOrder,
                isCover: data.isCover,
            },
            include: {
                media: true,
            },
        });
    }

    async restore(
        id: string,
        userId: string,
    ) {
        const projectMedia = await this.prisma.projectMedia.findFirst({
            where: {
                id,
                project: {
                    authorId: userId,
                },
            },
        });

        if (!projectMedia) {
            throw new NotFoundException(
                'Project media not found',
            );
        }

        if (projectMedia.isActive) {
            throw new ConflictException(
                'Project media is already active',
            );
        }

        return this.prisma.projectMedia.update({
            where: { id },
            data: {
                isActive: true,
            },
            include: {
                media: true,
            },
        });
    }

    async remove(id: string, userId: string) {
        const projectMedia = await this.findOne(id, userId);

        return this.prisma.projectMedia.update({
            where: { id: projectMedia.id },
            data: {
                isActive: false,
            },
            include: {
                media: true,
            },
        });
    }
}