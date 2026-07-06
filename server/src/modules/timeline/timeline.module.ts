import { Module } from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { TimelineController } from './timeline.controller';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Module({
  controllers: [TimelineController],
  providers: [TimelineService, AccessTokenGuard],
  exports: [TimelineService]
})
export class TimelineModule { }
