import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Module({
  controllers: [SkillController],
  providers: [SkillService, AccessTokenGuard],
  exports: [SkillService]
})
export class SkillModule { }
