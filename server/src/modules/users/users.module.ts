import { CvService } from './cv.service';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CvService, AccessTokenGuard],
  exports: [UsersService],
})
export class UsersModule {}
