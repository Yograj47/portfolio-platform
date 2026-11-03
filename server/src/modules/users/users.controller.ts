import { CvService } from './cv.service';
import { IsIn, IsOptional } from 'class-validator';
import {
  Query,
  Header,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';

import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

class CvQueryDto {
  @IsOptional() @IsIn(['true', 'false']) download?: string;
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cv: CvService,
  ) {}

  @Get('resume')
  @Header('Cache-Control', 'private, no-store')
  resume(@Query() query: CvQueryDto) {
    return this.cv.file(query.download === 'true');
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Profile fetched successfully')
  async profile() {
    return this.usersService.getPublicProfile();
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Profile fetched successfully')
  async me(@CurrentUser() user: JwtPayload) {
    return this.usersService.getSafeProfile(user.sub);
  }

  @Patch('me')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Information updated')
  async update(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfileDto) {
    return this.usersService.update(user.sub, dto);
  }
}
