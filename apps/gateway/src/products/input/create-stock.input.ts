import { Field, ObjectType, OmitType, PartialType, PickType } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { StockEntity } from '@commerce/products';
import { IsNotEmpty } from 'class-validator';
@InputType()
// @ObjectType()
export class CreateStockInput extends PartialType(OmitType(StockEntity, ["id", "variant", "product", "created_at", "updated_at"] as const), InputType){
  @IsNotEmpty()
  @Field()
  variantId: string;
}
