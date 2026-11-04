import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CategoryService } from '../category/category.service';
import slugify from 'slugify';
import { PrismaService } from '@/database/prisma/prisma.service';
import { firstAvailableOrder, orderedWrite } from '@/common/display-order';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}

  async create(id: string, dto: CreateProjectDto) {
    await this.categoryService.findOne(dto.categoryId);

    const slug = slugify(dto.title, {
      lower: true,
      trim: true,
      strict: true,
    });

    if (!slug)
      throw new BadRequestException('Title must contain letters or numbers');
    const { skills, ...fields } = dto;
    await this.validateSkills(skills);
    return orderedWrite(this.prisma, `projects:${id}`, async (tx) =>
      tx.project.create({
        data: {
          authorId: id,
          slug,
          ...fields,
          displayOrder: firstAvailableOrder(
            await tx.project.findMany({
              where: { authorId: id, deletedAt: null },
              select: { displayOrder: true },
            }),
          ),
          skills: skills ? { create: skills } : undefined,
        },
      }),
    );
  }

  async findAll(authorId?: string) {
    return this.prisma.project.findMany({
      where: {
        deletedAt: null,
        ...(authorId ? { authorId } : { status: 'PUBLISHED' }),
      },
      orderBy: {
        displayOrder: 'asc',
      },
      include: {
        category: true,
        skills: { include: { skill: true } },
        author: { select: { name: true } },
        media: {
          where: {
            isActive: true,
          },
          orderBy: {
            displayOrder: 'asc',
          },
          include: {
            media: true,
          },
        },
      },
    });
  }

  async findOne(id: string, authorId?: string, bySlug = false) {
    const project = await this.prisma.project.findFirst({
      where: {
        ...(bySlug ? { slug: id } : { id }),
        deletedAt: null,
        ...(authorId ? { authorId } : { status: 'PUBLISHED' }),
      },
      include: {
        category: true,
        skills: { include: { skill: true } },
        media: {
          where: {
            isActive: true,
          },
          orderBy: {
            displayOrder: 'asc',
          },
          include: {
            media: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    authorId: string,
  ) {
    await this.findOne(id, authorId);

    const { skills, ...data } = updateProjectDto;
    await this.validateSkills(skills);

    if (data.categoryId) {
      await this.categoryService.findOne(data.categoryId);
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...data,
        skills: skills ? { deleteMany: {}, create: skills } : undefined,
      },
    });
  }

  private async validateSkills(skills?: { skillId: string }[]) {
    if (
      skills &&
      (await this.prisma.skill.count({
        where: { id: { in: skills.map((item) => item.skillId) } },
      })) !== skills.length
    ) {
      throw new BadRequestException('One or more skills do not exist');
    }
  }

  async remove(id: string, authorId: string) {
    await this.findOne(id, authorId);

    return this.prisma.project.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
