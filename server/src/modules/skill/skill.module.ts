import { Module } from '@nestjs/common';
import { SkillsService } from './skill.service';
import { SkillsController } from './skill.controller';

@Module({
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [SkillsService]
})
export class SkillModule { }
