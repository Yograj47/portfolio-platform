import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class SkillsService {

  constructor(private readonly prisma: PrismaService) { }

  create(createSkillDto: CreateSkillDto) {
    return this.prisma.skill.create({
      data: createSkillDto
    })
  }

  findAll() {
    return this.prisma.skill.findMany()
  }

  async findOne(id: string) {
    const skill = await this.prisma.skill.findUnique({
      where: { id }
    })

    if (!skill) {
      throw new Error("Skill not found")
    }

    return skill
  }

  update(id: string, updateSkillDto: UpdateSkillDto) {
    return this.prisma.skill.update({
      where: { id },
      data: updateSkillDto
    });
  }

  remove(id: string) {
    return this.prisma.skill.delete({
      where: { id }
    })
  }
}
