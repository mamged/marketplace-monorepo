import { ObjectType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsInt,
  IsArray,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
@InputType()
@ObjectType()
export class CreateProduct {
  @Min(1)
  @Max(999)
  @IsNotEmpty()
  @IsInt()
  @Field()
  price: number;

  @MinLength(8)
  @MaxLength(32)
  @IsNotEmpty()
  @Field()
  title: string;
  @MinLength(32)
  @MaxLength(255)
  @IsNotEmpty()
  @Field()
  description: string;
  @IsArray()
  @IsNotEmpty()
  image: string[];
}
