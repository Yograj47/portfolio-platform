import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';

import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { ImageKitService } from './imagekit.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CreateMediaDto } from './dto/create-media.dto';
import type { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { MediaService } from './media.service';
import { UpdateMediaDto } from './dto/update-media.dto';

@ApiBearerAuth('access-token')
@Controller('media')
@UseGuards(AccessTokenGuard)
export class MediaController {
    constructor(
        private readonly imageKitService: ImageKitService,
        private readonly mediaService: MediaService,
    ) { }

    @Get('upload-auth')
    @HttpCode(HttpStatus.OK)
    getUploadAuthentication() {
        return this.imageKitService
            .getAuthenticationParameters();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ResponseMessage(
        'Media created successfully',
    )
    async create(
        @CurrentUser() user: JwtPayload,
        @Body() dto: CreateMediaDto,
    ) {
        return this.mediaService.create(
            user.sub,
            dto,
        );
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Media fetched successfully')
    async findAll(
        @CurrentUser() user: JwtPayload,
    ) {
        return this.mediaService.findAll(user.sub);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Media fetched successfully')
    async findOne(
        @CurrentUser() user: JwtPayload,
        @Param('id') id: string,
    ) {
        return this.mediaService.findOne(
            id,
            user.sub,
        );
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Media updated successfully')
    async update(
        @CurrentUser() user: JwtPayload,
        @Param('id') id: string,
        @Body() dto: UpdateMediaDto,
    ) {
        return this.mediaService.update(
            id,
            user.sub,
            dto,
        );
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage(
        'Media deleted successfully',
    )
    async remove(
        @Param('id') id: string,
    ) {
        return this.mediaService.remove(id);
    }
}