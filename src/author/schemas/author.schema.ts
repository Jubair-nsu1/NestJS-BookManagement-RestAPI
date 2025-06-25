import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Book } from 'src/book/schemas/book.schema';

@Schema({ timestamps: true })
export class Author extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({})
  bio?: string;

  @Prop({ type: Date })
  birthDate?: Date;

  // OneToMany relation: storing Book _ids as an array of ObjectIds
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Book' }] })
  books: Book[];
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
