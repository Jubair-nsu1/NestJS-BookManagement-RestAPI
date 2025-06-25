import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthorsService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  createAuthor(@Body() dto: CreateAuthorDto) {
    return this.authorsService.create(dto);
  }

  @Get()
  findAllAuthors(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.authorsService.findAll({ page, limit, search });
  }

  @Get(':id')
  findOneAuthor(@Param('id') id: string) {
    return this.authorsService.findOne(id);
  }

  @Patch(':id')
  updateAuthor(@Param('id') id: string, @Body() dto: UpdateAuthorDto) {
    return this.authorsService.update(id, dto);
  }

  @Delete(':id')
  removeAuthor(@Param('id') id: string) {
    return this.authorsService.remove(id);
  }
}
