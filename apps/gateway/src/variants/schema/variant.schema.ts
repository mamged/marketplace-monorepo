import { VariantEntity } from '@commerce/products';
import { ObjectType, PartialType } from '@nestjs/graphql';

@ObjectType()
export class VariantSchema extends VariantEntity {
  // @Field()
  // user: UserSchema
}
