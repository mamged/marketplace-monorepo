import { ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ProductEntity } from '@commerce/products';
@InputType()
@ObjectType()
export class UpdateProductInput extends PartialType(PickType(
  ProductEntity,
  ['title', 'image', 'price', 'description'],
  InputType,
)) {}
