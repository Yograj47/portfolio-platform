import { PartialType, PickType } from '@nestjs/swagger';
import { CreateProjectMediaDto } from './create-project-media.dto';
export class UpdateProjectMediaDto extends PartialType(
  PickType(CreateProjectMediaDto, ['displayOrder', 'isCover'] as const),
  { skipNullProperties: false },
) {}
