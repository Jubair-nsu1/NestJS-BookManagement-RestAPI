import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Author } from 'src/author/schemas/author.schema';

@Schema({ timestamps: true })
export class Book extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  isbn: string;

  @Prop({ type: Date })
  publishedDate?: Date;

  @Prop()
  genre?: string;

  // ManyToOne equivalent: store Author's _id as a single ObjectId reference
  @Prop({ type: Types.ObjectId, ref: 'Author', required: true })
  author: Author;
}

export const BookSchema = SchemaFactory.createForClass(Book);
