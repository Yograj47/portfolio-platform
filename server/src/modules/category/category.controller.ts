import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { CategoryService } from './category.service';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ResponseMessage("Categories fetched successfully")
    async getAll() {
        return this.categoryService.findAll();
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    @ResponseMessage("Category fetched successfully")
    async getOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.CREATED)
    @ResponseMessage("Category Create successfully")
    async create(@Body() dto: CreateCategoryDto) {
        return this.categoryService.create(dto);
    }

    @Delete(":id")
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage("Category updated successfully")
    async update(@Param('id') id: string, dto: UpdateCategoryDto) {
        return this.categoryService.update(id, dto);
    }

    @Delete(":id")
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage("Category deleted successfully")
    async remove(@Param('id') id: string) {
        return this.categoryService.remove(id);
    }


}
