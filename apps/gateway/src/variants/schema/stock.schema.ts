import { StockEntity } from '@commerce/products';
import { ObjectType, PartialType } from '@nestjs/graphql';

@ObjectType()
export class StockSchema extends StockEntity {
  // @Field()
  // user: UserSchema
}
