import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { ImageKitService } from './imagekit.service';
import { MediaService } from './media.service';

@Module({
  controllers: [MediaController],
  providers: [ImageKitService, MediaService],
  exports: [ImageKitService, MediaService],
})
export class MediaModule { }