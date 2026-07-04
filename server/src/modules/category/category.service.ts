import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from '@/database/prisma/prisma.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {

    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return this.prisma.category.findMany();
    }

    async findOne(id: string) {
        const category = await this.prisma.category.findUnique({
            where: { id }
        });

        if (!category) {
            throw new NotFoundException("Category not found")
        }

        return category
    }

    async create(data: CreateCategoryDto) {
        return this.prisma.category.create({
            data
        });
    }

    async update(id: string, data: UpdateCategoryDto) {
        await this.findOne(id);

        return this.prisma.category.update({
            where: { id },
            data
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        try {
            await this.prisma.category.delete({
                where: { id }
            })
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2003"
            ) {
                throw new BadRequestException("Cannot delete category because it is used by one or more projects or blogs.")
            }

            throw error;
        }
    }
}
