import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) { }

  @Post()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage("Skill created successfully")
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillService.create(createSkillDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("Skills fetched successfully")
  findAll() {
    return this.skillService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("Skill fetched successfully")
  findOne(@Param('id') id: string) {
    return this.skillService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("Skill updated successfully")
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("Skill deleted successfully")
  remove(@Param('id') id: string) {
    return this.skillService.remove(id);
  }
}
