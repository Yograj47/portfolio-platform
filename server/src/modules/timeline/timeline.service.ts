import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class TimelineService {

  constructor(private readonly prisma: PrismaService) { }

  create(createTimelineDto: CreateTimelineDto) {
    return this.prisma.timeline.create({
      data: createTimelineDto
    })
  }

  findAll() {
    return this.prisma.timeline.findMany({
      orderBy: {
        displayOrder: "asc"
      }
    }
    )
  }

  async findOne(id: string) {
    const timeline = await this.prisma.timeline.findUnique({
      where: { id }
    })


    if (!timeline) {
      throw new NotFoundException("Timeline not found")
    }

    return timeline
  }

  async update(id: string, updateTimelineDto: UpdateTimelineDto) {
    await this.findOne(id);

    return this.prisma.timeline.update({
      where: { id },
      data: updateTimelineDto
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.timeline.delete({
      where: { id }
    })
  }
}
