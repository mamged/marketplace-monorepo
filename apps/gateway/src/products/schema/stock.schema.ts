import { StockEntity } from "@commerce/products";
import { ObjectType } from "@nestjs/graphql";

@ObjectType()
export class StockSchema extends StockEntity{
    // @Field()
    // user: UserSchema
}