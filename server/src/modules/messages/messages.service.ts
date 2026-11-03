import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import {
  CreateMessageDto,
  MessageQueryDto,
  UpdateMessageDto,
} from './dto/message.dto';
@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateMessageDto) {
    if (dto.website)
      throw new BadRequestException('Message could not be accepted');
    await this.prisma.message.create({
      data: {
        name: dto.name,
        email: dto.email,
        subject: dto.subject || 'Portfolio enquiry',
        message: dto.message,
      },
    });
    return { received: true };
  }
  async findAll(query: MessageQueryDto) {
    const where = { status: query.status };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.message.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.message.count({ where }),
    ]);
    return { items, total, page: query.page, limit: query.limit };
  }
  async findOne(id: string) {
    const item = await this.prisma.message.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Message not found');
    return item;
  }
  async update(id: string, dto: UpdateMessageDto) {
    await this.findOne(id);
    return this.prisma.message.update({ where: { id }, data: dto });
  }
  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.message.delete({ where: { id } });
    return { deleted: true };
  }
}
