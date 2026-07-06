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
} from "@nestjs/common";
import { TimelineService } from "./timeline.service";
import { CreateTimelineDto } from "./dto/create-timeline.dto";
import { UpdateTimelineDto } from "./dto/update-timeline.dto";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { ResponseMessage } from "@/common/decorators/response-message.decorator";

@Controller("timelines")
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) { }

  @Post()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage("Timeline created successfully")
  create(@Body() createTimelineDto: CreateTimelineDto) {
    return this.timelineService.create(createTimelineDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("Timelines fetched successfully")
  findAll() {
    return this.timelineService.findAll();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("Timeline fetched successfully")
  findOne(@Param("id") id: string) {
    return this.timelineService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("Timeline updated successfully")
  update(
    @Param("id") id: string,
    @Body() updateTimelineDto: UpdateTimelineDto,
  ) {
    return this.timelineService.update(id, updateTimelineDto);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("Timeline deleted successfully")
  remove(@Param("id") id: string) {
    return this.timelineService.remove(id);
  }
}