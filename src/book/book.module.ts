import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksService } from './book.service';
import { BooksController } from './book.controller';
import { BookSchema } from './schemas/book.schema';
import { AuthorSchema } from 'src/author/schemas/author.schema';

@Module({
  //imports: [MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }])],
  imports: [
    MongooseModule.forFeature([
      { name: 'Book', schema: BookSchema },
      { name: 'Author', schema: AuthorSchema }, // ✅ add this
    ]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})

export class BookModule {}