import {
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

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

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
    async me(
        @CurrentUser() user: JwtPayload
    ) {
        return this.usersService.findById(user.sub);
    }

    @Patch('me')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Information updated')
    async update(
        @CurrentUser() user: JwtPayload,
        @Body() dto: UpdateProfileDto
    ) {
        return this.usersService.update(
            user.sub,
            dto
        );
    }
}