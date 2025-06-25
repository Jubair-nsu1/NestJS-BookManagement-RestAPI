import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Author } from './schemas/author.schema';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<Author>,
  ) {}

  async create(dto: CreateAuthorDto): Promise<Author> {
    const newAuthor = new this.authorModel(dto);
    return newAuthor.save();
  }

  async findAll(params?: { page?: number; limit?: number; search?: string }): Promise<Author[]> {
    const { page = 1, limit = 10, search } = params || {};
    const filter: any = {};

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }

    return this.authorModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<Author> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid author id');
    }

    const author = await this.authorModel.findById(id).exec();
    if (!author) throw new NotFoundException('Author not found');
    return author;
  }

  async update(id: string, dto: UpdateAuthorDto): Promise<Author> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid author id');
    }

    const updatedAuthor = await this.authorModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!updatedAuthor) throw new NotFoundException('Author not found');
    return updatedAuthor;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid author id');
    }

    const result = await this.authorModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Author not found');
  }
}
