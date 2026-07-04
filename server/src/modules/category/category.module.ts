import { Module } from '@nestjs/common';
import { CategoriesController } from './category.controller';
import { CategoriesService } from './category.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, AccessTokenGuard],
  exports: [CategoriesService]
})
export class CategoryModule { }
