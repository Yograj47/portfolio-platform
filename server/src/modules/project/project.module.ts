import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { CategoryService } from '../category/category.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RefreshTokenGuard } from '../auth/guards/refresh-token.guard';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, CategoryService, AccessTokenGuard, RefreshTokenGuard],
  exports: [ProjectService]
})
export class ProjectModule { }
