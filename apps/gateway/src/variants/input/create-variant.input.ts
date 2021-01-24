import { Field, ObjectType, OmitType, PickType } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { VariantEntity } from '@commerce/products';
import { IsNotEmpty } from 'class-validator';
@InputType()
@ObjectType()
export class CreateVariantInput extends PickType(VariantEntity, ["price", "name", "description"], InputType){
  @IsNotEmpty()
  @Field({description: "product id"})
  productId: string;
}
