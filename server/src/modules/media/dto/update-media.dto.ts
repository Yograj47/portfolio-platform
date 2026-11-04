import { PartialType, PickType } from '@nestjs/swagger';
import { CreateMediaDto } from './create-media.dto';
export class UpdateMediaDto extends PartialType(
  PickType(CreateMediaDto, ['alt', 'description'] as const),
) {}
