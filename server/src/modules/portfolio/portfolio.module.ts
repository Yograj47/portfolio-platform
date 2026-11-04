import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { UsersModule } from '../users/users.module';
import { ProjectModule } from '../project/project.module';
import { SkillModule } from '../skill/skill.module';
import { TimelineModule } from '../timeline/timeline.module';
@Module({
  imports: [UsersModule, ProjectModule, SkillModule, TimelineModule],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
