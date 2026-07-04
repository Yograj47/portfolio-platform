import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class SkillService {

  constructor(private readonly prisma: PrismaService) { }

  create(createSkillDto: CreateSkillDto) {
    return this.prisma.skill.create({
      data: createSkillDto
    })
  }

  findAll() {
    return this.prisma.skill.findMany({
      orderBy: {
        displayOrder: "asc",
      },
    });
  }

  async findOne(id: string) {
    const skill = await this.prisma.skill.findUnique({
      where: { id }
    })

    if (!skill) {
      throw new NotFoundException("Skill not found")
    }

    return skill
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    await this.findOne(id);

    return this.prisma.skill.update({
      where: { id },
      data: updateSkillDto
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.skill.delete({
      where: { id }
    })
  }
}
