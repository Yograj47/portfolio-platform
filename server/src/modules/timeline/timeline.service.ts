import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class TimelineService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTimelineDto: CreateTimelineDto) {
    this.validateDates(createTimelineDto);
    const startDate = new Date(createTimelineDto.startDate);
    const endDate = createTimelineDto.endDate
      ? new Date(createTimelineDto.endDate)
      : undefined;

    return this.prisma.timeline.create({
      data: {
        ...createTimelineDto,
        startDate,
        endDate: createTimelineDto.current ? null : endDate,
        expiresAt: createTimelineDto.expiresAt
          ? new Date(createTimelineDto.expiresAt)
          : undefined,
      },
    });
  }

  findAll() {
    return this.prisma.timeline.findMany({
      orderBy: {
        displayOrder: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const timeline = await this.prisma.timeline.findUnique({
      where: { id },
    });

    if (!timeline) {
      throw new NotFoundException('Timeline not found');
    }

    return timeline;
  }

  async update(id: string, updateTimelineDto: UpdateTimelineDto) {
    const existing = await this.findOne(id);
    this.validateDates({ ...existing, ...updateTimelineDto });
    const data = {
      ...updateTimelineDto,
      startDate: updateTimelineDto.startDate
        ? new Date(updateTimelineDto.startDate)
        : undefined,
      endDate: updateTimelineDto.current
        ? null
        : updateTimelineDto.endDate === null
          ? null
          : updateTimelineDto.endDate
            ? new Date(updateTimelineDto.endDate)
            : undefined,
      expiresAt:
        updateTimelineDto.expiresAt === null
          ? null
          : updateTimelineDto.expiresAt
            ? new Date(updateTimelineDto.expiresAt)
            : undefined,
    };

    return this.prisma.timeline.update({
      where: { id },
      data,
    });
  }

  private validateDates(data: {
    startDate: string | Date;
    endDate?: string | Date | null;
    current?: boolean;
    expiresAt?: string | Date | null;
  }) {
    if (
      !data.current &&
      data.endDate &&
      new Date(data.endDate) < new Date(data.startDate)
    ) {
      throw new BadRequestException('End date must be on or after start date');
    }
    if (data.expiresAt && new Date(data.expiresAt) < new Date(data.startDate))
      throw new BadRequestException(
        'Expiry date must be on or after issue/start date',
      );
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.timeline.delete({
      where: { id },
    });
  }
}
