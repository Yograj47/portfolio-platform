import {
    Controller,
    Get,
    UseGuards,
} from '@nestjs/common';

import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { ImageKitService } from './imagekit.service';

@Controller('media')
@UseGuards(AccessTokenGuard)
export class MediaController {
    constructor(
        private readonly imageKitService: ImageKitService,
    ) { }

    @Get('upload-auth')
    getUploadAuth() {
        return this.imageKitService.getAuthenticationParameters();
    }
}