import { ObjectType, OmitType, PartialType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsUrl,
  Min,
  Max,
  IsInt,
  isURL,
  IsArray,
  IsEmpty,
  IsOptional,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { CategoryEntity } from '@commerce/products';

@InputType()
export class CategoryRelationsInput {
  @Field((_) => [String])
  children: string[];

  @Field((_) => String)
  parent: string;
}

@InputType()
export class CreateCategoryInput extends PartialType(CategoryRelationsInput) {
  @MinLength(3)
  @MaxLength(32)
  @IsNotEmpty()
  @Field()
  name: string;
}
