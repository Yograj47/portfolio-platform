import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, AccessTokenGuard],
  exports: [CategoryService]
})
export class CategoryModule { }
