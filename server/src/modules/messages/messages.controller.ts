import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { MessagesService } from './messages.service';
import {
  CreateMessageDto,
  MessageQueryDto,
  UpdateMessageDto,
} from './dto/message.dto';
@Controller('messages')
export class MessagesController {
  constructor(private readonly service: MessagesService) {}
  @Post() @HttpCode(201) create(@Body() dto: CreateMessageDto) {
    return this.service.create(dto);
  }
  @Get() @UseGuards(AccessTokenGuard) findAll(@Query() query: MessageQueryDto) {
    return this.service.findAll(query);
  }
  @Get(':id') @UseGuards(AccessTokenGuard) findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
  @Patch(':id') @UseGuards(AccessTokenGuard) update(
    @Param('id') id: string,
    @Body() dto: UpdateMessageDto,
  ) {
    return this.service.update(id, dto);
  }
  @Delete(':id') @UseGuards(AccessTokenGuard) remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
