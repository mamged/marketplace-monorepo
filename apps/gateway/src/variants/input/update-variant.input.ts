import {
  Field,
  ObjectType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { CreateVariantInput } from './create-variant.input';
@InputType()
@ObjectType()
export class UpdateVariantInput extends OmitType(CreateVariantInput, ["productId"]) {}
