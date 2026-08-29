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

import { ApiBearerAuth } from '@nestjs/swagger';

import { AccessTokenGuard } from '../auth/guards/access-token.guard';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';

import type { JwtPayload } from '@/common/interfaces/jwt-payload.interface';

import { ProjectMediaService } from './project-media.service';
import { CreateProjectMediaDto } from './dto/create-project-media.dto';
import { UpdateProjectMediaDto } from './dto/update-project-media.dto';

@ApiBearerAuth('access-token')
@Controller('project-media')
@UseGuards(AccessTokenGuard)
export class ProjectMediaController {
    constructor(
        private readonly projectMediaService: ProjectMediaService,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ResponseMessage(
        'Project media attached successfully',
    )
    async create(
        @CurrentUser() user: JwtPayload,
        @Body() dto: CreateProjectMediaDto,
    ) {
        return this.projectMediaService.create(
            user.sub,
            dto,
        );
    }

    @Get('project/:projectId')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage(
        'Project media fetched successfully',
    )
    async findAll(
        @CurrentUser() user: JwtPayload,
        @Param('projectId') projectId: string,
    ) {
        return this.projectMediaService.findAll(
            projectId,
            user.sub,
        );
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage(
        'Project media fetched successfully',
    )
    async findOne(
        @CurrentUser() user: JwtPayload,
        @Param('id') id: string,
    ) {
        return this.projectMediaService.findOne(
            id,
            user.sub,
        );
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage(
        'Project media updated successfully',
    )
    async update(
        @CurrentUser() user: JwtPayload,
        @Param('id') id: string,
        @Body() dto: UpdateProjectMediaDto,
    ) {
        return this.projectMediaService.update(
            id,
            user.sub,
            dto,
        );
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage(
        'Project media removed successfully',
    )
    async remove(
        @CurrentUser() user: JwtPayload,
        @Param('id') id: string,
    ) {
        return this.projectMediaService.remove(
            id,
            user.sub,
        );
    }
}