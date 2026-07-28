import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class TimelineService {

  constructor(private readonly prisma: PrismaService) { }

  async create(createTimelineDto: CreateTimelineDto) {
    const startDate = new Date(createTimelineDto.startDate);
    const endDate = createTimelineDto.endDate
      ? new Date(createTimelineDto.endDate)
      : undefined;

    return this.prisma.timeline.create({
      data: {
        ...createTimelineDto,
        startDate,
        endDate,
      }
    });
  }

  findAll() {
    return this.prisma.timeline.findMany({
      orderBy: {
        displayOrder: "asc"
      }
    });
  }

  async findOne(id: string) {
    const timeline = await this.prisma.timeline.findUnique({
      where: { id }
    });

    if (!timeline) {
      throw new NotFoundException("Timeline not found");
    }

    return timeline;
  }

  async update(id: string, updateTimelineDto: UpdateTimelineDto) {
    await this.findOne(id);

    const data: any = { ...updateTimelineDto };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);

    return this.prisma.timeline.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.timeline.delete({
      where: { id }
    });
  }
}   