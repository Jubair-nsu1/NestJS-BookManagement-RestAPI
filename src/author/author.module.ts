import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorSchema } from './schemas/author.schema';
import { AuthorsService } from './author.service';
import { AuthorsController } from './author.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Author', schema: AuthorSchema }])],
  providers: [AuthorsService],
  controllers: [AuthorsController],
  exports: [AuthorsService], 
})

export class AuthorModule {}