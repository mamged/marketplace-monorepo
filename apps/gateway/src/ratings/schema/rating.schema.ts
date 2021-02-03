import { UserSchema } from '@commerce/gateway/users/schema/me.schema';
import { RatingEntity } from '@commerce/products';
import { PublicUserSchema } from '@commerce/shared';
import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';

@ObjectType()
export class RatingSchema extends PartialType(RatingEntity) {
  @Field({nullable: true})
  user: PublicUserSchema
}
