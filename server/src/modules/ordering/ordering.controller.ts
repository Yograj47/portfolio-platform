import {
  Body,
  ConflictException,
  Controller,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsString,
} from 'class-validator';
import { PrismaService } from '@/database/prisma/prisma.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { orderedWrite } from '@/common/display-order';

class ReorderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(1000)
  @ArrayUnique()
  @IsString({ each: true })
  ids!: string[];
}

@Controller('ordering')
@UseGuards(AccessTokenGuard)
export class OrderingController {
  constructor(private readonly prisma: PrismaService) {}

  @Patch(':collection')
  reorder(
    @Param('collection') collection: string,
    @CurrentUser() user: JwtPayload,
    @Body() body: ReorderDto,
  ) {
    if (!['projects', 'skills', 'timeline'].includes(collection))
      throw new ConflictException('This list cannot be reordered');
    const scope =
      collection === 'projects' ? `projects:${user.sub}` : collection;
    return orderedWrite(this.prisma, scope, async (tx) => {
      const records =
        collection === 'projects'
          ? await tx.project.findMany({
              where: { authorId: user.sub, deletedAt: null },
              select: { id: true },
            })
          : collection === 'skills'
            ? await tx.skill.findMany({ select: { id: true } })
            : await tx.timeline.findMany({ select: { id: true } });
      const known = new Set(records.map((record) => record.id));
      if (
        known.size !== body.ids.length ||
        body.ids.some((id) => !known.has(id))
      )
        throw new ConflictException(
          'This list changed. Refresh it before reordering.',
        );
      for (const [index, id] of body.ids.entries()) {
        const args = { where: { id }, data: { displayOrder: index + 1 } };
        if (collection === 'projects') await tx.project.update(args);
        else if (collection === 'skills') await tx.skill.update(args);
        else await tx.timeline.update(args);
      }
      return { saved: true };
    });
  }
}
