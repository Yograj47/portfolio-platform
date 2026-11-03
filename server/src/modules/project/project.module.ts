import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { CategoryService } from '../category/category.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, CategoryService, AccessTokenGuard],
  exports: [ProjectService],
})
export class ProjectModule {}
