import { VariantEntity } from '@commerce/variants';
import { ObjectType, PartialType } from '@nestjs/graphql';

@ObjectType()
export class VariantSchema extends VariantEntity {
  // @Field()
  // user: UserSchema
}
