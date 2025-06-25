import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Book } from './schemas/book.schema';
import { Author } from 'src/author/schemas/author.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) 
      private bookModel: Model<Book>,
    @InjectModel(Author.name) 
      private authorModel: Model<Author>, 
  ) {}

  async create(dto: CreateBookDto): Promise<Book> {
    const { authorId, ...rest } = dto;

    // Validate author exists
    const author = await this.authorModel.findById(authorId).exec();
    if (!author) {
      throw new BadRequestException('Invalid authorId');
    }

    const newBook = new this.bookModel({ ...rest, author: new Types.ObjectId(authorId) });
    return newBook.save();
  }

  async findAll(params?: {
    page?: number;
    limit?: number;
    title?: string;
    isbn?: string;
    authorId?: string;
  }): Promise<Book[]> {
    const { page = 1, limit = 10, title, isbn, authorId } = params || {};
    const filter: any = {};

    if (title) filter.title = { $regex: title, $options: 'i' };
    if (isbn) filter.isbn = { $regex: isbn, $options: 'i' };
    if (authorId) filter.author = new Types.ObjectId(authorId);

    return this.bookModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author')
      .exec();
  }

  async findOne(id: string): Promise<Book> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid book id');
    }

    const book = await this.bookModel.findById(id).populate('author').exec();
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: string, dto: UpdateBookDto): Promise<Book> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid book id');
    }

    const updatedBook = await this.bookModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('author')
      .exec();

    if (!updatedBook) throw new NotFoundException('Book not found');
    return updatedBook;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid book id');
    }

    const result = await this.bookModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Book not found');
  }
}
