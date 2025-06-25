import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BooksService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  createBook(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @Get()
  findAllBooks(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('title') title?: string,
    @Query('isbn') isbn?: string,
    @Query('authorId') authorId?: string,
  ) {
    return this.booksService.findAll({ page, limit, title, isbn, authorId });
  }

  @Get(':id')
  findOneBook(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  updateBook(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.update(id, dto);
  }

  @Delete(':id')
  removeBook(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
