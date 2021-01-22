import { Field, ObjectType, PickType } from "@nestjs/graphql";
import { InputType } from "@nestjs/graphql";
import { StockEntity } from "@commerce/products";
import { IsNotEmpty } from "class-validator";
@InputType()
@ObjectType()
export class CreateStockInput extends PickType(StockEntity, ["title", "status", "description"], InputType){
    @IsNotEmpty()
    @Field()
    product: string;
}
