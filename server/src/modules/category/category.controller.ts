import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { CategoriesService } from './category.service';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ResponseMessage("Categories fetched successfully")
    async getAll() {
        return this.categoriesService.findAll();
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    @ResponseMessage("Category fetched successfully")
    async getOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.CREATED)
    @ResponseMessage("Category Create successfully")
    async create(@Body() dto: CreateCategoryDto) {
        return this.categoriesService.create(dto);
    }

    @Delete(":id")
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage("Category updated successfully")
    async update(@Param('id') id: string, dto: UpdateCategoryDto) {
        return this.categoriesService.update(id, dto);
    }

    @Delete(":id")
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ResponseMessage("Category deleted successfully")
    async delete(@Param('id') id: string) {
        return this.categoriesService.delete(id);
    }


}
