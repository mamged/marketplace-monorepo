import { UserSchema } from '@commerce/gateway/users/schema/me.schema';
import { ProductEntity } from '@commerce/products';
import { UserEntity } from '@commerce/users';
import { Field, InputType, ObjectType, OmitType, PartialType } from '@nestjs/graphql';

@ObjectType("ProductSchemaObject")
// @InputType("ProductSchemaInputClass")
export class ProductSchema extends PartialType(ProductEntity) {
  // @Field()
  // user: UserSchema
}
