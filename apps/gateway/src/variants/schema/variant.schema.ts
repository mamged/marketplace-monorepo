import { VariantEntity } from '@commerce/products';
import { ObjectType, PartialType, PickType } from '@nestjs/graphql';

@ObjectType()
export class VariantSchema extends PickType(
  VariantEntity,
  ['price', 'name', 'description', 'type', 'product'],
  ObjectType,
) {}
