import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { PrismaService } from '@/database/prisma/prisma.service';
import { firstAvailableOrder, orderedWrite } from '@/common/display-order';

@Injectable()
export class TimelineService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTimelineDto: CreateTimelineDto) {
    this.validateDates(createTimelineDto);
    const startDate = createTimelineDto.startDate
      ? new Date(createTimelineDto.startDate)
      : null;
    const endDate = createTimelineDto.endDate
      ? new Date(createTimelineDto.endDate)
      : undefined;

    return orderedWrite(this.prisma, 'timeline', async (tx) =>
      tx.timeline.create({
        data: {
          ...createTimelineDto,
          displayOrder: firstAvailableOrder(
            await tx.timeline.findMany({ select: { displayOrder: true } }),
          ),
          startDate,
          endDate: createTimelineDto.current ? null : endDate,
          expiresAt: createTimelineDto.expiresAt
            ? new Date(createTimelineDto.expiresAt)
            : undefined,
        },
      }),
    );
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
    return orderedWrite(this.prisma, 'timeline', async (tx) => {
      const existing = await tx.timeline.findUnique({ where: { id } });
      if (!existing) throw new NotFoundException('Timeline not found');

      const dates = { ...existing, ...updateTimelineDto };
      this.validateDates(dates);
      return tx.timeline.update({
        where: { id },
        data: {
          ...updateTimelineDto,
          startDate: this.parseOptionalDate(updateTimelineDto.startDate),
          endDate: dates.current
            ? null
            : this.parseOptionalDate(updateTimelineDto.endDate),
          expiresAt: this.parseOptionalDate(updateTimelineDto.expiresAt),
        },
      });
    });
  }

  private parseOptionalDate(value?: string | null) {
    return value ? new Date(value) : value;
  }

  private validateDates(data: {
    startDate?: string | Date | null;
    endDate?: string | Date | null;
    current?: boolean;
    expiresAt?: string | Date | null;
  }) {
    const endDate = data.current ? null : data.endDate;
    if (!data.startDate && !endDate) {
      throw new BadRequestException(
        data.current
          ? 'Start date is required for ongoing entries'
          : 'Enter a start or end date',
      );
    }
    if (
      data.startDate &&
      endDate &&
      new Date(endDate) < new Date(data.startDate)
    ) {
      throw new BadRequestException('End date must be on or after start date');
    }
    const issueDate = endDate ?? data.startDate;
    if (
      data.expiresAt &&
      issueDate &&
      new Date(data.expiresAt) < new Date(issueDate)
    )
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
