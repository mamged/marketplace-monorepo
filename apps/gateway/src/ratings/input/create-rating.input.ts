import { Field, ObjectType, OmitType, PickType } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { RatingEntity } from '@commerce/products';
import { IsNotEmpty } from 'class-validator';
@InputType()
@ObjectType()
export class CreateRatingInput extends PickType(
  RatingEntity,
  ['description'],
  InputType,
) {
  @IsNotEmpty()
  @Field({ description: 'product id' })
  productId: string;
}
