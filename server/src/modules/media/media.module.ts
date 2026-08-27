import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { ImagekitService } from './imagekit.service';

@Module({
  controllers: [MediaController],
  providers: [MediaService, ImagekitService]
})
export class MediaModule { }
