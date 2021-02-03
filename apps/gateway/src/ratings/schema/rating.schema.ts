import { RatingEntity } from '@commerce/products';
import { ObjectType, PartialType } from '@nestjs/graphql';

@ObjectType()
export class RatingSchema extends PartialType(RatingEntity, ObjectType) {
  // @Field()
  // user: UserSchema
}
