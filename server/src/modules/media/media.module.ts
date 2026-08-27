import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { ImageKitService } from './imagekit.service';

@Module({
  controllers: [MediaController],
  providers: [MediaService, ImageKitService]
})
export class MediaModule { }
