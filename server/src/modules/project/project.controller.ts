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
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import type { JwtPayload } from "@/common/interfaces/jwt-payload.interface";
import { ResponseMessage } from "@/common/decorators/response-message.decorator";

@Controller("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage("Project created successfully")
  create(
    @CurrentUser() user: JwtPayload,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectService.create(user.sub, createProjectDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("Projects fetched successfully")
  findAll() {
    return this.projectService.findAll();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("Project fetched successfully")
  findOne(@Param("id") id: string) {
    return this.projectService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("Project updated successfully")
  update(
    @Param("id") id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("Project deleted successfully")
  remove(@Param("id") id: string) {
    return this.projectService.remove(id);
  }
}