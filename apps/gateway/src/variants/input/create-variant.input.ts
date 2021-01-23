import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { VariantEntity } from '@commerce/products';
import { IsNotEmpty } from 'class-validator';
@InputType()
@ObjectType()
export class CreateVariantInput extends VariantEntity{
  @IsNotEmpty()
  @Field()
  variant: string;
}
