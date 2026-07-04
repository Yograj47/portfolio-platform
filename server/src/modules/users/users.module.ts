import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    AccessTokenGuard],
  exports: [UsersService]
})
export class UsersModule { }
