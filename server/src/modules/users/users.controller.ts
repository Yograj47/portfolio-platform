import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Patch, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UsersService } from './users.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';

@Controller('users')
@UseGuards(AccessTokenGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get("me")
    @HttpCode(HttpStatus.OK)
    @ResponseMessage("Profile fetched successfully")
    async me(
        @CurrentUser() user: JwtPayload
    ) {
        return this.usersService.findById(user.sub)
    }

    @Patch("me")
    @HttpCode(HttpStatus.OK)
    @ResponseMessage("Information Update")
    async update(
        @CurrentUser() user: JwtPayload,
        @Body() dto: UpdateProfileDto
    ) {
        return this.usersService.update(user.sub, dto);

    }

}
