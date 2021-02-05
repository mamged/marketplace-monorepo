import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { ProductEntity } from '@commerce/products';
@InputType()
@ObjectType()
export class CreateProductInput extends PickType(
  ProductEntity,
  ['title', 'image', 'price', 'description'],
  InputType,
) {}
