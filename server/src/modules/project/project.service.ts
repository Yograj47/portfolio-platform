import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CategoryService } from '../category/category.service';
import slugify from "slugify";
import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class ProjectService {

  constructor(private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService
  ) { }

  async create(id: string, dto: CreateProjectDto) {
    await this.categoryService.findOne(dto.categoryId)

    const slug = slugify(dto.title, {
      lower: true,
      trim: true,
      strict: true
    })

    return this.prisma.project.create({
      data: {
        authorId: id,
        slug,
        ...dto
      }
    })

  }

  async findAll() {
    return this.prisma.project.findMany({
      where: {
        deletedAt: null
      },
      orderBy: { displayOrder: 'asc' },
      include: {
        category: true,
        author: true,
      }
    })
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        category: true,
      },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    await this.findOne(id);

    const data = { ...updateProjectDto };

    if (data.categoryId) {
      await this.categoryService.findOne(data.categoryId);
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...updateProjectDto,
        ...(updateProjectDto.title && {
          slug: slugify(updateProjectDto.title, {
            lower: true,
            trim: true,
            strict: true,
          })
        })
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.project.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

  }
}
