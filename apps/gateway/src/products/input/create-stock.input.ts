import { Field, ObjectType, OmitType, PickType } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { StockEntity } from '@commerce/products';
import { IsNotEmpty } from 'class-validator';
@InputType()
// @ObjectType()
export class CreateStockInput extends OmitType(StockEntity, ["id"]){
  @IsNotEmpty()
  @Field()
  product: string;
}
